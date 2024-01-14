import { Injectable, signal } from '@angular/core';
import { UserInterface } from './types/user.interface';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<UserInterface | undefined | null>(undefined);

  getCurrentUserUID(): string | null {
    const auth = getAuth();
    console.log('uid', auth.currentUser?.uid);
    return auth.currentUser?.uid || null;
  }

  logout(): Promise<void> {
    localStorage.setItem('token', '');
        localStorage.setItem('user', '');
    this.currentUserSignal.set(null);
    const auth = getAuth();

    return signOut(auth);
  }
}
