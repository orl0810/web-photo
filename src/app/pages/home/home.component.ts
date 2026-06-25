import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval, startWith, switchMap } from 'rxjs';
import { scrollToElementId } from '../../shared/utils/scroll-to-element';

interface Service {
  title: string;
  description: string;
  image: string;
  route: string;
  icon: string;
}

interface ClientCategory {
  title: string;
  description: string;
  image: string;
}

interface Testimonial {
  name: string;
  description: string;
  quote: string;
  photo: string;
}

@Component({
	standalone: false,
	templateUrl: './home.component.html',
	styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  readonly heroSlideIntervalMs = 5000;
  readonly immediateClientRenderCount = 2;

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly heroAutoplayReset$ = new Subject<void>();
  private readonly loadedHeroSlideIndices = new Set<number>([0]);

  readonly desktopHeroSlides: string[] = [
    'assets/site/portada.webp',
    'assets/site/session-featured-02.webp',
    'assets/site/session-featured-07.webp',
    'assets/site/session-jcm0693.webp',
    'assets/site/session-featured-13-excelencia.webp',
  ];

  readonly mobileHeroSlides: string[] = [
    'assets/site/portada.webp',
    'assets/site/session-jcm1855.webp',
    'assets/site/session-featured-20-uchenna.webp',
    'assets/site/session-jcm3136.webp',
    'assets/site/session-jcm0700.webp',
  ];

  heroSlideIndex = 0;

  services: Service[] = [
    {
      title: 'Photo Sessions',
      description: 'Natural sessions for tourists, couples, portraits, and lifestyle memories in Malta.',
      image: 'assets/site/session-featured-14-aru.webp',
      route: '/services/photo-sessions',
      icon: '📸'
    },
    {
      title: 'Events',
      description: 'Professional event coverage for corporate gatherings, private events, launches, and celebrations.',
      image: 'assets/site/session-jcm0693.webp',
      route: '/services/events',
      icon: '🎉'
    },
    {
      title: 'Social Media Content',
      description: 'Photo and reel-ready content for businesses, creators, and local brands that need consistency.',
      image: 'assets/site/session-jcm6693.webp',
      route: '/services/social-media',
      icon: '📱'
    }
  ];

  clientCategories: ClientCategory[] = [
    {
      title: 'Tourist Photoshoot',
      description:
        'Stunning portraits at Malta’s iconic spots—memories you’ll want to share long after your trip ends.',
      image: 'assets/site/session-featured-03.webp',
    },
    {
      title: 'Couple Photoshoot',
      description:
        'Natural, romantic images that capture your connection—perfect for anniversaries, holidays, or just because.',
      image: 'assets/site/session-featured-20-uchenna.webp',
    },
    {
      title: 'Proposal Photoshoot',
      description:
        'Discreet coverage of the big moment plus beautiful couple shots—you’ll relive every second.',
      image: 'assets/site/session-jcm8820.webp',
    },
    {
      title: 'Maternity Photoshoot',
      description:
        'Beautiful maternity photoshoot at Malta’s iconic spots—memories you’ll want to share long after your pregnancy.',
      image: 'assets/site/session-featured-21-jessica.webp',
    },
    {
      title: 'Corporative Events',
      description:
        'Professional event coverage that strengthens your brand—team photos, key moments, and polished visuals.',
      image: 'assets/site/event-jcm2742.webp',
    },
    {
      title: 'Content Creation',
      description:
        'Scroll-stopping photos and reels-ready content tailored to grow your personal brand or business.',
      image: 'assets/site/session-jcm0849.webp',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Madalina 💅🏻',
      description: 'Street photoshoot, Valletta',
      quote:
        "OH MY GOD!!!! Orlando, they are amazing!!!! 😍😍😍 I'm sharing them already with my parents 😂😂😂 Thank you soo sooo much!!! Absolutely loved the editing 😍😍😍",
      photo: 'assets/site/session-jcm3882.webp',
    },
    {
      name: 'Geeta & Graham 💍',
      description: 'Engagement photoshoot, Ghadira Bay',
      quote:
        'Hi! It’s I who should be thanking you so much for your wonderful service and making my dream engagement photoshoot come to life, for being so easygoing and relaxed to work with and gaining a friend for life 🥹 we’ve received the most beautiful photos of us we will always look back at and cherish forever thanks to you! 😍🥰',
      photo: 'assets/site/session-jcm1432.webp',
    },
  ];

  activeTestimonialIndex = 0;

  readonly whatsAppContactUrl =
    'https://wa.me/35679552176?text=' +
    encodeURIComponent(
      "Hi Orlando! I have a question about your services and I'd love to chat.",
    );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initHeroAutoplay();

    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'services') {
        this.scrollToServices();
      }
    });
  }

  shouldLoadHeroSlide(index: number): boolean {
    return this.loadedHeroSlideIndices.has(index);
  }

  isPriorityHeroSlide(index: number): boolean {
    return index === 0;
  }

  shouldRenderClientImmediately(index: number): boolean {
    return index < this.immediateClientRenderCount;
  }

  isPriorityClientImage(index: number): boolean {
    return index < this.immediateClientRenderCount;
  }

  goToHeroSlide(index: number): void {
    if (index === this.heroSlideIndex) {
      return;
    }

    this.preloadHeroSlide(index);
    this.heroSlideIndex = index;
    this.cdr.detectChanges();
    this.heroAutoplayReset$.next();
  }

  navigateToService(route: string): void {
    this.router.navigate([route]);
  }

  get activeTestimonial(): Testimonial {
    return this.testimonials[this.activeTestimonialIndex];
  }

  previousTestimonial(): void {
    this.activeTestimonialIndex =
      (this.activeTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex + 1) % this.testimonials.length;
  }

  private scrollToServices(): void {
    setTimeout(() => scrollToElementId('services'), 100);
  }

  private initHeroAutoplay(): void {
    this.heroAutoplayReset$
      .pipe(
        startWith(void 0),
        switchMap(() => interval(this.heroSlideIntervalMs)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.advanceHeroSlide();
        this.cdr.detectChanges();
      });
  }

  private advanceHeroSlide(): void {
    const nextIndex = this.nextHeroSlideIndex(this.heroSlideIndex);
    this.preloadHeroSlide(nextIndex);
    this.heroSlideIndex = nextIndex;
  }

  private nextHeroSlideIndex(currentIndex: number): number {
    return (currentIndex + 1) % this.desktopHeroSlides.length;
  }

  private preloadHeroSlide(index: number): void {
    if (this.loadedHeroSlideIndices.has(index)) {
      return;
    }

    this.loadedHeroSlideIndices.add(index);
    this.cdr.markForCheck();
  }
}
