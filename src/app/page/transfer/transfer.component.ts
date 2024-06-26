import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/login/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent implements OnInit {
  email: string = 'Alias Name: firas98';
  password: string = 'Mobile Number: 0791829950';
  email1: string = 'Alias Name: ahmad1, ahmad2, ahmad3';
  password1: string = 'Mobile Number: 0795249333, 0792860423, 0791563763';
  email2: string = 'Alias Name: fatima1, fatima2';
  password2: string = 'Mobile Number: 0791014513, 0798810843';
  selectedAliasType: string = '';
  amount!: number;
  transferPurpose: string = '';
  from: string = '';
  to: string = '';
  aliasNameOrMobileNumber!: string;
  aliasIban!: string;
  firstForm: boolean = false;
  formSubmitted: boolean = false;
  isloading: boolean = false;
  formOptions: any[] = [];
  userData!: any;
  enoughBalance!: boolean;
  randomUid!: string;
  receiverFirstName!: string;
  receiverLastName!: string;
  inputAmount: string = '';

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getData().subscribe(
      (userData) => {
        this.userData = userData;
        console.log(userData);
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }

  checkInputValueInFirestore() {
    this.firstForm = false;

    this.auth.currentUser.then((user) => {
      if (user) {
        const currentUserUID = user.uid;
        console.log(currentUserUID);

        this.firestore
          .collection('my-users')
          .get()
          .subscribe((snapshot) => {
            snapshot.forEach((doc) => {
              const uid = doc.id; // UID of the user document

              if (uid !== currentUserUID) {
                // Exclude the current user's cards
                const cards = (doc.data() as { cards: any[] }).cards;

                if (cards && cards.length > 0) {
                  cards.forEach((card: any) => {
                    if (
                      card.aliasName === this.aliasNameOrMobileNumber ||
                      card.phoneNumber === this.aliasNameOrMobileNumber
                    ) {
                      this.aliasIban = card.IBAN;
                      console.log('Match found! IBAN:', this.aliasIban);
                      this.firstForm = true;
                    }
                  });
                }
              }
            });
          });
      }
    });
  }

  async loadFromOptions() {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        const uid = user.uid;

        const userDoc = await this.firestore
          .collection('my-users')
          .doc(uid)
          .get()
          .toPromise();

        if (userDoc && userDoc.exists) {
          const cards = (userDoc.data() as any)?.cards || [];

          console.log(cards);

          this.formOptions = cards.map((card: any) => ({
            value: card.IBAN,
            label: card.IBAN,
          }));
        }
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.checkInputValueInFirestore();
      this.loadFromOptions();
      this.isloading = true;
      setTimeout(() => {
        this.formSubmitted = true;
        this.isloading = false;
      }, 1000);
    }
  }

  submitForm2(form: NgForm) {
    if (form.valid) {
      this.updateSenderBalance();
    }
  }

  updateSenderBalance() {
    this.auth.currentUser.then((user) => {
      if (user) {
        const currentUserUID = user.uid;
        console.log(currentUserUID);

        this.firestore
          .collection('my-users')
          .get()
          .subscribe((snapshot) => {
            snapshot.forEach((doc) => {
              const uid = doc.id;

              if (uid === currentUserUID) {
                const cards = (doc.data() as { cards: any[] }).cards;
                const transactions = this.userData.transactions;

                const cardToUpdate = cards.find(
                  (card) => card.IBAN === this.from
                );

                if (cardToUpdate) {
                  const dateOptions: Intl.DateTimeFormatOptions = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                  };

                  const formattedDate = new Date()
                    .toLocaleString('en-US', dateOptions)
                    .toString();

                  this.randomUid = Math.floor(
                    10000000 + Math.random() * 90000000
                  ).toString();
                  this.enoughBalance = this.amount <= cardToUpdate.balance;
                  cardToUpdate.balance = this.enoughBalance
                    ? cardToUpdate.balance - this.amount
                    : cardToUpdate.balance;

                  if (this.enoughBalance === false) {
                    this.dialog.open(DialogComponent);
                  }

                  const newTransaction = {
                    amount: +this.amount,
                    from: this.from,
                    status: this.enoughBalance ? 'successful' : 'declined',
                    time: formattedDate,
                    to: this.aliasIban,
                    type: 'transfer',
                    uid: this.randomUid,
                  };

                  transactions.push(newTransaction);

                  this.firestore.collection('my-users').doc(uid).update({
                    cards: cards,
                    transactions: transactions,
                  });
                  this.updateReceiverBalance();
                  console.log(
                    'this is the receiver user firstName: ',
                    this.receiverFirstName
                  );
                } else {
                  console.log('Card with IBAN not found');
                }
              }
            });
          });
      }
    });
  }

  updateReceiverBalance() {
    this.auth.currentUser.then((user) => {
      if (user) {
        const currentUserUID = user.uid;
        console.log(currentUserUID);

        this.firestore
          .collection('my-users')
          .get()
          .subscribe((snapshot) => {
            snapshot.forEach((doc) => {
              const uid = doc.id;

              if (uid !== currentUserUID) {
                const cards = (doc.data() as { cards: any[] }).cards;
                const transactions = (doc.data() as { transactions: any[] })
                  .transactions;
                console.log(
                  'this is the user receiver transactions data: ',
                  transactions
                );
                const targetCard = cards.find(
                  (card) => card.IBAN === this.aliasIban
                );

                this.receiverFirstName = (doc.data() as any).firstName;
                this.receiverLastName = (doc.data() as any).lastName;

                if (targetCard) {
                  const dateOptions: Intl.DateTimeFormatOptions = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                  };

                  const formattedDate = new Date().toLocaleString(
                    'en-US',
                    dateOptions
                  );

                  targetCard.balance = this.enoughBalance
                    ? +targetCard.balance + +this.amount
                    : +targetCard.balance;

                  const newTransaction = {
                    amount: +this.amount,
                    from: this.from,
                    status: 'successful',
                    time: formattedDate,
                    to: this.aliasIban,
                    type: 'transfer',
                    uid: this.randomUid,
                  };

                  if (this.enoughBalance === true) {
                    transactions.push(newTransaction);
                    this.dialog.open(SuccessDialogComponent, {
                      data: {
                        firstName: this.receiverFirstName,
                        lastName: this.receiverLastName,
                        uid: this.randomUid,
                        iban: this.aliasIban,
                        amount: this.amount,
                      },
                    });
                  }

                  this.firestore.collection('my-users').doc(uid).update({
                    cards: cards,
                    transactions: transactions,
                  });
                  console.log('Target Card Balance:', targetCard.balance);
                } else {
                  console.log('Target card not found');
                }
              }
            });
          });
      }
    });
  }

  customizingPlaceHolder() {
    if (this.selectedAliasType === 'AliasName') {
      return 'alias name';
    } else if (this.selectedAliasType === 'MobileNumber') {
      return 'mobile number';
    } else {
      return '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;

    if (
      (keyCode < 48 || keyCode > 57) &&
      keyCode !== 8 &&
      keyCode !== 46 &&
      keyCode !== 37 &&
      keyCode !== 39
    ) {
      event.preventDefault();
    }
  }
}
