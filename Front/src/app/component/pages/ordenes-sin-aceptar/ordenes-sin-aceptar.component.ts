import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AuthService } from '../../../shared/services/auth.service';
import { Api } from './../../../shared/services/api.service';

import moment from 'moment';
import Swal from "sweetalert2";

@Component({
  selector: 'app-ordenes-sin-aceptar',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule, FlatpickrModule, NgbModule ],
  templateUrl: './ordenes-sin-aceptar.component.html',
  styleUrls: ['./ordenes-sin-aceptar.component.scss']
})
export class OrdenesSinAceptarComponent implements OnInit {

  arrOrdenes: any = [];
  arrMotivosRechazo:any = [];
  txtObservaciones = '';
  idMotivo = 0;
  intOSId = 0;
  fecha: any;

  constructor(
    private modal: NgbModal, 
    private Api: Api,
    private auth: AuthService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getOrdenes();
    this.getMotivosRechazo();
  }

  getOrdenes() {
    this.Api.getOdeSxAnioInge(moment().format('YYYY'), this.auth.currentUserValue.intUsuarioId).subscribe((data) => {
      console.log(data);
      this.arrOrdenes = data;

    })
  }

  getMotivosRechazo(){
    this.Api.getMotivosRechzo().subscribe((data) => {
      console.log('Motivos', data);
      this.arrMotivosRechazo = data;
    })
  }

  showModalRechazo(content: any, intOSId: any) {
    this.intOSId = intOSId;
    this.fecha = this.arrOrdenes.find((x: any) => x.intOSId === intOSId).fServicio;
    this.modal.open(content, {
      size: "lg",
      centered: true,
      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  async aceptarOrden(intOSId: any, fServicio: any) {
    let date = fServicio.split('/');
    let fServicio2 = date[2] + '-' + date[1] + '-' + date[0];
    console.log('Aceptar Orden', fServicio2);
    let data = await this.Api.OrdenesDeServicioStatusAsig(intOSId, 2, 0, '', this.auth.currentUserValue.intUsuarioId, this.auth.currentUserValue.intUsuarioId, fServicio2).subscribe((data) => {
      console.log(data);
      this.getOrdenes();
      Swal.fire({
        icon: "success",
        title: "Atención",
        text: "Orden aceptada con éxito",
      }).then(
        (result) => {
          this.modal.dismissAll();
        }
      );
    });
  }

  async rechazarOrden() {
    let date = this.fecha.split('/');
    let fServicio2 = date[2] + '-' + date[1] + '-' + date[0];
    console.log('Rechazar Orden', this.fecha);
    let data = await this.Api.OrdenesDeServicioStatusAsig(this.intOSId, 3, this.idMotivo, this.txtObservaciones, this.auth.currentUserValue.intUsuarioId, this.auth.currentUserValue.intUsuarioId, fServicio2).subscribe((data) => {
      console.log(data);
      this.getOrdenes();
      Swal.fire({
        icon: "success",
        title: "Atención",
        text: "Orden rechazada con éxito",
      }).then(
        (result) => {
          this.modal.dismissAll();
          this.txtObservaciones = '';
          this.idMotivo = 0;
        }
      );
    });
  }

}
