import React, { useState, useEffect } from 'react';

const MilestoneProgressDisplay = ({ 
  sessionProgress, 
  lifetimeProgress,
  onAwardMilestone,
  onAwardAchievement,
  studentName
}) => {
  // Local state to track which milestones have been awarded this session
  const [awardedInSession, setAwardedInSession] = useState({
    session: [],
    lifetime: []
  });

  // Reset when progress changes (e.g., when switching students)
  useEffect(() => {
    setAwardedInSession({ session: [], lifetime: [] });
  }, [studentName]);

  const ProgressBar = ({ percentage, earned, alreadyEarned }) => {
    const bgColor = alreadyEarned ? 'bg-green-500' : 
                   earned ? 'bg-yellow-500' : 
                   'bg-blue-500';
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-500 relative`}
          style={{ width: `${percentage}%` }}
        >
          {percentage >= 100 && !alreadyEarned && (
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
          )}
        </div>
      </div>
    );
  };

  const MilestoneCard = ({ milestone, isLifetime = false }) => {
    const { name, icon, requirement, progress, total, percentage, earned, alreadyEarned } = milestone;
    const xpValue = isLifetime ? milestone.xp : milestone.lifetimeXP;
    
    const handleClick = () => {
      if (earned && !alreadyEarned && 
          !(isLifetime ? awardedInSession.lifetime : awardedInSession.session).includes(milestone.id)) {
        if (isLifetime) {
          onAwardAchievement(milestone);
          setAwardedInSession(prev => ({
            ...prev,
            lifetime: [...prev.lifetime, milestone.id]
          }));
        } else {
          onAwardMilestone(milestone);
          setAwardedInSession(prev => ({
            ...prev,
            session: [...prev.session, milestone.id]
          }));
        }
      }
    };
    
    // Check if this was just awarded in this session
    const justAwarded = (isLifetime ? awardedInSession.lifetime : awardedInSession.session).includes(milestone.id);
    const effectivelyEarned = alreadyEarned || justAwarded;
    
    return (
      <div 
        className={`p-4 rounded-lg border-2 transition-all ${
          effectivelyEarned ? 'bg-green-50 border-green-300' :
          earned ? 'bg-yellow-50 border-yellow-300 animate-pulse cursor-pointer hover:shadow-lg' :
          'bg-white border-gray-200'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-xs text-gray-600">{requirement}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-bold ${
              effectivelyEarned ? 'text-green-600' :
              earned ? 'text-yellow-600' :
              'text-blue-600'
            }`}>
              {xpValue} XP
            </div>
            {effectivelyEarned && (
              <div className="text-xs text-green-600">✓ Earned</div>
            )}
            {earned && !effectivelyEarned && (
              <div className="text-xs text-yellow-600 animate-pulse">Click to Award!</div>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{progress} / {total}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <ProgressBar 
            percentage={percentage} 
            earned={earned} 
            alreadyEarned={alreadyEarned} 
          />
        </div>
      </div>
    );
  };

  // Separate milestones by status
  const categorizeProgress = (progressObj, isLifetime = false) => {
    const ready = [];
    const inProgress = [];
    const completed = [];
    
    const awardedList = isLifetime ? awardedInSession.lifetime : awardedInSession.session;
    
    Object.values(progressObj).forEach(milestone => {
      if (milestone.alreadyEarned || awardedList.includes(milestone.id)) {
        completed.push(milestone);
      } else if (milestone.earned) {
        ready.push(milestone);
      } else {
        inProgress.push(milestone);
      }
    });
    
    return { ready, inProgress, completed };
  };

  const sessionCategories = categorizeProgress(sessionProgress, false);
  const lifetimeCategories = categorizeProgress(lifetimeProgress, true);

  return (
    <div className="space-y-6">
      {/* Session Milestones */}
      <div>
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          🎯 Session Milestones
          {sessionCategories.ready.length > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full animate-pulse">
              {sessionCategories.ready.length} ready to claim!
            </span>
          )}
        </h3>
        
        {/* Ready to claim */}
        {sessionCategories.ready.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-yellow-700 mb-2">Ready to Award!</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionCategories.ready.map(milestone => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        )}
        
        {/* In Progress */}
        {sessionCategories.inProgress.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">In Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionCategories.inProgress.map(milestone => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        )}
        
        {/* Completed */}
        {sessionCategories.completed.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-green-600 mb-2">Earned Awards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionCategories.completed.map(milestone => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lifetime Achievements */}
      <div>
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          🏆 Lifetime Achievements Progress
          {lifetimeCategories.ready.length > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full animate-pulse">
              {lifetimeCategories.ready.length} ready to claim!
            </span>
          )}
        </h3>
        
        {/* Ready to claim */}
        {lifetimeCategories.ready.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-yellow-700 mb-2">Ready to Award!</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lifetimeCategories.ready.map(achievement => (
                <MilestoneCard key={achievement.id} milestone={achievement} isLifetime={true} />
              ))}
            </div>
          </div>
        )}
        
        {/* In Progress */}
        {lifetimeCategories.inProgress.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">In Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lifetimeCategories.inProgress.map(achievement => (
                <MilestoneCard key={achievement.id} milestone={achievement} isLifetime={true} />
              ))}
            </div>
          </div>
        )}
        
        {/* Completed */}
        {lifetimeCategories.completed.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-green-600 mb-2">Earned Awards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lifetimeCategories.completed.map(achievement => (
                <MilestoneCard key={achievement.id} milestone={achievement} isLifetime={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneProgressDisplay;