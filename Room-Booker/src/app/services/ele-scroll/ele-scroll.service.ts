import { Injectable, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EleScrollService {

  constructor(@Inject(DOCUMENT) private document: Document, private location: Location) { }

  /**
   * Calls scrollToElementId but also updates url & browser history
   * @param base url base to apply the section too
   * @param section section string referencing an element ID
   */
  public scrollToElementSection(section: string) {
    this.location.go(this.location.path() + '#' + section);
    this.scrollToElementId(section);
  }

  /**
   * Scrolls to the element on the page with the requested id
   * @param id element id to scroll to
   */
  public scrollToElementId(id: string) {
    const ele = document.getElementById(id);
    if (ele === null) {
      return;
    }

    const topOfEle = ele.offsetTop;
    window.scroll({top: topOfEle, behavior: 'smooth'});
  }
}
