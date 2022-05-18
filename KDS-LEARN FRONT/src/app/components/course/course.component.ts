import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { RestCommentsService } from 'src/app/services/restComments/rest-comments.service';
import { RestCourseService } from 'src/app/services/restCourse/rest-course.service';
import { UserServiceService } from 'src/app/services/restUser/user-service.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
comments: [];
public message;
public user;
public token;
public course;
public video;
public classSelected:Class;
public commentSelected:Comment;
uri;

  constructor(private restComment: RestCommentsService, private restUser: UserServiceService, private restClass: RestCourseService) { }

  ngOnInit(): void {
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.course = this.restClass.getClass();
    this.video = this.course.video.substr(-11);
    this.comments = this.course.comments;
    this.listComments();
    this.video = this.course.video;
  }

  listComments(){
    console.log(this.user);
    this.restComment.getComments(this.user._id, this.course._id).subscribe((res:any)=>{
      console.log(res);
      if(res.commentsFind){
        this.comments = res.commentsFind;
        console.log(this.comments)
        this.ngOnInit();
      }
    }, error => alert(error.error.message))
  }

  deleteComment(){
    console.log(this.user._id, this.course._id);
    this.restClass.deleteComment(this.user._id, this.course._id, this.commentSelected).subscribe((res:any)=>{
      if(!res.commentRemoved){
        this.ngOnInit();
        alert(res.message);
      }else{
        this.ngOnInit();
        alert(res.message);
        console.log('aqui')
      }
    },
    error => alert(error.error.message))
  }

  getClass(userT){
    this.classSelected = userT;
   console.log(this.classSelected)
  }

  getComment(comment){
    this.commentSelected = comment;
   console.log(this.commentSelected)
  }

  getVideo(video){
    this.classSelected.video = video;
    video = this.course.video.substr(-11);
  }

}
