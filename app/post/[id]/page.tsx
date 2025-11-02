"use client";
import Error from "@/app/Error";
import Nav from "@/app/Nav";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [post, setPost] = useState<TPost | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchUser = () => {
    setLoading(true);
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Nav />
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center py-[20vh] w-3/4">
          <h1 className="text-[1.3rem]">{post?.author.username}</h1>
          <h1 className="text-[1.6rem] font-bold capitalize">{post?.title}</h1>
          <p>{post?.content}</p>
          <div className="flex items-center snap-mandatory snap-x overflow-x-auto w-200">
            {post?.imageUrls.map((image) => (
              <img
                src={image}
                alt="Post image"
                className="w-200 snap-center object-cover aspect-video"
                onClick={() => window.open(image, "_blank")}
              />
            ))}
          </div>
        </div>
      </div>
      {error && <Error error={error} />}
    </div>
  );
}
