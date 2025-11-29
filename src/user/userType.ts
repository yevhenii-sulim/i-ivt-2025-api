import { InferSelectModel } from 'drizzle-orm';
import { userTable } from '~/db/schema';

export type UserType = InferSelectModel<typeof userTable>;
