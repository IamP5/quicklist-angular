import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChecklistItem, RemoveChecklistItem, ToggleChecklistItem} from "../../shared/interfaces/checklist-item";

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (item of checklistItems; track item.id){
      <li>
        <div>
          @if (item.checked){
            <span>✅</span>
          }

          {{ item.title }}
        </div>

        <div>
          <button (click)="toggle.emit(item.id)">Toggle</button>
          <button (click)="edit.emit(item)">Edit</button>
          <button (click)="delete.emit(item.id)">Delete</button>
        </div>
      </li>
    } @empty {
      <h1 class="text-gray-400 h-full w-full grid place-items-center pb-24">You have no items in this Checklist</h1>
    }
  `,
  host: {
    class: 'h-full',
  },
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() delete = new EventEmitter<RemoveChecklistItem>();
  @Output() edit = new EventEmitter<ChecklistItem>();
  @Output() toggle = new EventEmitter<ToggleChecklistItem>();
}
