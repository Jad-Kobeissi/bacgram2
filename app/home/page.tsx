"use client";

import { useEffect, useState } from "react";
import { UseUser } from "../contexts/UserContext";
import { TPost, TUser } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "../Loading";
import Error from "../Error";
import Nav from "../Nav";
import Post from "../Post";

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
            new Map(joined.map((p) => [p.id, p])).values()
          ) as any;

          sessionStorage.setItem("posts", JSON.stringify(unique));

          return unique;
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    const posts = sessionStorage.getItem("posts");
    if (posts) {
      setPosts((prev) => {
        const joined = [...prev, ...JSON.parse(posts)];

        const unique = Array.from(
          new Map(joined.map((p) => [p.id, p])).values()
        );

        return unique;
      });
    }
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
          className="flex flex-col items-center gap-6 mt-8"
        >
          {posts.map((post) => (
            <Post
              post={post}
              user={user as TUser}
              key={post.id}
              setPosts={setPosts}
            />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-[20vh] text-[1.3rem]" />}
      </div>
    </>
  );
}
