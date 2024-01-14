import { Component, OnInit, inject } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { CourseInterface } from '../../types/course.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    MatChipsModule,
    CommonModule,
    BreadcrumbModule,
    MatButtonModule,

  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent implements OnInit {
  breadcrumbItems!: MenuItem[];
  coursesService = inject(CoursesService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);
  course: CourseInterface | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      try {
        const idParam = params.get('id');
        if (idParam === null) {
          throw new Error('No course ID provided');
        }

        const courseId = Number(idParam);
        if (isNaN(courseId)) {
          throw new Error('Invalid course ID');
        }

        this.coursesService.getCourseById(courseId).subscribe((course) => {
          this.course = course;
          this.breadcrumbItems = [
            { label: 'All Courses', routerLink: '/' },
            { label: this.course?.courseName, },
          ];
        });
      } catch (error) {
        console.error(error);
        this.router.navigate(['/']); // Redirect to the homepage or another appropriate route
      }
    });
  }

  addToCart(course: CourseInterface) {
    const isRemovedFromWishList = this.coursesService.removeCourseFromWishList(
      course.id
    );
    if (isRemovedFromWishList) {
      this.toastr.warning(
        'You learn by doing, and by falling over',
        'Course Removed From WishList'
      );
    }
    this.coursesService.removeCourseFromWishList(course.id);
    this.coursesService
      .addNewCourseToCart(course)
      .subscribe((isCourseAdded) => {
        if (isCourseAdded) {
          this.toastr.success(
            'Happy Learning!',
            'Course successfully added in the cart'
          );
        } else {
          this.toastr.error(
            'A person can only learn so much!',
            'Course already added to Cart'
          );
        }
      });
  }

  addToWishlist(course: CourseInterface) {
    const isRemovedFromCart = this.coursesService.removeCourseFromCart(
      course.id
    );
    if (isRemovedFromCart) {
      this.toastr.warning(
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

  getDiscountedPrice(actualPrice: string, discountPercentage: string): string {
    const price = parseFloat(actualPrice.replace(/[^\d.]/g, ''));
    const discount =
      parseFloat(discountPercentage.replace(/[^\d.]/g, '')) / 100;

    const discountedPrice = price - price * discount;
    return `₹${discountedPrice.toFixed(2)}`;
  }

  showSaleTimer(discountPercentage: string): boolean {
    return discountPercentage !== '0%'; // Adjust the logic as per your data
  }

  calculateTimeLeft(): string {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timeLeft = tomorrow.getTime() - now.getTime();

    const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    return `${hoursLeft} hours`;
  }
}
