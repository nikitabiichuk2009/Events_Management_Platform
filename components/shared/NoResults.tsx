import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  buttonTitle: string;
  href?: string;
  buttonAction?: () => void;
  isEventPurchase?: boolean;
}

const NoResults = ({
  title,
  description,
  buttonTitle,
  href,
  buttonAction,
  isEventPurchase = false,
}: Props) => {
  const buttonClassNames =
    "mt-5 min-h-[46px] w-full px-4 py-3 font-semibold md:w-fit";
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      {isEventPurchase && (
        <Image
          src={"/assets/gifs/success.gif"}
          alt="success"
          width={380}
          height={400}
        />
      )}
      <h3 className="h5-semibold">
        {isEventPurchase ? "🎉" : "❌"} {title} {isEventPurchase ? "🎉" : "❌"}
      </h3>
      <p className="p-regular-16 my-3.5 max-w-md text-center font-spaceGrotesk text-primary-400">
        {description}
      </p>
      {href ? (
        <Link href={href} className="flex justify-end max-md:w-full">
          <Button className={buttonClassNames}>{buttonTitle}</Button>
        </Link>
      ) : (
        <Button onClick={buttonAction} className={buttonClassNames}>
          {buttonTitle}
        </Button>
      )}
    </div>
  );
};

export default NoResults;
