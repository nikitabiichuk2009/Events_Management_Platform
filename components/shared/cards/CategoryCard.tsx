import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
  name: string;
  eventCount: number;
}

const CategoryCard = ({ id, name, eventCount }: Props) => {
  return (
    <div className="shadow-sm w-full md:w-[260px]">
      <Link href={`/categories/${id}`}>
        <div className="background-light850_dark200 light-border flex h-[150px] flex-col justify-start gap-[18px] rounded-2xl border p-8 dark:border-none">
          <Badge className= "w-fit rounded-md border-none px-4 py-2 text-white bg-primary-400">
            {name}
          </Badge>
          <p className="p-regular-18 text-dark200_light900">
            <span className="text-[20px] font-bold text-primary-500">
              {eventCount}+{" "}
            </span>
            Events
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
