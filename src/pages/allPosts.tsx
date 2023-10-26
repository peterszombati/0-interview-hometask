import { useQuery } from "@tanstack/react-query";
import { PostWithAuthor } from "~/db/schema";
import { Header } from "~/components/Header";
import {Feed} from "../components/Feed/Feed";

export default () => {
  const {isLoading, error, data} = useQuery<PostWithAuthor[]>({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((r) => r.json()),
  });

  if (isLoading || error || !data) {
    return null;
  }

  return (
    <div>
      <Header style={{ height: 300 }} />
      <Feed data={data}/>
    </div>
  );
};