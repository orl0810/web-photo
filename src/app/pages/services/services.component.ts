import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Service {
  title: string;
  description: string;
  image: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services: Service[] = [
    {
      title: 'Photo Sessions',
      description: 'Capture your best moments with our professional photography sessions.',
      image: 'assets/home-gallery/_JCM1028-min.jpg',
      route: '/services/photo-sessions',
      icon: '📸'
    },
    {
      title: 'Events',
      description: 'Comprehensive coverage for weddings, corporate gatherings, concerts and private parties.',
      image: 'assets/home-gallery/_JCM0693.jpg',
      route: '/services/events',
      icon: '🎉'
    },
    {
      title: 'Social Media Content',
      description: 'Boost your brand presence with high-quality, engaging content tailored for your audience.',
      image: 'assets/home-gallery/_JCM6693.jpg',
      route: '/services/social-media',
      icon: '📱'
    }
  ];

  constructor(private router: Router) {}

  navigateToService(route: string): void {
    this.router.navigate([route]);
  }
}
