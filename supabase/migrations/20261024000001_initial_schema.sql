-- ==============================================================================
-- Orbit-Task: Initial Database Schema with Complete Row Level Security (RLS)
-- Fully idempotent: can be safely re-run multiple times in Supabase SQL Editor
-- ==============================================================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workspaces" ON public.workspaces;
CREATE POLICY "Users can read own workspaces"
  ON public.workspaces FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own workspaces" ON public.workspaces;
CREATE POLICY "Users can insert own workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own workspaces" ON public.workspaces;
CREATE POLICY "Users can update own workspaces"
  ON public.workspaces FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own workspaces" ON public.workspaces;
CREATE POLICY "Users can delete own workspaces"
  ON public.workspaces FOR DELETE
  USING (auth.uid() = owner_id);


-- 3. User Preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  density TEXT NOT NULL DEFAULT 'comfortable' CHECK (density IN ('comfortable', 'compact')),
  accent TEXT NOT NULL DEFAULT 'indigo' CHECK (accent IN ('indigo', 'blue', 'emerald', 'violet', 'rose', 'amber')),
  default_view TEXT NOT NULL DEFAULT 'today' CHECK (default_view IN ('today', 'tasks', 'board', 'checklists', 'notes')),
  sidebar_collapsed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own preferences" ON public.user_preferences;
CREATE POLICY "Users can read own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 4. Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 500),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inbox' CHECK (status IN ('inbox', 'todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'none' CHECK (priority IN ('none', 'low', 'medium', 'high')),
  due_at TIMESTAMPTZ,
  position NUMERIC NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tasks_workspace_status ON public.tasks(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_due ON public.tasks(workspace_id, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_created ON public.tasks(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON public.tasks(parent_task_id);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks in own workspaces" ON public.tasks;
CREATE POLICY "Users can view tasks in own workspaces"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert tasks in own workspaces" ON public.tasks;
CREATE POLICY "Users can insert tasks in own workspaces"
  ON public.tasks FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tasks in own workspaces" ON public.tasks;
CREATE POLICY "Users can update tasks in own workspaces"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tasks in own workspaces" ON public.tasks;
CREATE POLICY "Users can delete tasks in own workspaces"
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );


-- 5. Tags and Task Tags tables
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 50),
  color TEXT NOT NULL DEFAULT 'slate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(workspace_id, name)
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage tags in own workspaces" ON public.tags;
CREATE POLICY "Users can manage tags in own workspaces"
  ON public.tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = tags.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.task_tags (
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage task_tags via task ownership" ON public.task_tags;
CREATE POLICY "Users can manage task_tags via task ownership"
  ON public.task_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.workspaces ON workspaces.id = tasks.workspace_id
      WHERE tasks.id = task_tags.task_id
      AND workspaces.owner_id = auth.uid()
    )
  );


-- 6. Checklists and Checklist Items tables
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 255),
  description TEXT,
  position NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage checklists in own workspaces" ON public.checklists;
CREATE POLICY "Users can manage checklists in own workspaces"
  ON public.checklists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = checklists.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 500),
  is_checked BOOLEAN NOT NULL DEFAULT false,
  position NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage items in own checklists" ON public.checklist_items;
CREATE POLICY "Users can manage items in own checklists"
  ON public.checklist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.checklists
      JOIN public.workspaces ON workspaces.id = checklists.workspace_id
      WHERE checklists.id = checklist_items.checklist_id
      AND workspaces.owner_id = auth.uid()
    )
  );


-- 7. Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 255),
  content TEXT NOT NULL DEFAULT '',
  linked_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage notes in own workspaces" ON public.notes;
CREATE POLICY "Users can manage notes in own workspaces"
  ON public.notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = notes.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );


-- ==============================================================================
-- 8. Automatic Provisioning Trigger on User Signup
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID := gen_random_uuid();
  user_name TEXT;
BEGIN
  -- Determine display name from metadata or email
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );

  -- 1. Create Profile
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, user_name)
  ON CONFLICT (id) DO NOTHING;

  -- 2. Create Default Workspace
  INSERT INTO public.workspaces (id, owner_id, name)
  VALUES (new_workspace_id, NEW.id, 'Personal Workspace');

  -- 3. Create Default User Preferences
  INSERT INTO public.user_preferences (user_id, theme, density, accent, default_view, sidebar_collapsed)
  VALUES (NEW.id, 'system', 'comfortable', 'indigo', 'today', false)
  ON CONFLICT (user_id) DO NOTHING;

  -- 4. Create Starter Welcome Task
  INSERT INTO public.tasks (workspace_id, created_by, title, description, status, priority, position)
  VALUES (
    new_workspace_id,
    NEW.id,
    'Welcome to Orbit-Task! 🚀',
    'Get started by creating your first task, exploring the Board view, or tailoring your theme in Settings.',
    'inbox',
    'medium',
    0
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
