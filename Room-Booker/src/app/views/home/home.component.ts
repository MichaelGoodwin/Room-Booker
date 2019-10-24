import { Component, OnInit } from '@angular/core';
import { EleScrollService } from 'src/app/services/ele-scroll/ele-scroll.service';
import { faUsers, faUserShield, faBell, faBrush } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  faUsers = faUsers;
  faUserShield = faUserShield;
  faBell = faBell;
  faBrush = faBrush;

  constructor(private eleScrollService: EleScrollService) { }

  ngOnInit() { }

  /**
   * Scrolls to a specific element based on id
   * @param id element id
   */
  scrollTo(id: string) {
    this.eleScrollService.scrollToElementId(id);
  }
}
