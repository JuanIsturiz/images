interface Image {
  title: string;
  _id: string;
  imageUrl: string;
  author: {
    _id: string;
    id: string;
    username: string;
    image: string;
  };
  comments: Comment[];
  likedBy: string[];
  createdAt: string;
}

interface User {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  followers: string[];
  following: string[];
  images: string[];
  onboarded: boolean;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    id: string;
    username: string;
    image: string;
  };
  image: string;
}
