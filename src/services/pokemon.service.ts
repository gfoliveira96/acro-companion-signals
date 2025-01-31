import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Option } from '../interfaces/aux.interface'

@Injectable({ providedIn: 'root' })
export class PokemonService {
  
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
 
  constructor(private http: HttpClient) { }

  getPokemons(limit: number): Observable<Option[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`).pipe(
      map(response => response.results),
      switchMap(pokemons =>
        forkJoin(pokemons.map((pokemon: any) =>
          this.getPokemonDetails(pokemon.url)
        ))
      ),

      map((details: any) => details.map((d: any, index: number) => {
        return {
          index: index + 1,
          pokemonName: d.name,
          imageUrl: d.sprites.other['official-artwork'].front_default,
          soundUrl: d.cries?.latest || d.cries?.legacy,
          value: (index + 1) * 2,
          pokemonType: d.types.map((t: any) => t.type.name)
        };
      })),
    );
  }

  private getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }
}