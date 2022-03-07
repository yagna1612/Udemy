import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/User/User.service';
import { User } from 'src/app/User';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  user : User
  id:Number
  profilePic : any
  public response: {dbPath: ''};
  constructor(private u:UserService,private toastr:ToastrService,private router:Router,private isl:IsLoggedInService,private sanitiser:DomSanitizer) { }
  editForm : FormGroup
  async ngOnInit() {
    this.editForm = new FormGroup({
      userID: new FormControl(null),
      fullName: new FormControl(null,Validators.required),
      emailID: new FormControl(null,Validators.email),
      mobileNo:new FormControl(null,Validators.required),
      profilePic: new FormControl('')
    });
    this.user = JSON.parse(localStorage.getItem('user'))
    this.editForm.patchValue(this.user)
    await this.u.getprofilePic(this.user.userID).subscribe(d=>{
      this.profilePic = this.sanitiser.bypassSecurityTrustUrl(window.URL.createObjectURL(d));
      this.u.profile(this.profilePic)
    })
    // await this.u.profilePic$.subscribe(data=>{console.log(document.getElementById("pp"))})

  }
  async onSubmit(){
    var token = JSON.parse(localStorage.getItem('user')).token
    await this.u.updateProfile(this.user.userID,this.editForm.value).subscribe({
      next: (e:any)=> {
        e.token = token
        this.isl.reset()
        this.isl.LoggedIn(e)
        this.toastr.success("Profile Updated Successfully.")
        this.router.navigate([''])
      },
      error: e=> {
        this.toastr.error(e.message);
      }
    })
  }
  get fullName() {
    return this.editForm.get('fullName') as FormControl;
  }

  get email() {
    return this.editForm.get('emailID') as FormControl;
  }
  get mobile() {
    return this.editForm.get('mobileNo') as FormControl;
  }
  public uploadFinished = (event:any) => {
    this.response = event;
    this.editForm.get('profilePic').setValue(this.response.dbPath)
  }
}
