import { DrizzleService } from '~/drizzle/drizzle.service';
import { userTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { UserType } from '~/user/userType';

@Injectable()
export class UserService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUser(field: string, value: string | number): Promise<UserType | undefined> {
    const user = this.drizzle.db.query.userTable.findFirst({
      where: eq(userTable[field] as any, value),
    });
    return user;
  }
}
