import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  showFiller = false;
  sidebarOpen = true;

  ngOnInit() {
    this.updateSidebarState();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.updateSidebarState();
  }

  updateSidebarState() {
    const windowWidth = window.innerWidth;
    this.sidebarOpen = windowWidth >= 991;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  linkClickedToggler() {
    console.log('Link clicked!');
    const windowWidth = window.innerWidth;
  
    this.sidebarOpen = false;
  
    if (windowWidth >= 991) {
      this.sidebarOpen = true;
    }
  }
  

  getSidebarMargin() {
    return this.sidebarOpen && window.innerWidth < 991 ? -260 : 0;
  }
}

