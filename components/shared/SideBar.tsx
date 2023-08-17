import { Heart, Home, ImagePlus, Search, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";

async function SideBar() {
  const user = await currentUser();

  return (
    <section>
      <div className="w-52 flex flex-col justify-center gap-2 my-2 px-4 py-2 bg-zinc-100 rounded dark:bg-zinc-900">
        <Link href={"/search"}>
          <div className="flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <Home size={22} />
            <p className="text-lg">Home</p>
          </div>
        </Link>
        <Separator />
        <Link href={"/search"}>
          <div className="flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <Home size={22} />
            <p className="text-lg">Search</p>
          </div>
        </Link>
        <Separator />
        <Link href={"/activity"}>
          <div className="flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <Heart size={22} />
            <p className="text-lg">Activity</p>
          </div>
        </Link>
        <Separator />
        <Link href={"/create"}>
          <div className="flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <ImagePlus size={22} />
            <p className="text-lg">Create Image</p>
          </div>
        </Link>
        <Separator />
        <Link href={`/profile/${user?.id ?? ""}`}>
          <div className="flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <User size={22} />
            <p className="text-lg">My Profile</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default SideBar;
