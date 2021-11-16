import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AdvancedComponent } from './search-bar/advanced/advanced.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { HeaderComponent } from './header/header.component';
import { ButtonSelectDirective } from './search-bar/advanced/button-select.directive';
import { HttpClientModule } from '@angular/common/http';
import { PostComponent } from './post/post.component';
import { SubredditComponent } from './subreddit/subreddit.component';
import { DataService } from './search-bar/data.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    AdvancedComponent,
    HeaderComponent,
    ButtonSelectDirective,
    PostComponent,
    SubredditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
