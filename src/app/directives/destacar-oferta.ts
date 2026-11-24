import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDestacarOferta]',
  standalone: true
})
export class DestacarOferta implements OnChanges {
  @Input() appDestacarOferta: boolean = false;
  @Input() stock: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.appDestacarOferta) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #0f766e');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f0fdfa');
    } else if (this.stock <= 5) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #d97706');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#fffbeb');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #ddd');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ffffff');
    }
  }
}