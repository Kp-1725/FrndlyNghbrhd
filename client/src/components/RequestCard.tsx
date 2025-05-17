import { formatDistanceToNow } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Request } from "@shared/schema";
import { categoryConfig } from "@/lib/utils";

interface RequestCardProps {
  request: Request;
}

export function RequestCard({ request }: RequestCardProps) {
  const {
    id,
    title,
    description,
    category,
    user,
    location,
    createdAt,
    distance
  } = request;

  const categoryInfo = categoryConfig[category];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="request-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 ${categoryInfo.bgColor} ${categoryInfo.textColor} text-xs font-medium rounded-full`}>
            {categoryInfo.label}
          </span>
          <span className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(createdAt))}
          </span>
        </div>
        
        <Link href={`/request/${id}`}>
          <h3 className="text-lg font-semibold text-slate-800 mb-2 cursor-pointer hover:text-primary">
            {title}
          </h3>
        </Link>
        
        <p className="text-slate-600 text-sm mb-4">
          {description.length > 120 ? description.substring(0, 120) + '...' : description}
        </p>
        
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback 
              bgColor={categoryInfo.bgColor} 
              textColor={categoryInfo.textColor}
            >
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-sm font-medium text-slate-800">{user.username}</div>
            <div className="text-xs text-slate-500">{location.neighborhood || 'Local area'}</div>
          </div>
          <div className="ml-auto flex items-center text-slate-500 text-sm">
            <i className="fas fa-map-marker-alt mr-1 text-secondary"></i>
            <span>{distance} miles</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/request/${id}`}>
            <Button className="flex-1">
              Offer Help
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <i className="fas fa-bookmark"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
