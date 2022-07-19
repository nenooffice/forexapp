export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  wallet?: any;
  // transactions?: any;
  createdAt: Date;
  updatedAt: Date;
}
