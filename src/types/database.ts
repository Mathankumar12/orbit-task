export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskStatus = 'inbox' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';
export type AppTheme = 'light' | 'dark' | 'system';
export type AppDensity = 'comfortable' | 'compact';
export type AppAccent = 'indigo' | 'blue' | 'emerald' | 'violet' | 'rose' | 'amber';
export type DefaultView = 'today' | 'tasks' | 'board' | 'checklists' | 'notes';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          theme: AppTheme;
          density: AppDensity;
          accent: AppAccent;
          default_view: DefaultView;
          sidebar_collapsed: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: AppTheme;
          density?: AppDensity;
          accent?: AppAccent;
          default_view?: DefaultView;
          sidebar_collapsed?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: AppTheme;
          density?: AppDensity;
          accent?: AppAccent;
          default_view?: DefaultView;
          sidebar_collapsed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          parent_task_id: string | null;
          title: string;
          description: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          due_at: string | null;
          position: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          created_by: string;
          parent_task_id?: string | null;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          position?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          created_by?: string;
          parent_task_id?: string | null;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          position?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      task_tags: {
        Row: {
          task_id: string;
          tag_id: string;
        };
        Insert: {
          task_id: string;
          tag_id: string;
        };
        Update: {
          task_id?: string;
          tag_id?: string;
        };
        Relationships: [];
      };
      checklists: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          title: string;
          description: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          created_by?: string;
          title?: string;
          description?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      checklist_items: {
        Row: {
          id: string;
          checklist_id: string;
          title: string;
          is_checked: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          checklist_id: string;
          title: string;
          is_checked?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          checklist_id?: string;
          title?: string;
          is_checked?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          title: string;
          content: string;
          linked_task_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          created_by: string;
          title: string;
          content?: string;
          linked_task_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          created_by?: string;
          title?: string;
          content?: string;
          linked_task_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Task = Database['public']['Tables']['tasks']['Row'];
export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type Checklist = Database['public']['Tables']['checklists']['Row'];
export type ChecklistItem = Database['public']['Tables']['checklist_items']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
