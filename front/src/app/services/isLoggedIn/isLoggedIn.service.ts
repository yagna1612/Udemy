import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserComponent } from 'src/app/components/user/user.component';
import { User } from 'src/app/User';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {

  constructor(private router:Router) { }
  private isLoggedIn = new Subject<boolean>();
  private isRegister = new Subject<boolean>();
  private isLogin = new Subject<boolean>();
  private user = new Subject<User>();
  private temp : User
  // Observable string streams
  isLoggedIn$ = this.isLoggedIn.asObservable();
  isRegister$ = this.isRegister.asObservable();
  isLogin$ = this.isLogin.asObservable();
  user$ = this.user.asObservable();
  // Service message commands
  Registered(isl: boolean,isr: boolean) {
    this.isLoggedIn.next(isl);
    this.isRegister.next(isr);
  }
  Login(isl: boolean,islogin:boolean){
    this.isLoggedIn.next(isl)
    this.isLogin.next(islogin)
  }
  LoggedIn(u:User){
    this.isLoggedIn.next(true)
    this.isRegister.next(false)
    this.isLogin.next(false)
    this.user.next(u)
    localStorage.removeItem('user')
    localStorage.setItem('user',JSON.stringify(u))
  }
  reset(){
    this.isLoggedIn.next(false)
    this.isRegister.next(false)
    this.isLogin.next(false)
    this.user.next(this.temp)
    localStorage.removeItem('user')
    localStorage.removeItem('highest')
    this.router.navigate([''])
  }

}
