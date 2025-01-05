"use client";
import React, { useState } from "react";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Pagination = ({
  pageNumber,
  isNext,
}: {
  pageNumber: number;
  isNext: boolean;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleNavigation = (direction: string) => {
    if (isDisabled) return; // Prevent further clicks while disabled

    setIsDisabled(true);
    const nextpageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextpageNumber.toString(),
    });
    router.push(newUrl);

    setTimeout(() => {
      setIsDisabled(false);
    }, 1500); // Disable buttons for 1.5 seconds
  };

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1 || isDisabled}
        onClick={() => handleNavigation("prev")}
        className="flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="text-body-semibold text-light-1">Prev</p>
      </Button>
      <div className="flex items-center justify-center text-white rounded-md bg-primary-500/100 p-3.5 py-2">
        <p className="text-body-semibold text-light-2">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext || isDisabled}
        onClick={() => handleNavigation("next")}
        className="border flex min-h-[36px] items-center justify-center gap-2"
      >
        <p className="text-body-semibold text-light-1">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
