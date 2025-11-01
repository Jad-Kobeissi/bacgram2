"use client";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { motion } from "motion/react";
import Link from "next/link";
import Lock from "./svgs/lock-solid";
import Heart from "./svgs/heart-solid";
import Plus from "./svgs/plus-solid";
import User from "./svgs/user-solid";
function Nav() {
  return (
    <nav className="flex justify-between items-center px-6 fixed w-screen bg-(--background) ">
      <Link href={"#home"} className="text-[1.6rem] font-semibold">
        Bacgram
      </Link>
      <div className="flex gap-6">
        <div className="relative group">
          <Link href={"#home"}>Home</Link>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#about"}>About</Link>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#features"}>Features</Link>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
function Home() {
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.2 }}
      id="home"
      className="flex justify-between items-center w-screen px-6 max-[850px]:flex-col-reverse  max-[850px]:gap-6 overflow-hidden my-64"
    >
      <div className="w-1/2 flex flex-col max-[530px]:w-screen max-[530px]:px-4">
        <h1 className="text-[1.8rem] font-semibold">Welcome To Bacgram!</h1>
        <p className="text-(--secondary-text)">
          Bacgram is the platform for BAC students to connect, share, learn and
          grow together.It offers the perfect platform to share your thoughts,
          ideas, and experiences with your fellow students in a safe and secure
          environment.
        </p>
        <div className="flex gap-4 items-center max-[850px]:justify-center">
          <button
            className="bg-(--brand-color) text-white px-4 py-1 text-[1.3rem] rounded-md font-bold hover:bg-transparent border border-(--brand-color) hover:text-(--brand-color) active:text-(--brand-color) active:bg-transparent transition-all duration-200"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Get Started Now
          </button>
          <h1 className="text-[1.2rem] font-semibold">OR</h1>
          <button
            className="bg-(--secondary-button) text-[1.3rem] text-white px-4 py-1 rounded-md font-bold border border-(--secondary-button) hover:bg-transparent hover:text-(--secondary-button) active:bg-transparent active:text-(--secondary-button) transition-all duration-200"
            onClick={() => {
              router.push("/login");
            }}
          >
            LogIn
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <img
          src="/undraw_social_media.svg"
          className="w-3/4"
          alt="Social media image"
        />
      </div>
    </motion.div>
  );
}
function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.2 }}
      id="about"
      className="flex justify-between px-4 mt-32 max-[850px]:flex-col max-[850px]:items-center max-[850px]:gap-6 max-[850px]:w-screen mb-32"
    >
      <div className="w-1/2">
        <img src="undraw_tweetstorm.svg" className="w-2/3" alt="" />
      </div>
      <div className="min-[850px]:w-1/2 flex flex-col gap-4">
        <h1 className="text-[1.6rem] font-bold">What Is Bacgram?</h1>
        <p className="text-(--secondary-text)">
          Bacgram is a social platform designed exclusively for students at BAC,
          it allows users to share posts, and stay connected through a familiar,
          secure interface. Whether you're documenting school events, starting
          conversations, or just keeping in touch, Bacgram helps bring our
          student community closer together.
        </p>
      </div>
    </motion.div>
  );
}
function Card({
  title,
  description,
  Svg,
  index,
}: {
  title: string;
  description: string;
  Svg: any;
  index: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  return (
    <motion.div
      className="bg-(--card-color) h-fit rounded-md flex flex-col gap-2 w-1/2 p-4 max-[600px]:full"
      ref={ref}
      transition={{ duration: 0.2, delay: index * 0.2 || 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
    >
      <Svg />
      <h1 className="text-[1.6rem] font-bold">{title}</h1>
      <p className="text-(--secondary-text)">{description}</p>
    </motion.div>
  );
}
function Features() {
  const features = [
    {
      title: "Security",
      description:
        "Highest security to ensure that your web experience remains secure at all times",
      Svg: Lock,
    },
    {
      title: "Likes",
      description: "Users can like posts to engage wuth the creator",
      Svg: Heart,
    },
    {
      title: "Post Creation",
      description:
        "Users can create posts, with an image option being available",
      Svg: Plus,
    },
    {
      title: "Profile",
      description:
        "User profiles are available with username, grade and followers",
      Svg: User,
    },
  ];
  return (
    <div className="my-8">
      <h1 className="text-[2.5rem] font-bold text-center">Features</h1>
      <div className="grid place-items-center grid-cols-2 gap-32 max-[850px]:grid-cols-1">
        {features.map((feature, index) => (
          <Card
            key={index}
            title={feature.title}
            description={feature.description}
            Svg={feature.Svg}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <Home />
      <About />
      <Features />
    </div>
  );
}
