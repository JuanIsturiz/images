import { ScrollArea } from "@/components/ui/scroll-area";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  // if(user && !userInfo?.onboarded) redirect('/onboarding');

  return (
    <section className="p-1">
      <ScrollArea className="h-[34rem]">
        <h1>Home</h1>
        <div className="flex flex-wrap gap-4">
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
          <div className="w-60 h-60 border-2" />
        </div>
      </ScrollArea>
    </section>
  );
}
