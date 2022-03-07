import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalServiceService } from 'src/app/services/ModalService/modalService.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  @ViewChild('mymodal') md:ElementRef<any>
  isOpen : boolean = false;
  modalOptions:NgbModalOptions;
  closeResult: string;
  public projects = [
    {name:'Daily Sales Representative System',location:'Iolite Softwares, Ahmedabad, India',desc:['Created Web Pages.','Visualized data according to the client’s requirements for easy interpretation using ChartJS.','Tracking of a representative on a Geo Chart to visualize the path taken by the representative.']},
    {name:'Image Similarity and Classification(without existing Libraries)',location:'Arizona State University',desc:['     Extract feature descriptors like Color Moments, Extended Local Binary Patterns, and Histograms of Oriented Gradients from all the images in the folder and visualize n similar images to the query image.','Applied dimensionality reduction techniques on the feature descriptors and vectors to classify a label to the query image','Implemented SVM, Decision Tree and PPR based classifiers and LSH and VA files to search for n similar images.']},
    {name:'Heart and Respiration Rate sensing Android Application',location:'Arizona State University',desc:['An application that measures heart rate by making use of the video recorded from the camera when the flashlight is turned on and making use of OpenCV on this recorded file.','Respiration rate is measured by making use of accelerometer data from the phone by keeping the device on a person’s chest when lying down.']},
    {name:'Smart Safe',location:'Sacred Heart University, Connecticut',desc:['IoT based security box using ESP32 microcontroller.']},
    {name:'Smart Parking System',location:'Hackathon, PDPU, Gandhinagar, India',desc:['IoT based system using Arduino that can be installed in a parking lot to give real time updates of whether a spot is empty or not.','Show a car’s likelihood of getting to an empty spot depending on the queue.']}
  ]
  public experiences = [{title:'Full Stack Developer Intern',location:'Iolite Softwares Pvt. Ltd. , Ahmedabad',duration:'6 Months',desc:['Worked in Angular to add features on the front end.','.Net Core and C# for the back end to manage user queries and data entities.','Creating and managing tables in SQL Server.']}]
  public skills = ['C', 'C#', 'C++', 'Python', 'Java', 'SQL', 'Typescript', 'HTML', 'CSS', 'Javascript', 'Git']
  public extra = ['Organized and Supervised national level drone racing competition - Indian Drone Racing League(IDRL) at Pandit Deendayal Petroleum University','Interned at an NGO to spread HIV/AIDS awareness in rural parts of Surat, Gujarat.']
  constructor(private modalService:NgbModal,private m:ModalServiceService) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size: 'lg',
      scrollable: true
    }
   }
  async ngOnInit() {
    await this.m.resumeModal$.subscribe(data => {
      this.isOpen = data;
      if(this.isOpen)
        this.open(this.md)
    })
  }
  open(content:any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(){
    this.m.closeModal()
    this.modalService.dismissAll()
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
