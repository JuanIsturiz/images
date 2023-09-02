import CreateImageForm from "@/components/forms/CreateImageForm";
import { getUser } from "@/lib/actions/user.actions";
import { parseJson } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="mt-14 px-2 md:px-8 sm:px-1 mb-14 sm:mx-auto lg:ml-52">
      <h1 className="text-semibold text-xl mb-1">New Image</h1>
      <CreateImageForm
        userId={parseJson(userInfo._id)}
        followers={userInfo.followers.map(parseJson)}
      />
    </section>
  );
}
