import OnboardingForm from "@/components/forms/OnboardingForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (userInfo.onboarded) redirect("/");

  const userProp = {
    id: user?.id ?? "",
    imageUrl: user?.imageUrl ?? "",
    username: user?.username ?? "",
    name: `${user?.firstName} ${user?.lastName}`,
  };

  return (
    <section className="mt-14">
      <div className="my-4">
        <h2 className="text-2xl text-center font-medium">Onboarding</h2>
        <h2 className="text-lg text-center text-zinc-600 dark:text-zinc-400">
          Complete your profile to unlock all images features
        </h2>
      </div>
      <OnboardingForm user={userProp} />
      <div className="flex items-center justify-center gap-2 mt-2">
        <Separator className="w-1/5" />
        <p>or</p>
        <Separator className="w-1/5" />
      </div>
      <div className="flex justify-center mb-2">
        <Link href={"/"}>
          <Button variant="link" className="text-lg">
            Return to homepage
          </Button>
        </Link>
      </div>
    </section>
  );
}
