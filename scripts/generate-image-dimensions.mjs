import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { imageSize } from 'image-size';
import { PORTFOLIO_FOLDERS, VARIANT_WIDTHS } from './portfolio-assets.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const OUTPUT = join(ASSETS_DIR, 'image-dimensions.json');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function isImageFile(name) {
  return IMAGE_EXTENSIONS.has(extname(name).toLowerCase());
}

function minVariantName(fileName) {
  const ext = extname(fileName);
  const base = fileName.slice(0, -ext.length);
  if (base.endsWith('-min')) {
    return null;
  }
  return `${base}-min${ext}`;
}

/** EXIF orientations 5–8 store width/height swapped relative to display. */
function displayDimensions(dimensions) {
  let { width, height, orientation } = dimensions;
  if (orientation && [5, 6, 7, 8].includes(orientation)) {
    [width, height] = [height, width];
  }
  return { width, height };
}

function readVariants(folder, file) {
  const variantsDir = join(ASSETS_DIR, folder, 'variants');
  if (!existsSync(variantsDir)) {
    return undefined;
  }

  const ext = extname(file);
  const base = file.slice(0, -ext.length);
  const variants = {};

  for (const width of VARIANT_WIDTHS) {
    const variantName = `${base}-${width}.webp`;
    if (existsSync(join(variantsDir, variantName))) {
      variants[String(width)] = variantName;
    }
  }

  return Object.keys(variants).length > 0 ? variants : undefined;
}

function scanFolder(folder) {
  const dir = join(ASSETS_DIR, folder);
  const files = readdirSync(dir).filter(isImageFile);
  const fileSet = new Set(files);
  const entries = {};

  for (const file of files) {
    const filePath = join(dir, file);
    const dimensions = imageSize(readFileSync(filePath));

    if (!dimensions.width || !dimensions.height) {
      console.warn(`Skipping ${folder}/${file}: could not read dimensions`);
      continue;
    }

    const { width, height } = displayDimensions(dimensions);
    const minVariant = minVariantName(file);
    const thumbnail = minVariant && fileSet.has(minVariant) ? minVariant : null;
    const variants = readVariants(folder, file);

    entries[file] = {
      width,
      height,
      ...(thumbnail ? { thumbnail } : {}),
      ...(variants ? { variants } : {})
    };
  }

  return entries;
}

const manifest = {};

for (const folder of PORTFOLIO_FOLDERS) {
  manifest[folder] = scanFolder(folder);
}

writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${OUTPUT}`);
