import { Injectable } from '@angular/core';
import { CONNECTION } from '../global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadUserService {
  public uri:string;

  constructor(private http:HttpClient) {
    this.uri = CONNECTION.URI;
   }

   fileRequest(idUser:string, params: Array<string>, files: Array<File>, token:string, name:string){
    return new Promise((resolve, reject)=>{
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      let uri = this.uri+'/uploadImage/'+idUser;

      for(var i=0; i < files.length; i++){
        formData.append(name, files[i], files[i].name);
      }
      xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response)
          }
        }
      }
      xhr.open('PUT', uri, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    })
   }
}
