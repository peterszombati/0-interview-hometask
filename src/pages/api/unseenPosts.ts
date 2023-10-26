import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/db";
import { PostWithAuthor } from "~/db/schema";
import { posts, users } from "../../db/schema";
import { LOGGED_IN_USER_ID } from "./user";
import { eq, sql } from "drizzle-orm";

export default async (_req: NextApiRequest, res: NextApiResponse<PostWithAuthor[]>) =>
  res.json((await db
      .select()
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .where(sql`posts.id NOT IN (
    SELECT post_id AS id
    FROM seen_users_to_posts
    WHERE seen_users_to_posts.user_id = ${LOGGED_IN_USER_ID}
)`)).map(({users,posts}) => ({
    userId: users.id,
    id: posts.id,
    content: posts.content,
    author: users,
  })))