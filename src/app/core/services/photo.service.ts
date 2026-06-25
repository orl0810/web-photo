import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GalleryCategory, Photo } from '../models/photo.model';
import { resolveMediaUrl, resolveMediaVariantUrl } from '../utils/media-url';

interface PhotoDataEntry {
  'image-url': string;
  'model-name'?: string;
  location?: string;
  date?: string;
}

interface GalleryPhotoDataEntry {
  folder: SessionFolder;
  file: string;
  title: string;
  alt: string;
  location?: string;
  featuredOrder?: number;
}

interface ImageDimensionEntry {
  width: number;
  height: number;
  thumbnail?: string;
  variants?: Record<string, string>;
}

type ImageDimensionsByFolder = Record<string, Record<string, ImageDimensionEntry>>;

type SessionFolder = 'home-gallery' | 'photo-sessions';

const MALTA_LOCATION = { lat: 35.9375, lng: 14.3754, name: 'Malta' };
const DEFAULT_DIMENSIONS = { width: 4000, height: 6000 };

const FEATURED_EVENT_FILES = [
  'featured-01-1x-promotional-model-trade-show-booth.webp',
  'featured-02-1x-affiliates-corporate-event-booth.webp',
  'featured-03-sbc-summit-malta-networking.webp',
  'featured-04-social-dance-salsa-event.webp',
  'featured-05-bachata-social-dance-night.webp',
  'featured-06-1x-illuminated-event-booth-signage.webp',
  'featured-07-branded-cocktail-garnishes-event-catering.webp',
  'featured-08-mixologist-cocktail-corporate-event.webp',
  'featured-09-igniite-ai-annual-day-award-ceremony.webp',
  'featured-10-corporate-celebration-dancing-guests.webp',
  'featured-11-formal-wedding-table-setting.webp',
  'featured-12-elite-moment-awards-winners.webp',
  'featured-13-elite-moment-trophy-celebration.webp',
  'featured-14-corporate-awards-presentation.webp'
];

function buildEventsFileList(dimensionsByFolder: ImageDimensionsByFolder): string[] {
  const allFiles = Object.keys(dimensionsByFolder['events'] ?? {});
  const featuredSet = new Set(FEATURED_EVENT_FILES);
  const featured = FEATURED_EVENT_FILES.filter(file => allFiles.includes(file));
  const other = allFiles.filter(file => !featuredSet.has(file)).sort((a, b) => a.localeCompare(b));
  return [...featured, ...other];
}

