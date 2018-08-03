import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { UserService } from "../user.service";

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore, public use: UserService, public router: Router) { }

  login() {
    this.use.login();
  }
  logout() {
    this.use.logout();
  }

  ngOnInit() {
  }

}
