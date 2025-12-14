import { Component, OnChanges, signal, Signal, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {

  route: string = '';

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.router.events.subscribe((routerUrl: any) => {
      if(routerUrl.url != undefined)
        this.route = routerUrl.url
    })
  }
}
