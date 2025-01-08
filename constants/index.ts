export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'New Event',
    route: '/create-event',
  },
  {
    label: 'Categories',
    route: '/categories',
  },
  {
    label: 'Community',
    route: '/community',
  },
  {
    label: 'Profile',
    route: '/profile',
  },
  {
    label: 'Saved',
    route: '/saved',
  },
  {
    label: 'Orders',
    route: '/orders',
  },
]

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}

// Filters
export const CategoryFilters = [
  { name: "Popular", value: "popular" },
  { name: "Recent", value: "recent" },
  { name: "Name", value: "name" },
  { name: "Old", value: "old" },
];

export const EventFilters = [
  { name: "Popular", value: "popular" },
  { name: "Recent", value: "recent" },
  { name: "Old", value: "old" },
  { name: "Name", value: "name" },
  { name: "Free (only)", value: "free" },
  { name: "Cheapest", value: "cheapest" },
  { name: "Most Expensive", value: "most-expensive" },
];

export const TicketFilters = [
  { name: "Recently Purchased", value: "recently-purchased" },
  { name: "Oldest", value: "oldest" },
  { name: "Most Expensive", value: "most-expensive" },
  { name: "Cheapest", value: "cheapest" },
];

export const UserFilters = [
  { name: "New Users", value: "newUsers" },
  { name: "Old Users", value: "oldUsers" },
  { name: "Top Creators", value: "topCreators" },
];