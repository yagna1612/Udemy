import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseURL = environment.baseURL
  constructor(private http: HttpClient) { }
  private profilePic = new Subject();
  profilePic$ = this.profilePic.asObservable();
  getUser(cred:any){
    return this.http.get<User>(this.baseURL+'/user/'+cred);
  }
  getScores(){
    return this.http.get<any>(this.baseURL+'/scores/')
  }
  getPieScore(){
    return this.http.get<any>(this.baseURL+'/piescore/')
  }
  getHighestScore(id : Number){
    return this.http.get<any>(this.baseURL+'/highest/'+id)
  }
  updateProfile(id:Number,data:User){
    return this.http.put(this.baseURL+'/edit/'+id,data)
  }
  getprofilePic(id:Number){
    return this.http.get(this.baseURL+"/profilepic/"+id,{ responseType: 'blob' })
  }
  profile(pp:any){
    this.profilePic.next(pp)
  }
}
