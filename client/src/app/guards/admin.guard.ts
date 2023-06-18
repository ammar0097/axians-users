import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}
  canActivate() {
    return new Promise<boolean>((resolve) => {
      this.authService.loadCurrentUser();
      this.authService.currentUser$
        .pipe(
          filter(user => user !== null),
          take(1)
        )
        .subscribe(user => {
          if (user.isAdmin === true) {
            resolve(true);
          } else {
            this.router.navigate(['/']);
            resolve(false);
          }
        });
    });
  }
}
