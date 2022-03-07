import { Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from 'src/app/services/getQuestions/Questions.service';
import { take } from 'rxjs/operators';
import { IsLoggedInService } from 'src/app/services/isLoggedIn/isLoggedIn.service';
import { User } from 'src/app/User';
import { UserService } from 'src/app/services/User/User.service';
import { Chart } from 'chart.js';
import { COLORS } from 'src/app/Global';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('myChart') private myChart: ElementRef;

  constructor(private questionsService: QuestionsService,private loginService: IsLoggedInService,private user:UserService,private route: ActivatedRoute,private router: Router,private sanitiser: DomSanitizer) { }
  public userData:User;
  public isLoggedIn = false;
  public score = 10
  public scores : any;
  public collSize = 0
  public paginateData:any
  public page =0
  public pageSize = 5
  public pieData : any
  public profilePic : any
  reader:any
  temp : any
  public allTimeHighest : Number
  public highest : Number
  async ngOnInit() {
    this.profilePic=null
    this.highest=null
    this.temp = JSON.parse(localStorage.getItem('user'))
    if(this.temp){
      this.userData = this.temp
      this.loginService.LoggedIn(this.userData)
      this.loadData(this.userData)
    }
    await this.loginService.isLoggedIn$.subscribe(data => {
      this.isLoggedIn = data
    })
    await this.loginService.user$.subscribe(async data => {
      this.userData = data
      if(this.userData)
        this.loadData(this.userData)
    })
    await this.user.getScores().subscribe({
      next : data => {
        this.scores = data
        if(this.scores.length>0)
          this.allTimeHighest = this.scores[0].score
        this.collSize = data.length
        this.getDataPaginated()
      },
      error : e => console.log(e)
    });
    await this.user.getPieScore().subscribe({
      next : data => {
        this.pieData = data
        this.statChart()
      },
      error : e => console.log(e)
    })
  }
  async loadData(uu:any){
    setTimeout(async () => {
      await this.user.getprofilePic(uu.userID).subscribe(d=>{
        if(d!=null){
            this.profilePic = this.sanitiser.bypassSecurityTrustUrl(window.URL.createObjectURL(d));
        }else this.profilePic=null
      })
      await this.user.getHighestScore(uu.userID).subscribe(d => {this.highest=d})
    }, 0);

  }
  Logout(){
    this.loginService.reset()
  }
  getDataPaginated(){
    if(this.scores)
    this.paginateData =  this.scores
     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

   }
   statChart(){
    new Chart(this.myChart.nativeElement, {
        type: 'doughnut',
        data: {
            labels: ['Above Average', 'Below Average'],
            datasets: [{
                data: this.pieData,
                borderWidth: 1,
                backgroundColor : ['#FA8072','#8E44AD'],
                hoverBackgroundColor : ['#1ABC9C','#F1C40F']
            }]
        },
    });
   }
   takeTheQuiz(){
     this.router.navigate(['/quiz'])
   }
   edit(){
     this.router.navigate(['edit'])
   }
}
