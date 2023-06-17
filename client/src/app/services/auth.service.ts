import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }
    urlApi = "http://localhost:3000"

    login(username: string, password: string) {
        return this.http.post(`${this.urlApi}/login`, { username: username, password: password }).pipe(
            map((response:any) => {
                // login successful if there's a jwt token in the response
                if (response && response.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.username);
                    localStorage.setItem('isAdmin', response.isAdmin);
                    localStorage.setItem('isActive', response.isActive);
                }
                return response;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }
}