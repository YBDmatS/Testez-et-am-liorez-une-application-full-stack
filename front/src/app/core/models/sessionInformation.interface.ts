export interface SessionInformation {
  readonly token: string;
  readonly type: string;
  readonly id: number;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly admin: boolean;
}
