import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SolutionCard } from "@/components/SolutionCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowUp, MessageSquare, User, Loader2, Lightbulb } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const categoryLabels: Record<string, string> = {
  education: "Education",
  technology: "Technology",
  environment: "Environment",
  social_impact: "Social Impact",
  startups: "Startups",
};

const categoryColors: Record<string, string> = {
  education: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  technology: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  environment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  social_impact: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  startups: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newSolution, setNewSolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: problem, isLoading: problemLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: solutions, isLoading: solutionsLoading } = useQuery({
    queryKey: ["solutions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solutions")
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .eq("problem_id", id)
        .order("upvotes_count", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: userUpvotes } = useQuery({
    queryKey: ["user-upvotes", id, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("upvotes")
        .select("solution_id, problem_id")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const submitSolution = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from("solutions")
        .insert({
          problem_id: id,
          user_id: user.id,
          content,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions", id] });
      queryClient.invalidateQueries({ queryKey: ["problem", id] });
      setNewSolution("");
      toast({
        title: "Solution submitted!",
        description: "Your solution has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleUpvote = useMutation({
    mutationFn: async ({ solutionId, hasUpvoted }: { solutionId: string; hasUpvoted: boolean }) => {
      if (!user) throw new Error("Must be logged in");
      
      if (hasUpvoted) {
        const { error } = await supabase
          .from("upvotes")
          .delete()
          .eq("user_id", user.id)
          .eq("solution_id", solutionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("upvotes")
          .insert({
            user_id: user.id,
            solution_id: solutionId,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions", id] });
      queryClient.invalidateQueries({ queryKey: ["user-upvotes", id, user?.id] });
    },
  });

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSolution.trim()) return;
    
    setIsSubmitting(true);
    await submitSolution.mutateAsync(newSolution.trim());
    setIsSubmitting(false);
  };

  if (problemLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={Lightbulb}
            title="Problem not found"
            description="This problem may have been removed or doesn't exist."
            action={
              <Button asChild>
                <Link to="/problems">Browse Problems</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const hasUpvotedProblem = userUpvotes?.some((u) => u.problem_id === id);
  const topSolutionId = solutions?.[0]?.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/problems"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to problems
        </Link>

        {/* Problem Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <Badge variant="secondary" className={categoryColors[problem.category]}>
                {categoryLabels[problem.category] || problem.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  {problem.upvotes_count} upvotes
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {problem.solutions_count} solutions
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{problem.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                <User className="h-3 w-3" />
              </div>
              <span>{problem.profiles?.display_name || "Anonymous"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {problem.description}
            </p>
          </CardContent>
        </Card>

        {/* Submit Solution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Submit Your Solution</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <form onSubmit={handleSubmitSolution}>
                <Textarea
                  placeholder="Share your solution to this problem..."
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="mb-4 min-h-[120px]"
                />
                <Button type="submit" disabled={isSubmitting || !newSolution.trim()}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Solution
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  You need to be signed in to submit a solution.
                </p>
                <Button asChild>
                  <Link to="/auth">Sign In to Contribute</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solutions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Solutions ({solutions?.length || 0})
          </h2>
          
          {solutionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : solutions && solutions.length > 0 ? (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  id={solution.id}
                  content={solution.content}
                  upvotesCount={solution.upvotes_count}
                  createdAt={solution.created_at}
                  authorName={solution.profiles?.display_name}
                  hasUpvoted={userUpvotes?.some((u) => u.solution_id === solution.id)}
                  onUpvote={() =>
                    toggleUpvote.mutate({
                      solutionId: solution.id,
                      hasUpvoted: userUpvotes?.some((u) => u.solution_id === solution.id) || false,
                    })
                  }
                  isTopSolution={solution.id === topSolutionId && solution.upvotes_count > 0}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No solutions yet"
              description="Be the first to contribute a solution to this problem!"
            />
          )}
        </div>
      </div>
    </div>
  );
}
