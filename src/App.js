import React, { useState, useEffect } from "react";

const VEXLifetimeAchievementSystem = () => {
  // Enhanced data structure with lifetime and session tracking
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState([
    // === Core Lifetime Achievements ===
    {
      id: 1,
      name: "First Robot",
      icon: "🤖",
      description: "Build your very first robot",
      xp: 50,
      type: "lifetime",
    },
    {
      id: 2,
      name: "Code Master",
      icon: "💻",
      description: "Write 10 successful programs",
      xp: 100,
      type: "lifetime",
    },
    {
      id: 3,
      name: "VEX Veteran",
      icon: "⭐",
      description: "Complete 5 camps/sessions",
      xp: 200,
      type: "lifetime",
    },
    {
      id: 4,
      name: "Mentor",
      icon: "🌟",
      description: "Help 10 different students",
      xp: 150,
      type: "lifetime",
    },
    {
      id: 5,
      name: "Summer Legend",
      icon: "☀️",
      description: "Complete all 7 summer camps",
      xp: 500,
      type: "lifetime",
    },
    {
      id: 6,
      name: "Consistent Builder",
      icon: "🏗️",
      description: "Earn Speed Builder in 4+ sessions",
      xp: 200,
      type: "lifetime",
    },
    {
      id: 7,
      name: "Attendance Champion",
      icon: "📅",
      description: "Perfect attendance in 5+ sessions",
      xp: 300,
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
  const [showAttendanceManager, setShowAttendanceManager] = useState(false);

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
  const [currentView, setCurrentView] = useState("dashboard");
  const [showStudentManager, setShowStudentManager] = useState(false);
  const [showAchievementManager, setShowAchievementManager] = useState(false);
  const [xpToAward, setXpToAward] = useState(10);
  const [filterProgram, setFilterProgram] = useState("ALL");
  const [showBulkAward, setShowBulkAward] = useState(false);
  const [bulkSelectedStudents, setBulkSelectedStudents] = useState([]);

  // Tournament Management States
  const [teams, setTeams] = useState([]);
  const [teamworkMatches, setTeamworkMatches] = useState([]);
  const [skillsScores, setSkillsScores] = useState([]);
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showMatchEntry, setShowMatchEntry] = useState(false);
  const [showSkillsEntry, setShowSkillsEntry] = useState(false);
  const [showTournamentView, setShowTournamentView] = useState(false);
  const [skillsType, setSkillsType] = useState("driver");

  // Session completion milestones
  const sessionMilestones = {
    attendance: {
      name: "Perfect Attendance",
      requirement: "Attend all days",
      lifetimeBonus: 25,
      icon: "📅",
    },
    xpGoal: {
      name: "Session Champion",
      requirement: "Earn 100+ session XP",
      lifetimeBonus: 50,
      icon: "🏆",
    },
    helper: {
      name: "Team Builder",
      requirement: "Help 3+ students",
      lifetimeBonus: 30,
      icon: "🤝",
    },
    completion: {
      name: "Session Complete",
      requirement: "Complete the session",
      lifetimeBonus: 40,
      icon: "✅",
    },
  };

  // Track session milestones per student
  const [studentMilestones, setStudentMilestones] = useState({});

  // Load data on mount
  useEffect(() => {
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
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          if (isLifetime) {
            // Direct lifetime award (achievements, bonuses)
            return {
              ...student,
              lifetimeXP: Math.max(0, student.lifetimeXP + amount),
            };
          } else {
            // Session award with partial lifetime contribution
            const sessionXP = { ...student.sessionXP };
            sessionXP[currentSession] = Math.max(
              0,
              (sessionXP[currentSession] || 0) + amount
            );

            // 30% automatically goes to lifetime XP
            const lifetimeContribution = Math.floor(amount * 0.3);
            const newLifetimeXP =
              student.lifetimeXP + (amount > 0 ? lifetimeContribution : 0);

            return {
              ...student,
              sessionXP,
              lifetimeXP: Math.max(0, newLifetimeXP),
            };
          }
        }
        return student;
      })
    );
  };

  // Award achievement - SIMPLE FINAL VERSION
  const awardAchievement = (studentId, achievementId) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) return;

    // Check BEFORE state update to show alerts
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    if (
      achievement.type === "lifetime" &&
      student.achievements?.includes(achievementId)
    ) {
      alert(`${student.name} already earned "${achievement.name}"!`);
      return;
    }

    if (achievement.type === "session") {
      const currentSessionAchievements =
        student.sessionAchievements?.[currentSession] || [];
      if (currentSessionAchievements.includes(achievementId)) {
        alert(
          `${student.name} already earned "${achievement.name}" this session!`
        );
        return;
      }
    }

    // Now do the state update - using functional update to ensure we always get latest state
    setStudents((prev) => {
      // Find the most current version of the student
      const currentStudent = prev.find((s) => s.id === studentId);
      if (!currentStudent) return prev;

      // Check again with the most current data
      if (achievement.type === "session") {
        const currentAchievements =
          currentStudent.sessionAchievements?.[currentSession] || [];
        if (currentAchievements.includes(achievementId)) {
          // Already has it in the current state, no update needed
          return prev;
        }
      }

      // Now we definitely need to add it
      return prev.map((s) => {
        if (s.id !== studentId) return s;

        if (achievement.type === "lifetime") {
          return {
            ...s,
            achievements: [...(s.achievements || []), achievementId],
            lifetimeXP: (s.lifetimeXP || 0) + achievement.xp,
          };
        } else {
          // Session achievement - do everything in one shot
          const updatedStudent = {
            ...s,
            sessionAchievements: {
              ...s.sessionAchievements,
              [currentSession]: [
                ...(s.sessionAchievements?.[currentSession] || []),
                achievementId,
              ],
            },
            sessionXP: {
              ...s.sessionXP,
              [currentSession]:
                (s.sessionXP?.[currentSession] || 0) + achievement.xp,
            },
            lifetimeXP: (s.lifetimeXP || 0) + Math.floor(achievement.xp * 0.3),
          };

          return updatedStudent;
        }
      });
    });
  };

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
    const milestone = sessionMilestones[milestoneKey];
    if (!milestone) return;

    // Check if already awarded for this session
    const studentSessionMilestones =
      studentMilestones[studentId]?.[currentSession] || [];
    if (studentSessionMilestones.includes(milestoneKey)) return;

    // Award lifetime bonus
    awardXP(studentId, milestone.lifetimeBonus, true);

    // Track milestone
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
      exportDate: new Date().toISOString(),
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
    setTeamworkMatches([...teamworkMatches, match]);
  };

  const handleSaveSkillsScore = (score) => {
    setSkillsScores([...skillsScores, score]);
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

  // Tournament Control Buttons
  const TournamentButtons = () => (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setShowTeamManager(true)}
        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white"
      >
        👥 Teams
      </button>
      <button
        onClick={() => setShowMatchEntry(true)}
        className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-white"
      >
        🤝 Teamwork
      </button>
      <button
        onClick={() => {
          setSkillsType("driver");
          setShowSkillsEntry(true);
        }}
        className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-white"
      >
        🎮 Driver Skills
      </button>
      <button
        onClick={() => {
          setSkillsType("autonomous");
          setShowSkillsEntry(true);
        }}
        className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700 text-white"
      >
        🤖 Auton Skills
      </button>
      <button
        onClick={() => setShowTournamentView(true)}
        className="px-3 py-1 bg-orange-600 rounded hover:bg-orange-700 text-white"
      >
        📊 Tournament
      </button>
    </div>
  );

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

  // Student Card Component
  const StudentCard = ({ student }) => {
    const lifetimeLevel = getStudentLevel(student.lifetimeXP || 0);
    const sessionXP = getSessionXP(student);
    const nextLevel = levels[lifetimeLevel.level] || levels[levels.length - 1];
    const xpProgress =
      ((student.lifetimeXP - lifetimeLevel.minXP) /
        (nextLevel.minXP - lifetimeLevel.minXP)) *
      100;

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
        onClick={() => setSelectedStudent(student)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{student.avatar}</div>
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
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

  const StudentDetail = () => {
    if (!selectedStudent) return null;

    // Always get fresh data from students array
    const currentStudent = students.find((s) => s.id === selectedStudent.id);
    if (!currentStudent) return null;

    const [showXPAnimation, setShowXPAnimation] = useState(null);
    const [showManualXP, setShowManualXP] = useState(false);

    const lifetimeLevel = getStudentLevel(currentStudent.lifetimeXP || 0);
    const sessionXP = getSessionXP(currentStudent);
    const earnedMilestones = getStudentMilestones(currentStudent.id);

    const lifetimeAchievements = achievements.filter(
      (a) =>
        a.type === "lifetime" &&
        (currentStudent.achievements || []).includes(a.id)
    );

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
              onClick={() => setSelectedStudent(null)}
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

          {/* Session Completion Bonuses */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              🎯 Session Completion Bonuses
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(sessionMilestones).map(([key, milestone]) => {
                const isEarned = earnedMilestones.includes(key);
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border ${
                      isEarned
                        ? "bg-green-100 border-green-300"
                        : "bg-white border-gray-200 cursor-pointer hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      !isEarned && awardMilestone(currentStudent.id, key)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {milestone.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {milestone.requirement}
                        </div>
                        <div
                          className={`text-xs font-bold ${
                            isEarned ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          {isEarned
                            ? "✓ Earned"
                            : `+${milestone.lifetimeBonus} Lifetime XP`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifetime Achievements */}
          {lifetimeAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">
                🏆 Earned Lifetime Achievements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {lifetimeAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {achievement.xp} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Session Achievements - Simplified Single Section */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">🎯 Current Session Achievements</h3>
            <div className="grid grid-cols-2 gap-2">
              {achievements
                .filter(
                  (a) =>
                    a.type === "session" &&
                    getSessionCategory(getCurrentSessionObject()) === a.category
                )
                .map((achievement) => {
                  const currentSessionAchievements =
                    currentStudent.sessionAchievements?.[currentSession] || [];
                  const isEarned = currentSessionAchievements.includes(
                    achievement.id
                  );
                  const totalEarnCount = getAchievementEarnCount(
                    currentStudent,
                    achievement.id
                  );

                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border ${
                        isEarned
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-gray-200 cursor-pointer hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (!isEarned) {
                          handleAchievementAward(achievement.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-2xl ${
                            isEarned ? "" : "grayscale opacity-50"
                          }`}
                        >
                          {achievement.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {achievement.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {achievement.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {achievement.xp} XP •
                            {totalEarnCount > 0
                              ? ` Earned ${totalEarnCount} time${
                                  totalEarnCount !== 1 ? "s" : ""
                                }`
                              : " Not yet earned"}
                            {isEarned && (
                              <span className="text-green-600 ml-2">
                                • ✓ Earned this session!
                              </span>
                            )}
                          </div>
                        </div>
                        {isEarned && (
                          <div className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                            ✓ Earned
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Available Lifetime Achievements */}
            {achievements.filter(
              (a) =>
                a.type === "lifetime" &&
                !(currentStudent.achievements || []).includes(a.id)
            ).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Available Lifetime Achievements
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {achievements
                    .filter(
                      (a) =>
                        a.type === "lifetime" &&
                        !(currentStudent.achievements || []).includes(a.id)
                    )
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAchievementAward(achievement.id)}
                      >
                        <span className="text-xl grayscale opacity-50">
                          {achievement.icon}
                        </span>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {achievement.name}
                          </div>
                          <div className="text-gray-500">
                            Click to award • {achievement.xp} XP
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">
              🤖 VEX Lifetime Achievement System
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                className="px-3 py-2 rounded bg-blue-700 text-white"
              >
                {sessions
                  .filter((s) => s.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((session) => (
                    <option key={session.id} value={session.name}>
                      {session.name}
                    </option>
                  ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`px-4 py-2 rounded ${
                    currentView === "dashboard"
                      ? "bg-blue-800"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("leaderboard")}
                  className={`px-4 py-2 rounded ${
                    currentView === "leaderboard"
                      ? "bg-blue-800"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  Leaderboard
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setShowSessionManager(true)}
              className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              📅 Manage Sessions
            </button>
            <button
              onClick={() => setShowStudentManager(true)}
              className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              👥 Manage Students
            </button>
            <button
              onClick={() => setShowAchievementManager(true)}
              className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              🏅 Manage Achievements
            </button>
            <button
              onClick={() => setShowBulkAward(true)}
              className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-white"
            >
              🏅 Bulk Award
            </button>
            <button
              onClick={exportData}
              className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              📥 Export All Data
            </button>
            <TournamentButtons />
          </div>
        </div>
      </div>
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
      {selectedStudent && <StudentDetail />}
      {showSessionManager && <SessionManager />}
      {showStudentManager && <StudentManager />}
      {showAchievementManager && <AchievementManager />}
      {showBulkAward && <BulkAchievementAward />}
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
    </div>
  );
};

export default VEXLifetimeAchievementSystem;
