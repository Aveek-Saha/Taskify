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

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

interface Task {
  task: string;
  time: number;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  newTask = new FormControl('', Validators.required);
  todo: any[];

  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore, public use: UserService, public router: Router) {
    const user = this.afAuth.auth.currentUser;

    const taskColl: AngularFirestoreCollection<Task> = this.afs.collection(`users/${user.uid}/todo`);


    var tasks = this.afs
      .collection(`users/${user.uid}/todo`, ref => ref.orderBy('time'))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          //Get document data
          const data = a.payload.doc.data() as Task;
          //Get document id
          const id = a.payload.doc.id;
          //Use spread operator to add the id to the document data
          return { id, ...data };
        });
      })).subscribe((querySnapshot) => {
        // console.log(querySnapshot.length);
        this.todo = querySnapshot;
        // querySnapshot.forEach((doc) => {
        //   console.log(doc);
        // });
      });

  }

  public addTask(text: string) {

    let user = this.afAuth.auth.currentUser;
    const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users/${user.uid}/todo`);


    const data: Task = {
      task: text,
      time: Date.now()
    }

    if (text != "") {
      userRef.add(data);
    }
  }

  public remove(id: string) {
    // console.log(id);

    let user = this.afAuth.auth.currentUser;
    var taskDoc = this.afs.doc<Task>(`users/${user.uid}/todo/${id}`);
    //Delete the document
    taskDoc.delete();
  }

  public edit(id: string, text: string, stamp: number) {
    // console.log(text);

    let user = this.afAuth.auth.currentUser;
    const taskDoc: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}/todo/${id}`);

    const edit: Task = {
      task: text,
      time: stamp
    }

    taskDoc.set(edit, { merge: true })

  }

  ngOnInit() {
  }

}
