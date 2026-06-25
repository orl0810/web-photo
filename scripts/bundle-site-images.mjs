import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { WEBP_QUALITY } from './portfolio-assets.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST_ASSETS = join(ROOT, 'dist/orlando-photo-web/browser/assets');
const SITE_DIR = join(ROOT, 'src/assets/site');
const GIT_COMMIT = 'a6c2b720a7f5dfbb1f648f68c02f8504d0d69217';

/** @type {Array<{ siteName: string, source: { type: 'dist' | 'assets' | 'git', path: string } }>} */
const SITE_IMAGES = [
  { siteName: 'portada.webp', source: { type: 'assets', path: 'Portada.jpg' } },
  { siteName: 'session-featured-02.webp', source: { type: 'dist', path: 'home-gallery/featured-02-session-portrait-malta.webp' } },
  { siteName: 'session-featured-07.webp', source: { type: 'dist', path: 'home-gallery/featured-07-session-portrait-malta.webp' } },
  { siteName: 'session-jcm0693.webp', source: { type: 'git', path: 'src/assets/home-gallery/_JCM0693.jpg' } },
  { siteName: 'session-featured-13-excelencia.webp', source: { type: 'dist', path: 'home-gallery/featured-13-excelencia-portrait-sliema-malta.webp' } },
  { siteName: 'session-jcm1855.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm1855.webp' } },
  { siteName: 'session-featured-20-uchenna.webp', source: { type: 'dist', path: 'home-gallery/featured-20-uchenna-portrait-valletta-malta.webp' } },
  { siteName: 'session-jcm3136.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm3136.webp' } },
  { siteName: 'session-jcm0700.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm0700.webp' } },
  { siteName: 'session-featured-14-aru.webp', source: { type: 'dist', path: 'home-gallery/featured-14-aru-portrait-valletta-malta.webp' } },
  { siteName: 'session-jcm6693.webp', source: { type: 'git', path: 'src/assets/home-gallery/_JCM6693.jpg' } },
  { siteName: 'session-featured-03.webp', source: { type: 'dist', path: 'home-gallery/featured-03-session-portrait-malta.webp' } },
  { siteName: 'session-jcm8820.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm8820.webp' } },
  { siteName: 'session-featured-21-jessica.webp', source: { type: 'dist', path: 'home-gallery/featured-21-jessica-portrait-marsaskala-malta.webp' } },
  { siteName: 'event-jcm2742.webp', source: { type: 'dist', path: 'events/event-malta-jcm2742.webp' } },
  { siteName: 'session-jcm3882.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm3882.webp' } },
  { siteName: 'session-jcm1432.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm1432.webp' } },
  { siteName: 'session-jcm0849.webp', source: { type: 'assets', path: 'content/_JCM0849.jpg' } },
  { siteName: 'session-featured-12-martina.webp', source: { type: 'dist', path: 'home-gallery/featured-12-martina-portrait-st-julians-malta.webp' } },
  { siteName: 'session-jcm5969.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm5969.webp' } },
  { siteName: 'session-jcm9760.webp', source: { type: 'dist', path: 'home-gallery/session-portrait-malta-jcm9760.webp' } },
  { siteName: 'event-jcm0016.webp', source: { type: 'dist', path: 'events/event-malta-jcm0016.webp' } },
  { siteName: 'event-jcm3366.webp', source: { type: 'dist', path: 'events/event-malta-jcm3366.webp' } },
  { siteName: 'event-jcm6821.webp', source: { type: 'dist', path: 'events/event-malta-jcm6821.webp' } },
  { siteName: 'event-jcm2384.webp', source: { type: 'dist', path: 'events/event-malta-jcm2384.webp' } },
];

function resolveCwebp() {
  const candidates = [
    process.env.CWEBP_PATH,
    'cwebp',
    '/opt/homebrew/bin/cwebp',
    '/usr/local/bin/cwebp',
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
    'cwebp not found. Install libwebp (e.g. brew install webp) and ensure cwebp is on your PATH.',
  );
}

function resolveSourcePath(source) {
  if (source.type === 'dist') {
    return join(DIST_ASSETS, source.path);
  }

  if (source.type === 'assets') {
    return join(ROOT, 'src/assets', source.path);
  }

  const gitPath = execFileSync('git', ['show', `${GIT_COMMIT}:${source.path}`], {
    cwd: ROOT,
    encoding: 'buffer',
    maxBuffer: 50 * 1024 * 1024,
  });
  const tempPath = join(SITE_DIR, `.tmp-${source.path.split('/').pop()}`);
  writeFileSync(tempPath, gitPath);
  return tempPath;
}

function convertToWebp(cwebp, inputPath, outputPath) {
  execFileSync(cwebp, ['-q', String(WEBP_QUALITY), inputPath, '-o', outputPath], { stdio: 'pipe' });
}

function copyOrConvert(cwebp, entry) {
  const sourcePath = resolveSourcePath(entry.source);
  const outputPath = join(SITE_DIR, entry.siteName);

  if (!existsSync(sourcePath)) {
    throw new Error(`Source not found for ${entry.siteName}: ${sourcePath}`);
  }

  const ext = extname(sourcePath).toLowerCase();
  if (ext === '.webp') {
    copyFileSync(sourcePath, outputPath);
    console.log(`Copied → ${entry.siteName}`);
    return;
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    convertToWebp(cwebp, sourcePath, outputPath);
    if (sourcePath.includes('.tmp-')) {
      unlinkSync(sourcePath);
    }
    console.log(`Converted → ${entry.siteName}`);
    return;
  }

  throw new Error(`Unsupported source format for ${entry.siteName}: ${ext}`);
}

function main() {
  mkdirSync(SITE_DIR, { recursive: true });
  const cwebp = resolveCwebp();
  const manifest = {};

  for (const entry of SITE_IMAGES) {
    copyOrConvert(cwebp, entry);
    manifest[entry.siteName] = `assets/site/${entry.siteName}`;
  }

  writeFileSync(join(SITE_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nBundled ${SITE_IMAGES.length} site images into src/assets/site/`);
}

main();
