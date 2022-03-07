import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  baseUrl = environment.baseURL
  registerationForm: FormGroup;
  constructor(private iss: IsLoggedInService,private http: HttpClient,private router:Router) { }
  ngOnInit() {
    this.registerationForm = new FormGroup({
      fullName: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      emailID: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      mobileNo: new FormControl(null, [Validators.required, Validators.maxLength(10)])
    });
  }
  passwordMatchingValidatior(fg: FormGroup): Validators {
    return fg.get('password').value === fg.get('confirmPassword').value ? null :
    {notmatched: true};
  }
  get userName() {
    return this.registerationForm.get('userName') as FormControl;
  }
  get fullName() {
    return this.registerationForm.get('fullName') as FormControl;
  }

  get email() {
    return this.registerationForm.get('emailID') as FormControl;
  }
  get password() {
    return this.registerationForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.registerationForm.get('confirmPassword') as FormControl;
  }
  get mobile() {
    return this.registerationForm.get('mobileNo') as FormControl;
  }
  onSubmit(){
    this.http.post(this.baseUrl+"/user", this.registerationForm.value)
      .subscribe(data => {
        this.goBack()
        this.iss.Login(true,true)
      });
  }
  goBack(){
    this.iss.Registered(false,false)
  }
}
