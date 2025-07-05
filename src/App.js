import React, { useState, useEffect, useMemo } from "react";
import { initializeTestData } from "./testData";
import NavigationBar from "./NavigationBar";
import UnifiedXPAwardModal from './UnifiedXPAwardModal';
import { 
  checkAllMilestones, 
  getMilestoneProgress,
  SESSION_MILESTONES,
  LIFETIME_ACHIEVEMENTS 
} from './MilestoneTrackingSystem';
import MilestoneProgressDisplay from './MilestoneProgressDisplay';

const VEXLifetimeAchievementSystem = () => {
  // Enhanced data structure with lifetime and session tracking
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState([
    // === Core Lifetime Achievements ===
    {
      id: 'first-robot-lifetime',
      name: "First Robot",
      icon: "🤖",
      description: "Build your very first robot",
      xp: 50,
      type: "lifetime",
    },
    {
      id: 'first-program-lifetime',
      name: "First Program",
      icon: "💻",
      description: "Write your first program",
      xp: 50,
      type: "lifetime",
    },
    {
      id: 'first-notebook-lifetime',
      name: "First Engineering Notebook",
      icon: "📓",
      description: "Complete your first notebook entry",
      xp: 50,
      type: "lifetime",
    },
    {
      id: 'txr-achiever-lifetime',
      name: "TXR Achiever",
      icon: "🌟",
      description: "Complete 4 sessions",
      xp: 100,
      type: "lifetime",
    },
    {
      id: 'txr-veteran-lifetime',
      name: "TXR Veteran",
      icon: "⭐",
      description: "Complete 10 sessions",
      xp: 200,
      type: "lifetime",
    },
    {
      id: 'attendance-champion-lifetime',
      name: "Attendance Champion",
      icon: "🏅",
      description: "5+ sessions with perfect attendance",
      xp: 150,
      type: "lifetime",
    },

    // === Generalized Summer Camp Achievements (Reusable) ===
    {
      id: 101,
      name: "Speed Builder",
      icon: "⚡",
      description: "Complete build in under 30 min",
      xp: 30,
      type: "session",
      category: "summer",
    },
    {
      id: 102,
      name: "Perfect Attendance",
      icon: "✅",
      description: "Attend all days this session",
      xp: 25,
      type: "session",
      category: "summer",
    },
    {
      id: 103,
      name: "Team Helper",
      icon: "🤝",
      description: "Help 3+ classmates",
      xp: 20,
      type: "session",
      category: "summer",
    },
    {
      id: 104,
      name: "Challenge Master",
      icon: "🏆",
      description: "Complete all weekly challenges",
      xp: 40,
      type: "session",
      category: "summer",
    },
    {
      id: 105,
      name: "Innovation Award",
      icon: "💡",
      description: "Create a unique solution",
      xp: 35,
      type: "session",
      category: "summer",
    },
    {
      id: 106,
      name: "Clean Workspace",
      icon: "🧹",
      description: "Best workspace organization",
      xp: 15,
      type: "session",
      category: "summer",
    },
    {
      id: 107,
      name: "Debugging Pro",
      icon: "🔍",
      description: "Fix a tricky problem",
      xp: 30,
      type: "session",
      category: "summer",
    },
    {
      id: 108,
      name: "Early Bird",
      icon: "🐦",
      description: "First to arrive every day",
      xp: 20,
      type: "session",
      category: "summer",
    },

    // === School Year Achievements ===
    {
      id: 201,
      name: "VEX GO Master",
      icon: "🟢",
      description: "Complete GO curriculum milestone",
      xp: 50,
      type: "session",
      category: "school-go",
    },
    {
      id: 202,
      name: "Sensor Specialist",
      icon: "📡",
      description: "Master all GO sensors",
      xp: 40,
      type: "session",
      category: "school-go",
    },
    {
      id: 203,
      name: "IQ Builder",
      icon: "🔵",
      description: "Advanced IQ robot design",
      xp: 60,
      type: "session",
      category: "school-iq",
    },
    {
      id: 204,
      name: "Autonomous Ace",
      icon: "🎯",
      description: "Program complex autonomous",
      xp: 70,
      type: "session",
      category: "school-iq",
    },
    {
      id: 205,
      name: "Competition Ready",
      icon: "🏁",
      description: "Pass robot inspection",
      xp: 80,
      type: "session",
      category: "competition",
    },
    {
      id: 206,
      name: "Alliance Captain",
      icon: "👑",
      description: "Lead your alliance",
      xp: 100,
      type: "session",
      category: "competition",
    },
  ]);

  const [currentSession, setCurrentSession] = useState("");
  const [sessions, setSessions] = useState([]);
  const [showSessionManager, setShowSessionManager] = useState(false);

  // Attendance tracking state
  const [attendance, setAttendance] = useState({}); // { sessionId: { date: { studentId: 'present'|'absent'|'late' } } }
  const [attendanceSelectedDate, setAttendanceSelectedDate] = useState(null);
  const [showAttendanceManager, setShowAttendanceManager] = useState(false);
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);

  // Helper to migrate old string sessions to new format
  const migrateSessionsToNewFormat = (oldSessions) => {
    if (oldSessions.length === 0) return [];

    // Check if already migrated (first item is an object)
    if (typeof oldSessions[0] === "object") return oldSessions;

    return oldSessions.map((sessionName, index) => {
      return {
        id: `session_${Date.now()}_${index}`,
        name: sessionName,
        type: "general", // Default to general, let users set it
        startDate: null, // Let users add dates
        endDate: null, // Let users add dates
        isActive: true,
        order: index,
        createdAt: new Date().toISOString(),
      };
    });
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showStudentManager, setShowStudentManager] = useState(false);
  const [showAchievementManager, setShowAchievementManager] = useState(false);
  const [xpToAward, setXpToAward] = useState(10);
  const [dailyXPTracking, setDailyXPTracking] = useState({});
  const [filterProgram, setFilterProgram] = useState("ALL");
  const [bulkSelectedStudents, setBulkSelectedStudents] = useState([]);
  const [showUnifiedXPAward, setShowUnifiedXPAward] = useState(false);

  // Tournament Management States
  const [teams, setTeams] = useState([]);
  const [teamworkMatches, setTeamworkMatches] = useState([]);
  const [skillsScores, setSkillsScores] = useState([]);
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showMatchEntry, setShowMatchEntry] = useState(false);
  const [showSkillsEntry, setShowSkillsEntry] = useState(false);
  const [showTournamentView, setShowTournamentView] = useState(false);
  const [skillsType, setSkillsType] = useState("driver");

  // New Tournament System States
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [showTournamentWizard, setShowTournamentWizard] = useState(false);
  const [showTournamentDashboard, setShowTournamentDashboard] = useState(false);
  const [showTournamentHistory, setShowTournamentHistory] = useState(false);
  const [showAwardsCeremony, setShowAwardsCeremony] = useState(false);
  const [selectedHistoricalTournament, setSelectedHistoricalTournament] =
    useState(null);

  //Settings States
  const [showSettings, setShowSettings] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  // Session completion milestones
  const sessionMilestones = {
    attendance: {
      name: "Perfect Attendance",
      requirement: "Attend all days",
      lifetimeBonus: 25,
      icon: "📅",
    },
    earlybird: {
      name: "Early Bird",
      requirement: "Arrive early 5+ times",
      lifetimeBonus: 25,
      icon: "🐦",
    },
    cleanup: {
      name: "Clean-Up Champion",
      requirement: "Clean workspace 3+ times",
      lifetimeBonus: 25,
      icon: "🧹",
    },
    documentation: {
      name: "Documentation Expert",
      requirement: "Engineering notebook 3+ times",
      lifetimeBonus: 25,
      icon: "📓",
    },
    completion: {
      name: "Session Complete",
      requirement: "Complete the session",
      lifetimeBonus: 40,
      icon: "✅",
    },
    helper: {
      name: "Ultimate Collaborator",
      requirement: "Help teammates 3+ times",
      lifetimeBonus: 50,
      icon: "🤝",
    },
  };

  // Track session milestones per student
  const [studentMilestones, setStudentMilestones] = useState({});

  const recentTournaments = useMemo(() => {
    return tournaments
      .filter((t) => t.status === "complete" && t.sessionId === currentSession)
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt) -
          new Date(a.completedAt || a.createdAt)
      )
      .slice(0, 3);
  }, [tournaments, currentSession]);

  // Load data on mount
  useEffect(() => {
    initializeTestData();

    const savedStudents = localStorage.getItem("vexLifetimeStudents");
    const savedAchievements = localStorage.getItem("vexAchievements");
    const savedSessions = localStorage.getItem("vexSessions");
    const savedCurrentSession = localStorage.getItem("vexCurrentSession");
    const savedMilestones = localStorage.getItem("vexStudentMilestones");
    const savedTeams = localStorage.getItem("vexTeams");
    const savedMatches = localStorage.getItem("vexTeamworkMatches");
    const savedSkills = localStorage.getItem("vexSkillsScores");
    const savedAttendance = localStorage.getItem("vexAttendance");
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

    const savedTournaments = localStorage.getItem("vexTournaments");
    if (savedTournaments) setTournaments(JSON.parse(savedTournaments));

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(migrateSessionsToNewFormat(parsedSessions));

      // If no current session saved, use first active session
      if (!savedCurrentSession && parsedSessions.length > 0) {
        const migrated = migrateSessionsToNewFormat(parsedSessions);
        const firstActive = migrated.find((s) => s.isActive);
        if (firstActive) {
          setCurrentSession(firstActive.name);
        }
      }
    }
    if (savedCurrentSession) setCurrentSession(savedCurrentSession);
    if (savedMilestones) setStudentMilestones(JSON.parse(savedMilestones));
    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedMatches) setTeamworkMatches(JSON.parse(savedMatches));
    if (savedSkills) setSkillsScores(JSON.parse(savedSkills));

    const savedDailyXPTracking = localStorage.getItem("vexDailyXPTracking");
    if (savedDailyXPTracking)
      setDailyXPTracking(JSON.parse(savedDailyXPTracking));
  }, []);

  // Validate current session
  useEffect(() => {
    if (
      sessions.length > 0 &&
      !sessions.some((s) => s.name === currentSession)
    ) {
      // Current session doesn't exist, switch to first active session
      const firstActiveSession = sessions.find((s) => s.isActive);
      if (firstActiveSession) {
        setCurrentSession(firstActiveSession.name);
      }
    }
  }, [sessions, currentSession]);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem("vexLifetimeStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("vexAchievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("vexSessions", JSON.stringify(sessions));
    localStorage.setItem("vexCurrentSession", currentSession);
  }, [sessions, currentSession]);

  // Save dailyXPTracking when it changes
  useEffect(() => {
    localStorage.setItem("vexDailyXPTracking", JSON.stringify(dailyXPTracking));
  }, [dailyXPTracking]);

  useEffect(() => {
    if (!selectedStudent || !dailyXPTracking[selectedStudent.id]) return;
  
    const { sessionMilestones, lifetimeAchievements } = checkAllMilestones(
      selectedStudent.id,
      currentSession,
      dailyXPTracking,
      students,
      sessions,
      attendance,
      studentMilestones
    );
  
    sessionMilestones.forEach(milestone => {
      awardMilestone(selectedStudent.id, milestone.id);
      console.log(`🎯 ${selectedStudent.name} earned ${milestone.name}`);
    });
  
    lifetimeAchievements.forEach(achievement => {
      const existing = achievements.find(a => a.name === achievement.name && a.type === 'lifetime');
      if (!existing) {
        const newAchievement = {
          id: Date.now(),
          name: achievement.name,
          icon: achievement.icon,
          description: achievement.description,
          xp: achievement.xp,
          type: 'lifetime'
        };
        setAchievements(prev => [...prev, newAchievement]);
        awardAchievement(selectedStudent.id, newAchievement.id);
      } else {
        awardAchievement(selectedStudent.id, existing.id);
      }
      console.log(`🏆 ${selectedStudent.name} earned lifetime achievement: ${achievement.name}`);
    });
  
  }, [dailyXPTracking, selectedStudent, currentSession]);
  

  useEffect(() => {
    localStorage.setItem("vexAttendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(
      "vexStudentMilestones",
      JSON.stringify(studentMilestones)
    );
  }, [studentMilestones]);

  useEffect(() => {
    localStorage.setItem("vexTeams", JSON.stringify(teams));
    localStorage.setItem("vexTeamworkMatches", JSON.stringify(teamworkMatches));
    localStorage.setItem("vexSkillsScores", JSON.stringify(skillsScores));
  }, [teams, teamworkMatches, skillsScores]);

  useEffect(() => {
    localStorage.setItem("vexTournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  // Calculate levels
  const levels = [
    { level: 1, name: "VEX Rookie", minXP: 0, color: "bg-gray-500" },
    { level: 2, name: "VEX Builder", minXP: 100, color: "bg-green-500" },
    { level: 3, name: "VEX Programmer", minXP: 300, color: "bg-blue-500" },
    { level: 4, name: "VEX Engineer", minXP: 600, color: "bg-purple-500" },
    { level: 5, name: "VEX Expert", minXP: 1000, color: "bg-orange-500" },
    { level: 6, name: "VEX Master", minXP: 1500, color: "bg-red-500" },
    { level: 7, name: "VEX Legend", minXP: 2000, color: "bg-pink-500" },
  ];

  const getStudentLevel = (xp) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minXP) {
        return levels[i];
      }
    }
    return levels[0];
  };

  // Get student's session XP
  const getSessionXP = (student) => {
    if (!student.sessionXP || !student.sessionXP[currentSession]) return 0;
    return student.sessionXP[currentSession];
  };

  // Determine session category
  // TODO: Make categories customizable in future version
  const getSessionCategory = (session) => {
    // If we have a session object with a type, use it
    if (session && typeof session === "object" && session.type) {
      return session.type;
    }

    // Fallback to name-based detection for backward compatibility
    const name = typeof session === "string" ? session : session?.name || "";

    if (name.includes("Summer")) return "summer";
    if (name.includes("GO")) return "school-go";
    if (name.includes("IQ")) return "school-iq";
    if (name.includes("Competition")) return "competition";
    return "general";
  };

  // Get current session object
  const getCurrentSessionObject = () => {
    return sessions.find((s) => s.name === currentSession) || null;
  };

  // Get available achievements for current session - WITH DEBUG
  const getAvailableSessionAchievements = (student) => {
    const earnedInSession = student.sessionAchievements?.[currentSession] || [];
    const sessionCategory = getSessionCategory(getCurrentSessionObject());

    const available = achievements.filter(
      (a) =>
        a.type === "session" &&
        a.category === sessionCategory &&
        !earnedInSession.includes(a.id)
    );

    return available;
  };

  // Award XP with hybrid system (30% of session XP goes to lifetime)
  const awardXP = (studentId, amount, isLifetime = false) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
  
    const updatedStudent = { ...student };
    const currentLifetimeXP = typeof student.lifetimeXP === 'number' ? student.lifetimeXP : 0;
  
    if (isLifetime) {
      updatedStudent.lifetimeXP = currentLifetimeXP + amount;
    } else {
      const currentSessionXP = student.sessionXP?.[currentSession] || 0;
      const lifetimeContribution = Math.floor(amount * 0.3);
      updatedStudent.sessionXP = {
        ...student.sessionXP,
        [currentSession]: currentSessionXP + amount,
      };
      updatedStudent.lifetimeXP = currentLifetimeXP + lifetimeContribution;
    }
  
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? updatedStudent : s))
    );
  };
  
  const handleDailyXPAward = (studentId, totalXP, awards, date, notes) => {
    // 1. Award the XP
    awardXP(studentId, totalXP, false);
  
    // 2. Update the daily tracking (with duplicate-date protection)
    setDailyXPTracking(prev => {
      const newTracking = { ...prev };
  
      if (!newTracking[studentId]) newTracking[studentId] = {};
      if (!newTracking[studentId][currentSession]) {
        newTracking[studentId][currentSession] = {
          dates: {},
          totals: {}
        };
      }
  
      // Record the day's awards
      newTracking[studentId][currentSession].dates[date] = {
        awards: awards.map(a => ({
          id: a.id,
          name: a.name,
          xp: a.xp
        })),
        totalXP,
        notes,
        timestamp: new Date().toISOString()
      };
  
      // Increment totals only if this date hasn't already been counted for this award
      awards.forEach(award => {
        const totals = newTracking[studentId][currentSession].totals;
        if (!totals[award.id]) {
          totals[award.id] = {
            count: 0,
            totalXP: 0,
            dates: []
          };
        }
  
        if (!totals[award.id].dates.includes(date)) {
          totals[award.id].count += 1;
          totals[award.id].totalXP += award.xp;
          totals[award.id].dates.push(date);
        }
      });
  
      return newTracking;
    });
  
    // 🚫 No milestone checking here anymore
  };
  
// // Update the handleDailyXPAward function to check milestones
//   const handleDailyXPAward = (studentId, totalXP, awards, date, notes) => {
//     // Award the XP (30% goes to lifetime)
//     awardXP(studentId, totalXP, false);
    
//     // Track the daily awards
//     setDailyXPTracking(prev => {
//       const newTracking = { ...prev };
      
//       // Initialize student tracking if needed
//       if (!newTracking[studentId]) {
//         newTracking[studentId] = {};
//       }
      
//       // Initialize session tracking if needed
//       if (!newTracking[studentId][currentSession]) {
//         newTracking[studentId][currentSession] = {
//           dates: {},
//           totals: {}
//         };
//       }
      
//       // Record awards for this date
//       newTracking[studentId][currentSession].dates[date] = {
//         awards: awards.map(a => ({
//           id: a.id,
//           name: a.name,
//           xp: a.xp
//         })),
//         totalXP,
//         notes,
//         timestamp: new Date().toISOString()
//       };
      
//       // Update totals for each award type
//       awards.forEach(award => {
//         if (!newTracking[studentId][currentSession].totals[award.id]) {
//           newTracking[studentId][currentSession].totals[award.id] = {
//             count: 0,
//             totalXP: 0,
//             dates: []
//           };
//         }
        
//         const total = newTracking[studentId][currentSession].totals[award.id];

//           // ✅ Only increment if this award hasn’t been given for this date yet
//   if (!total.dates.includes(date)) {
//     total.count += 1;
//     total.totalXP += award.xp;
//     total.dates.push(date);
//   }
//       });
      
//       return newTracking;
//     });
    
//     // Check for newly earned milestones
//     setTimeout(() => {
//       const { sessionMilestones, lifetimeAchievements } = checkAllMilestones(
//         studentId,
//         currentSession,
//         dailyXPTracking,
//         students,
//         sessions,
//         attendance,
//         studentMilestones
//       );
      
//       // Award any newly earned session milestones
//       sessionMilestones.forEach(milestone => {
//         awardMilestone(studentId, milestone.id);
//         console.log(`🎉 ${students.find(s => s.id === studentId).name} earned ${milestone.name}!`);
//       });
      
