 import { Component, DoCheck, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/restUser/user-service.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { fadeIn } from 'src/app/animations/animations';  
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeIn]
})
export class LoginComponent implements OnInit, DoCheck {
  public user: User;
  public token:string = null;
  public message;

  constructor(private restUser: UserServiceService, private router: Router) { 
    this.user = new User('','','','','','','',null,'','')
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
  }

  ngDoCheck(): void {
    this.token = this.restUser.getToken();
  }

  onSubmit(){
    this.restUser.login(this.user, 'true').subscribe((res:any)=>{
      this.message = res.message;
      if(!res.token){
        alert(this.message);
      }else{
        delete res.user.password;
        this.token = res.token;
        if(this.token.length <= 0){
          alert('El token no se generó o capturó de manera correcta');
        }else{
          localStorage.setItem('token', this.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('role', JSON.stringify(res.user.role));    
          console.log(res.user, res.token , res.user.role);
          console.log('Usuario logeado exitosamente');
          this.router.navigateByUrl('home')
        }
      }
    },
    error=> this.message = error.error.message
    )     
  }

}
