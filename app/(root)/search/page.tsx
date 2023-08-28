import SearchBar from "@/components/shared/SearchBar";
import { getUser, getUsersBySearch } from "@/lib/actions/user.actions";
import { parseJson } from "@/lib/utils";
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
  console.log({ searchString: searchParams.q });
  return (
    <section className="flex-1">
      <h2>Search</h2>
      <SearchBar />
      <div>
        {result.map((res) => (
          <p>{res.username}</p>
        ))}
      </div>
    </section>
  );
}
