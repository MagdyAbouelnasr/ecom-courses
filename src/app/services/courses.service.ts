import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CourseInterface } from '../types/course.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  coursesSignal = signal<CourseInterface[]>([]);
  coursesSignalCart = signal<CourseInterface[]>([]);
  coursesSignalWishlist = signal<CourseInterface[]>([]);

  http = inject(HttpClient);

  constructor() {
    const storedCart = localStorage.getItem('cart');
    const cartItems = storedCart ? JSON.parse(storedCart) : [];

    const storedWishlist = localStorage.getItem('wishlist');
    const wishlistItems = storedWishlist ? JSON.parse(storedWishlist) : [];

    this.coursesSignalCart = signal<CourseInterface[]>(cartItems);
    this.coursesSignalWishlist = signal<CourseInterface[]>(wishlistItems);
  }

  getAllCourses(): Observable<CourseInterface[]> {
    return this.http.get<CourseInterface[]>('assets/data.json');
  }

  getCourseById(id: number): Observable<CourseInterface | undefined> {
    return this.http
      .get<CourseInterface[]>('assets/data.json')
      .pipe(map((courses) => courses.find((course) => course.id === id)));
  }

  addNewCourseToCart(course: CourseInterface): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.coursesSignalCart.update((courses) => {
        const courseExists = courses.some((c) => c.id === course.id);

        if (!courseExists) {
          const updatedCourses = [...courses, course];
          localStorage.setItem('cart', JSON.stringify(updatedCourses));
          subscriber.next(true);
          subscriber.complete();
          return updatedCourses;
        } else {
          // Course already exists, do not add it
          subscriber.next(false);
          subscriber.complete();
          return courses;
        }
      });
    });
  }

  removeCourseFromCart(courseId: number): boolean {
    let courseFound = false;

    this.coursesSignalCart.update((courses) => {
      const initialLength = courses.length;
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      if (updatedCourses.length < initialLength) {
        courseFound = true; // Course was found and removed
        localStorage.setItem('cart', JSON.stringify(updatedCourses));
      }
      return updatedCourses;
    });

    return courseFound;
  }

  removeAllCourseFromCart() {
    this.coursesSignalCart.set([]);
    localStorage.removeItem('cart');
  }

  addCourseToWishList(course: CourseInterface): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.coursesSignalWishlist.update((courses) => {
        const courseExists = courses.some((c) => c.id === course.id);

        if (!courseExists) {
          const updatedCourses = [...courses, course];
          localStorage.setItem('wishlist', JSON.stringify(updatedCourses));
          subscriber.next(true);
          subscriber.complete();
          return updatedCourses;
        } else {
          // Course already exists, do not add it
          subscriber.next(false); // Emit false and complete the observable
          subscriber.complete();
          return courses; // Return the unmodified courses array
        }
      });
    });
  }

  removeCourseFromWishList(courseId: number) {
    let courseFound = false;

    this.coursesSignalWishlist.update((courses) => {
      const initialLength = courses.length;
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      if (updatedCourses.length < initialLength) {
        courseFound = true; // Course was found and removed
        localStorage.setItem('wishlist', JSON.stringify(updatedCourses));
      }
      return updatedCourses;
    });

    return courseFound;
  }
}
