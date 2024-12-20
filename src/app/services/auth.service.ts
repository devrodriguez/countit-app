import { Injectable } from '@angular/core';
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User, 
  browserSessionPersistence
} from '@angular/fire/auth';
import { AuthCredentials } from '../interfaces/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData: User | null = null

  constructor(private readonly auth: Auth) {
    onAuthStateChanged(auth, (user) => {
      this.userData = user
    })
  }

  register({ email, password }: AuthCredentials) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  async signIn({ email, password }: AuthCredentials) {
    return this.auth.setPersistence(browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(this.auth, email, password))
    
  }

  signOut() {
    return signOut(this.auth)
  }
}
