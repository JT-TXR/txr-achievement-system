import { supabase } from "./supabase";

// Fetch all students
export async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

// Add a new student
export async function addStudent(student) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          ...student,
          created_by: user.id,
          lifetime_xp: student.lifetimeXP || 0,
          lifetime_level: student.lifetimeLevel || 1,
          session_xp: student.sessionXP || {},
          sessions_attended: student.sessionsAttended || [],
          enrolled_sessions: student.enrolledSessions || [],
          session_achievements: student.sessionAchievements || {},
          lifetime_achievements: student.lifetimeAchievements || [],
          avatar_style: student.avatarStyle || {},
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

// Update a student
export async function updateStudent(id, updates) {
  try {
    // Convert camelCase to snake_case for database
    const dbUpdates = {};

    if (updates.lifetimeXP !== undefined)
      dbUpdates.lifetime_xp = updates.lifetimeXP;
    if (updates.lifetimeLevel !== undefined)
      dbUpdates.lifetime_level = updates.lifetimeLevel;
    if (updates.sessionXP !== undefined)
      dbUpdates.session_xp = updates.sessionXP;
    if (updates.sessionsAttended !== undefined)
      dbUpdates.sessions_attended = updates.sessionsAttended;
    if (updates.enrolledSessions !== undefined)
      dbUpdates.enrolled_sessions = updates.enrolledSessions;
    if (updates.sessionAchievements !== undefined)
      dbUpdates.session_achievements = updates.sessionAchievements;
    if (updates.lifetimeAchievements !== undefined)
      dbUpdates.lifetime_achievements = updates.lifetimeAchievements;
    if (updates.avatarStyle !== undefined)
      dbUpdates.avatar_style = updates.avatarStyle;

    // Keep simple fields as-is
    ["name", "email", "grade"].forEach((field) => {
      if (updates[field] !== undefined) dbUpdates[field] = updates[field];
    });

    const { data, error } = await supabase
      .from("students")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

// Delete a student
export async function deleteStudent(id) {
  try {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

// Subscribe to real-time changes
export function subscribeToStudents(callback) {
  const subscription = supabase
    .channel("students_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "students",
      },
      (payload) => {
        console.log("Student change received:", payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
}

// Convert database student to app format
export function dbStudentToApp(dbStudent) {
  return {
    id: dbStudent.id,
    name: dbStudent.name,
    email: dbStudent.email,
    grade: dbStudent.grade,
    lifetimeXP: dbStudent.lifetime_xp,
    lifetimeLevel: dbStudent.lifetime_level,
    sessionXP: dbStudent.session_xp || {},
    sessionsAttended: dbStudent.sessions_attended || [],
    enrolledSessions: dbStudent.enrolled_sessions || [],
    sessionAchievements: dbStudent.session_achievements || {},
    lifetimeAchievements: dbStudent.lifetime_achievements || [],
    avatarStyle: dbStudent.avatar_style || {},
  };
}
