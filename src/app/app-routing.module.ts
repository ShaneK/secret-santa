import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawDisplayComponent } from './components/draw-display/draw-display.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'results',
    component: DrawDisplayComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
