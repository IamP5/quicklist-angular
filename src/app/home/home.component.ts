import {Component, effect, inject, signal} from '@angular/core';
import {ModalComponent} from "../shared/ui/modal.component";
import {Checklist} from "../shared/interfaces/checklist";
import {FormBuilder} from "@angular/forms";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ChecklistService} from "../shared/data-access/checklist.service";
import {ChecklistListComponent} from "./ui/checklist-list.component";

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <header class="h-24 w-full flex flex-col self-start justify-center border-b border-b-gray-200">
      <h1 class="text-3xl">Quick Lists</h1>
    </header>

    <section class="h-fit flex flex-col gap-8">
      <div class="flex gap-4">
        <button 
          class="bg-blue-700 rounded p-2 text-white text-sm hover:bg-blue-800" 
          (click)="checklistBeingEdited.set({})">
          New Checklist
        </button>
        <button 
          class=" rounded p-2 text-sm border border-b-gray-300">
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
    style: `
      display: flex;
      flex-direction: column;
      gap: 2rem;
      height: 100vh;
      padding: 2rem 4rem;
    `
  },
  imports: [
    ModalComponent,
    FormModalComponent,
    ChecklistListComponent
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
