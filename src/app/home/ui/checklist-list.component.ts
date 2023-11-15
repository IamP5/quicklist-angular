import {Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {Checklist, RemoveChecklist} from "../../shared/interfaces/checklist";
import {Router, RouterLink} from "@angular/router";
import { ButtonDirective } from '../../shared/ui/forms/button.directive';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  template: `
    <ul class="flex flex-col gap-3">
      @for (checklist of checklists; track checklist.id) {
        <li class="border border-gray-200 p-4 rounded-lg flex items-center gap-4">
          <div class="w-11/12 hover:cursor-pointer"(click)="router.navigate(['/checklist', checklist.id])">
            <h3>
              {{ checklist.title }}
            </h3>
          </div>
          <div class="w-1/12 flex gap-4 items-center justify-end">
            <img src="assets/icons/edit.png" class="w-4 h-4 hover:cursor-pointer" (click)="edit.emit(checklist)">
            <img src="assets/icons/delete.png" class="w-5 h-5 hover:cursor-pointer" (click)="delete.emit(checklist.id)"/>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  imports: [RouterLink, ButtonDirective],
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
  @Output() delete = new EventEmitter<RemoveChecklist>();
  @Output() edit = new EventEmitter<Checklist>();

  router = inject(Router);
}
