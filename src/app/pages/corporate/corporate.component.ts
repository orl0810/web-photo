import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

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
  styleUrl: './corporate.component.scss'
})
export class CorporateComponent {
  pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: 0,
      period: '/mo',
      subtitle: 'Up to 1,000 credits/mo',
      buttonText: 'Get started',
      buttonClass: 'btn-dark',
      features: [
        { text: '1,000 credits/month', included: true },
        { text: 'No-code visual workflow builder', included: true },
        { text: '3000+ apps', included: true },
        { text: 'Routers & filters', included: true },
        { text: 'Customer support', included: true },
        { text: '15-minute minimum interval between runs', included: true }
      ]
    },
    {
      name: 'Core',
      price: 9,
      period: '/mo',
      subtitle: 'Price for 10k credits/mo',
      buttonText: 'Get started',
      buttonClass: 'btn-dark',
      features: [
        { text: 'Unlimited active scenarios', included: true },
        { text: 'More control with scheduled scenarios, down to the minute', included: true },
        { text: 'Increased data transfer limits', included: true },
        { text: 'Access to the Make API', included: true }
      ]
    },
    {
      name: 'Pro',
      price: 16,
      period: '/mo',
      subtitle: 'Price for 10k credits/mo',
      buttonText: 'Get started',
      buttonClass: 'btn-primary',
      recommended: true,
      features: [
        { text: 'Priority scenario execution', included: true },
        { text: 'Custom variables', included: true },
        { text: 'Full-text execution log search', included: true }
      ]
    },
    {
      name: 'Teams',
      price: 29,
      period: '/mo',
      subtitle: 'Price for 10k credits/mo',
      buttonText: 'Get started',
      buttonClass: 'btn-dark',
      features: [
        { text: 'Invite and team roles', included: true },
        { text: 'Create and share scenario templates', included: true }
      ]
    },
    {
      name: 'Enterprise',
      price: 0,
      period: '',
      subtitle: "Let's grow your business together",
      buttonText: 'Talk to sales',
      buttonClass: 'btn-dark',
      features: [
        { text: 'Custom functions support', included: true },
        { text: 'Enterprise app integrations', included: true },
        { text: '24/7 Enterprise support', included: true },
        { text: 'Access to Value Engineering team', included: true },
        { text: 'Overage protection', included: true },
        { text: 'Advanced security features', included: true }
      ]
    }
  ];

  packages: Package[] = [
    {
      name: 'PREMIUM',
      price: 240,
      duration: '2 hours',
      subtitle: 'Professional coverage for your corporate event',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      gift: 'Fast content to post',
      features: [
        '+- 50 final photos in high quality',
        '3 to 5 clips (without edition)',
        'Professional coverage of key moments',
        'Curated set of edited images'
      ],
      extraHourPrice: 150
    },
    {
      name: 'PREMIUM',
      price: 440,
      duration: '2 hours',
      subtitle: 'Photography & Video coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      gift: 'Fast content to post',
      features: [
        'All photos edited in high quality',
        'All clips (without edition)',
        '1 trailer (YouTube format) OR 2 reels (Instagram/TikTok)',
        'Professional photography and video'
      ],
      extraHourPrice: 150
    },
    {
      name: 'DELUX',
      price: 590,
      duration: '2 hours',
      subtitle: 'Complete Photography + Video Package',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      featured: true,
      gift: 'Fast post + 10 photos to post during event',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (camera + phone clips)',
        '1 trailer (1.30 min) + 4 reels OR 6 reels',
        '2 cameras + 1 phone coverage',
        '10 photos to post straight during the event'
      ],
      extraHourPrice: 250
    },
    {
      name: 'PREMIUM',
      price: 400,
      duration: '4 hours',
      subtitle: 'Extended Photography Coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      gift: 'Fast post',
      features: [
        '+- 100 final photos in high quality',
        '3 to 5 clips (without edition)',
        'Extended event coverage',
        'All key moments captured'
      ],
      extraHourPrice: 150
    },
    {
      name: 'PREMIUM',
      price: 800,
      duration: '4 hours',
      subtitle: 'Extended Photography & Video',
      buttonText: 'Book Now',
      buttonClass: 'btn-dark',
      gift: 'Fast post',
      features: [
        'All photos edited in high quality',
        'All clips (without edition)',
        '1 trailer OR 2 reels',
        'Extended professional coverage'
      ],
      extraHourPrice: 150
    },
    {
      name: 'DELUX',
      price: 930,
      duration: '4 hours',
      subtitle: 'Premium Full Event Coverage',
      buttonText: 'Book Now',
      buttonClass: 'btn-primary',
      featured: true,
      gift: 'Fast post + 10 photos during event',
      features: [
        'All photos edited in high quality',
        'All clips in 4K (2 cameras + 1 phone)',
        '1 trailer + 4 reels OR 6 reels',
        '10 photos to post straight during event',
        'Complete professional coverage'
      ],
      extraHourPrice: 250
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Let\'s Meet',
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
      description: 'All material delivered within one week maximum. If we can deliver sooner, even better! You can request adjustments twice.',
      icon: '🎁'
    }
  ];

  scrollToPackages(): void {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
