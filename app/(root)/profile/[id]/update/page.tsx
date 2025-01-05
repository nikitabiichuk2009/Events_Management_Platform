import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { stringifyObject } from "@/lib/utils";
import NoResults from "@/components/shared/NoResults";
import ProfileForm from "@/components/shared/ProfileForm";
import { getUserByClerkId } from "@/lib/actions/user.actions";

export const metadata = {
  title: "Evently | Update Profile",
  description: "Edit your personal profile details.",
};

export default async function UpdateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const resolvedParams = await params;
  const profileOwnerId = resolvedParams.id;

  if (userId !== profileOwnerId) {
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Access Forbidden</h1>
        <NoResults
          title="Access Forbidden"
          description="You are not allowed to access this profile."
          buttonTitle="Go Back"
          href="/"
        />
      </div>
    );
  }

  let userProfile;
  try {
    const unparsedProfile = await getUserByClerkId(userId, false);
    userProfile = stringifyObject(unparsedProfile);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error Loading Profile"
          description="Failed to load profile data. Please try again later."
          buttonTitle="Go Back"
          href="/"
        />
      </div>
    );
  }

  return (
    <section className="wrapper">
      <div className="flex flex-col gap-4 text-center sm:text-left">
        <h2 className="h2-bold">Update Profile</h2>
        <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
          Edit your bio, location, and personal website.
        </p>
      </div>
      <div className="mt-8">
        <ProfileForm userId={userId} initialValues={userProfile} />
      </div>
    </section>
  );
}
