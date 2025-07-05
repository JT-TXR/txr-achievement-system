import React, { useState, useEffect, useRef } from 'react';
import { ANNUAL_AWARDS } from './CompetitionAchievementSystem';

const AnnualAwardsModal = ({ 
  students, 
  currentSession,
  onClose,
  onAwardAchievement
}) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAward, setSelectedAward] = useState('');
  const [awardNotes, setAwardNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get enrolled students
  const enrolledStudents = students.filter(s => 
    s.enrolledSessions?.includes(currentSession) || 
    s.sessionsAttended?.includes(currentSession)
  );

  const modalRef = useRef(null);

    // Auto-scroll to top when success is shown
    useEffect(() => {
        if (showSuccess && modalRef.current) {
          modalRef.current.scrollTop = 0;
        }
      }, [showSuccess]);

  const handleAward = () => {
    if (!selectedStudent || !selectedAward) {
      alert('Please select both a student and an award');
      return;
    }

    const award = ANNUAL_AWARDS[selectedAward];
    
    // Create or find the achievement
    const achievement = {
      id: `annual-${award.id}-${Date.now()}`,
      name: award.name,
      icon: award.icon,
      description: award.description,
      xp: award.xp,
      type: 'lifetime',
      category: 'annual',
      notes: awardNotes,
      awardedDate: new Date().toISOString()
    };

    // Award it
    onAwardAchievement(selectedStudent, achievement);

    // Show success
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setSelectedStudent('');
      setSelectedAward('');
      setAwardNotes('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
      ref={modalRef}
      className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🏆</span>
            Annual Awards
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-pulse">
            <p className="text-center font-semibold text-green-800">
              ✅ Award Granted Successfully!
            </p>
          </div>
        )}

        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Choose a student...</option>
            {enrolledStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.program}
              </option>
            ))}
          </select>
        </div>

        {/* Award Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Award
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(ANNUAL_AWARDS).map(([key, award]) => (
              <label
                key={key}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAward === key 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="award"
                  value={key}
                  checked={selectedAward === key}
                  onChange={(e) => setSelectedAward(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{award.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{award.name}</div>
                    <div className="text-sm text-gray-600">{award.description}</div>
                    <div className="text-sm font-bold text-yellow-600 mt-1">
                      +{award.xp} Lifetime XP
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Award Notes (Optional)
          </label>
          <textarea
            value={awardNotes}
            onChange={(e) => setAwardNotes(e.target.value)}
            placeholder="Why is this student receiving this award?"
            className="w-full px-3 py-2 border rounded-lg h-20 resize-none"
          />
        </div>

        {/* Preview */}
        {selectedStudent && selectedAward && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold mb-2">Award Preview</h4>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ANNUAL_AWARDS[selectedAward].icon}</span>
              <div>
                <div className="font-medium">
                  {students.find(s => s.id === selectedStudent)?.name}
                </div>
                <div className="text-sm text-gray-600">
                  will receive {ANNUAL_AWARDS[selectedAward].name}
                </div>
              </div>
            </div>
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
            disabled={!selectedStudent || !selectedAward}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
          >
            Grant Award
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnualAwardsModal;