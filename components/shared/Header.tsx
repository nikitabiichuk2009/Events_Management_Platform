import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="Evently logo"
          />
        </Link>
        <nav className="hidden md:flex md:justify-between md:items-center ml-4 lg:ml-0">
          <NavItems otherClasses="text-sm lg:text-base" />
        </nav>
        <div className="flex justify-end w-32">
          <div className="mr-4 md:mr-0">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          <SignedOut>
            <Button asChild className="rounded-full md:flex hidden" size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
