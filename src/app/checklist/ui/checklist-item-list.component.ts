import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChecklistItem} from "../../shared/interfaces/checklist-item";

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <ul>
        @for (item of checklistItems; track item.id){
        <li>
          <div>
        {{ item.title }}
        </div>
      </li>
        } @empty {
        <div>
          <h2>Add an item</h2>
          <p>Click the add button to add your first item to this quicklist</p>
        </div>
        }
      </ul>
    </section>
  `,
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
}
