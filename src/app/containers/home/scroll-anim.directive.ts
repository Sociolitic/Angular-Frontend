import { Directive, ElementRef,Input,Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnim]'
})
export class ScrollAnimDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

}
