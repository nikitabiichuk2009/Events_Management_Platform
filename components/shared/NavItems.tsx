"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const NavItems = ({ otherClasses }: { otherClasses?: string }) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <ul className={`flex md:justify-between md:flex-row w-full flex-col items-start gap-5 ${otherClasses}`}>
      {headerLinks.map((link) => {
        const route =
          link.label === "Profile" ? `/profile/${userId || ""}` : link.route;

        return (
          <li key={link.label}>
            <Link
              href={route}
              className={`${
                pathname === route
                  ? "text-primary-500"
                  : "text-black hover:text-primary-400 whitespace-nowrap transition-colors duration-200 ease-in-out"
              } font-medium`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
