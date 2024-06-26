import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  status!: string;
  private userDataSubscription: Subscription | undefined;
  userData!: any;
  totalTransactions!: number;
  uniqueIbans: Set<string> = new Set();
  searchTerm: string = '';
  panelOpenState = false;
  type: string = 'all';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userDataSubscription = this.authService.getData().subscribe(
      (userData) => {
        this.userData = userData;
        console.log(userData);
        this.calculateTotalTransactions();
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }

  get filteredTransactions(): any[] {
    if (!this.userData || !this.userData.transactions) {
      return [];
    }

    return this.userData.transactions.filter((transaction: any) =>
      transaction.uid.includes(this.searchTerm)
    );
  }

  getFilteredTransactions(card: any): any[] {
    if (this.type === 'all') {
      return this.filteredTransactions.filter(
        (transaction) =>
          transaction.from === card.IBAN || transaction.to === card.IBAN
      );
    } else if (this.type === 'sent') {
      return this.filteredTransactions.filter(
        (transaction) => transaction.from === card.IBAN
      );
    } else if (this.type === 'received') {
      return this.filteredTransactions.filter(
        (transaction) => transaction.to === card.IBAN
      );
    }
    return [];
  }

  totalCardTransactions(from: string): number {
    if (!this.userData || !this.userData.transactions) {
      return 0;
    }

    return this.userData.transactions.filter(
      (transaction: any) => transaction.from === from
    ).length;
  }

  calculateTotalTransactions(): void {
    if (
      this.userData &&
      this.userData.cards &&
      Array.isArray(this.userData.cards)
    ) {
      const card1 = this.userData.cards[0];
      const card2 = this.userData.cards[1];
      const card3 = this.userData.cards[2];

      const totalCard1Transactions = card1
        ? card1.transactions
          ? card1.transactions.length
          : 0
        : 0;
      const totalCard2Transactions = card2
        ? card2.transactions
          ? card2.transactions.length
          : 0
        : 0;
      const totalCard3Transactions = card3
        ? card3.transactions
          ? card3.transactions.length
          : 0
        : 0;

      this.totalTransactions =
        totalCard1Transactions +
        totalCard2Transactions +
        totalCard3Transactions;
    } else {
      console.error('Unexpected structure in userData or cards.');
    }
  }

  getTransactionStyle(status: string): { [key: string]: string } {
    if (status === 'successful') {
      return {
        'background-color': 'rgb(212, 255, 212)',
        border: '1px solid lightgreen',
      };
    } else if (status === 'declined') {
      return {
        'background-color': 'rgb(255, 212, 212)',
        border: '1px solid lightcoral',
      };
    } else {
      return {};
    }
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
