import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userDataSubscription: Subscription | undefined;
  userData!: any;

  constructor(
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.userDataSubscription = this.authService.getData().subscribe(
      (userData) => {
        this.userData = userData;
        console.log(userData);
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }

  onSubmit(f: NgForm) {
    if (f.valid) {
      const formData = f.value;
      this.authService.updateData(formData);
    }
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  totalBalance(): number {
    if (!this.userData || !this.userData.cards) return 0;

    return (this.userData.cards as any[]).reduce(
      (acc, card) => acc + (card.balance || 0),
      0
    );
  }

  totalTransactions(): number {
    if (!this.userData) return 0;

    return this.userData.transactions.length;
  }

  async onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `profile-image/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log(url);

      const userInfoString = localStorage.getItem('user');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const uid = userInfo.uid;

        this.firestore
          .collection('my-users')
          .doc(uid)
          .update({ photoUrl: url });
      }
    }
  }

  async onBannerPictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `banner-image/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log(url);

      const userInfoString = localStorage.getItem('user');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const uid = userInfo.uid;

        this.firestore
          .collection('my-users')
          .doc(uid)
          .update({ bannerUrl: url });
      }
    }
  }
}
