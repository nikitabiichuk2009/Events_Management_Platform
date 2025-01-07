"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export type Order = {
  _id: string;
  buyer: {
    photo: string;
    username: string;
    email: string;
    clerkId: string;
  };
  totalAmount: number;
  event: {
    _id: string;
    title: string;
    description: string;
  };
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "buyer",
    header: "Buyer",
    cell: ({ row }) => {
      const buyer = row.original.buyer;
      return (
        <div className="flex items-center gap-3">
          <Link href={`/profile/${buyer.clerkId}`}>
            <div className="flex items-center gap-3">
              <div className="relative size-10">
                <Image
                  src={buyer.photo}
                  alt={`${buyer.username}'s avatar`}
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <p className="p-medium-16 text-grey-400 transition-colors hover:text-grey-500 duration-300 ease-in-out">@{buyer.username}</p>
            </div>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <p className="p-regular-16 whitespace-nowrap">
        {row.original.buyer.email}
      </p>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <p className={`p-bold-16 font-spaceGrotesk rounded-full px-5 py-2 line-clamp-1 w-fit ${
        row.original.totalAmount === 0
          ? "text-green-500 bg-green-500/10"
          : "text-primary-400 bg-primary-500/10"
      }`}>
        {row.original.totalAmount === 0 ? "Free" : `$${row.original.totalAmount}`}
      </p>
    ),
  },
  {
    accessorKey: "eventName",
    header: "Event",
    cell: ({ row }) => (
      <Link href={`/events/${row.original.event._id}`}>
        <p className="p-medium-16 text-primary-400 transition-colors hover:text-primary-500 duration-300 ease-in-out">
          {row.original.event.title}
        </p>
      </Link>
    ),
  },
];
