import { supabase } from "../lib/supabase";

export async function migrateSessionsToSupabase() {
  try {
    // Get existing sessions from localStorage
    const localSessions = JSON.parse(
      localStorage.getItem("vexSessions") || "[]"
    );

    if (localSessions.length === 0) {
      console.log("No sessions to migrate");
      return { success: true, migrated: 0 };
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Prepare sessions for insertion
    const sessionsToInsert = localSessions.map((session, index) => ({
      name: session.name,
      type: session.type || "general",
      start_date: session.startDate
        ? new Date(session.startDate).toISOString().split("T")[0]
        : null,
      end_date: session.endDate
        ? new Date(session.endDate).toISOString().split("T")[0]
        : null,
      is_active: session.isActive !== false, // Default to true
      order_index: session.order || index,
      schedule_type: session.scheduleType || null,
      selected_days: session.selectedDays || [],
      class_dates: session.classDates || [],
      created_by: user.id,
    }));

    // Insert all sessions
    const { data, error } = await supabase
      .from("sessions")
      .insert(sessionsToInsert)
      .select();

    if (error) throw error;

    // Backup localStorage data
    localStorage.setItem("vexSessions_backup", JSON.stringify(localSessions));
    localStorage.setItem("vexSessions_migrated", new Date().toISOString());

    return {
      success: true,
      migrated: data.length,
      message: `Successfully migrated ${data.length} sessions to Supabase`,
    };
  } catch (error) {
    console.error("Session migration error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
