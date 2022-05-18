import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { ListCoursesByStudentComponent } from './components/list-courses-by-student/list-courses-by-student.component';
import { RegisterEstudentComponent } from './components/register-estudent/register-estudent.component';
import { ListUsersComponent} from './components/list-users/list-users.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { ListCoursesByTeacherComponent } from './components/list-courses-by-teacher/list-courses-by-teacher.component';
import { CourseComponent } from './components/course/course.component';
import { ListUsersMenuComponent } from './components/list-users-menu/list-users-menu.component';
import { ListPendingUsersComponent } from './components/list-pending-users/list-pending-users.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
 
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'registerEstudent', component:RegisterEstudentComponent},
  {path: 'user', component:UserComponent},
  {path: 'listCoursesStudents', component:ListCoursesByStudentComponent},
  {path: 'listUsers', component:ListUsersComponent},
  {path: 'allCourses', component:AllCoursesComponent},
  {path: 'listCoursesTeachers', component:ListCoursesByTeacherComponent},
  {path: 'course', component:CourseComponent},
  {path: 'listUsersMenu', component:ListUsersMenuComponent},
  {path: 'listPendingUsers', component:ListPendingUsersComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
