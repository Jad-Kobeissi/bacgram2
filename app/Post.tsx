import { TPost, TUser } from "./types";
export default function ({ post, user }: { post: TPost; user: TUser }) {
  return (
    <div
      key={post.id}
      className="w-1/3 max-[800px]:w-full p-10 h-fit shadow-[0px_0px_1.4px_var(--foreground)] rounded-lg"
    >
      <h1 className="text-[1.2rem]">{post.author.username}</h1>
      <h1 className="text-[1.5rem] font-bold">{post.title}</h1>
      <p className="line-clamp-3">{post.content}</p>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto w-full">
        {post.imageUrls.map((image, index) => (
          <img
            src={image}
            alt="post image"
            className="snap-center w-[200rem] h-full object-cover"
            onClick={() => window.open(image, "_blank")}
            key={index}
          />
        ))}
        {post.authorId == user.id && (
          <button
            className="bg-(--brand-color) text-white px-12 py-2 font-bold rounded-md hover:bg-transparent active:bg-transparent hover:text-(--brand-color) active:text-(--brand-color) border border-(--brand-color) transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
