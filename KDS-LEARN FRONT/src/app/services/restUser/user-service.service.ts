import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../global';
import { map } from 'rxjs/operators';
;

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public token;
  public user;
  public role;
  public uri: string;
  public httOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      
    })
  };

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  constructor(private http:HttpClient) { 
    this.uri = CONNECTION.URI;
  }

  test(){
    return 'Mensaje desde el servicio'
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

  getUser(){
    let user = JSON.parse(localStorage.getItem('user')!);
    if(user != null || user != undefined){
      this.user = user;
    }else{
      this.user = null;
    }
    return this.user;
  }


  deteleUserByAdmin(idUser, idUserDeleted){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
    return this.http.delete(this.uri+'deleteUserByAdmin/'+idUserDeleted+'/'+idUser, {headers: headers})
    .pipe(map(this.extractData))
  }


  getUsers(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get(this.uri+ '/getUsers', {headers:headers})
    .pipe(map(this.extractData))
  }

  getPendingUsers(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get(this.uri+'/getPendingUsers', {headers:headers})
    .pipe(map(this.extractData))
  }

  getAccess(idUser){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put(this.uri+'getAccess/'+idUser, {headers:headers})
    .pipe(map(this.extractData))
  }

  removeAccess(idUser){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put(this.uri+'removeAccess/'+idUser, {headers:headers})
    .pipe(map(this.extractData))
  }

  getRole(){
    let role = JSON.parse(localStorage.getItem('role'));
    if(role != null || role != undefined){
      this.role = role;
    }else{
      this.role = null;
    }
    return this.role;
  }

  login(user, tokenStatus){
    user.gettoken = tokenStatus;
    let params = JSON.stringify(user);
    return this.http.post(this.uri+'login', params, this.httOptionsAuth)
    .pipe(map(this.extractData))
  }

  updateUser(userToUpdate){
    let params = JSON.stringify(userToUpdate);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
    return this.http.put(this.uri+'updateUser/'+userToUpdate._id, params, {headers: headers})
    .pipe(map(this.extractData))
  }

  deleteUser(idUser, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put(this.uri+'deleteUser/'+idUser, {password: password}, {headers: headers})
    .pipe(map(this.extractData))
  }

  saveUserbyStudent(user){
    let params = JSON.stringify(user);
    return this.http.post(this.uri + 'studentSave', params, this.httOptionsAuth)
    .pipe(map(this.extractData));
  }

  saveUserbyTeacher(user){
    let params = JSON.stringify(user);
    return this.http.post(this.uri + 'teacherSave', params, this.httOptionsAuth)
    .pipe(map(this.extractData));
  }

}
