export interface TUser {
  id: string;
  username: string;
  password: string;
  posts: TPost[];
  followers: TUser[];
  following: TUser[];
  viewedPosts: TPost[];
  likedPosts: TPost[];
  createdAt: Date;
}

export interface TPost {
  id: string;
  title: string;
  content: string;
  author: TUser;
  authorId: string;
  viewers: TUser[];
  likers: TUser[];
  createdAt: Date;
}
