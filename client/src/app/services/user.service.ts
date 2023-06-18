import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private http: HttpClient) {}

  private urlApi = "http://localhost:3000/"

  createUser(data:any){
    return this.http.post<any>(`${this.urlApi}users`,data).pipe(
      map((response) => {
        return response.message;
      })
    );
  }

  updateUser(id:number,data:any){
    console.log(data);
    
    return this.http.put<any>(`${this.urlApi}users/${id}`,data).pipe(
      map((response) => {
        return response.result;
      })
    );
  }

  listUsers() {
    return this.http.get<any>(`${this.urlApi}users`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.urlApi}users/${id}`).pipe(
      map((response) => {
        return response.data;
      })
    );
}

  deleteUser(id:number) {
    return this.http.delete<any>(`${this.urlApi}users/${id}`).pipe(
      map((response) => {
        return response.message;
      })
    );
  }
 
}