import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateProfileLoading() {
  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Loading Profile Form with your details...</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Please wait while we load the form for updating your profile.
          </p>
        </div>
      </section>
      <div className="wrapper my-8">
        <div className="flex flex-col gap-5">
          <Skeleton className="min-h-28 rounded-md w-full" />
          <Skeleton className="min-h-[56px] rounded-md w-full" />
          <Skeleton className="min-h-[56px] rounded-md w-full" />
        </div>
      </div>
    </>
  );
}
