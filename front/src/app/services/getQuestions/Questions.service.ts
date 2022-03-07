import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
baseURL = environment.baseURL
constructor(private http: HttpClient) { }
getQuestions() : Observable<string[]>{
  return this.http.get<string[]>(this.baseURL+'/questions');
}
generateScore(){
  return this.http.get(this.baseURL+'/answers')
}
addScore(score:any){
  return this.http.post(this.baseURL+'/score',score)
}
}
