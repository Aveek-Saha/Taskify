import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UserService } from "../app/user.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore, public use: UserService, public router: Router) {
  }

  loginFb() {
    this.use.loginFb();
  }

  login() {
    this.use.login();
  }
  
  logout() {
    this.use.logout();
  }

}
