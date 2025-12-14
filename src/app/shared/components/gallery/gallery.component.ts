import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { PhotoService } from 'src/app/core/services/photo.service';
// import photoData from '../../../../assets/home-gallery/photo-data.json';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {

    photos = signal([]);

   /*  constructor(
        private photoService: PhotoService
    ) {
        this.photos$ = this.photoService.getAll$;
    } */

    constructor(private http: HttpClient) {
        this.http.get<any[]>('assets/home-gallery/photo-data.json').subscribe((data: any) => {
            this.photos.set(data);
          });
    }


  ngOnInit(): void {
    
  }

  getDynamicShadow(imageUrl: string): string {
    // Simple example shadow, you can expand this by analyzing image colors dynamically
    return '0 8px 20px rgba(0, 0, 0, 0.4)';
  }
}
