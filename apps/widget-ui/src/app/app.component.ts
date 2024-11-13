import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SearchWidgetComponent } from './search-widget/search-widget.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, SearchWidgetComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'widget-ui';
}
