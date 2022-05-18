import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../global';
import { map } from 'rxjs/operators';
import { UserServiceService } from '../../services/restUser/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class RestCommentsService {
  public user;
  public uri: string;
  public token;
  public course;
  
  public httOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
  };

  constructor(private http:HttpClient, private restUser:UserServiceService) {
    this.uri = CONNECTION.URI;
   }

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  getToken(){
    let token = localStorage.getItem('token');
    if(token != null || token != undefined){
      this.token = token;
    }else{
      this.token = null;
    }
    return this.token;
  }

  getComments(idUser, idClass){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get(this.uri+'getComments/'+idUser+'/'+idClass, {headers:headers})
    .pipe(map(this.extractData))
  }

}
