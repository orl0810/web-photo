import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	templateUrl: './suggestions.component.html',
	styleUrls: ['./suggestions.component.scss'],
})
export class SuggestionsComponent implements OnInit, OnDestroy {

    currentLang: 'en' | 'es' = 'en';

    segments = [
        '#00aeef', // 1. Azul medio
        'rgb(18 226 173 / 92%', // 2. Azul claro
        '#00a651', // 3. Verde
        '#8cc63f', // 4. Verde lima
        '#fff200', // 5. Amarillo
        'rgb(247, 148, 29)', // 6. Amarillo anaranjado
        '#f15a24', // 7. Naranja
        'rgb(229 63 19)', // 8. Rojo
        'rgb(236 0 0)', // 9. Rojo
        '#92278f', // 10. Violeta
        '#662d91', // 11. Púrpura oscuro
        '#2e3192'  // 12. Azul oscuro
      ];

      activeIndices1 = [0, 6]; // inicial: 0 y su opuesto (6 posiciones adelante)
      intervalId1: any;

      activeIndices2 = [0, 1, 2]; // inicial: 0 y su opuesto (6 posiciones adelante)
      intervalId2: any;

      ngOnInit() {
        this.startAnimation();
        this.startSecondAnimation();
      }

      startAnimation() {
        let index = 0;
        this.intervalId1 = setInterval(() => {
          this.activeIndices1 = [index, (index + 6) % 12];
          index = (index + 1) % 12;
        }, 1500); // Cambia pareja cada 1.5s
      }

      startSecondAnimation() {
        let index = 0;
        this.intervalId2 = setInterval(() => {
          this.activeIndices2 = [index, (index + 1) % 12, (index + 2) % 12];
          index = (index + 1) % 12;
        }, 1500); // Cambia pareja cada 1.5s
      }

      ngOnDestroy() {
        clearInterval(this.intervalId1);
        clearInterval(this.intervalId2);
      }


      get segmentsReversed() {
        return [...this.segments].reverse();
      }


  content = {
    en: [
      {
        section: 'time',
        title: '🕒 Time is yours!',
        img: '../../../assets/home-portfolio/_JCM5823-min.jpg',
        alt: 'marsaskala-couple-photoshoot.jpg',
        tips: [
            'I could give u the money back but not the time.',
            'Plan for traffic, parking or pedestrian streets, especially in places like Sliema or Mdina.',
            "I'll be there 10 min before and if you too we can do more photos ;)"
        ]
      },
      {
        section: 'style',
        title: '👗 Outfit & Style',
        img: 'gozo-climbs-couple-photoshoot.jpg',
        alt: 'gozo-climbs-couple-photoshoot.jpg',
        tips: [
            'Avoid large logos or text. Simplicity is key.',
            'Neutral or warm tones work beautifully in Malta’s light.',
            'Couples: coordinate, don’t match identically.'
        ]
      },
      {
        section: 'makeup',
        title: '💄 Makeup & Hair',
        img: 'your-image-3.jpg',
        alt: 'your-image-3.jpg',
        tips: [
            'Go for soft yet defined makeup to stand out on camera.',
            'Wind is common—use hairspray if wearing hair down.'
        ]
    },
      {
        section: 'skin',
        title: '🧴 Skin & Wellness', img: 'your-image-4.jpg', tips: ['Stay hydrated and get good rest the night before.', 'Use sunscreen (but avoid shine on the face).'] },
      {
        section: 'location',
        title: '📍 Meeting Point', img: 'your-image-5.jpg', tips: ['I’ll send you the exact location the day before the shoot.', 'Some streets have stairs or cobblestones—comfy shoes help.'] },
      {
        section: 'after',
        title: '💬 During & After', img: 'your-image-6.jpg', tips: ['No need to pose perfectly—I’ll guide you naturally.', 'You’ll receive your photos via a private online portfolio.'] }
    ],
    es: [
      {
        section: 'time',
      title: '🕒 Llega a Tiempo', img: 'your-image-1.jpg', tips: ['Llega 10–15 minutos antes para empezar relajado.', 'Ten en cuenta el tráfico o calles peatonales, especialmente en lugares como Valletta o Mdina.'] },
      {
        section: 'style', title: '👗 Ropa y Estilo', img: 'your-image-2.jpg', tips: ['Evita logos grandes o textos. La simplicidad es clave.', 'Los tonos neutros o cálidos lucen mejor con la luz de Malta.', 'Parejas: combinen sin vestir exactamente igual.'] },
      { section: 'makeup', title: '💄 Maquillaje y Pelo', img: 'your-image-3.jpg', tips: ['Usa un maquillaje suave pero definido para destacar.', 'El viento es común—usa fijador si llevas el pelo suelto.'] },
      { section: 'skin', title: '🧴 Piel y Bienestar', img: 'your-image-4.jpg', tips: ['Mantente hidratado y duerme bien la noche anterior.', 'Usa protector solar (evita el brillo en el rostro).'] },
      { section: 'location', title: '📍 Punto de Encuentro', img: 'your-image-5.jpg', tips: ['Te enviaré la ubicación exacta el día anterior.', 'Algunas calles tienen escaleras o adoquines—lleva calzado cómodo.'] },
      { section: 'after', title: '💬 Durante y Después', img: 'your-image-6.jpg', tips: ['No necesitas posar perfecto—te iré guiando.', 'Recibirás tus fotos en una galería privada online.'] }
    ]
  };

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
  }

}
