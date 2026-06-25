# Image Optimization Guide

Portfolio images live under `src/assets/`. The `/portfolio` gallery uses `NgOptimizedImage` with a custom `IMAGE_LOADER` that serves pre-generated WebP variants from each folder's `variants/` subfolder.

## Variant structure

Source files are WebP in `events/` and `home-gallery/`; `photo-sessions/` still uses JPG. Responsive WebP variants are generated in each folder's `variants/` subfolder:

```
src/assets/events/
  event-malta-jcm0016.webp          ← logical source (ngSrc)
  variants/
    event-malta-jcm0016-400.webp    ← grid / thumbnails (~400px wide)
    event-malta-jcm0016-1200.webp   ← modal / retina (~1200px wide)
```

The same layout applies to `home-gallery/` and `photo-sessions/`.

## Generate variants with cwebp

Requires [libwebp](https://developers.google.com/speed/webp) (`cwebp` on your PATH):

```bash
brew install webp   # macOS
```

From the repo root:

```bash
# Generate all WebP variants, then refresh image-dimensions.json
pnpm run generate:images

# Or run individually
pnpm run generate:image-variants
pnpm run generate:image-dimensions

# Skip files that already exist (faster re-runs)
node scripts/generate-image-variants.mjs --skip-existing

# Convert JPG sources to WebP (e.g. when migrating a folder)
pnpm run convert:sources-to-webp home-gallery
```

The script uses `cwebp -q 80` at widths **400** and **1200**. Images narrower than a target width are encoded at their native size (no upscaling).

## How the app uses variants

- **Grid / related thumbnails:** `NgOptimizedImage` requests the **400** variant via `portfolioImageLoader`.
- **Modal main image:** requests the **1200** variant (`sizes="90vw"`).
- **Original source files** (`events/`, `home-gallery/`): WebP at full resolution. The gallery loads pre-generated variants instead of these when available.
- **`photo-sessions/`** sources remain JPG until migrated.

Loader: `src/app/shared/utils/portfolio-image.loader.ts`  
Route provider: `app-routing.module.ts` (`/portfolio` only)

## Featured events (priority + SEO)

Curated event photos use the `featured-{NN}-{seo-slug}.webp` naming pattern. Files with the `featured-` prefix sort to the top of the Events gallery automatically.

```
src/assets/events/
  featured-03-sbc-summit-malta-networking.webp
  variants/
    featured-03-sbc-summit-malta-networking-400.webp
    featured-03-sbc-summit-malta-networking-1200.webp
```

**Metadata:** alt text and modal titles live in `src/assets/events/events-photo-data.json` (not parsed from filenames).

**Adding a new featured event:**

1. Name the file `featured-15-your-seo-slug.webp` (use the next available number).
2. Add an entry to `events-photo-data.json` with `file`, `title`, `alt`, and `location`.
3. Add the filename to `FEATURED_EVENT_FILES` in `photo.service.ts`.
4. Run `pnpm run generate:images`.

**Adding a regular event image:**

1. Place the WebP in `src/assets/events/`.
2. Run `pnpm run generate:images` — the gallery picks up all files listed in `image-dimensions.json` automatically (no manual file list needed).

The first two featured images on page 1 receive NgOptimizedImage fetch priority in the Events tab.

## Featured photo sessions (priority + SEO)

The Photo Sessions portfolio merges `home-gallery/` and `photo-sessions/`. Curated picks in `home-gallery/` use `featured-{NN}-{seo-slug}.webp` where **NN must match `featuredOrder`** in the manifest. Session picks at orders 1–9 use `session-portrait-malta-{id}.webp` (home-gallery) or `.jpg` (photo-sessions).

```
src/assets/home-gallery/
  featured-10-antonella-portrait-sliema-malta.webp
  session-portrait-malta-jcm5242.webp
  variants/
    featured-10-antonella-portrait-sliema-malta-400.webp
```

**Curated manifest (edit this):** `src/assets/photo-sessions-featured-data.json` — 25 entries with `folder`, `file`, `title`, `alt`, `location`, and `featuredOrder`.

**Auto-generated (do not edit):** `src/assets/photo-sessions-gallery-data.json` — rebuilt by `generate-photo-sessions-gallery-data.mjs` from the manifest + `image-dimensions.json`.

**Gallery order:** featured entries first (sorted by `featuredOrder`), then all remaining `home-gallery` images, then all remaining `photo-sessions` images. No duplicates.

**Adding a new featured session:**

1. Name the file `featured-{NN}-your-seo-slug.webp` where `NN` equals the desired `featuredOrder`.
2. Add an entry to `photo-sessions-featured-data.json`.
3. Run `pnpm run sync:featured-sessions` if renaming existing files, then `pnpm run generate:images`.

**Adding a regular session image:**

1. Place the image in `home-gallery/` (WebP) or `photo-sessions/` (JPG).
2. Run `pnpm run generate:images` — the gallery auto-discovers all files from `image-dimensions.json`.

To align featured portrait filenames with their order: `pnpm run sync:featured-sessions`.

## Adding new portfolio images

1. Place the source file in the correct folder (`home-gallery` or `events`: WebP; `photo-sessions`: JPG).
2. For events: add metadata to `events-photo-data.json` and `FEATURED_EVENT_FILES` if featured.
3. For photo sessions: add to `photo-sessions-featured-data.json` if featured; otherwise just add the file.
4. Run `pnpm run generate:images`.
5. Commit the new source file and its `variants/*.webp` files.

## Verifying performance

### Chrome DevTools → Network

1. Open `/portfolio`, filter by **Img**.
2. Initial load should request ~20 **WebP** files (~400px), not full JPGs.
3. Opening a modal should load a **1200** variant, not the multi-MB original.
4. Only the first grid image should have fetch priority.

### Lighthouse (Mobile)

Compare before/after variant generation:

- **LCP** — faster with smaller priority image
- **CLS** — stable with declared dimensions + aspect-ratio containers
- **Total byte weight** — should drop sharply on `/portfolio`

Run Lighthouse in an incognito window with cache disabled for a fair comparison.
