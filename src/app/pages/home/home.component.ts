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

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly heroAutoplayReset$ = new Subject<void>();

  readonly desktopHeroSlides: string[] = [
    'assets/Portada.jpg',
    'assets/home-gallery/_JCM9071.jpg',
    'assets/home-gallery/_JCM5242.jpg',
    'assets/home-gallery/_JCM0693.jpg',
    'assets/home-gallery/_JCM0836-min.jpg',
  ];

  readonly mobileHeroSlides: string[] = [
    'assets/Portada.jpg',
    'assets/home-gallery/_JCM1855.jpg',
    'assets/home-gallery/_JCM5767-min.jpg',
    'assets/home-gallery/_JCM3136.jpg',
    'assets/home-gallery/_JCM0700.jpg',
  ];

  heroSlideIndex = 0;

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

  clientCategories: ClientCategory[] = [
    {
      title: 'Tourist Photoshoot',
      description:
        'Stunning portraits at Malta’s iconic spots—memories you’ll want to share long after your trip ends.',
      image: 'assets/home-gallery/_JCM3686.jpg',
    },
    {
      title: 'Couple Photoshoot',
      description:
        'Natural, romantic images that capture your connection—perfect for anniversaries, holidays, or just because.',
      image: 'assets/home-gallery/_JCM5767-min.jpg',
    },
    {
      title: 'Proposal Photoshoot',
      description:
        'Discreet coverage of the big moment plus beautiful couple shots—you’ll relive every second.',
      image: 'assets/home-gallery/_JCM8820.jpg',
    },
    {
      title: 'Maternity Photoshoot',
      description:
        'Beautiful maternity photoshoot at Malta’s iconic spots—memories you’ll want to share long after your pregnancy.',
      image: 'assets/home-gallery/_JCM5823-min.jpg',
    },
    {
      title: 'Corporative Events',
      description:
        'Professional event coverage that strengthens your brand—team photos, key moments, and polished visuals.',
      image: 'assets/home-gallery/_JCM2742.jpg',
    },
    {
      title: 'Content Creation',
      description:
        'Scroll-stopping photos and reels-ready content tailored to grow your personal brand or business.',
      image: 'assets/home-gallery/_JCM0849.jpg',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Sarah & James',
      description: 'Couple photoshoot, Valletta',
      quote:
        'Orlando made us feel completely at ease. The photos are stunning—we still get compliments every time we share them.',
      photo: 'assets/home-gallery/_JCM5767-min.jpg',
    },
    {
      name: 'Marco R.',
      description: 'Corporate event coverage',
      quote:
        'Professional from start to finish. He captured every key moment without being intrusive, and the deliverables exceeded our expectations.',
      photo: 'assets/home-gallery/_JCM0836-min.jpg',
    },
    {
      name: 'Elena V.',
      description: 'Tourist portrait session',
      quote:
        'We wanted memories of our trip to Malta that actually felt like us. The results were natural, beautiful, and worth every euro.',
      photo: 'assets/home-gallery/_JCM1087-min.jpg',
    },
    {
      name: 'David M.',
      description: 'Social media content',
      quote:
        'The content Orlando created for our brand looks polished and authentic. Our engagement went up noticeably after we posted the new shots.',
      photo: 'assets/home-gallery/_JCM6553-min.jpg',
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

  heroSlideBackground(src: string): string {
    return `linear-gradient(to bottom, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0) 40%), url('${src}')`;
  }

  goToHeroSlide(index: number): void {
    if (index === this.heroSlideIndex) {
      return;
    }

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
    this.heroSlideIndex = (this.heroSlideIndex + 1) % this.desktopHeroSlides.length;
  }
}
