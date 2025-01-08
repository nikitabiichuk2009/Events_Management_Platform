"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SheetClose } from "@/components/ui/sheet";

const NavItems = ({ otherClasses, isMobile = false }: { otherClasses?: string; isMobile?: boolean }) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <ul className={`flex md:justify-between md:flex-row w-full flex-col items-start gap-5 ${otherClasses}`}>
      {headerLinks.map((link) => {
        const route =
          link.label === "Profile" ? `/profile/${userId || ""}` : link.route;

        const linkElement = (
          <Link
            href={route}
            className={`${
              pathname === route
                ? "text-primary-500"
                : "text-black hover:text-primary-400 transition-colors duration-200 ease-in-out whitespace-nowrap"
            } font-medium`}
          >
            {link.label}
          </Link>
        );

        return (
          <li key={link.label}>
            {isMobile ? <SheetClose asChild>{linkElement}</SheetClose> : linkElement}
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
