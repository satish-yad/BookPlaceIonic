import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin=true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl:AlertController

  ) {}

  ngOnInit() {}

  authenticate(email:string, password:string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        
        let authObs:Observable<AuthResponseData>;
        if(this.isLogin){
          authObs = this.authService.login(email, password);
        }else{
          authObs=this.authService.signup(email, password);
        }
        authObs.subscribe(resData =>{
          console.log(resData);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, errRes=>{
          console.log(errRes);
          loadingEl.dismiss();
          const code=errRes.error.error.message;
          let message='Could not sign you Up, please try again.';
          if(code=='EMAIL_EXISTs'){
            message='This email address alredy exists!';
          }else if(code=='EMAIL_NOT_FOUND'){
            message='Email address could not be found.';
          }else if(code=='INVALID_PASSWORD'){
            message='This password is not correct.';
          }else if(code=='MISSING_EMAIL'){
            message='MISSING_EMAIL Found.';
          }
          this.showAlert(message);
        });
      });
  }

  onSwitchAuthMode(){
this.isLogin=!this.isLogin
  }

  onSubmit(form:NgForm){

    if(!form.valid){
      return;
    }

    const email= form.value.email;
    const password= form.value.password;

    console.log(email, password);

    // if(this.isLogin){
    //   //send a request to login server
    // }
    // else{
    //   //send a request to signup server
     
    // }
    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(messag:string){
    this.alertCtrl.create({ 
      header:'Authentication failed',
      message: 'Cancelling...',
      buttons:['Okay'] 
    }).then(alertEl => alertEl.present());
  }

}
