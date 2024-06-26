import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  currentUrl: string = '';
  userData!: any;
  private userDataSubscription: Subscription | undefined;
  selectedMenuItem: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUrl = this.customizeDisplayText(
      this.extractLastSegment(this.route)
    );

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.customizeDisplayText(
          this.extractLastSegment(this.route)
        );
      });
    // Observer Object
    this.userDataSubscription = this.authService.getData().subscribe({
      next: (userData) => {
        this.userData = userData;
        console.log(userData);
      },
      error: (error) => {
        console.error('Error retrieving user data:', error);
      },
      complete: () => {},
    });
  }

  private extractLastSegment(route: ActivatedRoute): string {
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.snapshot.url.length
      ? currentRoute.snapshot.url[currentRoute.snapshot.url.length - 1].path
      : '';
  }

  private customizeDisplayText(route: string): string {
    if (route === 'account  overview') {
      return 'Account Overview';
    } else if (route === 'transactions') {
      return 'Transactions';
    } else if (route === 'bill-payment') {
      return 'Bill Payment';
    }
    return route;
  }

  togglesidebar() {
    this.toggleSidebarForMe.emit();
  }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
  }
}
