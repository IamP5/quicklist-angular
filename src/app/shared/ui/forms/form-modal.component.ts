import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from './button.directive';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <section class="w-96">
      <form
        class="flex w-full flex-col gap-4 rounded-lg pg-4 bg-white shadow-md"
        [formGroup]="formGroup" 
        (ngSubmit)="save.emit(); close.emit()">

        @for (control of formGroup.controls | keyvalue; track control.key){
          <input
            class="w-full border border-gray-200 rounded-t-lg p-2"
            [id]="control.key"
            type="text"
            [placeholder]="control.key"
            [formControlName]="control.key"
          />
        }

        <footer class="flex gap-4 justify-end items-center p-4">
          <button class="w-16 p-1 text-sm" button outlined (click)="close.emit()">Close</button>
          <button class="w-16 p-1 text-sm" button type="submit">Save</button>
        </footer>
      </form>
    </section>
  `,
  imports: [ReactiveFormsModule, KeyValuePipe, ButtonDirective],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) title!: string;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
