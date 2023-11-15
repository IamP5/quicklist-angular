import {Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {Checklist, RemoveChecklist} from "../../shared/interfaces/checklist";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  template: `
    <ul class="flex flex-col gap-3">
      @for (checklist of checklists; track checklist.id) {
        <li
          class="border border-gray-200 p-4 rounded-lg flex justify-between items-center gap-4"
          (click)="router.navigate(['/checklist', checklist.id])">
          <h3>
            {{ checklist.title }}
          </h3>
          <div class="flex gap-2">
            <button class="text-xs" (click)="edit.emit(checklist)">Edit</button>
            <button class="text-xs" (click)="delete.emit(checklist.id)">Delete</button>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  imports: [RouterLink],
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
  @Output() delete = new EventEmitter<RemoveChecklist>();
  @Output() edit = new EventEmitter<Checklist>();

  router = inject(Router);
}
