import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User, Resp } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable, throwError } from "rxjs";
import { catchError, retry, mergeMap } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";
import { server } from "../constants";
@Injectable({ providedIn: "root" })
export class FireLoginService {
  constructor(
    private fireAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router
  ) {}
  async loginWithGoogle() {
    await this.fireAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        let fireUser = res.user;
        console.log(JSON.stringify(res.user));
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            this.sendAuth(idToken, fireUser).subscribe(
              (authRes) => {
                console.log(authRes);
                this.fetchDetails(authRes["authToken"]).subscribe(
                  (res:User) => {
                    console.log(res);
                    let user = res;
                    user.bearer = authRes['authToken'];
                    localStorage.setItem("user", JSON.stringify(user));
                    if (user.stage == 1) {
                      this.router.navigate(["brand-select"]);
                    } else this.router.navigate(["default", "dashboard"]);
                  },
                  (err) => console.log("HTTP Error in FETCH", err)
                );
              },
              (err) => console.log("HTTP Error in Auth Verify", err)
            );
          })
          .catch((err) => {
            console.log("LOGIN FAILED->>" + err);
          });
      });
  }

  sendAuth(token, user) {
    var myHeaders = new HttpHeaders();
    const body = {
      user: {
        userId: token,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      },
    };
    return this.http.post(server+"/auth/verify", body, {
      headers: myHeaders,
    });
  }

  fetchDetails(token) {
    var myHeaders = new HttpHeaders().set("Authorization", "Bearer " + token);
    const body = {
      user: null
    };
    return this.http.post(server+"/auth/fetch",body, {
      headers: myHeaders,
    });
  }

  async fireLogout(){
    console.log("logging out");
    localStorage.clear();
    await this.fireAuth.signOut().then(
      ()=> this.router.navigate(['../../home'])
    ).catch(
      err => console.log("ERR WHILE LOGOUT",err)
    )
  }
}
