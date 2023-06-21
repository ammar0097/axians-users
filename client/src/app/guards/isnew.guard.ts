import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsnewGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}
  canActivate(route: ActivatedRouteSnapshot) {
    return new Promise<boolean>((resolve) => {
      this.authService.loadCurrentUser();
      this.authService.currentUser$
        .pipe(
          filter(user => user !== null),
          take(1)
        )
        .subscribe(user => {
          
          if (route && route.routeConfig && route.routeConfig.path === 'newpassword') {
            if (user.isNew === true) {
              resolve(true);
            } else {
              this.router.navigate(['/']);
              resolve(false);
            }
          }
          else{
            if (user.isNew === false) {
              resolve(true);
            } else {
              this.router.navigate(['/newpassword']);
              resolve(false);
            }
          }
        
        });
    });
  }
}
