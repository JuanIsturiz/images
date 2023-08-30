import { getUser } from "@/lib/actions/user.actions";
import { getOldActivity } from "@/lib/actions/image.actions";
import { parseJson, validateImage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import ActivityList from "@/components/shared/ActivityList";
import { getActivity } from "@/lib/actions/activity.actions";

export default async function Page() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  const activities = await getActivity(parseJson(userInfo._id));

  console.log({ activities });

  return (
    <section className="px-1 my-3 flex-1">
      {/* <ActivityList
        activities={}
        userId={parseJson(userInfo._id)}
      /> */}
    </section>
  );
}

// follow CHECK, post CHECK, like CHECK, comment CHECK
