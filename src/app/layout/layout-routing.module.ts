// layout-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountOverviewComponent } from '../page/account-overview/account-overview.component';
import { BillPaymentComponent } from '../page/bill-payment/bill-payment.component';
import { LocationComponent } from '../page/location/location.component';
import { ProfileComponent } from '../page/profile/profile.component';
import { TransactionsComponent } from '../page/transactions/transactions.component';
import { TransferComponent } from '../page/transfer/transfer.component';

const layoutRoutes: Routes = [
      {
        path: '',
        redirectTo: 'account-overview',
        pathMatch: 'full'
      },
      {
        path: 'account-overview',
        component: AccountOverviewComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'transfer',
        component: TransferComponent,
      },
      {
        path: 'bill-payment',
        component: BillPaymentComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: '**',
        redirectTo: 'account-overview',
        pathMatch: 'full',
      },
    ];

@NgModule({
  imports: [RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule { }
