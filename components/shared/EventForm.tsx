"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventSchema } from "@/lib/validations";
import { Textarea } from "../ui/textarea";
import Dropdown from "./Dropdown";
import FileUploader from "./FileUploader";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uploadFiles } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/events.actions";

type EventFormProps = {
  userId: string;
  eventIdToEdit?: string;
  type: "create" | "update";
  categories: { name: string }[];
  initialValues?: z.infer<typeof eventSchema>;
};

const EventForm = ({
  userId,
  eventIdToEdit,
  type,
  categories,
  initialValues,
}: EventFormProps) => {
  const minDate = new Date();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      location: initialValues?.location || "",
      url: initialValues?.url || "",
      imageUrl: initialValues?.imageUrl || "",
      price: initialValues?.price || 100,
      category: initialValues?.category || "",
      isFree: initialValues?.isFree || false,
      startDateTime: initialValues?.startDateTime || undefined,
      endDateTime: initialValues?.endDateTime || undefined,
    },
  });

  const isFormUnchanged =
    type === "update" && Object.keys(form.formState.dirtyFields).length === 0;

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    if (isSubmitting) return;
    if (
      values.startDateTime &&
      values.endDateTime &&
      values.startDateTime > values.endDateTime
    ) {
      form.setError("startDateTime", {
        message: "Start date and time must be before end date and time",
      });
      return;
    }

    if (
      values.startDateTime &&
      values.endDateTime &&
      values.startDateTime === values.endDateTime
    ) {
      form.setError("startDateTime", {
        message: "Start date and time must be different",
      });
      return;
    }

    setIsSubmitting(true);
    const price = form.watch("price");
    form.setValue("isFree", price === 0);
    values.isFree = price === 0;

    values.price = values.isFree ? 0 : values.price;

    let uploadImageUrl = values.imageUrl;
    if (files.length > 0) {
      try {
        const response = await uploadFiles("imageUploader", {
          files,
        });
        if (response && response.length > 0) {
          uploadImageUrl = response[0].url;
        }
      } catch (error) {
        toast({
          title: "File upload failed",
          description: "Please try again later",
          className: "bg-red-500 text-white border-none",
        });
        router.push("/");
      }
    }
    try {
      if (type === "create") {
        await createEvent({
          userId,
          event: {
            ...values,
            imageUrl: uploadImageUrl,
          },
          path: "/",
        });
        toast({
          title: "Event created successfully",
          description: "Your event has been created",
          className: "bg-green-500 text-white border-none",
        });
        router.push("/");
      } else if (type === "update" && eventIdToEdit && !isFormUnchanged) {
        await updateEvent({
          userId,
          event: {
            _id: eventIdToEdit,
            ...values,
            imageUrl: uploadImageUrl,
          },
          path: `/events/${eventIdToEdit}`,
        });
        toast({
          title: "Event updated successfully",
          description: "Your event has been updated",
          className: "bg-green-500 text-white border-none",
        });
        router.push(`/events/${eventIdToEdit}`);
      }
    } catch (error) {
      toast({
        title: `Event ${type === "create" ? "creation" : "update"} failed`,
        description: "Please try again later",
        className: "bg-red-500 text-white border-none",
      });
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col md:flex-row md:gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    className="input-field w-full"
                    placeholder="Event Title"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="form-description">
                  This is the title of your event (3-50 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">Category</FormLabel>
                <FormControl>
                  <Dropdown
                    classNames="w-full"
                    onChangeHandler={field.onChange}
                    value={field.value}
                    categoriesList={categories}
                  />
                </FormControl>
                <FormDescription className="form-description">
                  This is the category of your event (3-40 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Description</FormLabel>
              <FormControl>
                <Textarea
                  className="input-field"
                  rows={4}
                  placeholder="Event Description"
                  {...field}
                />
              </FormControl>
              <FormDescription className="form-description">
                This is the description of your event (10-400 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Image</FormLabel>
              <FormControl>
                <FileUploader
                  onFieldChange={field.onChange}
                  setFiles={setFiles}
                  imageUrl={field.value}
                />
              </FormControl>
              <FormDescription className="form-description">
                This is the image of your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Location</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <span className="absolute left-3">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      width={20}
                      height={20}
                      alt="location-icon"
                    />
                  </span>
                  <Input
                    className="input-field pl-10"
                    placeholder="Event Location or Online"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription className="form-description">
                This is the location of your event (3-150 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row md:gap-3">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">Start Date</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className="absolute left-3">
                      <Image
                        src="/assets/icons/calendar-grey.svg"
                        width={20}
                        height={20}
                        alt="calendar-icon"
                      />
                    </span>
                    <div className="w-full input-field pl-10 flex flex-row items-center">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        minDate={minDate}
                        showTimeSelect
                        timeInputLabel="Time:"
                        timeIntervals={5}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        className="cursor-pointer"
                        placeholderText="Select Start Date"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="form-description">
                  This is the start date of your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">End Date</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className="absolute left-3">
                      <Image
                        src="/assets/icons/calendar-grey.svg"
                        width={20}
                        height={20}
                        alt="calendar-icon"
                      />
                    </span>
                    <div className="w-full input-field pl-10 flex flex-row items-center">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        minDate={minDate}
                        showTimeSelect
                        timeInputLabel="Time:"
                        timeIntervals={5}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        className="cursor-pointer"
                        placeholderText="Select End Date"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="form-description">
                  This is the end date of your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row md:gap-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">Price</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className="absolute left-3">
                      <Image
                        src="/assets/icons/dollar-grey.svg"
                        width={20}
                        height={20}
                        alt="price-icon"
                      />
                    </span>
                    <Input
                      className="input-field pl-10"
                      placeholder="Event Price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.watch("isFree")}
                    />
                    <div className="absolute right-12 flex items-center gap-2">
                      <FormLabel
                        htmlFor="isFree"
                        className="text-sm text-grey-500"
                      >
                        Free
                      </FormLabel>
                      <Input
                        id="isFree"
                        type="checkbox"
                        className="w-4 h-4 rounded"
                        {...form.register("isFree")}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="form-description">
                  Enter the price for your event, or mark it as free.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="form-label">URL</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className="absolute left-3">
                      <Image
                        src="/assets/icons/link-grey.svg"
                        width={20}
                        height={20}
                        alt="url-icon"
                      />
                    </span>
                    <Input
                      className="input-field pl-10"
                      placeholder="Event URL"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription className="form-description">
                  This is the URL for your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full md:w-fit"
          disabled={isSubmitting || (type === "update" && isFormUnchanged)}
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
