import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/db";
import { PostWithAuthor } from "~/db/schema";

export default async (_req: NextApiRequest, res: NextApiResponse<PostWithAuthor[]>) => {
    res.json(
      await db.query.posts.findMany({
          with: {
              author: true,
          },
      })
    );
};
