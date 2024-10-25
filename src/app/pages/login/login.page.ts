import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: User = {} as User

  constructor(
    private readonly router: Router,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authSrv.user = this.user;
    this.router.navigateByUrl('count-bunches', { replaceUrl: true });
  }

}
