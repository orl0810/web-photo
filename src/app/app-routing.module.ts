import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractComponent } from './pages/contract/contract.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { SuggestionsComponent } from './pages/suggestions/suggestions.component';
import { PhotoGalleryComponent } from './shared/components/portfolio/portfolio.component';
import {CorporateComponent} from "./pages/corporate/corporate.component";
import {GalleryComponent} from "./shared/components/gallery/gallery.component";
import {ServicesComponent} from "./pages/services/services.component";

const ROUTES: Routes = [
	{ path: '', pathMatch:'full', redirectTo: 'home' },
	{ path: 'home', component: HomeComponent },
  { path: 'portfolio', component: GalleryComponent },
  {
    path: 'services',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
        title: 'Our Services'
      },
      /*{
        path: 'photo-sessions',
        loadComponent: () => import('./pages/photo-sessions/photo-sessions.component').then(m => m.PhotoSessionsComponent),
        title: 'Photo Sessions'
      },*/
      {
        path: 'events',
        loadComponent: () => import('./pages/corporate/corporate.component').then(m => m.CorporateComponent),
        title: 'Event Coverage'
      },
      /*{
        path: 'social-media',
        loadComponent: () => import('./pages/social-media/social-media.component').then(m => m.SocialMediaComponent),
        title: 'Social Media Content'
      }*/
    ]
  },

  { path: 'about', component: HomeComponent },
  { path: 'contract', component: ContractComponent },
  { path: 'suggestions', component: SuggestionsComponent },
  //{ path: 'movie/:slug', component: MovieDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
