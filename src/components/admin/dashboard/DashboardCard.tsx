
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  index?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  description,
  icon,
  link,
  color,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={link}>
        <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${color} border border-gray-200 dark:border-gray-700`}>
          <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">
                  {title}
                </CardTitle>
                <CardDescription>
                  {description}
                </CardDescription>
              </div>
              <div className="rounded-md p-2">
                {icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{count}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-xs inline-flex items-center font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              View Details
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default DashboardCard;
