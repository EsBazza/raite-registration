"use client";

import { useState } from "react";
import { Announcement } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pin, ExternalLink } from "lucide-react";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No announcements at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className={announcement.pinned ? "border-blue-200 bg-blue-50/50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {announcement.pinned && <Pin className="w-4 h-4 text-blue-500 fill-blue-500" />}
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              {announcement.pinned && <Badge variant="secondary">Pinned</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {announcement.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-md border">
                <img 
                  src={announcement.imageUrl} 
                  alt={announcement.title}
                  className="w-full h-auto object-cover max-h-[300px]"
                />
              </div>
            )}
            <div className={`text-sm text-gray-600 ${expandedId === announcement.id ? "" : "line-clamp-2"}`}>
              {announcement.content}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {announcement.content.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-blue-600 hover:bg-transparent hover:underline"
                  onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                >
                  {expandedId === announcement.id ? (
                    <span className="flex items-center gap-1">Show less <ChevronUp className="w-3 h-3" /></span>
                  ) : (
                    <span className="flex items-center gap-1">Read more <ChevronDown className="w-3 h-3" /></span>
                  )}
                </Button>
              )}
              
              {announcement.facebookUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  asChild
                >
                  <a href={announcement.facebookUrl} target="_blank" rel="noopener noreferrer">
                    See Post <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
