import {Component, OnInit} from '@angular/core';
import {ProductoService} from './producto.service';
import {PageEvent} from '@angular/material';
import Swal from 'sweetalert2';
import {Productos} from './productos';
import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Productos[] = [];
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 4;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  productosColumnas: string[] = ['foto' , 'nombre', 'categoria', 'precio', 'cantidad', 'createAt', 'eliminar', 'editar'];
  urlBackend: string = URL_BACKEND;


  constructor( private productoService: ProductoService) { }

  ngOnInit() {
    this.calcularRangos();
  }

  private calcularRangos() {
    this.productoService.listarPaginaProducto(this.paginaActual.toString(), this.totalPorPagina.toString())
      .subscribe( respuesta => {
        this.productos = respuesta.content as Productos[];
        this.totalRegistros = respuesta.totalElements as number;
      });
  }

  public paginar( event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  eliminarProducto(producto: Productos) {
    Swal({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar a ${producto.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.productoService.delete(producto).subscribe( respuesta => {
          this.productos = this.productos.filter(p => p.id !== producto.id);
          this.calcularRangos();
          Swal('Eliminado:', `Producto ${producto.nombre} eliminado con exito!`, 'success');
        });
      }
    });
  }
}
