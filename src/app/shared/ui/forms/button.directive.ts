import { Directive, HostBinding, Input, booleanAttribute } from '@angular/core';

const BUTTON_CLASSES = 'flex gap-2 items-center justify-center rounded p-2 text-sm';
const PRIMARY_CLASSES = 'bg-blue-700 text-white hover:bg-blue-800';
const OUTLINED_CLASSES = 'border border-b-gray-300';

@Directive({
  standalone: true,
  selector: 'button[button]',
})
export class ButtonDirective {
  @Input({ transform: booleanAttribute }) outlined = false;

  @HostBinding('class')
  get class() {
    let classes = `${BUTTON_CLASSES}`;

    if(this.outlined) {
      return `${classes} ${OUTLINED_CLASSES}`;
    }

    return `${classes} ${PRIMARY_CLASSES}`;
  }
}