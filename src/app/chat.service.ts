import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatId;

  constructor() { }

  setId(id: string) {
    this.chatId = id;
  }

  getId() {
    return this.chatId
  }
}
