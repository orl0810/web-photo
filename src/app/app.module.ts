import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { PhotoGalleryComponent } from './shared/components/portfolio/portfolio.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { SideMenuComponent } from './shared/components/layout/side-menu/side-menu.component';
import { MovieComponent } from './shared/components/movie/movie.component';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './pages/contract/contract.component';
import { SuggestionsComponent } from './pages/suggestions/suggestions.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {provideAnimations} from "@angular/platform-browser/animations";


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
    FormsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({
      "projectId":"orlando-photo",
      "appId":"1:488117978978:web:94c0cf5d537e43c516ce3b",
      "storageBucket":"orlando-photo.firebasestorage.app",
      "apiKey":"AIzaSyDtFnYZ7cmZnTREvIKniPgn0UOqXUnjmIU",
      "authDomain":"orlando-photo.firebaseapp.com",
      "messagingSenderId":"488117978978",
      "measurementId":"G-XTJFQ4ZCNQ",
      })),
    provideFirestore(() => getFirestore('photo')),
    provideStorage(() => getStorage()),
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
