import React, { useMemo } from "react";
import BadgeDisplay, { BadgeGallery } from "./BadgeDisplay";

const StudentBadgeView = ({
  student,
  currentSession,
  dailyXPTracking,
  sessions,
  attendance,
  studentMilestones,
  achievements,
  teams,
  tournaments,
}) => {
  // Define all badge types based on TXR Achievement System
  const badges = useMemo(
    () => ({
      daily: [
        {
          id: "speed-builder",
          name: "Speed Builder",
          icon: "⚡",
          type: "daily",
          criteria: "Finish build under time limit",
        },
        {
          id: "debugging-pro",
          name: "Debugging Pro",
          icon: "🔍",
          type: "daily",
          criteria: "Solve a tough code/hardware issue",
        },
        {
          id: "team-helper",
          name: "Team Helper",
          icon: "🤝",
          type: "daily",
          criteria: "Help 3+ classmates in a session",
        },
        {
          id: "clean-workspace-badge",
          name: "Clean Workspace",
          icon: "🧹",
          type: "daily",
          criteria: "Win Clean-Up Champion 3×",
        },
        {
          id: "early-bird-badge",
          name: "Early Bird",
          icon: "🐦",
          type: "daily",
          criteria: "First to arrive 3+ times in a session",
        },
        {
          id: "notebook-star",
          name: "Notebook Star",
          icon: "📓",
          type: "daily",
          criteria: "Earn Notebook Documentation 3×",
        },
      ],

      session: [
        {
          id: "session-complete",
          name: "Session Complete",
          icon: "✅",
          type: "session",
          criteria: "Finish all tasks in a session",
        },
        {
          id: "perfect-attendance",
          name: "Perfect Attendance",
          icon: "📅",
          type: "session",
          criteria: "Attend all days in session",
        },
        {
          id: "ultimate-collaborator",
          name: "Ultimate Collaborator",
          icon: "👥",
          type: "session",
          criteria: "Earn Collaboration 3× in a session",
        },
        {
          id: "session-champion",
          name: "Session Champion",
          icon: "🏆",
          type: "session",
          criteria: "Earn 100+ session XP",
        },
      ],

      lifetime: [
        {
          id: "first-robot",
          name: "First Robot",
          icon: "🤖",
          type: "lifetime",
          criteria: "Complete first Robot Build",
        },
        {
          id: "first-code",
          name: "First Code",
          icon: "💻",
          type: "lifetime",
          criteria: "First time coding",
        },
        {
          id: "first-notebook",
          name: "First Notebook",
          icon: "📓",
          type: "lifetime",
          criteria: "Complete first notebook entry",
        },
        {
          id: "txr-achiever",
          name: "TXR Achiever",
          icon: "🔰",
          type: "lifetime",
          criteria: "Complete 4 sessions",
        },
        {
          id: "txr-veteran",
          name: "TXR Veteran",
          icon: "🛠️",
          type: "lifetime",
          criteria: "Complete 10 sessions",
        },
        {
          id: "attendance-champion",
          name: "Attendance Champion",
          icon: "🏅",
          type: "lifetime",
          criteria: "5+ sessions of perfect attendance",
        },
      ],

      competition: [
        {
          id: "tournament-competitor",
          name: "Tournament Competitor",
          icon: "🚩",
          type: "competition",
          criteria: "Attend an official VEX competition",
        },
        {
          id: "excellence-award",
          name: "Excellence Award",
          icon: "👑",
          type: "competition",
          criteria: "Win real-life Excellence Award",
        },
        {
          id: "skills-champion",
          name: "Skills Champion",
          icon: "🎮",
          type: "competition",
          criteria: "Win Robot Skills Award",
        },
        {
          id: "teamwork-champion",
          name: "Teamwork Champion",
          icon: "🤝",
          type: "competition",
          criteria: "Win Teamwork Challenge",
        },
        {
          id: "think-award",
          name: "Think Award",
          icon: "🧠",
          type: "competition",
          criteria: "Win Think Award",
        },
        {
          id: "innovate-award",
          name: "Innovate Award",
          icon: "💡",
          type: "competition",
          criteria: "Win Innovate Award",
        },
        {
          id: "double-crown",
          name: "Double Crown",
          icon: "👑",
          type: "competition",
          criteria: "Win 2 major awards in 1 tournament",
        },
        {
          id: "triple-crown",
          name: "Triple Crown",
          icon: "💎",
          type: "competition",
          criteria: "Win Excellence, Teamwork & Skills",
        },
      ],

      annual: [
        {
          id: "returner-award",
          name: "Returner Award",
          icon: "🔁",
          type: "annual",
          criteria: "2 years in program",
        },
        {
          id: "loyalty-award",
          name: "Loyalty Award",
          icon: "💎",
          type: "annual",
          criteria: "3 years",
        },
        {
          id: "dedication-medal",
          name: "Dedication Medal",
          icon: "🎖️",
          type: "annual",
          criteria: "4 years",
        },
        {
          id: "legacy-honor",
          name: "Legacy Honor",
          icon: "🏛️",
          type: "annual",
          criteria: "5+ years",
        },
        {
          id: "student-of-year",
          name: "Student of the Year",
          icon: "🏅",
          type: "annual",
          criteria: "Staff-selected award",
        },
        {
          id: "leadership-excellence",
          name: "Leadership Excellence",
          icon: "🌟",
          type: "annual",
          criteria: "Mentor others consistently",
        },
        {
          id: "program-ambassador",
          name: "Program Ambassador",
          icon: "🗣️",
          type: "annual",
          criteria: "Represent TXR values in the community",
        },
      ],
    }),
    []
  );

  // Helper function to calculate years in program
  const calculateYearsInProgram = (student) => {
    if (!student.joinDate) return 0;
    const joinDate = new Date(student.joinDate);
    const now = new Date();
    return Math.floor((now - joinDate) / (365.25 * 24 * 60 * 60 * 1000));
  };

  // Calculate which badges the student has earned
  const earnedBadges = useMemo(() => {
    const earned = {
      daily: [],
      session: [],
      lifetime: [],
      competition: [],
      annual: [],
    };

    // Check daily badges based on tracking
    const sessionTracking = dailyXPTracking[student.id]?.[currentSession];
    if (sessionTracking?.totals) {
      // Speed Builder - would need custom tracking
      // Debugging Pro - would need custom tracking
      // Team Helper - based on class-helper count
      if ((sessionTracking.totals["class-helper"]?.count || 0) >= 3) {
        earned.daily.push("team-helper");
      }
      // Clean Workspace - based on clean-workspace count
      if ((sessionTracking.totals["clean-workspace"]?.count || 0) >= 3) {
        earned.daily.push("clean-workspace-badge");
      }
      // Early Bird - based on early-bird count
      if ((sessionTracking.totals["early-bird"]?.count || 0) >= 3) {
        earned.daily.push("early-bird-badge");
      }
      // Notebook Star - based on engineering-notebook count
      if ((sessionTracking.totals["engineering-notebook"]?.count || 0) >= 3) {
        earned.daily.push("notebook-star");
      }
    }

    // Check session badges based on milestones
    const sessionMilestones =
      studentMilestones[student.id]?.[currentSession] || [];
    sessionMilestones.forEach((milestone) => {
      if (badges.session.find((b) => b.id === milestone)) {
        earned.session.push(milestone);
      }
    });

    // Check if earned 100+ session XP
    const sessionXP = student.sessionXP?.[currentSession] || 0;
    if (sessionXP >= 100) {
      earned.session.push("session-champion");
    }

    // Check lifetime badges based on achievements
    if (student.achievements) {
      // Map achievement names to badge IDs
      student.achievements.forEach((achievementId) => {
        const achievement = achievements.find((a) => a.id === achievementId);
        if (achievement) {
          if (achievement.name === "First Robot")
            earned.lifetime.push("first-robot");
          if (achievement.name === "First Program")
            earned.lifetime.push("first-code");
          if (achievement.name === "First Engineering Notebook")
            earned.lifetime.push("first-notebook");
          if (achievement.name === "TXR Achiever")
            earned.lifetime.push("txr-achiever");
          if (achievement.name === "TXR Veteran")
            earned.lifetime.push("txr-veteran");
          if (achievement.name === "Attendance Champion")
            earned.lifetime.push("attendance-champion");
        }
      });
    }

    // Check competition badges based on tournament history
    if (student.tournamentHistory) {
      student.tournamentHistory.forEach((tournament) => {
        earned.competition.push("tournament-competitor");

        // Check for specific awards (would need to track these in tournament results)
        if (tournament.placement === 1) {
          earned.competition.push("teamwork-champion");
        }
      });
    }

    // Check annual badges based on years in program
    const yearsInProgram = calculateYearsInProgram(student);
    if (yearsInProgram >= 2) earned.annual.push("returner-award");
    if (yearsInProgram >= 3) earned.annual.push("loyalty-award");
    if (yearsInProgram >= 4) earned.annual.push("dedication-medal");
    if (yearsInProgram >= 5) earned.annual.push("legacy-honor");

    return earned;
  }, [
    student,
    currentSession,
    dailyXPTracking,
    studentMilestones,
    achievements,
  ]);

  // Calculate badge progress
  const getBadgeProgress = (badge) => {
    const sessionTracking = dailyXPTracking[student.id]?.[currentSession];

    switch (badge.id) {
      case "team-helper":
        const helperCount =
          sessionTracking?.totals?.["class-helper"]?.count || 0;
        return Math.min(100, (helperCount / 3) * 100);

      case "clean-workspace-badge":
        const cleanCount =
          sessionTracking?.totals?.["clean-workspace"]?.count || 0;
        return Math.min(100, (cleanCount / 3) * 100);

      case "early-bird-badge":
        const earlyCount = sessionTracking?.totals?.["early-bird"]?.count || 0;
        return Math.min(100, (earlyCount / 3) * 100);

      case "notebook-star":
        const notebookCount =
          sessionTracking?.totals?.["engineering-notebook"]?.count || 0;
        return Math.min(100, (notebookCount / 3) * 100);

      case "session-champion":
        const sessionXP = student.sessionXP?.[currentSession] || 0;
        return Math.min(100, (sessionXP / 100) * 100);

      case "txr-achiever":
        const completedSessions = Object.values(
          studentMilestones[student.id] || {}
        ).filter((milestones) =>
          milestones.includes("session-complete")
        ).length;
        return Math.min(100, (completedSessions / 4) * 100);

      case "txr-veteran":
        const completedSessionsVet = Object.values(
          studentMilestones[student.id] || {}
        ).filter((milestones) =>
          milestones.includes("session-complete")
        ).length;
        return Math.min(100, (completedSessionsVet / 10) * 100);

      default:
        return earnedBadges[badge.type]?.includes(badge.id) ? 100 : 0;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-4xl">{student.avatar}</span>
          {student.name}'s Badge Collection
        </h2>
        <p className="text-gray-600 mt-2">
          Total Badges: {Object.values(earnedBadges).flat().length} /{" "}
          {Object.values(badges).flat().length}
        </p>
      </div>

      {/* Daily/Class Engagement Badges */}
      <BadgeGallery
        title="Daily & Class Engagement"
        type="daily"
        badges={badges.daily.map((badge) => ({
          ...badge,
          progress: getBadgeProgress(badge),
        }))}
        studentBadges={earnedBadges.daily}
      />

      {/* Session Milestone Badges */}
      <BadgeGallery
        title="Session Milestones"
        type="session"
        badges={badges.session.map((badge) => ({
          ...badge,
          progress: getBadgeProgress(badge),
        }))}
        studentBadges={earnedBadges.session}
      />

      {/* Lifetime Achievement Badges */}
      <BadgeGallery
        title="Lifetime Achievements"
        type="lifetime"
        badges={badges.lifetime.map((badge) => ({
          ...badge,
          progress: getBadgeProgress(badge),
        }))}
        studentBadges={earnedBadges.lifetime}
      />

      {/* Competition Honors */}
      <BadgeGallery
        title="Competition Honors"
        type="competition"
        badges={badges.competition}
        studentBadges={earnedBadges.competition}
      />

      {/* Multi-Year & Annual Awards */}
      <BadgeGallery
        title="Multi-Year & Annual Awards"
        type="annual"
        badges={badges.annual}
        studentBadges={earnedBadges.annual}
      />
    </div>
  );
};

export default StudentBadgeView;
