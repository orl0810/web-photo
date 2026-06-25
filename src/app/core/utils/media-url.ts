import { environment } from '../../../environments/environment';

export const R2_MEDIA_FOLDERS = ['home-gallery', 'events', 'photo-sessions'] as const;

function getMediaBaseUrl(): string {
  return environment.mediaBaseUrl?.replace(/\/$/, '') ?? '';
}

export function stripAssetsPrefix(path: string): string {
  return path.replace(/^(?:\.\.\/)*assets\//, '');
}

export function isR2MediaPath(path: string): boolean {
  const relative = stripAssetsPrefix(path);
  const folder = relative.split('/')[0];
  return (R2_MEDIA_FOLDERS as readonly string[]).includes(folder);
}

export function toRelativeMediaPath(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const base = getMediaBaseUrl();
    if (base && path.startsWith(`${base}/`)) {
      return path.slice(base.length + 1);
    }
    return path;
  }

  return stripAssetsPrefix(path);
}

export function resolveMediaUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const relative = stripAssetsPrefix(path);
  const base = getMediaBaseUrl();

  if (base && isR2MediaPath(relative)) {
    return `${base}/${relative}`;
  }

  return path.startsWith('assets/') ? path : `assets/${relative}`;
}

export function resolveMediaVariantUrl(relativePath: string, variantWidth: number): string {
  const normalized = stripAssetsPrefix(relativePath);

  if (normalized.includes('/variants/')) {
    return resolveMediaUrl(normalized);
  }

  const lastSlash = normalized.lastIndexOf('/');
  const folderPath = normalized.slice(0, lastSlash);
  const file = normalized.slice(lastSlash + 1);
  const dotIndex = file.lastIndexOf('.');

  if (dotIndex === -1) {
    return resolveMediaUrl(normalized);
  }

  const base = file.slice(0, dotIndex);
  const variantPath = `${folderPath}/variants/${base}-${variantWidth}.webp`;
  return resolveMediaUrl(variantPath);
}
