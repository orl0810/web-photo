import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const GALLERY_DATA_PATH = join(ASSETS_DIR, 'photo-sessions-gallery-data.json');
const PATH_MAP_PATH = join(ROOT, 'scripts/photo-sessions-path-map.json');

const FOLDERS = ['home-gallery', 'photo-sessions'];

function stripDecorations(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/[^\w\s&',.-]/gu, '')
    .trim();
}

function slugify(text, maxLength = 55) {
  return stripDecorations(text)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
    .replace(/-$/, '');
}

function locationSlug(location) {
  const city = location.split(',')[0]?.trim() ?? location;
  return slugify(city, 30);
}

function variantBase(fileName) {
  return fileName.slice(0, -extname(fileName).length);
}

function jcmId(fileName) {
  const match = fileName.match(/_?(JCM\d+)/i);
  return match ? match[1].toLowerCase() : slugify(variantBase(fileName), 20);
}

function buildFeaturedEntry(order, folder, oldFile, modelName, location) {
  const modelSlug = slugify(modelName.split(/[\s&]/)[0] || 'portrait');
  const locSlug = locationSlug(location);
  const country = location.toLowerCase().includes('italy') ? 'italy' : 'malta';
  const newFile = `featured-${String(order).padStart(2, '0')}-${modelSlug}-portrait-${locSlug}-${country}.jpg`;
  const title = `${stripDecorations(modelName)} portrait in ${location.split(',')[0]?.trim()}`;
  const alt = `Portrait photo session with ${stripDecorations(modelName)} in ${location}`;

  return { folder, oldFile, newFile, title, alt, location, featuredOrder: order };
}

function buildSessionEntry(folder, oldFile) {
  const id = jcmId(oldFile);
  const newFile = `session-portrait-malta-${id}.jpg`;
  const title = 'Portrait session in Malta';
  const alt = 'Portrait photo session in Malta';

  return { folder, oldFile, newFile, title, alt, location: 'Malta' };
}

function renameAsset(folder, oldFile, newFile) {
  const dir = join(ASSETS_DIR, folder);
  const variantsDir = join(dir, 'variants');
  const oldPath = join(dir, oldFile);
  const newPath = join(dir, newFile);

  if (!existsSync(oldPath)) {
    console.warn(`Skip missing: ${folder}/${oldFile}`);
    return false;
  }

  if (existsSync(newPath)) {
    console.warn(`Already exists: ${folder}/${newFile}`);
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

const dimensions = JSON.parse(readFileSync(join(ASSETS_DIR, 'image-dimensions.json'), 'utf8'));
const legacyMetadata = JSON.parse(readFileSync(join(ASSETS_DIR, 'home-gallery/photo-data.json'), 'utf8'));

const metadataByFile = new Map();
for (const entry of legacyMetadata) {
  const fileName = entry['image-url'].split('/').pop();
  if (fileName) {
    metadataByFile.set(fileName, entry);
  }
}

const galleryData = [];
const pathMap = {};
let featuredOrder = 1;
const usedFeaturedSlugs = new Set();

for (const entry of legacyMetadata) {
  const oldFile = entry['image-url'].split('/').pop();
  if (!oldFile || !dimensions['home-gallery']?.[oldFile]) {
    continue;
  }

  let featured = buildFeaturedEntry(
    featuredOrder,
    'home-gallery',
    oldFile,
    entry['model-name'] ?? 'Portrait',
    entry.location ?? 'Malta'
  );

  while (usedFeaturedSlugs.has(featured.newFile)) {
    featuredOrder++;
    featured = buildFeaturedEntry(
      featuredOrder,
      'home-gallery',
      oldFile,
      `${entry['model-name'] ?? 'Portrait'}-${featuredOrder}`,
      entry.location ?? 'Malta'
    );
  }

  usedFeaturedSlugs.add(featured.newFile);
  galleryData.push({
    folder: featured.folder,
    file: featured.newFile,
    title: featured.title,
    alt: featured.alt,
    location: featured.location,
    featuredOrder: featured.featuredOrder
  });
  pathMap[`home-gallery/${oldFile}`] = `home-gallery/${featured.newFile}`;
  featuredOrder++;
}

for (const folder of FOLDERS) {
  for (const oldFile of Object.keys(dimensions[folder] ?? {})) {
    const key = `${folder}/${oldFile}`;
    if (pathMap[key]) {
      continue;
    }

    const session = buildSessionEntry(folder, oldFile);
    let newFile = session.newFile;
    let suffix = 2;
    while (Object.values(pathMap).includes(`${folder}/${newFile}`)) {
      newFile = `session-portrait-malta-${jcmId(oldFile)}-${suffix}.jpg`;
      suffix++;
    }

    galleryData.push({
      folder,
      file: newFile,
      title: session.title,
      alt: session.alt,
      location: session.location
    });
    pathMap[key] = `${folder}/${newFile}`;
  }
}

writeFileSync(GALLERY_DATA_PATH, `${JSON.stringify(galleryData, null, 2)}\n`);
writeFileSync(PATH_MAP_PATH, `${JSON.stringify(pathMap, null, 2)}\n`);

let renamed = 0;
for (const [oldKey, newKey] of Object.entries(pathMap)) {
  const [folder, oldFile] = oldKey.split('/');
  const newFile = newKey.split('/')[1];
  if (renameAsset(folder, oldFile, newFile)) {
    console.log(`Renamed ${oldKey} -> ${newKey}`);
    renamed++;
  }
}

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
writeFileSync(
  join(ASSETS_DIR, 'home-gallery/photo-data.json'),
  `${JSON.stringify(updatedLegacyMetadata, null, 4)}\n`
);

console.log(`Wrote ${GALLERY_DATA_PATH}`);
console.log(`Wrote ${PATH_MAP_PATH}`);
console.log(`Done. Renamed ${renamed} source image(s).`);
