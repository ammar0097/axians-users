import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient : HttpClient) { }

 private urlApi = "http://localhost:3000/"

  getStats(){
    return this.httpClient.get<any>(`${this.urlApi}dashboard`).pipe(
      map((response) =>{
        return response.data; 
      }
    ))
  }

}
