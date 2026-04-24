export interface Session {
  readonly id?: number;
  readonly name: string;
  readonly description: string;
  readonly date: Date;
  readonly teacher_id: number;
  readonly users: number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
