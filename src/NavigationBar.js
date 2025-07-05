// src/NavigationBar.js
import React, { useState } from "react";

const NavigationBar = ({
  // View state
  currentView,
  setCurrentView,
  currentSession,
  setCurrentSession,
  sessions,
  activeTournament,
  tournaments,
  userRole = "teacher",

  // Session Tasks handlers
  setShowUnifiedXPAward,
  setShowAttendanceManager,
  setShowTeamManager,
  setShowMatchEntry,
  setShowSkillsEntry,
  setSkillsType,

  // Tournament handlers
  setShowTournamentWizard,
  setShowTournamentDashboard,
  setActiveTournament,

  // Reports handlers
  setShowTournamentHistory,
  setShowAttendanceReport,
  exportData,

  // Admin handlers
  setShowSessionManager,
  setShowStudentManager,
  setShowAchievementManager,
  setShowCompetitionHonors,
setShowAnnualAwards,
  setShowSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for active tournament in current session
  const hasActiveTournament = tournaments?.some(
    (t) => t.sessionId === currentSession && t.status !== "complete"
  );

  // Navigation structure with practice buttons included
  const navGroups = [
    {
      id: "session-tasks",
      label: "Session Tasks",
      icon: "📝",
      color: "green",
      items: [
        {
          icon: "📅",
          label: "Take Attendance",
          action: () => {
            setShowAttendanceManager(true);
          },
        },
        { 
          icon: '🌟', 
          label: 'Award XP', 
          action: () => {
            setShowUnifiedXPAward(true);
          },
          description: 'Award daily XP and achievements'
        },
        {
          icon: "👥",
          label: "Manage Teams",
          action: () => {
            setShowTeamManager(true);
          },
        },
        { divider: true },
        {
          icon: "🤝",
          label: "Practice Match",
          action: () => {
            setShowMatchEntry(true);
          },
          description: "Quick 2v0 match outside tournament",
        },
        {
          icon: "🎮",
          label: "Practice Driver Skills",
          action: () => {
            setSkillsType("driver");
            setShowSkillsEntry(true);
          },
        },
        {
          icon: "🤖",
          label: "Practice Autonomous Skills",
          action: () => {
            setSkillsType("autonomous");
            setShowSkillsEntry(true);
          },
        },
      ],
    },
    {
      id: "tournaments",
      label: "Tournaments",
      icon: "🏆",
      color: "orange",
      badge: hasActiveTournament ? "ACTIVE" : null,
      items: [
        {
          icon: "➕",
          label: "New Tournament",
          action: () => {
            setShowTournamentWizard(true);
          },
        },
        { divider: true },
        {
          icon: "📊",
          label: "Current Tournament",
          action: () => {
            const tournament = tournaments?.find(
              (t) => t.sessionId === currentSession && t.status !== "complete"
            );
            if (tournament) {
              setActiveTournament(tournament);
              setShowTournamentDashboard(true);
            }
          },
          disabled: !hasActiveTournament,
          description: hasActiveTournament
            ? "View active tournament"
            : "No active tournament",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📈",
      color: "blue",
      items: [
        {
          icon: "🏆",
          label: "Tournament History",
          action: () => {
            setShowTournamentHistory(true);
          },
        },
        {
          icon: "📅",
          label: "Attendance Reports",
          action: () => {
            setShowAttendanceReport(true);
          },
        },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      icon: "⚙️",
      color: "gray",
      requiresRole: "admin",
      items: [
        {
          icon: "📚",
          label: "Manage Sessions",
          action: () => {
            setShowSessionManager(true);
          },
        },
        {
          icon: "👤",
          label: "Manage Students",
          action: () => {
            setShowStudentManager(true);
          },
        },
        {
          icon: "🏅",
          label: "Manage Achievements",
          action: () => {
            setShowAchievementManager(true);
          },
        },
        {
          icon: '🏆',
          label: 'Competition Honors',
          action: () => {
            setShowCompetitionHonors(true);
          },
          description: 'Award real VEX competition honors'
        },
        {
          icon: '⭐',
          label: 'Annual Awards',
          action: () => {
            setShowAnnualAwards(true);
          },
          description: 'Grant special annual awards'
        },
        { divider: true },
        {
          icon: "⚙️",
          label: "System Settings",
          action: () => {
            setShowSettings(true);
          },
        },
      ],
    },
  ];

  const colorClasses = {
    green: "bg-green-500 hover:bg-green-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  const DropdownMenu = ({ group }) => {
    if (group.requiresRole && userRole !== group.requiresRole) {
      return null;
    }

    const isOpen = activeDropdown === group.id;

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isOpen ? null : group.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all
            ${colorClasses[group.color]}
            ${group.badge ? "pr-3" : ""}
          `}
        >
          <span>{group.icon}</span>
          <span className="font-medium">{group.label}</span>
          <span
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
          {group.badge && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs font-bold animate-pulse">
              {group.badge}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
            {group.items.map((item, idx) =>
              item.divider ? (
                <div key={idx} className="border-t my-1" />
              ) : (
                <button
                  key={idx}
                  onClick={() => !item.disabled && item.action()}
                  className={`
                    w-full flex flex-col px-4 py-2.5
                    hover:bg-gray-50 text-left
                    first:rounded-t-lg last:rounded-b-lg
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-gray-800">
                      {item.label}
                    </span>
                  </div>
                  {item.description && (
                    <span className="text-xs text-gray-500 ml-9">
                      {item.description}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Universal Navigation - same for all screen sizes */}
      <nav className="bg-[#271B2C] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                🤖 TXR Class Portal
              </h1>
              {/* Session Selector */}
              {sessions && sessions.length > 0 && (
                <select
                  value={currentSession || ""}
                  onChange={(e) => setCurrentSession(e.target.value)}
                  className="px-2 py-1 border border-gray-600 rounded text-sm bg-[#1B1B1B] text-white flex-1 max-w-[250px]"
                >
                  {sessions
                    .filter((session) => session.isActive)
                    .map((session) => (
                      <option key={session.id} value={session.name}>
                        {session.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-[#1B1B1B] rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* View Toggle */}
              <div className="bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => {
                    setCurrentView("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded ${
                    currentView === "dashboard"
                      ? "bg-white shadow-sm font-medium"
                      : "text-gray-600"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setCurrentView("leaderboard");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded ${
                    currentView === "leaderboard"
                      ? "bg-white shadow-sm font-medium"
                      : "text-gray-600"
                  }`}
                >
                  Leaderboard
                </button>
              </div>

              {/* Menu Sections */}
              {navGroups.map((group) => {
                if (group.requiresRole && userRole !== group.requiresRole) {
                  return null;
                }

                return (
                  <div key={group.id} className="mb-6">
                    <h3 className="font-semibold text-[#FEA303] mb-2 flex items-center gap-2">
                      <span>{group.icon}</span>
                      {group.label}
                      {group.badge && (
                        <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                          {group.badge}
                        </span>
                      )}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item, idx) =>
                        item.divider ? (
                          <div key={idx} className="border-t my-2" />
                        ) : (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!item.disabled && item.action) {
                                item.action();
                                setMobileMenuOpen(false);
                              }
                            }}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg
                              hover:bg-[#B19FF9] hover:bg-opacity-20 text-left transition-colors
                              ${item.disabled ? "opacity-50" : ""}
                            `}
                            disabled={item.disabled}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
