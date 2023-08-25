"use client";

import { followUser } from "@/lib/actions/user.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  onboarded: boolean;
  clerkSigned: boolean;
  condition: boolean;
  isFollowed: boolean;
  currentUserId: string;
  userId: string;
  path: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  condition,
  clerkSigned,
  currentUserId,
  onboarded,
  path,
  userId,
  isFollowed,
}) => {
  const router = useRouter();

  async function follow() {
    if (!clerkSigned || !onboarded) {
      router.replace("/sign-in");
      return;
    }
    await followUser(isFollowed, currentUserId, userId, path);
  }

  return (
    <>
      {condition && (
        <Button
          variant={"outline"}
          className={`px-2 h-6 ${isFollowed && "opacity-80"}`}
          onClick={() => void follow()}
        >
          {isFollowed ? "Following" : "Follow"}
        </Button>
      )}
    </>
  );
};

export default FollowButton;
