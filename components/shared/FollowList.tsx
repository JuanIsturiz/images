"use client";

interface FollowListProps {
  list: {
    _id: string;
    id: string;
    username: string;
    image: string;
  }[];
  title: string;
}

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../ui/separator";

const FollowList: React.FC<FollowListProps> = ({ list, title }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const filteredList = list.filter((user) =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen((prev) => !prev);
        setFilter("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant="ghost"
          aria-expanded={open}
          className="text-left text-lg w-28 px-0 hover:bg-zinc-200 dark:hover:bg-zinc-900 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        >
          {list.length} {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex gap-1 items-center opacity-60 px-1">
          <Search size={20} />
          <Input
            placeholder="Search user..."
            className="pl-0 bg-transparent border-none rounded-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            type="text"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Separator />
        {filter && filteredList.length === 0 && (
          <p className="text-lg text-center pt-2">No user found.</p>
        )}
        <ScrollArea className="p-1">
          <div className="flex flex-col gap-1">
            {filteredList.map((user) => (
              <Link key={user._id} href={`/profile/${user.id}`}>
                <div
                  key={user._id}
                  className="cursor-pointer flex gap-2 items-center p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                  <p>{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default FollowList;
