import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  urlApi = "http://localhost:3000"
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  login(username: string, password: string) {
    return this.http.post(`${this.urlApi}/login`, { username: username, password: password }).pipe(
      map((response: any) => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('jwtToken', response.token);
          this.loadCurrentUser(); // Update current user
        }
        return response;
      }));
  }

  loadCurrentUser() {
    this.http.get(`${this.urlApi}/current`).subscribe(
      (response: any) => {
        this.currentUserSubject.next(response.data);
      },
      (error) => {
        console.log('Failed to load current user', error);
      }
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null); // Clear the current user
  }
}