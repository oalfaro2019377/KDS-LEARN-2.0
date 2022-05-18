import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { RestCourseService } from 'src/app/services/restCourse/rest-course.service';
import { UserServiceService } from '../../services/restUser/user-service.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent implements OnInit {
  classes:[];
  search;
  public message;
  public user;
  public token;
  public ins: Class;
  public classSelected:Class;

  constructor(private restClass: RestCourseService, private restUser: UserServiceService) { }

  ngOnInit(): void {
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.listCourses();
  }

  listCourses(){
    console.log(this.user);
    this.restClass.allClasses(this.user._id).subscribe((res:any)=>{
      console.log(res)
      if(res.classes){
       // alert(res.message)
        this.classes = res.classes;
        console.log(this.classes)
      }else{
        alert(res.message)
      }
    },
    error => alert(error.error.message))
  }

  getClass(userT){
    this.classSelected = userT;
   console.log(this.classSelected)
  }

  inscriptionClass(){
    console.log(this.user, this.token);
    this.restClass.inscription(this.user._id, this.classSelected).subscribe((res:any)=>{
      if(res.pushStudent){
      alert(res.message)
      console.log(res)
      }else{
       alert(res.message)
        console.log(res)
      }
    },
    error => alert(error.error.message))
  }
}
