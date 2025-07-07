import { supabase } from "./supabase";

// Fetch all sessions
export async function fetchSessions() {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("order_index");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

// Add a new session
export async function addSession(session) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          ...session,
          created_by: user.id,
          selected_days: session.selectedDays || [],
          class_dates: session.classDates || [],
          order_index: session.order || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding session:", error);
    throw error;
  }
}

// Update a session
export async function updateSession(id, updates) {
  try {
    const dbUpdates = {
      ...updates,
      selected_days: updates.selectedDays,
      class_dates: updates.classDates,
      order_index: updates.order,
    };

    // Remove camelCase fields
    delete dbUpdates.selectedDays;
    delete dbUpdates.classDates;
    delete dbUpdates.order;

    const { data, error } = await supabase
      .from("sessions")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
}

// Delete a session
export async function deleteSession(id) {
  try {
    const { error } = await supabase.from("sessions").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

// Subscribe to real-time changes
export function subscribeToSessions(callback) {
  const subscription = supabase
    .channel("sessions_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "sessions",
      },
      (payload) => {
        console.log("Session change received:", payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
}

// Convert database session to app format
export function dbSessionToApp(dbSession) {
  return {
    id: dbSession.id,
    name: dbSession.name,
    type: dbSession.type,
    startDate: dbSession.start_date,
    endDate: dbSession.end_date,
    isActive: dbSession.is_active,
    order: dbSession.order_index,
    scheduleType: dbSession.schedule_type,
    selectedDays: dbSession.selected_days || [],
    classDates: dbSession.class_dates || [],
    createdAt: dbSession.created_at,
  };
}
