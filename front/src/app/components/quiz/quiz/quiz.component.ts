import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionsService } from 'src/app/services/getQuestions/Questions.service';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor(private isl: IsLoggedInService, private router: Router, private q: QuestionsService,private toastr: ToastrService) { }
  public user: User
  public quizForm: FormGroup
  public questions: any
  public selected: Array<Number>
  public default = 1
  public answers : any
  public score = 0
  public done :boolean
  async ngOnInit() {
    this.done = true
    this.user = JSON.parse(localStorage.getItem('user'))
    if (!this.user)
      this.router.navigate([''])
    this.quizForm = new FormGroup({
      question1: new FormControl(''),
      question2: new FormControl(''),
      question3: new FormControl(''),
      question4: new FormControl(''),
      question5: new FormControl(''),
      question6: new FormControl(''),
      question7: new FormControl(''),
      question8: new FormControl(''),
      question9: new FormControl(''),
      question10: new FormControl(''),
      question11: new FormControl(''),
      question12: new FormControl(0),
    });
    await this.q.getQuestions().subscribe(data => {
      this.questions = data;
    })
    await this.q.generateScore().subscribe({
      next : d => {
        this.answers = d
        this.answers = this.answers.map((x:any,i:any)=>{
          if(x.answer){
            if(x.answer.includes(',')){
              return {['question'+(i+1)]:x.answer.split(',').map((e:any)=>parseInt(e.trim()))}
            }
            return {['question'+(i+1)]:parseInt(x.answer)}
          }
        }).filter((x:any)=>x)
      },
      error : e => console.log(e)
    })
  }
  async onSubmit() {
    this.score=0
    this.done=false
    this.answers.forEach((e:any) => {
      var k = Object.keys(e)[0]
      var userVal = this.quizForm.get(k).value
      if(userVal){
        if(userVal.includes(',')){
          var correct = 0
          userVal = userVal.split(',').map((x:any)=>parseInt(x))
          if(userVal.length<=e[k].length){
            userVal.forEach((x:any)=>{
              if(e[k].includes(x))
                correct++
            })
            this.score+=(correct/userVal.length)*10
          }
        }
        else{
          userVal = parseInt(userVal)
          if((Array.isArray(e[k]) && e[k].includes(userVal)) || e[k]==userVal)
            this.score+=10
        }
      }
    })
    this.score+=this.quizForm.get('question12').value
    this.quizForm.get('question12').disable()
    this.score=parseInt((this.score*100/120).toFixed())
    await this.q.addScore({userID:this.user.userID,score:this.score,playedOn:new Date()}).subscribe({
      next: e => {
        if(this.score>parseInt(localStorage.getItem('highest'))){
          this.toastr.success("Good work, this is your new high score : "+this.score)
          localStorage.removeItem('highest')
          localStorage.setItem('highest',this.score.toString())
        }
        else{
          this.toastr.success("Your Score : "+this.score)
        }
        this.router.navigate([''])
      },
      error: e => console.log(e)
    })
  }
  onButtonGroupClick($event: any, ques: string, allowMultiples: any = false) {
    let clickedElement = $event.target || $event.srcElement;
    let parent = $event.target.parentElement.parentElement.children
    if (!allowMultiples) {
      Array.from(parent).forEach((e: any) => {
        if (e.className === "btn-group") {
          let c = e.children[0]
          if (c.classList.contains("active")) {
            c.classList.remove("active")
          }
        }
      })
      this.quizForm.get(ques).setValue(clickedElement.value)
    }
    else {
      let v = this.quizForm.get(ques).value
      let s = clickedElement.value
      if (v) {
        if(!v.includes(',') || (v.includes(',') && !v.split(',').includes(s)))
          v += ',' + s
        this.quizForm.get(ques).setValue(v)
      }
      else this.quizForm.get(ques).setValue(s)


    }
    if (clickedElement.nodeName === "BUTTON") {

      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }

  }
}
