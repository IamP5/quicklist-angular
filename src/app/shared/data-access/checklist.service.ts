import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { EMPTY, Subject, catchError, map, merge } from 'rxjs';
import { AddChecklist, Checklist, EditChecklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';
import { connect } from 'ngxtension/connect'

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklistItemService = inject(ChecklistItemService);
  private storageService = inject(StorageService);

  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // sources
  private checklistsLoaded$ = this.storageService.loadChecklists().pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    }),
  );
  private error$ = new Subject<string>();
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;

  constructor() {
    const nextState$ = merge(
      this.checklistsLoaded$.pipe(
        map((checklists) => ({ checklists, loaded: true }))
      ),
      this.error$.pipe(map((error) => ({ error })))
    )

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, checklist) => ({
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
      .with(this.edit$, (state, { id, data }) => ({
        checklists: state.checklists.map((checklist) =>
          checklist.id === id ? { ...checklist, title: data.title } : checklist
        ),
      }))
      .with(this.remove$, (state, id) => ({
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
      }))

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
