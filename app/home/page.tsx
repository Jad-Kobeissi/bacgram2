"use client";

import { useEffect, useState } from "react";
import { UseUser } from "../contexts/UserContext";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "../Loading";
import Error from "../Error";
import Nav from "../Nav";

export default function Home() {
  const { user } = UseUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = () => {
    axios
      .get("/api/posts", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const joined = [...prev, ...res.data];

          const unique = Array.from(
            new Map(joined.map((p) => [p.id, p]))
          ) as any;

          return unique;
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      <Nav />
      <div className="mt-8">
        <h1 className="text-[1.5rem] font-semibold text-center">
          Welcome {user?.username}!
        </h1>
        <InfiniteScroll
          next={fetchPosts}
          hasMore={hasMore}
          loader={<Loading className="flex justify-center mt-[20vh]" />}
          dataLength={posts.length}
        >
          {posts.map((post) => (
            <>
              <h1>{post.author.username}</h1>
            </>
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-[20vh] text-[1.3rem]" />}
      </div>
    </>
  );
}
