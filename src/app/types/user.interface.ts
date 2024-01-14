export interface AreaOfInterest {
  webDev: boolean;
  mobileDev: boolean;
  dataScience: boolean;
  machineLearning: boolean;
  cloudComputing: boolean;
}

export interface UserInterface {
  id?: string;
  email: string | null;
  username?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  aboutYourself?: string;
  areaOfInterest?: AreaOfInterest;
  status?: string;
  experience?: string;
  expertise?: string;
  role?: string;
  image?: string
}
