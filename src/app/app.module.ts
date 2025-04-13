import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule and Routes

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { DefaultComponent } from './demo/default/dashboard/dashboard.component';

// Define the routes
const routes: Routes = [
  { path: 'dashboard/default', component: DefaultComponent },
  // other routes can be added here
];

@NgModule({
  declarations: [
    AppComponent // DefaultComponent is not declared here as it is standalone
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    RouterModule.forRoot(routes) // Add routing module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
