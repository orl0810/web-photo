import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { scrollToElementId } from '../../shared/utils/scroll-to-element';

interface Package {
  title: string;
  shortDescription: string;
  startingFrom: string;
  duration: string;
  idealClient: string;
  delivery: string;
  includes: string[];
  isPopular?: boolean;
}

interface AddOn {
  title: string;
  startingFrom: string;
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
  readonly heroBackgroundImage = 'assets/site/session-featured-12-martina.webp';

  portfolioImages = [
    { src: 'assets/site/session-featured-14-aru.webp', alt: 'Portrait in the city' },
    { src: 'assets/site/session-featured-07.webp', alt: 'Golden hour shot' },
    { src: 'assets/site/session-jcm5969.webp', alt: 'Fashion editorial' },
    { src: 'assets/site/session-featured-02.webp', alt: 'Candid lifestyle' },
    { src: 'assets/site/session-jcm3136.webp', alt: 'Couple session' },
    { src: 'assets/site/session-jcm9760.webp', alt: 'Urban exploration' },
    { src: 'assets/site/session-jcm0700.webp', alt: 'Proposal photoshoot' },
    { src: 'assets/site/session-jcm1855.webp', alt: 'Manoel Island photoshoot' }
  ];

  packages: Package[] = [
    {
      title: 'Valletta Mini Session',
      shortDescription: 'A quick and easy shoot for travelers who want beautiful photos without taking too much time from their day.',
      startingFrom: '€120',
      duration: '∼ 30 minutes',
      idealClient: 'Tourists, solo portraits, couples, and quick lifestyle photos in Valletta.',
      delivery: '3-5 days',
      includes: [
        '15 professionally edited photos',
        '2 camera/phone clips (4K)',
        'Valletta location only',
        'Pose guidance and natural direction',
        'Private online gallery for download'
      ],
      isPopular: false
    },
    {
      title: 'Standard Photo Session',
      shortDescription: 'Balanced coverage with enough time to create a strong gallery for memories, personal portraits, and social media.',
      startingFrom: '€220',
      duration: '∼ 1 hour',
      idealClient: 'Couples, portraits, tourists, and lifestyle content in Valletta or Sliema.',
      delivery: '3-5 days',
      includes: [
        '25-30 professionally edited photos',
        '3-5 camera/phone clips (4K)',
        'Valletta or Sliema location',
        'Guided and candid photo moments',
        'Flexible pacing with outfit/scene variation',
        'Private online gallery for download'
      ],
      isPopular: true
    },
    {
      title: 'Premium Couple / Proposal Session',
      shortDescription: 'A complete storytelling session for couples and visitors who want a richer experience and a larger final gallery.',
      startingFrom: '€300',
      duration: '1.5-2 hours',
      idealClient: 'Couples, proposals, anniversaries, and special memories in Malta.',
      delivery: '5 days',
      includes: [
        '45-60 professionally edited photos',
        '3-5 camera/phone clips (4K)',
        'Any location in Malta',
        '1-2 nearby spots',
        'Flexible pacing with outfit/scene variation',
        'Private online gallery for download'
      ],
      isPopular: false
    }
  ];

  addOns: AddOn[] = [
    {
      title: 'Extra edited photos',
      startingFrom: '€5 each',
      description: 'Add more final edits from your full gallery selection.'
    },
    {
      title: 'Additional reel',
      startingFrom: '€100',
      description: 'Short-form vertical reel edited for Instagram or TikTok.'
    },
    {
      title: 'Express delivery',
      startingFrom: '€50',
      description: 'Priority turnaround when you need your photos faster.'
    },
    {
      title: 'Extra hour',
      startingFrom: '€100-€150',
      description: 'Extend your session for more locations, looks, or content.'
    },
    {
      title: 'Transport outside Valletta/Sliema',
      startingFrom: '€20',
      description: 'Travel fee for custom locations outside the standard area.'
    },
    {
      title: 'Second shooter / video support',
      startingFrom: 'On request',
      description: 'Available for proposals, larger setups, or hybrid coverage.'
    }
  ];

  scrollToBooking(): void {
    scrollToElementId('booking');
  }
}
