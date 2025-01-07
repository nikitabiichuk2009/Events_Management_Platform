import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  buttonTitle: string;
  href?: string;
  buttonAction?: () => void;
}

const NoResults = ({
  title,
  description,
  buttonTitle,
  href,
  buttonAction,
}: Props) => {
  const buttonClassNames =
    "mt-5 min-h-[46px] w-full px-4 py-3 font-semibold !text-primary-50 md:w-fit";
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <h3 className="h5-semibold">
        {title}
      </h3>
      <p className="p-regular-16 text-light-2 my-3.5 max-w-md text-center font-spaceGrotesk">
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
