import {Component, computed, effect, inject, signal} from '@angular/core';
import {ChecklistService} from "../shared/data-access/checklist.service";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {ChecklistItemService} from "./data-access/checklist-item.service";
import {FormBuilder} from "@angular/forms";
import {ChecklistItem} from "../shared/interfaces/checklist-item";
import {ModalComponent} from "../shared/ui/modal.component";
import {FormModalComponent} from "../shared/ui/forms/form-modal.component";
import {ChecklistItemListComponent} from "./ui/checklist-item-list.component";
import { ListHeaderComponent } from '../shared/ui/list-header.component';
import { ButtonDirective } from '../shared/ui/forms/button.directive';
import { IconDirective } from '../shared/ui/icon.directive';

@Component({
  standalone: true,
  selector: 'app-checklist',
  template: `
    @if (checklist(); as checklist){
      <app-list-header title="Quick Lists">
          <button 
            button 
            icon="add"
            iconInvertColor
            iconSize="1rem"
            (click)="checklistItemBeingEdited.set({})">
            New Item
          </button>

          <button button outlined icon="filter" iconSize="1rem">
            Filters
          </button>

          <button 
            button 
            outlined 
            (click)="checklistItemService.reset$.next(checklist.id)">
            Reset
          </button>
      </app-list-header>
      
      <app-checklist-item-list 
        [checklistItems]="items()"
        (delete)="checklistItemService.remove$.next($event)"
        (edit)="checklistItemBeingEdited.set($event)"
        (toggle)="checklistItemService.toggle$.next($event)"
      />

      <app-modal [isOpen]="!!checklistItemBeingEdited()">
        <ng-template>
          <app-form-modal
            title="Create item"
            [formGroup]="checklistItemForm"
            (save)="
              checklistItemBeingEdited()
                ? checklistItemService.edit$.next({
                    id: checklistItemBeingEdited()!.id!,
                    data: checklistItemForm.getRawValue(),
                  })
                : checklistItemService.add$.next({
                    item: checklistItemForm.getRawValue(),
                    checklistId: checklist?.id!,
                  })
            "
            (close)="checklistItemBeingEdited.set(null)"
          ></app-form-modal>
        </ng-template>
      </app-modal>
    }
  `,
  host: {
    class: 'flex flex-col gap-6 h-screen w-full py-8'
  },
  imports: [
    ModalComponent,
    FormModalComponent,
    ChecklistItemListComponent,
    ListHeaderComponent,
    ButtonDirective,
    IconDirective
  ],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
        return;
      }

      this.checklistItemForm.patchValue({
        title: checklistItem.title,
      });
    });
  }
}
