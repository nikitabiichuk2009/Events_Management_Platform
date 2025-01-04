// import EventForm from "@/components/shared/EventForm";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export default async function UpdateEventPage() {
//   const { userId }: { userId: string | null } = await auth()
//   let mongoUser;
//   if (!userId) {
//     redirect("/sign-in");
//   }
//   return (
//     <>
//       <section className="bg-primary-50 py-5 md:py-10">
//         <h3 className="h3-bold text-center sm:text-left wrapper">
//           Update an Event
//         </h3>
//       </section>
//       <div className="wrapper my-8">
//         <EventForm userId={userId} type="update" categories={categories} />
//       </div>
//     </>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page