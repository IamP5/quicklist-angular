import { Directive, ElementRef, Input, OnInit, Renderer2, booleanAttribute, inject } from "@angular/core";
/** create a type to validate the iconSize input.
 *  It should be any number followed by these measures units:
 * px, em, rem, vw, vh.
 */

type IconSize = `${number}${'px' | 'em' | 'rem' | 'vw' | 'vh'}`;

@Directive({
  selector: '[icon]',
  standalone: true,
})
export class IconDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  
  @Input({ required: true }) icon!: string;
  get iconPath() {
    return `assets/icons/${this.icon}.png`;
  }

  @Input({ required: true }) set iconSize(size: IconSize) {
    this.renderer.setStyle(this.img, 'height', size);
    this.renderer.setStyle(this.img, 'width', size);
  }

  @Input({ transform: booleanAttribute }) set iconInvertColor(invert: boolean) {
    if(invert) {
      this.renderer.setStyle(this.img, 'filter', 'invert(1)');
    }
  }

  img = this.renderer.createElement('img');

  ngOnInit(): void {
    this.renderer.setAttribute(this.img, 'src', this.iconPath);
    this.renderer.insertBefore(this.el.nativeElement, this.img, this.el.nativeElement.firstChild);
  }
}