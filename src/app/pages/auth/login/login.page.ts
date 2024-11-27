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
      email: new FormControl(
        'john.rodriguez.25@hotmail.com',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        'Erudito.100',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      )
    })
  }

  async signIn() {
    const { email, password } = this.authFormGr.value

    try {
      await this.authSrv.signIn({ email, password })
      this.router.navigateByUrl('count-workpoint', { replaceUrl: true })
    } catch (err) {
      console.error(err)
    }
  }
}
