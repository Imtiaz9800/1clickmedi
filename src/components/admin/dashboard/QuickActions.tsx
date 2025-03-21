
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  isMobile: boolean;
}

interface QuickActionsProps {
  actions: QuickActionProps[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link to={action.link} key={index}>
            <Button
              className={`w-full justify-start gap-2 ${action.color}`}
            >
              {action.icon}
              <span className={action.isMobile ? "hidden" : "block"}>{action.title}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
