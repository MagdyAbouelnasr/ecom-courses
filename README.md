# Angular Ecom-Courses

## Project Overview
This Angular-based e-learning platform offers a seamless experience for users to explore and buy  various courses. It features a modern, responsive UI and functionalities that cater to both educational needs and user convenience.

## Features

### User Authentication
- Secure authentication using Firebase.
- Registration, login, and logout functionalities.
- Persistent user session across page reloads.

### Course Browsing and Management
- Courses loaded from a JSON file, offering a variety of educational topics.
- Course exploration, sorting, and search functionality.
- Detailed course information including price, author, and tags.

### User Interactivity
- Add courses to wishlist or shopping cart.
- Persistent wishlist and cart items using local storage.
- Add/remove courses from wishlist and cart, and view course summaries.

### Checkout System
- Streamlined checkout process for course enrollment.
- Total price and savings display for selected courses.
- Confirmation dialog on successful order placement.

### User Profile
- View and edit user profile.
- Profile details include name, interests, professional status, and expertise.

### Responsive Design
- Smooth user experience across devices and screen sizes.

## Technologies Used
- **Frontend**: Angular 17 with Angular Material UI components.
- **Authentication and Data Management**: Firebase.
- **State Management**: Angular Signals (Angular 17 feature).
- **Styling**: SCSS.

## Setup and Installation
1. **Clone the Repository**
   ```sh
   git clone [repository-url]
2. **Navigate to the Project Directory
   ```sh
   cd [project-name]
3. **Install Dependencies
   ```sh
   npm install
4. **Environment Setup
   ```sh
   -Set up Firebase project and add configuration to environment.ts.
   -Place JSON file for courses in the assets directory.
5. **Run the Application
   ```sh
   ng serve
   -access at `http://localhost:4200`
