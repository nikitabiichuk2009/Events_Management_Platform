"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("filter");
  const [search, setSearch] = useState(query || "");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleTypeClick = (item: string) => {
    if (search === item) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  const handleButtonClick = (item: string) => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 1500);

    setSearch((prevSearch) => (prevSearch === item ? "" : item));
    handleTypeClick(item);
  };

  return (
    <div className={`relative ${containerClasses}`} defaultValue={search || ""}>
      <Select onValueChange={handleButtonClick}>
        <SelectTrigger
          className={`${otherClasses} border px-5 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white`}
        >
          <div className="line-clamp-1 flex-1 text-left font-medium">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-black small-regular border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                disabled={isButtonDisabled}
                key={item.value}
                value={item.value}
                className={`cursor-pointer hover:bg-primary-50 transition-colors ease-in-out duration-300 bg-white ${
                  search === item.value
                    ? "text-black font-medium"
                    : "text-primary-400"
                }`}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