function buildPhotoSessionsFileList(
  dimensionsByFolder: ImageDimensionsByFolder,
  featuredMetadata: GalleryPhotoDataEntry[],
  galleryOverrides: Map<string, GalleryPhotoDataEntry>
): GalleryPhotoDataEntry[] {
  const featured = featuredMetadata
    .filter(entry => entry.featuredOrder != null)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

  const featuredKeys = new Set(featured.map(entry => `${entry.folder}/${entry.file}`));
  const sessionFolders: SessionFolder[] = ['home-gallery', 'photo-sessions'];
  const other: GalleryPhotoDataEntry[] = [];
  const seenKeys = new Set(featuredKeys);

  for (const folder of sessionFolders) {
    for (const file of Object.keys(dimensionsByFolder[folder] ?? {}).sort((a, b) => a.localeCompare(b))) {
      const key = `${folder}/${file}`;
      if (seenKeys.has(key)) {
        continue;
      }

      seenKeys.add(key);
      other.push(
        galleryOverrides.get(key) ?? {
          folder,
          file,
          title: 'Portrait session in Malta',
          alt: 'Portrait photo session in Malta',
          location: 'Malta'
        }
      );
    }
  }

  return [...featured, ...other];
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photosByCategory: Record<GalleryCategory, Photo[]> | null = null;

  constructor(private http: HttpClient) {}

  getPhotos(page: number, pageSize: number, galleryCategory: GalleryCategory): Observable<Photo[]> {
    return this.loadPhotosByCategory().pipe(
      map(photosByCategory => photosByCategory[galleryCategory].slice(0, page * pageSize))
    );
  }

  getPhotoPage(page: number, pageSize: number, galleryCategory: GalleryCategory): Observable<Photo[]> {
    return this.loadPhotosByCategory().pipe(
      map(photosByCategory => {
        const start = (page - 1) * pageSize;
        return photosByCategory[galleryCategory].slice(start, start + pageSize);
      })
    );
  }

  private loadPhotosByCategory(): Observable<Record<GalleryCategory, Photo[]>> {
    if (this.photosByCategory) {
      return of(this.photosByCategory);
    }

    return forkJoin({
      metadata: this.http.get<PhotoDataEntry[]>('assets/home-gallery-photo-data.json').pipe(
        catchError(() => of([]))
      ),
      eventsMetadata: this.http.get<GalleryPhotoDataEntry[]>('assets/events-photo-data.json').pipe(
        catchError(() => of([]))
      ),
      photoSessionsFeatured: this.http.get<GalleryPhotoDataEntry[]>('assets/photo-sessions-featured-data.json').pipe(
        catchError(() => of([]))
      ),
      photoSessionsMetadata: this.http.get<GalleryPhotoDataEntry[]>('assets/photo-sessions-gallery-data.json').pipe(
        catchError(() => of([]))
      ),
      dimensions: this.http.get<ImageDimensionsByFolder>('assets/image-dimensions.json').pipe(
        catchError(() => of({}))
      )
    }).pipe(
      map(({ metadata, eventsMetadata, photoSessionsFeatured, photoSessionsMetadata, dimensions }) => {
        const metadataByFile = new Map<string, PhotoDataEntry>();
        for (const entry of metadata) {
          const fileName = entry['image-url'].split('/').pop();
          if (fileName) {
            metadataByFile.set(fileName, entry);
          }
        }

        const eventsMetadataByFile = new Map<string, GalleryPhotoDataEntry>();
        for (const entry of eventsMetadata) {
          eventsMetadataByFile.set(entry.file, entry);
        }

        const photoSessionsMetadataByKey = new Map<string, GalleryPhotoDataEntry>();
        for (const entry of photoSessionsMetadata) {
          photoSessionsMetadataByKey.set(`${entry.folder}/${entry.file}`, entry);
        }

        const photoSessions = buildPhotoSessionsFileList(
          dimensions,
          photoSessionsFeatured,
          photoSessionsMetadataByKey
        ).map(entry =>
          this.buildPhoto(
            entry.folder,
            entry.file,
            'photo-sessions',
            metadataByFile,
            dimensions,
            photoSessionsMetadataByKey.get(`${entry.folder}/${entry.file}`) ?? entry
          )
        );

        const events = buildEventsFileList(dimensions).map(file =>
          this.buildPhoto(
            'events',
            file,
            'events',
            metadataByFile,
            dimensions,
            eventsMetadataByFile.get(file)
          )
        );

        this.photosByCategory = {
          'photo-sessions': photoSessions,
          events
        };

        return this.photosByCategory;
      })
    );
  }

  private buildPhoto(
    folder: SessionFolder | 'events',
    file: string,
    galleryCategory: GalleryCategory,
    metadataByFile: Map<string, PhotoDataEntry>,
    dimensionsByFolder: ImageDimensionsByFolder,
    galleryMeta?: GalleryPhotoDataEntry
  ): Photo {
    const meta = metadataByFile.get(file);
    const url = resolveMediaUrl(`${folder}/${file}`);
    const category = galleryCategory === 'events' ? 'Street' : 'Portrait';
    const { width, height } = this.resolveDimensions(file, folder, dimensionsByFolder);
    const thumbnailUrl = this.resolveThumbnailUrl(file, folder, url, dimensionsByFolder);

    return {
      id: `${folder}/${file}`,
      url,
      thumbnailUrl,
      width,
      height,
      title: galleryMeta?.title ?? meta?.['model-name'] ?? this.titleFromFile(file),
      alt: galleryMeta?.alt,
      galleryCategory,
      date: meta?.date ? new Date(meta.date) : new Date(),
      category,
      location: {
        ...MALTA_LOCATION,
        name: galleryMeta?.location ?? meta?.location ?? MALTA_LOCATION.name
      },
      orientation: this.resolveOrientation(width, height),
      tags: [folder]
    };
  }

  private resolveDimensions(
    file: string,
    folder: string,
    dimensionsByFolder: ImageDimensionsByFolder
  ): { width: number; height: number } {
    const entry = dimensionsByFolder[folder]?.[file];

    if (!entry) {
      if (isDevMode()) {
        console.warn(`Missing dimensions for ${folder}/${file}; using default ${DEFAULT_DIMENSIONS.width}x${DEFAULT_DIMENSIONS.height}`);
      }
      return DEFAULT_DIMENSIONS;
    }

    return { width: entry.width, height: entry.height };
  }

  private resolveThumbnailUrl(
    file: string,
    folder: string,
    url: string,
    dimensionsByFolder: ImageDimensionsByFolder
  ): string {
    const entry = dimensionsByFolder[folder]?.[file];

    if (entry?.variants?.['400']) {
      return resolveMediaUrl(`${folder}/variants/${entry.variants['400']}`);
    }

    if (entry?.thumbnail) {
      return resolveMediaUrl(`${folder}/${entry.thumbnail}`);
    }

    return url;
  }

  private resolveOrientation(width: number, height: number): Photo['orientation'] {
    if (width === height) {
      return 'Square';
    }
    return width > height ? 'Landscape' : 'Portrait';
  }

  private titleFromFile(file: string): string {
    const withoutExt = file.replace(/\.[^.]+$/, '');
    if (withoutExt.startsWith('featured-') || withoutExt.startsWith('session-') || withoutExt.startsWith('event-')) {
      return withoutExt
        .replace(/^featured-\d+-/, '')
        .replace(/^session-/, '')
        .replace(/^event-malta-/, '')
        .replace(/-/g, ' ');
    }
    return withoutExt.replace(/^_JCM/, 'JCM ');
  }
}
