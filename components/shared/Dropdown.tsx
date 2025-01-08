"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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

    if (trimmedCategory.length < 3 || trimmedCategory.length > 40) {
      setError("Category name must be between 3 and 40 characters");
      return;
    }

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
              className="duration-200 transition-colors ease-in-out hover:bg-primary-50 bg-white text-base line-clamp-1"
            >
              {category.name}
            </SelectItem>
          ))}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <p className="cursor-pointer p-medium-14 flex w-full py-3 pl-8 text-primary-500 hover:text-primary-400 duration-200 transition-colors ease-in-out">
                Add Category
              </p>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add a New Category</DialogTitle>
                <DialogDescription className="font-spaceGrotesk text-primary-400">
                  Add a new category to enhance organization and easily group
                  items. Ensure the name is unique and descriptive.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-left">
                  Category Name
                </Label>
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input-field"
                  placeholder="Enter category name"
                />
                {error && (
                  <p className="text-red-500 text-sm font-medium mt-1">
                    {error}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    handleAddCategory();
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SelectContent>
      </Select>
    </>
  );
};

export default Dropdown;
