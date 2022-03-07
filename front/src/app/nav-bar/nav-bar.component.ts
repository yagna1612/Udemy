import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RegisterLoginDisplayComponent } from '../components/RegisterLoginDisplay/RegisterLoginDisplay.component';
import { IsLoggedInService } from '../services/isLoggedIn/isLoggedIn.service';
import { ModalServiceService } from '../services/ModalService/modalService.service';
import { User } from '../User';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  temp : any
  public isResume : boolean = false
  constructor(private isl:IsLoggedInService,private reglog:RegisterLoginDisplayComponent,private m:ModalServiceService,private toastr:ToastrService) { }
  user : User
  ngOnInit() {
    this.temp = JSON.parse(localStorage.getItem('user'))
    if(this.temp){
      this.user = this.temp
      this.isl.LoggedIn(this.temp)
    }
    this.isl.user$.subscribe(data => {this.user = data;})
  }
  Register(){
    this.isl.reset()
    this.reglog.isRegister()
  }
  Login(){
    this.isl.reset()
    this.reglog.isLogin()
  }
  Logout(){
    this.isl.reset()
  }
  open()
  {
    this.m.openModal()
  }
  proj(){
    this.toastr.warning("Coming Soon...")
  }
  goToGitHub(){
    window.open("https://github.com/yagna1612/")
  }
  goToLinkedIn(){
    window.open("https://www.linkedin.com/in/yagna-patel-6ab7a512a")
  }
}
