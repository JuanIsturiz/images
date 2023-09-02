import ImageList from "@/components/shared/ImageList";
import { getImages } from "@/lib/actions/image.actions";
import { getUser } from "@/lib/actions/user.actions";
import { parseJson, validateImage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  const images = await getImages();

  const validImages = images.map(validateImage);

  return (
    <section className="mt-14 px-8 sm:px-1 mb-14 sm:mb-20 lg:mb-2 sm:mx-auto lg:ml-52">
      <ImageList
        images={validImages}
        userId={userInfo ? parseJson(userInfo._id) : null}
        height="h-[83vh] md:h-[74vh] lg:h-[86vh]"
      />
    </section>
  );
}
