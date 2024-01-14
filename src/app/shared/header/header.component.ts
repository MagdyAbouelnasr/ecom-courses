import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CourseInterface } from '../../types/course.interface';
import { CoursesService } from '../../services/courses.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isUserLoggedIn: boolean = false;
  coursesService = inject(CoursesService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  router = inject(Router);



  logout() {
    this.authService.logout();
    this.toastr.warning('User Logged out');
    this.router.navigate(['/']);
  }

  deleteFromCart(courseId: number) {
    this.coursesService.removeCourseFromCart(courseId);
    this.toastr.error(
      'You learn by doing, and by falling over',
      'Course Removed From Cart'
    );
  }

  addToWishlist(course: CourseInterface) {
    const isRemovedFromCart = this.coursesService.removeCourseFromCart(
      course.id
    );
    if (isRemovedFromCart) {
      this.toastr.error(
        'You learn by doing, and by falling over',
        'Course Removed From Cart'
      );
    }
    this.coursesService.addCourseToWishList(course).subscribe((isAdded) => {
      if (isAdded) {
        this.toastr.info(
          'You learn by doing, and by falling over',
          'Added to WishList'
        );
      } else {
        this.toastr.error(
          'a person can only learn so much!',
          'Course already added to wishlist'
        );
      }
    });
  }
}
