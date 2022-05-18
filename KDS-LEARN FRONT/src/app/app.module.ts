import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserComponent } from './components/user/user.component';
import { ListCoursesByStudentComponent } from './components/list-courses-by-student/list-courses-by-student.component';
import { RegisterEstudentComponent } from './components/register-estudent/register-estudent.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { SearchPipe } from './pipes/search.pipe';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { ListCoursesByTeacherComponent } from './components/list-courses-by-teacher/list-courses-by-teacher.component';
import { CourseComponent } from './components/course/course.component';
import { SearchCoursePipe } from './pipes/search-course.pipe';
import { YouTubePlayerModule} from '@angular/youtube-player';
import { ListUsersMenuComponent } from './components/list-users-menu/list-users-menu.component';
import { ListPendingUsersComponent } from './components/list-pending-users/list-pending-users.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    NotFoundComponent,
    UserComponent,
    ListCoursesByStudentComponent,
    RegisterEstudentComponent, 
    ListUsersComponent,
    SearchPipe,
    AllCoursesComponent,
    ListCoursesByTeacherComponent,
    CourseComponent,
    SearchCoursePipe,
    ListUsersMenuComponent,
    ListPendingUsersComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    YouTubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
