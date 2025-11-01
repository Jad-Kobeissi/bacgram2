import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return new Response("User not found", { status: 404 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * 5;

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      skip,
      take: 5,
      include: {
        author: {
          include: {
            followers: true,
            following: true,
            likedPosts: true,
            posts: true,
            viewedPosts: true,
          },
        },
        likers: true,
        viewers: true,
      },
    });

    if (posts.length == 0)
      return new Response("Posts not found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
