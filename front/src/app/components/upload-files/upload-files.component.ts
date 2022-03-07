import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/User/User.service';
import { User } from 'src/app/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  baseUrl = environment.baseURL
  public id: Number
  public progress: number;
  public message: string;
  public user:User;
  public profilePic : any
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http:HttpClient,private u:UserService,private sanitiser:DomSanitizer) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
  }
  public uploadFile = async (files:any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    await this.http.post(this.baseUrl+'/upload/'+this.user.userID, formData, {reportProgress: true, observe: 'events'})
      .subscribe(async event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });
      await this.u.getprofilePic(this.user.userID).subscribe(d=>{
        this.u.profile(this.sanitiser.bypassSecurityTrustUrl(window.URL.createObjectURL(d)))
      })
  }
}
