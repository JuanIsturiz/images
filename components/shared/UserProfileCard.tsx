import { UserCheck2, UserPlus2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import FollowButton from "./FollowButton";
import { parseJson } from "@/lib/utils";

interface UserProfileCardProps {
  user: User;
  isClerkUser: boolean;
  currentUser: {
    _id: string;
    onboarded: boolean;
  };
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  isClerkUser,
  user,
  currentUser,
}) => {
  const isFollowed = user.followers.some(
    (userId) => userId === currentUser._id
  );

  return (
    <div className="flex justify-between items-center w-full p-2">
      <div className="flex items-center gap-2">
        <Image
          src={user.image}
          alt="User Profile Picture"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="text-lg">{user.username}</p>
          <p className="opacity-70">{user.name}</p>
        </div>
      </div>
      <div>
        <FollowButton
          clerkSigned={isClerkUser}
          currentUserId={currentUser._id}
          userId={user._id}
          path={"/search"}
          onboarded={currentUser.onboarded}
          condition={user._id !== currentUser._id}
          isFollowed={isFollowed}
        />
      </div>
    </div>
  );
};

export default UserProfileCard;
