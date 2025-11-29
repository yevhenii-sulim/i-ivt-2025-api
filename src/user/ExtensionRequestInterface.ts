import { Request } from 'express';
import { UserType } from '~/auth/authUserDTO';

export type UserTypeWithoutPassword = Omit<UserType, 'password'> | null;

export interface ExtensionRequestInterface extends Request {
  user: UserTypeWithoutPassword;
}
