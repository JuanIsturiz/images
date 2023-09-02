import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import UserProfileCard from "@/components/shared/UserProfileCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUser, getUsersBySearch } from "@/lib/actions/user.actions";
import { parseJson, validateUser } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";

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
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });
  return (
    <section className="w-full mt-14 sm:px-1 mb-14 sm:mb-20 lg:mb-2 lg:ml-52">
      <div className="max-w-2xl my-8 mx-auto">
        <SearchBar />
      </div>
      <div>
        <ScrollArea className="h-[70vh]">
          <div className="max-w-3xl mx-auto">
            <Separator />
            {result.users.length ? (
              result.users.map(validateUser).map((user) => (
                <Fragment key={user._id}>
                  <UserProfileCard
                    user={user}
                    currentUser={{
                      _id: parseJson(userInfo._id),
                      onboarded: userInfo.onboarded,
                    }}
                    isClerkUser={!!user}
                  />
                  <Separator />
                </Fragment>
              ))
            ) : (
              <h1 className="text-center text-2xl opacity-70 my-2">
                No user found.
              </h1>
            )}
          </div>
        </ScrollArea>
      </div>
      <div>
        <Pagination
          path="search"
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </section>
  );
}
