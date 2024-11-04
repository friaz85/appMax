import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

    // Producción
    url = "http://72.167.54.207/OrdenesServiciosApi/api";


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("User") || "{}")
    );

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    return this.http
      .post<any>('/rest/Usuarios/', {
        "strUsuario": username,
        "strPassword": password,
        "strMail":"",
        "strNombre":"",
        "strPuesto":""    
    }, 
    {
      headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
      .pipe(
        map((user) => {
          console.log(user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.length > 0) { 
            localStorage.setItem("User", JSON.stringify(user[0]));
            this.currentUserSubject.next(user[0]);
          }
          return user;
        })
      );
  }

}
