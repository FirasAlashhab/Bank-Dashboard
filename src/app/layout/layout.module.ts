// layout.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { LayoutComponent } from './layout.component';
import { AccountOverviewComponent } from '../page/account-overview/account-overview.component';
import { ProfileComponent } from '../page/profile/profile.component';
import { TransactionsComponent } from '../page/transactions/transactions.component';
import { TransferComponent } from '../page/transfer/transfer.component';
import { LocationComponent } from '../page/location/location.component';
import { BillPaymentComponent } from '../page/bill-payment/bill-payment.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    LayoutComponent,
    AccountOverviewComponent,
    TransactionsComponent,
    TransferComponent,
    LocationComponent,
    BillPaymentComponent,
    ProfileComponent,
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDesignModule,
    LayoutRoutingModule,
    AngularFirestoreModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }
