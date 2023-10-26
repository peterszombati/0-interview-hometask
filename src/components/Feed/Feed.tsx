import {ComponentPropsWithoutRef, FC} from "react";
import {PostWithAuthor} from "~/db/schema";
import {Card} from "./Card";
import {List} from "./List";
import {Seen} from "../Seen";
import {PopUp} from "../PopUp";
/*import {Queue} from "../../utils/Queue";

const queue = new Queue<number, Promise<any>>(6000, 2000, async (queue, tasks) => {
  fetch('/api/seen', {
    method: 'POST',
    body: JSON.stringify({posts: tasks.slice(0,10).map(i => i.data)}),
    headers: {
      'content-type': 'application/json'
    }
  }).then(response => response.json())
    .then(r => tasks.slice(0,10).forEach(i => i.resolve(r)))
    .catch(e => tasks.slice(0,10).forEach(i => i.reject(e)))

  if (tasks.length > 10) {
    for (const i of tasks.slice(10)) {
      queue.unshift(i)
    }
  }
})
*/
type Props = { data: PostWithAuthor[] } & ComponentPropsWithoutRef<"div">;
export const Feed: FC<Props> = ({style = {}, ...props}) => {
  if (props.data.length === 0) {
    return <PopUp>
      <div style={{
        width: '300px',
        height: '100px',
        textAlign: 'center',
      }}>No new content available</div>
    </PopUp>
  }

  return (
    <List style={{marginTop: -200}}>
      {props.data.map((post) => {
        return <Seen {...{
          key: post.id,
          timeout: 5000,
          callback: () => {  //queue.push({ data: post.id })
            fetch('/api/seen', {
              method: 'POST',
              body: JSON.stringify({posts: [post.id]}),
              headers: {
                'content-type': 'application/json'
              }
            })
          }
        }}><Card title={post.author.name ?? ""}>
          {post.content}
        </Card></Seen>
      })}
    </List>
  );
};
