// MilestoneTrackingSystem.js
// This module handles all milestone and achievement tracking logic

export const SESSION_MILESTONES = {
    'perfect-attendance': {
      id: 'perfect-attendance',
      name: 'Perfect Attendance',
      icon: '📅',
      requirement: 'Attend all session days',
      requirementFunction: (tracking, sessionInfo) => {
        const totalDays = sessionInfo.classDates?.length || 0;
        const attendedDays = tracking.attendance?.present || 0;
        const earned = totalDays > 0 && attendedDays === totalDays
        return {
          earned,
          progress: earned ? totalDays : AttendedDays,
          total: totalDays,
          percentage: totalDays > 0 ? (attendedDays / totalDays) * 100 : 0
        };
      },
      lifetimeXP: 25
    },
    
    'early-bird': {
      id: 'early-bird',
      name: 'Early Bird',
      icon: '🐦',
      requirement: 'Arrive early 5+ times',
      requirementFunction: (tracking) => {
        const earlyCount = tracking.totals?.['early-bird']?.count || 0;

        const earned = earlyCount >= 5;

        return {
          earned,
          progress: earned ? 5 : earlyCount,
          total: 5,
          percentage: earned ? 100 : Math.min(100, (earlyCount / 5) * 100)
        };
      },
      lifetimeXP: 25
    },
    
    'cleanup-champion': {
      id: 'cleanup-champion',
      name: 'Clean-Up Champion',
      icon: '🧹',
      requirement: 'Clean workspace 3+ times',
      requirementFunction: (tracking) => {
        const cleanCount = tracking.totals?.['clean-workspace']?.count || 0;
        const earned = cleanCount >= 3;
        return {
          earned,
          progress: earned ? 3 : cleanCount,
          total: 3,
          percentage: earned ? 3 : Math.min(100, (cleanCount / 3) * 100)
        };
      },
      lifetimeXP: 25
    },
    
    'documentation-expert': {
      id: 'documentation-expert',
      name: 'Documentation Expert',
      icon: '📓',
      requirement: 'Engineering notebook 3+ times',
      requirementFunction: (tracking) => {
        const notebookCount = tracking.totals?.['engineering-notebook']?.count || 0;
        const earned = notebookCount >= 3;
        return {
          earned,
          progress: earned ? 3 : notebookCount,
          total: 3,
          percentage: earned ? 3 : Math.min(100, (notebookCount / 3) * 100)
        };
      },
      lifetimeXP: 25
    },
    
    'session-complete': {
      id: 'session-complete',
      name: 'Session Complete',
      icon: '✅',
      requirement: 'Complete the session',
      requirementFunction: (tracking, sessionInfo) => {
        // This is manually triggered when session ends
        return {
          earned: tracking.sessionCompleted || false,
          progress: tracking.sessionCompleted ? 1 : 0,
          total: 1,
          percentage: tracking.sessionCompleted ? 100 : 0
        };
      },
      lifetimeXP: 40
    },
    
    'ultimate-collaborator': {
      id: 'ultimate-collaborator',
      name: 'Ultimate Collaborator',
      icon: '🤝',
      requirement: 'Help teammates 5+ times',
      requirementFunction: (tracking) => {
        const helperCount = tracking.totals?.['class-helper']?.count || 0;
        const collabCount = tracking.totals?.['team-collaboration']?.count || 0;
        const totalHelp = helperCount + collabCount;
        const earned = totalHelp >= 5;
        return {
          earned,
          progress: earned ? 5 : totalHelp,
          total: 5,
          percentage: earned ? 5 : Math.min(100, (totalHelp / 5) * 100)
        };
      },
      lifetimeXP: 50
    }
  };
  
  export const LIFETIME_ACHIEVEMENTS = {
    'first-robot': {
      id: 'first-robot',
      name: 'First Robot',
      icon: '🤖',
      description: 'Build your very first robot',
      requirement: 'Earn Robot Build award once',
      requirementFunction: (allSessionsTracking) => {
        let totalRobotBuilds = 0;
        Object.values(allSessionsTracking).forEach(session => {
          totalRobotBuilds += session.totals?.['robot-build']?.count || 0;
        });

        const earned = totalRobotBuilds >= 1;

        return {
          earned,
          progress: earned ? 1 : totalRobotBuilds,
          total: 1,
          percentage: earned ? 100 : Math.min(100, totalRobotBuilds * 100)
        };
      },
      xp: 50
    },
    
    'first-program': {
      id: 'first-program',
      name: 'First Program',
      icon: '💻',
      description: 'Write your first program',
      requirement: 'Earn Coding award once',
      requirementFunction: (allSessionsTracking) => {
        let totalCoding = 0;
        Object.values(allSessionsTracking).forEach(session => {
          totalCoding += session.totals?.['coding']?.count || 0;
        });

        const earned = totalCoding >= 1;

        return {
          earned,
          progress: earned ? 1 : totalCoding,
          total: 1,
          percentage: earned ? 100 : Math.min(100, totalCoding * 100)
        };
      },
      xp: 50
    },
    
    'first-notebook': {
      id: 'first-notebook',
      name: 'First Engineering Notebook',
      icon: '📓',
      description: 'Complete your first notebook entry',
      requirement: 'Earn Engineering Notebook award once',
      requirementFunction: (allSessionsTracking) => {
        let totalNotebook = 0;
        Object.values(allSessionsTracking).forEach(session => {
          totalNotebook += session.totals?.['engineering-notebook']?.count || 0;
        });

        const earned = totalNotebook >= 1;

        return {
          earned,
          progress: earned ? 1 : totalNotebook,
          total: 1,
          percentage: earned ? 100 : Math.min(100, totalNotebook * 100)
        };
      },
      xp: 50
    },
    
    'txr-achiever': {
      id: 'txr-achiever',
      name: 'TXR Achiever',
      icon: '🌟',
      description: 'Complete 4 sessions',
      requirement: 'Complete 4 sessions/camps',
      requirementFunction: (allSessionsTracking, studentData, milestoneHistory) => {
        let completedSessions = 0;
        Object.entries(milestoneHistory || {}).forEach(([sessionId, milestones]) => {
          if (milestones.includes('session-complete')) {
            completedSessions++;
          }
        });

        const earned = completedSessions >= 4;

        return {
          earned,
          progress: earned ? 4 : completedSessions,
          total: 4,
          percentage: earned ? 100 : Math.min(100, (completedSessions / 4) * 100)
        };
      },
      xp: 100
    },
    
    'txr-veteran': {
      id: 'txr-veteran',
      name: 'TXR Veteran',
      icon: '⭐',
      description: 'Complete 10 sessions',
      requirement: 'Complete 10 sessions/camps',
      requirementFunction: (allSessionsTracking, studentData, milestoneHistory) => {
        let completedSessions = 0;
        Object.entries(milestoneHistory || {}).forEach(([sessionId, milestones]) => {
          if (milestones.includes('session-complete')) {
            completedSessions++;
          }
        });

        const earned = completedSessions >= 10;

        return {
          earned,
          progress: earned ? 10 : completedSessions,
          total: 10,
          percentage: earned ? 100 : Math.min(100, (completedSessions / 10) * 100)
        };
      },
      xp: 200
    },
    
    'attendance-champion': {
      id: 'attendance-champion',
      name: 'Attendance Champion',
      icon: '🏅',
      description: 'Perfect attendance master',
      requirement: '5+ sessions with perfect attendance',
      requirementFunction: (allSessionsTracking, studentData, milestoneHistory) => {
        let perfectSessions = 0;
        Object.entries(milestoneHistory || {}).forEach(([sessionId, milestones]) => {
          if (milestones.includes('perfect-attendance')) {
            perfectSessions++;
          }
        });

        const earned = perfectSessions >= 5;

        return {
          earned,
          progress: earned ? 5 : perfectSessions,
          total: 5,
          percentage: earned ? 100 : Math.min(100, (perfectSessions / 5) * 100)
        };
      },
      xp: 150
    }
  };
  
  // Check all milestones for a student
  export const checkAllMilestones = (
    studentId, 
    currentSession, 
    dailyXPTracking, 
    students, 
    sessions,
    attendance,
    studentMilestones
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { sessionMilestones: [], lifetimeAchievements: [] };
  
    const tracking = dailyXPTracking[studentId]?.[currentSession] || {};
    const sessionInfo = sessions.find(s => s.name === currentSession);
    
    // Add attendance data to tracking
    if (attendance[currentSession] && sessionInfo?.classDates) {
      const attendanceData = { present: 0, absent: 0, late: 0, total: sessionInfo.classDates.length };
      
      sessionInfo.classDates.forEach(date => {
        const status = attendance[currentSession][date]?.[studentId];
        if (status === 'present') attendanceData.present++;
        else if (status === 'late') {
          attendanceData.present++; // Late counts as present for milestones
          attendanceData.late++;
        }
        else if (status === 'absent') attendanceData.absent++;
      });
      
      tracking.attendance = attendanceData;
    }
  
    const earnedMilestones = [];
    const earnedLifetimeAchievements = [];
  
    // Check session milestones
    Object.values(SESSION_MILESTONES).forEach(milestone => {
      const result = milestone.requirementFunction(tracking, sessionInfo);
      
      if (result.earned) {
        const alreadyEarned = studentMilestones[studentId]?.[currentSession]?.includes(milestone.id);
        if (!alreadyEarned) {
          earnedMilestones.push({
            ...milestone,
            result
          });
        }
      }
    });
  
    // Check lifetime achievements
    const allSessionsTracking = dailyXPTracking[studentId] || {};
    
    Object.values(LIFETIME_ACHIEVEMENTS).forEach(achievement => {
      const result = achievement.requirementFunction(
        allSessionsTracking, 
        student, 
        studentMilestones[studentId]
      );
      
      if (result.earned) {
        const alreadyEarned = student.achievements?.includes(achievement.id);
        if (!alreadyEarned) {
          earnedLifetimeAchievements.push({
            ...achievement,
            result
          });
        }
      }
    });
  
    return {
      sessionMilestones: earnedMilestones,
      lifetimeAchievements: earnedLifetimeAchievements
    };
  };
  
  // Get progress for all milestones (for display)
  export const getMilestoneProgress = (
    studentId, 
    currentSession, 
    dailyXPTracking, 
    students, 
    sessions,
    attendance,
    studentMilestones,
    achievements
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { sessionProgress: {}, lifetimeProgress: {} };
  
    const tracking = dailyXPTracking[studentId]?.[currentSession] || {};
    const sessionInfo = sessions.find(s => s.name === currentSession);
    
    // Add attendance data to tracking
    if (attendance[currentSession] && sessionInfo?.classDates) {
      const attendanceData = { present: 0, absent: 0, late: 0, total: sessionInfo.classDates.length };
      
      sessionInfo.classDates.forEach(date => {
        const status = attendance[currentSession][date]?.[studentId];
        if (status === 'present') attendanceData.present++;
        else if (status === 'late') {
          attendanceData.present++; // Late counts as present for milestones
          attendanceData.late++;
        }
        else if (status === 'absent') attendanceData.absent++;
      });
      
      tracking.attendance = attendanceData;
    }
  
    const sessionProgress = {};
    const lifetimeProgress = {};
  
    // Get session milestone progress
    Object.entries(SESSION_MILESTONES).forEach(([id, milestone]) => {
      const result = milestone.requirementFunction(tracking, sessionInfo);
      const alreadyEarned = studentMilestones[studentId]?.[currentSession]?.includes(id);
      
      sessionProgress[id] = {
        ...milestone,
        ...result,
        alreadyEarned
      };
    });
  
    // Get lifetime achievement progress
    const allSessionsTracking = dailyXPTracking[studentId] || {};
    
    Object.entries(LIFETIME_ACHIEVEMENTS).forEach(([id, achievement]) => {
        const result = achievement.requirementFunction(
          allSessionsTracking, 
          student, 
          studentMilestones[studentId]
        );
        
        // Check if student has any achievement with this name
        const alreadyEarned = student.achievements?.some(achievementId => {
          const ach = achievements.find(a => a.id === achievementId);
          return ach && ach.name === achievement.name && ach.type === 'lifetime';
        }) || false;
        
        lifetimeProgress[id] = {
          ...achievement,
          ...result,
          alreadyEarned
        };
      });
  
    return {
      sessionProgress,
      lifetimeProgress
    };
  };