import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProblemCard } from "@/components/ProblemCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "environment", label: "Environment" },
  { value: "social_impact", label: "Social Impact" },
  { value: "startups", label: "Startups" },
];

export default function Problems() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  const { data: problems, isLoading } = useQuery({
    queryKey: ["problems", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("problems")
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as "education" | "technology" | "environment" | "social_impact" | "startups");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Explore Problems
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover challenges from across the community and contribute your solutions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {user && (
            <Button asChild>
              <Link to="/submit">
                <Lightbulb className="mr-2 h-4 w-4" />
                Post a Problem
              </Link>
            </Button>
          )}
        </div>

        {/* Problems Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : problems && problems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                id={problem.id}
                title={problem.title}
                description={problem.description}
                category={problem.category}
                upvotesCount={problem.upvotes_count}
                solutionsCount={problem.solutions_count}
                createdAt={problem.created_at}
                authorName={problem.profiles?.display_name}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No problems found"
            description={
              selectedCategory !== "all"
                ? "No problems in this category yet. Be the first to post one!"
                : "No problems have been posted yet. Be the first to share a challenge!"
            }
            action={
              user ? (
                <Button asChild>
                  <Link to="/submit">Post the First Problem</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth?mode=signup">Sign Up to Post</Link>
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
