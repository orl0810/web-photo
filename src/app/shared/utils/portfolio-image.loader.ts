import { ImageLoaderConfig } from '@angular/common';
import {
  isR2MediaPath,
  resolveMediaUrl,
  resolveMediaVariantUrl,
  toRelativeMediaPath
} from '../../core/utils/media-url';

const GRID_VARIANT_WIDTH = 400;
const MODAL_VARIANT_WIDTH = 1200;

/**
 * Maps portfolio ngSrc paths (original asset files) to pre-generated WebP variants
 * under each folder's variants/ directory. Variants are produced by
 * `pnpm run generate:image-variants` using cwebp.
 */
export function portfolioImageLoader(config: ImageLoaderConfig): string {
  const relative = toRelativeMediaPath(config.src);

  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    return config.src;
  }

  if (relative.includes('/variants/')) {
    return resolveMediaUrl(relative);
  }

  if (!isR2MediaPath(relative) && !config.src.startsWith('assets/')) {
    return config.src;
  }

  if (!isR2MediaPath(relative)) {
    return resolveMediaUrl(relative);
  }

  const variantWidth =
    config.loaderParams?.['variant'] === 'large' ? MODAL_VARIANT_WIDTH : GRID_VARIANT_WIDTH;

  return resolveMediaVariantUrl(relative, variantWidth);
}
