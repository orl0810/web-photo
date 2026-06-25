import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
  | 'envelope'
  | 'phone'
  | 'location';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
