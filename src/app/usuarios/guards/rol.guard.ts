import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(private authService: AuthService, 
    private router: Router) {}

  canActivate(//Permite validar los permisos de un usuario
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      //Primero validamos si esta autenticado antes de si esta autorizado 
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      let role = next.data['role'] as string;
      console.log(role);
      if(this.authService.hasRole(role)) {
        return true;
      }
    swal('Accedo Denegado', `Hola ${this.authService.usuario.username} no tienes acceso al recurso`, 'warning');
    this.router.navigate(['/clientes']);  
    return false;
  }
}
