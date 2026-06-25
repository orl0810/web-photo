import { existsSync, readFileSync, renameSync, readdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const EVENTS_DIR = join(ROOT, 'src/assets/events');
const VARIANTS_DIR = join(EVENTS_DIR, 'variants');
const EVENTS_DATA_PATH = join(EVENTS_DIR, 'events-photo-data.json');
const PATH_MAP_PATH = join(ROOT, 'scripts/events-path-map.json');
const SRC_DIR = join(ROOT, 'src');

/** Optional title/alt overrides keyed by old filename. */
const METADATA_OVERRIDES = {
  '_JCM0016.webp': {
    title: 'Esme Bachata Concert',
    alt: 'Live performance at the Esme Bachata Concert in Malta',
    location: 'Malta'
  },
  '_JCM2384.webp': {
    title: 'Malta Fusion Weekend',
    alt: 'Dancers at Malta Fusion Weekend social dance event',
    location: 'Malta'
  },
  '_JCM2742.webp': {
    title: 'Corporate content session',
    alt: 'Professional corporate event content photography in Malta',
    location: 'Malta'
  },
  '_JCM3366.webp': {
    title: 'Sigma World with 1XBet',
    alt: 'Sigma World corporate event with 1XBet branding in Malta',
    location: 'Malta'
  },
  '_JCM6821.webp': {
    title: 'Corporate event in Malta',
    alt: 'Professional corporate event photography coverage in Malta',
    location: 'Malta'
  }
};

function variantBase(fileName) {
  return fileName.slice(0, -extname(fileName).length);
}

function jcmId(fileName) {
  const match = fileName.match(/_?(JCM\d+)/i);
  return match ? match[1].toLowerCase() : null;
}

function buildEventFileName(oldFile) {
  const id = jcmId(oldFile);
  if (!id) {
    throw new Error(`Cannot derive JCM id from ${oldFile}`);
  }
  return `event-malta-${id}.webp`;
}

function renameIfExists(from, to) {
  if (!existsSync(from)) {
    return false;
  }
  if (existsSync(to)) {
    console.warn(`Already exists: ${to}`);
    return false;
  }
  renameSync(from, to);
  return true;
}

function renameAsset(oldFile, newFile) {
  if (!renameIfExists(join(EVENTS_DIR, oldFile), join(EVENTS_DIR, newFile))) {
    return false;
  }

  const oldBase = variantBase(oldFile);
  const newBase = variantBase(newFile);

  for (const width of [400, 1200]) {
    renameIfExists(
      join(VARIANTS_DIR, `${oldBase}-${width}.webp`),
      join(VARIANTS_DIR, `${newBase}-${width}.webp`)
    );
  }

  return true;
}

function walkFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
    } else if (/\.(ts|html|json|md|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function updateSourceReferences(pathMap) {
  const replacements = [];

  for (const [oldFile, newFile] of Object.entries(pathMap)) {
    replacements.push([oldFile, newFile]);
    replacements.push([variantBase(oldFile), variantBase(newFile)]);
  }

  replacements.sort((a, b) => b[0].length - a[0].length);

  let updatedFiles = 0;
  for (const filePath of walkFiles(SRC_DIR)) {
    if (filePath.includes('image-dimensions.json')) {
      continue;
    }

    let content = readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }

    if (changed) {
      writeFileSync(filePath, content);
      updatedFiles++;
      console.log(`Updated references in ${filePath.replace(`${ROOT}/`, '')}`);
    }
  }

  return updatedFiles;
}

const oldFiles = readdirSync(EVENTS_DIR)
  .filter(name => /^_JCM\d+\.webp$/i.test(name))
  .sort((a, b) => a.localeCompare(b));

if (oldFiles.length === 0) {
  console.log('No _JCM event photos to rename.');
  process.exit(0);
}

const pathMap = {};
const newMetadataEntries = [];

for (const oldFile of oldFiles) {
  const newFile = buildEventFileName(oldFile);
  pathMap[oldFile] = newFile;

  const override = METADATA_OVERRIDES[oldFile];
  newMetadataEntries.push({
    file: newFile,
    title: override?.title ?? 'Event photography in Malta',
    alt: override?.alt ?? 'Professional event photo coverage in Malta',
    location: override?.location ?? 'Malta'
  });
}

writeFileSync(PATH_MAP_PATH, `${JSON.stringify(pathMap, null, 2)}\n`);

let renamed = 0;
for (const [oldFile, newFile] of Object.entries(pathMap)) {
  if (renameAsset(oldFile, newFile)) {
    console.log(`Renamed ${oldFile} -> ${newFile}`);
    renamed++;
  }
}

const existingMetadata = JSON.parse(readFileSync(EVENTS_DATA_PATH, 'utf8'));
const featuredFiles = new Set(existingMetadata.map(entry => entry.file));
const mergedMetadata = [
  ...existingMetadata,
  ...newMetadataEntries.filter(entry => !featuredFiles.has(entry.file))
];
writeFileSync(EVENTS_DATA_PATH, `${JSON.stringify(mergedMetadata, null, 2)}\n`);

const updatedFiles = updateSourceReferences(pathMap);

execFileSync('node', ['scripts/generate-image-dimensions.mjs'], { cwd: ROOT, stdio: 'inherit' });

console.log(`Wrote ${PATH_MAP_PATH}`);
console.log(`Updated ${mergedMetadata.length - existingMetadata.length} metadata entries in events-photo-data.json`);
console.log(`Updated ${updatedFiles} source file(s).`);
console.log(`Done. Renamed ${renamed} source image(s).`);
