import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { DefaultComponent } from './components/default/default.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterLoginDisplayComponent } from './components/RegisterLoginDisplay/RegisterLoginDisplay.component';
import { LoginComponent } from './components/login/login.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { QuizComponent } from './components/quiz/quiz/quiz.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { ResumeComponent } from './components/resume/resume.component';
import { httpInterceptor } from './Interceptor/httpInterceptor';
import { AuthorizationCheckService } from './services/AuthorizationCheck/authorizationCheck.service';
import { ToastrModule } from 'ngx-toastr';
import { EditComponent } from './components/edit/edit.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
const routes: Routes = [
  {path:'',component:UserComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'reglog',component:RegisterLoginDisplayComponent},
  {path:'user',component:UserComponent},
  {path:'quiz',component: QuizComponent,canActivate:[AuthorizationCheckService]},
  {path:'edit',component:EditComponent,canActivate:[AuthorizationCheckService]}
]
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    DefaultComponent,
    UserComponent,
    RegisterComponent,
    RegisterLoginDisplayComponent,
    LoginComponent,
    QuizComponent,
    ResumeComponent,
    EditComponent,
    UploadFilesComponent,
   ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgHttpLoaderModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatTableModule,
    NgbPaginationModule,
    NgChartsModule,
    BarRatingModule,
    ToastrModule.forRoot({positionClass: 'toast-bottom-right',
    preventDuplicates: true,})
  ],
  providers: [RegisterLoginDisplayComponent,{ provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthorizationCheckService],
  bootstrap: [AppComponent]
})
export class AppModule { }
