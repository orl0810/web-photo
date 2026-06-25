import { existsSync, renameSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const EVENTS_DIR = join(ROOT, 'src/assets/events');
const VARIANTS_DIR = join(EVENTS_DIR, 'variants');

const RENAMES = [
  ['_JCM2461.jpg', 'featured-01-1x-promotional-model-trade-show-booth.jpg'],
  ['_JCM2532.jpg', 'featured-02-1x-affiliates-corporate-event-booth.jpg'],
  ['_JCM0046.jpg', 'featured-03-sbc-summit-malta-networking.jpg'],
  ['_JCM0146.jpg', 'featured-04-social-dance-salsa-event.jpg'],
  ['_JCM0438.jpg', 'featured-05-bachata-social-dance-night.jpg'],
  ['_JCM2118.jpg', 'featured-06-1x-illuminated-event-booth-signage.jpg'],
  ['_JCM2189.jpg', 'featured-07-branded-cocktail-garnishes-event-catering.jpg'],
  ['_JCM2205.jpg', 'featured-08-mixologist-cocktail-corporate-event.jpg'],
  ['_JCM2446.jpg', 'featured-09-igniite-ai-annual-day-award-ceremony.jpg'],
  ['_JCM6999.jpg', 'featured-10-corporate-celebration-dancing-guests.jpg'],
  ['_JCM7952.jpg', 'featured-11-formal-wedding-table-setting.jpg'],
  ['_JCM8871.jpg', 'featured-12-elite-moment-awards-winners.jpg'],
  ['_JCM9094.jpg', 'featured-13-elite-moment-trophy-celebration.jpg'],
  ['_JCM9391.jpg', 'featured-14-corporate-awards-presentation.jpg']
];

function renameIfExists(from, to) {
  if (!existsSync(from)) {
    console.warn(`Skip missing: ${from}`);
    return false;
  }
  if (existsSync(to)) {
    console.warn(`Already exists: ${to}`);
    return false;
  }
  renameSync(from, to);
  return true;
}

function variantBase(fileName) {
  return fileName.slice(0, -extname(fileName).length);
}

let renamed = 0;

for (const [oldFile, newFile] of RENAMES) {
  const oldBase = variantBase(oldFile);
  const newBase = variantBase(newFile);

  if (renameIfExists(join(EVENTS_DIR, oldFile), join(EVENTS_DIR, newFile))) {
    console.log(`Renamed ${oldFile} -> ${newFile}`);
    renamed++;
  }

  for (const width of [400, 1200]) {
    const oldVariant = join(VARIANTS_DIR, `${oldBase}-${width}.webp`);
    const newVariant = join(VARIANTS_DIR, `${newBase}-${width}.webp`);
    if (renameIfExists(oldVariant, newVariant)) {
      console.log(`Renamed variants/${oldBase}-${width}.webp -> ${newBase}-${width}.webp`);
    }
  }
}

console.log(`Done. Renamed ${renamed} source image(s).`);
