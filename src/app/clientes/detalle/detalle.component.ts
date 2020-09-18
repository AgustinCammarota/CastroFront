import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';
import { URL_BACKEND } from '../../config/config'

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  //Inyeccion de atributos de clase padre a hija
  //Me permite obtener el cliente a modificar
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File; //Imp de tipo File
  progreso: number = 0;
  factura: Factura;
  urlBackend: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService) { }

  ngOnInit() { }

  seleccionarFoto(event: any) {
    //Seteo el target producto del evento a la foto. 
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    //Corroboro si tiene un idex de tipo imagen, devuelve 1 si tiene. 
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else { //Le paso al save como parametro el id que obtuve de la inyeccion
      //del listado de clientes y el archivo seleccionado.
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => { 
          //Corrobora si el tipo de evento es de progreso de subida
          if (event.type === HttpEventType.UploadProgress) {
            //Para ir obteniendo el porcentaje: lo cargado / el total * 100
            this.progreso = Math.round((event.loaded / event.total) * 100);
            //Corrobora si el tipo de evento es de respuesta a solicitud
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            //Permite notificar de cambios para actualizar el listado
            this.modalService.notificarUpload.emit(this.cliente);
            swal('La foto se ha subido completamente!', response.mensaje, 'success');
          }
        });
    }
  }

  //Modal = a ventana superpuesta del navegador con la que muestro el detalle
  //Se invoca con un evento click para cerrar el modal
  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null; //Para reiniciar el progreso y lo seleccionado
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.facturaService.deleteFactura(factura.id).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            swal(
              'Factura Eliminado!',
              `Factura ${factura.descripcion} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

}
