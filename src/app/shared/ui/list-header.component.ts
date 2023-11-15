import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-list-header',
  template: `
    <header class="w-full flex flex-col gap-8 py-6">
      <div>
        <h1 class="h-16 w-full text-3xl border-b border-b-gray-200">{{ title }}</h1>
      </div>

      <menu class="flex gap-4 items-center">
        <ng-content></ng-content>
      </menu>
    </header>
  `,
})
export class ListHeaderComponent {
  @Input({ required: true}) title!: string;
}