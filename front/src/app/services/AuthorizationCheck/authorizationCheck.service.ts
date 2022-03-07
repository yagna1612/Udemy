import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IsLoggedInService } from '../isLoggedIn/isLoggedIn.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationCheckService implements CanActivate {

  constructor(private router: Router,private isl:IsLoggedInService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //If token data exist, user may login to application
  var user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
  return true;
  }

  // otherwise redirect to login page with the return url
  // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  this.router.navigate([''])
  return false;
  }

}
