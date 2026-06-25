export interface GeoLocation {
  lat: number;
  lng: number;
  name: string; // e.g., "Paris, France"
}

export type GalleryCategory = 'photo-sessions' | 'events';

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  title: string;
  alt?: string;
  galleryCategory: GalleryCategory;

  // Filterable Criteria
  date: Date;
  category: 'Portrait' | 'Landscape' | 'Street' | 'Fashion' | 'Nature';
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'N/A';
  nationality?: string;
  location: GeoLocation;

  // Additional Valuable Criteria
  orientation: 'Landscape' | 'Portrait' | 'Square';
  cameraModel?: string; // e.g., "Sony A7III"
  tags?: string[];
}

export interface FilterCriteria {
  startDate?: string;
  endDate?: string;
  category?: string;
  gender?: string;
  nationality?: string;
  locationName?: string;
  orientation?: string;
}
