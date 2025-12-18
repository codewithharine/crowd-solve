import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ProblemCard } from "@/components/ProblemCard";
import { Lightbulb, Users, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const { data: featuredProblems } = useQuery({
    queryKey: ["featured-problems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .order("upvotes_count", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(270_70%_55%/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(280_80%_60%/0.1),transparent_50%)]" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Open Innovation Platform</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Solve Real Problems{" "}
              <span className="text-gradient">Together</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              CrowdSolve brings together diverse minds to tackle challenges in education, 
              technology, environment, and beyond. Post a problem, share solutions, 
              and vote on the best ideas.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/submit">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Post a Problem
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/problems">
                  Explore Problems
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            How It Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <Lightbulb className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">1. Post</h3>
              <p className="text-muted-foreground">
                Share a real-world problem you want the community to help solve
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">2. Solve</h3>
              <p className="text-muted-foreground">
                Community members submit creative solutions and collaborate on ideas
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">3. Vote</h3>
              <p className="text-muted-foreground">
                Upvote the best solutions to surface the most impactful ideas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      {featuredProblems && featuredProblems.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Featured Problems
              </h2>
              <Button asChild variant="ghost">
                <Link to="/problems">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProblems.map((problem) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Ready to Make an Impact?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of innovators solving real-world challenges together.
          </p>
          <Button asChild size="lg">
            <Link to="/auth?mode=signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Lightbulb className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CrowdSolve</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CrowdSolve. Built for open innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
