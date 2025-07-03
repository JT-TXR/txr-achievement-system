// testData.js - Add this to your VEX Lifetime Achievement System

export const initializeTestData = () => {
  // Check if we're in development mode and if data already exists
  const existingStudents = localStorage.getItem("vexLifetimeStudents");
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname.includes("codesandbox") ||
    window.location.hostname.includes("csb.app");

  // Add a flag to force reload test data
  const FORCE_RELOAD = true; // Set to false in production

  if (!isDevelopment || (existingStudents && !FORCE_RELOAD)) {
    return; // Don't initialize if not in dev mode or data exists
  }

  console.log("🚀 Initializing test data...");

  // Test Sessions
  const testSessions = [
    {
      id: "session-1",
      name: "Summer 2024 - VEX IQ",
      type: "summer",
      startDate: "2024-06-01T07:00:00.000Z",
      endDate: "2024-07-15T07:00:00.000Z",
      isActive: false,
      order: 0,
      createdAt: "2024-05-15T07:00:00.000Z",
      scheduleType: "weekly",
      selectedDays: [1, 3, 5], // Mon, Wed, Fri
      classDates: [
        "2024-06-03",
        "2024-06-05",
        "2024-06-07",
        "2024-06-10",
        "2024-06-12",
        "2024-06-14",
        "2024-06-17",
        "2024-06-19",
        "2024-06-21",
        "2024-06-24",
        "2024-06-26",
        "2024-06-28",
      ],
    },
    {
      id: "session-2",
      name: "Fall 2024 - VEX GO",
      type: "school-go",
      startDate: "2024-09-01T07:00:00.000Z",
      endDate: "2024-12-20T08:00:00.000Z",
      isActive: true,
      order: 1,
      createdAt: "2024-08-15T07:00:00.000Z",
      scheduleType: "weekly",
      selectedDays: [2, 4], // Tue, Thu
      classDates: [
        "2024-09-03",
        "2024-09-05",
        "2024-09-10",
        "2024-09-12",
        "2024-09-17",
        "2024-09-19",
        "2024-09-24",
        "2024-09-26",
      ],
    },
  ];

  // Test Students with varied data (12 students for 6 teams)
  const testStudents = [
    {
      id: "student-1",
      name: "Alex Chen",
      avatar: "🎮",
      program: "VEX IQ",
      lifetimeXP: 850,
      sessionXP: {
        "Summer 2024 - VEX IQ": 280,
        "Fall 2024 - VEX GO": 150,
      },
      lifetimeAchievements: ["first-bot", "team-player", "problem-solver"],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": ["attendance-streak", "helper"],
        "Fall 2024 - VEX GO": ["quick-builder"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-2",
      name: "Emma Rodriguez",
      avatar: "🦄",
      program: "VEX GO",
      lifetimeXP: 1250,
      sessionXP: {
        "Summer 2024 - VEX IQ": 350,
        "Fall 2024 - VEX GO": 200,
      },
      lifetimeAchievements: [
        "first-bot",
        "team-player",
        "problem-solver",
        "innovator",
        "champion",
      ],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": ["attendance-streak", "helper", "top-scorer"],
        "Fall 2024 - VEX GO": ["quick-builder", "perfect-driver"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-3",
      name: "Liam Johnson",
      avatar: "🚀",
      program: "VEX IQ",
      lifetimeXP: 450,
      sessionXP: {
        "Fall 2024 - VEX GO": 120,
      },
      lifetimeAchievements: ["first-bot"],
      sessionAchievements: {
        "Fall 2024 - VEX GO": ["quick-builder"],
      },
      enrolledSessions: ["Fall 2024 - VEX GO"],
      sessionsAttended: ["Fall 2024 - VEX GO"],
    },
    {
      id: "student-4",
      name: "Sophia Kim",
      avatar: "🌟",
      program: "VEX IQ",
      lifetimeXP: 2100,
      sessionXP: {
        "Summer 2024 - VEX IQ": 450,
        "Fall 2024 - VEX GO": 280,
      },
      lifetimeAchievements: [
        "first-bot",
        "team-player",
        "problem-solver",
        "innovator",
        "champion",
        "mentor",
        "legend",
      ],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": [
          "attendance-streak",
          "helper",
          "top-scorer",
          "tournament-winner",
        ],
        "Fall 2024 - VEX GO": ["quick-builder", "perfect-driver", "helper"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-5",
      name: "Noah Patel",
      avatar: "🎯",
      program: "VEX GO",
      lifetimeXP: 320,
      sessionXP: {
        "Fall 2024 - VEX GO": 95,
      },
      lifetimeAchievements: ["first-bot"],
      sessionAchievements: {
        "Fall 2024 - VEX GO": [],
      },
      enrolledSessions: ["Fall 2024 - VEX GO"],
      sessionsAttended: ["Fall 2024 - VEX GO"],
    },
    {
      id: "student-6",
      name: "Olivia Martinez",
      avatar: "🎨",
      program: "VEX IQ",
      lifetimeXP: 680,
      sessionXP: {
        "Summer 2024 - VEX IQ": 250,
        "Fall 2024 - VEX GO": 180,
      },
      lifetimeAchievements: ["first-bot", "team-player"],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": ["helper"],
        "Fall 2024 - VEX GO": ["quick-builder", "attendance-streak"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-7",
      name: "Jackson Lee",
      avatar: "⚡",
      program: "VEX GO",
      lifetimeXP: 920,
      sessionXP: {
        "Fall 2024 - VEX GO": 220,
      },
      lifetimeAchievements: ["first-bot", "team-player", "problem-solver"],
      sessionAchievements: {
        "Fall 2024 - VEX GO": ["quick-builder", "helper", "perfect-driver"],
      },
      enrolledSessions: ["Fall 2024 - VEX GO"],
      sessionsAttended: ["Fall 2024 - VEX GO"],
    },
    {
      id: "student-8",
      name: "Ava Thompson",
      avatar: "🌺",
      program: "VEX IQ",
      lifetimeXP: 1100,
      sessionXP: {
        "Summer 2024 - VEX IQ": 320,
        "Fall 2024 - VEX GO": 190,
      },
      lifetimeAchievements: [
        "first-bot",
        "team-player",
        "problem-solver",
        "innovator",
      ],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": ["attendance-streak", "top-scorer"],
        "Fall 2024 - VEX GO": ["perfect-driver"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-9",
      name: "Ethan Wilson",
      avatar: "🔧",
      program: "VEX GO",
      lifetimeXP: 380,
      sessionXP: {
        "Fall 2024 - VEX GO": 110,
      },
      lifetimeAchievements: ["first-bot"],
      sessionAchievements: {
        "Fall 2024 - VEX GO": ["quick-builder"],
      },
      enrolledSessions: ["Fall 2024 - VEX GO"],
      sessionsAttended: ["Fall 2024 - VEX GO"],
    },
    {
      id: "student-10",
      name: "Mia Davis",
      avatar: "🌈",
      program: "VEX IQ",
      lifetimeXP: 1450,
      sessionXP: {
        "Summer 2024 - VEX IQ": 380,
        "Fall 2024 - VEX GO": 240,
      },
      lifetimeAchievements: [
        "first-bot",
        "team-player",
        "problem-solver",
        "innovator",
        "champion",
      ],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": [
          "attendance-streak",
          "helper",
          "top-scorer",
          "tournament-winner",
        ],
        "Fall 2024 - VEX GO": ["quick-builder", "perfect-driver", "helper"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
    {
      id: "student-11",
      name: "Lucas Brown",
      avatar: "🎪",
      program: "VEX GO",
      lifetimeXP: 520,
      sessionXP: {
        "Fall 2024 - VEX GO": 140,
      },
      lifetimeAchievements: ["first-bot", "team-player"],
      sessionAchievements: {
        "Fall 2024 - VEX GO": ["helper"],
      },
      enrolledSessions: ["Fall 2024 - VEX GO"],
      sessionsAttended: ["Fall 2024 - VEX GO"],
    },
    {
      id: "student-12",
      name: "Isabella Garcia",
      avatar: "💫",
      program: "VEX IQ",
      lifetimeXP: 780,
      sessionXP: {
        "Summer 2024 - VEX IQ": 290,
        "Fall 2024 - VEX GO": 160,
      },
      lifetimeAchievements: ["first-bot", "team-player", "problem-solver"],
      sessionAchievements: {
        "Summer 2024 - VEX IQ": ["attendance-streak", "helper"],
        "Fall 2024 - VEX GO": ["quick-builder", "perfect-driver"],
      },
      enrolledSessions: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
      sessionsAttended: ["Summer 2024 - VEX IQ", "Fall 2024 - VEX GO"],
    },
  ];

  // Test Teams (6 teams with 2 students each)
  const testTeams = [
    {
      id: 1,
      number: 101,
      name: "Thunder Bots",
      studentIds: ["student-1", "student-2"],
      studentNames: ["Alex Chen", "Emma Rodriguez"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
    {
      id: 2,
      number: 102,
      name: "Lightning Builders",
      studentIds: ["student-3", "student-4"],
      studentNames: ["Liam Johnson", "Sophia Kim"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
    {
      id: 3,
      number: 103,
      name: "Storm Chasers",
      studentIds: ["student-5", "student-6"],
      studentNames: ["Noah Patel", "Olivia Martinez"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
    {
      id: 4,
      number: 104,
      name: "Cyber Eagles",
      studentIds: ["student-7", "student-8"],
      studentNames: ["Jackson Lee", "Ava Thompson"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
    {
      id: 5,
      number: 105,
      name: "Tech Titans",
      studentIds: ["student-9", "student-10"],
      studentNames: ["Ethan Wilson", "Mia Davis"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
    {
      id: 6,
      number: 106,
      name: "Robo Rangers",
      studentIds: ["student-11", "student-12"],
      studentNames: ["Lucas Brown", "Isabella Garcia"],
      session: "Fall 2024 - VEX GO",
      created: "2024-09-01T08:00:00.000Z",
    },
  ];

  // Test Attendance
  const testAttendance = {
    "Summer 2024 - VEX IQ": {
      "2024-06-03": {
        "student-1": "present",
        "student-2": "present",
        "student-4": "present",
      },
      "2024-06-05": {
        "student-1": "present",
        "student-2": "absent",
        "student-4": "present",
      },
      "2024-06-07": {
        "student-1": "present",
        "student-2": "present",
        "student-4": "present",
      },
    },
    "Fall 2024 - VEX GO": {
      "2024-09-03": {
        "student-1": "present",
        "student-2": "present",
        "student-3": "present",
        "student-4": "present",
        "student-5": "absent",
        "student-6": "present",
        "student-7": "present",
        "student-8": "present",
        "student-9": "present",
        "student-10": "present",
        "student-11": "absent",
        "student-12": "present",
      },
      "2024-09-05": {
        "student-1": "present",
        "student-2": "present",
        "student-3": "absent",
        "student-4": "present",
        "student-5": "present",
        "student-6": "present",
        "student-7": "present",
        "student-8": "absent",
        "student-9": "present",
        "student-10": "present",
        "student-11": "present",
        "student-12": "present",
      },
    },
  };

  // Initialize all test data
  localStorage.setItem("vexLifetimeStudents", JSON.stringify(testStudents));
  localStorage.setItem("vexSessions", JSON.stringify(testSessions));
  localStorage.setItem("vexCurrentSession", "Fall 2024 - VEX GO");
  localStorage.setItem("vexTeams", JSON.stringify(testTeams));
  localStorage.setItem("vexTournaments", JSON.stringify([])); // Empty tournaments array!
  localStorage.setItem("vexAttendance", JSON.stringify(testAttendance));

  // Initialize empty data for other features
  localStorage.setItem("vexTeamworkMatches", JSON.stringify([]));
  localStorage.setItem("vexSkillsScores", JSON.stringify([]));
  localStorage.setItem("vexStudentMilestones", JSON.stringify({}));

  console.log("✅ Test data initialized successfully!");
  console.log("📋 12 students loaded");
  console.log("👥 6 teams created");
  console.log("📅 2 sessions available");
  console.log("🏆 No tournaments - create your own!");

  // Optional: Return the data for verification
  return {
    students: testStudents,
    sessions: testSessions,
    teams: testTeams,
    attendance: testAttendance,
  };
};

// Function to clear all data (useful for testing)
export const clearAllData = () => {
  const keys = [
    "vexLifetimeStudents",
    "vexSessions",
    "vexCurrentSession",
    "vexTeams",
    "vexTournaments",
    "vexAttendance",
    "vexTeamworkMatches",
    "vexSkillsScores",
    "vexStudentMilestones",
    "vexAchievements",
  ];

  keys.forEach((key) => localStorage.removeItem(key));
  console.log("🗑️ All data cleared!");
};

// Function to export current data as JSON (for creating new test scenarios)
export const exportCurrentData = () => {
  const data = {
    students: JSON.parse(localStorage.getItem("vexLifetimeStudents") || "[]"),
    sessions: JSON.parse(localStorage.getItem("vexSessions") || "[]"),
    currentSession: localStorage.getItem("vexCurrentSession"),
    teams: JSON.parse(localStorage.getItem("vexTeams") || "[]"),
    tournaments: JSON.parse(localStorage.getItem("vexTournaments") || "[]"),
    attendance: JSON.parse(localStorage.getItem("vexAttendance") || "{}"),
    teamworkMatches: JSON.parse(
      localStorage.getItem("vexTeamworkMatches") || "[]"
    ),
    skillsScores: JSON.parse(localStorage.getItem("vexSkillsScores") || "[]"),
    milestones: JSON.parse(
      localStorage.getItem("vexStudentMilestones") || "{}"
    ),
    achievements: JSON.parse(localStorage.getItem("vexAchievements") || "[]"),
  };

  console.log("📊 Current Data:", data);
  return data;
};
