import React, { useState, useEffect } from "react";

const DailyXPAwardModal = ({
  students,
  currentSession,
  sessions,
  onClose,
  onAwardXP,
  attendance,
}) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedAwards, setSelectedAwards] = useState({});
  const [awardNotes, setAwardNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Get session type
  const getSessionType = () => {
    const session = sessions.find((s) => s.name === currentSession);
    return session?.type || "general";
  };

  const sessionType = getSessionType();

  // Define daily XP awards based on session type
  const dailySessionXP = {
    // Base XP that applies to all session types
    base: {
      "daily-participation": {
        name: "Daily Participation",
        icon: "✋",
        xp: 5,
        description: "Attended and participated in class",
      },
      "good-listener": {
        name: "Good Listener",
        icon: "👂",
        xp: 5,
        description: "Listened attentively during instruction",
      },
      "clean-workspace": {
        name: "Clean Workspace",
        icon: "🧹",
        xp: 5,
        description: "Kept workspace organized and clean",
      },
      "early-bird": {
        name: "Early Bird",
        icon: "🐦",
        xp: 5,
        description: "Arrived early and ready to learn",
      },
      miscellaneous: {
        name: "Miscellaneous",
        icon: "⭐",
        xp: 5,
        description: "Other positive contribution",
      },
    },

    // Session-type specific XP
    summer: {
      "robot-build": {
        name: "Robot Build",
        icon: "🔧",
        xp: 10,
        description: "Completed robot building task",
      },
      coding: {
        name: "Coding",
        icon: "💻",
        xp: 10,
        description: "Completed programming task",
      },
      "problem-solver": {
        name: "Problem Solver",
        icon: "🧩",
        xp: 10,
        description: "Solved a challenging problem",
      },
      "challenge-champion": {
        name: "Challenge Champion",
        icon: "🏆",
        xp: 15,
        description: "Won or excelled in a challenge",
      },
      "team-collaboration": {
        name: "Team Collaboration",
        icon: "🤝",
        xp: 10,
        description: "Worked well with teammates",
      },
      "class-helper": {
        name: "Class Helper",
        icon: "🦸",
        xp: 10,
        description: "Helped other students or teacher",
      },
    },

    "school-go": {
      "robot-build": {
        name: "Robot Build",
        icon: "🔧",
        xp: 10,
        description: "Completed VEX GO building task",
      },
      coding: {
        name: "Coding",
        icon: "💻",
        xp: 8,
        description: "Completed GO coding task",
      },
      "problem-solver": {
        name: "Problem Solver",
        icon: "🧩",
        xp: 10,
        description: "Solved a GO challenge",
      },
      "challenge-champion": {
        name: "Challenge Champion",
        icon: "🏆",
        xp: 15,
        description: "Excelled in GO challenge",
      },
      "team-collaboration": {
        name: "Team Collaboration",
        icon: "🤝",
        xp: 12,
        description: "Great teamwork with partner",
      },
      "class-helper": {
        name: "Class Helper",
        icon: "🦸",
        xp: 10,
        description: "Helped classmates",
      },
    },

    "school-iq": {
      "robot-build": {
        name: "Robot Build",
        icon: "🔧",
        xp: 10,
        description: "Completed IQ robot build",
      },
      coding: {
        name: "Coding",
        icon: "💻",
        xp: 12,
        description: "Advanced IQ programming",
      },
      "problem-solver": {
        name: "Problem Solver",
        icon: "🧩",
        xp: 12,
        description: "Solved complex IQ problem",
      },
      "challenge-champion": {
        name: "Challenge Champion",
        icon: "🏆",
        xp: 15,
        description: "Won IQ challenge",
      },
      "team-collaboration": {
        name: "Team Collaboration",
        icon: "🤝",
        xp: 10,
        description: "Effective team coordination",
      },
      "class-helper": {
        name: "Class Helper",
        icon: "🦸",
        xp: 10,
        description: "Mentored other students",
      },
      "engineering-notebook": {
        name: "Engineering Notebook",
        icon: "📓",
        xp: 10,
        description: "Quality notebook documentation",
      },
    },

    competition: {
      "robot-build": {
        name: "Robot Build",
        icon: "🔧",
        xp: 15,
        description: "Competition robot work",
      },
      coding: {
        name: "Coding",
        icon: "💻",
        xp: 15,
        description: "Competition programming",
      },
      "problem-solver": {
        name: "Problem Solver",
        icon: "🧩",
        xp: 15,
        description: "Solved competition challenge",
      },
      "challenge-champion": {
        name: "Challenge Champion",
        icon: "🏆",
        xp: 20,
        description: "Excellence in competition prep",
      },
      "team-collaboration": {
        name: "Team Collaboration",
        icon: "🤝",
        xp: 15,
        description: "Competition team synergy",
      },
      "class-helper": {
        name: "Class Helper",
        icon: "🦸",
        xp: 10,
        description: "Helped team members",
      },
      "engineering-notebook": {
        name: "Engineering Notebook",
        icon: "📓",
        xp: 15,
        description: "Competition notebook entry",
      },
      "strategy-planning": {
        name: "Strategy Planning",
        icon: "🎯",
        xp: 10,
        description: "Developed game strategy",
      },
    },
  };

  // Get available awards for current session type
  const getAvailableAwards = () => {
    return {
      ...dailySessionXP.base,
      ...(dailySessionXP[sessionType] || {}),
    };
  };

  const availableAwards = getAvailableAwards();

  // Get enrolled students for current session
  const enrolledStudents = students.filter(
    (s) =>
      s.enrolledSessions?.includes(currentSession) ||
      s.sessionsAttended?.includes(currentSession)
  );

  // Calculate total XP to be awarded
  const calculateTotalXP = () => {
    return Object.entries(selectedAwards)
      .filter(([_, isSelected]) => isSelected)
      .reduce((total, [awardId, _]) => total + availableAwards[awardId].xp, 0);
  };

  // Check if student was present on selected date
  const wasStudentPresent = () => {
    if (!selectedStudent || !selectedDate) return null;
    const status =
      attendance[currentSession]?.[selectedDate]?.[selectedStudent];
    return status === "present" || status === "late";
  };

  // Toggle award selection
  const toggleAward = (awardId) => {
    setSelectedAwards((prev) => ({
      ...prev,
      [awardId]: !prev[awardId],
    }));
  };

  // Handle award submission
  const handleAwardSubmit = () => {
    if (
      !selectedStudent ||
      Object.keys(selectedAwards).filter((k) => selectedAwards[k]).length === 0
    ) {
      alert("Please select a student and at least one award");
      return;
    }

    const totalXP = calculateTotalXP();
    const awardsGiven = Object.entries(selectedAwards)
      .filter(([_, isSelected]) => isSelected)
      .map(([awardId, _]) => ({
        id: awardId,
        ...availableAwards[awardId],
      }));

    // Call the award function
    onAwardXP(selectedStudent, totalXP, awardsGiven, selectedDate, awardNotes);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setSelectedAwards({});
      setAwardNotes("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🌟</span>
            Daily XP Awards
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-600">
            ×
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-pulse">
            <p className="text-center font-semibold text-green-800">
              ✅ {calculateTotalXP()} XP Awarded Successfully!
            </p>
          </div>
        )}

        {/* Student and Date Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Choose a student...</option>
              {enrolledStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.program}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Attendance Status Alert */}
        {selectedStudent && selectedDate && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              wasStudentPresent() === true
                ? "bg-green-50 border border-green-200"
                : wasStudentPresent() === false
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p className="text-sm">
              {wasStudentPresent() === true &&
                "✅ Student was present on this date"}
              {wasStudentPresent() === false &&
                "❌ Student was absent on this date"}
              {wasStudentPresent() === null &&
                "⚠️ No attendance record for this date"}
            </p>
          </div>
        )}

        {/* Awards Grid */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Awards to Give</h3>

          {/* Base Awards */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Daily Awards
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(dailySessionXP.base).map(([awardId, award]) => (
                <label
                  key={awardId}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAwards[awardId]
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAwards[awardId] || false}
                    onChange={() => toggleAward(awardId)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{award.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{award.name}</div>
                      <div className="text-xs text-gray-600">
                        {award.description}
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        +{award.xp} XP
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Session Type Specific Awards */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              {sessionType === "summer" && "Summer Camp Awards"}
              {sessionType === "school-go" && "VEX GO Awards"}
              {sessionType === "school-iq" && "VEX IQ Awards"}
              {sessionType === "competition" && "Competition Team Awards"}
              {!["summer", "school-go", "school-iq", "competition"].includes(
                sessionType
              ) && "Session Awards"}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(dailySessionXP[sessionType] || {}).map(
                ([awardId, award]) => (
                  <label
                    key={awardId}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAwards[awardId]
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAwards[awardId] || false}
                      onChange={() => toggleAward(awardId)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{award.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{award.name}</div>
                        <div className="text-xs text-gray-600">
                          {award.description}
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          +{award.xp} XP
                        </div>
                      </div>
                    </div>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={awardNotes}
            onChange={(e) => setAwardNotes(e.target.value)}
            placeholder="Add any notes about these awards..."
            className="w-full px-3 py-2 border rounded-lg h-20 resize-none"
          />
        </div>

        {/* Total XP Display */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {calculateTotalXP()} XP
            </div>
            <div className="text-sm text-gray-600">
              Total to Award ({Math.floor(calculateTotalXP() * 0.3)} XP to
              Lifetime)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAwardSubmit}
            disabled={!selectedStudent || calculateTotalXP() === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Award XP
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyXPAwardModal;
