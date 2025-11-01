"use client";
import axios from "axios";
import { useState } from "react";
import { Loading } from "../Loading";
import Error from "../Error";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { UseUser } from "../contexts/UserContext";
import Nav from "../Nav";

export default function Login() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = UseUser();
  return loading ? (
    <Loading className="flex h-screen items-center justify-center" />
  ) : (
    <>
      <Nav />
      <div className="flex items-center justify-between px-6 h-screen gap-4">
        <img
          src="undraw_add.svg"
          alt="Picture"
          className="w-1/3 max-[850px]:hidden"
        />
        <form
          className="flex flex-col items-center justify-center gap-4 w-1/2 rounded-md py-12 max-[850px]:w-full h-fit"
          onSubmit={(e) => {
            e.stopPropagation();
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            files.map((file) => formData.append("files", file));
            axios
              .post("/api/posts", formData, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                alert("Post");
                setLoading(false);
              })
              .catch((err) => {
                setError(err.response.data);
                setLoading(false);
              });
          }}
        >
          <h1 className="text-[1.5rem] font-semibold">Add</h1>
          {error && <Error error={error} />}
          <div className="flex flex-col w-3/4">
            <label
              htmlFor="title"
              className="text-[1rem] text-(--secondary-text)"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-[0px_0.4px_1.4px_var(--foreground)] w-full h-fit rounded-md py-2"
            />
          </div>
          <div className="flex flex-col w-3/4">
            <label
              htmlFor="content"
              className="text-[1rem] text-(--secondary-text)"
            >
              Content
            </label>
            <textarea
              id="content"
              onChange={(e) => setContent(e.target.value)}
              className="shadow-[0px_0.4px_1.4px_var(--foreground)] w-full h-fit py-1 rounded-md"
            />
          </div>
          <div className="flex flex-col w-3/4">
            <label
              htmlFor="title"
              className="text-[1rem] text-(--secondary-text)"
            >
              Images
            </label>
            <input
              id="title"
              type="file"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              multiple
              className="shadow-[0px_0.4px_1.4px_var(--foreground)] w-full h-fit rounded-md py-2"
            />
          </div>
          <button className="bg-(--brand-color) text-white w-3/4 py-1 rounded-md text-[1.1rem] font-semibold border border-(--brand-color) hover:text-(--brand-color) hover:bg-transparent active:bg-transparent transition-all">
            Add
          </button>
        </form>
      </div>
    </>
  );
}
