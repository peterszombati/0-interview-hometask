import { useQuery } from "@tanstack/react-query";
import { PostWithAuthor } from "~/db/schema";
import { Header } from "~/components/Header";
import { Feed } from "../components/Feed/Feed";

const Home = () => {
  const {isLoading, error, data} = useQuery<PostWithAuthor[]>({
    queryKey: ["unseenPosts"],
    queryFn: () => fetch("/api/unseenPosts").then((r) => r.json()),
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

export default Home;
