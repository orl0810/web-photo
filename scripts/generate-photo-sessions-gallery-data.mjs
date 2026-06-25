import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const FEATURED_DATA_PATH = join(ASSETS_DIR, 'photo-sessions-featured-data.json');
const DIMENSIONS_PATH = join(ASSETS_DIR, 'image-dimensions.json');
const OUTPUT_PATH = join(ASSETS_DIR, 'photo-sessions-gallery-data.json');

const SESSION_FOLDERS = ['home-gallery', 'photo-sessions'];

const DEFAULT_METADATA = {
  title: 'Portrait session in Malta',
  alt: 'Portrait photo session in Malta',
  location: 'Malta'
};

function entryKey(entry) {
  return `${entry.folder}/${entry.file}`;
}

function featuredNumber(file) {
  const match = file.match(/^featured-(\d+)-/);
  return match ? Number(match[1]) : null;
}

const featuredData = JSON.parse(readFileSync(FEATURED_DATA_PATH, 'utf8'));
const dimensions = JSON.parse(readFileSync(DIMENSIONS_PATH, 'utf8'));

const featured = featuredData
  .filter(entry => entry.featuredOrder != null)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

for (const entry of featured) {
  const prefix = featuredNumber(entry.file);
  if (prefix != null && prefix !== entry.featuredOrder) {
    console.warn(
      `featured-NN mismatch: ${entry.file} (prefix ${prefix}) vs featuredOrder ${entry.featuredOrder}`
    );
  }

  if (!dimensions[entry.folder]?.[entry.file]) {
    console.warn(`Missing dimensions for featured ${entry.folder}/${entry.file}`);
  }
}

const featuredKeys = new Set(featured.map(entryKey));
const galleryData = [...featured];
const seenKeys = new Set(featuredKeys);

for (const folder of SESSION_FOLDERS) {
  const files = Object.keys(dimensions[folder] ?? {}).sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const key = `${folder}/${file}`;
    if (seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    galleryData.push({
      folder,
      file,
      ...DEFAULT_METADATA
    });
  }
}

writeFileSync(OUTPUT_PATH, `${JSON.stringify(galleryData, null, 2)}\n`);
console.log(`Wrote ${OUTPUT_PATH} (${galleryData.length} entries: ${featured.length} featured, ${galleryData.length - featured.length} other)`);
