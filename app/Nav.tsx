"use client";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UseUser } from "./contexts/UserContext";

export default function Nav() {
  const router = useRouter();
  const { logout } = UseUser();
  return (
    <nav className="flex justify-between items-center p-2">
      <Link href={"/home"} className="text-[1.3rem] font-semibold">
        Bacgram
      </Link>
      <div className="flex gap-6">
        <div className="relative group">
          <Link href={"/home"}>Home</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"/about"}>About</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"/profile"}>Profile</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <button
            onClick={() => {
              deleteCookie("token");
              logout();
              router.push("/");
            }}
          >
            LogOut
          </button>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
