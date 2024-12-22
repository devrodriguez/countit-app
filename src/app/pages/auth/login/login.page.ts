import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public authFormGr!: FormGroup

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.authFormGr = this.formBuilder.group({
      nickname: new FormControl(
        '',
        [
          Validators.required,
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      )
    })
  }

  async signIn() {
    const { nickname, password } = this.authFormGr.value

    try {
      await this.authSrv.signIn(nickname, password)
      this.router.navigateByUrl('count-workpoint', { replaceUrl: true })
    } catch (err) {
      console.error(err)
    }
  }
}
