import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  //Permite notificar que algo ha cambiado
  notificarUpload = new EventEmitter<any>();

  constructor() { }
 
  //Para poder desplegar o no el modal en la vista.
  //Evento Click. 
  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
