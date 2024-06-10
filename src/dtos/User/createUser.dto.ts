export class CreateUserDto {
  readonly name: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly favorites?: string[];
  readonly conversations?: string[];
}
