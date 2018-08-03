import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { UserService } from "../app/user.service";
import { ChatService } from "../app/chat.service";

import { auth } from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TopNavComponent } from './top-nav/top-nav.component';
import { TasksComponent } from './tasks/tasks.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { MessagesComponent } from './messages/messages.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'chats', component: ChatComponent },
  { path: 'messages', component: MessagesComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    TasksComponent,
    HomeComponent,
    ChatComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    UserService,
    ChatService,
    RouterModule
  ],
  bootstrap: [
    AppComponent,
    TopNavComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
