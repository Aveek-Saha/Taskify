import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

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
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  newTask = new FormControl('', Validators.required);
  chatList: any[];

  constructor(public afAuth: AngularFireAuth, private chatService: ChatService,
    public afs: AngularFirestore, public use: UserService, public router: Router) {

    const user = this.afAuth.auth.currentUser;
    this.chatList = [];

    var chatColl =
      this.afs.collection(`chats`)
        .snapshotChanges()
        .pipe(map(actions => {
          return actions.map(a => {
            //Get document data
            const data = a.payload.doc.data() as Chat;
            //Get document id
            const id = a.payload.doc.id;
            //Use spread operator to add the id to the document data
            return { id, ...data };
          });
        })).subscribe((querySnapshot) => {
          console.log(querySnapshot);

          var thisPerson: User = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          }
          // this.chatList = querySnapshot;
          querySnapshot.forEach((doc) => {
            // if (doc.participants[0].email == user.email || doc.participants[1].email == user.email) {

            doc.participants.forEach((part) => {
              // console.log(JSON.stringify(part) === JSON.stringify(thisPerson));
              // console.log(part);
              if (JSON.stringify(part) === JSON.stringify(thisPerson)) {
                this.chatList.push(doc);
              }

            })

            // console.log(doc.participants);
            // console.log(Object.assign({}, thisPerson));
            // console.log(doc.participants.indexOf(Object.assign({}, thisPerson)));
            // this.chatList.push(doc);
            // }
          });
        });
  }

  public message(id: string) {
    console.log(id);

    this.chatService.setId(id);

    this.router.navigate(['/messages']);
    // this.router.navigate(['/messages', id]);

  }


  public addPerson(otherUser: string, chId: string) {
    const user = this.afAuth.auth.currentUser;
    console.log(chId);



    var chats = this.afs
      .collection(`users`, ref => ref.where('email', '==', otherUser))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe((querySnapshot) => {
        if (querySnapshot.length > 0) {

          let user = this.afAuth.auth.currentUser;
          const taskDoc = this.afs.doc(`chats/${chId}`);
          console.log(this);


          taskDoc.ref.get().then((documentSnapshot) => {

            var thatPerson: User = {
              uid: querySnapshot[0].uid,
              email: querySnapshot[0].email,
              displayName: querySnapshot[0].displayName,
              photoURL: querySnapshot[0].photoURL
            }

            var data = documentSnapshot.data();

            data.participants.push(Object.assign({}, thatPerson))

            const ch: Chat = {
              participants: data.participants
            }

            const taskD: AngularFirestoreDocument<any> = this.afs.doc(`chats/${chId}`);


            // var data = documentSnapshot.data();
            // data.participants.push(Object.assign({}, thatPerson))
            console.log(this);

            this.router.navigate(['/chats']);


            taskD.set(ch, { merge: true })

          });



        }
      });
  }

  public addChat(otherUser: string) {
    const user = this.afAuth.auth.currentUser;


    var chats = this.afs
      .collection(`users`, ref => ref.where('email', '==', otherUser))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe((querySnapshot) => {
        if (querySnapshot.length > 0) {

          const chatColl: AngularFirestoreCollection<any> = this.afs
            .collection(`chats`);

          var thisPerson: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }

          var thatPerson: User = {
            uid: querySnapshot[0].uid,
            email: querySnapshot[0].email,
            displayName: querySnapshot[0].displayName,
            photoURL: querySnapshot[0].photoURL
          }

          const ch: Chat = {
            participants: [Object.assign({}, thatPerson), Object.assign({}, thisPerson)]
          }


          var check = this.afs
            .collection(`chats`, ref => ref.where('participants', '==', ch.participants))
            .snapshotChanges().subscribe(res => {
              console.log(res.length);
              if (res.length <= 0 && thisPerson.email != thatPerson.email) {

                var check2 = this.afs.collection(`chats`, ref =>
                  ref.where('participants', '==', ch.participants.reverse()))
                  .snapshotChanges().subscribe(res2 => {
                    if (res2.length <= 0) {
                      console.log(res2.length);
                      chatColl.add(ch);
                    }
                  });
              }
            });
          // chatColl.add(ch);

          // console.log(check);                      

        }
      });
  }

  ngOnInit() {
  }

}
