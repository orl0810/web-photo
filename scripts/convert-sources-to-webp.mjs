import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { imageSize } from 'image-size';
import { WEBP_QUALITY } from './portfolio-assets.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS_DIR = join(ROOT, 'src/assets');
const JPG_EXTENSIONS = new Set(['.jpg', '.jpeg']);

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

function convertFolder(cwebp, folder) {
  const dir = join(ASSETS_DIR, folder);
  const jpgFiles = readdirSync(dir).filter(name => JPG_EXTENSIONS.has(extname(name).toLowerCase()));
  let converted = 0;
  let skipped = 0;

  for (const file of jpgFiles) {
    const inputPath = join(dir, file);
    const base = file.slice(0, -extname(file).length);
    const outputPath = join(dir, `${base}.webp`);

    if (existsSync(outputPath)) {
      console.log(`Skipping ${folder}/${file}: ${base}.webp already exists`);
      skipped++;
      continue;
    }

    const dimensions = imageSize(readFileSync(inputPath));
    const { path: orientedPath, cleanup } = resolveInputPath(inputPath, dimensions);

    try {
      execFileSync(cwebp, ['-q', String(WEBP_QUALITY), orientedPath, '-o', outputPath], { stdio: 'pipe' });
      unlinkSync(inputPath);
      converted++;
      console.log(`Converted ${folder}/${file} → ${base}.webp`);
    } finally {
      cleanup?.();
    }
  }

  return { converted, skipped };
}

const folder = process.argv[2];

if (!folder) {
  console.error('Usage: node scripts/convert-sources-to-webp.mjs <folder>');
  console.error('Example: node scripts/convert-sources-to-webp.mjs home-gallery');
  process.exit(1);
}

const dir = join(ASSETS_DIR, folder);
if (!existsSync(dir)) {
  console.error(`Folder not found: ${dir}`);
  process.exit(1);
}

const cwebp = resolveCwebp();
console.log(`Using ${cwebp} (quality ${WEBP_QUALITY})`);

const { converted, skipped } = convertFolder(cwebp, folder);
console.log(`Done. Converted ${converted} file(s), skipped ${skipped} existing WebP(s).`);
