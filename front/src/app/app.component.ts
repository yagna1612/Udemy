import { Component, OnInit } from '@angular/core';
import { IsLoggedInService } from './services/isLoggedIn/isLoggedIn.service';
import { User } from './User';
import { Spinkit } from 'ng-http-loader';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz';
  user : User
  spinnerStyle = Spinkit;
  h:Number;
  temp : any
  constructor(private isl:IsLoggedInService){}
  ngOnInit(){
    this.isl.user$.subscribe(data => this.user = data)
    this.h = window.innerHeight - 200;
    document.getElementById("router").style.height = this.h+"px";
  }

}
