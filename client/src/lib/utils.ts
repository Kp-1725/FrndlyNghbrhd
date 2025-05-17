import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CategoryType = 
  | "groceries"
  | "handyman"
  | "petcare"
  | "transportation"
  | "education"
  | "childcare"
  | "other";

export const categoryConfig: Record<CategoryType, {
  label: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}> = {
  groceries: {
    label: "Groceries",
    icon: "fas fa-shopping-basket",
    bgColor: "bg-indigo-100",
    hoverColor: "hover:bg-indigo-200", 
    textColor: "text-primary"
  },
  handyman: {
    label: "Handyman",
    icon: "fas fa-tools",
    bgColor: "bg-emerald-100",
    hoverColor: "hover:bg-emerald-200",
    textColor: "text-secondary"
  },
  petcare: {
    label: "Pet Care",
    icon: "fas fa-paw",
    bgColor: "bg-amber-100",
    hoverColor: "hover:bg-amber-200",
    textColor: "text-amber-600"
  },
  transportation: {
    label: "Transportation",
    icon: "fas fa-car",
    bgColor: "bg-blue-100",
    hoverColor: "hover:bg-blue-200",
    textColor: "text-blue-600"
  },
  education: {
    label: "Education",
    icon: "fas fa-book",
    bgColor: "bg-purple-100",
    hoverColor: "hover:bg-purple-200",
    textColor: "text-purple-600"
  },
  childcare: {
    label: "Childcare",
    icon: "fas fa-baby",
    bgColor: "bg-pink-100",
    hoverColor: "hover:bg-pink-200",
    textColor: "text-pink-600"
  },
  other: {
    label: "Other",
    icon: "fas fa-ellipsis-h",
    bgColor: "bg-gray-100",
    hoverColor: "hover:bg-gray-200",
    textColor: "text-gray-600"
  }
};

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}
