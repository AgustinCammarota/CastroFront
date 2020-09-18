
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
//inspecciona/modifica las peticiones que va de tu aplicación al servidor y tambien
//lo que viene del servidor a tu aplicación (peticiones y respuesta/ antes y despues)
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auhtService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.auhtService.token;
    if (token != null) {
        const authReq = req.clone({//Para evitar pasar en todos los metodos del
          // clienteService la cabezera de los header con la autorizacion
            headers: req.headers.set('Authorization', 'Bearer' + token)
        });
       return next.handle(authReq);
    }
    return next.handle(req);
  }

}
