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

import axios from "axios";

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

interface Time {
  time: number;
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
  estimate: string;

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
      this.estimate = "Check"

  }

  public getTimes() {
    let user = this.afAuth.auth.currentUser;
    let userDoc = this.afs.firestore.collection(`users/${user.uid}/time`);

    userDoc.get().then((querySnapshot) => {
      var times = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data().time);
        times.push(doc.data().time)
      })
      axios.post('http://localhost:5001', {
        times: times,
      })
      .then((response) => {
        console.log(response);
        // this.estimate 
        var diffMs = response.data

        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        this.estimate = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes"
      }, (error) => {
        console.log(error);
      });
    })
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

  public remove(id: string, time: number) {
    // console.log(id);

    let user = this.afAuth.auth.currentUser;
    var taskDoc = this.afs.doc<Task>(`users/${user.uid}/todo/${id}`);

    const timeRef: AngularFirestoreCollection<any> = this.afs.collection(`users/${user.uid}/time`);

    console.log(time);
    console.log(Date.now() - time);
    
    var newTime = Date.now() - time

    const data: Time = {
      time: newTime,
    }

    timeRef.add(data);

    
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
