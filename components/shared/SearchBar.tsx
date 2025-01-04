"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const SearchBar = ({
  route,
  searchFor,
  iconPosition,
  imgSrc,
  otherClasses,
}: {
  searchFor: string;
  iconPosition: string;
  imgSrc: string;
  otherClasses?: string;
  route?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [search, pathName, searchParams, query, router, route]);

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`border bg-primary-50 relative flex min-h-[56px] grow items-center rounded-xl px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <>
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search"
            className="cursor-pointer"
            onClick={handleImageClick}
          />
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            value={search}
            className="input-field border-none"
          />
        </>
      )}
      {iconPosition === "right" && (
        <>
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            value={search}
            className="input-field border-none"
          />
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search icon"
            className="cursor-pointer"
            onClick={handleImageClick}
          />
        </>
      )}
    </div>
  );
};

export default SearchBar;
