import React, {
  createContext,
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { z } from "zod";
import type { RealtimeChannel } from "@supabase/supabase-js";

//
// 1. Zod schema for validating raw Task rows from Supabase
//
const TaskDBSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  text: z.string(),
  color: z.string(),
  due_date: z.string(),
  completed: z.boolean(),
  inserted_at: z.string(),
  updated_at: z.string(),
});
type RawTask = z.infer<typeof TaskDBSchema>;

//
// 2. In-app Task type with Date objects
//
export type Task = {
  id: number;
  user_id: string;
  text: string;
  color: string;
  dueDate: Date;
  completed: boolean;
  insertedAt: Date;
  updatedAt: Date;
};

//
// 3. Context value interface
//
export interface TaskContextValue {
  user: { id: string; email: string } | null;
  tasks: Task[];
  loading: boolean;
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  addTask(text: string, color: string, dueDate: Date): Promise<void>;
  toggleTask(id: number): Promise<void>;
  deleteTask(id: number): Promise<void>;
  editTask(
    id: number,
    text: string,
    color: string,
    dueDate: Date,
  ): Promise<void>;
  reorderTasks(data: Task[]): void;
  fetchTasks(): Promise<void>;
}

export const TaskContext = createContext<TaskContextValue>(
  {} as TaskContextValue,
);

//
// 4. Utility: push completed tasks to the end
//
function reorderTasksAlg(list: Task[]): Task[] {
  return [...list].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
  );
}

