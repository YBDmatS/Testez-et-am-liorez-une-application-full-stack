export interface User {
  readonly id: number;
  readonly email: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly admin: boolean;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}
