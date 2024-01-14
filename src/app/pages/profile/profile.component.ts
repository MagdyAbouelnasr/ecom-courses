import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../types/user.interface';
import { AuthService } from '../../auth.service';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  uploadedImage: string | ArrayBuffer = '';
  toastr = inject(ToastrService);
  http = inject(HttpClient);
  authService = inject(AuthService);
  firestore = inject(Firestore);

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: [''],
      aboutYourself: ['', [Validators.maxLength(100)]],
      areaOfInterest: this.fb.group({
        webDev: false,
        mobileDev: false,
        dataScience: false,
        machineLearning: false,
        cloudComputing: false,
      }),
      status: ['student'],
      experience: [''],
      expertise: [''],
      role: ['', [Validators.maxLength(200)]],
    });
  }

  get areaOfInterestGroup(): FormGroup {
    return this.profileForm.get('areaOfInterest') as FormGroup;
  }

  ngOnInit(): void {
    this.fetchAndPatchUserData();
  }

  private fetchAndPatchUserData(): void {
    const uid = this.authService.getCurrentUserUID();
    if (!uid) {
      this.toastr.error('No user ID found', 'Error');
      return;
    }

    const userDocRef = doc(this.firestore, `users/${uid}`);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserInterface; // Adjust the type as needed
          this.patchFormWithUserData(userData);
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  patchFormWithUserData(user: any): void {
    // Replace 'any' with the correct user type
    this.profileForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      aboutYourself: user.aboutYourself,
      // Update other form controls similarly
      status: user.status,
      experience: user.experience,
      expertise: user.expertise,
      role: user.role,
    });

    // For areaOfInterest, you need to set each control separately if it exists
    if (user.areaOfInterest) {
      this.profileForm.get('areaOfInterest')?.patchValue({
        webDev: user.areaOfInterest.webDev,
        mobileDev: user.areaOfInterest.mobileDev,
        dataScience: user.areaOfInterest.dataScience,
        machineLearning: user.areaOfInterest.machineLearning,
        cloudComputing: user.areaOfInterest.cloudComputing,
      });
    }

    this.uploadedImage = user.image;
  }

  onImageUpload(event: Event): void {
    const element = event.target as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Ensure that reader.result is not null before assigning
        if (reader.result) {
          this.uploadedImage = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      let userData = this.profileForm.getRawValue();
      userData = { ...userData, image: this.uploadedImage ?? '' };

      // Assuming you have the user's UID
      const uid = this.authService.getCurrentUserUID(); // Implement this method in AuthService

      // Reference to the user's document in Firestore
      const userDocRef = doc(this.firestore, `users/${uid}`);

      setDoc(userDocRef, userData, userData)
        .then(() => {
          console.log('Profile updated in Firestore');
          this.toastr.success('Profile saved', 'Your profile is updated');
          // Update the current user signal if needed
          // this.authService.currentUserSignal.set(userData);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          this.toastr.error('Error', 'Failed to update profile');
        });
    }
  }
}
