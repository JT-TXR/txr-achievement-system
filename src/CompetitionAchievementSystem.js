// CompetitionAchievementSystem.js
// Handles both TXR in-class achievements and real-life VEX competition honors

// TXR In-Class Tournament Achievements (automatically awarded)
export const TXR_TOURNAMENT_ACHIEVEMENTS = {
    'txr-tournament-participant': {
      id: 'txr-tournament-participant',
      name: 'TXR Tournament Participant',
      icon: '🎯',
      description: 'Participated in a TXR in-class tournament',
      xp: 25,
      type: 'session',
      criteria: (tournamentResult) => {
        return tournamentResult.participated;
      }
    },
    
    'txr-teamwork-champion': {
      id: 'txr-teamwork-champion',
      name: 'TXR Teamwork Champion',
      icon: '🤝',
      description: 'Won 1st place in TXR Teamwork Challenge',
      xp: 50,
      type: 'session',
      criteria: (tournamentResult) => {
        return tournamentResult.placement === 1 && 
               tournamentResult.format === 'teamwork';
      }
    },
    
    'txr-skills-champion': {
      id: 'txr-skills-champion',
      name: 'TXR Skills Champion',
      icon: '🎮',
      description: 'Won 1st place in TXR Skills Challenge',
      xp: 50,
      type: 'session',
      criteria: (tournamentResult) => {
        return tournamentResult.placement === 1 && 
               (tournamentResult.format === 'driver' || tournamentResult.format === 'autonomous');
      }
    },
    
    'txr-podium-finish': {
      id: 'txr-podium-finish',
      name: 'TXR Podium Finish',
      icon: '🏅',
      description: 'Finished in top 3 of a TXR tournament',
      xp: 35,
      type: 'session',
      criteria: (tournamentResult) => {
        return tournamentResult.placement <= 3 && tournamentResult.placement > 1;
      }
    },
    
    'txr-perfect-score': {
      id: 'txr-perfect-score',
      name: 'TXR Perfect Score',
      icon: '💯',
      description: 'Achieved a perfect score in TXR tournament',
      xp: 40,
      type: 'session',
      criteria: (tournamentResult) => {
        // This would need game-specific logic
        return tournamentResult.score >= 100; // Example threshold
      }
    }
  };
  
  // Real-life VEX Competition Honors (manually awarded)
  export const COMPETITION_HONORS = {
    'tournament-competitor': {
      id: 'tournament-competitor',
      name: 'Tournament Competitor',
      icon: '🚩',
      description: 'Competed in an official VEX tournament',
      xp: 50,
      type: 'lifetime',
      category: 'competition'
    },
    
    'tournament-champion': {
      id: 'tournament-champion',
      name: 'Tournament Champion',
      icon: '🏆',
      description: 'Won Teamwork Champion award at VEX competition',
      xp: 350,
      type: 'lifetime',
      category: 'competition'
    },
    
    'robot-skills-champion': {
      id: 'robot-skills-champion',
      name: 'Robot Skills Champion',
      icon: '🎮',
      description: 'Won Robot Skills award at VEX competition',
      xp: 350,
      type: 'lifetime',
      category: 'competition'
    },
    
    'excellence-award': {
      id: 'excellence-award',
      name: 'Excellence Award',
      icon: '👑',
      description: 'Won Excellence Award at VEX competition',
      xp: 500,
      type: 'lifetime',
      category: 'competition'
    },
    
    'design-award': {
        id: 'design-award',
        name: 'Design Award',
        icon: '📐',
        description: 'Won Design Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'think-award': {
        id: 'think-award',
        name: 'Think Award',
        icon: '🧠',
        description: 'Won Think Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'innovate-award': {
        id: 'innovate-award',
        name: 'Innovate Award',
        icon: '💡',
        description: 'Won Innovate Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'build-award': {
        id: 'build-award',
        name: 'Build Award',
        icon: '🔨',
        description: 'Won Build Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'create-award': {
        id: 'create-award',
        name: 'Create Award',
        icon: '🎨',
        description: 'Won Create Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'amaze-award': {
        id: 'amaze-award',
        name: 'Amaze Award',
        icon: '✨',
        description: 'Won Amaze Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'inspire-award': {
        id: 'inspire-award',
        name: 'Inspire Award',
        icon: '🌟',
        description: 'Won Inspire Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'sportsmanship-award': {
        id: 'sportsmanship-award',
        name: 'Sportsmanship Award',
        icon: '🤝',
        description: 'Won Sportsmanship Award at VEX competition',
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
      
      'judges-award': {
        id: 'judges-award',
        name: "Judges' Award",
        icon: '⭐',
        description: "Won Judges' Award at VEX competition",
        xp: 200,
        type: 'lifetime',
        category: 'competition'
      },
    
    'double-crown': {
      id: 'double-crown',
      name: 'Double Crown',
      icon: '🏵️',
      description: 'Won 2 major awards at same VEX tournament',
      xp: 750,
      type: 'lifetime',
      category: 'competition'
    },
    
    'triple-crown': {
      id: 'triple-crown',
      name: 'Triple Crown',
      icon: '💎',
      description: 'Won Excellence, Tournament & Skills at same VEX tournament',
      xp: 1000,
      type: 'lifetime',
      category: 'competition'
    }
  };
  
  // Process TXR tournament results and determine which achievements to award
  export const processTXRTournamentAchievements = (tournament, studentId, teams, students) => {
    const achievements = [];
    
    // Find student's team
    const studentTeams = teams.filter(team => 
      team.studentIds.includes(studentId) && 
      tournament.teams.includes(team.id)
    );
    
    if (studentTeams.length === 0) return achievements;
    
    // Get student's results
    const studentTeam = studentTeams[0];
    const finalRanking = tournament.results.finalRankings.find(r => 
      r.teamId === studentTeam.id
    );
    
    if (!finalRanking) return achievements;
    
    // Build tournament result object
    const tournamentResult = {
      participated: true,
      placement: finalRanking.rank,
      format: tournament.format,
      score: finalRanking.score,
      teamId: studentTeam.id
    };
    
    // Check each TXR achievement
    Object.values(TXR_TOURNAMENT_ACHIEVEMENTS).forEach(achievement => {
      if (achievement.criteria(tournamentResult)) {
        achievements.push(achievement);
      }
    });
    
    return achievements;
  };
  
  // Annual awards that can be manually triggered
  export const ANNUAL_AWARDS = {
    'student-of-year': {
      id: 'student-of-year',
      name: 'Robotics Student of the Year',
      icon: '🏅',
      description: 'Most dedicated, consistent and achieving',
      xp: 500,
      type: 'lifetime'
    },
    
    'leadership-excellence': {
      id: 'leadership-excellence',
      name: 'Leadership Excellence',
      icon: '🌟',
      description: 'Outstanding mentoring and guidance',
      xp: 300,
      type: 'lifetime'
    },
    
    'competitive-spirit': {
      id: 'competitive-spirit',
      name: 'Competitive Spirit',
      icon: '💪',
      description: 'Best sportsmanship and attitude',
      xp: 200,
      type: 'lifetime'
    },
    
    'program-ambassador': {
      id: 'program-ambassador',
      name: 'Program Ambassador',
      icon: '🗣️',
      description: 'Best representation of values',
      xp: 250,
      type: 'lifetime'
    }
  };
  
  // Multi-year recognition awards (automatic based on years)
  export const MULTI_YEAR_AWARDS = {
    'returner-award': {
      id: 'returner-award',
      name: 'Returner Award',
      icon: '🔁',
      description: 'Participate in 2+ consecutive years',
      xp: 100,
      type: 'lifetime',
      yearsRequired: 2
    },
    
    'loyalty-award': {
      id: 'loyalty-award',
      name: 'Loyalty Award',
      icon: '💎',
      description: 'Participate in 3+ consecutive years',
      xp: 200,
      type: 'lifetime',
      yearsRequired: 3
    },
    
    'dedication-medal': {
      id: 'dedication-medal',
      name: 'Dedication Medal',
      icon: '🎖️',
      description: 'Participate in 4+ consecutive years',
      xp: 300,
      type: 'lifetime',
      yearsRequired: 4
    },
    
    'legacy-honor': {
      id: 'legacy-honor',
      name: 'Legacy Honor',
      icon: '🏛️',
      description: 'Participate in 5+ consecutive years',
      xp: 500,
      type: 'lifetime',
      yearsRequired: 5
    }
  };
  
  // Check multi-year awards for a student
  export const checkMultiYearAwards = (student, currentDate = new Date()) => {
    const awards = [];
    
    if (!student.joinDate) return awards;
    
    const joinDate = new Date(student.joinDate);
    const yearsInProgram = Math.floor((currentDate - joinDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    Object.values(MULTI_YEAR_AWARDS).forEach(award => {
      if (yearsInProgram >= award.yearsRequired) {
        awards.push(award);
      }
    });
    
    return awards;
  };