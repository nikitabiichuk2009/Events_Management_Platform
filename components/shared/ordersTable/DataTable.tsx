"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import NoResults from "../NoResults";
import Image from "next/image";
import { removeKeysFromQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  eventIdFilter?: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  eventIdFilter,
}: DataTableProps<TData, TValue>) {
  console.log(eventIdFilter);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredData = eventIdFilter
    ? data.filter((row: any) => row.event._id === eventIdFilter)
    : data;

  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: { pagination: { pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) => {
      const { event, buyer } = row.original as {
        event: { title: string; description: string };
        buyer: { username: string; email: string };
      };
      const search = value.toLowerCase();
      return (
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        buyer.username.toLowerCase().includes(search) ||
        buyer.email.toLowerCase().includes(search)
      );
    },
  });

  const clearFilter = () => {
    if (eventIdFilter) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["eventId"],
      });
      router.push(newUrl, { scroll: false });
    } else setGlobalFilter("");
  };

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {!eventIdFilter && (
        <div className="border bg-primary-50 relative flex min-h-[56px] grow items-center rounded-xl px-4 mb-5">
          {" "}
          <>
            <Image
              src={"/assets/icons/search.svg"}
              width={24}
              height={24}
              alt="search"
              className="cursor-pointer"
              onClick={handleImageClick}
            />
            <Input
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              type="text"
              placeholder="Search by event, username, or email..."
              value={globalFilter}
              ref={inputRef}
              className="input-field border-none"
            />
          </>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-lg border shadow-lg">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <NoResults
                    title="No Matching Results Found"
                    description="We couldn’t find any results for your search or selected filters. Try modifying your search terms or resetting the filters to view all available records."
                    buttonTitle="View all orders"
                    buttonAction={clearFilter}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none"
          >
            Previous
          </Button>
          <span className="text-primary-500 p-regular-16">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none"
          >
            Next
          </Button>
        </div>
        {eventIdFilter && (
          <div className="flex justify-center p-2">
            <Button onClick={clearFilter} className="mt-4">
              View all Orders
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
