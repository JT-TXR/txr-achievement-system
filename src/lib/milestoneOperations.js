import { supabase } from "./supabase";

// Record milestone achievement
export async function recordMilestone(
  studentId,
  sessionId,
  milestoneKey,
  xpAwarded
) {
  try {
    const { data, error } = await supabase
      .from("student_milestones")
      .insert([
        {
          student_id: studentId,
          session_id: sessionId,
          milestone_key: milestoneKey,
          date_earned: new Date().toISOString().split("T")[0],
          xp_awarded: xpAwarded,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording milestone:", error);
    throw error;
  }
}

// Get student milestones
export async function getStudentMilestones(studentId, sessionId = null) {
  try {
    let query = supabase
      .from("student_milestones")
      .select("*, sessions(*)")
      .eq("student_id", studentId)
      .order("date_earned", { ascending: false });

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return [];
  }
}

// Check if milestone already earned
export async function hasMilestone(studentId, sessionId, milestoneKey) {
  try {
    const { data, error } = await supabase
      .from("student_milestones")
      .select("id")
      .eq("student_id", studentId)
      .eq("session_id", sessionId)
      .eq("milestone_key", milestoneKey)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
    return !!data;
  } catch (error) {
    console.error("Error checking milestone:", error);
    return false;
  }
}
