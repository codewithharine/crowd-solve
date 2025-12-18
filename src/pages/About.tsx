import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Users, Globe, Zap, Heart, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(270_70%_55%/0.1),transparent_50%)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              About <span className="text-gradient">CrowdSolve</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Empowering communities to solve the world's toughest challenges through
              collective intelligence and open innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              Our Mission
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              CrowdSolve was built on a simple yet powerful idea: the best solutions to complex
              problems often come from unexpected places. By bringing together diverse minds from
              around the world, we create an environment where innovative ideas can flourish.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're tackling challenges in education, technology, environmental
              sustainability, social impact, or building the next great startup, our community
              is here to help you find and refine solutions that make a real difference.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            Our Values
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Open Participation</h3>
                <p className="text-sm text-muted-foreground">
                  Everyone has valuable insights. We welcome contributions from all backgrounds.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Great solutions emerge when people work together and build on each other's ideas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We encourage creative thinking and unconventional approaches to problem-solving.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Every problem solved is a step toward making the world a better place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
              The Open Innovation Philosophy
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Share Challenges</h3>
                  <p className="text-muted-foreground">
                    Post problems that matter to you, your organization, or your community.
                    The more context you provide, the better solutions you'll receive.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Crowdsource Solutions</h3>
                  <p className="text-muted-foreground">
                    Our diverse community brings fresh perspectives from different industries,
                    backgrounds, and expertise areas to tackle your challenges.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Vote & Refine</h3>
                  <p className="text-muted-foreground">
                    The community upvotes the most promising solutions, helping the best
                    ideas rise to the top through collective wisdom.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  4
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Take Action</h3>
                  <p className="text-muted-foreground">
                    Implement the solutions that work best for your situation and share
                    your results back with the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow mb-6">
            <Lightbulb className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Join the Movement
          </h2>
          <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
            Whether you have a problem to share or solutions to offer, your contribution
            matters. Together, we can solve challenges that no one can tackle alone.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/auth?mode=signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/problems">Explore Problems</Link>
            </Button>
          </div>
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
