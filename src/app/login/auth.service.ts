import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  signIn(email: string, password: string): Promise<any> {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => userCredential.user);
  }

  logout() {
    localStorage.clear();
  }

  isLoggedin(): boolean {
    const userInfoString = localStorage.getItem('user');
    return !!userInfoString;
  }

  saveUserInfoToLocalStorage(user: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;

        const userInfo = {
          uid: uid,
          email: email,
        };

        localStorage.setItem('user', JSON.stringify(userInfo));
        resolve();
      } else {
        reject('User is underfined');
      }
    });
  }

  getAllIbans(): Observable<any[]> {
    return this.firestore.collection('my-users').valueChanges();
  }

  getData() {
    const userInfoString = localStorage.getItem('user');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const uid = userInfo.uid;

      return this.firestore.collection('my-users').doc(uid).valueChanges();
    } else {
      console.log('User is underfined');
      return of(null);
    }
  }

  updateData(newData: any) {
    const userInfoString = localStorage.getItem('user');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const uid = userInfo.uid;

      this.firestore
        .collection('my-users')
        .doc(uid)
        .update(newData)
        .then(() => {
          console.log('User data updated successfully');
        })
        .catch((error) => console.error('Error updating user data: ', error));
    } else {
      console.log('User is undefined');
    }
  }
}
