import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	standalone: false,
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
        section: 'general',
        title: '💡 General & During',
        img: 'gozo-climbs-couple-photoshoot.jpg',
        alt: 'gozo-climbs-couple-photoshoot.jpg',
        tips: [
          'No need to pose perfectly — I’ll guide you naturally.',
          'Most important is to look comfortable for the camera',
          'Do NOT eat gum during the session.',
          'Do NOT leave big elements (like your phone) in your pants pockets.'
        ]
      },
      {
        section: 'style',
        title: '👗 Outfit & Style',
        img: 'gozo-climbs-couple-photoshoot.jpg',
        alt: 'gozo-climbs-couple-photoshoot.jpg',
        tips: [
          'Use complementary colors (left wheel) to generate contrast.',
          'Use analog colors (right wheel) to reflect harmony.',
          'Avoid large logos or text. Simplicity is key.',
          'Accessories like earrings, hats, umbrella, fan, glasses... are more than welcome',
          'Neutral or warm tones work beautifully in Malta’s light.',
          'Couples: coordinate, don’t match identically.',
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
        title: '🧴 Skin & Wellness', img: 'your-image-4.jpg',
        tips: [
          'Stay hydrated and get good rest the night before.',
          'Use sunscreen (but avoid shine on the face).'
        ]
      },
      {
        section: 'location',
        title: '📍 Meeting Point', img: 'your-image-5.jpg',
        tips: [
          'I’ll send you the exact location the day before the shoot.',
          'Some streets have stairs or cobblestones—comfy shoes help.'
        ]
      },
      {
        section: 'after',
        title: '💬  After', img: 'your-image-6.jpg',
        tips: [
          'You’ll receive your photos on a link where you can download all of them.',
          'This link will last active for 1 month.'
        ]
      }
    ],
    es: [
      {
        section: 'time',
        title: '🕒 ¡El tiempo es tuyo!',
        img: '../../../assets/home-portfolio/_JCM5823-min.jpg',
        alt: 'marsaskala-couple-photoshoot.jpg',
        tips: [
          'Puedo devolverte el dinero, pero no el tiempo.',
          'Planifica el tráfico, el aparcamiento o las calles peatonales, especialmente en zonas como Sliema o Mdina.',
          'Yo estaré allí 10 minutos antes y, si tú también, ¡podremos hacer más fotos 😉!'
        ]
      },
      {
        section: 'general',
        title: '💡 General & Durante la sesión',
        img: 'gozo-climbs-couple-photoshoot.jpg',
        alt: 'gozo-climbs-couple-photoshoot.jpg',
        tips: [
          'No necesitas posar perfectamente — te guiaré de forma natural.',
          'Lo más importante es que te veas cómodo/a frente a la cámara.',
          'NO mastiques chicle durante la sesión.',
          'NO dejes objetos grandes (como el móvil) en los bolsillos del pantalón.'
        ]
      },
      {
        section: 'style',
        title: '👗 Vestuario & Estilo',
        img: 'gozo-climbs-couple-photoshoot.jpg',
        alt: 'gozo-climbs-couple-photoshoot.jpg',
        tips: [
          'Usa colores complementarios (rueda izquierda) para generar contraste.',
          'Usa colores análogos (rueda derecha) para transmitir armonía.',
          'Evita logos grandes o texto. La simplicidad es clave.',
          'Accesorios como pendientes, sombreros, paraguas, abanicos o gafas son más que bienvenidos.',
          'Los tonos neutros o cálidos funcionan genial con la luz de Malta.',
          'Parejas: coordinad, pero no vayáis vestidos exactamente igual.'
        ]
      },
      {
        section: 'makeup',
        title: '💄 Maquillaje & Pelo',
        img: 'your-image-3.jpg',
        alt: 'your-image-3.jpg',
        tips: [
          'Opta por un maquillaje suave pero definido para destacar en cámara.',
          'El viento es habitual — usa laca si llevas el pelo suelto.'
        ]
      },
      {
        section: 'skin',
        title: '🧴 Piel & Bienestar',
        img: 'your-image-4.jpg',
        tips: [
          'Mantente bien hidratado/a y duerme bien la noche anterior.',
          'Usa protector solar (pero evita el brillo excesivo en el rostro).'
        ]
      },
      {
        section: 'location',
        title: '📍 Punto de encuentro',
        img: 'your-image-5.jpg',
        tips: [
          'Te enviaré la ubicación exacta el día anterior a la sesión.',
          'Algunas calles tienen escaleras o adoquines — llevar calzado cómodo ayuda.'
        ]
      },
      {
        section: 'after',
        title: '💬 Después',
        img: 'your-image-6.jpg',
        tips: [
          'Recibirás tus fotos a través de un link privado.',
          'Este link puede durar activo un mes.'
        ]
      }
    ],
  };

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
  }

}
