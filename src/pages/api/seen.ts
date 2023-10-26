import type {NextApiRequest, NextApiResponse} from "next"
import {db} from "~/db"
import {LOGGED_IN_USER_ID} from "./user"
import {seenUsersToPosts} from "../../db/schema"

export default async (_req: NextApiRequest, res: NextApiResponse<{}>) => {
  if (!Array.isArray(_req.body.posts)) {
    return res.status(400).send({ error: "Invalid _req.body.posts" })
  }
  if (_req.body.posts.some((i: any) => i % 1 !== 0 || typeof i != 'number')) {
    return res.status(400).send({ error: "Invalid _req.body.posts" })
  }
  if (_req.body.posts.length > 1/* for queue solution just increase the number to 10 */) {
    return res.status(400).send({ error: "Invalid _req.body.posts" })
  }

  const result = await Promise.allSettled(
    _req.body.posts.map(
      (postId: number) => db.insert(seenUsersToPosts).values({userId: LOGGED_IN_USER_ID, postId})
    )
  )

  // @ts-ignore
  for (const {status,reason} of result) {
    if (status === 'rejected'
      && reason.message.indexOf('duplicate key value violates unique constraint') != 0) { // record already existing in database
      throw reason
    }
  }

  res.json({})
}