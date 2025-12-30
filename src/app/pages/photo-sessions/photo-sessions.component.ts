import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

interface Package {
  title: string;
  price: number;
  currency: string;
  duration: string;
  targetAudience: string;
  features: string[];
  excluded: string;
  isPopular?: boolean;
}

interface AddOn {
  title: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './photo-sessions.component.html',
  styleUrls: ['./photo-sessions.component.scss']
})
export class PhotoSessionsComponent {

  // Placeholder for your portfolio images
  portfolioImages = [
    { src: '../../../assets/home-gallery/_JCM1028-min.jpg', alt: 'Portrait in the city' },
    { src: '../../../assets/home-gallery/_JCM5242.jpg', alt: 'Golden hour shot' },
    { src: '../../../assets/home-gallery/_JCM5969.jpg', alt: 'Fashion editorial' },
    { src: '../../../assets/home-gallery/_JCM9071.jpg', alt: 'Candid lifestyle' },
    { src: '../../../assets/home-gallery/_JCM3136.jpg', alt: 'Couple session' },
    { src: '../../../assets/home-gallery/_JCM9760.jpg', alt: 'Urban exploration' }
  ];

  packages: Package[] = [
    {
      title: 'The City Memories',
      price: 100,
      currency: '€',
      duration: '45 Minutes',
      targetAudience: 'Perfect for tourists & short visits',
      features: [
        '15 Professionally Edited Photos',
        '1-2 Nearby Locations',
        'Online Gallery Delivery',
        'Posing Guidance'
      ],
      excluded: 'Transport & entry fees not included',
      isPopular: false
    },
    {
      title: 'The Content Creator',
      price: 200,
      currency: '€',
      duration: '1 Hour 45 Minutes',
      targetAudience: 'For influencers & personal branding',
      features: [
        'All Good Photos (High Quality)',
        'Unlimited Outfit Changes',
        'Multiple Spot Changes',
        'Content Strategy Consultation',
        'Priority Editing'
      ],
      excluded: 'Transport & entry fees not included',
      isPopular: true
    }
  ];

  addOns: AddOn[] = [
    {
      title: 'Rush Delivery',
      price: 50,
      description: 'Receive your edited gallery within 24 hours.'
    },
    {
      title: 'Social Media Reel',
      price: 75,
      description: 'A 15-second behind-the-scenes video edited for TikTok/Reels.'
    },
    {
      title: 'Extra 30 Minutes',
      price: 60,
      description: 'Need more time? Extend your session on the go.'
    }
  ];

  scrollToBooking() {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }
}
