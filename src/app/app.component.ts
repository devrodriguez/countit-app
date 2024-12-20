import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';

import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User | null = null;

  public appPages = [
    { title: 'Ramos', url: '/count-workpoint', icon: 'mail' },
  ];

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.user = this.authSrv.userData;
  }
}
