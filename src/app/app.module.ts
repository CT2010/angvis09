import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MainviewComponent } from './components/mainview/mainview.component';
import { AdminviewComponent } from './components/adminview/adminview.component';
import { DataviewComponent } from './components/dataview/dataview.component';
import { ViewchartComponent } from './components/viewchart/viewchart.component';


@NgModule({
  declarations: [
    AppComponent, AdminviewComponent, DataviewComponent, MainviewComponent, ViewchartComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: 'mainview', component: MainviewComponent},
      { path: 'admin', component: AdminviewComponent },
      { path: 'viewchart', component: ViewchartComponent },
      { path: 'dataview', component: DataviewComponent }
      // Các cấu hình route của bạn ở đây
    ]),
    HttpClientModule,
    CommonModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
