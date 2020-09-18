import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }
  public get usuario(): Usuario {
    //Si el usuario no es null lo retorno
    if(this._usuario != null) {
      return this._usuario;
      //Si el usuario es null pero se encuentra en la sesion del navegador
      //Lo busco y lo retorno.
    }else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
     this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
     return this._usuario;
    }
    //Retorno una nueva intancia del objeto vacio si no se cumplen los if
    return new Usuario();
  }
  public get token(): string {
      if(this._token != null) {
        return this._token;
      }else if (this._token == null && sessionStorage.getItem('token') != null) {
       this._token = sessionStorage.getItem('token');
       return this._token;
      }
      return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = URL_BACKEND + '/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    //Parametros que se quieren pasar en el header o cabecera
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                          'Authorization': 'Basic ' + credenciales});
    //Parametros que se quieren pasar en el http para la autenticacion
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    //Imp convertir el params en string
    return this.http.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    //Permite guardar el usuario en el la sesion.
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if(accessToken != null) {
      //Permite obtener el payload del token, ya que el access token
      //Contiene todos los datos del mismo y con el split filtro.
      //Es necesario desencriptar el base 64 y convertir a objeto json.
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  //Imp para que si esta autenticado no vuelva a mostrar la pagina del login
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  //Permite ocultar o mostar contenido segun el rol con un if
  hasRole(role: string): boolean {
    if(this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    //Limpia la sesion del navegador
    sessionStorage.clear();
    //sessionStorage.removeItem('token');
  }
}
