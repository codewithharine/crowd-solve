import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Menu, X, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Lightbulb className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CrowdSolve</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/problems"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore Problems
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Button asChild variant="default" size="sm">
                  <Link to="/submit">
                    <Plus className="mr-1 h-4 w-4" />
                    Post Problem
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                to="/problems"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Problems
              </Link>
              <Link
                to="/about"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="my-2 border-t border-border" />
              {user ? (
                <>
                  <Button asChild variant="default" size="sm" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/submit">
                      <Plus className="mr-1 h-4 w-4" />
                      Post Problem
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                    <LogOut className="mr-1 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild variant="default" size="sm" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth?mode=signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
