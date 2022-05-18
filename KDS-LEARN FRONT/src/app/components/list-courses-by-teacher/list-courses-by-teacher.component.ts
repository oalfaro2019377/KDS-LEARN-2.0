import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { RestCourseService } from 'src/app/services/restCourse/rest-course.service';
import { UserServiceService } from '../../services/restUser/user-service.service';
import { Comment } from '../../models/comment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-courses-by-teacher',
  templateUrl: './list-courses-by-teacher.component.html',
  styleUrls: ['./list-courses-by-teacher.component.css']
})
export class ListCoursesByTeacherComponent implements OnInit {
  classes:[];
  public message;
  public user;
  public token;
  public classSelected;
  public commentSelected;
  public filesToUpload: Array<File>;
  public commentSaved: string;
  public courseSaved: string;


  
  constructor(private restClass: RestCourseService, private restUser: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.commentSelected = new Comment ('','','','','','','','')
    this.classSelected = new Class('','','','','', '',[])
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.listCourses();
  }

  onSubmit(createCourse){
      this.restClass.saveCourse(this.user._id, this.classSelected).subscribe((res:any)=>{
        if(res.savedC){
        this.classSelected = new Class('','','','','', '',[]);
          createCourse.reset();
          this.ngOnInit();
          this.courseSaved = res.savedC;
        }else{
          alert(res.message)
        }
        error =>{
          alert(res.message)
          console.log(error.error.message);
        }
      })
  }



  getClass(userT){
    this.classSelected = userT;
   console.log(this.classSelected)
  }

  listCourses(){
    console.log(this.user);
    this.restClass.getClassesByTeacher(this.user._id).subscribe((res:any)=>{
      console.log(res)
      if(res.classF){
        //alert(res.message)
        this.classes = res.classF;
        console.log(this.classes)
      }else{
      }
    },
    error => alert(error.error.message))
  }

  /*delete*/
  deleteCourse(){
    console.log(this.user._id, this.classSelected);
    this.restClass.deleteCourseByTeacher(this.user._id, this.classSelected).subscribe((res:any)=>{
      if(res.classRemoved){
     
      }else{
        this.ngOnInit();
      }
    },
    error => alert(error.error.message))
  }

  /*uploadFiles*/
  fileChange(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  uploadFile(){
    this.restClass.fileRequest(this.user._id, this.classSelected,[], this.filesToUpload, this.token, 'image')
    .then((res:any)=>{
      if(res.commentUpdated){
        this.classSelected = res.commentUpdated;
      }else{
      }
    })
  }
  /*comentarios*/
  saveComment(){
    console.log(this.user);
    this.restClass.saveComment(this.user._id, this.classSelected, this.commentSelected).subscribe((res:any)=>{
      this.message = res.message;
      if(res.comentSaved){
        this.commentSaved = res.comentSaved.name;
      }else{
        console.log(this.message);
      }
    },
    error=> console.log(<any>error)
    )
  }

  funcion(){
    this.restClass.getClass2(this.classSelected).subscribe((res:any)=>{
      localStorage.setItem('course', JSON.stringify(res.class));
      this.router.navigateByUrl('course')
     })  
  }
}
