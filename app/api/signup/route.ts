import { sign, verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";
import { prisma } from "../init";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || isEmpty([username, password]))
      return new Response("Please Fill All fields", { status: 400 });

    const userCheck = await prisma.user.findUnique({ where: { username } });

    if (userCheck)
      return new Response("Username already exists", { status: 409 });

    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password, 10),
      },
      include: {
        followers: true,
        following: true,
        posts: true,
        likedPosts: true,
        viewedPosts: true,
      },
    });

    const token = await sign(
      { id: user.id, username },
      process.env.JWT_SECRET!
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
