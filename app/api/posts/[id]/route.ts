import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../../init";
import { deleteObject, ref } from "firebase/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        likers: true,
        viewers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId != decoded.id)
      return new Response("Forbidden", { status: 403 });

    await Promise.all(
      post.imageUrls.map(async (image) => {
        const imageRef = ref(storage, image);
        deleteObject(imageRef);
      })
    );
    await prisma.post.delete({
      where: {
        id,
      },
    });

    return new Response("Post Deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
