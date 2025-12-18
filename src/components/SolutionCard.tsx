import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SolutionCardProps {
  id: string;
  content: string;
  upvotesCount: number;
  createdAt: string;
  authorName?: string;
  hasUpvoted?: boolean;
  onUpvote?: () => void;
  isTopSolution?: boolean;
  isAuthenticated?: boolean;
}

export function SolutionCard({
  content,
  upvotesCount,
  createdAt,
  authorName,
  hasUpvoted,
  onUpvote,
  isTopSolution,
  isAuthenticated,
}: SolutionCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200",
      isTopSolution && "ring-2 ring-primary/50 bg-primary/5"
    )}>
      {isTopSolution && (
        <div className="px-4 py-2 border-b border-border bg-primary/10">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            ⭐ Top Solution
          </span>
        </div>
      )}
      <CardContent className="pt-4">
        <p className="text-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
            <User className="h-3 w-3" />
          </div>
          <span>{authorName || "Anonymous"}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
        <Button
          variant={hasUpvoted ? "default" : "outline"}
          size="sm"
          onClick={onUpvote}
          disabled={!isAuthenticated}
          className={cn(
            "gap-1",
            hasUpvoted && "bg-primary text-primary-foreground"
          )}
        >
          <ArrowUp className="h-4 w-4" />
          <span>{upvotesCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
