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

export default function Profile() {
  const { user } = UseUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${user?.id}?page=${page}`, {
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

          console.log(unique);

          return unique;
        });
        setPage((prev) => prev + 1);
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
        <div>
          <h1 className="text-[1.5rem] font-semibold text-center">
            {user?.username}
          </h1>
          <div className="flex gap-4 justify-center text-(--secondary-text)">
            <h1>Followers: {user?.followers.length}</h1>
            <h1>Following: {user?.following.length}</h1>
          </div>
        </div>
        <InfiniteScroll
          next={fetchPosts}
          hasMore={hasMore}
          loader={<Loading className="flex justify-center mt-[20vh]" />}
          dataLength={posts.length}
          className="flex flex-col gap-4 items-center mt-[20vh]"
        >
          {posts.map((post) => (
            <Post post={post} user={user as TUser} setPosts={setPosts} />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-[20vh] text-[1.3rem]" />}
      </div>
    </>
  );
}
