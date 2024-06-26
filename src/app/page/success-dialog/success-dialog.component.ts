import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css'],
})
export class SuccessDialogComponent implements OnInit {
  firstName!: string;
  lastName!: string;
  uid!: string;
  iban!: string;
  amount!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.uid = data.uid;
    this.iban = data.iban;
    this.amount = data.amount;
    console.log('this is the FIRSTNAME: ', this.firstName);
  }

  refreshPage() {
    window.location.reload();
  }

  ngOnInit(): void {}
}
