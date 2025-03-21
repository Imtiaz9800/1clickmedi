
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UserCheck, Store, CalendarDays } from "lucide-react";

const ActivityLog: React.FC = () => {
  const activities = [
    {
      icon: <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />,
      title: "New doctor added",
      time: "30 minutes ago",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: <Store className="h-4 w-4 text-green-600 dark:text-green-300" />,
      title: "Medical shop updated",
      time: "2 hours ago",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-300" />,
      title: "3 New contact messages",
      time: "Yesterday",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
        Recent Activity
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`${activity.bgColor} p-2 rounded-full`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
