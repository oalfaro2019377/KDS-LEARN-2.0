import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { RestCourseService } from 'src/app/services/restCourse/rest-course.service';
import { UserServiceService } from '../../services/restUser/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-courses-by-student',
  templateUrl: './list-courses-by-student.component.html',
  styleUrls: ['./list-courses-by-student.component.css']
})
export class ListCoursesByStudentComponent implements OnInit {
classes:[];
search;
public message;
public user;
public token;
public class:Class;
public course: string;


public classSelected:Class;
  constructor(private restClass: RestCourseService, private restUser: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.listCourses();
  }

  onSubmit(){
       this.restClass.getClass2(this.classSelected).subscribe((res:any)=>{
        localStorage.setItem('course', JSON.stringify(res.class));
        console.log('Curso seteado');
        this.router.navigateByUrl('course')  
       })  
  }

  listCourses(){
    console.log(this.user);
    this.restClass.getClassesByStudent(this.user._id).subscribe((res:any)=>{
      console.log(res)
      if(res.classFind){
        //alert(res.message)
        this.classes = res.classFind;
        console.log(this.classes)
      }else{
        alert(res.message)
      }
    },
    error => alert(error.error.message))
  }

  deleteInscription(){
    this.restClass.deleteInscription(this.user._id, this.classSelected).subscribe((res:any)=>{
      this.ngOnInit();
      if(!res.classRemoved){
        alert(res.message);
        this.ngOnInit();
      }else{
      }
    }, error => alert(error.error.message))
  }

  getClass(userT){
    this.classSelected = userT;
   console.log(this.classSelected)
  }

}
