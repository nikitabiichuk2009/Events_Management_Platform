"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

type DropdownProps = {
  onChangeHandler: (value: string) => void;
  value: string;
  classNames?: string;
  categoriesList: { name: string }[];
};

const Dropdown = ({
  onChangeHandler,
  value,
  classNames,
  categoriesList,
}: DropdownProps) => {
  const [categories, setCategories] =
    useState<{ name: string }[]>(categoriesList);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (categories.some((category) => category.name === trimmedCategory)) {
      setError("Category already exists");
      return;
    }

    setCategories([...categories, { name: trimmedCategory }]);
    setNewCategory("");
    setError(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className={`input-field ${classNames}`}>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category, index) => (
            <SelectItem
              key={`${category.name}-${index}`}
              value={category.name}
              className="duration-200 transition-colors ease-in-out hover:bg-primary-50 bg-white text-base"
            >
              {category.name}
            </SelectItem>
          ))}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger
              className="p-medium-14 flex w-full py-3 pl-8 text-primary-500 hover:text-primary-400 duration-200 transition-colors ease-in-out"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Category
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-50">
              <AlertDialogHeader>
                <AlertDialogTitle>New Category</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    value={newCategory}
                    placeholder="Category Name"
                    className="input-field text-black"
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  {error && (
                    <span className="text-red-500 text-sm font-medium font-spaceGrotesk mt-2">
                      {error}
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setError(null);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddCategory();
                  }}
                >
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectContent>
      </Select>
    </>
  );
};

export default Dropdown;
