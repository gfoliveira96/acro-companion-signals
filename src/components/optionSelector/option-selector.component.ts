import { Component, ChangeDetectionStrategy, Input, ElementRef, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Option } from '../../interfaces/aux.interface';
import { StatusStore } from '../../stores/status.store';

@Component({
  selector: 'app-option-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option-selector.component.html',
  styleUrls: ['./option-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectorComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() option!: Option;

  readonly store = inject(StatusStore);

  readonly isSelected = computed(() => {
    let currentBoxIndex = this.store.currentBoxIndex();
    if (currentBoxIndex === null) return false;
    return this.store.selectedOptions()[currentBoxIndex]?.index === this.option.index;
  });
  

  selectOption(option: Option): void {
    this.store.selectOption(option);

    if (this.audioPlayer) {
      let audio = this.audioPlayer.nativeElement
      audio.load();  // Reloads to allow multiple executions
      audio.play().catch(error => console.error("Error playing audio:", error));
      audio.volume = 0.02;
    }
  }

}