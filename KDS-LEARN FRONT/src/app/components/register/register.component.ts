import { Component, OnInit } from '@angular/core';
import { User } from  '../../models/user.model';
import { UserServiceService } from '../../services/restUser/user-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})
export class RegisterComponent implements OnInit {
  public user:User;
  public message;
  public userSaved:string;


  constructor(private userService:UserServiceService) {
    this.user = new User('','','','','','','',null,'','ROLE_TEACHER');
  }

  ngOnInit(): void {
  }

  onSubmit(register){
    console.log(this.user);
    this.userService.saveUserbyTeacher(this.user).subscribe((res:any)=>{
      this.message = res.message;
      if(res.userSaved){
        this.userSaved = res.userSaved.username;
        register.reset();
        //console.log(this.user)
      }else{
        console.log(this.message);
      }
    },
    error=> console.log(<any>error)
    )
  }

}


  

