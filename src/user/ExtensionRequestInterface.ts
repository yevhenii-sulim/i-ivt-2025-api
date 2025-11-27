import { Request } from 'express';
import { UserType } from '~/user/userDTO';

export type UserTypeWithoutPassword = Omit<UserType, 'password'> | null;

export interface ExtensionRequestInterface extends Request {
  user: UserTypeWithoutPassword;
}
