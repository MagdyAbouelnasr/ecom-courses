import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
    }),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'courses-store-99e8d',
          appId: '1:569691428756:web:bd866eb7d050e4edd92181',
          storageBucket: 'courses-store-99e8d.appspot.com',
          apiKey: 'AIzaSyBHHLAS3srBHfbDD_G7ITRVsx5CPXoth4M',
          authDomain: 'courses-store-99e8d.firebaseapp.com',
          messagingSenderId: '569691428756',
          measurementId: 'G-H1HKSG131L',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
