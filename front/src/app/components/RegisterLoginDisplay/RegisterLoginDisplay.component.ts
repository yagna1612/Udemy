import { Component, OnInit } from '@angular/core';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';

@Component({
  selector: 'app-RegisterLoginDisplay',
  templateUrl: './RegisterLoginDisplay.component.html',
  styleUrls: ['./RegisterLoginDisplay.component.css']
})
export class RegisterLoginDisplayComponent implements OnInit {

  constructor(private iss : IsLoggedInService) { }

  ngOnInit() {
    this.iss.isLoggedIn$.subscribe(i => this.isUserLoggedIn = i)
    this.iss.isRegister$.subscribe(i => this.Register=i)
    this.iss.isLogin$.subscribe(i => this.Login=i)
  }
  isUserLoggedIn = false;
  Register = false;
  Login = false;
  isRegister(){
    this.iss.Registered(true,true)
  }
  isLogin(){
    this.iss.Login(true,true)
  }
}
