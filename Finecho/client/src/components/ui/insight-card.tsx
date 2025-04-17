import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface InsightCardProps {
  type: "warning" | "success";
  title: string;
  description: string;
  actionText?: string;
}

const InsightCard = ({ type, title, description, actionText }: InsightCardProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            {type === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          {actionText && (
            <div className="flex justify-end">
              <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                {actionText}
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
