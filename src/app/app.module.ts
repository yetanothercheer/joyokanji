import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from './card/card.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnkiService } from './anki.service';
import { SettingComponent } from './setting/setting.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { ListComponent } from './list/list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    SettingComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDividerModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    ScrollingModule,
    MatRippleModule
  ],
  providers: [AnkiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
