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

interface BottomLinkProps {
  link: Link;
  userInfo: any;
}

const BottomLink: React.FC<BottomLinkProps> = ({ link, userInfo }) => {
  const { label, icon, route } = link;
  const { userId } = useAuth();
  const pathname = usePathname();

  const isActive =
    (pathname.includes(route) && route.length > 1) || pathname === route;

  return (
    <div className="md:flex-1">
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
          className={`flex flex-1 flex-col items-center px-1.5 py-1 rounded transition-colors duration-100 cursor-pointer ${
            isActive
              ? "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          } `}
        >
          <Image
            src={icon}
            alt={`${route} Icon`}
            width={20}
            height={20}
            className={"invert-0 dark:invert"}
          />
          <p className="hidden md:block text-sm">{label.split(" ")[0]}</p>
        </div>
      </Link>
    </div>
  );
};

export default BottomLink;
