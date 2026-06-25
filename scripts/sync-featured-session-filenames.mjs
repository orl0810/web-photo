import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const FEATURED_DATA_PATH = join(ASSETS_DIR, 'photo-sessions-featured-data.json');
const PHOTO_DATA_PATH = join(ASSETS_DIR, 'home-gallery/photo-data.json');
const PATH_MAP_PATH = join(ROOT, 'scripts/photo-sessions-path-map.json');

const FEATURED_RENAMES = [
  ['featured-01-antonella-portrait-sliema-malta.webp', 'featured-10-antonella-portrait-sliema-malta.webp'],
  ['featured-02-emilya-portrait-dingli-malta.webp', 'featured-11-emilya-portrait-dingli-malta.webp'],
  ['featured-05-martina-portrait-st-julians-malta.webp', 'featured-12-martina-portrait-st-julians-malta.webp'],
  ['featured-06-excelencia-portrait-sliema-malta.webp', 'featured-13-excelencia-portrait-sliema-malta.webp'],
  ['featured-07-aru-portrait-valletta-malta.webp', 'featured-14-aru-portrait-valletta-malta.webp'],
  ['featured-08-brihanna-portrait-st-julians-malta.webp', 'featured-15-brihanna-portrait-st-julians-malta.webp'],
  ['featured-09-andrea-portrait-golden-bay-malta.webp', 'featured-16-andrea-portrait-golden-bay-malta.webp'],
  ['featured-10-sofia-portrait-birgu-malta.webp', 'featured-17-sofia-portrait-birgu-malta.webp'],
  ['featured-11-masha-portrait-sliema-malta.webp', 'featured-18-masha-portrait-sliema-malta.webp'],
  ['featured-12-sofia-portrait-sliema-malta.webp', 'featured-19-sofia-portrait-sliema-malta.webp'],
  ['featured-13-uchenna-portrait-valletta-malta.webp', 'featured-20-uchenna-portrait-valletta-malta.webp'],
  ['featured-14-jessica-portrait-marsaskala-malta.webp', 'featured-21-jessica-portrait-marsaskala-malta.webp'],
  ['featured-15-shir-portrait-luqa-malta.webp', 'featured-22-shir-portrait-luqa-malta.webp'],
  ['featured-16-jelena-portrait-valletta-malta.webp', 'featured-23-jelena-portrait-valletta-malta.webp'],
  ['featured-17-maria-portrait-sliema-malta.webp', 'featured-24-maria-portrait-sliema-malta.webp'],
  ['featured-18-paulina-portrait-valletta-malta.webp', 'featured-25-paulina-portrait-valletta-malta.webp']
];

const DEMOTED_RENAMES = [
  ['featured-03-madalina-portrait-valletta-malta.webp', 'session-portrait-malta-jcm3651.webp'],
  ['featured-04-santiago-portrait-rome-italy.webp', 'session-portrait-malta-jcm8916.webp']
];

function variantBase(fileName) {
  return fileName.slice(0, -extname(fileName).length);
}

function renameAsset(folder, oldFile, newFile) {
  const dir = join(ASSETS_DIR, folder);
  const variantsDir = join(dir, 'variants');
  const oldPath = join(dir, oldFile);
  const newPath = join(dir, newFile);

  if (existsSync(newPath)) {
    return false;
  }

  if (!existsSync(oldPath)) {
    console.warn(`Skip missing: ${folder}/${oldFile}`);
    return false;
  }

  renameSync(oldPath, newPath);

  const oldBase = variantBase(oldFile);
  const newBase = variantBase(newFile);

  for (const width of [400, 1200]) {
    const oldVariant = join(variantsDir, `${oldBase}-${width}.webp`);
    const newVariant = join(variantsDir, `${newBase}-${width}.webp`);
    if (existsSync(oldVariant) && !existsSync(newVariant)) {
      renameSync(oldVariant, newVariant);
    }
  }

  return true;
}

function twoPhaseRename(folder, renames) {
  const pending = renames.filter(([oldFile, newFile]) => {
    const dir = join(ASSETS_DIR, folder);
    if (existsSync(join(dir, newFile))) {
      return false;
    }
    return existsSync(join(dir, oldFile));
  });

  if (pending.length === 0) {
    return 0;
  }

  const tempMap = new Map();
  for (const [oldFile, newFile] of pending) {
    const tempFile = `__sync-temp-${variantBase(newFile)}${extname(newFile)}`;
    if (renameAsset(folder, oldFile, tempFile)) {
      tempMap.set(tempFile, newFile);
      console.log(`Renamed ${folder}/${oldFile} -> ${folder}/${tempFile} (temp)`);
    }
  }

  let count = tempMap.size;
  for (const [tempFile, newFile] of tempMap) {
    if (renameAsset(folder, tempFile, newFile)) {
      console.log(`Renamed ${folder}/${tempFile} -> ${folder}/${newFile}`);
    }
  }

  return count;
}

const pathMap = {};
let renamed = 0;

renamed += twoPhaseRename('home-gallery', FEATURED_RENAMES);
renamed += twoPhaseRename('home-gallery', DEMOTED_RENAMES);

for (const [oldFile, newFile] of [...FEATURED_RENAMES, ...DEMOTED_RENAMES]) {
  pathMap[`home-gallery/${oldFile}`] = `home-gallery/${newFile}`;
}

writeFileSync(PATH_MAP_PATH, `${JSON.stringify(pathMap, null, 2)}\n`);

const legacyMetadata = JSON.parse(readFileSync(PHOTO_DATA_PATH, 'utf8'));
const updatedLegacyMetadata = legacyMetadata.map(entry => {
  const oldFile = entry['image-url'].split('/').pop();
  const mapped = pathMap[`home-gallery/${oldFile}`];
  if (!mapped) {
    return entry;
  }
  return {
    ...entry,
    'image-url': `assets/${mapped}`
  };
});
writeFileSync(PHOTO_DATA_PATH, `${JSON.stringify(updatedLegacyMetadata, null, 4)}\n`);

const featuredData = JSON.parse(readFileSync(FEATURED_DATA_PATH, 'utf8'));
for (const entry of featuredData) {
  if (entry.featuredOrder == null || entry.featuredOrder < 10) {
    continue;
  }
  const match = entry.file.match(/^featured-(\d+)-/);
  if (match && Number(match[1]) !== entry.featuredOrder) {
    console.warn(
      `Mismatch in featured manifest: ${entry.file} has prefix ${match[1]} but featuredOrder is ${entry.featuredOrder}`
    );
  }
}

console.log(`Wrote ${PATH_MAP_PATH}`);
console.log(`Updated ${PHOTO_DATA_PATH}`);
console.log(`Done. Renamed ${renamed} source image(s).`);
