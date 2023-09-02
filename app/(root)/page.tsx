import ImageList from "@/components/shared/ImageList";
import Pagination from "@/components/shared/Pagination";
import { getImages } from "@/lib/actions/image.actions";
import { getUser } from "@/lib/actions/user.actions";
import { parseJson, validateImage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  const userInfo = await getUser(user?.id ?? "");

  if (user && !userInfo?.onboarded) redirect("/onboarding");

  const images = await getImages(
    searchParams.page ? +searchParams.page : 1,
    12
  );

  return (
    <section className="w-full mt-14 px-8 sm:px-1 mb-14 sm:mb-20 lg:mb-2 lg:ml-52">
      <ImageList
        images={images.data}
        userId={userInfo ? parseJson(userInfo._id) : null}
      />
      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={images.isNext}
      />
    </section>
  );
}
