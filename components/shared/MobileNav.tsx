import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="Evently menu"
            width={24}
            height={24}
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <SheetTitle>
            <Image
              src="/assets/images/logo.svg"
              alt="Evently logo"
              width={128}
              height={38}
            />
          </SheetTitle>
          <Separator className="border" />
          <NavItems isMobile={true} />
          <SignedOut>
            <Button className="rounded-full w-fit mt-4">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
