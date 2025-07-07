import { supabase } from "./supabase";

// Create a new team
export async function createTeam(team) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("teams")
      .insert([
        {
          ...team,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
}

// Add members to team
export async function addTeamMembers(teamId, studentIds) {
  try {
    const members = studentIds.map((studentId) => ({
      team_id: teamId,
      student_id: studentId,
    }));

    const { data, error } = await supabase
      .from("team_members")
      .insert(members)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding team members:", error);
    throw error;
  }
}

// Get teams for a session
export async function getSessionTeams(sessionId) {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        team_members (
          *,
          students (*)
        )
      `
      )
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .order("number");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Update team
export async function updateTeam(teamId, updates) {
  try {
    const { data, error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}

// Remove team member
export async function removeTeamMember(teamId, studentId) {
  try {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("student_id", studentId);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing team member:", error);
    throw error;
  }
}

// Subscribe to team changes
export function subscribeToTeams(sessionId, callback) {
  const subscription = supabase
    .channel(`teams_${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "teams",
        filter: `session_id=eq.${sessionId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}
