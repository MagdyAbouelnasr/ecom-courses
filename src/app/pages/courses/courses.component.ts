import { Component, OnInit, computed, inject } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CourseInterface } from '../../types/course.interface';
import { CommonModule } from '@angular/common';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SortingEnum } from '../../types/Sorting.enum';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
  cols$!: Observable<number>;
  rowHeight$!: Observable<number | string>;
  coursesService = inject(CoursesService);
  http = inject(HttpClient);
  breakpointObserver = inject(BreakpointObserver);
  router = inject(Router);
  toastr = inject(ToastrService);
  courses: CourseInterface[] = [];
  pageSlice!: CourseInterface[];
  firestore = inject(Firestore);

  updateSorting(sorting: string) {
    const parsePrice = (priceStr: string): number => {
      return Number(priceStr.replace(/[^\d.]/g, ''));
    };

    if (sorting === SortingEnum.highest) {
      this.courses.sort(
        (a, b) => parsePrice(b.actualPrice) - parsePrice(a.actualPrice)
      );
    } else if (sorting === SortingEnum.lowest) {
      this.courses.sort(
        (a, b) => parsePrice(a.actualPrice) - parsePrice(b.actualPrice)
      );
    } else {
      this.courses;
    }
    this.pageSlice = this.courses.slice(0, 4);
  }

  onSearch(searchValue: string) {
    const searchLower = searchValue.toLowerCase();

    const filteredCourses = this.courses.filter((course) => {
      const nameMatch = course.courseName.toLowerCase().includes(searchLower);
      const authorMatch = course.author.toLowerCase().includes(searchLower);
      const tagMatch = course.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );

      return nameMatch || authorMatch || tagMatch;
    });

    this.pageSlice = filteredCourses.slice(0, 4);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    let endIndex = startIndex + pageEvent.pageSize;
    if (endIndex > this.courses.length) {
      endIndex = this.courses.length;
    }
    this.pageSlice = this.courses.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    // const coursesRef = collection(this.firestore, 'courses');
    // collectionData(coursesRef);

    this.coursesService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
      this.pageSlice = this.courses.slice(0, 4);
    });

    this.cols$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(
        map((result) => (result.matches ? 1 : 2)),
        shareReplay()
      );
    this.rowHeight$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(
        map((result) => (result.matches ? '1:1.5' : '1:0.8')),
        shareReplay()
      );
  }

  getDiscountedPrice(actualPrice: string, discountPercentage: string): string {
    const price = parseFloat(actualPrice.replace(/[^\d.]/g, ''));
    const discount =
      parseFloat(discountPercentage.replace(/[^\d.]/g, '')) / 100;

    const discountedPrice = price - price * discount;
    return `₹${discountedPrice.toFixed(2)}`;
  }

  courseDetail(courseId: number) {
    this.router.navigate([`courses/${courseId}`]);
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
}
