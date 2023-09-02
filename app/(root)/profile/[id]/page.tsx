import FollowButton from "@/components/shared/FollowButton";
import FollowList from "@/components/shared/FollowList";
import ImageList from "@/components/shared/ImageList";
import { Button } from "@/components/ui/button";
import { getUserImagesById } from "@/lib/actions/image.actions";
import { getFollow, getUser } from "@/lib/actions/user.actions";
import { parseJson, validateFollowUser, validateImage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

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

  const clerkUser = await currentUser();

  const userInfo = await getUser(clerkUser?.id ?? "");

  const followInfo = await getFollow(parseJson(user._id));

  const userImages = await getUserImagesById(parseJson(user._id));

  const validImages = userImages.map(validateImage);

  const validFollowers = followInfo.followers.map(validateFollowUser);
  const validFollowing = followInfo.following.map(validateFollowUser);

  const isFollowed = user.followers
    .map(parseJson)
    .some((userId: string) => userId === parseJson(userInfo._id));

  return (
    <section className="mt-[44px] px-1 sm:px-1 sm:mb-20 lg:mb-2 sm:mx-auto lg:ml-52 lg:mt-14">
      <div className="fixed z-20 w-[98%] lg:w-[70rem] bg-[background] pb-2 lg:pb-0">
        <div className="relative w-full rounded bg-zinc-100 dark:bg-zinc-900 h-40 md:h-[18vh] lg:h-[20vh]">
          <div className="absolute top-2 md:left-52 md:top-4 text-lg">
            <div className="flex gap-2 md:mb-2">
              <FollowList list={validFollowing} title="Following" />
              <FollowList list={validFollowers} title="Followers" />
            </div>
            <div className="ml-2">
              <p>Images {validImages.length}</p>
            </div>
          </div>
          <Image
            src={user.image}
            alt={"User Profile Picture"}
            width={148}
            height={148}
            className="hidden absolute -bottom-12 md:block md:-bottom-16 ml-2 md:left-10 rounded-full border-4 border-[background] dark:border-[background] w-24 md:w-[148px]"
          />
          <Image
            src={user.image}
            alt={"User Profile Picture"}
            width={82}
            height={82}
            className="block absolute top-2 right-2 md:hidden md:-bottom-16 rounded-full border-4 border-[background] dark:border-[background]"
          />
          <div className="absolute text-md left-2 bottom-2 md:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h4>@{user.username}</h4>
              <FollowButton
                clerkSigned={!!clerkUser}
                currentUserId={parseJson(userInfo._id)}
                userId={parseJson(user._id)}
                path={`/profile/${parseJson(user._id)}`}
                onboarded={userInfo.onboarded}
                condition={user.id !== userInfo.id}
                isFollowed={isFollowed}
              />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">{user.bio}</p>
          </div>
        </div>
        <div className="hidden mt-1 ml-28 md:ml-52 mb-6 md:block">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h4 className="sm:text-xl">@{user.username}</h4>
            <FollowButton
              clerkSigned={!!clerkUser}
              currentUserId={parseJson(userInfo._id)}
              userId={parseJson(user._id)}
              path={`/profile/${parseJson(user._id)}`}
              onboarded={userInfo.onboarded}
              condition={user.id !== userInfo.id}
              isFollowed={isFollowed}
            />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">{user.bio}</p>
        </div>
      </div>
      <div className="mt-44 md:mt-52 mb-14 sm:mb-0">
        <ImageList
          height="md:h-[46vh] lg:h-[56vh]"
          images={validImages}
          userId={userInfo ? parseJson(userInfo._id) : null}
        />
      </div>
    </section>
  );
}
