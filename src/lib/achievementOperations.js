import { supabase } from "./supabase";

// Fetch all achievements
export async function fetchAchievements() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_active", true)
      .order("type", { ascending: true })
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

// Create a new achievement
export async function createAchievement(achievement) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("achievements")
      .insert([
        {
          ...achievement,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }
}

// Award achievement to student
export async function awardAchievementToStudent(
  studentId,
  achievementId,
  sessionId,
  xpAwarded
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("student_achievements")
      .insert([
        {
          student_id: studentId,
          achievement_id: achievementId,
          session_id: sessionId,
          xp_awarded: xpAwarded,
          awarded_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error awarding achievement:", error);
    throw error;
  }
}

// Get student achievements
export async function getStudentAchievements(studentId) {
  try {
    const { data, error } = await supabase
      .from("student_achievements")
      .select("*, achievements(*), sessions(*)")
      .eq("student_id", studentId)
      .order("date_earned", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching student achievements:", error);
    return [];
  }
}

// Subscribe to achievement changes
export function subscribeToAchievements(callback) {
  const subscription = supabase
    .channel("achievements_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "achievements" },
      callback
    )
    .subscribe();

  return subscription;
}
