"use client";

import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

interface Link {
  label: string;
  icon: string;
  route: string;
}

interface SideLinkProps {
  link: Link;
  userInfo: any;
}

const SideLink: React.FC<SideLinkProps> = ({ link, userInfo }) => {
  const { label, icon, route } = link;
  const { userId } = useAuth();
  const pathname = usePathname();

  const isActive =
    (pathname.includes(route) && route.length > 1) || pathname === route;

  return (
    <>
      <Link
        href={
          !userId
            ? "/sign-in"
            : !userInfo.onboarded
            ? "/onboarding"
            : route === "/profile"
            ? `/profile/${userId}`
            : route
        }
      >
        <div
          className={`flex items-center gap-3 p-2 rounded transition-colors duration-100 cursor-pointer ${
            isActive
              ? "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          } `}
        >
          <Image
            src={icon}
            alt={`${route} Icon`}
            width={24}
            height={24}
            className={"invert-0 dark:invert"}
          />
          <p className="text-lg">{label}</p>
        </div>
      </Link>
      {route !== "/profile" && <Separator />}
    </>
  );
};

export default SideLink;
