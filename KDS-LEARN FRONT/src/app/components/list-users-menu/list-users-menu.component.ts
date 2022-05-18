import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserServiceService } from 'src/app/services/restUser/user-service.service';

@Component({
  selector: 'app-list-users-menu',
  templateUrl: './list-users-menu.component.html',
  styleUrls: ['./list-users-menu.component.css']
})
export class ListUsersMenuComponent implements OnInit {
  users:[];
  search;
  role: string;
  public userSelected:User;
  public user;

  constructor(private restUser: UserServiceService) { }

  ngOnInit(): void {
    this.userSelected = new User('','','','','','','',null,'','')
    this.user = this.restUser.getUser();
    this.role = localStorage.getItem('role');
  }

}
