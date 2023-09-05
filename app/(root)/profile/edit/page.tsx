import UserProfileForm from "@/components/forms/UserProfileForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  const userProp = {
    id: userInfo.id ?? "",
    image: userInfo.image ?? "",
    username: userInfo.username ?? "",
    bio: userInfo.bio ?? "",
    name: userInfo.name ?? "",
  };

  return (
    <section className="w-full mt-14 sm:px-1 mb-14 sm:mb-20 lg:mb-2 lg:ml-52">
      <div className="my-4">
        <h2 className="text-2xl text-center font-medium">Edit Profile</h2>
        <h2 className="text-lg text-center text-zinc-600 dark:text-zinc-400">
          Update your profile info!
        </h2>
      </div>
      <UserProfileForm user={userProp} />
      <div className="flex items-center justify-center gap-2 mt-2">
        <Separator className="w-1/5" />
        <p>or</p>
        <Separator className="w-1/5" />
      </div>
      <div className="flex justify-center mb-2">
        <Link href={`/profile/${userInfo.id}`}>
          <Button variant="link" className="text-lg">
            Return to profile
          </Button>
        </Link>
      </div>
    </section>
  );
}
