import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css'],
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  selectedCardIndex!: number;
  private userDataSubscription: Subscription | undefined;
  userData: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userDataSubscription = this.authService.getData().subscribe(
      (userData) => {
        this.userData = userData;
        console.log(this.userData);
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }

  countCardTransactions(): number {
    if (
      !this.userData ||
      !this.userData.cards ||
      this.selectedCardIndex === undefined
    ) {
      return 0;
    }

    const selectedCard = this.userData.cards[this.selectedCardIndex];
    const transactionFrom = this.userData.transactions.filter(
      (transaction: any) => transaction.from === selectedCard.IBAN
    ).length;
    const transactionTo = this.userData.transactions.filter(
      (transaction: any) => transaction.to === selectedCard.IBAN
    ).length;

    return transactionFrom + transactionTo;
  }

  showCardDetails(index: number) {
    this.selectedCardIndex = index;
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
