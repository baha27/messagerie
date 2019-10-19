import { Injectable } from '@angular/core';
import { InstantMessage } from './instant-message';

@Injectable()
export class InstantMessagingService {
  private messages: InstantMessage[] = [];
  private socket: WebSocket;
  private logged: boolean;
  private clients: { username:string , server , connection }[];

  private onInstantMessage(message: InstantMessage) {
    this.messages.push(message);
  }

  private onMessage(data: string) {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'instant_message': this.onInstantMessage(message.data); break;
      case 'login': this.onLogin(); break;
      case 'logout': this.onLogout(); break;
    }
  }


  public constructor() {
    this.socket = new WebSocket('ws:/localhost:4201');
    this.socket.onmessage =
      (event: MessageEvent) => this.onMessage(event.data);
    this.logged = false;
  }

  public  getMessages(): InstantMessage[] {
    return this.messages;
  }

  public getClients(): {username:string , server , connection }[] {
    return this.clients;
  }

  public sendMessage(type: string, data: any) {
    const message = {type: type, data: data};
    this.socket.send(JSON.stringify(message));
  }

  public sendInstantMessage(content: string) {
    this.sendMessage('instant_message', content);
  }

  private onLogin() {
    this.logged = true;
  }

  private onLogout() {
    this.logged = false;
  }

  public isLogged(): boolean {
    return this.logged;
  }

  public sendUsername(username: string) {
    this.sendMessage('username', username);
  }

  public logout(){
    this.sendMessage('logout' , 'request');
  }
}