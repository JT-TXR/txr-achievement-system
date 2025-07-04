// src/NavigationBar.js
import React, { useState } from 'react';

const NavigationBar = ({ 
  // View state
  currentView, 
  setCurrentView, 
  currentSession,
  activeTournament,
  tournaments,
  userRole =  {userRole},
  
  // Session Tasks handlers
  setShowAttendanceManager,
  setShowBulkAward,
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
  setShowSettings
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for active tournament in current session
  const hasActiveTournament = tournaments?.some(
    (t) => t.sessionId === currentSession && t.status !== "complete"
  );

  // Navigation structure with practice buttons included
  const navGroups = [
    {
      id: 'session-tasks',
      label: 'Session Tasks',
      icon: '📝',
      color: 'green',
      items: [
        { 
          icon: '📅', 
          label: 'Take Attendance', 
          action: () => {
            setShowAttendanceManager(true);
            setActiveDropdown(null);
          }
        },
        { 
            icon: '🏅', 
            label: 'Bulk Award XP', 
            action: () => {
              setShowBulkAward(true);
              setActiveDropdown(null);
            }
          },
        { 
          icon: '👥', 
          label: 'Manage Teams', 
          action: () => {
            setShowTeamManager(true);
            setActiveDropdown(null);
          }
        },
        { divider: true },
        { 
          icon: '🤝', 
          label: 'Practice Match', 
          action: () => {
            setShowMatchEntry(true);
            setActiveDropdown(null);
          },
          description: 'Quick 2v0 match outside tournament'
        },
        { 
          icon: '🎮', 
          label: 'Practice Driver Skills', 
          action: () => {
            setSkillsType('driver');
            setShowSkillsEntry(true);
            setActiveDropdown(null);
          }
        },
        { 
          icon: '🤖', 
          label: 'Practice Autonomous Skills', 
          action: () => {
            setSkillsType('autonomous');
            setShowSkillsEntry(true);
            setActiveDropdown(null);
          }
        }
      ]
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: '🏆',
      color: 'orange',
      badge: hasActiveTournament ? 'ACTIVE' : null,
      items: [
        { 
          icon: '➕', 
          label: 'New Tournament', 
          action: () => {
            setShowTournamentWizard(true);
            setActiveDropdown(null);
          }
        },
        { divider: true },
        { 
          icon: '📊', 
          label: 'Current Tournament', 
          action: () => {
            const tournament = tournaments?.find(
              t => t.sessionId === currentSession && t.status !== "complete"
            );
            if (tournament) {
              setActiveTournament(tournament);
              setShowTournamentDashboard(true);
            }
            setActiveDropdown(null);
          },
          disabled: !hasActiveTournament,
          description: hasActiveTournament ? 'View active tournament' : 'No active tournament'
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      color: 'blue',
      items: [
        { 
          icon: '🏆', 
          label: 'Tournament History', 
          action: () => {
            setShowTournamentHistory(true);
            setActiveDropdown(null);
          }
        },
        { 
          icon: '📅', 
          label: 'Attendance Reports', 
          action: () => {
            setShowAttendanceReport(true);
            setActiveDropdown(null);
          }
        },
        { divider: true },
        { 
          icon: '💾', 
          label: 'Export All Data', 
          action: () => {
            exportData();
            setActiveDropdown(null);
          }
        }
      ]
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: '⚙️',
      color: 'gray',
      requiresRole: 'admin',
      items: [
        { 
          icon: '📚', 
          label: 'Manage Sessions', 
          action: () => {
            setShowSessionManager(true);
            setActiveDropdown(null);
          }
        },
        { 
          icon: '👤', 
          label: 'Manage Students', 
          action: () => {
            setShowStudentManager(true);
            setActiveDropdown(null);
          }
        },
        { 
          icon: '🏅', 
          label: 'Manage Achievements', 
          action: () => {
            setShowAchievementManager(true);
            setActiveDropdown(null);
          }
        },
        { divider: true },
        { 
          icon: '⚙️', 
          label: 'System Settings', 
          action: () => {
            setShowSettings(true);
            setActiveDropdown(null);
          }
        }
      ]
    }
  ];

  const colorClasses = {
    green: 'bg-green-500 hover:bg-green-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    gray: 'bg-gray-500 hover:bg-gray-600'
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
            ${group.badge ? 'pr-3' : ''}
          `}
        >
          <span>{group.icon}</span>
          <span className="font-medium">{group.label}</span>
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          {group.badge && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs font-bold animate-pulse">
              {group.badge}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
            {group.items.map((item, idx) => (
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
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>
                  {item.description && (
                    <span className="text-xs text-gray-500 ml-9">{item.description}</span>
                  )}
                </button>
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Session Info */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">🏆 VEX Achievement Portal</h1>
              {currentSession && (
                <div className="text-sm text-gray-600">
                  Session: <span className="font-medium">{currentSession}</span>
                </div>
              )}
            </div>

            {/* Main Navigation */}
            <div className="flex items-center gap-3">
              {/* Dashboard/Leaderboard Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded transition-all ${
                    currentView === 'dashboard' 
                      ? 'bg-white shadow-sm font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className={`px-4 py-2 rounded transition-all ${
                    currentView === 'leaderboard' 
                      ? 'bg-white shadow-sm font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Leaderboard
                </button>
              </div>

              {/* Dropdown Menus */}
              {navGroups.map(group => (
                <DropdownMenu key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">🏆 VEX Portal</h1>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {/* Mobile View Toggle */}
                <div className="bg-gray-100 rounded-lg p-1 mb-4">
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded ${
                      currentView === 'dashboard' 
                        ? 'bg-white shadow-sm font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('leaderboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded ${
                      currentView === 'leaderboard' 
                        ? 'bg-white shadow-sm font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    Leaderboard
                  </button>
                </div>

                {/* Mobile Menu Sections */}
                {navGroups.map(group => {
                  if (group.requiresRole && userRole !== group.requiresRole) {
                    return null;
                  }

                  return (
                    <div key={group.id} className="mb-6">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>{group.icon}</span>
                        {group.label}
                        {group.badge && (
                          <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                            {group.badge}
                          </span>
                        )}
                      </h3>
                      <div className="space-y-1">
                        {group.items.map((item, idx) => (
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
                                hover:bg-gray-50 text-left
                                ${item.disabled ? 'opacity-50' : ''}
                              `}
                              disabled={item.disabled}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium">{item.label}</div>
                                {item.description && (
                                  <div className="text-xs text-gray-500">{item.description}</div>
                                )}
                              </div>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default NavigationBar;