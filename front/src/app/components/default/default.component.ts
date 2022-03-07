import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/getQuestions/Questions.service';
// import Typewriter from 'typewriter-effect';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  constructor(private questionsService : QuestionsService) { }
  private typewriter_text: string = "Hello! I am Yagna Patel, a computer enthusiast pursuing Masters in Computer science at Arizona State University.\n";
public typewriter_display: string = "";
 typewriter:any;
  ngOnInit() {
    this.typingCallback(this);
    this.questionsService.getQuestions().subscribe(data=>{})
    // this.title_fadeOut()
  }
  typingCallback(that:any) {

    let total_length = that.typewriter_text.length;
    let current_length = that.typewriter_display.length;
    if (current_length < total_length) {
      that.typewriter_display += that.typewriter_text[current_length];
      setTimeout(that.typingCallback, 100, that);
    }
  }
  // title_fadeOut(){
  //   var opacity = 0;
  //   var intervalID = 0;
  //   window.onload = fadeout;
  //   function fadeout() {
  //     setInterval(hide, 30);
  //   }
  //   function hide() {
  //     var body = document.getElementById("title");
  //     if(body){
  //       opacity = Number(window.getComputedStyle(body).getPropertyValue("opacity"))

  //       if (opacity > 0) {
  //         opacity = opacity - 0.015;
  //         body.style.opacity = opacity.toString();
  //       }
  //       else {
  //         clearInterval(intervalID);
  //       }
  //     }
  //   }
  // }
}
