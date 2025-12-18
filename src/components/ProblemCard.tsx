import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotesCount: number;
  solutionsCount: number;
  createdAt: string;
  authorName?: string;
}

const categoryColors: Record<string, string> = {
  education: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  technology: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  environment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  social_impact: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  startups: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const categoryLabels: Record<string, string> = {
  education: "Education",
  technology: "Technology",
  environment: "Environment",
  social_impact: "Social Impact",
  startups: "Startups",
};

export function ProblemCard({
  id,
  title,
  description,
  category,
  upvotesCount,
  solutionsCount,
  createdAt,
  authorName,
}: ProblemCardProps) {
  return (
    <Link to={`/problems/${id}`}>
      <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <Badge variant="secondary" className={categoryColors[category]}>
              {categoryLabels[category] || category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowUp className="h-4 w-4" />
              <span>{upvotesCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{solutionsCount} solutions</span>
            </div>
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
