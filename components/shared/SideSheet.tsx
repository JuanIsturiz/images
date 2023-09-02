import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Image, Menu } from "lucide-react";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs";
import SheetInfo from "./SheetInfo";
import { getUser } from "@/lib/actions/user.actions";
import { sideLinks } from "@/constants";
import SideLink from "./SideLink";

async function SideSheet() {
  const user = await currentUser();

  const userFromDB = await getUser(user?.id ?? "");

  const userInfo = userFromDB
    ? {
        id: userFromDB.id,
        onboarded: userFromDB.onboarded,
      }
    : null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <Link href={"/"}>
              <div className="flex items-center gap-2">
                <Image size={26} />
                <h1 className="hidden font-semibold text-2xl uppercase md:block">
                  images
                </h1>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="lg:flex flex-col justify-center gap-2 my-2 px-4 py-2">
          {sideLinks.map((link) => (
            <SideLink key={link.route} link={link} userInfo={userInfo} />
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <p>Copyright &copy; Juan Isturiz</p>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default SideSheet;
