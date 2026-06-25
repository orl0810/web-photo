import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { scrollToElementId } from '../../shared/utils/scroll-to-element';

interface ContentPackage {
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
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {
  readonly heroImage = 'assets/content/_JCM6693.jpg';

  portfolioImages = [
    { src: 'assets/content/_JCM0849.jpg', alt: 'Restaurant social media content' },
    { src: 'assets/content/_JCM6693.jpg', alt: 'Brand portrait content in Malta' },
    { src: 'assets/site/event-jcm2742.webp', alt: 'Corporate content session' },
  ];

  packages: ContentPackage[] = [
    {
      title: 'Starter Content Pack',
      shortDescription: 'A practical content session to refresh your social presence with quality visuals in one shoot.',
      startingFrom: '€550',
      duration: '1 session (2-hours)',
      idealClient: 'Small businesses and personal brands that need consistent visuals without a full monthly commitment.',
      delivery: 'Max 10 days',
      includes: [
        '50 edited photos',
        '10-15 Short vertical clips (4K)',
        'Strategy and preparation',
        '1 Reel edited for social media',
        'Second shooter to not miss any moments',
        'Content suitable for Instagram, website, and promotions'
      ]
    },
    {
      title: 'Business Content Pro',
      shortDescription: 'High-output content session designed for brands that want enough assets for several weeks.',
      startingFrom: '€850',
      duration: '1 session (3-hours)',
      idealClient: 'Businesses, agencies, and creators who publish regularly and need stronger weekly consistency.',
      delivery: 'Max 10 days',
      includes: [
        '80-100 edited photos',
        '20-25 vertical clips (4K)',
        'Strategy and preparation',
        'Second shooter to not miss any moments',
        '2-3 Reels edited for social media',
        'Mix of product, team, lifestyle, and behind-the-scenes content'
      ],
      isPopular: true
    },
    {
      title: 'Monthly Content Plan',
      shortDescription: 'Recurring monthly content production with scalable options to match your business growth. (Minimum 3 months)',
      startingFrom: '€750/month',
      duration: 'Recurring monthly plan',
      idealClient: 'Restaurants, gyms, agencies, real estate agents, personal brands, and local businesses in Malta.',
      delivery: 'Ongoing monthly delivery schedule by plan',
      includes: [
        'Starter Monthly: from €750/month (1 session monthly, 50 photos, 2 reels)',
        'Growth Monthly: from €1,100/month (2 sessions monthly, 80–120 photos, 4 reels)',
        'Scale Monthly: from €1,500/month (2–3 sessions monthly, 150 photos, 6 reels, clips extra)',
        'Strategy and preparation',
        'Second shooter to not miss any moments',
        'Photos + reels with optional editing depth depending on package'
      ]
    }
  ];

  addOns: AddOn[] = [
    {
      title: 'Additional reel',
      startingFrom: '€100',
      description: 'Add extra short-form videos for campaigns or weekly posting.'
    },
    {
      title: '6 months content plan',
      startingFrom: '15% discount',
      description: 'Discount for a 6 months content plan.'
    },
  ];

  scrollToBooking(): void {
    scrollToElementId('booking');
  }
}
