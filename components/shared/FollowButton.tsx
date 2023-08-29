"use client";

import { followUser } from "@/lib/actions/user.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserCheck2, UserPlus2 } from "lucide-react";

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
          className={"w-28 md:w-auto px-2 h-8 flex gap-1.5"}
          variant={isFollowed ? "secondary" : "default"}
          onClick={() => void follow()}
        >
          {isFollowed ? (
            <>
              <p>Following</p>
              <UserCheck2 />
            </>
          ) : (
            <>
              <p>Follow</p>
              <UserPlus2 />
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default FollowButton;
