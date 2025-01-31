import { Component, ChangeDetectionStrategy, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusStore } from '../../stores/status.store';


@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
  @Input() boxIndex!: number;

  readonly store = inject(StatusStore);

  options=this.store.selectedOptions;
  boxIndexSignal=this.store.currentBoxIndex;

  selectBox(): void {
    this.store.selectBox(this.boxIndex);  
  }

}