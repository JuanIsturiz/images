import ImageList from "@/components/shared/ImageList";
import { Button } from "@/components/ui/button";
import { getUserImagesById } from "@/lib/actions/image.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  const clerkUser = await currentUser();

  const userInfo = await getUser(clerkUser?.id ?? "");

  const userImages = await getUserImagesById(
    JSON.parse(JSON.stringify(user._id))
  );

  const validImages = userImages.map((img) => ({
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

  if (!user)
    return (
      <section className="flex-1 flex flex-col gap-2 items-center mt-8">
        <h3 className="text-xl font-medium">User not found</h3>
        <Link href={"/"}>
          <Button className="flex items-center gap-2">
            <span className="text-lg">Return to homepage</span>
            <Home />
          </Button>
        </Link>
      </section>
    );
  return (
    <section className="flex-1 mt-2">
      <div>
        <div className="relative w-full rounded bg-zinc-100 dark:bg-zinc-900 h-32">
          <div className="absolute left-52 top-4 text-lg">
            <div className="flex gap-4 mb-2">
              <p>Following {user.followers.length}</p>
              <p>Followers {user.following.length}</p>
            </div>
            <div>
              <p>Images {validImages.length}</p>
            </div>
          </div>
          <Image
            src={user.image}
            alt={"User Profile Picture"}
            width={148}
            height={148}
            className="absolute -bottom-16 left-10 rounded-full border-4 border-[background] dark:border-[background]"
          />
        </div>
        <div className="mt-1 ml-52 mb-6">
          <div className="flex items-center gap-2">
            <h4 className="text-xl">@{user.username}</h4>
            {user.id !== userInfo.id && (
              <Button variant={"outline"} className="px-2 h-6">
                Follow
              </Button>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">{user.bio}</p>
        </div>
      </div>
      <div>
        <ImageList
          height="h-72"
          images={validImages}
          userId={JSON.parse(JSON.stringify(userInfo._id))}
        />
      </div>
    </section>
  );
}
