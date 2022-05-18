import { Component, OnInit , DoCheck} from '@angular/core';
import { CONNECTION } from 'src/app/services/global';
import { UserServiceService } from '../../services/restUser/user-service.service';
import { fadeIn } from 'src/app/animations/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeIn]
})
export class HomeComponent implements OnInit, DoCheck {
  token:string = null;
  user:string;
  role:string;
  uri;
  constructor(private restUser:UserServiceService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.user = localStorage.getItem('user');
    this.role = localStorage.getItem('role');
    this.uri = CONNECTION.URI;
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
    this.role = this.restUser.getRole();
  }
}
