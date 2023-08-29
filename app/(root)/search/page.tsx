import SearchBar from "@/components/shared/SearchBar";
import UserProfileCard from "@/components/shared/UserProfileCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUser, getUsersBySearch } from "@/lib/actions/user.actions";
import { parseJson, validateUser } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  const result = await getUsersBySearch({
    userId: parseJson(userInfo._id),
    searchString: searchParams.q,
    // pageNumber: searchParams?.page ? +searchParams.page : 1,
    // pageSize: 25,
  });
  // console.log({ searchString: searchParams.q });
  return (
    <section className="flex-1 my-1">
      <div className="max-w-2xl my-8 mx-auto">
        <SearchBar />
      </div>
      <div>
        <ScrollArea className="h-[70vh]">
          <div className="max-w-3xl mx-auto">
            <Separator />
            {[
              // ...result.map(validateUser),
              // ...result.map(validateUser),
              ...result.map(validateUser),
            ].map((user) => (
              <>
                <UserProfileCard
                  user={user}
                  currentUser={{
                    _id: parseJson(userInfo._id),
                    onboarded: userInfo.onboarded,
                  }}
                  isClerkUser={!!user}
                />
                <Separator />
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
