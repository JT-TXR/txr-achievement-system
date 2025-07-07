// testData.js - VEX Lifetime Achievement System Test Data

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
      id: "session-summer-2025-week3",
      name: "Summer 2025 - Week 3",
      type: "summer",
      startDate: "2025-06-23T07:00:00.000Z",
      endDate: "2025-06-29T07:00:00.000Z",
      isActive: true,
      order: 0,
      createdAt: "2025-06-15T07:00:00.000Z",
      scheduleType: "weekly",
      selectedDays: [1, 3, 5], // Mon, Wed, Fri
      classDates: ["2025-06-23", "2025-06-25", "2025-06-27"],
    },
    {
      id: "session-fall-2024-go",
      name: "Fall 2024 - VEX GO",
      type: "school-go",
      startDate: "2024-09-01T07:00:00.000Z",
      endDate: "2024-12-20T08:00:00.000Z",
      isActive: false,
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

  // Test Students - 12 students with tournament history
  const testStudents = [
    {
      id: 1751055462118,
      name: "Vihaan D",
      program: "VEX IQ",
      lifetimeXP: 172,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 1,
          teamId: 1751055584220,
          teamName: "I am Thirsty",
          teamNumber: "T4",
          partnerIds: [1751055501534],
          partnerNames: ["Carnegie P."],
          qualRank: 1,
          qualAverage: 41.3,
          finalScore: 57,
          matchScores: [41, 30, 53],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 1,
        podiumFinishes: 1,
        averagePlacement: 1,
        favoritePartners: [
          { studentId: 1751055501534, studentName: "Carnegie P.", count: 1 },
        ],
      },
    },
    {
      id: 1751055467059,
      name: "Mahira D",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 1,
          teamId: 1751055528826,
          teamName: "John Bot",
          teamNumber: "T1",
          partnerIds: [1751055479228, 1751055483528],
          partnerNames: ["Ava N.", "Jasmine N."],
          qualRank: 2,
          qualAverage: 37.3,
          finalScore: 57,
          matchScores: [62, 30, 20],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 1,
        podiumFinishes: 1,
        averagePlacement: 1,
        favoritePartners: [
          { studentId: 1751055479228, studentName: "Ava N.", count: 1 },
          { studentId: 1751055483528, studentName: "Jasmine N.", count: 1 },
        ],
      },
    },
    {
      id: 1751055471081,
      name: "Bodhi T.",
      program: "VEX IQ",
      lifetimeXP: 87,
      sessionXP: {
        "Summer 2025 - Week 3": 15,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 3,
          teamId: 1751055538163,
          teamName: "Pizza",
          teamNumber: "T2",
          partnerIds: [1751055475711],
          partnerNames: ["Felix T."],
          qualRank: 6,
          qualAverage: 18.7,
          finalScore: 35,
          matchScores: [23, 13, 20],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 1,
        averagePlacement: 3,
        favoritePartners: [
          { studentId: 1751055475711, studentName: "Felix T.", count: 1 },
        ],
      },
    },
    {
      id: 1751055475711,
      name: "Felix T.",
      program: "VEX IQ",
      lifetimeXP: 87,
      sessionXP: {
        "Summer 2025 - Week 3": 15,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 3,
          teamId: 1751055538163,
          teamName: "Pizza",
          teamNumber: "T2",
          partnerIds: [1751055471081],
          partnerNames: ["Bodhi T."],
          qualRank: 6,
          qualAverage: 18.7,
          finalScore: 35,
          matchScores: [23, 13, 20],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 1,
        averagePlacement: 3,
        favoritePartners: [
          { studentId: 1751055471081, studentName: "Bodhi T.", count: 1 },
        ],
      },
    },
    {
      id: 1751055479228,
      name: "Ava N.",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 1,
          teamId: 1751055528826,
          teamName: "John Bot",
          teamNumber: "T1",
          partnerIds: [1751055467059, 1751055483528],
          partnerNames: ["Mahira D", "Jasmine N."],
          qualRank: 2,
          qualAverage: 37.3,
          finalScore: 57,
          matchScores: [62, 30, 20],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 1,
        podiumFinishes: 1,
        averagePlacement: 1,
        favoritePartners: [
          { studentId: 1751055467059, studentName: "Mahira D", count: 1 },
          { studentId: 1751055483528, studentName: "Jasmine N.", count: 1 },
        ],
      },
    },
    {
      id: 1751055483528,
      name: "Jasmine N.",
      program: "VEX IQ",
      lifetimeXP: 172,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:03.528Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 1,
          teamId: 1751055528826,
          teamName: "John Bot",
          teamNumber: "T1",
          partnerIds: [1751055467059, 1751055479228],
          partnerNames: ["Mahira D", "Ava N."],
          qualRank: 2,
          qualAverage: 37.3,
          finalScore: 57,
          matchScores: [62, 30, 20],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 1,
        podiumFinishes: 1,
        averagePlacement: 1,
        favoritePartners: [
          { studentId: 1751055467059, studentName: "Mahira D", count: 1 },
          { studentId: 1751055479228, studentName: "Ava N.", count: 1 },
        ],
      },
    },
    {
      id: 1751055488332,
      name: "Chloe N.",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:08.332Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 5,
          teamId: 1751055612198,
          teamName: "I Heart Sheckles",
          teamNumber: "T6",
          partnerIds: [1751055491695],
          partnerNames: ["Kayla N."],
          qualRank: 4,
          qualAverage: 34.3,
          finalScore: 23,
          matchScores: [62, 13, 28],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 0,
        averagePlacement: 5,
        favoritePartners: [
          { studentId: 1751055491695, studentName: "Kayla N.", count: 1 },
        ],
      },
    },
    {
      id: 1751055491695,
      name: "Kayla N.",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:11.695Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 5,
          teamId: 1751055612198,
          teamName: "I Heart Sheckles",
          teamNumber: "T6",
          partnerIds: [1751055488332],
          partnerNames: ["Chloe N."],
          qualRank: 4,
          qualAverage: 34.3,
          finalScore: 23,
          matchScores: [62, 13, 28],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 0,
        averagePlacement: 5,
        favoritePartners: [
          { studentId: 1751055488332, studentName: "Chloe N.", count: 1 },
        ],
      },
    },
    {
      id: 1751055495846,
      name: "Ben A.",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:15.846Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 3,
          teamId: 1751055595523,
          teamName: "I am Hungry",
          teamNumber: "T5",
          partnerIds: [],
          partnerNames: [],
          qualRank: 5,
          qualAverage: 33,
          finalScore: 35,
          matchScores: [41, 30, 28],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 1,
        averagePlacement: 3,
        favoritePartners: [],
      },
    },
    {
      id: 1751055501534,
      name: "Carnegie P.",
      program: "VEX IQ",
      lifetimeXP: 181,
      sessionXP: {
        "Summer 2025 - Week 3": 55,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 1751056830775, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:21.534Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 1,
          teamId: 1751055584220,
          teamName: "I am Thirsty",
          teamNumber: "T4",
          partnerIds: [1751055462118],
          partnerNames: ["Vihaan D"],
          qualRank: 1,
          qualAverage: 41.3,
          finalScore: 57,
          matchScores: [41, 30, 53],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 1,
        podiumFinishes: 1,
        averagePlacement: 1,
        favoritePartners: [
          { studentId: 1751055462118, studentName: "Vihaan D", count: 1 },
        ],
      },
    },
    {
      id: 1751055506573,
      name: "Andrew A.",
      program: "VEX IQ",
      lifetimeXP: 122,
      sessionXP: {
        "Summer 2025 - Week 3": 25,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [102, 106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:26.573Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 5,
          teamId: 1751055565261,
          teamName: "idk",
          teamNumber: "T3",
          partnerIds: [1751055511946],
          partnerNames: ["Jackson C."],
          qualRank: 3,
          qualAverage: 35.3,
          finalScore: 23,
          matchScores: [23, 30, 53],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 0,
        averagePlacement: 5,
        favoritePartners: [
          { studentId: 1751055511946, studentName: "Jackson C.", count: 1 },
        ],
      },
    },
    {
      id: 1751055511946,
      name: "Jackson C.",
      program: "VEX IQ",
      lifetimeXP: 87,
      sessionXP: {
        "Summer 2025 - Week 3": 15,
      },
      achievements: [1],
      sessionAchievements: {
        "Summer 2025 - Week 3": [106],
      },
      avatar: "🤖",
      joinDate: "2025-06-27T20:18:31.946Z",
      sessionsAttended: ["Summer 2025 - Week 3"],
      tournamentHistory: [
        {
          tournamentId: "tournament-summer-2025-week3",
          tournamentName: "Summer 2025 Week 3 Championship",
          sessionId: "summer-2025-week3",
          sessionName: "Summer 2025 - Week 3",
          date: "2025-06-27T22:35:10.472Z",
          format: "teamwork",
          placement: 5,
          teamId: 1751055565261,
          teamName: "idk",
          teamNumber: "T3",
          partnerIds: [1751055506573],
          partnerNames: ["Andrew A."],
          qualRank: 3,
          qualAverage: 35.3,
          finalScore: 23,
          matchScores: [23, 30, 53],
        },
      ],
      tournamentStats: {
        totalTournaments: 1,
        championships: 0,
        podiumFinishes: 0,
        averagePlacement: 5,
        favoritePartners: [
          { studentId: 1751055506573, studentName: "Andrew A.", count: 1 },
        ],
      },
    },
  ];

  // Test Teams - 6 teams
  const testTeams = [
    {
      id: 1751055528826,
      name: "John Bot",
      number: "T1",
      studentIds: [1751055467059, 1751055479228, 1751055483528],
      studentNames: ["Mahira D", "Ava N.", "Jasmine N."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:18:48.826Z",
    },
    {
      id: 1751055538163,
      name: "Pizza",
      number: "T2",
      studentIds: [1751055471081, 1751055475711],
      studentNames: ["Bodhi T.", "Felix T."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:18:58.163Z",
    },
    {
      id: 1751055565261,
      name: "idk",
      number: "T3",
      studentIds: [1751055506573, 1751055511946],
      studentNames: ["Andrew A.", "Jackson C."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:19:25.261Z",
    },
    {
      id: 1751055584220,
      name: "I am Thirsty",
      number: "T4",
      studentIds: [1751055462118, 1751055501534],
      studentNames: ["Vihaan D", "Carnegie P."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:19:44.220Z",
    },
    {
      id: 1751055595523,
      name: "I am Hungry",
      number: "T5",
      studentIds: [1751055495846],
      studentNames: ["Ben A."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:19:55.524Z",
    },
    {
      id: 1751055612198,
      name: "I Heart Sheckles",
      number: "T6",
      studentIds: [1751055491695, 1751055488332],
      studentNames: ["Kayla N.", "Chloe N."],
      session: "Summer 2025 - Week 3",
      created: "2025-06-27T20:20:12.198Z",
    },
  ];

  // Test Achievements
  const testAchievements = [
    {
      id: 1,
      name: "First Steps",
      icon: "🎯",
      description: "Join your first session",
      xp: 50,
      type: "lifetime",
      category: "general",
    },
    {
      id: 2,
      name: "Team Player",
      icon: "🤝",
      description: "Join a team",
      xp: 25,
      type: "lifetime",
      category: "general",
    },
    {
      id: 3,
      name: "Champion",
      icon: "🏆",
      description: "Win a tournament",
      xp: 100,
      type: "lifetime",
      category: "general",
    },
    {
      id: 4,
      name: "Rising Star",
      icon: "⭐",
      description: "Earn 100 XP",
      xp: 50,
      type: "lifetime",
      category: "general",
    },
    {
      id: 5,
      name: "Super Star",
      icon: "🌟",
      description: "Earn 500 XP",
      xp: 100,
      type: "lifetime",
      category: "general",
    },
    {
      id: 6,
      name: "Legend",
      icon: "👑",
      description: "Earn 1000 XP",
      xp: 200,
      type: "lifetime",
      category: "general",
    },
    {
      id: 7,
      name: "Loyal Member",
      icon: "💎",
      description: "Attend 5 sessions",
      xp: 75,
      type: "lifetime",
      category: "general",
    },
    {
      id: 8,
      name: "Veteran",
      icon: "🎖️",
      description: "Attend 10 sessions",
      xp: 150,
      type: "lifetime",
      category: "general",
    },
    {
      id: 9,
      name: "Skills Master",
      icon: "🎮",
      description: "Score 50+ in skills",
      xp: 75,
      type: "lifetime",
      category: "general",
    },
    {
      id: 10,
      name: "Tournament Regular",
      icon: "📅",
      description: "Participate in 3 tournaments",
      xp: 100,
      type: "lifetime",
      category: "general",
    },
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
    {
      name: "Think Award",
      icon: "💡",
      description: "Complete the weekly auton challenge",
      xp: 30,
      type: "session",
      category: "summer",
      id: 1751056830775,
    },
  ];

  // Test Tournaments
  const testTournaments = [
    {
      id: "tournament-summer-2025-week3",
      name: "Summer 2025 Week 3 Championship",
      sessionId: "summer-2025-week3",
      sessionName: "Summer 2025 - Week 3",
      format: "teamwork",
      status: "completed",
      createdAt: "2025-06-27T20:00:00.000Z",
      completedAt: "2025-06-27T22:35:10.472Z",
      teams: [
        1751055528826, 1751055538163, 1751055565261, 1751055584220,
        1751055595523, 1751055612198,
      ],
      matches: {
        quals: [
          {
            id: 1751061021785,
            matchNumber: "Q1",
            teams: [1751055528826, 1751055612198],
            score: 62,
          },
          {
            id: 1751061194991,
            matchNumber: "Q2",
            teams: [1751055538163, 1751055565261],
            score: 23,
          },
          {
            id: 1751061454994,
            matchNumber: "Q3",
            teams: [1751055584220, 1751055595523],
            score: 41,
          },
          {
            id: 1751061682538,
            matchNumber: "Q4",
            teams: [1751055538163, 1751055612198],
            score: 13,
          },
          {
            id: 1751061885004,
            matchNumber: "Q5",
            teams: [1751055528826, 1751055584220],
            score: 30,
          },
          {
            id: 1751062080447,
            matchNumber: "Q6",
            teams: [1751055565261, 1751055595523],
            score: 30,
          },
          {
            id: 1751062318627,
            matchNumber: "Q7",
            teams: [1751055528826, 1751055538163],
            score: 20,
          },
          {
            id: 1751062497110,
            matchNumber: "Q8",
            teams: [1751055565261, 1751055584220],
            score: 53,
          },
          {
            id: 1751062792102,
            matchNumber: "Q9",
            teams: [1751055595523, 1751055612198],
            score: 28,
          },
        ],
        finals: [
          {
            id: 1751063275736,
            matchNumber: "F1",
            teams: [1751055538163, 1751055595523],
            score: 35,
          },
          {
            id: 1751063511809,
            matchNumber: "F2",
            teams: [1751055565261, 1751055612198],
            score: 23,
          },
          {
            id: 1751063710472,
            matchNumber: "F3",
            teams: [1751055528826, 1751055584220],
            score: 57,
          },
        ],
      },
      results: {
        qualRankings: [
          { teamId: 1751055584220, rank: 1, average: 41.3, matches: 3 },
          { teamId: 1751055528826, rank: 2, average: 37.3, matches: 3 },
          { teamId: 1751055565261, rank: 3, average: 35.3, matches: 3 },
          { teamId: 1751055612198, rank: 4, average: 34.3, matches: 3 },
          { teamId: 1751055595523, rank: 5, average: 33, matches: 3 },
          { teamId: 1751055538163, rank: 6, average: 18.7, matches: 3 },
        ],
        finalRankings: [
          { teamId: 1751055528826, rank: 1, score: 57 },
          { teamId: 1751055584220, rank: 1, score: 57 },
          { teamId: 1751055538163, rank: 3, score: 35 },
          { teamId: 1751055595523, rank: 3, score: 35 },
          { teamId: 1751055565261, rank: 5, score: 23 },
          { teamId: 1751055612198, rank: 5, score: 23 },
        ],
      },
      config: {
        matchDuration: 120,
        autoWinMargin: 10,
        customGameName: "",
        showLiveScoring: true,
        showFinalRankings: true,
        requireAllMatchesComplete: true,
      },
    },
  ];

  // Test Attendance
  const testAttendance = {
    "Summer 2025 - Week 3": {
      "2025-06-23": {
        1751055462118: "present",
        1751055467059: "present",
        1751055471081: "present",
        1751055475711: "present",
        1751055479228: "present",
        1751055483528: "present",
        1751055488332: "present",
        1751055491695: "present",
        1751055495846: "present",
        1751055501534: "present",
        1751055506573: "present",
        1751055511946: "present",
      },
      "2025-06-25": {
        1751055462118: "present",
        1751055467059: "present",
        1751055471081: "present",
        1751055475711: "present",
        1751055479228: "present",
        1751055483528: "present",
        1751055488332: "present",
        1751055491695: "present",
        1751055495846: "present",
        1751055501534: "present",
        1751055506573: "present",
        1751055511946: "present",
      },
      "2025-06-27": {
        1751055462118: "present",
        1751055467059: "present",
        1751055471081: "present",
        1751055475711: "present",
        1751055479228: "present",
        1751055483528: "present",
        1751055488332: "present",
        1751055491695: "present",
        1751055495846: "present",
        1751055501534: "present",
        1751055506573: "present",
        1751055511946: "present",
      },
    },
  };

  // Test Teamwork Matches
  const testTeamworkMatches = [
    {
      id: 1751061021785,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q1",
      teams: [1751055528826, 1751055612198],
      score: 62,
      timestamp: "2025-06-27T21:50:21.785Z",
    },
    {
      id: 1751061194991,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q2",
      teams: [1751055538163, 1751055565261],
      score: 23,
      timestamp: "2025-06-27T21:53:14.991Z",
    },
    {
      id: 1751061454994,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q3",
      teams: [1751055584220, 1751055595523],
      score: 41,
      timestamp: "2025-06-27T21:57:34.994Z",
    },
    {
      id: 1751061682538,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q4",
      teams: [1751055538163, 1751055612198],
      score: 13,
      timestamp: "2025-06-27T22:01:22.538Z",
    },
    {
      id: 1751061885004,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q5",
      teams: [1751055528826, 1751055584220],
      score: 30,
      timestamp: "2025-06-27T22:04:45.004Z",
    },
    {
      id: 1751062080447,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q6",
      teams: [1751055565261, 1751055595523],
      score: 30,
      timestamp: "2025-06-27T22:08:00.447Z",
    },
    {
      id: 1751062318627,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q7",
      teams: [1751055528826, 1751055538163],
      score: 20,
      timestamp: "2025-06-27T22:11:58.627Z",
    },
    {
      id: 1751062497110,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q8",
      teams: [1751055565261, 1751055584220],
      score: 53,
      timestamp: "2025-06-27T22:14:57.110Z",
    },
    {
      id: 1751062792102,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "Q9",
      teams: [1751055595523, 1751055612198],
      score: 28,
      timestamp: "2025-06-27T22:19:52.103Z",
    },
    {
      id: 1751063275736,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "F1",
      teams: [1751055538163, 1751055595523],
      score: 35,
      timestamp: "2025-06-27T22:27:55.736Z",
    },
    {
      id: 1751063511809,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "F2",
      teams: [1751055565261, 1751055612198],
      score: 23,
      timestamp: "2025-06-27T22:31:51.809Z",
    },
    {
      id: 1751063710472,
      session: "Summer 2025 - Week 3",
      matchType: "teamwork",
      matchNumber: "F3",
      teams: [1751055528826, 1751055584220],
      score: 57,
      timestamp: "2025-06-27T22:35:10.472Z",
    },
  ];

  // Test Student Milestones
  const testStudentMilestones = {
    1751055462118: {
      "Summer 2025 - Week 3": ["attendance", "xpGoal", "completion"],
    },
    1751055467059: {
      "Summer 2025 - Week 3": ["attendance", "xpGoal", "completion"],
    },
    1751055471081: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055475711: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055479228: {
      "Summer 2025 - Week 3": ["attendance", "xpGoal", "completion"],
    },
    1751055483528: {
      "Summer 2025 - Week 3": ["attendance", "xpGoal", "completion"],
    },
    1751055488332: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055491695: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055495846: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055501534: {
      "Summer 2025 - Week 3": ["attendance", "xpGoal", "completion"],
    },
    1751055506573: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
    1751055511946: {
      "Summer 2025 - Week 3": ["attendance", "completion"],
    },
  };

  // Initialize all test data
  localStorage.setItem("vexLifetimeStudents", JSON.stringify(testStudents));
  localStorage.setItem("vexSessions", JSON.stringify(testSessions));
  localStorage.setItem("vexCurrentSession", "Summer 2025 - Week 3");
  localStorage.setItem("vexTeams", JSON.stringify(testTeams));
  localStorage.setItem("vexTournaments", JSON.stringify(testTournaments));
  localStorage.setItem("vexAttendance", JSON.stringify(testAttendance));
  localStorage.setItem("vexAchievements", JSON.stringify(testAchievements));
  localStorage.setItem(
    "vexTeamworkMatches",
    JSON.stringify(testTeamworkMatches)
  );
  localStorage.setItem("vexSkillsScores", JSON.stringify([]));
  localStorage.setItem(
    "vexStudentMilestones",
    JSON.stringify(testStudentMilestones)
  );

  console.log("✅ Test data initialized successfully!");
  console.log("📋 12 students loaded with tournament history");
  console.log("👥 6 teams created");
  console.log("📅 2 sessions available");
  console.log("🏆 1 completed tournament with full results");
  console.log("🎯 All students have achievements and XP");

  // Optional: Return the data for verification
  return {
    students: testStudents,
    sessions: testSessions,
    teams: testTeams,
    tournaments: testTournaments,
    attendance: testAttendance,
    achievements: testAchievements,
    teamworkMatches: testTeamworkMatches,
    studentMilestones: testStudentMilestones,
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
