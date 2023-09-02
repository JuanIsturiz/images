import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { sideLinks } from "@/constants";
import SideLink from "./SideLink";

async function SideBar() {
  const user = await currentUser();

  const userFromDB = await getUser(user?.id ?? "");

  const userInfo = userFromDB
    ? {
        id: userFromDB.id,
        onboarded: userFromDB.onboarded,
      }
    : null;

  return (
    <section>
      <div className="hidden fixed mt-14 left-2 w-52 lg:flex flex-col justify-center gap-2 my-2 px-4 py-2 bg-zinc-100 rounded dark:bg-zinc-900">
        {sideLinks.map((link) => (
          <SideLink key={link.route} link={link} userInfo={userInfo} />
        ))}
      </div>
    </section>
  );
}

export default SideBar;
