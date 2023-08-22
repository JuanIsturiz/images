import ImageList from "@/components/shared/ImageList";
import { getImages } from "@/lib/actions/image.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  const images = await getImages();

  const validImages = images.map((img) => ({
    _id: JSON.parse(JSON.stringify(img._id)),
    author: {
      _id: JSON.parse(JSON.stringify(img.author._id)),
      id: img.author.id,
      username: img.author.username,
      image: img.author.image,
    },
    imageUrl: img.imageUrl,
    title: img.title,
    createdAt: img.createdAt,
    likedBy: img.likedBy.map((userId: {}) =>
      JSON.parse(JSON.stringify(userId))
    ),
  }));
  return (
    <section className="px-1 my-3 flex-1">
      <ImageList
        images={validImages}
        userId={JSON.parse(JSON.stringify(userInfo._id))}
      />
    </section>
  );
}
