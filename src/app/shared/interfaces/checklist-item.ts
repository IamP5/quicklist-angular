import { Checklist } from './checklist';

export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export type AddChecklistItem = {
  item: Omit<ChecklistItem, 'id' | 'checklistId' | 'checked'>;
  checklistId: Checklist['id'];
};
export type EditChecklistItem = {
  id: ChecklistItem['id'];
  data: AddChecklistItem['item'];
};
export type RemoveChecklistItem = ChecklistItem['id'];
export type ToggleChecklistItem = ChecklistItem['id'];
export type ResetChecklistItem = ChecklistItem['id'];