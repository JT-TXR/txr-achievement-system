import React from 'react';
import { Trophy, Star, Crown, Sparkles, Medal, Gem } from 'lucide-react';

const LevelRoadmap = ({ currentXP = 0, studentName = null, onClose, animateView = false }) => {
  const levels = [
    { level: 1, name: "VEX Rookie", minXP: 0, color: "bg-gray-500", textColor: "text-gray-600", icon: "🎯" },
    { level: 2, name: "VEX Explorer", minXP: 150, color: "bg-lime-400", textColor: "text-lime-600", icon: "🗺️" },
    { level: 3, name: "VEX Builder", minXP: 400, color: "bg-green-500", textColor: "text-green-600", icon: "🔨" },
    { level: 4, name: "VEX Programmer", minXP: 800, color: "bg-blue-500", textColor: "text-blue-600", icon: "💻" },
    { level: 5, name: "VEX Innovator", minXP: 1300, color: "bg-purple-500", textColor: "text-purple-600", icon: "💡" },
    { level: 6, name: "VEX Specialist", minXP: 2000, color: "bg-orange-500", textColor: "text-orange-600", icon: "⚡" },
    { level: 7, name: "VEX Expert", minXP: 2800, color: "bg-orange-700", textColor: "text-orange-700", icon: "🎓" },
    { level: 8, name: "VEX Engineer", minXP: 3800, color: "bg-red-500", textColor: "text-red-600", icon: "⚙️" },
    { level: 9, name: "VEX Architect", minXP: 5000, color: "bg-red-700", textColor: "text-red-700", icon: "📐" },
    { level: 10, name: "VEX Master", minXP: 6500, color: "bg-pink-500", textColor: "text-pink-600", icon: "🌟" },
    { level: 11, name: "TXR Champion", minXP: 8200, color: "bg-gray-300", textColor: "text-gray-700", special: "silver", icon: "🥈" },
    { level: 12, name: "TXR Virtuoso", minXP: 10000, color: "bg-yellow-400", textColor: "text-yellow-600", special: "gold", icon: "🥇" },
    { level: 13, name: "TXR Legend", minXP: 12000, color: "bg-gray-200", textColor: "text-gray-800", special: "platinum", icon: "💎" },
    { level: 14, name: "TXR Hall-of-Famer", minXP: 14000, color: "bg-blue-100", textColor: "text-blue-900", special: "diamond", icon: "🏅" },
    { level: 15, name: "TXR Immortal", minXP: 15000, color: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500", textColor: "text-gray-900", special: "rainbow", icon: "👑" }
  ];

  const getCurrentLevel = (xp) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minXP) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const currentLevel = getCurrentLevel(currentXP);
  const [animationStep, setAnimationStep] = React.useState(0);

  // Auto-animate through levels when opened from navigation
  React.useEffect(() => {
    if (animateView && animationStep < levels.length) {
      const timer = setTimeout(() => {
        setAnimationStep(animationStep + 1);
      }, 300); // 300ms between each level highlight
      return () => clearTimeout(timer);
    }
  }, [animateView, animationStep]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-orange-500 to-yellow-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Level Progression Roadmap
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-white mt-2 opacity-90">
            {studentName ? (
              <>
                <span className="font-bold">{studentName}</span> • Current XP: <span className="font-bold">{currentXP}</span> • Level: <span className="font-bold">{currentLevel.name}</span>
              </>
            ) : animateView ? (
              "Viewing All Levels"
            ) : (
              <>Current XP: <span className="font-bold">{currentXP}</span> • Level: <span className="font-bold">{currentLevel.name}</span></>
            )}
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4">
            {levels.map((level, index) => {
              const isAchieved = !animateView && currentXP >= level.minXP;
              const isCurrent = !animateView && currentLevel.level === level.level;
              const isNext = !animateView && index > 0 && currentXP >= levels[index - 1].minXP && currentXP < level.minXP;
              const isAnimated = animateView && index < animationStep;
              
              // Calculate progress for the current level
              let progress = 0;
              if (isCurrent && index < levels.length - 1) {
                const nextLevel = levels[index + 1];
                progress = ((currentXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100;
              } else if (isAchieved) {
                progress = 100;
              }

              return (
                <div
                  key={level.level}
                  className={`relative rounded-lg p-4 transition-all duration-500 ${
                    isAchieved || isAnimated ? 'bg-gray-50' : 'bg-gray-100'
                  } ${isCurrent ? 'ring-4 ring-orange-400 ring-opacity-50 scale-105' : ''} ${
                    isNext ? 'ring-2 ring-orange-300 ring-opacity-30' : ''
                  } ${isAnimated ? 'ring-4 ring-purple-400 ring-opacity-50 scale-105' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Level Icon/Number */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                        level.special === 'rainbow'
                          ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white'
                          : level.special === 'diamond'
                          ? 'bg-blue-100 text-blue-900 ring-4 ring-blue-300'
                          : level.special === 'platinum'
                          ? 'bg-gray-200 text-gray-800 ring-4 ring-gray-400'
                          : level.special === 'gold'
                          ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-500'
                          : level.special === 'silver'
                          ? 'bg-gray-300 text-gray-700 ring-4 ring-gray-400'
                          : `${level.color} ${
                              isAchieved || isAnimated ? 'text-white' : 'text-gray-400 opacity-50'
                            }`
                      }`}
                    >
                      {level.icon}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg ${isAchieved || isAnimated ? level.textColor : 'text-gray-400'}`}>
                          Level {level.level}: {level.name}
                        </h3>
                        {level.level >= 14 && <Sparkles className="w-5 h-5 text-yellow-500" />}
                        {isCurrent && (
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                            CURRENT
                          </span>
                        )}
                        {isNext && (
                          <span className="px-2 py-1 bg-orange-300 text-white text-xs font-bold rounded-full">
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isAchieved || isAnimated ? 'text-gray-600' : 'text-gray-400'}`}>
                        Required XP: <span className="font-semibold">{level.minXP.toLocaleString()}</span>
                        {isNext && (
                          <span className="ml-2 text-orange-600 font-semibold">
                            ({level.minXP - currentXP} XP to go!)
                          </span>
                        )}
                      </p>
                      
                      {/* Progress Bar for Current Level */}
                      {isCurrent && index < levels.length - 1 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Progress to next level: {Math.round(progress)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Achievement Status */}
                    {(isAchieved || isAnimated) && (
                      <div className={`transition-all duration-500 ${isAnimated ? 'text-purple-500' : 'text-green-500'}`}>
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Special Level Descriptions */}
                  {level.level >= 11 && (
                    <div className={`mt-3 text-sm ${isAchieved || isAnimated ? 'text-gray-600' : 'text-gray-400'} italic`}>
                      {level.level === 11 && "Achieve Champion status by demonstrating excellence across multiple sessions"}
                      {level.level === 12 && "Master all aspects of robotics to become a true Virtuoso"}
                      {level.level === 13 && "Join the ranks of TXR Legends through exceptional dedication"}
                      {level.level === 14 && "Enter the Hall of Fame as one of TXR's most accomplished students"}
                      {level.level === 15 && "Achieve Immortal status - the highest honor in TXR Robotics!"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Motivational Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
            <h3 className="text-lg font-bold text-orange-700 mb-2">Keep Going!</h3>
            <p className="text-gray-700">
              Every XP point brings you closer to the ultimate goal. Remember:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li>• Daily tasks earn Session XP (contributes 30% to Lifetime XP)</li>
              <li>• Complete milestones for bonus Lifetime XP</li>
              <li>• Participate in tournaments for major XP boosts</li>
              <li>• Help others and show leadership to accelerate your progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelRoadmap;