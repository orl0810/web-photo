import { NgModule } from '@angular/core';
import { IMAGE_LOADER } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { portfolioImageLoader } from './shared/utils/portfolio-image.loader';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./shared/components/gallery/gallery.component').then((m) => m.GalleryComponent),
    providers: [{ provide: IMAGE_LOADER, useValue: portfolioImageLoader }],
  },
  {
    path: 'services',
    children: [
      {
        path: 'photo-sessions',
        loadComponent: () =>
          import('./pages/photo-sessions/photo-sessions.component').then(
            (m) => m.PhotoSessionsComponent,
          ),
        title: 'Photo Sessions',
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/corporate/corporate.component').then((m) => m.CorporateComponent),
        title: 'Event Coverage',
      },
      {
        path: 'social-media',
        loadComponent: () =>
          import('./pages/social-media/social-media.component').then(
            (m) => m.SocialMediaComponent,
          ),
        title: 'Social Media Content',
      },
    ],
  },
  { path: 'about', component: HomeComponent },
  {
    path: 'contract',
    loadComponent: () =>
      import('./pages/contract/contract.component').then((m) => m.ContractComponent),
  },
  {
    path: 'suggestions',
    loadComponent: () =>
      import('./pages/suggestions/suggestions.component').then((m) => m.SuggestionsComponent),
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
