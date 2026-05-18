import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { scrollToElementId } from './shared/utils/scroll-to-element';

const LOGO_ROTATION_DEG_PER_PX = 0.4;

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'orlando-photo-web';

  isMenuOpen = false;
  logoRotation = 0;

  private lastScrollY = 0;

  readonly whatsAppContactUrl =
    'https://wa.me/35679552176?text=' +
    encodeURIComponent(
      "Hi Orlando! I'd love to hear more about your photography services.",
    );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.lastScrollY = window.scrollY;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    const delta = scrollY - this.lastScrollY;

    if (delta !== 0) {
      this.logoRotation += delta * LOGO_ROTATION_DEG_PER_PX;
      this.lastScrollY = scrollY;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  scrollToServices(): void {
    this.closeMenu();

    const scroll = () => scrollToElementId('services');

    const onHome = this.router.url === '/home' || this.router.url.startsWith('/home#');

    if (onHome) {
      scroll();
      return;
    }

    this.router.navigate(['/home'], { fragment: 'services' }).then(scroll);
  }
}
