import { getUser } from "@/lib/actions/user.actions";
import { getActivity } from "@/lib/actions/image.actions";
import { parseJson } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  const activities = await getActivity(
    parseJson(userInfo._id),
    userInfo.following.map(parseJson)
  );

  return <section className="flex-1"></section>;
}
