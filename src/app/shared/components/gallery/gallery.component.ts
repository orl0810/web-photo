import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GalleryCategory, Photo } from '../../../core/models/photo.model';
import { PhotoService } from '../../../core/services/photo.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [CommonModule, NgOptimizedImage],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit {
  photos: Photo[] = [];
  selectedCategory: GalleryCategory = 'photo-sessions';

  readonly categories: { id: GalleryCategory; label: string }[] = [
    { id: 'photo-sessions', label: 'Photo Sessions' },
    { id: 'events', label: 'Events' }
  ];

  readonly gridSizes = '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw';
  readonly relatedSizes = '(max-width: 768px) 33vw, 150px';
  readonly skeletonItems = Array.from({ length: 8 }, (_, index) => index);

  currentPage = 1;
  pageSize = 12;
  isLoading = false;
  selectedPhoto: Photo | null = null;
  relatedPhotos: Photo[] = [];
  hasMore = true;

  constructor(
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  selectCategory(category: GalleryCategory): void {
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;
    this.currentPage = 1;
    this.photos = [];
    this.hasMore = true;
    this.closeModal();
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.isLoading = true;
    this.photoService.getPhotoPage(1, this.pageSize, this.selectedCategory).subscribe({
      next: (data) => {
        this.photos = data;
        this.currentPage = 1;
        this.hasMore = data.length === this.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading gallery photos:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore) {
      return;
    }

    const nextPage = this.currentPage + 1;
    this.isLoading = true;

    this.photoService.getPhotoPage(nextPage, this.pageSize, this.selectedCategory).subscribe({
      next: (data) => {
        this.photos = [...this.photos, ...data];
        this.currentPage = nextPage;
        this.hasMore = data.length === this.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading gallery photos:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openMap(location: Photo['location']): void {
    if (location?.lat && location?.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank');
    }
  }

  readonly immediateRenderCount = 4;

  shouldRenderImmediately(index: number): boolean {
    return index < this.immediateRenderCount;
  }

  isPriorityImage(index: number): boolean {
    return this.currentPage === 1 && index < this.immediateRenderCount;
  }

  gridImageSrc(photo: Photo): string {
    return photo.thumbnailUrl ?? photo.url;
  }

  imageAlt(photo: Photo): string {
    return photo.alt ?? photo.title;
  }

  aspectRatio(photo: Photo): string {
    return `${photo.width} / ${photo.height}`;
  }

  onImageLoad(event: Event): void {
    (event.target as HTMLImageElement).classList.add('is-loaded');
  }

  openPhoto(photo: Photo): void {
    this.selectedPhoto = photo;
    this.relatedPhotos = this.photos.filter(p =>
      p.galleryCategory === photo.galleryCategory && p.id !== photo.id
    );
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedPhoto = null;
    this.relatedPhotos = [];
    document.body.style.overflow = 'auto';
  }

  switchPhoto(photo: Photo): void {
    this.openPhoto(photo);
    document.querySelector('.photo-modal')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
