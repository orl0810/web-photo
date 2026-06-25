import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { imageSize } from 'image-size';
import { PORTFOLIO_FOLDERS, VARIANT_WIDTHS, WEBP_QUALITY } from './portfolio-assets.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function resolveCwebp() {
  const candidates = [
    process.env.CWEBP_PATH,
    'cwebp',
    '/opt/homebrew/bin/cwebp',
    '/usr/local/bin/cwebp'
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ['-version'], { stdio: 'pipe' });
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(
    'cwebp not found. Install libwebp (e.g. brew install webp) and ensure cwebp is on your PATH.'
  );
}

function isSourceImage(name) {
  return SOURCE_EXTENSIONS.has(extname(name).toLowerCase());
}

function variantFileName(sourceFile, targetWidth) {
  const ext = extname(sourceFile);
  const base = sourceFile.slice(0, -ext.length);
  return `${base}-${targetWidth}.webp`;
}

function displayDimensions(dimensions) {
  let { width, height, orientation } = dimensions;
  if (orientation && [5, 6, 7, 8].includes(orientation)) {
    [width, height] = [height, width];
  }
  return { width, height };
}

function resolveInputPath(inputPath, dimensions) {
  if (!dimensions.orientation || dimensions.orientation === 1) {
    return { path: inputPath, cleanup: null };
  }

  const tempPath = join(tmpdir(), `webp-orient-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  execFileSync('magick', [inputPath, '-auto-orient', tempPath], { stdio: 'pipe' });
  return {
    path: tempPath,
    cleanup: () => {
      if (existsSync(tempPath)) {
        unlinkSync(tempPath);
      }
    }
  };
}

function encodeVariant(cwebp, inputPath, outputPath, targetWidth, sourceWidth) {
  const args =
    sourceWidth > targetWidth
      ? ['-q', String(WEBP_QUALITY), '-resize', String(targetWidth), '0', inputPath, '-o', outputPath]
      : ['-q', String(WEBP_QUALITY), inputPath, '-o', outputPath];

  execFileSync(cwebp, args, { stdio: 'pipe' });
}

function processFolder(cwebp, folder, { skipExisting }) {
  const dir = join(ASSETS_DIR, folder);
  const variantsDir = join(dir, 'variants');
  const sources = readdirSync(dir).filter(isSourceImage);
  let created = 0;
  let skipped = 0;

  mkdirSync(variantsDir, { recursive: true });

  for (const file of sources) {
    const inputPath = join(dir, file);
    const dimensions = imageSize(readFileSync(inputPath));

    if (!dimensions.width || !dimensions.height) {
      console.warn(`Skipping ${folder}/${file}: could not read dimensions`);
      continue;
    }

    const { width: sourceWidth } = displayDimensions(dimensions);
    const { path: orientedPath, cleanup } = resolveInputPath(inputPath, dimensions);

    try {
      for (const targetWidth of VARIANT_WIDTHS) {
        const outputName = variantFileName(file, targetWidth);
        const outputPath = join(variantsDir, outputName);

        if (skipExisting && existsSync(outputPath)) {
          skipped++;
          continue;
        }

        encodeVariant(cwebp, orientedPath, outputPath, targetWidth, sourceWidth);
        created++;
        console.log(`Created ${folder}/variants/${outputName}`);
      }
    } finally {
      cleanup?.();
    }
  }

  return { created, skipped };
}

const skipExisting = process.argv.includes('--skip-existing');
const cwebp = resolveCwebp();
let totalCreated = 0;
let totalSkipped = 0;

console.log(`Using ${cwebp} (quality ${WEBP_QUALITY}, widths ${VARIANT_WIDTHS.join(', ')})`);

for (const folder of PORTFOLIO_FOLDERS) {
  const { created, skipped } = processFolder(cwebp, folder, { skipExisting });
  totalCreated += created;
  totalSkipped += skipped;
}

console.log(`Done. Created ${totalCreated} variant(s), skipped ${totalSkipped} existing file(s).`);
