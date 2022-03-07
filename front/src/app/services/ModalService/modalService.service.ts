import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

constructor() { }
  private resumeModal = new Subject<boolean>();
  resumeModal$ = this.resumeModal.asObservable();
  openModal(){
    this.resumeModal.next(true)
  }
  closeModal(){
    this.resumeModal.next(false)
  }
}
