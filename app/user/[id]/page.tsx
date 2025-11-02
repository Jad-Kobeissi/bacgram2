"use client";
import { UseUser } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import { Loading } from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const [sUser, setSUser] = useState<TUser | null>(null);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { id } = React.use(params);
  const { user } = UseUser();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const fetchUser = () => {
    axios
      .get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setSUser(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const combined = [...prev, ...res.data];

          const unique = Array.from(
            new Map(combined.map((p) => [p.id, p])).values()
          );

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
    fetchUser();
    fetchPosts();
  }, []);
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center my-8">
        <h1 className="text-[1.3rem] font-semibold">{sUser?.username}</h1>
        <div className="flex gap-4 items-center justify-center text-(--secondary-text)">
          <h1>Followers: {sUser?.followers.length}</h1>
          <h1>Following: {sUser?.following.length}</h1>
        </div>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        loader={
          <Loading className={"flex items-center justify-center mt-[30vh]"} />
        }
        hasMore={hasMore}
        className="flex flex-col items-center gap-8"
      >
        {posts.map((post) => (
          <Post
            post={post}
            user={user as TUser}
            setPosts={setPosts}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {error && (
        <Error error={error} className="text-center my-8 text-[1.4rem]" />
      )}
    </>
  );
}
