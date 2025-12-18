-- Create categories enum
CREATE TYPE public.problem_category AS ENUM ('education', 'technology', 'environment', 'social_impact', 'startups');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create problems table
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category problem_category NOT NULL,
  upvotes_count INTEGER DEFAULT 0 NOT NULL,
  solutions_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create solutions table
CREATE TABLE public.solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create upvotes table (for both problems and solutions)
CREATE TABLE public.upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT upvote_target CHECK (
    (problem_id IS NOT NULL AND solution_id IS NULL) OR
    (problem_id IS NULL AND solution_id IS NOT NULL)
  ),
  CONSTRAINT unique_problem_upvote UNIQUE (user_id, problem_id),
  CONSTRAINT unique_solution_upvote UNIQUE (user_id, solution_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Problems policies
CREATE POLICY "Problems are viewable by everyone" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create problems" ON public.problems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.problems FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own problems" ON public.problems FOR DELETE USING (auth.uid() = user_id);

-- Solutions policies
CREATE POLICY "Solutions are viewable by everyone" ON public.solutions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create solutions" ON public.solutions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own solutions" ON public.solutions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own solutions" ON public.solutions FOR DELETE USING (auth.uid() = user_id);

-- Upvotes policies
CREATE POLICY "Upvotes are viewable by everyone" ON public.upvotes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upvote" ON public.upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own upvotes" ON public.upvotes FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update problem upvotes count
CREATE OR REPLACE FUNCTION public.update_problem_upvotes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.problem_id IS NOT NULL THEN
    UPDATE public.problems SET upvotes_count = upvotes_count + 1 WHERE id = NEW.problem_id;
  ELSIF TG_OP = 'DELETE' AND OLD.problem_id IS NOT NULL THEN
    UPDATE public.problems SET upvotes_count = upvotes_count - 1 WHERE id = OLD.problem_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Function to update solution upvotes count
CREATE OR REPLACE FUNCTION public.update_solution_upvotes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.solution_id IS NOT NULL THEN
    UPDATE public.solutions SET upvotes_count = upvotes_count + 1 WHERE id = NEW.solution_id;
  ELSIF TG_OP = 'DELETE' AND OLD.solution_id IS NOT NULL THEN
    UPDATE public.solutions SET upvotes_count = upvotes_count - 1 WHERE id = OLD.solution_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Function to update solutions count on problem
CREATE OR REPLACE FUNCTION public.update_solutions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.problems SET solutions_count = solutions_count + 1 WHERE id = NEW.problem_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.problems SET solutions_count = solutions_count - 1 WHERE id = OLD.problem_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers for upvotes
CREATE TRIGGER on_upvote_change
  AFTER INSERT OR DELETE ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.update_problem_upvotes_count();

CREATE TRIGGER on_solution_upvote_change
  AFTER INSERT OR DELETE ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.update_solution_upvotes_count();

-- Trigger for solutions count
CREATE TRIGGER on_solution_change
  AFTER INSERT OR DELETE ON public.solutions
  FOR EACH ROW EXECUTE FUNCTION public.update_solutions_count();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON public.solutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();