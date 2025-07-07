import { supabase } from "./supabase";

// Create a new tournament
export async function createTournament(tournament) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("tournaments")
      .insert([
        {
          ...tournament,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
}

// Register teams for tournament
export async function registerTeamsForTournament(tournamentId, teamIds) {
  try {
    const registrations = teamIds.map((teamId, index) => ({
      tournament_id: tournamentId,
      team_id: teamId,
      registration_number: `T${index + 1}`,
    }));

    const { data, error } = await supabase
      .from("tournament_teams")
      .insert(registrations)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error registering teams:", error);
    throw error;
  }
}

// Record a match
export async function recordMatch(match) {
  try {
    const { data, error } = await supabase
      .from("matches")
      .insert([match])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording match:", error);
    throw error;
  }
}

// Update match scores
export async function updateMatchScores(matchId, redScore, blueScore) {
  try {
    const { data, error } = await supabase
      .from("matches")
      .update({
        red_score: redScore,
        blue_score: blueScore,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
}

// Record skills score
export async function recordSkillsScore(score) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("skills_scores")
      .insert([
        {
          ...score,
          recorded_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording skills score:", error);
    throw error;
  }
}

// Get tournament details with all related data
export async function getTournamentDetails(tournamentId) {
  try {
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single();

    if (tournamentError) throw tournamentError;

    // Get teams
    const { data: teams } = await supabase
      .from("tournament_teams")
      .select("*, teams(*, team_members(*, students(*)))")
      .eq("tournament_id", tournamentId);

    // Get matches
    const { data: matches } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("match_number");

    // Get skills scores
    const { data: skills } = await supabase
      .from("skills_scores")
      .select("*, teams(*), students(*)")
      .eq("tournament_id", tournamentId)
      .order("score", { ascending: false });

    return {
      ...tournament,
      teams: teams || [],
      matches: matches || [],
      skills: skills || [],
    };
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    throw error;
  }
}

// Complete tournament
export async function completeTournament(tournamentId, results) {
  try {
    const { data, error } = await supabase
      .from("tournaments")
      .update({
        status: "completed",
        results: results,
        completed_at: new Date().toISOString(),
      })
      .eq("id", tournamentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error completing tournament:", error);
    throw error;
  }
}
