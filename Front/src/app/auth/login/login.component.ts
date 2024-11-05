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

  empresas: any = [];
  sucursales: any = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    public Api: Api
  ) {

    this.getEmpresa();
    this.loginForm = this.fb.group({
      usuario: ["", [Validators.required]],
      password: ["", Validators.required],
      // empresa: ["", Validators.required],
      // sucursal: ["", Validators.required],
    });

  }
  showPassword() {
    this.show = !this.show;
  }

  getEmpresa() {
    this.Api.getEmpresa().subscribe(async (data) => {
      console.log(data);
      this.empresas = data;
    });
  }

  getSucursalPorEstado(idEmpresa: any) {
    this.Api.getSucursalPorEmpresa(idEmpresa).subscribe(async (data) => {
      console.log(data);
      this.sucursales = data;
    });

  }

  // Simple Login
  async login() {
    try {
      this.auth.login(this.loginForm.value["usuario"], this.loginForm.value["password"]).subscribe(async (data) => {
        console.log(data);

      });
    } catch (error) {
      console.log(error);
    }
  }

}
