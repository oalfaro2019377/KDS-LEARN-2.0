import { trigger, style, animate, transition, state } from '@angular/animations';

export const fadeIn = 
    trigger('fadeIn', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('800ms linear')
      ])
    ])


   export const photoState = 
   trigger('photoState', [
     state('spin', style({
       transform: 'rotateY(180deg) rotateZ(90deg)',
     })),
     transition('spin => move', animate ('200ms ease-out')),
     transition('* => *', animate('500ms ease')),
   ])