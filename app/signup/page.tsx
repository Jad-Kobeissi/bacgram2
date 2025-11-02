"use client";
import axios from "axios";
import { useState } from "react";
import { Loading } from "../Loading";
import Error from "../Error";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { UseUser } from "../contexts/UserContext";
import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = UseUser();
  return loading ? (
    <Loading className="flex h-screen items-center justify-center" />
  ) : (
    <>
      <div className="flex items-center justify-between px-6 h-screen gap-4">
        <img
          src="undraw_signup.svg"
          alt="Picture"
          className="w-1/3 max-[650px]:hidden"
        />
        <form
          className="flex flex-col items-center justify-center gap-4 w-1/3 bg-(--card-color) shadow-[0px_0px_1px_var(--foreground)] rounded-md py-12 max-[850px]:w-full h-fit"
          onSubmit={(e) => {
            e.stopPropagation();
            setLoading(true);
            axios
              .post("/api/signup", {
                username,
                password,
              })
              .then((res) => {
                setCookie("token", res.data.token);
                setUser(res.data.user);
                router.push("/home");
              })
              .catch((err) => {
                setError(err.response.data);
                setLoading(false);
              });
          }}
        >
          <h1 className="text-[1.5rem] font-semibold">SignUp</h1>
          {error && <Error error={error} />}
          <div className="flex flex-col w-3/4">
            <label
              htmlFor="username"
              className="text-[1rem] text-(--secondary-text)"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-[0px_0.4px_1.4px_var(--foreground)] w-full h-fit rounded-md py-1"
              maxLength={26}
            />
          </div>
          <div className="flex flex-col w-3/4">
            <label
              htmlFor="username"
              className="text-[1rem] text-(--secondary-text)"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-[0px_0.4px_1.4px_var(--foreground)] w-full h-fit py-1 rounded-md"
              minLength={6}
            />
          </div>
          <div className="relative group text-(--secondary-text)">
            <Link href={"/login"}>Already have an account? Login here</Link>
            <span className="w-0 h-0.5 absolute left-0 bottom-0 group-hover:w-full bg-(--secondary-text) transition-all duration-200"></span>
          </div>

          <button className="bg-(--brand-color) text-white w-3/4 py-1 rounded-md text-[1.1rem] font-semibold border border-(--brand-color) hover:text-(--brand-color) hover:bg-transparent active:bg-transparent transition-all">
            SignUp
          </button>
        </form>
      </div>
    </>
  );
}
