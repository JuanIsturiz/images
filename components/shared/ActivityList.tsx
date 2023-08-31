"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityCard from "@/components/shared/ActivityCard";
import { usePathname, useRouter } from "next/navigation";
import { favImage } from "@/lib/actions/image.actions";

interface ActivityListProps {
  activities: Activity[] | null;
  userId: string | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, userId }) => {
  const pathname = usePathname();
  const router = useRouter();
  async function likeImage(
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    author: string,
    path: string
  ) {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    await favImage(isLiked, imageId, userId, author, path);
  }

  return (
    <ScrollArea className="h-[86vh] px-1 mb-1">
      {activities?.map((activity) => (
        // <ActivityCard
        //   key={activity._id}
        //   image={activity}
        //   userId={userId}
        //   pathname={pathname}
        //   onLike={likeImage}
        // />
        <div>activity</div>
      ))}
    </ScrollArea>
  );
};

export default ActivityList;
