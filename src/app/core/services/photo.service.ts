import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PhotoService {
    private readonly homeGalleryURL = 'assets/home-gallery/photo-data.json'

    constructor(private http: HttpClient) {}

	getAll$(): Observable<any[]> {
		return this.http.get<any[]>(this.homeGalleryURL);
	}
}