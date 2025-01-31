import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { AppState, Option } from '../interfaces/aux.interface';
import { PokemonService } from '../services/pokemon.service';

//withState: Sets the initial state
//withComputed: Defines the values derived from the state
//withMethods: Defines the methods that manipulate the state
//withHooks : Defines functions that will be executed at specific moments in the state's life cycle 

const initialState: AppState = {
  selectedOptions: Array(),
  currentBoxIndex: null,
  loading:false,
  pokemons: [],
};

export const StatusStore = signalStore(
  { providedIn: 'root' },
  withState(initialState), //*STATE*

  withComputed((store) => ({  //*COMPUTED*
    totalValue: computed(() => 
    store.selectedOptions().reduce((total, option) => total + (option?.value || 0), 0)
    )
  })),

  withMethods((store) => {
    let pokemonService = inject(PokemonService); 
    return {
    
    loadState() {
      let saved = localStorage.getItem('boxState');
      if (saved) {
        let parsed = JSON.parse(saved);
        patchState(store, parsed);
      }
    },

    selectBox(index: number) {
      patchState(store, { currentBoxIndex: index });
    },

    selectOption(option: Option) {
      let currentIndex = store.currentBoxIndex();
      if (currentIndex === null) return;

      let newOptions = [...store.selectedOptions()];
      newOptions[currentIndex] = option;

      let nextIndex;

      if (currentIndex < 9) {
        nextIndex = currentIndex + 1;
      } else if (currentIndex === 9) {
        nextIndex = currentIndex
      } else {
        nextIndex = null;
      }

      patchState(store, { 
        selectedOptions: newOptions,
        currentBoxIndex: nextIndex
      });
    },

    clearAll() {
      patchState(store, { 
        selectedOptions: [], 
        currentBoxIndex: null, 
      });
    },

    loadPokemons(limit: number) {
        patchState(store, { loading: true });
        pokemonService.getPokemons(limit).subscribe({
          next: (options) => {
            patchState(store, { pokemons: options });
            patchState(store, { loading: false }); 
          },
          error: () => {
            patchState(store, { loading: false });
          }
        });
      },
    };
  }),
  
  withHooks({//*HOOKS*
    onInit(store) {
      store.loadState();
      store.loadPokemons(84);
      
      effect(() => {
        localStorage.setItem('boxState', JSON.stringify({
          selectedOptions: store.selectedOptions(),
          currentBoxIndex: store.currentBoxIndex()
        }));
      });
    }
  })
);