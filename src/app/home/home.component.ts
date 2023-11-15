import {Component, effect, inject, signal} from '@angular/core';
import {ModalComponent} from "../shared/ui/modal.component";
import {Checklist} from "../shared/interfaces/checklist";
import {FormBuilder} from "@angular/forms";
import {FormModalComponent} from "../shared/ui/forms/form-modal.component";
import {ChecklistService} from "../shared/data-access/checklist.service";
import {ChecklistListComponent} from "./ui/checklist-list.component";
import { ButtonDirective } from '../shared/ui/forms/button.directive';
import { IconDirective } from '../shared/ui/icon.directive';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <header class="h-24 w-full flex flex-col self-start justify-center border-b border-b-gray-200">
      <h1 class="text-3xl">Quick Lists</h1>
    </header>

    <section class="h-fit flex flex-col gap-8 p-">
      <div class="flex gap-4 items-center">
        <button 
          button 
          icon="add"
          iconInvertColor
          iconSize="1rem"
          (click)="checklistBeingEdited.set({})">
          New Checklist
        </button>

        <button button outlined icon="filter" iconSize="1rem">
          Filters
        </button>
      </div>

      <app-checklist-list 
        [checklists]="checklistService.checklists()" 
        (delete)="checklistService.remove$.next($event)"
        (edit)="checklistBeingEdited.set($event)"
      />
    </section>

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="
            checklistBeingEdited()?.id
              ? checklistService.edit$.next({
                id: checklistBeingEdited()!.id!,
                data: checklistForm.getRawValue(),
              })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
        />
      </ng-template>
    </app-modal>
  `,
  host: {
    class: 'flex flex-col gap-6 h-full w-full py-8'
  },
  imports: [
    ModalComponent,
    FormModalComponent,
    ChecklistListComponent,
    ButtonDirective,
    IconDirective
  ]
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistService =  inject(ChecklistService);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if (!checklist) {
        this.checklistForm.reset();
        return;
      }

      this.checklistForm.patchValue({
        title: checklist.title
      });
    });
  }
}
