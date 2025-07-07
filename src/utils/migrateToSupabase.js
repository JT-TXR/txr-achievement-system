import { supabase } from "../lib/supabase";

export async function migrateStudentsToSupabase() {
  try {
    // Get existing students from localStorage - check both possible keys
    let localStudents = JSON.parse(
      localStorage.getItem("vexLifetimeStudents") || "[]"
    );

    // Fallback to old key if needed
    if (localStudents.length === 0) {
      localStudents = JSON.parse(localStorage.getItem("vexStudents") || "[]");
    }

    if (localStudents.length === 0) {
      console.log("No students to migrate");
      return { success: true, migrated: 0 };
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Prepare students for insertion
    const studentsToInsert = localStudents.map((student) => ({
      name: student.name,
      email: student.email || null,
      grade: student.grade || null,
      lifetime_xp: student.lifetimeXP || 0,
      lifetime_level: student.lifetimeLevel || 1,
      session_xp: student.sessionXP || {},
      sessions_attended: student.sessionsAttended || [],
      enrolled_sessions: student.enrolledSessions || [],
      session_achievements: student.sessionAchievements || {},
      lifetime_achievements: student.lifetimeAchievements || [],
      avatar_style: student.avatarStyle || {},
      created_by: user.id,
    }));

    // Insert in batches of 10
    const batchSize = 10;
    let migrated = 0;

    for (let i = 0; i < studentsToInsert.length; i += batchSize) {
      const batch = studentsToInsert.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from("students")
        .insert(batch)
        .select();

      if (error) {
        console.error("Batch insert error:", error);
        throw error;
      }

      migrated += data.length;
      console.log(`Migrated ${migrated}/${studentsToInsert.length} students`);
    }

    // Backup localStorage data
    localStorage.setItem(
      "vexLifetimeStudents_backup",
      JSON.stringify(localStudents)
    );
    localStorage.setItem("vexStudents_migrated", new Date().toISOString());

    return {
      success: true,
      migrated,
      message: `Successfully migrated ${migrated} students to Supabase`,
    };
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