//       // Award any newly earned lifetime achievements
//       lifetimeAchievements.forEach(achievement => {
//         // Create the achievement if it doesn't exist
//         let achievementId = achievements.find(a => a.name === achievement.name)?.id;
        
//         if (!achievementId) {
//           // Add the achievement to the system
//           const newAchievement = {
//             id: Date.now(),
//             name: achievement.name,
//             icon: achievement.icon,
//             description: achievement.description,
//             xp: achievement.xp,
//             type: 'lifetime'
//           };
//           setAchievements(prev => [...prev, newAchievement]);
//           achievementId = newAchievement.id;
//         }
        
//         awardAchievement(studentId, achievementId);
//         console.log(`🏆 ${students.find(s => s.id === studentId).name} earned lifetime achievement: ${achievement.name}!`);
//       });
//     }, 100); // Small delay to ensure state updates
//   };

//   // Add milestone checking function
//   const checkForMilestones = (studentId) => {
//     const tracking = dailyXPTracking[studentId]?.[currentSession];
//     if (!tracking) return;

//     const student = students.find((s) => s.id === studentId);
//     if (!student) return;

//     // Check Clean Workspace Champion (3+ times)
//     if (tracking.totals["clean-workspace"]?.count >= 3) {
//       const milestoneId = `cleanup-champion-${currentSession}`;
//       if (
//         !studentMilestones[studentId]?.[currentSession]?.includes(
//           "cleanup-champion"
//         )
//       ) {
//         awardMilestone(studentId, "cleanup-champion");
//         console.log(`${student.name} earned Clean-Up Champion!`);
//       }
//     }

//     // Check Early Bird (5+ times)
//     if (tracking.totals["early-bird"]?.count >= 5) {
//       if (
//         !studentMilestones[studentId]?.[currentSession]?.includes("earlybird")
//       ) {
//         awardMilestone(studentId, "earlybird");
//         console.log(`${student.name} earned Early Bird milestone!`);
//       }
//     }

//     // Check Team Builder (helped 3+ times)
//     if (tracking.totals["class-helper"]?.count >= 3) {
//       if (!studentMilestones[studentId]?.[currentSession]?.includes("helper")) {
//         awardMilestone(studentId, "helper");
//         console.log(`${student.name} earned Team Builder milestone!`);
//       }
//     }

//     // Check for lifetime achievements based on total sessions
//     const totalRobotBuilds = Object.values(
//       dailyXPTracking[studentId] || {}
//     ).reduce(
//       (sum, session) => sum + (session.totals?.["robot-build"]?.count || 0),
//       0
//     );

//     if (
//       totalRobotBuilds >= 1 &&
//       !student.achievements?.includes("first-robot")
//     ) {
//       // This should trigger the "First Robot" lifetime achievement
//       // You'll need to create this achievement ID in your achievements list
//       const firstRobotAchievement = achievements.find(
//         (a) => a.name === "First Robot"
//       );
//       if (firstRobotAchievement) {
//         awardAchievement(studentId, firstRobotAchievement.id);
//       }
//     }
//   };

