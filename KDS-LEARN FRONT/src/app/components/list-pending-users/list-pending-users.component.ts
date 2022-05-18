import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserServiceService } from 'src/app/services/restUser/user-service.service';
import { CONNECTION } from 'src/app/services/global';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.css']
})
export class ListPendingUsersComponent implements OnInit, DoCheck {
  users:[];
  search;
  role: string;
  public userSelected:User;
  public user;
  public token;
  uri;

  constructor(private restUser: UserServiceService) { }

  ngOnInit(): void {
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.role = localStorage.getItem('role');
    this.listPendingUsers();
    this.uri = CONNECTION.URI;
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
    this.role = this.restUser.getRole();
  }

  deleteUserAdmin(){
    console.log(this.user._id, this.userSelected);
    this.restUser.deteleUserByAdmin(this.user._id, this.userSelected).subscribe((res:any)=>{
      if(res.userRemoved){
        alert(res.message);
  
        this.user = this.restUser.getUser()
        this.ngOnInit();
      }else{
        alert(res.message);
        this.ngOnInit();
      }
    },
    error => alert(error.error.message))
  }

  getAccess(){
    console.log(this.userSelected);
    this.restUser.getAccess(this.userSelected).subscribe((res:any)=>{
      if(res.userUpdated){
        console.log(res.message);
        this.user = this.restUser.getUser();
        this.ngOnInit();
      }else{
        console.log(res.message);
        this.ngOnInit();
      }
    },
    error => console.log(error.error.message))
  }

  listPendingUsers(){
    this.restUser.getPendingUsers().subscribe((res:any)=>{
      if(res.users){
        this.users= res.users;
        console.log(this.users)
      }else{
        console.log(res.message)
      }
    }, error=> console.log(error.error.message));
  }

  getUser4(userS){
    this.userSelected = userS;
    console.log(this.userSelected)
  }
}
