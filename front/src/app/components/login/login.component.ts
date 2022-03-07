import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';
import { UserService } from 'src/app/services/User/User.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private iss: IsLoggedInService,private user:UserService,private router:Router,private toastr:ToastrService) { }
  userData : User
  loginForm: FormGroup
  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  get userName() {
    return this.loginForm.get('userName') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  onSubmit(){
    var newObj = btoa(JSON.stringify(this.loginForm.value))
    this.user.getUser(newObj).subscribe({
      next : async data => {
        this.userData = data
        this.router.navigate([''])
        this.iss.LoggedIn(data)

      },
      error : e => this.toastr.error(e.error)
    });
  }
  goBack(){
    this.iss.Login(false,false)
  }
}
