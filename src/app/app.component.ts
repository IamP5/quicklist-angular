import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  host: {
    class: `w-full max-w-4xl h-screen flex flex-col px-16`,
  }
})
export class AppComponent {
  title = 'quicklists';
}
