import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { StatusStore } from './stores/status.store';
import { HttpClientModule } from '@angular/common/http';
import { BoxComponent } from './components/box/box.component';
import { OptionSelectorComponent } from './components/optionSelector/option-selector.component';

@Component({
  selector: 'app-root',
  imports:[BoxComponent, OptionSelectorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./global_styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  @ViewChild('pokemonAudio') pokemonAudio!: ElementRef<HTMLAudioElement>;

  boxes = Array(10);
  mp3Music: string = "https://vgmsite.com/soundtracks/pokemon-ten-years-of-pokemon/refozwlafz/01.%20Pokémon%20Theme%20(Season%20Theme).mp3";
  readonly store = inject(StatusStore);

  totalCount=this.store.totalValue;
  currentBoxIndex = this.store.currentBoxIndex;
  options = this.store.pokemons;
  loader = this.store.loading;


  ngOnInit(): void {
    document.addEventListener('click', this.firstClickHandler.bind(this));
  }

  private firstClickHandler() {
    this.playAudio();
    document.removeEventListener('click', this.firstClickHandler);
  }

  playAudio() {
    try {
      let audio = this.pokemonAudio.nativeElement;
      audio.volume = 0.01;
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  clear(): void {
    this.store.clearAll();
  }
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule)
  ]
});

