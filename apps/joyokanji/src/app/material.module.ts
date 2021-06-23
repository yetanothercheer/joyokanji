import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

const modules = [
  MatSliderModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatCardModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
