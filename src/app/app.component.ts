import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [CommonModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('openClose', [
      transition('* => *', [
        style({ opacity: 0,
        }),
        animate('300ms', style({ opacity: 1 }))
      ])    
    ])
  ]
})
export class AppComponent {
  private speech = window.speechSynthesis;
  public keysPressed: string[] = []

  spokenLanguage = signal<string>('sv');

  lastKeyPressed = signal<{index: number; key: string} | undefined>(undefined);

  constructor() {
    const urlLanguage = new URLSearchParams(location.search).get('language');
    if (urlLanguage) {
      this.spokenLanguage.set(urlLanguage)
    }

    document.addEventListener('keyup', ({key}) => {
      if(/^[a-zA-Z]$/.test(key)) {
        const showLetter = key.toLocaleUpperCase()
        const readLetter = key.toLocaleLowerCase();
        const index = this.keysPressed.push(showLetter)
        this.lastKeyPressed.set({index, key: showLetter})

        //  Play sound for letter
        this.readOut(readLetter)
      }

      if (key === 'Enter') {
        this.readOut(this.keysPressed.join(''))
      }

      if (key === 'Backspace') {
        this.keysPressed = [];
        this.lastKeyPressed.set(undefined)
      }
    })
  }

  private readOut(letter: string) {
    const utterThis = new SpeechSynthesisUtterance(letter);

    utterThis.lang = this.spokenLanguage()
    utterThis.rate = 0.5;

    this.speech.speak(utterThis)
  }
}
