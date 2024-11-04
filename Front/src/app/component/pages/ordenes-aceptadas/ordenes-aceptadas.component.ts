import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Api } from '../../../shared/services/api.service';
import moment from 'moment';
import { AuthService } from '../../../shared/services/auth.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-ordenes-aceptadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes-aceptadas.component.html',
  styleUrl: './ordenes-aceptadas.component.scss'
})
export class OrdenesAceptadasComponent {

  OdeS: any = [];
  constructor(
    private Api: Api,
    private auth: AuthService
  ) {
    // this.OdeS = this.Api.currentOdeSValue;
    this.OdeS = JSON.parse(localStorage.getItem('OdeS') || '{}')[0];

    if (this.OdeS != 0) {
      this.getOrdenes()
    }
  }

  async getOrdenes() {
    // Escenario 1 por día
    await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 2).subscribe(async (dataOdeS) => {
      console.log(dataOdeS);
      if (dataOdeS.length > 0) {
        // Escenario 1 por día - Estatus 2 (aceptada)
        this.OdeS = dataOdeS[0];
        return;
      } else {
        await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 4).subscribe(async (dataOdeS4) => {
          console.log(dataOdeS4);
          if (dataOdeS4.length > 0) {
            // Escenario 1 por día - Estatus 4 (iniciada)
            this.OdeS = dataOdeS4[0];
            return;
          } else {
            await this.Api.OrdenesDeServicioFechaStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, moment(new Date()).format("YYYY-MM-DD"), 5).subscribe(async (dataOdeS5) => {
              console.log(dataOdeS5);
              if (dataOdeS5.length > 0) {
                // Escenario 1 por día - Estatus 5 (cerrada)
                this.OdeS = dataOdeS5[0];
                return;
              }
            });
          }
        });
      }
    });

    // Escenario 1 por año
    await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 2).subscribe(async (dataOdeS) => {
      console.log(dataOdeS);
      if (dataOdeS.length > 0) {
        // Escenario 1 por año - Estatus 2 (aceptada)
        this.OdeS = dataOdeS[0];
        return;
      } else {
        await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 4).subscribe(async (dataOdeS4) => {
          console.log(dataOdeS4);
          if (dataOdeS4.length > 0) {
            // Escenario 1 por año - Estatus 4 (iniciada)
            this.OdeS = dataOdeS4[0];
            return;
          } else {
            await this.Api.OrdenesDeServicioAnioStatus(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId, 5).subscribe(async (dataOdeS5) => {
              console.log(dataOdeS5);
              if (dataOdeS5.length > 0) {
                // Escenario 1 por año - Estatus 5 (cerrada)
                this.OdeS = dataOdeS5[0];
                return;
              }
            });
          }
        });
      }
    });
  }

  async iniciarOrden() {
    let date = this.OdeS.fServicio.split('/');
    let fServicio = date[2] + '-' + date[1] + '-' + date[0];
    console.log('Iniciar Orden', fServicio);
    let data = await this.Api.OrdenesDeServicioStatusAsig(this.OdeS.intOSId, 4, 0, '', this.auth.currentUserValue.intUsuarioId, this.auth.currentUserValue.intUsuarioId, fServicio).subscribe((data) => {
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Atención",
        text: "Orden iniciada con éxito",
      });
      this.getOrdenes();
      this.OdeS.intStatus = 4;
    });
  }

  procesoCierre() {

  }
}
