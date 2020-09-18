import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: String = 'Por favor Sing In!';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit() { //Para que si esta autenticado no vuelva a mostrar el login
    if(this.authService.isAuthenticated()) {
      swal('Login', `Hola ${this.authService.usuario.username} ya estas autenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      swal('Error Login', 'Username o password vacios!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      //El access_token contiene toda la informacion del token
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      this.router.navigate(['/clientes']);
      //Permite recurar el nombre de usuario a travez del metodo getUsuario
      let usuario = this.authService.usuario;
      swal('Login', `Hola ${usuario.username}, has iniciado sesion con exito!`, 'success');
    }, err => {
      if(err.status == 400) {
        swal('Error Login', 'Username o password incorrectas!', 'error');
      }
    });
  }

}
