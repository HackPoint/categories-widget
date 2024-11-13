import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { AccordionToggleService } from './accordion-toggle.service';

@Directive({
  selector: '[appAccordionToggle]',
  standalone: true
})
export class AccordionToggleDirective {
  @Input() toggleIcon!: HTMLElement;
  @Input() targetContent!: HTMLElement;
  @Input() itemId!: string; // Unique identifier for each item

  private isExpanded = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private accordionService: AccordionToggleService
  ) {}

  @HostListener('click')
  onClick() {
    const currentActiveItemId = this.accordionService.getActiveItem();

    if (currentActiveItemId === this.itemId) {
      this.accordionService.setActiveItem(null);
      this.closeAccordion();
    } else {
      // Close the currently active item, if any
      if (currentActiveItemId) {
        const activeElement = document.getElementById(currentActiveItemId);
        if (activeElement) {
          this.renderer.setStyle(activeElement, 'maxHeight', '0px');
          activeElement.classList.remove('expanded', 'bg-blue-100');
        }
      }

      // Set this item as the active one and open it
      this.accordionService.setActiveItem(this.itemId);
      this.openAccordion();
    }
  }

  private openAccordion() {
    this.isExpanded = true;
    this.renderer.addClass(this.targetContent, 'expanded');
    this.renderer.addClass(this.el.nativeElement, 'bg-blue-100'); // Highlight the selected item
    this.renderer.setStyle(this.targetContent, 'maxHeight', `${this.targetContent.scrollHeight}px`);
    if (this.toggleIcon) this.renderer.addClass(this.toggleIcon, 'rotate-180');
  }

  private closeAccordion() {
    this.isExpanded = false;
    this.renderer.removeClass(this.targetContent, 'expanded');
    this.renderer.removeClass(this.el.nativeElement, 'bg-blue-100'); // Remove highlight from unselected item
    this.renderer.setStyle(this.targetContent, 'maxHeight', '0px');
    if (this.toggleIcon) this.renderer.removeClass(this.toggleIcon, 'rotate-180');
  }
}
