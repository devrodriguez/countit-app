import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  browserSessionPersistence,
  updateProfile
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { UserUnauthorized } from '../helper/errors/userUnauthorized';

const apiURLLoginUser = 'https://us-central1-countit-c0d6f.cloudfunctions.net/api/loginUser'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData: User | null = null

  constructor(
    private readonly auth: Auth,
    private http: HttpClient
  ) {
    onAuthStateChanged(auth, (user) => {
      this.userData = user
    })
  }

  async signIn(nickname: string, password: string) {
    try {
      const resObs$ = this.http.post<{ token: string, user: any }>(apiURLLoginUser, { nickname, password })
      const res = await firstValueFrom(resObs$)
      const { token, user: { fullName } } = res
      this.setToken(token)

      await this.auth.setPersistence(browserSessionPersistence)
      const userCredential = await signInWithCustomToken(this.auth, token)
      const { user } = userCredential
      if (user) {
        await updateProfile(user, { displayName: fullName })
      }
    } catch (err) {
      console.error(err)
      if (err.status === 401) {
        throw new UserUnauthorized(err.message)
      }

      throw new Error('error authenticating user')
    }
  }

  signOut() {
    return signOut(this.auth)
  }

  setToken(token: string): void {
    localStorage.setItem('awt', token);
  }
}
