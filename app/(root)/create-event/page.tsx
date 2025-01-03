import EventForm from "@/components/shared/EventForm";
import NoResults from "@/components/shared/NoResults";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { stringifyObject } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateEventPage() {
  const { userId }: { userId: string | null } = await auth()
  let mongoUser;
  let categories;
  if (!userId) {
    redirect("/sign-in");
  }
  try {
    const user = await getUserByClerkId(userId);
    mongoUser = stringifyObject(user);
  } catch (err) {
    console.log(err)
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error occurred</h1>
        <NoResults
          title="Error loading user"
          description="Failed to load user information. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  try {
    const categoryList = await getAllCategories();
    const parsedCategory = stringifyObject(categoryList);
    categories = parsedCategory.map((category: any) => ({ name: category.name }));
  } catch (err) {
    console.log(err)
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error occurred</h1>
        <NoResults
          title="Error loading categories"
          description="Failed to load categories. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <h3 className="h3-bold text-center sm:text-left wrapper">
          Create an Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={mongoUser._id} type="create" categories={categories} />
      </div>
    </>
  );
}
