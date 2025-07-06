import React, { useState, useEffect, useRef } from 'react';

const UnifiedXPAwardModal = ({ 
  students, 
  currentSession, 
  sessions,
  achievements,
  onClose,
  onAwardXP,
  onAwardAchievement,
  attendance
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDailyAwards, setSelectedDailyAwards] = useState({});
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [awardNotes, setAwardNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'achievements'

  const modalRef = useRef(null);

  // Get session type
  const getSessionType = () => {
    const session = sessions.find(s => s.name === currentSession);
    return session?.type || 'general';
  };

  const sessionType = getSessionType();

  // Define daily XP awards based on session type
  const dailySessionXP = {
    // Base XP that applies to all session types
    base: {
      'daily-participation': { 
        name: 'Daily Participation', 
        icon: '✋', 
        xp: 5,
        description: 'Attended and participated in class'
      },
      'good-listener': { 
        name: 'Good Listener', 
        icon: '👂', 
        xp: 5,
        description: 'Listened attentively during instruction'
      },
      'clean-workspace': { 
        name: 'Clean Workspace', 
        icon: '🧹', 
        xp: 5,
        description: 'Kept workspace organized and clean'
      },
      'early-bird': { 
        name: 'Early Bird', 
        icon: '🐦', 
        xp: 5,
        description: 'Arrived early and ready to learn'
      },
      'miscellaneous': { 
        name: 'Miscellaneous', 
        icon: '⭐', 
        xp: 5,
        description: 'Other positive contribution'
      }
    },
    
    // Session-type specific XP
    summer: {
      'robot-build': { 
        name: 'Robot Build', 
        icon: '🔧', 
        xp: 10,
        description: 'Completed robot building task'
      },
      'coding': { 
        name: 'Coding', 
        icon: '💻', 
        xp: 10,
        description: 'Completed programming task'
      },
      'problem-solver': { 
        name: 'Problem Solver', 
        icon: '🧩', 
        xp: 10,
        description: 'Solved a challenging problem'
      },
      'challenge-champion': { 
        name: 'Challenge Champion', 
        icon: '🏆', 
        xp: 15,
        description: 'Won or excelled in a challenge'
      },
      'team-collaboration': { 
        name: 'Team Collaboration', 
        icon: '🤝', 
        xp: 10,
        description: 'Worked well with teammates'
      },
      'class-helper': { 
        name: 'Class Helper', 
        icon: '🦸', 
        xp: 10,
        description: 'Helped other students or teacher'
      }
    },
    
    'school-go': {
      'robot-build': { 
        name: 'Robot Build', 
        icon: '🔧', 
        xp: 10,
        description: 'Completed VEX GO building task'
      },
      'coding': { 
        name: 'Coding', 
        icon: '💻', 
        xp: 8,
        description: 'Completed GO coding task'
      },
      'problem-solver': { 
        name: 'Problem Solver', 
        icon: '🧩', 
        xp: 10,
        description: 'Solved a GO challenge'
      },
      'challenge-champion': { 
        name: 'Challenge Champion', 
        icon: '🏆', 
        xp: 15,
        description: 'Excelled in GO challenge'
      },
      'team-collaboration': { 
        name: 'Team Collaboration', 
        icon: '🤝', 
        xp: 12,
        description: 'Great teamwork with partner'
      },
      'class-helper': { 
        name: 'Class Helper', 
        icon: '🦸', 
        xp: 10,
        description: 'Helped classmates'
      }
    },
    
    'school-iq': {
      'robot-build': { 
        name: 'Robot Build', 
        icon: '🔧', 
        xp: 10,
        description: 'Completed IQ robot build'
      },
      'coding': { 
        name: 'Coding', 
        icon: '💻', 
        xp: 12,
        description: 'Advanced IQ programming'
      },
      'problem-solver': { 
        name: 'Problem Solver', 
        icon: '🧩', 
        xp: 12,
        description: 'Solved complex IQ problem'
      },
      'challenge-champion': { 
        name: 'Challenge Champion', 
        icon: '🏆', 
        xp: 15,
        description: 'Won IQ challenge'
      },
      'team-collaboration': { 
        name: 'Team Collaboration', 
        icon: '🤝', 
        xp: 10,
        description: 'Effective team coordination'
      },
      'class-helper': { 
        name: 'Class Helper', 
        icon: '🦸', 
        xp: 10,
        description: 'Mentored other students'
      },
      'engineering-notebook': { 
        name: 'Engineering Notebook', 
        icon: '📓', 
        xp: 10,
        description: 'Quality notebook documentation'
      }
    },
    
    competition: {
      'robot-build': { 
        name: 'Robot Build', 
        icon: '🔧', 
        xp: 15,
        description: 'Competition robot work'
      },
      'coding': { 
        name: 'Coding', 
        icon: '💻', 
        xp: 15,
        description: 'Competition programming'
      },
      'problem-solver': { 
        name: 'Problem Solver', 
        icon: '🧩', 
        xp: 15,
        description: 'Solved competition challenge'
      },
      'challenge-champion': { 
        name: 'Challenge Champion', 
        icon: '🏆', 
        xp: 20,
        description: 'Excellence in competition prep'
      },
      'team-collaboration': { 
        name: 'Team Collaboration', 
        icon: '🤝', 
        xp: 15,
        description: 'Competition team synergy'
      },
      'class-helper': { 
        name: 'Class Helper', 
        icon: '🦸', 
        xp: 10,
        description: 'Helped team members'
      },
      'engineering-notebook': { 
        name: 'Engineering Notebook', 
        icon: '📓', 
        xp: 15,
        description: 'Competition notebook entry'
      },
      'strategy-planning': { 
        name: 'Strategy Planning', 
        icon: '🎯', 
        xp: 10,
        description: 'Developed game strategy'
      }
    }
  };

  // Get available awards for current session type
  const getAvailableDailyAwards = () => {
    return {
      ...dailySessionXP.base,
      ...(dailySessionXP[sessionType] || {})
    };
  };

  const availableDailyAwards = getAvailableDailyAwards();

  // Get enrolled students for current session
  const enrolledStudents = students.filter(s => 
    s.enrolledSessions?.includes(currentSession) || 
    s.sessionsAttended?.includes(currentSession)
  );

  // Get available session achievements
  const sessionCategory = sessionType === 'general' ? 'summer' : sessionType;
  const availableAchievements = achievements.filter(
    a => a.type === 'session' && a.category === sessionCategory
  );

  // Calculate total XP to be awarded
  const calculateTotalXP = () => {
    let dailyXP = Object.entries(selectedDailyAwards)
      .filter(([_, isSelected]) => isSelected)
      .reduce((total, [awardId, _]) => total + availableDailyAwards[awardId].xp, 0);
      
    let achievementXP = selectedAchievements.reduce((total, achievementId) => {
      const achievement = achievements.find(a => a.id === achievementId);
      return total + (achievement?.xp || 0);
    }, 0);
    
    return dailyXP + achievementXP;
  };

  // Toggle student selection
  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select all/none students
  const selectAllStudents = () => {
    setSelectedStudents(enrolledStudents.map(s => s.id));
  };

  const selectNoneStudents = () => {
    setSelectedStudents([]);
  };

  // Select present students
  const selectPresentStudents = () => {
    const presentStudents = enrolledStudents.filter(student => {
      const status = attendance[currentSession]?.[selectedDate]?.[student.id];
      return status === 'present' || status === 'late';
    });
    setSelectedStudents(presentStudents.map(s => s.id));
  };

  // Toggle daily award selection
  const toggleDailyAward = (awardId) => {
    setSelectedDailyAwards(prev => ({
      ...prev,
      [awardId]: !prev[awardId]
    }));
  };

  // Toggle achievement selection
  const toggleAchievement = (achievementId) => {
    setSelectedAchievements(prev => 
      prev.includes(achievementId)
        ? prev.filter(id => id !== achievementId)
        : [...prev, achievementId]
    );
  };

  // Handle award submission
  const handleAwardSubmit = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    const hasDailyAwards = Object.values(selectedDailyAwards).some(v => v);
    const hasAchievements = selectedAchievements.length > 0;

    if (!hasDailyAwards && !hasAchievements) {
      alert('Please select at least one award or achievement');
      return;
    }

    let totalAwarded = 0;
    let studentCount = 0;

    // Process each selected student
    selectedStudents.forEach(studentId => {
      // Award daily XP
      if (hasDailyAwards) {
        const dailyAwardsToGive = Object.entries(selectedDailyAwards)
          .filter(([_, isSelected]) => isSelected)
          .map(([awardId, _]) => ({
            id: awardId,
            ...availableDailyAwards[awardId]
          }));
        
        const dailyXP = dailyAwardsToGive.reduce((sum, award) => sum + award.xp, 0);
        
        if (dailyXP > 0) {
          onAwardXP(studentId, dailyXP, dailyAwardsToGive, selectedDate, awardNotes);
          totalAwarded += dailyXP;
        }
      }

      // Award achievements
      if (hasAchievements) {
        selectedAchievements.forEach(achievementId => {
          // Check if student already has this achievement
          const student = students.find(s => s.id === studentId);
          const currentSessionAchievements = student?.sessionAchievements?.[currentSession] || [];
          
          if (!currentSessionAchievements.includes(achievementId)) {
            onAwardAchievement(studentId, achievementId);
            const achievement = achievements.find(a => a.id === achievementId);
            if (achievement) {
              totalAwarded += achievement.xp;
            }
          }
        });
      }

      studentCount++;
    });

    // Show success message
    setSuccessMessage(`Awarded ${totalAwarded} total XP to ${studentCount} student${studentCount > 1 ? 's' : ''}!`);
    setShowSuccess(true);
    
    // ✅ Scroll to top of modal
    modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setSelectedDailyAwards({});
      setSelectedAchievements([]);
      setAwardNotes('');
      // Keep students selected for convenience
    }, 3000);
  };

  // Get student attendance status
  const getStudentAttendanceStatus = (studentId) => {
    const status = attendance[currentSession]?.[selectedDate]?.[studentId];
    return status || 'unmarked';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🌟</span>
            Award XP & Achievements
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-pulse">
            <p className="text-center font-semibold text-green-800">
              ✅ {successMessage}
            </p>
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Student Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Select Students ({selectedStudents.length} selected)</h3>
            <div className="flex gap-2">
              <button
                onClick={selectAllStudents}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Select All
              </button>
              <button
                onClick={selectPresentStudents}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Select Present
              </button>
              <button
                onClick={selectNoneStudents}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
            {enrolledStudents.map(student => {
              const isSelected = selectedStudents.includes(student.id);
              const attendanceStatus = getStudentAttendanceStatus(student.id);
              
              return (
                <label
                  key={student.id}
                  className={`flex items-center p-2 rounded border cursor-pointer transition-colors relative ${
                    isSelected
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
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
                    <span className={isSelected ? 'font-semibold' : ''}>
                      {student.name}
                    </span>
                  </span>
                  {/* Attendance indicator */}
                  <span className={`ml-2 text-xs ${
                    attendanceStatus === 'present' ? 'text-green-600' : 
                    attendanceStatus === 'late' ? 'text-yellow-600' :
                    attendanceStatus === 'absent' ? 'text-red-600' :
                    'text-gray-400'
                  }`}>
                    {attendanceStatus === 'present' ? '✓' : 
                     attendanceStatus === 'late' ? '⏰' :
                     attendanceStatus === 'absent' ? '✗' : '?'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Tabs for Daily vs Achievements */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'daily'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daily XP Awards
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'achievements'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Session Achievements
          </button>
        </div>

        {/* Awards Selection */}
        {activeTab === 'daily' ? (
          <div className="mb-6">
            {/* Base Awards */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Daily Awards</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(dailySessionXP.base).map(([awardId, award]) => (
                  <label
                    key={awardId}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDailyAwards[awardId] 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDailyAwards[awardId] || false}
                      onChange={() => toggleDailyAward(awardId)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{award.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{award.name}</div>
                        <div className="text-xs text-gray-600">{award.description}</div>
                        <div className="text-sm font-bold text-blue-600">+{award.xp} XP</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Session Type Specific Awards */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {sessionType === 'summer' && 'Summer Camp Awards'}
                {sessionType === 'school-go' && 'VEX GO Awards'}
                {sessionType === 'school-iq' && 'VEX IQ Awards'}
                {sessionType === 'competition' && 'Competition Team Awards'}
                {!['summer', 'school-go', 'school-iq', 'competition'].includes(sessionType) && 'Session Awards'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(dailySessionXP[sessionType] || {}).map(([awardId, award]) => (
                  <label
                    key={awardId}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDailyAwards[awardId] 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDailyAwards[awardId] || false}
                      onChange={() => toggleDailyAward(awardId)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{award.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{award.name}</div>
                        <div className="text-xs text-gray-600">{award.description}</div>
                        <div className="text-sm font-bold text-green-600">+{award.xp} XP</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Session Achievements</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAchievements.map(achievement => (
                <label
                  key={achievement.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAchievements.includes(achievement.id) 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAchievements.includes(achievement.id)}
                    onChange={() => toggleAchievement(achievement.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                      <div className="text-sm font-bold text-purple-600">+{achievement.xp} XP</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

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
              Per Student ({Math.floor(calculateTotalXP() * 0.3)} XP to Lifetime)
            </div>
            {selectedStudents.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Total: {calculateTotalXP() * selectedStudents.length} XP across {selectedStudents.length} students
              </div>
            )}
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
            disabled={selectedStudents.length === 0 || calculateTotalXP() === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Award to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedXPAwardModal;