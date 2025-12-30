import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import { trigger, transition, style, animate } from '@angular/animations';

interface PricingTier {
  name: string;
  price: number;
  period: string;
  subtitle: string;
  buttonText: string;
  buttonClass: string;
  recommended?: boolean;
  features: Feature[];
}

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  name: string;
  price: number;
  duration: string;
  subtitle: string;
  buttonText: string;
  buttonClass: string;
  featured?: boolean;
  features: string[];
  extraHourPrice?: number;
  gift?: string;
  type: 'photo' | 'video' | 'photo-video'| 'full';
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-corporate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './corporate.component.html',
  styleUrl: './corporate.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CorporateComponent {

  selectedFilter: 'photo' | 'video' | 'photo-video' | 'full' = 'photo-video';

  packages: Package[] = [
    {
      name: 'PREMIUM PHOTO',
      price: 220,
      duration: '2 hours',
      subtitle: 'Professional coverage for your corporate event',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      type: 'photo',
      features: [
        '+- 50 final photos in high quality',
        '3 to 5 clips (without edition)',
        'Professional coverage of key moments',
        'Curated set of edited images'
      ],
      extraHourPrice: 100
    },
    {
      name: 'PREMIUM PHOTO',
      price: 400,
      duration: '4 hours',
      subtitle: 'Extended Photography Coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      type: 'photo',
      features: [
        '+- 100 final photos in high quality',
        '3 to 5 clips (without edition)',
        'Extended event coverage',
        'All key moments captured'
      ],
      extraHourPrice: 100
    },
    {
      name: 'PREMIUM VIDEO',
      price: 240,
      duration: '2 hours',
      subtitle: 'Video coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      type: 'video',
      features: [
        '1 trailer (YouTube format) or 2 reels (Instagram/TikTok)',
        'All clips (without edition) if need',
      ],
      extraHourPrice: 150
    },
    {
      name: 'PREMIUM VIDEO',
      price: 420,
      duration: '4 hours',
      subtitle: 'Extended Video coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      type: 'video',
      features: [
        '1 trailer (YouTube format) AND 1 reels (Instagram/TikTok)' +
        ' OR 3 reels (Instagram/TikTok)',
        'All clips (without edition) if need',
      ],
      extraHourPrice: 150
    },
    {
      name: 'DELUX',
      price: 440,
      duration: '2 hours',
      subtitle: 'Complete Photography + Video Package',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      type: 'photo-video',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (camera + phone clips)',
        '1 trailer (1.30 min) + 4 reels OR 6 reels',
        '2 cameras + 1 phone coverage',
      ],
      extraHourPrice: 250
    },
    {
      name: 'DELUX',
      price: 800,
      duration: '4 hours',
      subtitle: 'Premium Full Event Coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      featured: true,
      gift: 'Fast post! 5 photos during event',
      type: 'photo-video',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (2 cameras + 1 phone)',
        '1 trailer + 4 reels OR 6 reels',
        '5 photos to post straight during event',
        'Complete professional coverage'
      ],
      extraHourPrice: 250
    },
    {
      name: 'FULL CONTENT',
      price: 590,
      duration: '2 hours',
      subtitle: 'Complete Photography + Video Package',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      gift: 'Fast post!',
      type: 'full',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (camera + phone clips) if requested',
        '1 trailer (YouTube format) + 4 reels OR 6 reels (Instagram/TikTok)',
        '2 cameras + 1 phone coverage',
        '5 photos and 1 simple reel to post during event',
        'Complete professional coverage'
      ],
      extraHourPrice: 300
    },
    {
      name: 'FULL CONTENT',
      price: 1000,
      duration: '4 hours',
      subtitle: 'Premium Full Event Coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      featured: true,
      gift: 'Fast post! 5 photos during event',
      type: 'full',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (2 cameras + 1 phone) if requested',
        '1 trailer (YouTube format) + 4 reels OR 6 reels (Instagram/TikTok)',
        '5 photos and 1 simple reel to post during event',
        'Complete professional coverage'
      ],
      extraHourPrice: 300
    }
  ];
  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Let\'s Talk',
      description: 'We\'ll meet before the event to discuss all the important details. We can do this in person or via video call to ensure everything is perfect.',
      icon: '👋'
    },
    {
      number: 2,
      title: 'Book Your Date',
      description: '20% upfront payment to secure your date. This payment is refundable one week before the event and deductible from the total service value.',
      icon: '📅'
    },
    {
      number: 3,
      title: 'Timeline Planning',
      description: 'A few days before, we\'ll request a timeline with the important moments of your event. This helps us capture the best results.',
      icon: '📋'
    },
    {
      number: 4,
      title: 'Event Day',
      description: 'On the day of your event, we\'ll capture every meaningful moment with care and creativity, ensuring nothing is missed.',
      icon: '📸'
    },
    {
      number: 5,
      title: 'Fast Delivery',
      description: 'All material delivered within one week maximum. If we can deliver sooner, even better! You can request adjustments once.',
      icon: '🎁'
    }
  ];

  get filteredPackages(): Package[] {
    return this.packages.filter(pkg => pkg.type === this.selectedFilter);
  }

  setFilter(filter: 'photo' | 'video' | 'photo-video' | 'full'): void {
    this.selectedFilter = filter;
  }

  scrollToPackages(): void {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
