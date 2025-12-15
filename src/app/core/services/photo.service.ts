/*
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {FilterCriteria, Photo} from "../models/photo.model";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  // MOCK DATA - In a real app, this comes from an API
  private mockPhotos: Photo[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i.toString(),
    url: `https://picsum.photos/id/${i + 10}/800/600`, // Placeholder
    thumbnailUrl: `https://picsum.photos/id/${i + 10}/400/300`,
    title: `Photo ${i + 1}`,
    date: new Date(2023, i % 12, (i % 28) + 1),
    category: ['Portrait', 'Landscape', 'Street', 'Fashion'][i % 4] as any,
    modelGender: i % 2 === 0 ? 'Female' : 'Male',
    modelNationality: i % 3 === 0 ? 'USA' : 'France',
    location: { lat: 48.8566, lng: 2.3522, name: i % 2 === 0 ? 'Paris' : 'New York' },
    orientation: 'Landscape',
    cameraModel: 'Canon R5',
    tags: []
  }));

  getPhotos(page: number, pageSize: number, filters: FilterCriteria): Observable<Photo[]> {
    // Simulate API delay
    return of(this.applyFilters(this.mockPhotos, filters).slice(0, page * pageSize)).pipe(delay(300));
  }

  private applyFilters(photos: Photo[], filters: FilterCriteria): Photo[] {
    return photos.filter(photo => {
      let matches = true;

      if (filters.category && photo.category !== filters.category) matches = false;
      if (filters.gender && photo.modelGender !== filters.gender) matches = false;
      if (filters.nationality && !photo.modelNationality?.toLowerCase().includes(filters.nationality.toLowerCase())) matches = false;
      if (filters.locationName && !photo.location.name.toLowerCase().includes(filters.locationName.toLowerCase())) matches = false;
      if (filters.orientation && photo.orientation !== filters.orientation) matches = false;

      if (filters.startDate && new Date(filters.startDate) > photo.date) matches = false;
      if (filters.endDate && new Date(filters.endDate) < photo.date) matches = false;

      return matches;
    });
  }
}
*/


import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import {forkJoin, from, Observable, of, switchMap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FilterCriteria, Photo} from "../models/photo.model";
import {getDownloadURL, ref, Storage as FireStorage} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private firestore: Firestore,
    private storage: FireStorage
  ) {}

  private photosCollection = collection(this.firestore, 'photos');

  getPhotos(filters: FilterCriteria): Observable<Photo[]> {
    const q = query(this.photosCollection, orderBy('time', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((photos: any[]) => {

        if (photos.length === 0) return of([]);

        const photosRequests = photos.map(p => {
          const imageRef = ref(this.storage, p.url);

          return from(getDownloadURL(imageRef)).pipe(
            map(downloadUrl => ({
              ...p,
              date: p.time ? p.time.toDate() : new Date(),
              url: downloadUrl
            })),
            catchError(error => {
              console.error(`Error cargando imagen ${p.id}:`, error);
              return of({
                ...p,
                date: p.time?.toDate(),
                gender: p.gender,
                url: null // O una imagen por defecto
              });
            })
          );
        });

        return forkJoin(photosRequests);
      }),
      map((photosWithUrls) => this.applyFilters(photosWithUrls as Photo[], filters))
    );
  }

  private applyFilters(photos: Photo[], filters: FilterCriteria): Photo[] {
    return photos.filter(photo => {
      let matches = true;

      if (filters.category && photo.category !== filters.category) matches = false;
      if (filters.gender && photo.gender !== filters.gender) matches = false;
      if (filters.nationality && !photo.nationality?.toLowerCase().includes(filters.nationality.toLowerCase())) matches = false;
      if (filters.locationName && !photo.location.name.toLowerCase().includes(filters.locationName.toLowerCase())) matches = false;
      if (filters.orientation && photo.orientation !== filters.orientation) matches = false;

      if (filters.startDate && new Date(filters.startDate) > photo.date) matches = false;
      if (filters.endDate && new Date(filters.endDate) < photo.date) matches = false;

      return matches;
    });
  }
}
