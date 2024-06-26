// sidenav.component.ts

import { Component, EventEmitter, Output } from '@angular/core';

export interface MenuItem {
  path: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();
  public menuItems: MenuItem[] = [];

  constructor(){ }

  ngOnInit(): void {
    this.menuItems = [
      { path: 'account-overview', title: 'ACCOUNT OVERVIEW', icon: 'account_circle' },
      { path: 'profile', title: 'USER PROFILE', icon: 'person' },
      { path: 'transactions', title: 'TRANSACTIONS', icon: 'paid' },
      { path: 'transfer', title: 'TRANSFER', icon: 'transfer_within_a_station' },
      { path: 'bill-payment', title: 'BILL PAYMENTS', icon: 'receipt_long' },
      { path: 'location', title: 'LOCATIONS', icon: 'location_on' }
    ];
  }

  onLinkClick() {
    this.linkClicked.emit();
  }
}
