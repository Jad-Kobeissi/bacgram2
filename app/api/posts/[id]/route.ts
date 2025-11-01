import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

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
    if (post.authorId == decoded.id)
      return new Response("Forbidden", { status: 403 });

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
