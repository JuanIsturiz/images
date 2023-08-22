import CreateImageForm from "@/components/forms/CreateImageForm";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="px-1 my-3 flex-1">
      <h1>New Image</h1>
      <CreateImageForm userId={JSON.stringify(userInfo._id)} />
    </section>
  );
}
