import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(
    private router: Router,
    private authSrv: AuthService) {}

  async signOut() {
    try {
      await this.authSrv.signOut()
      this.router.navigateByUrl('login', { replaceUrl: true })
    } catch (err) {
      console.error(err)
    }
  }

}