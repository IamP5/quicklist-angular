import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, map, merge } from 'rxjs';
import {
  AddChecklistItem,
  ChecklistItem, EditChecklistItem, RemoveChecklistItem, ResetChecklistItem, ToggleChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { StorageService } from '../../shared/data-access/storage.service';
import { RemoveChecklist } from '../../shared/interfaces/checklist';
import { connect } from 'ngxtension/connect';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private storageService = inject(StorageService);

  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // sources
  private checklistItemsLoaded$ = this.storageService.loadChecklistItems().pipe(
    catchError((err) => { 
      this.error$.next(err); 
      return EMPTY; 
    }),
  )
  private error$ = new Subject<string>();
  add$ = new Subject<AddChecklistItem>();
  toggle$ =  new Subject<ToggleChecklistItem>();
  reset$ = new Subject<ResetChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  checklistRemoved$ = new Subject<RemoveChecklist>();

  constructor() {
    const nextState$ = merge(
      this.checklistItemsLoaded$.pipe(
        map((checklistItems) => ({ checklistItems, loaded: true }))
      ),
      this.error$.pipe(map((error) => ({ error })))
    )

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, checklistItem) => ({
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
      .with(this.toggle$, (state, checkListItemId) => ({
        checklistItems: state.checklistItems.map((item) =>
          item.id === checkListItemId
            ? {...item, checked: !item.checked}
            : item
        ),
      }))
      .with(this.reset$, (state, checkListId) => ({
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checkListId ? {...item, checked: false} : item
        ),
      }))
      .with(this.edit$, (state, { id, data }) => ({
        checklistItems: state.checklistItems.map((item) =>
          item.id === id ? {...item, title: data.title} : item
        ),
      }))
      .with(this.remove$, (state, id) => ({
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      }))
      .with(this.checklistRemoved$, (state, checklistId) => ({
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId
        ),
      }))

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
