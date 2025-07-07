import { supabase } from "./supabase";

// Enroll a student in a session
export async function enrollStudent(
  studentId,
  sessionId,
  enrollmentType = "regular"
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("enrollments")
      .insert([
        {
          student_id: studentId,
          session_id: sessionId,
          enrollment_type: enrollmentType,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error enrolling student:", error);
    throw error;
  }
}

// Unenroll a student from a session
export async function unenrollStudent(studentId, sessionId) {
  try {
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("student_id", studentId)
      .eq("session_id", sessionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error unenrolling student:", error);
    throw error;
  }
}

// Get all enrollments for a session
export async function getSessionEnrollments(sessionId) {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, students(*)")
      .eq("session_id", sessionId)
      .order("enrolled_at");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }
}

// Get all sessions a student is enrolled in
export async function getStudentEnrollments(studentId) {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, sessions(*)")
      .eq("student_id", studentId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    return [];
  }
}

// Subscribe to enrollment changes
export function subscribeToEnrollments(callback) {
  const subscription = supabase
    .channel("enrollments_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "enrollments" },
      callback
    )
    .subscribe();

  return subscription;
}
