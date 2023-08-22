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
    _id: JSON.stringify(img._id),
    author: img.author,
    imageUrl: img.imageUrl,
    title: img.title,
    createdAt: img.createdAt,
  }));

  return (
    <section className="px-1 my-3">
      <ImageList images={validImages} />
    </section>
  );
}
