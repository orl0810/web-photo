import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {FilterCriteria, Photo} from "../../../core/models/photo.model";
import {PhotoService} from "../../../core/services/photo.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush // CRITICAL for optimization
})
export class GalleryComponent implements OnInit {
  photos: Photo[] = [];
  filters: FilterCriteria = { category: '' };

  // Pagination State
  currentPage = 1;
  pageSize = 20;
  isLoading = false;
  isFiltersOpen = false;

  hasMore = true;

  // Dropdown options (could also come from service)
  categories = ['Portrait', 'Landscape', 'Street', 'Fashion', 'Nature'];
  genders = ['Male', 'Female', 'Non-Binary'];
  orientations = ['Landscape', 'Portrait', 'Square'];

  constructor(
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos() {
    this.isLoading = true;
    this.photoService.getPhotos(this.filters).subscribe({
      next: (data) => {
        this.photos = data;
        this.isLoading = false;
        console.log('Fotos cargadas desde Firebase:', data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error conectando a Firebase:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFilterChange() {
    console.log(this.filters)
    this.currentPage = 1;
    this.loadPhotos(); // Recargamos con el nuevo filtro
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  loadMore(): void {
    this.currentPage++;
    this.loadPhotos();
  }

  openMap(location: any): void {
    if (location && location.lat && location.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank');
    }  }

  // Optimization: Angular won't re-render DOM nodes if ID hasn't changed
  trackByPhotoId(index: number, photo: Photo): string {
    return photo.id;
  }
}
