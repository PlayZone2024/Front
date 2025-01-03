import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthModule } from './features/auth/auth.module';
import { TimeTrackingModule } from './features/time-tracking/time-tracking.module';
import { TimeTrackingRoutingModule } from './features/time-tracking/time-tracking-routing.module';

import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from "primeng/panelmenu";
import { FooterComponent } from './layout/footer/footer.component';

//PRIMENG
import { ButtonModule } from "primeng/button";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { DepenseService } from './features/projects/services/depense.service';
import { ChartModule } from 'primeng/chart';
import { jwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
// DATE
import { registerLocaleData } from '@angular/common';
import localeFrBe from '@angular/common/locales/fr-BE';
import { RapportsComponent } from './features/rapports/rapports.component';
import {CalendarModule} from 'primeng/calendar';
import { CalendarComponent } from './features/time-tracking/components/calendar/calendar.component';

registerLocaleData(localeFrBe);

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
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
        FloatLabelModule,
        DropdownModule,

        // PrimeNG
        BrowserModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
        FloatLabelModule,
        DropdownModule,
        ScrollPanelModule,
        CalendarModule,
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-BE'},
        provideHttpClient(withInterceptors([jwtInterceptor])),
        DepenseService,
        provideAnimationsAsync() // Ajout de l'interceptors => provideHttpClient(withInterceptors([tokenInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
