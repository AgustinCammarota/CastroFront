import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductoService} from '../producto.service';
import swal from 'sweetalert2';
import {Productos} from '../productos';
import {HttpEventType} from '@angular/common/http';
import {Cliente} from '../../clientes/cliente';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styles: []
})
export class FormularioComponent implements OnInit {

  producto: Productos = new Productos();
  errores: string[] = [];
  categorias: string[] = ['Hogar', 'Computadora', 'Television', 'Heladera', 'Celulares'];
  fotoSeleccionada: File;


  constructor( private activatedRoute: ActivatedRoute,
               private router: Router,
               private productoService: ProductoService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.productoService.getProducto(id).subscribe((respuesta: Productos) => this.producto = respuesta);
      }
    });
  }

  create(): void {
    this.productoService.saveProducto(this.producto)
      .subscribe( respuesta => {
        this.router.navigate(['/productos']);
        swal('Nuevo Producto', `El producto ${this.producto.nombre} ha sido creado con éxito`, 'success');
      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        });
  }

  update(): void {
    this.productoService.update(this.producto)
      .subscribe( respuesta => {
          this.router.navigate(['/productos']);
          swal('Producto Actualizado', `${respuesta.mensaje}: ${respuesta.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        });
  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.productoService.subirFoto(this.fotoSeleccionada, this.producto.id)
        .subscribe(event => {
          if (event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.producto = response.producto as Productos;
            swal('La foto se ha subido completamente!', response.mensaje, 'success');
          }
        });
    }
  }
}
