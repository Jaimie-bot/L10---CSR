import React, { useState, useEffect, useCallback } from 'react';
import { slides } from './data/slides.ts';
import { SlideView } from './components/SlideView.tsx';
import { ChevronLeft, ChevronRight, Menu, X, Trophy, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [canProceed, setCanProceed] = useState(true); // Control navigation
  // Track the furthest slide reached to control TOC locking
  const [maxReachedSlideIndex, setMaxReachedSlideIndex] = useState(0);

  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  // Calculate Total Max Score
  const maxPossibleScore = slides.reduce((acc, slide) => {
    if (slide.quizzes) {
        return acc + (slide.quizzes.length * 10);
    }
    return acc;
  }, 0);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1 && canProceed) {
      setCurrentSlideIndex(prev => {
        const next = prev + 1;
        setMaxReachedSlideIndex(m => Math.max(m, next));
        return next;
      });
    }
  }, [currentSlideIndex, totalSlides, canProceed]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  const goToSlide = (index: number) => {
    // Only allow jumping to slides we have already reached/unlocked
    if (index <= maxReachedSlideIndex) {
      setCurrentSlideIndex(index);
      setIsMenuOpen(false);
    }
  };

  const handleScoreUpdate = (points: number) => {
    setScore(prev => Math.max(0, prev + points)); // Prevent negative score
  };

  const handleQuizCompletion = (isComplete: boolean) => {
    setCanProceed(isComplete);
  };

  const restartApp = () => {
    setCurrentSlideIndex(0);
    setScore(0);
    setMaxReachedSlideIndex(0);
    setCanProceed(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (canProceed) nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, canProceed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 md:p-8 font-body overflow-hidden selection:bg-pink-200">
      
      {/* Card Container */}
      <div className="relative w-full max-w-5xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col" style={{ height: '90vh' }}>
        
        {/* Header / Progress Bar */}
        <div className="h-3 bg-gray-200 w-full relative">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/40">
          <div className="flex items-center space-x-4">
             <div className="text-sm font-bold text-gray-500 tracking-widest uppercase hidden md:block">
              Corporate Social Responsibility
             </div>
             <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold shadow-sm border border-yellow-200">
                <Trophy size={16} className="mr-1 text-yellow-600" /> Score: {score} / {maxPossibleScore}
             </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Slide {currentSlideIndex + 1} / {totalSlides}
            </span>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              aria-label="Table of Contents"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="flex-grow p-6 md:px-12 md:py-8 overflow-y-auto relative custom-scrollbar">
           <div key={currentSlide.id} className="h-full animate-fade-in pb-12">
             <SlideView 
                slide={currentSlide} 
                onScoreUpdate={handleScoreUpdate} 
                onQuizCompletion={handleQuizCompletion}
                currentScore={score}
                maxScore={maxPossibleScore}
                onRestart={restartApp}
             />
           </div>
        </div>

        {/* Navigation Controls */}
        <div className="px-6 py-4 bg-white/60 border-t border-gray-100 flex justify-between items-center backdrop-blur-md z-10">
           <button 
             onClick={prevSlide}
             disabled={currentSlideIndex === 0}
             className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 ${currentSlideIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 shadow-md hover:shadow-lg hover:bg-indigo-50'}`}
           >
             <ChevronLeft size={20} className="mr-2" /> Prev
           </button>

           <div className="hidden md:block text-gray-400 text-xs font-semibold bg-white/50 px-4 py-2 rounded-full border border-gray-100">
              {!canProceed ? (
                  <span className="flex items-center text-red-500 animate-pulse"><Lock size={12} className="mr-1"/> Read all points & complete quizzes to unlock next slide</span>
              ) : (
                  <span>Use arrow keys to navigate ⬅️ ➡️</span>
              )}
           </div>

           <button 
             onClick={nextSlide}
             disabled={currentSlideIndex === totalSlides - 1 || !canProceed}
             className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 
                ${currentSlideIndex === totalSlides - 1 || !canProceed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-purple-700'
                }`}
           >
             {canProceed ? (
                <>Next <ChevronRight size={20} className="ml-2" /></>
             ) : (
                <><Lock size={18} className="mr-2" /> Locked</>
             )}
           </button>
        </div>

      </div>

      {/* Table of Contents Overlay */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 bg-indigo-900/20 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right border-l border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-gray-800">Table of Contents</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2">
              {slides.map((s, idx) => {
                const isLocked = idx > maxReachedSlideIndex;
                const isActive = idx === currentSlideIndex;
                
                return (
                  <button
                    key={s.id}
                    onClick={() => !isLocked && goToSlide(idx)}
                    disabled={isLocked}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all flex justify-between items-center
                      ${isActive 
                        ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-900 font-bold shadow-sm' 
                        : isLocked 
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-l-4 border-transparent'
                          : 'hover:bg-gray-50 text-gray-600 border-l-4 border-transparent'
                      }
                    `}
                  >
                    <div>
                        <span className={`text-xs font-semibold block mb-1 ${isLocked ? 'text-gray-300' : 'text-gray-400'}`}>Slide {idx + 1}</span>
                        {s.title}
                    </div>
                    {isLocked && <Lock size={16} className="text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;