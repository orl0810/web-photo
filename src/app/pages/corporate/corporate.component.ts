import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { scrollToElementId } from '../../shared/utils/scroll-to-element';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface EventPackage {
  title: string;
  startingFrom: string;
  duration: string;
  shortDescription: string;
  idealClient: string;
  delivery: string;
  includes: string[];
  cta: string;
  isPopular?: boolean;
}

interface AddOn {
  title: string;
  startingFrom: string;
  description: string;
}

@Component({
  selector: 'app-corporate',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, IconComponent],
  templateUrl: './corporate.component.html',
  styleUrls: [
    '../photo-sessions/photo-sessions.component.scss',
    './corporate.component.scss'
  ]
})
export class CorporateComponent {
  readonly eventBookingUrl = 'https://cal.com/orlando-benavides-ybka62/event-session';

  readonly heroBackgroundImage = 'assets/site/event-jcm2742.webp';

  portfolioImages = [
    {
      src: 'assets/site/event-jcm0016.webp',
      alt: 'Esme Bachata Concert'
    },
    {
      src: 'assets/site/event-jcm3366.webp',
      alt: 'Sigma World with 1XBet'
    },
    {
      src: 'assets/site/event-jcm6821.webp',
      alt: 'Corporate event in Malta'
    },
    {
      src: 'assets/site/event-jcm2384.webp',
      alt: 'Malta Fusion Weekend event'
    }
  ];

  packages: EventPackage[] = [
    {
      title: 'Event Photography',
      startingFrom: '€450',
      duration: 'Up to 2 hours',
      shortDescription: 'Professional photo coverage focused on key moments and natural storytelling.',
      idealClient: 'Private events, birthdays, special occasions, and small business gatherings.',
      delivery: 'Max 5 days',
      includes: [
        '80-120 edited photos',
        'Coverage of highlights, guests, and atmosphere',
        'Private online gallery with download access',
        'Additional hour available for €120'
      ],
      cta: 'Book your event'
    },
    {
      title: 'Corporate Event Coverage',
      startingFrom: '€750',
      duration: 'Half-day coverage',
      shortDescription: 'Premium event photography designed for businesses and professional brand communication.',
      idealClient: 'Networking events, conferences, launches, and brand activations.',
      delivery: 'Max 5 days',
      includes: [
        'All edited photos from the event (+120)',
        'Professional, brand-aligned event coverage',
        'Edited gallery suitable for social media and website use',
        'Speaker moments, networking, branded details, and candid interactions',
      ],
      cta: 'Book your event',
      isPopular: true
    },
    {
      title: 'Photo + Video Event Coverage',
      startingFrom: '€950',
      duration: 'Up to 4 hours',
      shortDescription: 'Combined photo and short-form video for brands that want complete content output.',
      idealClient: 'Brands and teams needing assets for Instagram, LinkedIn, ads, and post-event promotion.',
      delivery: 'Max 5 days',
      includes: [
        'Full event photo coverage',
        'Short-form vertical clips captured during the event (4K)',
        '2 Reels edited for social media',
        'Second shooter to not miss any moments',
        'Additional hour available for €200'
      ],
      cta: 'Book your event'
    }
  ];

  addOns: AddOn[] = [
    {
      title: 'Additional reel',
      startingFrom: '€100',
      description: 'Short-form vertical reel edited for social media channels.'
    },
    {
      title: 'Express delivery',
      startingFrom: '€100 or +30%',
      description: 'Priority turnaround when you need your event content faster.'
    },
    {
      title: 'Extra hour',
      startingFrom: '€100-€200',
      description: 'Extend your coverage for additional moments and guests.'
    },
    {
      title: 'Second shooter / video support',
      startingFrom: 'Available on request',
      description: 'Available for larger productions and hybrid event coverage.'
    }
  ];

  scrollToBooking(): void {
    scrollToElementId('booking');
  }
}
