import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedTab: string = 'text';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
