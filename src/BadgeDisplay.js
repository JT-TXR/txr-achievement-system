import React from "react";

const BadgeDisplay = ({
  badge,
  size = "normal",
  showName = true,
  earned = false,
  progress = null,
}) => {
  // Size configurations
  const sizeClasses = {
    small: {
      container: "w-16 h-16",
      icon: "text-2xl",
      ring: "ring-2",
      text: "text-xs",
    },
    normal: {
      container: "w-20 h-20",
      icon: "text-3xl",
      ring: "ring-4",
      text: "text-sm",
    },
    large: {
      container: "w-24 h-24",
      icon: "text-4xl",
      ring: "ring-4",
      text: "text-base",
    },
  };

  const config = sizeClasses[size];

  // Badge type colors
  const getBadgeColors = (type) => {
    switch (type) {
      case "daily":
        return {
          bg: earned ? "bg-blue-100" : "bg-gray-100",
          ring: earned ? "ring-blue-400" : "ring-gray-300",
          text: earned ? "text-blue-800" : "text-gray-400",
        };
      case "session":
        return {
          bg: earned ? "bg-green-100" : "bg-gray-100",
          ring: earned ? "ring-green-400" : "ring-gray-300",
          text: earned ? "text-green-800" : "text-gray-400",
        };
      case "lifetime":
        return {
          bg: earned ? "bg-purple-100" : "bg-gray-100",
          ring: earned ? "ring-purple-400" : "ring-gray-300",
          text: earned ? "text-purple-800" : "text-gray-400",
        };
      case "competition":
        return {
          bg: earned ? "bg-yellow-100" : "bg-gray-100",
          ring: earned ? "ring-yellow-400" : "ring-gray-300",
          text: earned ? "text-yellow-800" : "text-gray-400",
        };
      case "annual":
        return {
          bg: earned ? "bg-red-100" : "bg-gray-100",
          ring: earned ? "ring-red-400" : "ring-gray-300",
          text: earned ? "text-red-800" : "text-gray-400",
        };
      default:
        return {
          bg: earned ? "bg-gray-200" : "bg-gray-100",
          ring: earned ? "ring-gray-400" : "ring-gray-300",
          text: earned ? "text-gray-800" : "text-gray-400",
        };
    }
  };

  const colors = getBadgeColors(badge.type);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Badge Circle */}
        <div
          className={`
            ${config.container} 
            ${colors.bg} 
            ${config.ring} 
            ${colors.ring}
            rounded-full flex items-center justify-center
            transition-all duration-300
            ${
              earned
                ? "shadow-lg transform scale-100"
                : "opacity-75 transform scale-95"
            }
            ${earned && progress === null ? "animate-pulse" : ""}
          `}
        >
          <span
            className={`${config.icon} ${earned ? "" : "grayscale opacity-50"}`}
          >
            {badge.icon}
          </span>
        </div>

        {/* Progress Ring (for partial progress) */}
        {progress !== null && progress < 100 && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-300"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={colors.text}
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Completion Checkmark */}
        {earned && progress === 100 && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        )}

        {/* Lock Icon for Unearned */}
        {!earned && progress === 0 && (
          <div className="absolute -bottom-1 -right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
        )}
      </div>

      {/* Badge Name */}
      {showName && (
        <div className="text-center">
          <p className={`${config.text} font-medium ${colors.text}`}>
            {badge.name}
          </p>
          {badge.xp && (
            <p
              className={`text-xs ${
                earned ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {badge.xp} XP
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Badge Gallery Component
export const BadgeGallery = ({ badges, studentBadges = [], title, type }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        {type === "daily" && "⚡"}
        {type === "session" && "🎯"}
        {type === "lifetime" && "🏆"}
        {type === "competition" && "🏁"}
        {type === "annual" && "🌟"}
        {title}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {badges.map((badge) => {
          const isEarned = studentBadges.includes(badge.id);
          const progress = badge.progress || (isEarned ? 100 : 0);

          return (
            <BadgeDisplay
              key={badge.id}
              badge={badge}
              size="normal"
              earned={isEarned}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;
