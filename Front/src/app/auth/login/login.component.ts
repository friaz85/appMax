import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FeathericonComponent } from '../../shared/component/feathericon/feathericon.component';
import { CommonModule } from '@angular/common';
import { Api } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import moment from 'moment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FeathericonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public show: boolean = false;
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    public Api: Api
  ) {

    const userData = localStorage.getItem('user');
    if (userData?.length != null) {
      router.navigate(['/pages/sample-page1'])
    }

    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", Validators.required],
    });

  }
  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  async login() {
    try {
      this.auth.login(this.loginForm.value["email"], this.loginForm.value["password"]).subscribe(async (data) => {
        console.log(data);

        await this.opcion1Dia();

      });
    } catch (error) {
      console.log(error);
    }
  }

  async opcion1Dia() {
    // Escenario 1 por día
    await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 2).subscribe(async (dataOdeS) => {
      console.log(dataOdeS);
      if (dataOdeS.length > 0) {
        // Escenario 1 por día - Estatus 2 (aceptada)
        this.router.navigate(["/pages/ordenes-aceptadas"]);
        return;
      } else {
        await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 4).subscribe(async (dataOdeS4) => {
          console.log(dataOdeS4);
          if (dataOdeS4.length > 0) {
            // Escenario 1 por día - Estatus 4 (iniciada)
            this.router.navigate(["/pages/ordenes-aceptadas"]);
            return;
          } else {
            await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 5).subscribe(async (dataOdeS5) => {
              console.log(dataOdeS5);
              if (dataOdeS5.length > 0) {
                // Escenario 1 por día - Estatus 5 (cerrada)
                this.router.navigate(["/pages/ordenes-aceptadas"]);
                return;
              } else {
                await this.opcion1Anio();
              }
            });
          }
        });
      }
    });
  }

  async opcion1Anio() {
    // Escenario 1 por año
    await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 2).subscribe(async (dataOdeS) => {
      console.log(dataOdeS);
      if (dataOdeS.length > 0) {
        // Escenario 1 por año - Estatus 2 (aceptada)
        this.router.navigate(["/pages/ordenes-aceptadas"]);
        return;
      } else {
        await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 4).subscribe(async (dataOdeS4) => {
          console.log(dataOdeS4);
          if (dataOdeS4.length > 0) {
            // Escenario 1 por año - Estatus 4 (iniciada)
            this.router.navigate(["/pages/ordenes-aceptadas"]);
            return;
          } else {
            await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 5).subscribe(async (dataOdeS5) => {
              console.log(dataOdeS5);
              if (dataOdeS5.length > 0) {
                // Escenario 1 por año - Estatus 5 (cerrada)
                this.router.navigate(["/pages/ordenes-aceptadas"]);
                return;
              } else {
                await this.opcion2_3();
              }
            });
          }
        });
      }
    });
  }

  async opcion2_3() {
    // Escenario 2 - Aceptar órdenes
    await this.Api.getOdeSxAnioInge(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId).subscribe((data) => {
      console.log(data);
      if (data.length > 0) {
        // Escenario 2 - Listadado para aceptar órdenes
        this.router.navigate(["/pages/ordenes-sin-aceptar"]);
        return;
      } else {
        // Escenario 3 - Calendario para órdenes aceptadas
        this.router.navigate(["/pages/ordenes"]);
        return;
      }

    })
  }
}
