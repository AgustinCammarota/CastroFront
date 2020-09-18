import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest} from '@angular/common/http';
import {URL_BACKEND} from '../config/config';
import {Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {Productos} from './productos';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlEndPoint: string = URL_BACKEND + '/api/productos';

  constructor( private http: HttpClient,
               private router: Router) { }

  listarPaginaProducto(page: string, size: string): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(this.urlEndPoint + '/pagina', { params: params });
  }

  saveProducto(producto: Productos): Observable<Productos> {
    return this.http.post<Productos>(this.urlEndPoint, producto)
      .pipe(map( (respuesta: any) => respuesta.producto as Productos),
        catchError(e => {
          if (e.status === 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        }));
  }

  update(producto: Productos): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${producto.id}`, producto).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  getProducto(id: number): Observable<Productos> {
    return this.http.get<Productos>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401) {
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  getProductoPorCategoria(categoria: string): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.urlEndPoint}/filtar-categoria/${categoria}`).pipe(
      catchError(e => {
        if (e.status !== 401) {
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  delete(producto: Productos): Observable<Productos> {
    return this.http.delete<Productos>(`${this.urlEndPoint}/${producto.id}`);
  }

  subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
