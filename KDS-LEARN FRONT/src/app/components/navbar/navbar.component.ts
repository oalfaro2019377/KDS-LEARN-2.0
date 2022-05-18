import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/global';
import { UserServiceService } from '../../services/restUser/user-service.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],

})
export class NavbarComponent implements OnInit, DoCheck  {
  token:string = null!;
  user:string;
  uri;

  constructor(private router: Router, private restUser:UserServiceService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')!;
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.uri = CONNECTION.URI;
  }

   ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  logOut(){
    localStorage.clear();
    this.token = null!;
    this.router.navigateByUrl('login');
  }

  eliminarUsername(){
    localStorage.removeItem('username');
  }

}



