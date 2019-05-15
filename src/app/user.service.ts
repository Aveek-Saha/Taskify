import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

export interface Task {
  id: string;
  task: string;
}

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  todo?: Task;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    
  }



  public login() {
    // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((credential) => {
    //   this.updateUserData(credential.user)
    // });
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    this.afAuth.auth.getRedirectResult().then(function (credential) {
      this.updateUserData(credential.user)
    }, function (error) {
      console.log(error)
    })
  }


  public loginFb() {
    // this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then((credential) => {
    //   this.updateUserData(credential.user)
    // });
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider())
    this.afAuth.auth.getRedirectResult().then(function (credential) {
      this.updateUserData(credential.user)
    }, function (error) {
      console.log(error)
    })
  }

  
  public logout() {
    this.afAuth.auth.signOut();
  }

  public updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    var user;

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    userRef.set(data, { merge: true })

  }
}