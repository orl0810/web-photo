// error-banner.component.ts
import { Component } from '@angular/core';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-error-banner',
  template: `
    <div *ngIf="errorService.getError()" class="error-banner">
      <p>{{ errorService.getError() }}</p>
      <button (click)="errorService.clear()">Dismiss</button>
    </div>
  `,
  styleUrls: ['./error-banner.component.scss']
})
export class ErrorBannerComponent {
  constructor(public errorService: ErrorService) {}
}
