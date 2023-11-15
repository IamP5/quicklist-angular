import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: `<div></div>`,
})
export class ModalComponent {
  dialog = inject(Dialog);

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template, {
        panelClass: [
          '!absolute', 'w-full', 'h-full',
          'top-0', 'left-0', 'right-0', 'bottom-0',
          'flex', 'justify-center', 'items-center',
        ],
        backdropClass: [
          'fixed', 'top-0', 'left-0', 
          'right-0', 'bottom-0', 'bg-black', 'opacity-50'
        ],
      });
    } else {
      this.dialog.closeAll();
    }
  }

  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
}
