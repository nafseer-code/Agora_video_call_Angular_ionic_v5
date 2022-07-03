import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { NgxAgoraModule, AgoraConfig } from 'ngx-agora';
 
// Add 
const agoraConfig: AgoraConfig = {
  AppID: 'ca684964104241ffadd816aad17be4b8'
};


@NgModule({
  imports:      [ BrowserModule, FormsModule, IonicModule.forRoot(), NgxAgoraModule.forRoot(agoraConfig) ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
