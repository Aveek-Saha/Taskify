import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { WavesModule } from 'angular-bootstrap-md'
import { UserService } from "../user.service";
import { ChatService } from "../chat.service";

interface Task {
  task: string;
  time: number;
}

interface Chat {
  messages?: Message;
  participants: User[];
}

interface Message {
  content: string;
  sender: string;
  time: number;
}

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  todo?: Task;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  chatId;
  messages: any[];
  newTask = new FormControl('', Validators.required);

  constructor(public afAuth: AngularFireAuth, private route: ActivatedRoute, private chatService: ChatService,
    public afs: AngularFirestore, public use: UserService, public router: Router) {

    const user = this.afAuth.auth.currentUser;
    // this.chatId = this.route.snapshot.paramMap.get('id');

    this.chatId = chatService.getId();
    // console.log(this.chatId);

    const taskColl: AngularFirestoreCollection<Task> = this.afs.collection(`chats/${this.chatId}/messages`);

    var tasks = this.afs
      .collection(`chats/${this.chatId}/messages`, ref => ref.orderBy('time'))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          //Get document data
          const data = a.payload.doc.data() as Message;
          //Get document id
          const id = a.payload.doc.id;
          //Use spread operator to add the id to the document data
          return { id, ...data };
        });
      })).subscribe((querySnapshot) => {
        // console.log(querySnapshot);
        this.messages = querySnapshot;
        // querySnapshot.forEach((doc) => {
        //   console.log(doc);
        // });
      });
  }

  public remove(id: string) {
    // console.log(id);

    let user = this.afAuth.auth.currentUser;
    var taskDoc = this.afs.doc<Task>(`chats/${this.chatId}/messages/${id}`);
    //Delete the document
    taskDoc.delete();
  }

  public edit(id: string, text: string, stamp: number) {
    // console.log(text);

    let user = this.afAuth.auth.currentUser;
    const taskDoc: AngularFirestoreDocument<any> = this.afs.doc(`chats/${this.chatId}/messages/${id}`);

    const edit: Message = {
      sender: user.displayName,
      content: text,
      time: stamp
    }

    taskDoc.set(edit, { merge: true })

  }

  public addTask(text: string) {

    let user = this.afAuth.auth.currentUser;
    const userRef: AngularFirestoreCollection<any> =
      this.afs.collection(`chats/${this.chatId}/messages`);


    const data: Message = {
      sender: user.displayName,
      content: text,
      time: Date.now()
    }

    if (text != "") {
      userRef.add(data);
    }
  }

  ngOnInit() {
    // this.chatId = this.route.snapshot.paramMap.get('id');
    // console.log(this.chatId);

  }

}
