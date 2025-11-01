import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../init";
import { isEmpty } from "../isEmpty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        viewers: {
          none: {
            id: decoded.id,
          },
        },
      },
      include: {
        author: true,
        likers: true,
        viewers: true,
      },
    });

    if (posts.length == 0)
      return new Response("Posts not found", { status: 404 });

    await Promise.all(
      posts.map(async (post) => {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            viewers: {
              connect: { id: decoded.id },
            },
          },
        });
      })
    );
    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];
    if (!title || !content || isEmpty([title, content]))
      return new Response("Invalid input", { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
      },
    });
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const imageRef = ref(
          storage,
          `${process.env.POSTS_FOLDER}/${post.id}-${crypto.randomUUID()}`
        );
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);

        return url;
      })
    );
    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        imageUrls: fileUrls,
      },
    });

    return Response.json(updatedPost);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
