"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/ModeToggle";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";

const TopBar = () => {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 md:pl-16 lg:pl-4 pr-3 z-20 w-full h-14 flex justify-between items-center p-2 dark:bg-[background]">
      <div>
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              src={"/assets/logo.svg"}
              alt="Images logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <h1 className="hidden font-semibold text-2xl md:block">images</h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <SignedIn>
          <UserButton
            showName
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
          />
        </SignedIn>
        {!pathname.includes("sign") && (
          <SignedOut>
            <SignInButton
              afterSignInUrl="/onboarding"
              afterSignUpUrl="/onboarding"
            >
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        )}
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
