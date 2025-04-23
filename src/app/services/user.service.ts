import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private usersSubject=new BehaviorSubject<User[]>([]);
  users$:Observable<User[]>=this.usersSubject.asObservable();

  addUser(user: User) {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }


}
