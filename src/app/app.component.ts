import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
// import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private authSub:Subscription;
  private previousAuthState =false;

  constructor(private authService:AuthService,
    private router:Router,
    private platform:Platform) {

      this.initializeApp();
    }

    initializeApp(){
      console.log(this.platform.is('hybrid'));
      this.platform.ready().then(()=>{
        if(Capacitor.isPluginAvailable('SplashScreen')){
          Plugins.SplashScreen.hide();
        }
      });
    }

  ngOnInit() {
   this.authSub= this.authService.userIsAuthenticated.subscribe(isAuth=>{
     if(!isAuth && this.previousAuthState !==isAuth){
       this.router.navigateByUrl('/auth'); 
     } 
     this.previousAuthState=isAuth;
    })
  }

  onLogout(){
    this.authService.logout();
    // this.router.navigateByUrl('/auth');
  }

  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

  
}
