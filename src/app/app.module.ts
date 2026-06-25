import { NgModule } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { SideMenuComponent } from './shared/components/layout/side-menu/side-menu.component';
import { provideHttpClient } from '@angular/common/http';
import { IconComponent } from './shared/components/icon/icon.component';

const COMPONENTS = [
  AppComponent,
  SideMenuComponent,
  HeaderComponent,
  FooterComponent,
  HomeComponent,
];

@NgModule({
  declarations: [...COMPONENTS],

  imports: [
    BrowserModule,
    AppRoutingModule,
    IconComponent,
    NgOptimizedImage,
  ],
  providers: [
    provideHttpClient(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
