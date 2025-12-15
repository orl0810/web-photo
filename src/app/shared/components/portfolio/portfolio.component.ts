import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Photo2Service } from 'src/app/core/services/photo2.service';
// import photoData from '../../../../assets/home-portfolio/photo-data.json';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PhotoGalleryComponent implements OnInit {

    photos = signal([]);

   /*  constructor(
        private photoService: Photo2Service
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