const awardAchievement = (studentId, achievementId) => {
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) return;

  setStudents((prevStudents) =>
    prevStudents.map((student) => {
      if (student.id !== studentId) return student;

      const currentLifetimeXP = student.lifetimeXP || 0;
      const currentSessionXP = student.sessionXP?.[currentSession] || 0;

      // 🛑 Lifetime achievement — do not duplicate
      if (achievement.type === "lifetime") {
        if (student.achievements?.includes(achievementId)) return student;

        return {
          ...student,
          achievements: [...(student.achievements || []), achievementId],
          lifetimeXP: currentLifetimeXP + achievement.xp,
        };
      }

      // 🟢 Session achievement — also check duplication
      const earnedInSession = student.sessionAchievements?.[currentSession] || [];
      if (earnedInSession.includes(achievementId)) return student;

      return {
        ...student,
        sessionAchievements: {
          ...student.sessionAchievements,
          [currentSession]: [...earnedInSession, achievementId],
        },
        sessionXP: {
          ...student.sessionXP,
          [currentSession]: currentSessionXP + achievement.xp,
        },
        lifetimeXP: currentLifetimeXP + Math.floor(achievement.xp * 0.3),
      };
    })
  );
};

  // // Award achievement - SIMPLE FINAL VERSION
  // const awardAchievement = (studentId, achievementId) => {
  //   const achievement = achievements.find((a) => a.id === achievementId);
  //   if (!achievement) return;

  //   // Check BEFORE state update to show alerts
  //   const student = students.find((s) => s.id === studentId);
  //   if (!student) return;

  //   if (
  //     achievement.type === "lifetime" &&
  //     student.achievements?.includes(achievementId)
  //   ) {
  //     alert(`${student.name} already earned "${achievement.name}"!`);
  //     return;
  //   }

  //   if (achievement.type === "session") {
  //     const currentSessionAchievements =
  //       student.sessionAchievements?.[currentSession] || [];
  //     if (currentSessionAchievements.includes(achievementId)) {
  //       alert(
  //         `${student.name} already earned "${achievement.name}" this session!`
  //       );
  //       return;
  //     }
  //   }

  //   // Now do the state update - using functional update to ensure we always get latest state
  //   setStudents((prev) => {
  //     // Find the most current version of the student
  //     const currentStudent = prev.find((s) => s.id === studentId);
  //     if (!currentStudent) return prev;

  //     // Check again with the most current data
  //     if (achievement.type === "session") {
  //       const currentAchievements =
  //         currentStudent.sessionAchievements?.[currentSession] || [];
  //       if (currentAchievements.includes(achievementId)) {
  //         // Already has it in the current state, no update needed
  //         return prev;
  //       }
  //     }

  //     // Now we definitely need to add it
  //     return prev.map((s) => {
  //       if (s.id !== studentId) return s;

  //       if (achievement.type === "lifetime") {
  //         return {
  //           ...s,
  //           achievements: [...(s.achievements || []), achievementId],
  //           lifetimeXP: (s.lifetimeXP || 0) + achievement.xp,
  //         };
  //       } else {
  //         // Session achievement - do everything in one shot
  //         const updatedStudent = {
  //           ...s,
  //           sessionAchievements: {
  //             ...s.sessionAchievements,
  //             [currentSession]: [
  //               ...(s.sessionAchievements?.[currentSession] || []),
  //               achievementId,
  //             ],
  //           },
  //           sessionXP: {
  //             ...s.sessionXP,
  //             [currentSession]:
  //               (s.sessionXP?.[currentSession] || 0) + achievement.xp,
  //           },
  //           lifetimeXP: (s.lifetimeXP || 0) + Math.floor(achievement.xp * 0.3),
  //         };

  //         return updatedStudent;
  //       }
  //     });
  //   });
  // };

  // Get how many times an achievement was earned across all sessions
  const getAchievementEarnCount = (student, achievementId) => {
    if (!student.sessionAchievements) return 0;

    let count = 0;
    Object.values(student.sessionAchievements).forEach(
      (sessionAchievements) => {
        if (sessionAchievements.includes(achievementId)) count++;
      }
    );
    return count;
  };

  // Award session milestone
  const awardMilestone = (studentId, milestoneKey) => {
    // Get milestone from either local or system-defined source
    const milestone = sessionMilestones[milestoneKey] || SESSION_MILESTONES[milestoneKey];
    if (!milestone) return;
  
    // Check if already earned
    const alreadyEarned = studentMilestones[studentId]?.[currentSession]?.includes(milestoneKey);
    if (alreadyEarned) return;
  
    // ✅ Get XP safely from either property
    const xp = milestone.lifetimeBonus ?? milestone.lifetimeXP ?? 0;
  
    // ✅ Award XP to lifetime (bulletproof awardXP() assumed)
    awardXP(studentId, xp, true);
  
    // ✅ Track the milestone in student history
    setStudentMilestones((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [currentSession]: [
          ...(prev[studentId]?.[currentSession] || []),
          milestoneKey,
        ],
      },
    }));
  };
  
  // Get student's earned milestones for current session
  const getStudentMilestones = (studentId) => {
    return studentMilestones[studentId]?.[currentSession] || [];
  };

  // Export data
  const exportData = () => {
    const exportObj = {
      students,
      achievements,
      sessions,
      currentSession,
      studentMilestones,
      teams,
      teamworkMatches,
      skillsScores,
      tournaments,
      attendance,
      exportDate: new Date().toISOString(),
      version: "2.0",
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `vex-complete-data-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Add new student
  const addStudent = (name, program) => {
    const newStudent = {
      id: Date.now(),
      name,
      program,
      lifetimeXP: 0,
      sessionXP: { [currentSession]: 0 },
      achievements: [],
      sessionAchievements: {},
      avatar: "🤖",
      joinDate: new Date().toISOString(),
      sessionsAttended: [currentSession],
      enrolledSessions: [currentSession], // Add this line - auto-enroll in current session

      tournamentHistory: [],
      personalBests: {
        teamwork: {
          highScore: 0,
          averageScore: 0,
          tournamentId: null,
          tournamentName: null,
          date: null,
          partner: null,
        },
        driverSkills: {
          highScore: 0,
          tournamentId: null,
          tournamentName: null,
          date: null,
        },
        autonomousSkills: {
          highScore: 0,
          tournamentId: null,
          tournamentName: null,
          date: null,
        },
        combinedSkills: {
          highScore: 0,
          tournamentId: null,
          tournamentName: null,
          date: null,
        },
      },
      tournamentStats: {
        totalTournaments: 0,
        championships: 0,
        podiumFinishes: 0,
        averagePlacement: 0,
        favoritePartners: [],
      },
    };
    setStudents([...students, newStudent]);
  };

  // Remove student
  const removeStudent = (studentId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this student? This cannot be undone."
      )
    ) {
      setStudents(students.filter((s) => s.id !== studentId));
    }
  };

  // Add achievement
  const addAchievement = (achievement) => {
    const newAchievement = {
      ...achievement,
      id: Date.now(),
    };
    setAchievements([...achievements, newAchievement]);
  };

  // Remove achievement
  const removeAchievement = (achievementId) => {
    if (
      window.confirm(
        "Remove this achievement? Students who earned it will keep their XP."
      )
    ) {
      setAchievements(achievements.filter((a) => a.id !== achievementId));
    }
  };

  // Tournament Handlers
  const handleSaveTeamworkMatch = (match) => {
    const enhancedMatch = {
      ...match,
      tournamentId: activeTournament?.id || null,
      matchType: activeTournament ? "qual" : "practice",
    };
    setTeamworkMatches([...teamworkMatches, enhancedMatch]);
  };

  const handleSaveSkillsScore = (score) => {
    const enhancedScore = {
      ...score,
      tournamentId: activeTournament?.id || null,
    };
    setSkillsScores([...skillsScores, enhancedScore]);
  };

  const handleViewHistoricalTournament = (tournament) => {
    setSelectedHistoricalTournament(tournament);
  };

  // Student Manager Modal
  const StudentManager = () => {
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentProgram, setNewStudentProgram] = useState("VEX IQ");
    const [searchFilter, setSearchFilter] = useState("");

    const handleAddStudent = () => {
      if (newStudentName.trim()) {
        addStudent(newStudentName.trim(), newStudentProgram);
        setNewStudentName("");
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddStudent();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Students</h2>
            <button
              onClick={() => setShowStudentManager(false)}
              className="text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-3">Add New Student</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Student Name (press Enter to add)"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border rounded"
                autoFocus
              />
              <select
                value={newStudentProgram}
                onChange={(e) => setNewStudentProgram(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="VEX GO">VEX GO</option>
                <option value="VEX IQ">VEX IQ</option>
                <option value="Competition">Competition</option>
              </select>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Current Session Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Session:</strong>{" "}
              {currentSession || "No session selected"}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Use the Enroll/Unenroll buttons to manage student enrollment in
              this session.
            </p>
          </div>
          {/* Search Filter */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Search students by name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-2 text-sm text-gray-600">
            Showing{" "}
            {
              students.filter((s) =>
                s.name.toLowerCase().includes(searchFilter.toLowerCase())
              ).length
            }{" "}
            of {students.length} students
          </div>

          <div className="space-y-2">
            {students
              .filter((student) =>
                student.name.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{student.avatar}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        {student.program} • Lifetime: {student.lifetimeXP} XP •
                        Session: {getSessionXP(student)} XP
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Enrolled in:{" "}
                        {(
                          student.enrolledSessions ||
                          student.sessionsAttended ||
                          []
                        )
                          .filter((session) =>
                            sessions.some(
                              (s) => s.name === session && s.isActive
                            )
                          )
                          .join(", ") || "No sessions"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const isEnrolled =
                          student.enrolledSessions?.includes(currentSession) ||
                          student.sessionsAttended?.includes(currentSession);

                        if (isEnrolled) {
                          // Unenroll
                          setStudents(
                            students.map((s) =>
                              s.id === student.id
                                ? {
                                    ...s,
                                    enrolledSessions: (
                                      s.enrolledSessions ||
                                      s.sessionsAttended ||
                                      []
                                    ).filter(
                                      (session) => session !== currentSession
                                    ),
                                    sessionsAttended: (
                                      s.sessionsAttended || []
                                    ).filter(
                                      (session) => session !== currentSession
                                    ),
                                  }
                                : s
                            )
                          );
                        } else {
                          // Enroll
                          setStudents(
                            students.map((s) =>
                              s.id === student.id
                                ? {
                                    ...s,
                                    enrolledSessions: [
                                      ...(s.enrolledSessions ||
                                        s.sessionsAttended ||
                                        []),
                                      currentSession,
                                    ],
                                    sessionsAttended: [
                                      ...(s.sessionsAttended || []),
                                      currentSession,
                                    ],
                                  }
                                : s
                            )
                          );
                        }
                      }}
                      className={`px-3 py-1 rounded text-white ${
                        student.enrolledSessions?.includes(currentSession) ||
                        student.sessionsAttended?.includes(currentSession)
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {student.enrolledSessions?.includes(currentSession) ||
                      student.sessionsAttended?.includes(currentSession)
                        ? "Unenroll"
                        : "Enroll"}
                    </button>
                    <button
                      onClick={() => removeStudent(student.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Achievement Manager Modal
  const AchievementManager = () => {
    const [newAchievement, setNewAchievement] = useState({
      name: "",
      icon: "🏅",
      description: "",
      xp: 25,
      type: "session",
      category: "summer",
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Achievements</h2>
            <button
              onClick={() => setShowAchievementManager(false)}
              className="text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-3">Add New Achievement</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Achievement Name"
                value={newAchievement.name}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, name: e.target.value })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={newAchievement.icon}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, icon: e.target.value })
                }
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                value={newAchievement.description}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    description: e.target.value,
                  })
                }
                className="col-span-2 px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="XP Value"
                value={newAchievement.xp}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    xp: parseInt(e.target.value) || 0,
                  })
                }
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newAchievement.type}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, type: e.target.value })
                }
                className="px-3 py-2 border rounded"
              >
                <option value="session">Session Achievement</option>
                <option value="lifetime">Lifetime Achievement</option>
              </select>
              {newAchievement.type === "session" && (
                <select
                  value={newAchievement.category}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      category: e.target.value,
                    })
                  }
                  className="px-3 py-2 border rounded"
                >
                  <option value="summer">Summer Camp</option>
                  <option value="school-go">School Year - VEX GO</option>
                  <option value="school-iq">School Year - VEX IQ</option>
                  <option value="competition">Competition Team</option>
                </select>
              )}
              <button
                onClick={() => {
                  if (newAchievement.name && newAchievement.description) {
                    addAchievement(newAchievement);
                    setNewAchievement({
                      name: "",
                      icon: "🏅",
                      description: "",
                      xp: 25,
                      type: "session",
                      category: "summer",
                    });
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Achievement
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Lifetime Achievements</h3>
              <div className="space-y-2">
                {achievements
                  .filter((a) => a.type === "lifetime")
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="font-semibold">
                            {achievement.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {achievement.description} • {achievement.xp} XP
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAchievement(achievement.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                Session Achievements by Category
              </h3>
              {["summer", "school-go", "school-iq", "competition"].map(
                (category) => {
                  const categoryAchievements = achievements.filter(
                    (a) => a.type === "session" && a.category === category
                  );
                  if (categoryAchievements.length === 0) return null;

                  const categoryNames = {
                    summer: "Summer Camp",
                    "school-go": "School Year - VEX GO",
                    "school-iq": "School Year - VEX IQ",
                    competition: "Competition Team",
                  };

                  return (
                    <div key={category} className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        {categoryNames[category]}
                      </h4>
                      <div className="space-y-2">
                        {categoryAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {achievement.icon}
                              </span>
                              <div>
                                <div className="font-semibold">
                                  {achievement.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {achievement.description} • {achievement.xp}{" "}
                                  XP
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAchievement(achievement.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Team Manager Modal (Same as before)
  const TeamManager = ({ students, currentSession, onClose }) => {
    const [teamName, setTeamName] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const sessionTeams = teams.filter((t) => t.session === currentSession);

    const createTeam = () => {
      if (!teamName || !teamNumber || selectedStudents.length === 0) return;

      const newTeam = {
        id: Date.now(),
        name: teamName,
        number: teamNumber,
        studentIds: selectedStudents,
        studentNames: students
          .filter((s) => selectedStudents.includes(s.id))
          .map((s) => s.name),
        session: currentSession,
        created: new Date().toISOString(),
      };

      setTeams([...teams, newTeam]);

      // Reset form
      setTeamName("");
      setTeamNumber("");
      setSelectedStudents([]);
    };

    const deleteTeam = (teamId) => {
      if (window.confirm("Delete this team?")) {
        setTeams(teams.filter((t) => t.id !== teamId));
      }
    };

    const toggleStudent = (studentId) => {
      if (selectedStudents.includes(studentId)) {
        setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
      } else if (selectedStudents.length < 3) {
        setSelectedStudents([...selectedStudents, studentId]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              👥 Team Management - {currentSession}
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Create New Team */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-3">Create New Team</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Lightning Bolts"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Number
                </label>
                <input
                  type="text"
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., T1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Team Members (2-3 students)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="mr-2"
                    />
                    <span
                      className={
                        selectedStudents.includes(student.id)
                          ? "font-semibold"
                          : ""
                      }
                    >
                      {student.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={createTeam}
              disabled={
                !teamName || !teamNumber || selectedStudents.length === 0
              }
              className="w-full py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 disabled:bg-gray-300"
            >
              Create Team ({selectedStudents.length} members)
            </button>
          </div>

          {/* Existing Teams */}
          <div>
            <h3 className="font-bold mb-3">Current Teams</h3>
            <div className="space-y-2">
              {sessionTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-lg">
                      {team.number}: {team.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Members: {team.studentNames.join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Teamwork Challenge Match Entry (2v0 Cooperative)
  const TeamworkMatchEntry = ({
    teams: allTeams,
    currentSession,
    onClose,
    onSave,
  }) => {
    const sessionTeams = allTeams.filter((t) => t.session === currentSession);
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");
    const [score, setScore] = useState("");
    const [matchNumber, setMatchNumber] = useState("");

    const saveMatch = () => {
      if (!team1 || !team2 || !score) return;

      const match = {
        id: Date.now(),
        session: currentSession,
        matchType: "teamwork",
        matchNumber: matchNumber || "TM" + (teamworkMatches.length + 1),
        teams: [parseInt(team1), parseInt(team2)],
        score: parseInt(score),
        timestamp: new Date().toISOString(),
      };

      onSave(match);

      // Reset form for quick entry
      setScore("");
      setMatchNumber("");
      // Keep teams selected for potential re-run
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🤝 Teamwork Challenge Match</h2>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
            <p className="text-blue-800">
              Two teams work together to score as many points as possible!
            </p>
          </div>

          {/* Match Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Match Number (optional)
            </label>
            <input
              type="text"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value.toUpperCase())}
              placeholder="e.g., TM1, Q1"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Team Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Alliance Partners
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Team 1</label>
                <select
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Team</option>
                  {sessionTeams
                    .filter((t) => t.id !== parseInt(team2))
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.number}: {team.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Team 2</label>
                <select
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Team</option>
                  {sessionTeams
                    .filter((t) => t.id !== parseInt(team1))
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.number}: {team.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Score Entry */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Alliance Score
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-4 text-3xl font-bold text-center border-2 border-blue-300 rounded"
              placeholder="0"
              autoFocus
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveMatch}
            disabled={!team1 || !team2 || !score}
            className="w-full py-3 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:bg-gray-300"
          >
            Save Match
          </button>
        </div>
      </div>
    );
  };

  // Skills Challenge Entry (Individual team runs)
  const SkillsEntry = ({
    teams: allTeams,
    currentSession,
    skillsType = "driver",
    onClose,
    onSave,
  }) => {
    const sessionTeams = allTeams.filter((t) => t.session === currentSession);
    const [teamId, setTeamId] = useState("");
    const [score, setScore] = useState("");

    const saveScore = () => {
      if (!teamId || !score) return;

      const skillsScore = {
        id: Date.now(),
        session: currentSession,
        teamId: parseInt(teamId),
        skillsType,
        score: parseInt(score),
        timestamp: new Date().toISOString(),
      };

      onSave(skillsScore);

      // Reset for next entry
      setScore("");
      // Keep team selected for multiple attempts
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {skillsType === "driver"
                ? "🎮 Driver Skills"
                : "🤖 Autonomous Skills"}
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Team Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Select Team
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Team</option>
              {sessionTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.number}: {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Score Entry */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-4 text-3xl font-bold text-center border-2 border-green-300 rounded"
              placeholder="0"
              autoFocus
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveScore}
            disabled={!teamId || !score}
            className="w-full py-3 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:bg-gray-300"
          >
            Save Score
          </button>
        </div>
      </div>
    );
  };

  // Tournament View with Rankings
  const TournamentView = ({
    teams: allTeams,
    teamworkMatches,
    skillsScores,
    currentSession,
    students,
    onClose,
  }) => {
    const sessionTeams = allTeams.filter((t) => t.session === currentSession);
    const sessionMatches = teamworkMatches.filter(
      (m) => m.session === currentSession
    );
    const sessionSkills = skillsScores.filter(
      (s) => s.session === currentSession
    );
    const [activeTab, setActiveTab] = useState("rankings");

    // Calculate team rankings based on average teamwork score
    const calculateRankings = () => {
      const teamStats = {};

      // Initialize stats for each team
      sessionTeams.forEach((team) => {
        teamStats[team.id] = {
          team,
          teamworkMatches: 0,
          teamworkTotal: 0,
          teamworkAverage: 0,
          teamworkHigh: 0,
          driverHigh: 0,
          autoHigh: 0,
          partners: [],
        };
      });

      // Process teamwork matches
      sessionMatches.forEach((match) => {
        match.teams.forEach((teamId) => {
          if (teamStats[teamId]) {
            teamStats[teamId].teamworkMatches++;
            teamStats[teamId].teamworkTotal += match.score;
            if (match.score > teamStats[teamId].teamworkHigh) {
              teamStats[teamId].teamworkHigh = match.score;
            }
            // Track partners
            const partnerId = match.teams.find((id) => id !== teamId);
            if (partnerId) {
              teamStats[teamId].partners.push(partnerId);
            }
          }
        });
      });

      // Process skills scores
      sessionSkills.forEach((score) => {
        if (teamStats[score.teamId]) {
          if (
            score.skillsType === "driver" &&
            score.score > teamStats[score.teamId].driverHigh
          ) {
            teamStats[score.teamId].driverHigh = score.score;
          } else if (
            score.skillsType === "autonomous" &&
            score.score > teamStats[score.teamId].autoHigh
          ) {
            teamStats[score.teamId].autoHigh = score.score;
          }
        }
      });

      // Calculate averages and sort by teamwork average
      return Object.values(teamStats)
        .map((stat) => ({
          ...stat,
          teamworkAverage:
            stat.teamworkMatches > 0
              ? (stat.teamworkTotal / stat.teamworkMatches).toFixed(1)
              : 0,
          skillsTotal: stat.driverHigh + stat.autoHigh,
        }))
        .sort((a, b) => b.teamworkAverage - a.teamworkAverage);
    };

    const rankings = calculateRankings();

    // Get team name helper
    const getTeamName = (teamId) => {
      const team = sessionTeams.find((t) => t.id === parseInt(teamId));
      return team ? `${team.number}: ${team.name}` : "Unknown Team";
    };

    // Get student match history
    const getStudentHistory = (studentId) => {
      const studentTeams = sessionTeams.filter((t) =>
        t.studentIds.includes(studentId)
      );
      const history = {
        teamwork: [],
        driver: [],
        autonomous: [],
      };

      studentTeams.forEach((team) => {
        // Teamwork matches
        sessionMatches.forEach((match) => {
          if (match.teams.includes(team.id)) {
            const partnerId = match.teams.find((id) => id !== team.id);
            history.teamwork.push({
              ...match,
              team,
              partner: getTeamName(partnerId),
              score: match.score,
            });
          }
        });

        // Skills scores
        sessionSkills
          .filter((s) => s.teamId === team.id)
          .forEach((score) => {
            if (score.skillsType === "driver") {
              history.driver.push({ ...score, team });
            } else {
              history.autonomous.push({ ...score, team });
            }
          });
      });

      return history;
    };

    // Generate alliance pairings for finals
    const generatePairings = () => {
      const pairings = [];
      for (let i = 0; i < rankings.length - 1; i += 2) {
        pairings.push({
          team1: rankings[i],
          team2: rankings[i + 1],
        });
      }
      return pairings;
    };

    const pairings = generatePairings();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              🏆 Tournament View - {currentSession}
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "rankings"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Rankings
            </button>
            <button
              onClick={() => setActiveTab("teamwork")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "teamwork"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Teamwork Matches
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "skills"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Skills Scores
            </button>
            <button
              onClick={() => setActiveTab("finals")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "finals"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Finals Pairings
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "students"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Student History
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "rankings" && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  Team Rankings (by Teamwork Average)
                </h3>
                <div className="space-y-2">
                  {rankings.map((stat, index) => (
                    <div
                      key={stat.team.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {stat.team.number}: {stat.team.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.team.studentNames.join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {stat.teamworkAverage} avg
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.teamworkMatches} matches | High:{" "}
                          {stat.teamworkHigh}
                        </div>
                        <div className="text-xs text-gray-500">
                          Skills: D{stat.driverHigh} + A{stat.autoHigh} ={" "}
                          {stat.skillsTotal}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "teamwork" && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  Teamwork Challenge Matches
                </h3>
                <div className="space-y-2">
                  {sessionMatches.map((match) => (
                    <div key={match.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {match.matchNumber || "Teamwork Match"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.teams
                              .map((id) => getTeamName(id))
                              .join(" + ")}
                          </div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-blue-600">
                            {match.score}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(match.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-3">🎮 Driver Skills</h3>
                  <div className="space-y-2">
                    {sessionSkills
                      .filter((s) => s.skillsType === "driver")
                      .sort((a, b) => b.score - a.score)
                      .map((score, index) => (
                        <div
                          key={score.id}
                          className="flex justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="text-gray-400 mr-2">
                              #{index + 1}
                            </span>
                            {getTeamName(score.teamId)}
                          </div>
                          <div className="font-bold text-blue-600">
                            {score.score}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">
                    🤖 Autonomous Skills
                  </h3>
                  <div className="space-y-2">
                    {sessionSkills
                      .filter((s) => s.skillsType === "autonomous")
                      .sort((a, b) => b.score - a.score)
                      .map((score, index) => (
                        <div
                          key={score.id}
                          className="flex justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="text-gray-400 mr-2">
                              #{index + 1}
                            </span>
                            {getTeamName(score.teamId)}
                          </div>
                          <div className="font-bold text-green-600">
                            {score.score}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "finals" && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  Finals Alliance Pairings
                </h3>
                <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
                  <p className="text-blue-800">
                    Based on rankings, pair teams for finals matches:
                  </p>
                </div>
                <div className="space-y-3">
                  {pairings.map((pairing, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded border-2 border-blue-300"
                    >
                      <div className="font-semibold mb-2">
                        Alliance {index + 1}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">
                            Rank #{rankings.indexOf(pairing.team1) + 1}
                          </div>
                          <div className="font-medium">
                            {pairing.team1.team.number}:{" "}
                            {pairing.team1.team.name}
                          </div>
                          <div className="text-sm">
                            Avg: {pairing.team1.teamworkAverage}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Rank #{rankings.indexOf(pairing.team2) + 1}
                          </div>
                          <div className="font-medium">
                            {pairing.team2.team.number}:{" "}
                            {pairing.team2.team.name}
                          </div>
                          <div className="text-sm">
                            Avg: {pairing.team2.teamworkAverage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded">
                  <p className="text-sm text-yellow-800">
                    Run finals matches with these pairings. Highest scoring
                    alliance wins the Teamwork Champion Award!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  Individual Student Performance
                </h3>
                <div className="space-y-4">
                  {students.map((student) => {
                    const history = getStudentHistory(student.id);
                    if (
                      history.teamwork.length === 0 &&
                      history.driver.length === 0 &&
                      history.autonomous.length === 0
                    ) {
                      return null;
                    }

                    const teamworkHigh = Math.max(
                      ...history.teamwork.map((m) => m.score),
                      0
                    );
                    const driverHigh = Math.max(
                      ...history.driver.map((s) => s.score),
                      0
                    );
                    const autoHigh = Math.max(
                      ...history.autonomous.map((s) => s.score),
                      0
                    );

                    return (
                      <div key={student.id} className="p-4 bg-gray-50 rounded">
                        <h4 className="font-bold text-lg mb-2">
                          {student.name}
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-600">
                              Teamwork
                            </div>
                            <div>Matches: {history.teamwork.length}</div>
                            <div>High Score: {teamworkHigh}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              Driver Skills
                            </div>
                            <div>Attempts: {history.driver.length}</div>
                            <div>High Score: {driverHigh}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              Auto Skills
                            </div>
                            <div>Attempts: {history.autonomous.length}</div>
                            <div>High Score: {autoHigh}</div>
                          </div>
                        </div>
                        {history.teamwork.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            Recent:{" "}
                            {
                              history.teamwork[history.teamwork.length - 1].team
                                .name
                            }{" "}
                            with{" "}
                            {
                              history.teamwork[history.teamwork.length - 1]
                                .partner
                            }{" "}
                            -{" "}
                            {
                              history.teamwork[history.teamwork.length - 1]
                                .score
                            }{" "}
                            pts
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const BulkAchievementAward = () => {
    const [selectedAchievement, setSelectedAchievement] = useState("");
    const [awardSuccess, setAwardSuccess] = useState(false);
    const [awardResults, setAwardResults] = useState({
      success: 0,
      skipped: 0,
    });

    const sessionCategory = getSessionCategory(getCurrentSessionObject());
    const availableAchievements = achievements.filter(
      (a) => a.type === "session" && a.category === sessionCategory
    );

    const lifetimeAchievements = achievements.filter(
      (a) => a.type === "lifetime"
    );

    const handleBulkAward = () => {
      if (!selectedAchievement || bulkSelectedStudents.length === 0) return;

      const achievement = achievements.find(
        (a) => a.id === parseInt(selectedAchievement)
      );
      if (!achievement) return;

      let successCount = 0;
      let skippedCount = 0;

      // Award to all selected students
      bulkSelectedStudents.forEach((studentId) => {
        const student = students.find((s) => s.id === studentId);
        if (!student) return;

        // Check if already earned
        let alreadyEarned = false;
        if (achievement.type === "lifetime") {
          alreadyEarned = student.achievements?.includes(achievement.id);
        } else {
          const sessionAchievements =
            student.sessionAchievements?.[currentSession] || [];
          alreadyEarned = sessionAchievements.includes(achievement.id);
        }

        if (!alreadyEarned) {
          awardAchievement(studentId, achievement.id);
          successCount++;
        } else {
          skippedCount++;
        }
      });

      // Show results
      setAwardResults({ success: successCount, skipped: skippedCount });
      setAwardSuccess(true);

      // Only close if at least one was successful
      if (successCount > 0) {
        setTimeout(() => {
          setAwardSuccess(false);
          setShowBulkAward(false);
          setBulkSelectedStudents([]);
          setSelectedAchievement("");
          setAwardResults({ success: 0, skipped: 0 });
        }, 3000);
      } else {
        // If all were skipped, just reset the success message
        setTimeout(() => {
          setAwardSuccess(false);
          setAwardResults({ success: 0, skipped: 0 });
        }, 3000);
      }
    };

    const toggleStudent = (studentId) => {
      if (bulkSelectedStudents.includes(studentId)) {
        setBulkSelectedStudents(
          bulkSelectedStudents.filter((id) => id !== studentId)
        );
      } else {
        setBulkSelectedStudents([...bulkSelectedStudents, studentId]);
      }
    };

    const selectAll = () => {
      setBulkSelectedStudents(students.map((s) => s.id));
    };

    const selectNone = () => {
      setBulkSelectedStudents([]);
    };

    // Preview which students already have the selected achievement
    const getStudentAchievementStatus = (studentId) => {
      if (!selectedAchievement)
        return { hasAchievement: false, earnedCount: 0 };

      const student = students.find((s) => s.id === studentId);
      const achievement = achievements.find(
        (a) => a.id === parseInt(selectedAchievement)
      );

      if (!student || !achievement)
        return { hasAchievement: false, earnedCount: 0 };

      if (achievement.type === "lifetime") {
        return {
          hasAchievement:
            student.achievements?.includes(achievement.id) || false,
          earnedCount: 0,
        };
      } else {
        const currentSessionAchievements =
          student.sessionAchievements?.[currentSession] || [];
        const hasInCurrentSession = currentSessionAchievements.includes(
          achievement.id
        );
        const earnedCount = getAchievementEarnCount(student, achievement.id);

        return {
          hasAchievement: hasInCurrentSession,
          earnedCount: earnedCount,
        };
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🏅 Bulk Achievement Award</h2>
            <button
              onClick={() => {
                setShowBulkAward(false);
                setBulkSelectedStudents([]);
                setSelectedAchievement("");
                setAwardSuccess(false);
                setAwardResults({ success: 0, skipped: 0 });
              }}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {awardSuccess && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                awardResults.success > 0
                  ? "bg-green-100 border border-green-300"
                  : "bg-yellow-100 border border-yellow-300"
              }`}
            >
              <p
                className={`font-semibold text-center ${
                  awardResults.success > 0
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                {awardResults.success > 0 &&
                  `✅ Achievement awarded to ${awardResults.success} student${
                    awardResults.success !== 1 ? "s" : ""
                  }!`}
                {awardResults.success > 0 && awardResults.skipped > 0 && " "}
                {awardResults.skipped > 0 &&
                  `⚠️ ${awardResults.skipped} student${
                    awardResults.skipped !== 1 ? "s" : ""
                  } already had this achievement.`}
                {awardResults.success === 0 &&
                  awardResults.skipped > 0 &&
                  "⚠️ All selected students already have this achievement!"}
              </p>
            </div>
          )}

          {/* Step 1: Select Students */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Step 1: Select Students</h3>
            <div className="flex gap-2 mb-3">
              <button
                onClick={selectAll}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Select All
              </button>
              <button
                onClick={selectNone}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Select None
              </button>
              <span className="ml-auto text-sm text-gray-600">
                {bulkSelectedStudents.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
              {students.map((student) => {
                const { hasAchievement, earnedCount } =
                  getStudentAchievementStatus(student.id);
                const isSelected = bulkSelectedStudents.includes(student.id);

                return (
                  <label
                    key={student.id}
                    className={`flex items-center p-2 rounded border cursor-pointer transition-colors relative ${
                      isSelected
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStudent(student.id)}
                      className="mr-2"
                    />
                    <span className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{student.avatar}</span>
                      <span className={isSelected ? "font-semibold" : ""}>
                        {student.name}
                      </span>
                    </span>
                    {selectedAchievement && hasAchievement && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2">
                        Has it
                      </span>
                    )}
                    {selectedAchievement &&
                      !hasAchievement &&
                      earnedCount > 0 && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded ml-2">
                          {earnedCount}x
                        </span>
                      )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Achievement */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              Step 2: Select Achievement
            </h3>

            <select
              value={selectedAchievement}
              onChange={(e) => setSelectedAchievement(e.target.value)}
              className="w-full p-3 border rounded"
            >
              <option value="">Select an achievement...</option>
              <optgroup label="Session Achievements">
                {availableAchievements.map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.icon} {achievement.name} ({achievement.xp} XP)
                    - {achievement.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Lifetime Achievements">
                {lifetimeAchievements.map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.icon} {achievement.name} ({achievement.xp} XP)
                    - {achievement.description}
                  </option>
                ))}
              </optgroup>
            </select>

            {selectedAchievement && (
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong>
                  {(() => {
                    const willReceive = bulkSelectedStudents.filter(
                      (id) => !getStudentAchievementStatus(id).hasAchievement
                    ).length;
                    const alreadyHave =
                      bulkSelectedStudents.length - willReceive;

                    return (
                      <span>
                        {" "}
                        {willReceive} student{willReceive !== 1 ? "s" : ""} will
                        receive this achievement
                        {alreadyHave > 0 && `, ${alreadyHave} already have it`}.
                      </span>
                    );
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Award Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowBulkAward(false);
                setBulkSelectedStudents([]);
                setSelectedAchievement("");
                setAwardSuccess(false);
                setAwardResults({ success: 0, skipped: 0 });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkAward}
              disabled={
                !selectedAchievement || bulkSelectedStudents.length === 0
              }
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 font-semibold"
            >
              Award to {bulkSelectedStudents.length} Student
              {bulkSelectedStudents.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Session Manager Modal
  const SessionManager = () => {
    const [newSession, setNewSession] = useState({
      name: "",
      type: "general",
      startDate: "",
      endDate: "",
      selectedDays: [],
    });
    const [editingSession, setEditingSession] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    const activeSessions = sessions
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order);
    const archivedSessions = sessions
      .filter((s) => !s.isActive)
      .sort((a, b) => a.order - b.order);

    // Helper function to generate class dates based on selected days
    const generateClassDates = (startDate, endDate, selectedDays) => {
      const dates = [];

      // Parse dates manually to avoid timezone issues
      const [startYear, startMonth, startDay] = startDate
        .split("-")
        .map(Number);
      const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

      // Create dates in local timezone
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);

      // Day names array for comparison
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      // Iterate through each day in the range
      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dayName = dayNames[date.getDay()];

        if (selectedDays.includes(dayName)) {
          // Format as YYYY-MM-DD string
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          dates.push(`${year}-${month}-${day}`);
        }
      }

      return dates;
    };

    const addSession = () => {
      if (!newSession.name) return;

      const session = {
        id: `session_${Date.now()}`,
        name: newSession.name,
        type: newSession.type,
        startDate: newSession.startDate
          ? new Date(newSession.startDate + "T00:00:00").toISOString()
          : null,
        endDate: newSession.endDate
          ? new Date(newSession.endDate + "T00:00:00").toISOString()
          : null,
        isActive: true,
        order: sessions.length,
        createdAt: new Date().toISOString(),
        // Scheduling fields
        scheduleType: newSession.selectedDays.length > 0 ? "weekly" : "custom",
        selectedDays: newSession.selectedDays,
        classDates:
          newSession.selectedDays.length > 0
            ? generateClassDates(
                newSession.startDate,
                newSession.endDate,
                newSession.selectedDays
              )
            : [],
      };

      setSessions([...sessions, session]);

      // If this is the first session OR current session doesn't exist, set it as current
      if (
        sessions.length === 0 ||
        !sessions.some((s) => s.name === currentSession)
      ) {
        setCurrentSession(session.name);
      }

      // Reset form
      setNewSession({
        name: "",
        type: "general",
        startDate: "",
        endDate: "",
        selectedDays: [],
      });
    };

    const updateSession = (sessionId, updates) => {
      setSessions(
        sessions.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
      );

      // Update currentSession if the name changed
      if (
        updates.name &&
        currentSession === sessions.find((s) => s.id === sessionId)?.name
      ) {
        setCurrentSession(updates.name);
      }

      setEditingSession(null);
    };

    const archiveSession = (sessionId) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session && session.name === currentSession) {
        alert(
          "Cannot archive the current session. Please switch to another session first."
        );
        return;
      }

      setSessions(
        sessions.map((s) =>
          s.id === sessionId ? { ...s, isActive: false } : s
        )
      );
    };

    const unarchiveSession = (sessionId) => {
      setSessions(
        sessions.map((s) => (s.id === sessionId ? { ...s, isActive: true } : s))
      );
    };

    const moveSession = (sessionId, direction) => {
      const sessionList = showArchived ? archivedSessions : activeSessions;
      const index = sessionList.findIndex((s) => s.id === sessionId);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === sessionList.length - 1)
      )
        return;

      const newOrder = direction === "up" ? index - 1 : index + 1;
      const otherSession = sessionList[newOrder];

      setSessions(
        sessions.map((s) => {
          if (s.id === sessionId) return { ...s, order: otherSession.order };
          if (s.id === otherSession.id)
            return { ...s, order: sessionList[index].order };
          return s;
        })
      );
    };

    const sessionTypeInfo = {
      summer: {
        label: "Summer Camp",
        color: "bg-yellow-100 text-yellow-800",
        icon: "☀️",
      },
      "school-go": {
        label: "School - VEX GO",
        color: "bg-green-100 text-green-800",
        icon: "🟢",
      },
      "school-iq": {
        label: "School - VEX IQ",
        color: "bg-blue-100 text-blue-800",
        icon: "🔵",
      },
      competition: {
        label: "Competition",
        color: "bg-purple-100 text-purple-800",
        icon: "🏆",
      },
      general: {
        label: "General",
        color: "bg-gray-100 text-gray-800",
        icon: "📅",
      },
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📅 Manage Sessions</h2>
            <button
              onClick={() => setShowSessionManager(false)}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Add New Session */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-3">Add New Session</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Session Name"
                value={newSession.name}
                onChange={(e) =>
                  setNewSession({ ...newSession, name: e.target.value })
                }
                className="px-3 py-2 border rounded"
              />
              <select
                value={newSession.type}
                onChange={(e) =>
                  setNewSession({ ...newSession, type: e.target.value })
                }
                className="px-3 py-2 border rounded"
              >
                <option value="general">General</option>
                <option value="summer">Summer Camp</option>
                <option value="school-go">School - VEX GO</option>
                <option value="school-iq">School - VEX IQ</option>
                <option value="competition">Competition</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-600">
                  Start Date (optional)
                </label>
                <input
                  type="date"
                  value={newSession.startDate}
                  onChange={(e) =>
                    setNewSession({ ...newSession, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={newSession.endDate}
                  onChange={(e) =>
                    setNewSession({ ...newSession, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {/* Day Selection - Add this new section */}
              {newSession.startDate && newSession.endDate && (
                <div className="mt-3">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Select Days
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const dayLower = day.toLowerCase();
                          setNewSession({
                            ...newSession,
                            selectedDays: newSession.selectedDays.includes(
                              dayLower
                            )
                              ? newSession.selectedDays.filter(
                                  (d) => d !== dayLower
                                )
                              : [...newSession.selectedDays, dayLower],
                          });
                        }}
                        className={`px-3 py-1 rounded ${
                          newSession.selectedDays.includes(day.toLowerCase())
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Generated Dates */}
              {newSession.startDate &&
                newSession.endDate &&
                newSession.selectedDays.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <label className="text-sm text-gray-600 font-semibold block mb-2">
                      Preview:{" "}
                      {
                        generateClassDates(
                          newSession.startDate,
                          newSession.endDate,
                          newSession.selectedDays
                        ).length
                      }{" "}
                      Classes
                    </label>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="text-xs text-gray-500 space-y-1">
                        {generateClassDates(
                          newSession.startDate,
                          newSession.endDate,
                          newSession.selectedDays
                        )
                          .slice(0, 10)
                          .map((date, index) => (
                            <div key={index}>
                              {new Date(date + "T12:00:00").toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          ))}
                        {generateClassDates(
                          newSession.startDate,
                          newSession.endDate,
                          newSession.selectedDays
                        ).length > 10 && (
                          <div className="font-semibold">
                            ... and{" "}
                            {generateClassDates(
                              newSession.startDate,
                              newSession.endDate,
                              newSession.selectedDays
                            ).length - 10}{" "}
                            more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex items-end">
                <button
                  onClick={addSession}
                  disabled={!newSession.name}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                >
                  Add Session
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">
              Active Sessions ({activeSessions.length})
            </h3>
            {activeSessions.length === 0 ? (
              <p className="text-gray-500 italic">
                No active sessions. Add one above!
              </p>
            ) : (
              <div className="space-y-2">
                {activeSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {editingSession === session.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={session.name}
                          onChange={(e) =>
                            setSessions(
                              sessions.map((s) =>
                                s.id === session.id
                                  ? { ...s, name: e.target.value }
                                  : s
                              )
                            )
                          }
                          className="flex-1 px-2 py-1 border rounded"
                          autoFocus
                        />
                        <select
                          value={session.type}
                          onChange={(e) =>
                            setSessions(
                              sessions.map((s) =>
                                s.id === session.id
                                  ? { ...s, type: e.target.value }
                                  : s
                              )
                            )
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value="general">General</option>
                          <option value="summer">Summer</option>
                          <option value="school-go">VEX GO</option>
                          <option value="school-iq">VEX IQ</option>
                          <option value="competition">Competition</option>
                        </select>
                        <button
                          onClick={() => {
                            const sessionToUpdate = sessions.find(
                              (s) => s.id === session.id
                            );
                            updateSession(session.id, {
                              name: sessionToUpdate.name,
                              type: sessionToUpdate.type,
                            });
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveSession(session.id, "up")}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveSession(session.id, "down")}
                            disabled={index === activeSessions.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {sessionTypeInfo[session.type]?.icon}
                            </span>
                            <span className="font-semibold">
                              {session.name}
                            </span>
                            {session.name === currentSession && (
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                                Current
                              </span>
                            )}
                            {/* Add enrolled count */}
                            <span className="text-sm text-gray-500">
                              (
                              {
                                students.filter(
                                  (s) =>
                                    s.enrolledSessions?.includes(
                                      session.name
                                    ) ||
                                    s.sessionsAttended?.includes(session.name)
                                ).length
                              }{" "}
                              students)
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                sessionTypeInfo[session.type]?.color
                              }`}
                            >
                              {sessionTypeInfo[session.type]?.label}
                            </span>
                            {session.startDate && (
                              <span className="ml-2">
                                {new Date(
                                  session.startDate
                                ).toLocaleDateString()}
                                {""}-
                                {session.endDate
                                  ? new Date(
                                      session.endDate
                                    ).toLocaleDateString()
                                  : "Ongoing"}
                              </span>
                            )}
                            {session.classDates &&
                              session.classDates.length > 0 && (
                                <span className="ml-2 text-xs">
                                  ({session.classDates.length} classes)
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSession(session.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => archiveSession(session.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Archive
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Archived Sessions */}
          {archivedSessions.length > 0 && (
            <div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3"
              >
                <span>{showArchived ? "▼" : "▶"}</span>
                <span className="font-semibold">
                  Archived Sessions ({archivedSessions.length})
                </span>
              </button>

              {showArchived && (
                <div className="space-y-2">
                  {archivedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg opacity-75"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {sessionTypeInfo[session.type]?.icon}
                          </span>
                          <span className="font-semibold">{session.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => unarchiveSession(session.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Attendance Manager Component
  const AttendanceManager = () => {
    const currentSessionObj = sessions.find((s) => s.name === currentSession);
    const [showAllDates, setShowAllDates] = useState(false);

    // Initialize with next class date or today
    const getDefaultDate = () => {
      const today = new Date().toISOString().split("T")[0];
      if (currentSessionObj?.classDates?.length > 0) {
        // Find the next upcoming class date or most recent past date
        const futureDates = currentSessionObj.classDates.filter(
          (date) => date >= today
        );
        const pastDates = currentSessionObj.classDates.filter(
          (date) => date < today
        );

        if (futureDates.length > 0) {
          return futureDates[0]; // Next upcoming class
        } else if (pastDates.length > 0) {
          return pastDates[pastDates.length - 1]; // Most recent past class
        }
      }
      return today;
    };

    // Use the parent state, or default if not set
    const selectedDate = attendanceSelectedDate || getDefaultDate();
    const setSelectedDate = setAttendanceSelectedDate;

    // Get students enrolled in current session
    const enrolledStudents = students.filter(
      (s) =>
        s.enrolledSessions?.includes(currentSession) ||
        s.sessionsAttended?.includes(currentSession)
    );

    // Check if selected date is a class date
    const isClassDate = currentSessionObj?.classDates?.includes(selectedDate);

    // Get or initialize attendance for this session and date
    const getAttendanceStatus = (studentId) => {
      return (
        attendance[currentSession]?.[selectedDate]?.[studentId] || "unmarked"
      );
    };

    const updateAttendance = (studentId, status) => {
      // Get current status
      const currentStatus =
        attendance[currentSession]?.[selectedDate]?.[studentId] || "unmarked";

      // If clicking the same status, clear it (set to unmarked)
      if (currentStatus === status) {
        setAttendance((prev) => {
          const newAttendance = { ...prev };
          if (!newAttendance[currentSession]) {
            newAttendance[currentSession] = {};
          }
          if (!newAttendance[currentSession][selectedDate]) {
            newAttendance[currentSession][selectedDate] = {};
          }
          // Delete the entry to mark as unmarked
          delete newAttendance[currentSession][selectedDate][studentId];
          return newAttendance;
        });
      } else {
        // Otherwise, set the new status
        setAttendance((prev) => ({
          ...prev,
          [currentSession]: {
            ...prev[currentSession],
            [selectedDate]: {
              ...prev[currentSession]?.[selectedDate],
              [studentId]: status,
            },
          },
        }));
      }
    };

    const markAllPresent = () => {
      const newDateAttendance = {};
      enrolledStudents.forEach((student) => {
        newDateAttendance[student.id] = "present";
      });

      setAttendance((prev) => ({
        ...prev,
        [currentSession]: {
          ...prev[currentSession],
          [selectedDate]: newDateAttendance,
        },
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              📅 Attendance - {currentSession}
            </h2>
            <button
              onClick={() => {
                setShowAttendanceManager(false);
                setAttendanceSelectedDate(null); // Reset the date
              }}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {!currentSessionObj ? (
            <p className="text-gray-600">Please select a session first.</p>
          ) : (
            <>
              {/* Date Selection */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Select Date:
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="ml-2 px-3 py-2 border rounded"
                    />
                  </div>
                  {isClassDate ? (
                    <span className="text-green-600 font-semibold">
                      ✓ Scheduled Class
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Not a scheduled class date
                    </span>
                  )}
                </div>

                {/* Quick Jump to Class Dates */}
                {currentSessionObj.classDates &&
                  currentSessionObj.classDates.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Quick jump to class:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {currentSessionObj.classDates
                          .slice(
                            0,
                            showAllDates
                              ? currentSessionObj.classDates.length
                              : 7
                          )
                          .map((date, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedDate(date)}
                              className={`px-3 py-1 text-sm rounded ${
                                date === selectedDate
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              {new Date(date + "T12:00:00").toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </button>
                          ))}
                        {currentSessionObj.classDates.length > 7 && (
                          <button
                            onClick={() => setShowAllDates(!showAllDates)}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {showAllDates
                              ? "− Show less"
                              : `+${
                                  currentSessionObj.classDates.length - 7
                                } more`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Attendance Actions */}
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-bold">
                  Students ({enrolledStudents.length})
                </h3>
                <button
                  onClick={markAllPresent}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark All Present
                </button>
              </div>

              {/* Warning for non-class dates */}
              {!isClassDate && enrolledStudents.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This is not a scheduled class date. You can still mark
                    attendance for makeup classes or special circumstances.
                  </p>
                </div>
              )}

              {/* Student Attendance List */}
              <div className="space-y-2">
                {enrolledStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No students enrolled in this session.
                  </p>
                ) : (
                  enrolledStudents.map((student) => {
                    const status = getAttendanceStatus(student.id);
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{student.avatar}</span>
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-gray-600">
                              {student.program}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateAttendance(student.id, "present")
                            }
                            className={`px-4 py-2 rounded ${
                              status === "present"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              updateAttendance(student.id, "absent")
                            }
                            className={`px-4 py-2 rounded ${
                              status === "absent"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => updateAttendance(student.id, "late")}
                            className={`px-4 py-2 rounded ${
                              status === "late"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Attendance Summary */}
              {enrolledStudents.length > 0 && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Summary for{" "}
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString()}:
                  </h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {
                          enrolledStudents.filter(
                            (s) => getAttendanceStatus(s.id) === "present"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {
                          enrolledStudents.filter(
                            (s) => getAttendanceStatus(s.id) === "absent"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          enrolledStudents.filter(
                            (s) => getAttendanceStatus(s.id) === "late"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Late</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-400">
                        {
                          enrolledStudents.filter(
                            (s) => getAttendanceStatus(s.id) === "unmarked"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Unmarked</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Add this component before your VEXLifetimeAchievementSystem component

  const AttendanceReport = ({
    sessions = [],
    students = [],
    attendance = {},
    onClose,
  }) => {
    // Get date 30 days ago and today
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [dateRange, setDateRange] = useState({
      start: thirtyDaysAgo.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    });
    const [selectedSession, setSelectedSession] = useState("all");
    const [showDetails, setShowDetails] = useState({});
    const [viewMode, setViewMode] = useState("table");

    // Get active sessions only
    const activeSessions = useMemo(() => {
      if (!sessions || !Array.isArray(sessions)) return [];
      return sessions
        .filter((s) => s && s.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [sessions]);

    // Calculate attendance data
    const attendanceData = useMemo(() => {
      const data = [];

      if (!dateRange.start || !dateRange.end) return data;

      const startDate = new Date(dateRange.start + "T00:00:00");
      const endDate = new Date(dateRange.end + "T23:59:59");

      // Get all relevant sessions
      const relevantSessions =
        selectedSession === "all"
          ? activeSessions
          : activeSessions.filter((s) => s.name === selectedSession);

      relevantSessions.forEach((session) => {
        if (
          !session ||
          !session.classDates ||
          !Array.isArray(session.classDates) ||
          session.classDates.length === 0
        )
          return;

        // Filter class dates within range
        const classesInRange = session.classDates.filter((date) => {
          if (!date) return false;
          const classDate = new Date(date + "T12:00:00");
          return classDate >= startDate && classDate <= endDate;
        });

        classesInRange.forEach((date) => {
          // Get enrolled students for this session
          const enrolledStudents = students.filter((s) => {
            if (!s) return false;
            return (
              (s.enrolledSessions &&
                s.enrolledSessions.includes(session.name)) ||
              (s.sessionsAttended && s.sessionsAttended.includes(session.name))
            );
          });

          // Calculate attendance for this date
          const attendanceRecord = {
            date,
            session: session.name || "Unknown Session",
            sessionType: session.type || "general",
            totalEnrolled: enrolledStudents.length,
            present: 0,
            absent: 0,
            late: 0,
            unmarked: 0,
            attendanceRate: 0,
            students: [],
          };

          enrolledStudents.forEach((student) => {
            const status =
              attendance?.[session.name]?.[date]?.[student.id] || "unmarked";

            attendanceRecord.students.push({
              id: student.id,
              name: student.name || "Unknown Student",
              program: student.program || "Unknown Program",
              status,
            });

            switch (status) {
              case "present":
                attendanceRecord.present++;
                break;
              case "absent":
                attendanceRecord.absent++;
                break;
              case "late":
                attendanceRecord.late++;
                break;
              default:
                attendanceRecord.unmarked++;
            }
          });

          // Calculate attendance rate (present + late)
          if (attendanceRecord.totalEnrolled > 0) {
            attendanceRecord.attendanceRate = Math.round(
              ((attendanceRecord.present + attendanceRecord.late) /
                attendanceRecord.totalEnrolled) *
                100
            );
          }

          data.push(attendanceRecord);
        });
      });

      // Sort by date
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [
      dateRange,
      selectedSession,
      sessions,
      students,
      attendance,
      activeSessions,
    ]);

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
      if (!attendanceData || attendanceData.length === 0) {
        return {
          averageAttendance: 0,
          totalClasses: 0,
          totalStudentDays: 0,
          bestDay: null,
          worstDay: null,
          trend: "stable",
        };
      }

      const totalAttendance = attendanceData.reduce(
        (sum, record) => sum + (record.attendanceRate || 0),
        0
      );
      const averageAttendance = Math.round(
        totalAttendance / attendanceData.length
      );

      const totalStudentDays = attendanceData.reduce(
        (sum, record) => sum + (record.totalEnrolled || 0),
        0
      );

      // Find best and worst days
      const sortedByAttendance = [...attendanceData].sort(
        (a, b) => (b.attendanceRate || 0) - (a.attendanceRate || 0)
      );
      const bestDay = sortedByAttendance[0];
      const worstDay = sortedByAttendance[sortedByAttendance.length - 1];

      // Calculate trend (compare first half to second half)
      const midpoint = Math.floor(attendanceData.length / 2);
      const firstHalf = attendanceData.slice(midpoint);
      const secondHalf = attendanceData.slice(0, midpoint);

      const firstHalfAvg =
        firstHalf.length > 0
          ? firstHalf.reduce((sum, r) => sum + (r.attendanceRate || 0), 0) /
            firstHalf.length
          : 0;
      const secondHalfAvg =
        secondHalf.length > 0
          ? secondHalf.reduce((sum, r) => sum + (r.attendanceRate || 0), 0) /
            secondHalf.length
          : 0;

      let trend = "stable";
      if (secondHalfAvg > firstHalfAvg + 5) trend = "improving";
      else if (secondHalfAvg < firstHalfAvg - 5) trend = "declining";

      return {
        averageAttendance: isNaN(averageAttendance) ? 0 : averageAttendance,
        totalClasses: attendanceData.length,
        totalStudentDays,
        bestDay,
        worstDay,
        trend,
      };
    }, [attendanceData]);

    // Get students with poor attendance
    const studentsWithPoorAttendance = useMemo(() => {
      if (!attendanceData || attendanceData.length === 0) return [];

      const studentAttendance = {};

      attendanceData.forEach((record) => {
        if (!record.students || !Array.isArray(record.students)) return;

        record.students.forEach((student) => {
          if (!student || !student.id) return;

          if (!studentAttendance[student.id]) {
            studentAttendance[student.id] = {
              name: student.name || "Unknown",
              program: student.program || "Unknown",
              totalClasses: 0,
              attended: 0,
              rate: 0,
            };
          }

          studentAttendance[student.id].totalClasses++;
          if (student.status === "present" || student.status === "late") {
            studentAttendance[student.id].attended++;
          }
        });
      });

      // Calculate rates and filter poor attendance (< 80%)
      return Object.values(studentAttendance)
        .map((student) => ({
          ...student,
          rate:
            student.totalClasses > 0
              ? Math.round((student.attended / student.totalClasses) * 100)
              : 0,
        }))
        .filter((student) => student.rate < 80)
        .sort((a, b) => a.rate - b.rate);
    }, [attendanceData]);

    // Toggle details for a specific date
    const toggleDetails = (index) => {
      setShowDetails((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    // Export functions
    const exportToCSV = () => {
      const headers = [
        "Date",
        "Session",
        "Total Enrolled",
        "Present",
        "Absent",
        "Late",
        "Unmarked",
        "Attendance Rate",
      ];
      const rows = attendanceData.map((record) => [
        new Date(record.date + "T12:00:00").toLocaleDateString(),
        record.session,
        record.totalEnrolled,
        record.present,
        record.absent,
        record.late,
        record.unmarked,
        `${record.attendanceRate}%`,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${dateRange.start}-to-${dateRange.end}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const getAttendanceColor = (rate) => {
      if (rate >= 90) return "text-green-600";
      if (rate >= 80) return "text-yellow-600";
      return "text-red-600";
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "present":
          return "bg-green-100 text-green-800";
        case "absent":
          return "bg-red-100 text-red-800";
        case "late":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              📈 Attendance Report
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="all">All Sessions</option>
                  {activeSessions.map((session) => (
                    <option key={session.id} value={session.name}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Actions
                </label>
                <button
                  onClick={exportToCSV}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  ⬇ Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {summaryStats.averageAttendance}%
              </div>
              <div className="text-sm text-gray-600">Average Attendance</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {summaryStats.totalClasses}
              </div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {summaryStats.totalStudentDays}
              </div>
              <div className="text-sm text-gray-600">Student Days</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                {summaryStats.trend === "improving" ? (
                  <span className="text-2xl">📈</span>
                ) : summaryStats.trend === "declining" ? (
                  <span className="text-2xl">📉</span>
                ) : (
                  <span className="text-2xl">→</span>
                )}
                <span className="text-lg font-semibold capitalize">
                  {summaryStats.trend}
                </span>
              </div>
              <div className="text-sm text-gray-600">Attendance Trend</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {studentsWithPoorAttendance.length}
              </div>
              <div className="text-sm text-gray-600">Students Below 80%</div>
            </div>
          </div>

          {/* Poor Attendance Alert */}
          {studentsWithPoorAttendance.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h3 className="font-semibold text-red-800">
                  Students Requiring Attention
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {studentsWithPoorAttendance.map((student) => (
                  <div
                    key={student.name}
                    className="flex justify-between items-center p-2 bg-white rounded"
                  >
                    <span className="font-medium">{student.name}</span>
                    <span
                      className={`font-bold ${getAttendanceColor(
                        student.rate
                      )}`}
                    >
                      {student.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {attendanceData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No attendance data found for the selected criteria.
              </div>
            ) : (
              <div className="space-y-2">
                {attendanceData.map((record, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleDetails(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-semibold">
                              {new Date(
                                record.date + "T12:00:00"
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm text-gray-600">
                              {record.session}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {record.present}
                            </div>
                            <div className="text-xs text-gray-600">Present</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {record.absent}
                            </div>
                            <div className="text-xs text-gray-600">Absent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {record.late}
                            </div>
                            <div className="text-xs text-gray-600">Late</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-3xl font-bold ${getAttendanceColor(
                                record.attendanceRate
                              )}`}
                            >
                              {record.attendanceRate}%
                            </div>
                            <div className="text-xs text-gray-600">
                              Attendance
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">
                              {showDetails[index] ? "▲" : "▼"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {showDetails[index] && (
                      <div className="px-4 pb-4 bg-gray-50 border-t">
                        <h4 className="font-semibold mb-2 mt-3">
                          Student Details
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {record.students.map((student) => (
                            <div
                              key={student.id}
                              className={`px-3 py-2 rounded text-sm ${getStatusColor(
                                student.status
                              )}`}
                            >
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs opacity-75">
                                {student.status.charAt(0).toUpperCase() +
                                  student.status.slice(1)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Tournament Wizard Component
  const TournamentWizard = () => {
    const [step, setStep] = useState(1);
    const [tournamentConfig, setTournamentConfig] = useState({
      name: "",
      format: "teamwork", // 'teamwork', 'driver', 'autonomous', 'custom'
      teams: [],
      matchesPerTeam: 3,
      skillsTrials: 3,
      scoringMethod: "highest", // 'highest' or 'average'
      customGameName: "",
    });

    // Check for active tournament
    const activeTournament = tournaments.find(
      (t) => t.sessionId === currentSession && t.status !== "complete"
    );

    // Get teams for current session
    const sessionTeams = teams.filter((t) => t.session === currentSession);

    const handleNext = () => {
      if (step === 1 && !tournamentConfig.name) {
        alert("Please enter a tournament name");
        return;
      }
      if (step === 2 && tournamentConfig.teams.length < 2) {
        alert("Please select at least 2 teams");
        return;
      }
      setStep(step + 1);
    };

    const handleBack = () => {
      setStep(step - 1);
    };

    const toggleTeam = (teamId) => {
      const newTeams = tournamentConfig.teams.includes(teamId)
        ? tournamentConfig.teams.filter((id) => id !== teamId)
        : [...tournamentConfig.teams, teamId];

      setTournamentConfig({
        ...tournamentConfig,
        teams: newTeams,
      });
    };

    const selectAllTeams = () => {
      setTournamentConfig({
        ...tournamentConfig,
        teams: sessionTeams.map((t) => t.id),
      });
    };

    const createTournament = () => {
      const newTournament = {
        id: `tournament_${Date.now()}`,
        sessionId: currentSession,
        sessionName:
          sessions.find((s) => s.id === currentSession)?.name || currentSession,
        name: tournamentConfig.name,
        format: tournamentConfig.format,
        status: "setup",
        date: new Date().toISOString(),
        config: {
          matchesPerTeam: tournamentConfig.matchesPerTeam,
          skillsTrials: tournamentConfig.skillsTrials,
          scoringMethod: tournamentConfig.scoringMethod,
          customGameName: tournamentConfig.customGameName,
        },
        teams: tournamentConfig.teams,
        matches: {
          quals: [],
          finals: [],
        },
        results: {
          qualRankings: [],
          finalRankings: [],
          awards: [],
          studentResults: {},
        },
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      // Generate qualification matches based on format
      if (tournamentConfig.format === "teamwork") {
        newTournament.matches.quals = generateQualificationMatches(
          tournamentConfig.teams,
          tournamentConfig.matchesPerTeam
        );
        newTournament.status = "quals";
      } else if (
        tournamentConfig.format === "driver" ||
        tournamentConfig.format === "autonomous"
      ) {
        // For skills, generate trial slots
        newTournament.matches.quals = generateSkillsTrials(
          tournamentConfig.teams,
          tournamentConfig.skillsTrials
        );
        newTournament.status = "quals";
      }

      setTournaments([...tournaments, newTournament]);
      setActiveTournament(newTournament);
      setShowTournamentWizard(false);
      setShowTournamentDashboard(true);
    };

    // Match generation algorithm for teamwork
    const generateQualificationMatches = (teamIds, matchesPerTeam) => {
      const matches = [];
      const teamPairings = new Map(); // Track which teams have been paired

      // Initialize pairing tracking
      teamIds.forEach((teamId) => {
        teamPairings.set(teamId, new Set());
      });

      let matchNumber = 1;

      // Generate matches ensuring each team plays matchesPerTeam times
      for (let round = 0; round < matchesPerTeam; round++) {
        const availableTeams = [...teamIds];

        while (availableTeams.length >= 2) {
          // Find the team with fewest matches so far
          const team1 = availableTeams.reduce((min, team) => {
            const team1Matches = matches.filter((m) =>
              m.teams.includes(team)
            ).length;
            const minMatches = matches.filter((m) =>
              m.teams.includes(min)
            ).length;
            return team1Matches < minMatches ? team : min;
          }, availableTeams[0]);

          // Remove team1 from available
          availableTeams.splice(availableTeams.indexOf(team1), 1);

          // Find best partner for team1 (one they haven't been paired with)
          const team1Pairings = teamPairings.get(team1);
          let team2 = availableTeams.find((t) => !team1Pairings.has(t));

          // If no unpaired partner, take any available
          if (!team2 && availableTeams.length > 0) {
            team2 = availableTeams[0];
          }

          if (team2) {
            // Remove team2 from available
            availableTeams.splice(availableTeams.indexOf(team2), 1);

            // Create match
            matches.push({
              id: `qual_${Date.now()}_${matchNumber}`,
              matchNumber: `Q${matchNumber}`,
              teams: [team1, team2],
              score: null,
              completed: false,
            });

            // Update pairings
            teamPairings.get(team1).add(team2);
            teamPairings.get(team2).add(team1);

            matchNumber++;
          }
        }
      }

      return matches;
    };

    // Generate skills trials
    const generateSkillsTrials = (teamIds, trialsPerTeam) => {
      const trials = [];
      let trialNumber = 1;

      teamIds.forEach((teamId) => {
        for (let i = 0; i < trialsPerTeam; i++) {
          trials.push({
            id: `trial_${Date.now()}_${trialNumber}`,
            trialNumber: `T${trialNumber}`,
            teamId: teamId,
            attempt: i + 1,
            score: null,
            completed: false,
          });
          trialNumber++;
        }
      });

      return trials;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Add warning banner if active tournament exists */}
          {activeTournament && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-300 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-orange-800">
                    ⚠️ Active Tournament in Progress
                  </p>
                  <p className="text-sm text-orange-700">
                    "{activeTournament.name}" is currently running. Creating a
                    new tournament won't delete it.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTournamentWizard(false);
                    setActiveTournament(activeTournament);
                    setShowTournamentDashboard(true);
                  }}
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                >
                  Go to Tournament
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🏆 Create Tournament</h2>
            <button
              onClick={() => setShowTournamentWizard(false)}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                1
              </div>
              <div
                className={`w-20 h-1 ${
                  step >= 2 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <div
                className={`w-20 h-1 ${
                  step >= 3 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 3 ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Step 1: Tournament Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  value={tournamentConfig.name}
                  onChange={(e) =>
                    setTournamentConfig({
                      ...tournamentConfig,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Week 3 Championship"
                  className="w-full px-3 py-2 border rounded-lg"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Tournament Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        format: "teamwork",
                      })
                    }
                    className={`p-4 rounded-lg border-2 ${
                      tournamentConfig.format === "teamwork"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🤝</div>
                    <div className="font-semibold">Teamwork Challenge</div>
                    <div className="text-sm text-gray-600">2v0 Cooperative</div>
                  </button>

                  <button
                    onClick={() =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        format: "driver",
                      })
                    }
                    className={`p-4 rounded-lg border-2 ${
                      tournamentConfig.format === "driver"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🎮</div>
                    <div className="font-semibold">Driver Skills</div>
                    <div className="text-sm text-gray-600">Individual</div>
                  </button>

                  <button
                    onClick={() =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        format: "autonomous",
                      })
                    }
                    className={`p-4 rounded-lg border-2 ${
                      tournamentConfig.format === "autonomous"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="font-semibold">Autonomous Skills</div>
                    <div className="text-sm text-gray-600">Individual</div>
                  </button>

                  <button
                    onClick={() =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        format: "custom",
                      })
                    }
                    className={`p-4 rounded-lg border-2 ${
                      tournamentConfig.format === "custom"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">⚙️</div>
                    <div className="font-semibold">Custom Game</div>
                    <div className="text-sm text-gray-600">
                      Other challenges
                    </div>
                  </button>
                </div>
              </div>

              {tournamentConfig.format === "custom" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Custom Game Name
                  </label>
                  <input
                    type="text"
                    value={tournamentConfig.customGameName}
                    onChange={(e) =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        customGameName: e.target.value,
                      })
                    }
                    placeholder="e.g., Tower Takeover"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Teams */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Step 2: Select Teams
              </h3>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  Selected: {tournamentConfig.teams.length} teams
                </span>
                <button
                  onClick={selectAllTeams}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Select All
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessionTeams.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No teams found for this session. Please create teams first.
                  </p>
                ) : (
                  sessionTeams.map((team) => (
                    <label
                      key={team.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                        tournamentConfig.teams.includes(team.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={tournamentConfig.teams.includes(team.id)}
                        onChange={() => toggleTeam(team.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {team.number}: {team.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {team.studentNames.join(", ")}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Step 3: Tournament Configuration
              </h3>

              {tournamentConfig.format === "teamwork" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Qualification Matches per Team
                  </label>
                  <select
                    value={tournamentConfig.matchesPerTeam}
                    onChange={(e) =>
                      setTournamentConfig({
                        ...tournamentConfig,
                        matchesPerTeam: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={1}>1 match</option>
                    <option value={2}>2 matches</option>
                    <option value={3}>3 matches</option>
                    <option value={4}>4 matches</option>
                    <option value={5}>5 matches</option>
                    <option value={6}>6 matches</option>
                    <option value={7}>7 matches</option>
                    <option value={8}>8 matches</option>
                  </select>
                </div>
              )}

              {(tournamentConfig.format === "driver" ||
                tournamentConfig.format === "autonomous") && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Trial Runs per Team
                    </label>
                    <select
                      value={tournamentConfig.skillsTrials}
                      onChange={(e) =>
                        setTournamentConfig({
                          ...tournamentConfig,
                          skillsTrials: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value={1}>1 trial</option>
                      <option value={2}>2 trials</option>
                      <option value={3}>3 trials</option>
                      <option value={4}>4 trials</option>
                      <option value={5}>5 trials</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Scoring Method
                    </label>
                    <select
                      value={tournamentConfig.scoringMethod}
                      onChange={(e) =>
                        setTournamentConfig({
                          ...tournamentConfig,
                          scoringMethod: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="highest">Highest Score</option>
                      <option value="average">Average Score</option>
                    </select>
                  </div>
                </>
              )}

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Tournament Summary</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {tournamentConfig.name}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span>{" "}
                    {tournamentConfig.format === "teamwork"
                      ? "Teamwork Challenge"
                      : tournamentConfig.format === "driver"
                      ? "Driver Skills"
                      : tournamentConfig.format === "autonomous"
                      ? "Autonomous Skills"
                      : `Custom: ${tournamentConfig.customGameName}`}
                  </div>
                  <div>
                    <span className="font-medium">Teams:</span>{" "}
                    {tournamentConfig.teams.length}
                  </div>
                  {tournamentConfig.format === "teamwork" && (
                    <div>
                      <span className="font-medium">Matches per team:</span>{" "}
                      {tournamentConfig.matchesPerTeam}
                    </div>
                  )}
                  {(tournamentConfig.format === "driver" ||
                    tournamentConfig.format === "autonomous") && (
                    <>
                      <div>
                        <span className="font-medium">Trials per team:</span>{" "}
                        {tournamentConfig.skillsTrials}
                      </div>
                      <div>
                        <span className="font-medium">Scoring:</span>{" "}
                        {tournamentConfig.scoringMethod}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded ${
                step === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={createTournament}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
              >
                Create Tournament
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Tournament Dashboard Component
  const TournamentDashboard = () => {
    const currentTournament = activeTournament;
    const [activeTab, setActiveTab] = useState("overview");

    if (!currentTournament) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <p>No active tournament found.</p>
            <button
              onClick={() => setShowTournamentDashboard(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    // Get tournament teams
    const tournamentTeams = teams.filter((t) =>
      currentTournament.teams.includes(t.id)
    );

    // Get tournament matches
    const qualMatches = currentTournament.matches.quals || [];
    const finalMatches = currentTournament.matches.finals || [];

    // Calculate progress
    const completedQuals = qualMatches.filter((m) => m.completed).length;
    const totalQuals = qualMatches.length;
    const qualProgress =
      totalQuals > 0 ? (completedQuals / totalQuals) * 100 : 0;

    const completedFinals = finalMatches.filter((m) => m.completed).length;
    const totalFinals = finalMatches.length;
    const finalProgress =
      totalFinals > 0 ? (completedFinals / totalFinals) * 100 : 0;

    // Get next match to run
    const getNextMatch = () => {
      if (currentTournament.status === "quals") {
        return qualMatches.find((m) => !m.completed);
      } else if (currentTournament.status === "finals") {
        return finalMatches.find((m) => !m.completed);
      }
      return null;
    };

    const nextMatch = getNextMatch();

    // Calculate rankings from qualification matches
    const calculateQualRankings = () => {
      const teamStats = {};

      // Initialize stats for each team
      currentTournament.teams.forEach((teamId) => {
        teamStats[teamId] = {
          teamId,
          matches: 0,
          totalScore: 0,
          scores: [],
          average: 0,
        };
      });

      // Process completed qual matches
      qualMatches
        .filter((m) => m.completed)
        .forEach((match) => {
          if (currentTournament.format === "teamwork") {
            // For teamwork, both teams get the same score
            match.teams.forEach((teamId) => {
              teamStats[teamId].matches++;
              teamStats[teamId].totalScore += match.score;
              teamStats[teamId].scores.push(match.score);
            });
          } else {
            // For skills, individual scores
            const teamId = match.teamId;
            teamStats[teamId].matches++;
            teamStats[teamId].totalScore += match.score;
            teamStats[teamId].scores.push(match.score);
          }
        });

      // Calculate averages or highest based on scoring method
      Object.values(teamStats).forEach((stat) => {
        if (stat.matches > 0) {
          if (currentTournament.format === "teamwork") {
            // Teamwork always uses average
            stat.average = (stat.totalScore / stat.matches).toFixed(1);
          } else {
            // Skills uses configured scoring method
            if (currentTournament.config.scoringMethod === "average") {
              stat.average = (stat.totalScore / stat.matches).toFixed(1);
            } else {
              // Highest score
              stat.average = Math.max(...stat.scores);
            }
          }
        }
      });

      // Sort by average/highest score
      return Object.values(teamStats).sort((a, b) => b.average - a.average);
    };

    const rankings = calculateQualRankings();

    // Generate finals matches based on rankings
    const generateFinals = () => {
      if (currentTournament.format !== "teamwork") {
        alert("Finals are only for teamwork tournaments");
        return;
      }

      const finalMatches = [];
      let matchNumber = 1;

      // Pair teams: 1st+2nd, 3rd+4th, etc.
      // But add them in reverse order (lowest ranks first)
      const pairings = [];
      for (let i = 0; i < rankings.length - 1; i += 2) {
        pairings.push({
          teams: [rankings[i].teamId, rankings[i + 1].teamId],
          rankSum: i + 1 + (i + 2), // Sum of ranks for ordering
        });
      }

      // Sort by rank sum (highest first = lowest ranked teams)
      pairings.sort((a, b) => b.rankSum - a.rankSum);

      // Create matches in order
      pairings.forEach((pairing) => {
        finalMatches.push({
          id: `final_${Date.now()}_${matchNumber}`,
          matchNumber: `F${matchNumber}`,
          teams: pairing.teams,
          score: null,
          completed: false,
        });
        matchNumber++;
      });

      // If odd number of teams, last team gets a bye
      if (rankings.length % 2 === 1) {
        console.log("Odd number of teams - last team needs special handling");
      }

      // Update tournament
      const updatedTournament = {
        ...currentTournament,
        matches: {
          ...currentTournament.matches,
          finals: finalMatches,
        },
        status: "finals",
      };

      setTournaments(
        tournaments.map((t) =>
          t.id === currentTournament.id ? updatedTournament : t
        )
      );
      setActiveTournament(updatedTournament);
    };

    // Complete tournament and go to awards
    const completeTournament = () => {
      // Calculate final rankings
      const finalRankings = [];

      if (currentTournament.format === "teamwork") {
        // For teamwork, rank by ALLIANCE (finals match score)
        const allianceScores = {};

        // Group teams by their finals match
        finalMatches
          .filter((m) => m.completed)
          .forEach((match) => {
            // Both teams in an alliance get the same score
            const allianceKey = match.teams.sort().join("-");
            allianceScores[allianceKey] = {
              teams: match.teams,
              score: match.score,
              matchId: match.id,
            };
          });

        // Convert to rankings array and sort by score
        const sortedAlliances = Object.values(allianceScores).sort(
          (a, b) => b.score - a.score
        );

        // Assign ranks to alliances
        sortedAlliances.forEach((alliance, index) => {
          const rank = index + 1;
          // Both teams in the alliance get the same rank
          alliance.teams.forEach((teamId) => {
            finalRankings.push({
              teamId: teamId,
              score: alliance.score,
              rank: rank,
              alliancePartner: alliance.teams.find((id) => id !== teamId),
            });
          });
        });
      } else {
        // For skills, use qual rankings as final rankings
        rankings.forEach((stat, index) => {
          finalRankings.push({
            teamId: stat.teamId,
            score: parseFloat(stat.average),
            rank: index + 1,
          });
        });
      }

      // Update tournament with final results
      const updatedTournament = {
        ...currentTournament,
        status: "complete",
        completedAt: new Date().toISOString(),
        results: {
          ...currentTournament.results,
          qualRankings: rankings,
          finalRankings: finalRankings,
        },
      };

      setTournaments(
        tournaments.map((t) =>
          t.id === currentTournament.id ? updatedTournament : t
        )
      );
      setActiveTournament(updatedTournament);

      updateStudentTournamentHistory(updatedTournament);

      // Show awards ceremony
      setShowTournamentDashboard(false);
      setShowAwardsCeremony(true);
    };

    // Handle match score entry
    const handleMatchScore = (matchId, score) => {
      const isQual = currentTournament.status === "quals";
      const matches = isQual ? qualMatches : finalMatches;

      const updatedMatches = matches.map((m) =>
        m.id === matchId ? { ...m, score: parseInt(score), completed: true } : m
      );

      const updatedTournament = {
        ...currentTournament,
        matches: {
          ...currentTournament.matches,
          [isQual ? "quals" : "finals"]: updatedMatches,
        },
      };

      setTournaments(
        tournaments.map((t) =>
          t.id === currentTournament.id ? updatedTournament : t
        )
      );
      setActiveTournament(updatedTournament);

      // Save to teamworkMatches for history
      if (currentTournament.format === "teamwork") {
        const match = updatedMatches.find((m) => m.id === matchId);
        handleSaveTeamworkMatch({
          id: Date.now(),
          session: currentSession,
          matchType: isQual ? "qual" : "final",
          tournamentId: currentTournament.id,
          matchNumber: match.matchNumber,
          teams: match.teams,
          score: parseInt(score),
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Render match card
    const MatchCard = ({ match, showScore = true }) => {
      const [score, setScore] = useState(match.score || "");
      const [isEditing, setIsEditing] = useState(false);

      const matchTeams =
        currentTournament.format === "teamwork"
          ? tournamentTeams.filter((t) => match.teams.includes(t.id))
          : [tournamentTeams.find((t) => t.id === match.teamId)];

      const handleSave = () => {
        if (score) {
          handleMatchScore(match.id, score);
          setIsEditing(false);
        }
      };

      return (
        <div
          className={`p-4 rounded-lg border ${
            match.completed
              ? "bg-green-50 border-green-300"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{match.matchNumber}</div>
              <div className="text-sm text-gray-600">
                {currentTournament.format === "teamwork"
                  ? matchTeams.map((t) => `${t.number}: ${t.name}`).join(" + ")
                  : `${matchTeams[0].number}: ${matchTeams[0].name} - Attempt ${match.attempt}`}
              </div>
            </div>
            {showScore && (
              <div className="text-right">
                {match.completed && !isEditing ? (
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {match.score}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="Score"
                      className="w-20 px-2 py-1 border rounded text-center"
                      autoFocus
                    />
                    <button
                      onClick={handleSave}
                      disabled={!score}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🏆 {currentTournament.name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Format:</span>
                    {currentTournament.format === "teamwork"
                      ? "🤝 Teamwork"
                      : currentTournament.format === "driver"
                      ? "🎮 Driver Skills"
                      : currentTournament.format === "autonomous"
                      ? "🤖 Autonomous"
                      : `⚙️ ${currentTournament.config.customGameName}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        currentTournament.status === "quals"
                          ? "bg-blue-100 text-blue-800"
                          : currentTournament.status === "finals"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {currentTournament.status.toUpperCase()}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* NEW: View All Tournaments button */}
                <button
                  onClick={() => {
                    setShowTournamentDashboard(false);
                    setShowTournamentHistory(true);
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  📋 View All
                </button>

                {/* KEEP the existing close button */}
                <button
                  onClick={() => setShowTournamentDashboard(false)}
                  className="text-2xl hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Qualification Matches</span>
                  <span>
                    {completedQuals}/{totalQuals}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${qualProgress}%` }}
                  />
                </div>
              </div>
              {currentTournament.format === "teamwork" && totalFinals > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Final Matches</span>
                    <span>
                      {completedFinals}/{totalFinals}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${finalProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-6 py-3 font-medium ${
                activeTab === "matches"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-6 py-3 font-medium ${
                activeTab === "rankings"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Rankings
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Next Match */}
                {nextMatch && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      🎯 Next Match
                    </h3>
                    <MatchCard match={nextMatch} />
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {tournamentTeams.length}
                    </div>
                    <div className="text-sm text-gray-600">Teams Competing</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {completedQuals + completedFinals}
                    </div>
                    <div className="text-sm text-gray-600">
                      Matches Complete
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {totalQuals +
                        totalFinals -
                        completedQuals -
                        completedFinals}
                    </div>
                    <div className="text-sm text-gray-600">
                      Matches Remaining
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  {currentTournament.status === "quals" &&
                    qualProgress === 100 && (
                      <button
                        onClick={generateFinals}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
                      >
                        Generate Finals Matches
                      </button>
                    )}
                  {((currentTournament.status === "finals" &&
                    finalProgress === 100) ||
                    (currentTournament.format !== "teamwork" &&
                      qualProgress === 100)) && (
                    <button
                      onClick={completeTournament}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                    >
                      Complete Tournament & Awards
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Matches Tab */}
            {activeTab === "matches" && (
              <div className="space-y-6">
                {currentTournament.status === "quals" ||
                currentTournament.status === "complete" ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Qualification Matches
                    </h3>
                    <div className="space-y-2">
                      {qualMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {(currentTournament.status === "finals" ||
                  (currentTournament.status === "complete" &&
                    finalMatches.length > 0)) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Final Matches
                    </h3>
                    <div className="space-y-2">
                      {finalMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rankings Tab */}
            {activeTab === "rankings" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Current Rankings
                  {currentTournament.format === "teamwork"
                    ? " (By Average Score)"
                    : currentTournament.config.scoringMethod === "average"
                    ? " (By Average)"
                    : " (By Highest Score)"}
                </h3>
                <div className="space-y-2">
                  {rankings.map((stat, index) => {
                    const team = tournamentTeams.find(
                      (t) => t.id === stat.teamId
                    );
                    if (!team) return null;

                    return (
                      <div
                        key={stat.teamId}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-gray-400 w-12">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">
                              {team.number}: {team.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {team.studentNames.join(", ")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {stat.average}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.matches} matches
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TournamentHistory = ({
    tournaments,
    sessions,
    teams,
    students,
    onClose,
    onViewTournament,
  }) => {
    const [filterSession, setFilterSession] = useState("ALL");
    const [filterFormat, setFilterFormat] = useState("ALL");
    const [filterDateRange, setFilterDateRange] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    // Get all completed tournaments
    const completedTournaments = tournaments.filter(
      (t) => t.status === "complete"
    );

    // Apply filters
    const filteredTournaments = completedTournaments.filter((tournament) => {
      // Session filter
      if (filterSession !== "ALL" && tournament.sessionId !== filterSession) {
        return false;
      }

      // Format filter
      if (filterFormat !== "ALL" && tournament.format !== filterFormat) {
        return false;
      }

      // Date range filter
      if (filterDateRange !== "ALL") {
        const tournamentDate = new Date(
          tournament.completedAt || tournament.createdAt
        );
        const now = new Date();
        const daysDiff = Math.floor(
          (now - tournamentDate) / (1000 * 60 * 60 * 24)
        );

        switch (filterDateRange) {
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
          case "season":
            if (daysDiff > 90) return false;
            break;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tournament.name.toLowerCase().includes(query) ||
          tournament.sessionName?.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort tournaments
    const sortedTournaments = [...filteredTournaments].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.completedAt || b.createdAt) -
            new Date(a.completedAt || a.createdAt)
          );
        case "date-asc":
          return (
            new Date(a.completedAt || a.createdAt) -
            new Date(b.completedAt || b.createdAt)
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "participants":
          return b.teams.length - a.teams.length;
        default:
          return 0;
      }
    });

    // Get tournament champion(s)
    const getChampions = (tournament) => {
      const champions = tournament.results.finalRankings
        .filter((r) => r.rank === 1)
        .map((r) => {
          const team = teams.find((t) => t.id === r.teamId);
          return team ? team.name : "Unknown Team";
        });
      return champions;
    };

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    // Tournament Card Component
    const TournamentCard = ({ tournament }) => {
      const champions = getChampions(tournament);
      const participantCount = tournament.teams.length;
      const matchCount =
        (tournament.matches.quals?.length || 0) +
        (tournament.matches.finals?.length || 0);
      const isArchived = !sessions.find((s) => s.id === tournament.sessionId)
        ?.isActive;

      return (
        <div
          className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
            isArchived ? "opacity-75" : ""
          }`}
          onClick={() => onViewTournament(tournament)}
        >
          {/* Header */}
          <div
            className={`p-4 rounded-t-lg ${
              tournament.format === "teamwork"
                ? "bg-blue-500"
                : tournament.format === "driver"
                ? "bg-green-500"
                : "bg-purple-500"
            } text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{tournament.name}</h3>
                <p className="text-sm opacity-90">
                  {tournament.sessionName || tournament.sessionId}
                  {isArchived && " (Archived)"}
                </p>
              </div>
              <div className="text-2xl">
                {tournament.format === "teamwork"
                  ? "🤝"
                  : tournament.format === "driver"
                  ? "🎮"
                  : "🤖"}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {formatDate(tournament.completedAt || tournament.createdAt)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Teams:</span>
              <span className="font-medium">{participantCount}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Matches:</span>
              <span className="font-medium">{matchCount}</span>
            </div>

            <div className="border-t pt-3">
              <div className="text-sm text-gray-600 mb-1">🏆 Champions:</div>
              <div className="font-semibold text-gray-800">
                {champions.join(" & ")}
              </div>
            </div>
          </div>
        </div>
      );
    };

    // Tournament List Row Component
    const TournamentRow = ({ tournament }) => {
      const champions = getChampions(tournament);
      const participantCount = tournament.teams.length;
      const isArchived = !sessions.find((s) => s.id === tournament.sessionId)
        ?.isActive;

      return (
        <tr
          className={`hover:bg-gray-50 cursor-pointer ${
            isArchived ? "opacity-75" : ""
          }`}
          onClick={() => onViewTournament(tournament)}
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {tournament.format === "teamwork"
                  ? "🤝"
                  : tournament.format === "driver"
                  ? "🎮"
                  : "🤖"}
              </span>
              <div>
                <div className="font-medium">{tournament.name}</div>
                <div className="text-sm text-gray-600">
                  {tournament.sessionName || tournament.sessionId}
                  {isArchived && " (Archived)"}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-sm">
            {formatDate(tournament.completedAt || tournament.createdAt)}
          </td>
          <td className="px-4 py-3 text-sm capitalize">{tournament.format}</td>
          <td className="px-4 py-3 text-sm text-center">{participantCount}</td>
          <td className="px-4 py-3">
            <div className="font-medium text-sm">{champions.join(" & ")}</div>
          </td>
        </tr>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">🏆 Tournament History</h2>
              <button
                onClick={onClose}
                className="text-2xl hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Session Filter */}
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="ALL">All Sessions</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name} {!session.isActive && "(Archived)"}
                  </option>
                ))}
              </select>

              {/* Format Filter */}
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="ALL">All Formats</option>
                <option value="teamwork">Teamwork</option>
                <option value="driver">Driver Skills</option>
                <option value="autonomous">Autonomous</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="ALL">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="season">This Season</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name">Name</option>
                  <option value="participants">Most Teams</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {sortedTournaments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">
                  No Tournaments Found
                </h3>
                <p className="text-gray-600">
                  {completedTournaments.length === 0
                    ? "No tournaments have been completed yet."
                    : "Try adjusting your filters to see tournaments."}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-2">Tournament</th>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Format</th>
                    <th className="text-center px-4 py-2">Teams</th>
                    <th className="text-left px-4 py-2">Champions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTournaments.map((tournament) => (
                    <TournamentRow
                      key={tournament.id}
                      tournament={tournament}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary Stats */}
          {completedTournaments.length > 0 && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {completedTournaments.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Tournaments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.filter((s) => s.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {sessions.filter((s) => !s.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Archived Sessions</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Awards Ceremony Component
  const AwardsCeremony = () => {
    const tournament = activeTournament;
    const [currentReveal, setCurrentReveal] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [awardedAchievements, setAwardedAchievements] = useState([]);
    const [awardedXP, setAwardedXP] = useState({});

    if (!tournament || tournament.status !== "complete") {
      return null;
    }

    // Get tournament teams and students
    const tournamentTeams = teams.filter((t) =>
      tournament.teams.includes(t.id)
    );
    const finalRankings = tournament.results.finalRankings || [];

    // Calculate rank groups and total here (MOVED OUTSIDE THE IIFE)
    const rankGroups = {};
    finalRankings.forEach((ranking) => {
      if (!rankGroups[ranking.rank]) {
        rankGroups[ranking.rank] = [];
      }
      rankGroups[ranking.rank].push(ranking);
    });
    const totalRankGroups = Object.keys(rankGroups).length;

    // Define achievements to award
    const tournamentAchievements = {
      1: {
        name: "Tournament Champion",
        icon: "🏆",
        xp: 100,
        description: "Won 1st place in a tournament!",
      },
      2: {
        name: "Silver Medal",
        icon: "🥈",
        xp: 75,
        description: "Won 2nd place in a tournament!",
      },
      3: {
        name: "Bronze Medal",
        icon: "🥉",
        xp: 50,
        description: "Won 3rd place in a tournament!",
      },
      participation: {
        name: "Tournament Competitor",
        icon: "🎯",
        xp: 25,
        description: "Participated in a tournament!",
      },
    };

    // Award achievements and XP
    const processAwards = () => {
      // Check if already processed
      if (tournament.awardsProcessed) return;

      const awards = [];
      const xpAwards = {};

      finalRankings.forEach((ranking) => {
        const team = tournamentTeams.find((t) => t.id === ranking.teamId);
        if (!team) return;

        // Determine achievement based on rank
        let achievement = null;
        if (ranking.rank <= 3) {
          achievement = tournamentAchievements[ranking.rank];
        } else {
          achievement = tournamentAchievements.participation;
        }

        // Award to each team member
        team.studentIds.forEach((studentId) => {
          // Track what we're awarding
          awards.push({
            studentId,
            achievement,
            teamName: team.name,
            rank: ranking.rank,
          });

          // Award XP
          if (!xpAwards[studentId]) {
            xpAwards[studentId] = 0;
          }
          xpAwards[studentId] += achievement.xp;

          // Actually award the XP (30% goes to lifetime)
          awardXP(studentId, achievement.xp, false);
        });
      });

      setAwardedAchievements(awards);
      setAwardedXP(xpAwards);

      // Mark as processed
      const updatedTournament = {
        ...tournament,
        awardsProcessed: true,
      };

      setTournaments(
        tournaments.map((t) => (t.id === tournament.id ? updatedTournament : t))
      );
      setActiveTournament(updatedTournament);
    };

    // Process awards on mount
    useEffect(() => {
      processAwards();

      // Start reveal animation
      const timer = setTimeout(() => {
        setCurrentReveal(1);
      }, 500);

      return () => clearTimeout(timer);
    }, []);

    // Handle reveal steps
    const handleNextReveal = () => {
      if (currentReveal < totalRankGroups) {
        const nextReveal = currentReveal + 1;
        setCurrentReveal(nextReveal);

        // Show confetti when revealing 1st place (champions)
        // This happens when we've revealed all ranks
        if (nextReveal === totalRankGroups) {
          setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }, 500); // Small delay for dramatic effect
        }
      }
    };

    const handleComplete = () => {
      // Mark tournament as awarded
      const updatedTournament = {
        ...tournament,
        awardsPresented: true,
      };

      setTournaments(
        tournaments.map((t) => (t.id === tournament.id ? updatedTournament : t))
      );

      setShowAwardsCeremony(false);
      setActiveTournament(null);
    };

    const Confetti = () => {
      if (!showConfetti) return null;

      return (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {[...Array(50)].map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 3 + Math.random() * 2;

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: "-10%",
                  animation: `fall ${duration}s linear ${delay}s forwards`,
                  WebkitAnimation: `fall ${duration}s linear ${delay}s forwards`,
                }}
              >
                <div
                  className="text-4xl"
                  style={{
                    animation: `spin ${1 + Math.random() * 2}s linear infinite`,
                    WebkitAnimation: `spin ${
                      1 + Math.random() * 2
                    }s linear infinite`,
                  }}
                >
                  {
                    ["🎉", "🎊", "⭐", "✨", "🏆"][
                      Math.floor(Math.random() * 5)
                    ]
                  }
                </div>
              </div>
            );
          })}

          {/* Inline keyframes as a fallback */}
          <style>{`
          @keyframes fall {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(calc(100vh + 100px));
              opacity: 0;
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        </div>
      );
    };
    return (
      <>
        {/* Confetti rendered at top level with high z-index */}
        <Confetti />

        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          style={{ zIndex: 50 }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            style={{ zIndex: 60 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">🏆 Tournament Results</h1>
              <h2 className="text-2xl text-gray-600">{tournament.name}</h2>
              <p className="text-gray-500 mt-2">
                {tournament.format === "teamwork"
                  ? "Teamwork Challenge"
                  : tournament.format === "driver"
                  ? "Driver Skills"
                  : tournament.format === "autonomous"
                  ? "Autonomous Skills"
                  : tournament.config.customGameName}
              </p>
            </div>

            {/* Results Display - Show by Alliance */}
            <div className="space-y-6 mb-8">
              {(() => {
                // Sort by rank ASCENDING so best ranks (1) are at the top of the display
                const sortedRanks = Object.keys(rankGroups)
                  .map(Number)
                  .sort((a, b) => a - b); // 1, 2, 3, 4...

                return sortedRanks.map((rank, index) => {
                  const alliance = rankGroups[rank];

                  // Calculate if this rank should be revealed
                  // We want to reveal from highest rank number (worst) to lowest (best)
                  const totalRanks = sortedRanks.length;
                  const shouldReveal = totalRanks - rank < currentReveal;
                  const isCurrentReveal =
                    shouldReveal && totalRanks - rank === currentReveal - 1;

                  return (
                    <div
                      key={rank}
                      className={`transform transition-all duration-1000 ${
                        shouldReveal
                          ? "translate-x-0 opacity-100"
                          : "translate-x-full opacity-0"
                      } ${isCurrentReveal ? "scale-105" : ""}`}
                    >
                      <div
                        className={`p-6 rounded-lg border-2 ${
                          rank === 1
                            ? "border-yellow-400 bg-yellow-50"
                            : rank === 2
                            ? "border-gray-400 bg-gray-50"
                            : rank === 3
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-5xl">
                              {rank === 1
                                ? "🥇"
                                : rank === 2
                                ? "🥈"
                                : rank === 3
                                ? "🥉"
                                : `#${rank}`}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-1">
                                {rank === 1
                                  ? "Champions"
                                  : rank === 2
                                  ? "2nd Place"
                                  : rank === 3
                                  ? "3rd Place"
                                  : `${rank}th Place`}
                              </h3>
                              <div className="space-y-1">
                                {alliance.map((ranking) => {
                                  const team = tournamentTeams.find(
                                    (t) => t.id === ranking.teamId
                                  );
                                  if (!team) return null;

                                  return (
                                    <div
                                      key={ranking.teamId}
                                      className="text-gray-700"
                                    >
                                      <span className="font-semibold">
                                        {team.number}: {team.name}
                                      </span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        ({team.studentNames.join(", ")})
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                              {alliance[0].score}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tournament.format === "teamwork"
                                ? "Finals Score"
                                : "Score"}
                            </div>
                          </div>
                        </div>

                        {/* Show XP Award */}
                        {isCurrentReveal && (
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="flex items-center justify-center gap-2 text-green-600 animate-bounce">
                              <span className="text-2xl">✨</span>
                              <span className="font-bold text-lg">
                                +
                                {
                                  tournamentAchievements[
                                    rank <= 3 ? rank : "participation"
                                  ].xp
                                }{" "}
                                XP each
                              </span>
                              <span className="text-2xl">✨</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {currentReveal < totalRankGroups ? (
                <button
                  onClick={handleNextReveal}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-lg animate-pulse"
                >
                  {currentReveal === totalRankGroups - 1
                    ? "Reveal Champions! 🏆"
                    : "Reveal Next →"}
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-lg"
                >
                  Complete Ceremony ✓
                </button>
              )}
            </div>

            {/* Summary of Awards (shown after all reveals) */}
            {currentReveal >= totalRankGroups &&
              awardedAchievements.length > 0 && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">📊 Awards Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {students
                      .filter((s) => awardedXP[s.id])
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between"
                        >
                          <span>{student.name}</span>
                          <span className="font-bold text-green-600">
                            +{awardedXP[student.id]} XP
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </>
    );
  };

  const updateStudentTournamentHistory = (tournament) => {
    const updatedStudents = [...students];
    const tournamentTeams = teams.filter((t) =>
      tournament.teams.includes(t.id)
    );

    // Process each student's results
    tournament.results.finalRankings.forEach((ranking) => {
      const team = tournamentTeams.find((t) => t.id === ranking.teamId);
      if (!team) return;

      team.studentIds.forEach((studentId) => {
        const studentIndex = updatedStudents.findIndex(
          (s) => s.id === studentId
        );
        if (studentIndex === -1) return;

        const student = updatedStudents[studentIndex];

        // Create tournament history entry
        const historyEntry = {
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          sessionId: tournament.sessionId,
          sessionName: tournament.sessionName,
          date: tournament.completedAt || tournament.createdAt,
          format: tournament.format,
          placement: ranking.rank,
          teamId: team.id,
          teamName: team.name,
          teamNumber: team.number,
          partnerIds: team.studentIds.filter((id) => id !== studentId),
          partnerNames: team.studentNames.filter(
            (name, idx) => team.studentIds[idx] !== studentId
          ),
          score: ranking.score,
          alliancePartner: ranking.alliancePartner || null,
          qualRanking:
            tournament.results.qualRankings.find((r) => r.teamId === team.id)
              ?.rank || null,
        };

        // Initialize tournament history if needed
        if (!student.tournamentHistory) {
          student.tournamentHistory = [];
        }

        // Add to tournament history
        student.tournamentHistory.push(historyEntry);

        // Update personal bests
        if (!student.personalBests) {
          student.personalBests = {
            teamwork: { highScore: 0 },
            driverSkills: { highScore: 0 },
            autonomousSkills: { highScore: 0 },
            combinedSkills: { highScore: 0 },
          };
        }

        if (tournament.format === "teamwork") {
          if (ranking.score > (student.personalBests.teamwork.highScore || 0)) {
            student.personalBests.teamwork = {
              highScore: ranking.score,
              averageScore: ranking.score, // Update with actual average if available
              tournamentId: tournament.id,
              tournamentName: tournament.name,
              date: historyEntry.date,
              partner: historyEntry.partnerNames.join(", "),
            };
          }
        }

        // Update tournament statistics
        if (!student.tournamentStats) {
          student.tournamentStats = {
            totalTournaments: 0,
            championships: 0,
            podiumFinishes: 0,
            averagePlacement: 0,
            favoritePartners: [],
          };
        }

        student.tournamentStats.totalTournaments++;
        if (ranking.rank === 1) student.tournamentStats.championships++;
        if (ranking.rank <= 3) student.tournamentStats.podiumFinishes++;

        // Recalculate average placement
        const allPlacements = student.tournamentHistory.map((h) => h.placement);
        student.tournamentStats.averagePlacement =
          allPlacements.reduce((a, b) => a + b, 0) / allPlacements.length;

        // Update favorite partners
        historyEntry.partnerIds.forEach((partnerId) => {
          const existingPartner = student.tournamentStats.favoritePartners.find(
            (p) => p.id === partnerId
          );
          if (existingPartner) {
            existingPartner.count++;
          } else {
            const partnerStudent = students.find((s) => s.id === partnerId);
            if (partnerStudent) {
              student.tournamentStats.favoritePartners.push({
                id: partnerId,
                name: partnerStudent.name,
                count: 1,
              });
            }
          }
        });

        // Sort favorite partners by count
        student.tournamentStats.favoritePartners.sort(
          (a, b) => b.count - a.count
        );

        updatedStudents[studentIndex] = student;
      });
    });

    setStudents(updatedStudents);
  };

  const TournamentDetailsModal = ({ tournament, onClose }) => {
    if (!tournament) return null;

    // Get tournament data
    const tournamentTeams = teams.filter((t) =>
      tournament.teams.includes(t.id)
    );
    const totalMatches =
      (tournament.matches.quals?.length || 0) +
      (tournament.matches.finals?.length || 0);

    // Get champions with full details
    const champions = tournament.results.finalRankings
      .filter((r) => r.rank === 1)
      .map((r) => {
        const team = teams.find((t) => t.id === r.teamId);
        return team
          ? {
              teamName: team.name,
              teamNumber: team.number,
              studentNames: team.studentNames,
              score: r.score,
            }
          : null;
      })
      .filter(Boolean);

    // Get all final rankings
    const finalRankings = tournament.results.finalRankings
      .sort((a, b) => a.rank - b.rank)
      .map((ranking) => {
        const team = teams.find((t) => t.id === ranking.teamId);
        return { ...ranking, team };
      });

    // Format date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">
                  {tournament.format === "teamwork"
                    ? "🤝"
                    : tournament.format === "driver"
                    ? "🎮"
                    : "🤖"}
                </span>
                {tournament.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {formatDate(tournament.completedAt || tournament.createdAt)}
              </p>
            </div>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Tournament Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tournament.format === "teamwork"
                  ? "Teamwork"
                  : tournament.format === "driver"
                  ? "Driver Skills"
                  : "Autonomous"}
              </div>
              <div className="text-sm text-gray-600">Format</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {tournamentTeams.length}
              </div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalMatches}
              </div>
              <div className="text-sm text-gray-600">Matches</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tournament.sessionName || tournament.sessionId}
              </div>
              <div className="text-sm text-gray-600">Session</div>
            </div>
          </div>

          {/* Champions Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🏆</span>
              Champions
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              {champions.map((champion, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">🥇</span>
                    {champion.teamNumber}: {champion.teamName}
                  </div>
                  <div className="text-sm text-gray-600 ml-9">
                    {champion.studentNames.join(" & ")} • Score:{" "}
                    {champion.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Rankings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">📊 Final Rankings</h3>
            <div className="space-y-2">
              {finalRankings.slice(0, 6).map((ranking) => {
                const medal =
                  ranking.rank === 1
                    ? "🥇"
                    : ranking.rank === 2
                    ? "🥈"
                    : ranking.rank === 3
                    ? "🥉"
                    : "";

                return (
                  <div
                    key={ranking.teamId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      ranking.rank <= 3 ? "bg-gray-100" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-500 w-8">
                        {medal || `#${ranking.rank}`}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {ranking.team?.number}:{" "}
                          {ranking.team?.name || "Unknown Team"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {ranking.team?.studentNames.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{ranking.score} pts</div>
                  </div>
                );
              })}
              {finalRankings.length > 6 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  ... and {finalRankings.length - 6} more teams
                </div>
              )}
            </div>
          </div>

          {/* Qualification Rankings */}
          {tournament.results.qualRankings &&
            tournament.results.qualRankings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  📈 Qualification Rankings
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tournament.results.qualRankings.map((ranking, index) => {
                      const team = teams.find((t) => t.id === ranking.teamId);
                      return (
                        <div
                          key={ranking.teamId}
                          className="flex items-center justify-between p-2 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-sm font-medium ${
                                index < 2
                                  ? "text-blue-600 font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              #{index + 1}
                            </span>
                            <span className="font-medium">
                              {team?.number}: {team?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold">
                              {ranking.average || ranking.score}
                            </span>
                            <span className="text-gray-600 ml-1">
                              ({ranking.matches || 0} matches)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {tournament.results.qualRankings.length > 8 && (
                    <div className="text-xs text-gray-500 text-center mt-2">
                      Scroll to see all {tournament.results.qualRankings.length}{" "}
                      teams
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                setShowTournamentHistory(true);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              View All Tournaments
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Student Card Component
  const StudentCard = ({ student }) => {
    const lifetimeLevel = getStudentLevel(student.lifetimeXP || 0);
    const sessionXP = getSessionXP(student);
    const nextLevel = levels[lifetimeLevel.level] || levels[levels.length - 1];
    const xpProgress =
      ((student.lifetimeXP - lifetimeLevel.minXP) /
        (nextLevel.minXP - lifetimeLevel.minXP)) *
      100;

    // Add attendance rate calculation
    const getAttendanceRate = () => {
      const currentSessionObj = sessions.find((s) => s.name === currentSession);
      const sessionDates = currentSessionObj?.classDates || [];

      if (sessionDates.length === 0) return null;

      // Get today's date at noon to avoid timezone issues
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      // Only count classes that have already happened (including today)
      const pastDates = sessionDates.filter((date) => {
        const classDate = new Date(date + "T12:00:00");
        return classDate <= today;
      });

      if (pastDates.length === 0) return null;

      const attended = pastDates.filter((date) => {
        const status = attendance[currentSession]?.[date]?.[student.id];
        return status === "present" || status === "late";
      }).length;

      // // Debug log
      // console.log(
      //   `Student ${student.name}: ${attended}/${
      //     pastDates.length
      //   } = ${Math.round((attended / pastDates.length) * 100)}%`
      // );
      // console.log("Past dates:", pastDates);
      // console.log("Today:", todayStr);

      return Math.round((attended / pastDates.length) * 100);
    };
    const attendanceRate = getAttendanceRate();

    // Add tournament stats
    const tournamentStats = student.tournamentStats || {
      totalTournaments: 0,
      championships: 0,
      podiumFinishes: 0,
    };

    const hasChampionships = tournamentStats.championships > 0;
    const hasPodiumFinishes = tournamentStats.podiumFinishes > 0;

    const getProgramColor = (program) => {
      switch (program) {
        case "VEX GO":
          return "text-green-600 bg-green-50";
        case "VEX IQ":
          return "text-blue-600 bg-blue-50";
        case "Competition":
          return "text-purple-600 bg-purple-50";
        default:
          return "text-gray-600 bg-gray-50";
      }
    };

    // Count session achievements earned in current session
    const currentSessionAchievements =
      student.sessionAchievements?.[currentSession] || [];

    return (
      <div
        className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setSelectedStudentId(student.id)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{student.avatar}</div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {student.name}
                {/* Add championship indicator */}
                {hasChampionships && (
                  <span
                    className="text-sm"
                    title={`${tournamentStats.championships} Championship${
                      tournamentStats.championships > 1 ? "s" : ""
                    }`}
                  >
                    🏆
                  </span>
                )}
              </h3>
              {attendanceRate !== null && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <span>📅</span>
                  <span>Attendance: {attendanceRate}%</span>
                </div>
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full ${getProgramColor(
                  student.program
                )}`}
              >
                {student.program}
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-white font-bold ${lifetimeLevel.color}`}
          >
            Level {lifetimeLevel.level}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">Lifetime XP</span>
            <span>
              {student.lifetimeXP || 0} / {nextLevel.minXP} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${lifetimeLevel.color} transition-all duration-500`}
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Session</span>
            <span className="font-semibold text-green-600">{sessionXP} XP</span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            30% counts toward lifetime!
          </div>
        </div>

        {/* Add tournament summary line */}
        {tournamentStats.totalTournaments > 0 && (
          <div className="mb-2 text-sm text-gray-600 flex items-center gap-3">
            <span>🎯 {tournamentStats.totalTournaments} tournaments</span>
            {hasPodiumFinishes && (
              <span>🏅 {tournamentStats.podiumFinishes} podiums</span>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {currentSessionAchievements.slice(0, 5).map((achievementId) => {
            const achievement = achievements.find(
              (a) => a.id === achievementId
            );
            if (!achievement) return null;
            return (
              <div
                key={achievementId}
                className="text-2xl"
                title={achievement.name}
              >
                {achievement.icon}
              </div>
            );
          })}
          {currentSessionAchievements.length > 5 && (
            <div className="text-sm text-gray-500 flex items-center">
              +{currentSessionAchievements.length - 5} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const StudentDetail = ({ studentId }) => {
    if (!selectedStudentId) return null;

    // Always get fresh data from students array
    const currentStudent = students.find((s) => s.id === selectedStudentId);
    if (!currentStudent) return null;

    const [showXPAnimation, setShowXPAnimation] = useState(null);
    const [showManualXP, setShowManualXP] = useState(false);
    const [showAllTournaments, setShowAllTournaments] = useState(false);

    const lifetimeLevel = getStudentLevel(currentStudent.lifetimeXP || 0);
    const sessionXP = getSessionXP(currentStudent);
    const earnedMilestones = getStudentMilestones(currentStudent.id);

    const lifetimeAchievements = achievements.filter(
      (a) =>
        a.type === "lifetime" &&
        (currentStudent.achievements || []).includes(a.id)
    );

    // Get student's tournament history
    const studentTournamentHistory = currentStudent.tournamentHistory || [];
    const recentTournaments = showAllTournaments
      ? studentTournamentHistory
      : studentTournamentHistory.slice(-3).reverse();

    // Calculate tournament stats
    const tournamentStats = currentStudent.tournamentStats || {
      totalTournaments: 0,
      championships: 0,
      podiumFinishes: 0,
      averagePlacement: 0,
      favoritePartners: [],
    };

    // Format placement with medal
    const getPlacementDisplay = (placement) => {
      switch (placement) {
        case 1:
          return "🥇 1st";
        case 2:
          return "🥈 2nd";
        case 3:
          return "🥉 3rd";
        default:
          return `${placement}th`;
      }
    };

    // Award XP with animation feedback
    const awardXPWithFeedback = (amount, isLifetime = false) => {
      awardXP(currentStudent.id, amount, isLifetime);

      if (!isLifetime && amount > 0) {
        setShowXPAnimation({
          session: amount,
          lifetime: Math.floor(amount * 0.3),
        });
        setTimeout(() => setShowXPAnimation(null), 2000);
      }
    };

    // Show achievement animation
    const handleAchievementAward = (achievementId) => {
      const achievement = achievements.find((a) => a.id === achievementId);
      if (!achievement) return;

      // Get fresh student data
      const freshStudent = students.find((s) => s.id === currentStudent.id);
      if (!freshStudent) return;

      // Double-check if already earned
      const currentSessionAchievements =
        freshStudent.sessionAchievements?.[currentSession] || [];
      if (
        achievement.type === "session" &&
        currentSessionAchievements.includes(achievementId)
      ) {
        return; // Already earned, don't award again
      }

      awardAchievement(currentStudent.id, achievementId);

      // Show XP animation for session achievements
      if (achievement.type === "session") {
        setShowXPAnimation({
          session: achievement.xp,
          lifetime: Math.floor(achievement.xp * 0.3),
        });
        setTimeout(() => setShowXPAnimation(null), 2000);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentStudent.avatar}</div>
              <div>
                <h2 className="text-3xl font-bold">{currentStudent.name}</h2>
                <p className="text-gray-600">{currentStudent.program}</p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Lifetime:</span>{" "}
                  {currentStudent.lifetimeXP || 0} XP •
                  <span className="ml-2 font-bold">Session:</span> {sessionXP}{" "}
                  XP
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStudentId(null)}
              className="text-2xl hover:bg-gray-100 rounded p-1"
            >
              ×
            </button>
          </div>

          {/* XP Animation */}
          {showXPAnimation && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg animate-pulse">
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">
                  XP Awarded!
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Session: +{showXPAnimation.session} XP | Lifetime: +
                  {showXPAnimation.lifetime} XP (30%)
                </div>
              </div>
            </div>
          )}

          {/* Manual XP (Hidden by default) */}
          <div className="mb-6">
            {!showManualXP ? (
              <button
                onClick={() => setShowManualXP(true)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                + Manual XP Award (Advanced)
              </button>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Manual Session XP Award</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={xpToAward}
                    onChange={(e) =>
                      setXpToAward(parseInt(e.target.value) || 0)
                    }
                    className="px-2 py-1 border rounded w-20"
                    placeholder="10"
                  />
                  <button
                    onClick={() => awardXPWithFeedback(xpToAward, false)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Award
                  </button>
                  <button
                    onClick={() => setShowManualXP(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Hide
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  30% automatically adds to lifetime XP
                </p>
              </div>
            )}
          </div>

          {/* Tournament History Section */}
          {studentTournamentHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center justify-between">
                <span>🏆 Tournament History</span>
                {studentTournamentHistory.length > 3 && (
                  <button
                    onClick={() => setShowAllTournaments(!showAllTournaments)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-normal"
                  >
                    {showAllTournaments
                      ? "Show Less"
                      : `View All ${studentTournamentHistory.length}`}
                  </button>
                )}
              </h3>

              {/* Tournament Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tournamentStats.totalTournaments}
                  </div>
                  <div className="text-xs text-gray-600">Tournaments</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {tournamentStats.championships}
                  </div>
                  <div className="text-xs text-gray-600">Championships</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tournamentStats.podiumFinishes}
                  </div>
                  <div className="text-xs text-gray-600">Podium Finishes</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {tournamentStats.averagePlacement
                      ? tournamentStats.averagePlacement.toFixed(1)
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-600">Avg. Place</div>
                </div>
              </div>

              {/* Tournament List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentTournaments.map((tournament, index) => (
                  <div
                    key={tournament.tournamentId}
                    className={`p-3 rounded-lg border ${
                      tournament.placement === 1
                        ? "border-yellow-300 bg-yellow-50"
                        : tournament.placement <= 3
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {tournament.format === "teamwork"
                              ? "🤝"
                              : tournament.format === "driver"
                              ? "🎮"
                              : "🤖"}
                          </span>
                          <span className="font-semibold">
                            {tournament.tournamentName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(tournament.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold">
                            {getPlacementDisplay(tournament.placement)}
                          </span>
                          <span className="text-gray-600">
                            Team: {tournament.teamNumber}
                          </span>
                          {tournament.partnerNames.length > 0 && (
                            <span className="text-gray-600">
                              w/ {tournament.partnerNames.join(" & ")}
                            </span>
                          )}
                          <span className="font-medium">
                            Score: {tournament.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Favorite Partners */}
              {tournamentStats.favoritePartners &&
                tournamentStats.favoritePartners.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-semibold mb-1">
                      🤝 Favorite Partners:
                    </div>
                    <div className="text-sm text-gray-700">
                      {tournamentStats.favoritePartners
                        .slice(0, 3)
                        .map((partner, idx) => (
                          <span key={partner.id}>
                            {partner.name} ({partner.count}x)
                            {idx <
                              Math.min(
                                2,
                                tournamentStats.favoritePartners.length - 1
                              ) && ", "}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

              {/* Personal Bests */}
              {currentStudent.personalBests && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-semibold mb-1">
                    🌟 Personal Bests:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentStudent.personalBests.teamwork.highScore > 0 && (
                      <div>
                        <span className="text-gray-600">Teamwork:</span>
                        <span className="font-medium ml-1">
                          {currentStudent.personalBests.teamwork.highScore} pts
                        </span>
                      </div>
                    )}
                    {currentStudent.personalBests.driverSkills.highScore >
                      0 && (
                      <div>
                        <span className="text-gray-600">Driver:</span>
                        <span className="font-medium ml-1">
                          {currentStudent.personalBests.driverSkills.highScore}{" "}
                          pts
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Tournament History Message */}
          {studentTournamentHistory.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-gray-600">No tournament history yet</div>
              <div className="text-sm text-gray-500 mt-1">
                Participate in tournaments to see your history here!
              </div>
            </div>
          )}

{/* Milestone Progress Display */}
<div className="mb-6">
  {(() => {
    const { sessionProgress, lifetimeProgress } = getMilestoneProgress(
      currentStudent.id,
      currentSession,
      dailyXPTracking,
      students,
      sessions,
      attendance,
      studentMilestones,
      achievements
    );
    
    const handleAwardMilestone = (milestone) => {
      // Award the milestone bonus XP (this is lifetime XP)
      //awardXP(currentStudent.id, milestone.lifetimeXP, true); // true = lifetime XP
      
      // Track the milestone as earned
      awardMilestone(currentStudent.id, milestone.id);
      
      // Show success animation
      setShowXPAnimation({
        session: 0,
        lifetime: milestone.lifetimeXP
      });
      setTimeout(() => setShowXPAnimation(null), 2000);
    };

    const handleAwardAchievement = (achievement) => {
      // First, check if the achievement already exists in the system
      let existingAchievement = achievements.find(a => 
        a.name === achievement.name && a.type === 'lifetime'
      );
      
      if (!existingAchievement) {
        // Create the achievement if it doesn't exist
        const newAchievement = {
          id: Date.now(),
          name: achievement.name,
          icon: achievement.icon,
          description: achievement.description,
          xp: achievement.xp,
          type: 'lifetime'
        };
        
        // Add to achievements list
        setAchievements(prev => [...prev, newAchievement]);
        existingAchievement = newAchievement;
        
        // Small delay to ensure state updates
        setTimeout(() => {
          awardAchievement(currentStudent.id, newAchievement.id);
        }, 100);
      } else {
        // Award the existing achievement
        awardAchievement(currentStudent.id, existingAchievement.id);
      }
      
      // Show success animation
      setShowXPAnimation({
        session: 0,
        lifetime: achievement.xp
      });
      setTimeout(() => setShowXPAnimation(null), 2000);
    };
    
    // const handleAwardAchievement = (achievement) => {
    //   // Find or create the achievement
    //   let achievementId = achievements.find(a => a.name === achievement.name)?.id;
      
    //   if (!achievementId) {
    //     // Add the achievement to the system
    //     const newAchievement = {
    //       id: Date.now(),
    //       name: achievement.name,
    //       icon: achievement.icon,
    //       description: achievement.description,
    //       xp: achievement.xp,
    //       type: 'lifetime'
    //     };
    //     setAchievements(prev => [...prev, newAchievement]);
    //     achievementId = newAchievement.id;
    //   }
      
    //   // Award the achievement (this already includes XP)
    //   awardAchievement(currentStudent.id, achievementId);
      
    //   // Force refresh the current student data
    //   setSelectedStudent(students.find(s => s.id === currentStudent.id));
      
    //   // Show success animation
    //   setShowXPAnimation({
    //     session: 0,
    //     lifetime: achievement.xp
    //   });
    //   setTimeout(() => setShowXPAnimation(null), 2000);
    // };
    
    return (
      <MilestoneProgressDisplay 
        sessionProgress={sessionProgress}
        lifetimeProgress={lifetimeProgress}
        onAwardMilestone={handleAwardMilestone}
        onAwardAchievement={handleAwardAchievement}
        studentName={currentStudent.name}
      />
    );
  })()}
</div>

{/* Manual Milestone Check */}
<div className="mb-6 p-4 bg-yellow-50 rounded-lg">
  <h3 className="font-bold mb-3">🔄 Check for Earned Milestones</h3>
  <p className="text-sm text-gray-600 mb-3">
    Milestones are automatically checked when awarding daily XP. 
    Click below to manually check for any missed milestones.
  </p>
  <button
    onClick={() => {
      const { sessionMilestones, lifetimeAchievements } = checkAllMilestones(
        currentStudent.id,
        currentSession,
        dailyXPTracking,
        students,
        sessions,
        attendance,
        studentMilestones
      );
      
      if (sessionMilestones.length === 0 && lifetimeAchievements.length === 0) {
        alert('No new milestones earned yet. Keep working!');
      } else {
        // Award the milestones
        sessionMilestones.forEach(milestone => {
          awardMilestone(currentStudent.id, milestone.id);
        });
        
        lifetimeAchievements.forEach(achievement => {
          let achievementId = achievements.find(a => a.name === achievement.name)?.id;
          if (achievementId) {
            awardAchievement(currentStudent.id, achievementId);
          }
        });
        
        alert(`Awarded ${sessionMilestones.length + lifetimeAchievements.length} new milestones!`);
      }
    }}
    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
  >
    Check for Milestones
  </button>
</div>
        </div>
      </div>
    );
  };

  // Settings Modal Component
  const SettingsModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <button onClick={() => setShowSettings(false)} className="text-2xl">
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* User Role Setting */}
            <div>
              <h3 className="font-semibold mb-2">User Role</h3>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Admin role shows additional management options
              </p>
            </div>

            {/* Data Management */}
            <div>
              <h3 className="font-semibold mb-2">Data Management</h3>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              >
                Export All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar
        // View state
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        sessions={sessions}
        activeTournament={activeTournament}
        tournaments={tournaments}
        userRole={userRole} // or "admin" - we'll make this dynamic later
        // Session Tasks
        setShowUnifiedXPAward={setShowUnifiedXPAward}
        setShowAttendanceManager={setShowAttendanceManager}
        setShowTeamManager={setShowTeamManager}
        setShowMatchEntry={setShowMatchEntry}
        setShowSkillsEntry={setShowSkillsEntry}
        setSkillsType={setSkillsType}
        // Tournaments
        setShowTournamentWizard={setShowTournamentWizard}
        setShowTournamentDashboard={setShowTournamentDashboard}
        setActiveTournament={setActiveTournament}
        // Reports
        setShowTournamentHistory={setShowTournamentHistory}
        setShowAttendanceReport={setShowAttendanceReport}
        exportData={exportData}
        // Admin
        setShowSessionManager={setShowSessionManager}
        setShowStudentManager={setShowStudentManager}
        setShowAchievementManager={setShowAchievementManager}
        setShowSettings={setShowSettings}
      />
      <div className="max-w-7xl mx-auto p-6">
        {currentView === "dashboard" ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {sessions.length > 0 && currentSession
                ? `Student Progress - ${currentSession}`
                : "Student Progress - No Session Selected"}
            </h2>
            {students.filter(
              (s) =>
                s.enrolledSessions?.includes(currentSession) ||
                s.sessionsAttended?.includes(currentSession)
            ).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  {sessions.length === 0
                    ? "No sessions created yet!"
                    : "No students enrolled in this session!"}
                </p>
                <button
                  onClick={() =>
                    sessions.length === 0
                      ? setShowSessionManager(true)
                      : setShowStudentManager(true)
                  }
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {sessions.length === 0
                    ? "Create Your First Session"
                    : "Add Students to Session"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students
                  .filter(
                    (student) =>
                      student.enrolledSessions?.includes(currentSession) ||
                      student.sessionsAttended?.includes(currentSession)
                  )
                  .map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
              </div>
            )}
            {recentTournaments.length > 0 && (
              <div className="mb-6 mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
                  <span>🏆 Recent Tournaments</span>
                  <button
                    onClick={() => setShowTournamentHistory(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-normal"
                  >
                    View All →
                  </button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recentTournaments.map((tournament) => {
                    // Get champion names
                    const champions = tournament.results.finalRankings
                      .filter((r) => r.rank === 1)
                      .map((r) => {
                        const team = teams.find((t) => t.id === r.teamId);
                        return team ? team.name : "Unknown";
                      })
                      .join(" & ");

                    // Format date
                    const tournamentDate = new Date(
                      tournament.completedAt || tournament.createdAt
                    );
                    const formattedDate = tournamentDate.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    );

                    // Get participant count
                    const participantCount = tournament.teams.length;

                    return (
                      <div
                        key={tournament.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          handleViewHistoricalTournament(tournament)
                        }
                      >
                        {/* Tournament Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {tournament.format === "teamwork"
                                ? "🤝"
                                : tournament.format === "driver"
                                ? "🎮"
                                : "🤖"}
                            </span>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {tournament.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formattedDate}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              tournament.format === "teamwork"
                                ? "bg-blue-100 text-blue-700"
                                : tournament.format === "driver"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {tournament.format === "teamwork"
                              ? "Team"
                              : tournament.format === "driver"
                              ? "Driver"
                              : "Auto"}
                          </span>
                        </div>

                        {/* Tournament Stats */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Teams:</span>
                            <span className="font-medium">
                              {participantCount}
                            </span>
                          </div>

                          <div className="border-t pt-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm">🥇</span>
                              <span className="text-sm font-semibold text-gray-800 truncate">
                                {champions}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover hint */}
                        <div className="mt-3 text-xs text-gray-500 text-center">
                          Click to view details
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Lifetime Leaders</h3>
                {[...students]
                  .sort((a, b) => (b.lifetimeXP || 0) - (a.lifetimeXP || 0))
                  .map((student, index) => {
                    const level = getStudentLevel(student.lifetimeXP || 0);
                    const medal =
                      index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "";

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-gray-400 w-12">
                            {medal || `#${index + 1}`}
                          </div>
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-gray-600">
                              {level.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          {student.lifetimeXP || 0} XP
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  {currentSession} Leaders
                </h3>
                {[...students]
                  .sort((a, b) => getSessionXP(b) - getSessionXP(a))
                  .filter((student) => getSessionXP(student) > 0)
                  .map((student, index) => {
                    const medal =
                      index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "";

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-gray-400 w-12">
                            {medal || `#${index + 1}`}
                          </div>
                          <div className="font-semibold">{student.name}</div>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {getSessionXP(student)} XP
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedStudentId && <StudentDetail studentId={selectedStudentId} />}
      {showSessionManager && <SessionManager />}
      {showAttendanceManager && <AttendanceManager />}
      {showStudentManager && <StudentManager />}
      {showAchievementManager && <AchievementManager />}
      {showUnifiedXPAward && (
  <UnifiedXPAwardModal
    students={students}
    currentSession={currentSession}
    sessions={sessions}
    achievements={achievements}
    onClose={() => setShowUnifiedXPAward(false)}
    onAwardXP={handleDailyXPAward}
    onAwardAchievement={awardAchievement}
    attendance={attendance}
  />
)}
      {showTeamManager && (
        <TeamManager
          students={students}
          currentSession={currentSession}
          onClose={() => setShowTeamManager(false)}
        />
      )}
      {showMatchEntry && (
        <TeamworkMatchEntry
          teams={teams}
          currentSession={currentSession}
          onClose={() => setShowMatchEntry(false)}
          onSave={handleSaveTeamworkMatch}
        />
      )}
      {showSkillsEntry && (
        <SkillsEntry
          teams={teams}
          currentSession={currentSession}
          skillsType={skillsType}
          onClose={() => setShowSkillsEntry(false)}
          onSave={handleSaveSkillsScore}
        />
      )}
      {showTournamentView && (
        <TournamentView
          teams={teams}
          teamworkMatches={teamworkMatches}
          skillsScores={skillsScores}
          currentSession={currentSession}
          students={students}
          onClose={() => setShowTournamentView(false)}
        />
      )}
      {showAttendanceReport && (
        <AttendanceReport
          sessions={sessions}
          students={students}
          attendance={attendance}
          onClose={() => setShowAttendanceReport(false)}
        />
      )}
      {showTournamentWizard && <TournamentWizard />}
      {showTournamentDashboard && <TournamentDashboard />}
      {showTournamentHistory && (
        <TournamentHistory
          tournaments={tournaments}
          sessions={sessions}
          teams={teams}
          students={students}
          onClose={() => setShowTournamentHistory(false)}
          onViewTournament={handleViewHistoricalTournament}
        />
      )}
      {showAwardsCeremony && <AwardsCeremony />}
      {selectedHistoricalTournament && (
        <TournamentDetailsModal
          tournament={selectedHistoricalTournament}
          onClose={() => setSelectedHistoricalTournament(null)}
        />
      )}
      {showSettings && <SettingsModal />}
    </div>
  );
};

export default VEXLifetimeAchievementSystem;
