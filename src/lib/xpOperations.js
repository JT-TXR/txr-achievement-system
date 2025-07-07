import { supabase } from "./supabase";

// Record daily XP awards
export async function recordDailyXP(
  studentId,
  sessionId,
  date,
  awards,
  totalXP,
  notes = ""
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("daily_xp_tracking")
      .upsert([
        {
          student_id: studentId,
          session_id: sessionId,
          date: date,
          awards: awards,
          total_xp: totalXP,
          notes: notes,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording daily XP:", error);
    throw error;
  }
}

// Get XP history for a student
export async function getStudentXPHistory(studentId, sessionId = null) {
  try {
    let query = supabase
      .from("daily_xp_tracking")
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
    console.error("Error fetching XP history:", error);
    return [];
  }
}

// Get XP summary for a session
export async function getSessionXPSummary(sessionId) {
  try {
    const { data, error } = await supabase
      .from("daily_xp_tracking")
      .select("student_id, total_xp")
      .eq("session_id", sessionId);

    if (error) throw error;

    // Calculate totals per student
    const summary = data.reduce((acc, record) => {
      if (!acc[record.student_id]) {
        acc[record.student_id] = 0;
      }
      acc[record.student_id] += record.total_xp;
      return acc;
    }, {});

    return summary;
  } catch (error) {
    console.error("Error fetching XP summary:", error);
    return {};
  }
}

// Subscribe to XP updates
export function subscribeToXPTracking(studentId, callback) {
  const subscription = supabase
    .channel(`xp_${studentId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "daily_xp_tracking",
        filter: `student_id=eq.${studentId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}
