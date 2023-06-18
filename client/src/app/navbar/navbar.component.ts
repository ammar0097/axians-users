import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser:any = {}


  constructor( private authService:AuthenticationService,private router: Router,) {}
  
  
  ngOnInit() {
   this.getCurrentUser()
  }

  getCurrentUser(){
    if (this.authService.loggedIn()){
      this.authService.loadCurrentUser()
    }
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
