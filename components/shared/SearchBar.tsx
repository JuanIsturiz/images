"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Separator } from "../ui/separator";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (searchString) {
        router.push(`/search?q=${searchString}`);
      } else {
        router.push("/search");
      }
    }, 350);

    return () => {
      clearTimeout(debounceFn);
    };
  }, [searchString]);

  return (
    <div className="flex items-center gap-1.5 px-2 border rounded dark:border-zinc-800">
      <Search />
      <Separator orientation="vertical" className="h-8" />
      <Input
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Search..."
        className="!bg-transparent border-none pl-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchBar;
