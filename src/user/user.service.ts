import { DrizzleService } from '~/drizzle/drizzle.service';
import { userTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUser(field: string, value: string | number) {
    return this.drizzle.db.query.userTable.findFirst({
      where: eq(userTable[field] as any, value),
    });
  }
}
