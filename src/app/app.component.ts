import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CoursesComponent } from './pages/courses/courses.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './auth.service';
import { UserInterface } from './types/user.interface';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    CoursesComponent,
    HeaderComponent,
  ],
})
export class AppComponent {
  title = 'ecom-courses';
  authService = inject(AuthService);
  firestore = inject(Firestore);

  constructor() {
    if (localStorage.getItem('user')) {
      const userDocRef = doc(
        this.firestore,
        `users/${localStorage.getItem('user')}`
      );
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserInterface;
            this.authService.currentUserSignal.set(userData);
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.log('user is not logged in');
    }
  }
}
