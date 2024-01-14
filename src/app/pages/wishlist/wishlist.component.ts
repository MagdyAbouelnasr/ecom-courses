import { Component, inject } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { CommonModule } from '@angular/common';
import { CourseInterface } from '../../types/course.interface';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  coursesService = inject(CoursesService);
  toastr = inject(ToastrService);

  addToCart(course: CourseInterface) {
    this.removeFromWishlist(course.id);
    this.coursesService
      .addNewCourseToCart(course)
      .subscribe((isCourseAdded) => {
        if (isCourseAdded) {
          this.toastr.success('Happy Learning!', 'Course successfully added in the cart');
        } else {
          this.toastr.error(
            'A person can only learn so much!',
            'Course already added to Cart'
          );
        }
      });
  }

  removeFromWishlist(courseId: number) {
    this.coursesService.removeCourseFromWishList(courseId);
    this.toastr.error(
      'You learn by doing, and by falling over',
      'Course Removed From WishList'
    );
  }
}
