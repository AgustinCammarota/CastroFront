
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService, 
    private router: Router) {}

    //Metodo encargado de corrobar si hay algun error proveniente del 
  //backend de tipo no autenticado o no autorizado, permite evitar dicha corrobo-
  //racion en todos los metodos del clienteService
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {
        if(e.status == 401) {
          if(this.authService.isAuthenticated()) {
            this.authService.logout(); //Cuando el token expira se cierra la sesion
          }
          this.router.navigate(['/login']);
        }//No autorizado
        if(e.status == 403) {
          swal('Acceso Denegado', `Hola ${this.authService.usuario.username} no tiene acceso a este recurso!`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }

}