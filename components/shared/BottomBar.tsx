import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { sideLinks } from "@/constants";
import SideLink from "./SideLink";
import BottomLink from "./BottomLink";

async function BottomBar() {
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
      <div className="fixed bottom-0 z-40 flex w-full justify-between items-center gap-2 mt-2 px-12 py-1.5 bg-zinc-100 rounded rounded-b-none dark:bg-zinc-900 md:hidden">
        {sideLinks.map((link) => (
          <BottomLink key={link.route} link={link} userInfo={userInfo} />
        ))}
      </div>
    </section>
  );
}

export default BottomBar;
