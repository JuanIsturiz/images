import { getUser } from "@/lib/actions/user.actions";
import { getActivity } from "@/lib/actions/image.actions";
import { parseJson, validateImage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import ActivityList from "@/components/shared/ActivityList";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  const activities = await getActivity(
    parseJson(userInfo._id),
    userInfo.following.map(parseJson)
  );

  const validActivities = activities.map(validateImage);

  return (
    <section className="px-1 my-3 flex-1">
      <ActivityList
        activities={validActivities}
        userId={parseJson(userInfo._id)}
      />
    </section>
  );
}
