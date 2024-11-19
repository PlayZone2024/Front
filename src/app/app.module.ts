import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import { HomeComponent } from './features/home/home.component';
import { AuthModule } from './features/auth/auth.module';
import {provideHttpClient} from '@angular/common/http'; 
import { TimeTrackingModule } from './features/time-tracking/time-tracking.module';
import { TimeTrackingRoutingModule } from './features/time-tracking/time-tracking-routing.module';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { tokenInterceptor } from './interceptors/token.interceptor';

//PRIMENG
import {ButtonModule} from "primeng/button";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
    ],
    imports: [
        AppRoutingModule,
        ReactiveFormsModule,
        AuthModule,
        TimeTrackingModule,
        TimeTrackingRoutingModule,

        MatNativeDateModule,
        
        //PRIMENG
        BrowserModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
        FloatLabelModule
    ],
    providers: [
        provideHttpClient(),
        provideAnimationsAsync() // Ajout de l'interceptors => provideHttpClient(withInterceptors([tokenInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
