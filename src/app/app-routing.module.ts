import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainviewComponent } from './components/mainview/mainview.component';
import { AdminviewComponent } from './components/adminview/adminview.component';
import { DataviewComponent } from './components/dataview/dataview.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'mainview', component: MainviewComponent },
  { path: 'admin', component: AdminviewComponent },
  { path: 'dataview', component: DataviewComponent }
  // Các định tuyến khác...
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  title = 'vis02';
  events: string[] = [];
  opened: boolean | undefined;
  



}
