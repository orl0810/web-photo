import { Component, Input } from "@angular/core";
import { Movie } from "../../client/movie.model";

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
  })
  export class MovieComponent {
    @Input({ required: true }) movie!: Movie;
  }