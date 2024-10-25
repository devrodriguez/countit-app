import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User = {} as User;

  public appPages = [
    { title: 'Conteos', url: '/counts', icon: 'mail' },
    { title: 'Ramos', url: '/count-bunches', icon: 'mail' },
  ];

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.user = this.authSrv.user;
  }
}
