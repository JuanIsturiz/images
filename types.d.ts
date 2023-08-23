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
  likedBy: string[];
  createdAt: string;
}
