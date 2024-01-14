import { Component, inject } from '@angular/core';
import { CourseInterface } from '../../types/course.interface';
import { ToastrService } from 'ngx-toastr';
import { CoursesService } from '../../services/courses.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatGridListModule, MatDialogModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  coursesService = inject(CoursesService);
  toastr = inject(ToastrService);
  dialog = inject(MatDialog);

  moveToWishlist(course: CourseInterface) {
    this.coursesService.addCourseToWishList(course).subscribe((isAdded) => {
      if (isAdded) {
        this.toastr.info(
          'You learn by doing, and by falling over',
          'Added to WishList'
        );
      }
    });
    this.deleteFromCart(course.id);
  }

  deleteFromCart(courseId: number) {
    this.coursesService.removeCourseFromCart(courseId);
    this.toastr.error(
      'You learn by doing, and by falling over',
      'Course Removed From Cart'
    );
  }

  parsePrice(priceStr: string): number {
    return Number(priceStr.replace(/[^\d.]/g, ''));
  }

  getDiscountedPrice(actualPrice: string, discountPercentage: string): string {
    const price = this.parsePrice(actualPrice);
    const discount = this.parsePrice(discountPercentage) / 100;
    const discountedPrice = price - price * discount;
    return `₹${discountedPrice.toFixed(2)}`;
  }

  calculateTotal(): string {
    const total = this.coursesService
      .coursesSignalCart()
      .reduce((acc, course) => {
        const price = this.parsePrice(course.actualPrice);
        const discount = this.parsePrice(course.discountPercentage) / 100;
        return acc + (price - price * discount);
      }, 0);
    return `₹${total.toFixed(2)}`;
  }

  calculateTotalDiscount(): string {
    let totalSaved = 0;

    this.coursesService.coursesSignalCart().forEach((course) => {
      const originalPrice = this.parsePrice(course.actualPrice);
      const discount = this.parsePrice(course.discountPercentage) / 100;
      const discountedPrice = originalPrice - originalPrice * discount;
      totalSaved += originalPrice - discountedPrice;
    });

    return `₹${totalSaved.toFixed(2)}`;
  }

  onCheckout() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Confirm Purchase',
        message: 'Are you sure you want to place this order?',
      },
      width: '400px',
      height: '200px',
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.coursesService.removeAllCourseFromCart();
          this.toastr.success(
            'Learning is the first step to success',
            'Order Placed'
          );
        }
      });
  }
}
