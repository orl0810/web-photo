import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotoService } from './core/services/photo.service';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { PhotoGalleryComponent } from './shared/components/gallery/gallery.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { SideMenuComponent } from './shared/components/layout/side-menu/side-menu.component';
import { MovieComponent } from './shared/components/movie/movie.component';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './pages/contract/contract.component';
import { SuggestionsComponent } from './pages/suggestions/suggestions.component';


const COMPONENTS = [
  AppComponent,
  SideMenuComponent,
	HeaderComponent,
	FooterComponent,
	HomeComponent,
  PhotoGalleryComponent,
  ContractComponent,
  SuggestionsComponent,
	MovieComponent,
	MoviesComponent,
	MovieDetailComponent
];

@NgModule({
  declarations: [...COMPONENTS],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PhotoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
