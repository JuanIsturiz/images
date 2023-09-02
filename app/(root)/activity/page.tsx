import { getUser } from "@/lib/actions/user.actions";
import { parseJson, validateActivity } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import ActivityList from "@/components/shared/ActivityList";
import { getActivity } from "@/lib/actions/activity.actions";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  const activities = await getActivity(parseJson(userInfo._id));

  const validActivities = activities.map(validateActivity);

  return (
    <section className="w-full mt-14 sm:px-1 mb-14 sm:mb-20 lg:mb-2 lg:ml-52">
      <ActivityList
        activities={validActivities}
        userId={parseJson(userInfo._id)}
      />
    </section>
  );
}