//
// 5. Provider component
//
export const TaskProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  //
  // 5.1 Auth state
  //
  useEffect(() => {
    console.log("[TaskContext] Initializing auth listener");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[TaskContext] Existing session:", session);
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("[TaskContext] Auth state changed:", session);
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
        } else {
          setUser(null);
          setTasks([]);
        }
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  //
  // 5.2.1 Fetch tasks – extracted so it can be reused manually
  //
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      console.error("[TaskContext] fetchTasks error", error);
    } else if (data) {
      const parsed = (data as RawTask[]).map((raw) => {
        const v = TaskDBSchema.parse(raw);
        return {
          id: v.id,
          user_id: v.user_id,
          text: v.text,
          color: v.color,
          dueDate: new Date(v.due_date),
          completed: v.completed,
          insertedAt: new Date(v.inserted_at),
          updatedAt: new Date(v.updated_at),
        } as Task;
      });
      setTasks(reorderTasksAlg(parsed));
    }
    setLoading(false);
  }, [user]);

  //
  // 5.2 Fetch + realtime
  //
  useEffect(() => {
    console.log("[TaskContext] User effect triggered, user =", user);
    if (channel) {
      console.log("[TaskContext] Removing old channel");
      supabase.removeChannel(channel);
      setChannel(null);
    }

    if (!user) {
      console.log("[TaskContext] No user, skipping fetch");
      setLoading(false);
      return;
    }

    // fetch once for this user
    fetchTasks();

    // 5.2.2 Subscribe to realtime changes
    console.log("[TaskContext] Subscribing to realtime for user", user.id);
    const chan = supabase
      .channel(`tasks-user-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[TaskContext] Realtime payload:", payload);
          const { eventType, new: newRec, old: oldRec } = payload;

          if (eventType === "INSERT" && newRec) {
            try {
              const v = TaskDBSchema.parse(newRec as RawTask);
              const t: Task = {
                id: v.id,
                user_id: v.user_id,
                text: v.text,
                color: v.color,
                dueDate: new Date(v.due_date),
                completed: v.completed,
                insertedAt: new Date(v.inserted_at),
                updatedAt: new Date(v.updated_at),
              };

              // filter out any existing task with the same id, then append
              setTasks((old) =>
                reorderTasksAlg([...old.filter((x) => x.id !== t.id), t]),
              );
            } catch (e) {
              console.error("[TaskContext] INSERT parse error", e);
            }
          }

          if (eventType === "UPDATE" && newRec) {
            try {
              const v = TaskDBSchema.parse(newRec as RawTask);
              setTasks((old) =>
                reorderTasksAlg(
                  old.map((t) =>
                    t.id === v.id
                      ? {
                          id: v.id,
                          user_id: v.user_id,
                          text: v.text,
                          color: v.color,
                          dueDate: new Date(v.due_date),
                          completed: v.completed,
                          insertedAt: new Date(v.inserted_at),
                          updatedAt: new Date(v.updated_at),
                        }
                      : t,
                  ),
                ),
              );
            } catch (e) {
              console.error("[TaskContext] UPDATE parse error", e);
            }
          }

          if (eventType === "DELETE" && oldRec) {
            try {
              // Validate and parse the “old” record
              const v = TaskDBSchema.parse(oldRec as RawTask);
              // Remove the deleted task and reapply sorting
              setTasks((old) =>
                reorderTasksAlg(old.filter((t) => t.id !== v.id)),
              );
            } catch (e) {
              console.error("[TaskContext] DELETE parse error", e);
            }
          }
        },
      )
      .subscribe();

    setChannel(chan);

    return () => {
      console.log("[TaskContext] Unsubscribing channel");
      supabase.removeChannel(chan);
    };
  }, [user, fetchTasks]);

  //
  // 6. Auth helpers
  //
  const signUp = async (email: string, password: string) => {
    console.log("[TaskContext] signUp", email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("[TaskContext] signUp error", error);
      throw error;
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("[TaskContext] signIn", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("[TaskContext] signIn error", error);
      throw error;
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });
    }
  };

  const signOut = async () => {
    console.log("[TaskContext] signOut");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[TaskContext] signOut error", error);
      throw error;
    }
    setUser(null);
    setTasks([]);
  };

  //
  // 7. CRUD methods (with logs)
  //
  const addTask = async (text: string, color: string, dueDate: Date) => {
    console.log("[TaskContext] addTask", { text, color, dueDate });
    if (!user) {
      throw new Error("Not authenticated");
    }
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        text,
        color,
        due_date: dueDate.toISOString(),
      })
      .select("*")
      .single();
    console.log("[TaskContext] addTask result", { data, error });
    if (error) throw error;
    const v = TaskDBSchema.parse(data as RawTask);
    const newTask: Task = {
      id: v.id,
      user_id: v.user_id,
      text: v.text,
      color: v.color,
      dueDate: new Date(v.due_date),
      completed: v.completed,
      insertedAt: new Date(v.inserted_at),
      updatedAt: new Date(v.updated_at),
    };
    setTasks((old) => reorderTasksAlg([...old, newTask]));
  };

  const toggleTask = async (id: number) => {
    console.log("[TaskContext] toggleTask", id);
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: !t.completed })
      .eq("id", id)
      .select("*")
      .single();
    console.log("[TaskContext] toggleTask result", { data, error });
    if (error) throw error;
    const v = TaskDBSchema.parse(data as RawTask);
    setTasks((old) =>
      reorderTasksAlg(
        old.map((x) =>
          x.id === id
            ? {
                ...x,
                completed: v.completed,
                updatedAt: new Date(v.updated_at),
              }
            : x,
        ),
      ),
    );
  };

  const deleteTask = async (id: number) => {
    console.log("[TaskContext] deleteTask", id);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    console.log("[TaskContext] deleteTask error", error);
    if (error) throw error;
    setTasks((old) => old.filter((x) => x.id !== id));
  };

  const editTask = async (
    id: number,
    text: string,
    color: string,
    dueDate: Date,
  ) => {
    console.log("[TaskContext] editTask", { id, text, color, dueDate });
    const { data, error } = await supabase
      .from("tasks")
      .update({
        text,
        color,
        due_date: dueDate.toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    console.log("[TaskContext] editTask result", { data, error });
    if (error) throw error;
    const v = TaskDBSchema.parse(data as RawTask);
    setTasks((old) =>
      reorderTasksAlg(
        old.map((x) =>
          x.id === id
            ? {
                ...x,
                text: v.text,
                color: v.color,
                dueDate: new Date(v.due_date),
                updatedAt: new Date(v.updated_at),
              }
            : x,
        ),
      ),
    );
  };

  const reorderTasks = (data: Task[]) => {
    console.log("[TaskContext] reorderTasks", data);
    setTasks(reorderTasksAlg(data));
  };

  //
  // 8. Provide context
  //
  return (
    <TaskContext.Provider
      value={{
        user,
        tasks,
        loading,
        signUp,
        signIn,
        signOut,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        reorderTasks,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
