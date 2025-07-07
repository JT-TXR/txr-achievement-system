import { supabase } from "./supabase";

// Mark attendance for a student
export async function markAttendance(
  studentId,
  sessionId,
  date,
  status,
  notes = ""
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("attendance")
      .upsert([
        {
          student_id: studentId,
          session_id: sessionId,
          date: date,
          status: status,
          notes: notes,
          marked_by: user.id,
          marked_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
}

// Get attendance for a specific date and session
export async function getAttendanceForDate(sessionId, date) {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*, students(*)")
      .eq("session_id", sessionId)
      .eq("date", date);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
}

// Get attendance history for a student
export async function getStudentAttendanceHistory(studentId, sessionId = null) {
  try {
    let query = supabase
      .from("attendance")
      .select("*, sessions(*)")
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }
}

// Get attendance summary for a session
export async function getSessionAttendanceSummary(
  sessionId,
  startDate,
  endDate
) {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("session_id", sessionId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    // Calculate summary
    const summary = {
      total: data.length,
      present: data.filter((a) => a.status === "present").length,
      absent: data.filter((a) => a.status === "absent").length,
      late: data.filter((a) => a.status === "late").length,
      excused: data.filter((a) => a.status === "excused").length,
    };

    return { records: data, summary };
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return { records: [], summary: {} };
  }
}

// Subscribe to attendance changes
export function subscribeToAttendance(sessionId, callback) {
  const subscription = supabase
    .channel(`attendance_${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "attendance",
        filter: `session_id=eq.${sessionId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}
