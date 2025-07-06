import React, { useState, useEffect, useRef } from 'react';
import { COMPETITION_HONORS } from './CompetitionAchievementSystem';

const CompetitionHonorsModal = ({ 
  students, 
  currentSession,
  achievements,
  onClose,
  onAwardAchievement
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedHonors, setSelectedHonors] = useState([]);
  const [competitionName, setCompetitionName] = useState('');
  const [competitionDate, setCompetitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef(null);

  // Get enrolled students
  const enrolledStudents = students.filter(s => 
    s.enrolledSessions?.includes(currentSession) || 
    s.sessionsAttended?.includes(currentSession)
  );

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleHonor = (honorId) => {
    setSelectedHonors(prev => 
      prev.includes(honorId) 
        ? prev.filter(id => id !== honorId)
        : [...prev, honorId]
    );
  };

    // Auto-scroll to top when success is shown
    useEffect(() => {
        if (showSuccess && modalRef.current) {
          modalRef.current.scrollTop = 0;
        }
      }, [showSuccess]);

  const handleAward = () => {
    if (selectedStudents.length === 0 || selectedHonors.length === 0) {
      alert('Please select at least one student and one honor');
      return;
    }

    if (!competitionName.trim()) {
      alert('Please enter the competition name');
      return;
    }

    // Award to each selected student
    selectedStudents.forEach(studentId => {
      selectedHonors.forEach(honorId => {
        const honor = COMPETITION_HONORS[honorId];
        
        // Create achievement with competition details
        const achievement = {
          id: `comp-${honor.id}-${Date.now()}`,
          name: honor.name,
          icon: honor.icon,
          description: honor.description,
          xp: honor.xp,
          type: 'lifetime',
          category: 'competition',
          competitionName,
          competitionDate,
          awardedDate: new Date().toISOString()
        };

        onAwardAchievement(studentId, achievement);
      });
    });

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setSelectedStudents([]);
      setSelectedHonors([]);
      setCompetitionName('');
    }, 2000);
  };

  // Quick select buttons
  const selectAllStudents = () => setSelectedStudents(enrolledStudents.map(s => s.id));
  const selectNoneStudents = () => setSelectedStudents([]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🏆</span>
            VEX Competition Honors
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-600">
            ×
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-pulse">
            <p className="text-center font-semibold text-green-800">
              ✅ Competition Honors Awarded Successfully!
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These awards are for official VEX competitions only. 
            For in-class tournaments, use the Tournament system which automatically awards achievements.
          </p>
        </div>

        {/* Competition Info */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Competition Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Competition Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                placeholder="e.g., State Championship, Signature Event"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Competition Date
              </label>
              <input
                type="date"
                value={competitionDate}
                onChange={(e) => setCompetitionDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Select Students ({selectedStudents.length} selected)</h3>
            <div className="flex gap-2">
              <button
                onClick={selectAllStudents}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Select All
              </button>
              <button
                onClick={selectNoneStudents}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
            {enrolledStudents.map(student => (
              <label
                key={student.id}
                className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${
                  selectedStudents.includes(student.id)
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="mr-2"
                />
                <span className="text-lg mr-2">{student.avatar}</span>
                <span>{student.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Honor Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Awards Won</h3>

            {/* Special Recognition */}
          <div className = 'mb-4'>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Special Recognition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['triple-crown', 'double-crown', 'tournament-competitor'].map(key => {
                const honor = COMPETITION_HONORS[key];
                return (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedHonors.includes(key)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHonors.includes(key)}
                      onChange={() => toggleHonor(key)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{honor.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{honor.name}</div>
                        <div className="text-xs text-gray-600">{honor.description}</div>
                        <div className="text-sm font-bold text-yellow-600">+{honor.xp} XP</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Major Awards */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Major Awards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['tournament-champion', 'robot-skills-champion', 'excellence-award'].map(key => {
                const honor = COMPETITION_HONORS[key];
                return (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedHonors.includes(key)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHonors.includes(key)}
                      onChange={() => toggleHonor(key)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{honor.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{honor.name}</div>
                        <div className="text-xs text-gray-600">{honor.description}</div>
                        <div className="text-sm font-bold text-yellow-600">+{honor.xp} XP</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Judged Awards */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Judged Awards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['build-award', 'design-award', 'think-award', 'innovate-award', 'create-award', 'amaze-award', 'inspire-award', 'sportsmanship-award', 'judges-award'].map(key => {
                const honor = COMPETITION_HONORS[key];
                return (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedHonors.includes(key)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHonors.includes(key)}
                      onChange={() => toggleHonor(key)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{honor.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{honor.name}</div>
                        <div className="text-xs text-gray-600">{honor.description}</div>
                        <div className="text-sm font-bold text-yellow-600">+{honor.xp} XP</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedStudents.length > 0 && selectedHonors.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-sm">
              {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} will receive {selectedHonors.length} award{selectedHonors.length !== 1 ? 's' : ''} from {competitionName || 'the competition'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total XP per student: {selectedHonors.reduce((sum, honorId) => sum + COMPETITION_HONORS[honorId].xp, 0)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAward}
            disabled={selectedStudents.length === 0 || selectedHonors.length === 0 || !competitionName.trim()}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
          >
            Award Honors
          </button>
        </div>
      </div>
      </div>
  );
};

export default CompetitionHonorsModal;