import { ICategory } from "@/lib/database/models/category.model"
import { IEvent } from "@/lib/database/models/event.model"
import { IOrder } from "@/lib/database/models/order.model"
import { IUser } from "@/lib/database/models/user.model"

// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  clerkId: string
  updateData: {
    firstName?: string
    lastName?: string
    username?: string
    email?: string
    photo?: string
    bio?: string
    location?: string
    personalWebsite?: string
  }
  path: string
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
  query?: string
  category?: string
}

export type DeleteUserParams = {
  clerkId: string
}

export type GetUserTicketsParams = {
  userId: string;
  query?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface SaveEventParams {
  eventId: string;
  userClerkId: string;
  hasSaved: boolean;
  path: string;
}


// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string
  event: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    category: string
    price: number
    isFree: boolean
    url: string
  }
  path: string
}

export type UpdateEventParams = {
  userId: string
  event: {
    _id: string
    title: string
    imageUrl: string
    description: string
    location: string
    startDateTime: Date
    endDateTime: Date
    category: string
    price: number
    isFree: boolean
    url: string
  }
  path: string
}

export type DeleteEventParams = {
  eventId: string
  path: string
}

export type GetAllEventsParams = {
  query?: string
  category?: string
  limit?: number
  page?: number
}

export type GetSavedEventsByUserParams = {
  clerkId: string;
  query?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export type Event = IEvent & { _id: string } & { organizer: IUser & { _id: string } } & { category: ICategory & { _id: string } };

export type Order = IOrder & { _id: string } & { event: Event } & { buyer: IUser & { _id: string } };

// ====== CATEGORY PARAMS
export type GetAllCategoriesParams = {
  query?: string
  page?: number
  limit?: number
  filter?: string;
}

export type GetEventsByCategoryIdParams = {
  categoryId: string
  query?: string
  filter?: string
  page?: number
  limit?: number
}
// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string
  eventDescription: string
  eventId: string
  price: number
  isFree: boolean
  buyerId: string
  buyerClerkId: string
}

export type CreateOrderParams = {
  stripeId: string
  eventId: string
  buyerId: string
  totalAmount: number
  createdAt: Date
}

export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParamsProps>
}

export interface SearchParamsProps {
  [key: string]: string | undefined;
}