import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Loading your Organized Events and people who ordered...</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Please wait while we load details about your events and ticket purchases.
          </p>
        </div>
      </section>
      <section className="wrapper mt-10">
        <Skeleton className="h-14 w-full rounded-md mb-5" />
        <div className="w-full overflow-hidden rounded-lg border shadow-lg">
          <div className="bg-primary-400 h-14 w-full rounded-t-lg" />
          <div className="flex justify-between items-center border-b p-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-7 w-[20%] sm:w-[15%] lg:w-[10%] rounded"
              />
            ))}
          </div>
          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center border-b p-3 ${
                idx === 4 && "border-b-0"
              }`}
            >
              {Array.from({ length: 4 }).map((__, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className="h-5 w-[20%] sm:w-[15%] lg:w-[10%] rounded"
                />
              ))}
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <Skeleton className="h-9 w-20 rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none" />
            <Skeleton className="h-9 w-24 rounded-tr-md rounded-tl-md rounded-br-none rounded-bl-none" />
            <Skeleton className="h-9 w-20 rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none" />
          </div>
        </div>
      </section>
    </>
  );
}
