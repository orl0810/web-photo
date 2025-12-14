import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractComponent } from './pages/contract/contract.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { SuggestionsComponent } from './pages/suggestions/suggestions.component';
import { PhotoGalleryComponent } from './shared/components/gallery/gallery.component';

const ROUTES: Routes = [
	{ path: '', pathMatch:'full', redirectTo: 'home' },
	{ path: 'home', component: HomeComponent },
  { path: 'gallery', component: PhotoGalleryComponent },
  { path: 'contract', component: ContractComponent },
  { path: 'suggestions', component: SuggestionsComponent },
  { path: 'movie/:slug', component: MovieDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
