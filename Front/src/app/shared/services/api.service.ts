import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";

import { map, catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";

const headers_object = new HttpHeaders();
headers_object.append("Content-Type", "application/json");
headers_object.append("Authorization", "Basic " + btoa("client:client"));
headers_object.append("Access-Control-Allow-Origin", "*");

@Injectable({
  providedIn: "root",
})
export class Api {

  url = "http://72.167.54.207/OrdenesServiciosApi/api";

  private currentOdeSSubject: BehaviorSubject<any>;
  public currentOdeS: Observable<any>;

  constructor(private http: HttpClient) {
    console.log(this.url);
   
  }

  getEmpresa() {
    return this.http.get<any>(this.url + '/getEmpresa').pipe(
      map((data) => {
        return data;
      })
    );
  }

  getSucursalPorEmpresa(idEmpresa: any) {
    return this.http.get<any>(this.url + '/getSucursalPorEmpresa/' + idEmpresa ).pipe(
        map((data) => {
          return data;
        })
      );
  }
}