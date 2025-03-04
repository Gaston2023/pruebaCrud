import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {Platform, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AuthenticationService } from './core/services/authentication.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';  

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  providers:[
    Network
  ]
})
export class AppComponent {
  private lastBack = Date.now();
  constructor(
    private platform: Platform,
    private network: Network,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private authService : AuthenticationService,
  ) {
    this.platform.backButton.subscribe(() => {
      if (Date.now() - this.lastBack < 500) { // logic for double tap: delay of 500ms between two clicks of back button
        (navigator as any).app.exitApp();
      }
      this.lastBack= Date.now();
  });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.verificarConexion();
    console.log('INICIALIZANDO APP...');
    this.authService.isLoggedIn().subscribe(
      {
        next: (resp) => {
          environment.loggedIn=true;
          environment.username = resp.data.email;
          localStorage.setItem('user', JSON.stringify(resp.data));
          this.router.navigate(['']);
        },
        error: (error) => {}
      }
    )
    // let storedUser = localStorage.getItem('user')
    // console.log(storedUser);
    // if (storedUser) {
    //   this.currentUser = JSON.parse(String(storedUser));
    //   environment.loggedIn = true;
    //   environment.username = this.currentUser?.username
    // }
  }

  async verificarConexion() {
    // Verificar la conexión de red
    const tipoConexion = this.network.type;
    if (!tipoConexion || tipoConexion === 'none') {
      await this.mostrarErrorToast('No hay conexión de red...');
      return;
    }
    // Verificar la conexión con el backend
    console.log('chequeando coneccion con el servidor....');
    await this.http.get(environment.apiURL+environment.apiVersion).subscribe(
      {
        next: (resp) =>{},
        error: (err) => {
          console.log('Error de conexión con el servidor:', err);
          console.log(err);
          this.mostrarErrorToast('No hay coneccion con el servidor!!!')
        }
      }
    );
  }
  // Función para mostrar el toast
  async mostrarErrorToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'danger',
      duration: 7000,
      position: 'bottom',
    });
    await toast.present();
  }
}
