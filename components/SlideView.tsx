import React, { useState, useEffect } from 'react';
import { SlideContent, SlideLayout, QuizQuestion } from '../types.ts';
import { Pyramid } from './Pyramid.tsx';
import { Quote, Briefcase, Scale, Users, Building2, MousePointerClick, Lightbulb, CheckCircle2, XCircle, BrainCircuit, AlertCircle, Medal, Frown, RotateCcw, Lock, Volume2, PauseCircle, PlayCircle } from 'lucide-react';

interface SlideViewProps {
  slide: SlideContent;
  onScoreUpdate?: (points: number) => void;
  onQuizCompletion?: (isComplete: boolean) => void;
  currentScore?: number;
  maxScore?: number;
  onRestart?: () => void;
}

// Map slide IDs to specific 3D characters for variety
const CHARACTER_MAP: { [key: number]: string } = {
  1: "Woman Teacher",
  2: "Man Office Worker",
  3: "Woman Office Worker",
  4: "Judge",
  5: "Detective",
  6: "Man Technologist",
  7: "Woman Scientist",
  8: "Man Judge",
  9: "Man Teacher",
  10: "Woman Factory Worker",
  11: "Woman Student",
  12: "Man Student",
  13: "Woman Teacher",
  14: "Man Factory Worker",
  15: "Woman Technologist",
  16: "Woman Student"
};

// Helper to extract text for TTS
const getSlideText = (slide: SlideContent): string => {
  const parts = [slide.title, slide.subtitle, slide.mainText];
  
  if (slide.layout === SlideLayout.COMPARISON && slide.comparison) {
      parts.push(slide.comparison.leftTitle);
      parts.push(...slide.comparison.leftPoints);
      parts.push(slide.comparison.rightTitle);
      parts.push(...slide.comparison.rightPoints);
  }
  
  if (slide.bullets) {
      slide.bullets.forEach(b => {
          parts.push(b.text);
          if (b.detail) parts.push(b.detail);
      });
  }

  if (slide.quoteAuthor) {
      parts.push(`Quote by ${slide.quoteAuthor}`);
  }
  
  if (slide.layout === SlideLayout.PYRAMID) {
      parts.push("The CSR Pyramid consists of four levels. From top to bottom: Philanthropic, Ethical, Legal, and Economic responsibilities.");
  }

  if (slide.layout === SlideLayout.FINAL_SCORE) {
      parts.push("This is the final score screen.");
  }
  
  return parts.filter(Boolean).join('. ');
};

export const SlideView: React.FC<SlideViewProps> = ({ slide, onScoreUpdate, onQuizCompletion, currentScore = 0, maxScore = 0, onRestart }) => {
  const [focusedBulletIndex, setFocusedBulletIndex] = useState<number | null>(null);
  
  // Track which quizzes are successfully completed
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  
  // Track the last wrong answer for feedback (quizId -> optionIndex)
  const [wrongAnswers, setWrongAnswers] = useState<{[key: string]: number}>({});

  // Track read points to force reading
  const [readPoints, setReadPoints] = useState<Set<string>>(new Set());

  // Determine total points to click for the current slide
  const [totalPointsToRead, setTotalPointsToRead] = useState(0);

  // Audio Narration State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Reset state when slide changes
    setFocusedBulletIndex(null);
    setCompletedQuizzes(new Set());
    setWrongAnswers({});
    setReadPoints(new Set());
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    
    // Calculate total interactive points based on layout
    let count = 0;
    if (slide.layout === SlideLayout.BULLETS && slide.bullets) {
        count = slide.bullets.length;
    } else if (slide.layout === SlideLayout.SPLIT && slide.bullets) {
        count = slide.bullets.length;
    } else if (slide.layout === SlideLayout.QUOTE && slide.bullets) {
        count = slide.bullets.length;
    } else if (slide.layout === SlideLayout.COMPARISON && slide.comparison) {
        count = slide.comparison.leftPoints.length + slide.comparison.rightPoints.length;
    } else if (slide.layout === SlideLayout.PYRAMID && slide.bullets) {
        count = slide.bullets.length; 
    }
    setTotalPointsToRead(count);

  }, [slide.id, slide.layout, slide.bullets, slide.comparison]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // Check completion status
  useEffect(() => {
     const hasQuizzes = slide.quizzes && slide.quizzes.length > 0;
     const allPointsRead = totalPointsToRead === 0 || readPoints.size === totalPointsToRead;
     const allQuizzesDone = !hasQuizzes || (slide.quizzes && completedQuizzes.size === slide.quizzes.length);

     // Proceed if all points read AND all quizzes done (or no quizzes)
     // Also allow if it's the final score slide
     const isFinal = slide.layout === SlideLayout.FINAL_SCORE;
     
     if (onQuizCompletion) {
         onQuizCompletion(isFinal || (allPointsRead && allQuizzesDone));
     }
  }, [readPoints, completedQuizzes, totalPointsToRead, slide.quizzes, slide.layout]);

  const markPointRead = (id: string) => {
      setReadPoints(prev => {
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
      });
  };

  const toggleAudio = () => {
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      // Start speaking
      const text = getSlideText(slide);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to select a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && !v.name.includes('Google') && v.name.includes('Female')) || voices.find(v => v.lang.includes('en'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      // Sometimes browsers need a cancel before speak
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    }
  };

  const getAudioContext = () => {
     const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
     if (!AudioContext) return null;
     return new AudioContext();
  };

  const playCheerSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // Play a major triad (C-E-G)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        const now = ctx.currentTime;

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + (i * 0.05)); // Slight arpeggio
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + (i * 0.05));
            osc.stop(now + 0.6);
        });
    } catch(e) { console.error(e); }
  };

  const playLaughSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Create a "wobble" down effect
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        // Wobble frequency down
        osc.frequency.linearRampToValueAtTime(350, now + 0.1);
        osc.frequency.linearRampToValueAtTime(380, now + 0.2);
        osc.frequency.linearRampToValueAtTime(200, now + 0.5);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);

        // Second laugh pulse
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(400, now + 0.5);
        osc2.frequency.linearRampToValueAtTime(200, now + 0.9);
        
        gain2.gain.setValueAtTime(0.2, now + 0.5);
        gain2.gain.linearRampToValueAtTime(0, now + 0.9);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.5);
        osc2.stop(now + 0.9);

    } catch(e) { console.error(e); }
  };

  const handleQuizAnswer = (quizId: string, answerIndex: number, correctAnswerIndex: number) => {
    // If already completed this quiz, do nothing
    if (completedQuizzes.has(quizId)) return;

    if (answerIndex === correctAnswerIndex) {
        // Correct Answer
        playCheerSound();
        const newCompleted = new Set(completedQuizzes);
        newCompleted.add(quizId);
        setCompletedQuizzes(newCompleted);
        
        // Clear any wrong answer state for this quiz
        setWrongAnswers(prev => {
            const newState = {...prev};
            delete newState[quizId];
            return newState;
        });

        if (onScoreUpdate) onScoreUpdate(10);
    } else {
        // Wrong Answer
        playLaughSound();
        if (onScoreUpdate) onScoreUpdate(-5); // Deduct points
        
        // Mark this specific answer as wrong to show feedback
        setWrongAnswers(prev => ({...prev, [quizId]: answerIndex}));
    }
  };

  const renderQuiz = () => {
    if (!slide.quizzes || slide.quizzes.length === 0) return null;

    // Check if user has read all points
    const allPointsRead = totalPointsToRead === 0 || readPoints.size === totalPointsToRead;

    if (!allPointsRead) {
        return (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 w-full text-center p-8 bg-gray-50 rounded-xl">
                 <Lock className="mx-auto text-gray-400 mb-2" size={32} />
                 <h3 className="text-xl font-bold text-gray-500">Quiz Locked</h3>
                 <p className="text-gray-400">Please click on all the bullet points above to verify you have read them.</p>
                 <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300 max-w-xs mx-auto">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(readPoints.size / totalPointsToRead) * 100}%` }}></div>
                 </div>
                 <p className="text-xs text-gray-400 mt-1">{readPoints.size} of {totalPointsToRead} read</p>
            </div>
        );
    }

    return (
      <div className="mt-8 pt-6 border-t-2 border-dashed border-indigo-200 w-full animate-fade-in-up">
        <div className="flex items-center mb-4 text-indigo-800">
           <BrainCircuit className="mr-2" />
           <h3 className="text-xl font-heading font-bold">Quick Check: Test Your Understanding! 🎮</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slide.quizzes.map((quiz, qIdx) => {
             const isCompleted = completedQuizzes.has(quiz.id);
             const lastWrongIndex = wrongAnswers[quiz.id];

             return (
               <div key={quiz.id} className={`p-4 rounded-xl border-2 transition-all ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-gray-800 text-sm md:text-base mr-2">{qIdx + 1}. {quiz.question}</p>
                    {isCompleted ? <CheckCircle2 className="text-green-600 shrink-0" size={20} /> : <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full whitespace-nowrap">Not Solved</span>}
                  </div>
                  
                  <div className="space-y-2">
                    {quiz.options.map((option, oIdx) => {
                      // Determine button state
                      let btnClass = "bg-gray-50 text-gray-700 hover:bg-indigo-50";
                      let icon = null;
                      
                      if (isCompleted) {
                         // Quiz is done, highlight only the correct answer
                         if (oIdx === quiz.correctAnswer) {
                             btnClass = "bg-green-200 text-green-900 font-bold";
                             icon = <CheckCircle2 size={16} className="text-green-700" />;
                         } else {
                             btnClass = "bg-gray-100 text-gray-400 opacity-50";
                         }
                      } else if (lastWrongIndex === oIdx) {
                         // This was the last clicked wrong answer
                         btnClass = "bg-red-200 text-red-900 border border-red-300 animate-shake";
                         icon = <XCircle size={16} className="text-red-700" />;
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(quiz.id, oIdx, quiz.correctAnswer)}
                          disabled={isCompleted} // Only disable if the WHOLE quiz is solved correctly
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex justify-between items-center ${btnClass}`}
                        >
                          <span>{option}</span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Area */}
                  {isCompleted && (
                    <div className="mt-3 text-xs p-2 rounded text-green-800 bg-green-100 animate-fade-in">
                      <strong>🎉 Correct!</strong> {quiz.explanation}
                    </div>
                  )}
                  {!isCompleted && lastWrongIndex !== undefined && (
                      <div className="mt-3 text-xs p-2 rounded text-red-800 bg-red-100 flex items-center animate-pulse">
                         <AlertCircle size={12} className="mr-1" />
                         <strong>Incorrect!</strong> Try again. (-5 pts)
                      </div>
                  )}
               </div>
             )
          })}
        </div>
      </div>
    )
  }

  // 3D Character Renderer with dynamic character selection
  const Character = () => {
    const charName = CHARACTER_MAP[slide.id] || "Woman Teacher";
    const encodedName = encodeURIComponent(charName);
    return (
      <div className="absolute top-0 right-0 p-4 opacity-90 hover:opacity-100 transition-opacity hidden md:block z-0 pointer-events-none">
          <img 
            src={`https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/${encodedName}.png`} 
            alt={charName} 
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-xl animate-float"
          />
      </div>
    );
  };

  const renderContent = () => {
    switch (slide.layout) {
      case SlideLayout.TITLE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up relative z-10">
            <div className="bg-indigo-100 p-6 rounded-full mb-2">
              <Building2 size={64} className="text-indigo-600" />
            </div>
            
            <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-heading font-bold text-indigo-900 leading-tight">
                {slide.title}
                </h1>
                {/* Copyright moved specifically below title for slide 1 */}
                {slide.id === 1 && slide.footer && (
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{slide.footer}</p>
                )}
            </div>

            {slide.subtitle && (
              <h2 className="text-2xl md:text-3xl font-body text-pink-600 font-semibold">
                {slide.subtitle}
              </h2>
            )}
            {slide.mainText && (
              <p className="text-xl text-gray-600 max-w-2xl">{slide.mainText}</p>
            )}
            
            {/* Generic footer for other slides if needed */}
            {slide.footer && slide.id !== 1 && (
              <div className="absolute bottom-0 w-full text-center pb-4 text-gray-400 text-sm font-semibold">
                {slide.footer}
              </div>
            )}
            <Character />
          </div>
        );

      case SlideLayout.BULLETS:
        return (
          <div className="flex flex-col h-full justify-center relative">
             <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-4xl font-heading font-bold text-indigo-800 mb-2">{slide.title}</h2>
                    {slide.subtitle && <h3 className="text-xl text-pink-600 font-semibold mb-6">{slide.subtitle}</h3>}
                 </div>
                 <Character />
             </div>
             
             <ul className="space-y-4 mb-6 relative z-10">
                {slide.bullets?.map((bullet, idx) => {
                  const isFocused = focusedBulletIndex === idx;
                  const isDimmed = focusedBulletIndex !== null && !isFocused;
                  const isRead = readPoints.has(`bullet-${idx}`);

                  return (
                    <li 
                      key={idx} 
                      onClick={() => {
                          setFocusedBulletIndex(isFocused ? null : idx);
                          markPointRead(`bullet-${idx}`);
                      }}
                      className={`
                        group flex items-start p-4 rounded-xl transition-all duration-500 cursor-pointer
                        ${isFocused 
                          ? 'bg-white shadow-xl scale-105 border-l-8 border-indigo-500 z-10' 
                          : isRead 
                             ? 'bg-indigo-50/50 border-l-4 border-green-300 hover:bg-white'
                             : 'bg-white/40 hover:bg-white border-l-4 border-dashed border-gray-300 hover:border-indigo-400'
                        }
                        ${isDimmed ? 'opacity-30 blur-sm scale-95' : 'opacity-100'}
                      `}
                    >
                      <span className={`mr-4 mt-1 transition-all duration-300 ${isFocused ? 'text-indigo-600 scale-125' : isRead ? 'text-green-500' : 'text-gray-300 group-hover:text-indigo-400'}`}>
                        {isFocused ? <Lightbulb size={24} className="animate-bounce" /> : isRead ? <CheckCircle2 size={24} /> : '○'}
                      </span>
                      <div className="flex flex-col w-full">
                        <span className={`text-lg md:text-xl transition-all duration-300 ${isFocused ? 'font-bold text-indigo-900 text-2xl' : 'text-gray-700'}`}>
                          {bullet.text}
                        </span>
                        {isFocused && bullet.detail && (
                           <div className="mt-3 text-indigo-700 font-medium text-lg animate-fade-in bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg shadow-sm">
                             💡 {bullet.detail}
                           </div>
                        )}
                      </div>
                    </li>
                  );
                })}
             </ul>
             {focusedBulletIndex === null && readPoints.size < totalPointsToRead && (
               <div className="text-center mt-4 text-indigo-500 text-sm flex items-center justify-center animate-pulse">
                 <MousePointerClick size={16} className="mr-2" /> Click on every point to continue
               </div>
             )}
          </div>
        );

      case SlideLayout.SPLIT:
        return (
          <div className="flex flex-col md:flex-row h-full gap-8 items-center relative">
            <div className="md:w-1/2 space-y-4 relative z-10">
              <h2 className="text-4xl font-heading font-bold text-indigo-800">{slide.title}</h2>
              {slide.subtitle && <h3 className="text-xl text-pink-600 font-semibold">{slide.subtitle}</h3>}
              <p className="text-xl text-gray-700 leading-relaxed">{slide.mainText}</p>
            </div>
            <div className="md:w-1/2 bg-white/50 p-6 rounded-2xl shadow-inner w-full relative z-10">
              <ul className="space-y-3">
                {slide.bullets?.map((bullet, idx) => {
                  const isRead = readPoints.has(`split-${idx}`);
                  return (
                    <li 
                        key={idx} 
                        onClick={() => markPointRead(`split-${idx}`)}
                        className={`flex items-start text-lg p-3 rounded-lg cursor-pointer transition-colors ${isRead ? 'text-gray-800 bg-green-50/50' : 'text-gray-600 hover:bg-white animate-pulse-slow'}`}
                    >
                        <div className="mr-3 mt-1 shrink-0">
                            {isRead ? <CheckCircle2 size={20} className="text-green-500"/> : <Briefcase size={20} className="text-secondary" />}
                        </div>
                        <span>{bullet.text}</span>
                    </li>
                  )
                })}
              </ul>
              <div className="text-xs text-center mt-2 text-gray-400">Click points to mark read</div>
            </div>
            <Character />
          </div>
        );

      case SlideLayout.QUOTE:
        return (
          <div className="flex flex-col justify-center h-full items-center text-center px-4 md:px-12 relative">
            <Character />
            <Quote size={48} className="text-indigo-300 mb-6" />
            <blockquote className="text-3xl md:text-4xl font-heading font-bold text-indigo-900 mb-6 leading-snug relative z-10">
              "{slide.mainText}"
            </blockquote>
            <cite className="text-xl text-pink-600 font-semibold not-italic block mb-8 relative z-10">
              — {slide.quoteAuthor}
            </cite>
            {slide.bullets && (
               <div className="bg-indigo-50 p-4 rounded-xl text-left w-full max-w-2xl relative z-10">
                 <ul className="space-y-2">
                   {slide.bullets.map((b, i) => {
                       const isRead = readPoints.has(`quote-${i}`);
                       return (
                           <li key={i} onClick={() => markPointRead(`quote-${i}`)} className={`text-gray-700 text-lg p-2 rounded cursor-pointer ${isRead ? 'bg-green-100' : 'hover:bg-white'}`}>
                               <span className="mr-2">{isRead ? '✅' : '👉'}</span> {b.text}
                           </li>
                       )
                   })}
                 </ul>
                 <div className="text-xs text-center mt-2 text-gray-400">Tap points to confirm reading</div>
               </div>
            )}
          </div>
        );
      
      case SlideLayout.COMPARISON:
        return (
          <div className="flex flex-col h-full relative">
            <div className="flex justify-between">
                <h2 className="text-3xl font-heading font-bold text-indigo-800 mb-6 text-center">{slide.title}</h2>
                <Character />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full relative z-10">
              <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100">
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center"><Users className="mr-2"/> {slide.comparison?.leftTitle}</h3>
                <ul className="space-y-2">
                  {slide.comparison?.leftPoints.map((p, i) => {
                      const isRead = readPoints.has(`left-${i}`);
                      return (
                        <li key={i} onClick={() => markPointRead(`left-${i}`)} className={`text-base mb-2 p-2 rounded cursor-pointer transition-colors ${isRead ? 'text-gray-500 bg-red-100 line-through decoration-red-300' : 'text-gray-800 hover:bg-white'}`}>
                            • {p}
                        </li>
                      )
                  })}
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center"><Scale className="mr-2"/> {slide.comparison?.rightTitle}</h3>
                <ul className="space-y-2">
                  {slide.comparison?.rightPoints.map((p, i) => {
                     const isRead = readPoints.has(`right-${i}`);
                     return (
                        <li key={i} onClick={() => markPointRead(`right-${i}`)} className={`text-base mb-2 p-2 rounded cursor-pointer transition-colors ${isRead ? 'text-gray-500 bg-green-100 line-through decoration-green-300' : 'text-gray-800 hover:bg-white'}`}>
                            • {p}
                        </li>
                     )
                  })}
                </ul>
              </div>
            </div>
             <div className="text-xs text-center mt-2 text-gray-400">Click all items in both lists to proceed</div>
          </div>
        );

      case SlideLayout.PYRAMID:
        return (
           <div className="flex flex-col h-full items-center justify-center relative w-full">
             <div className="flex justify-between w-full max-w-4xl px-4">
                <div />
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-indigo-800 mb-1">{slide.title}</h2>
                    <h3 className="text-lg text-pink-600 font-semibold">{slide.subtitle}</h3>
                </div>
                <Character />
             </div>
             
             <div className="relative z-10 w-full flex flex-col items-center max-w-5xl">
                <Pyramid />
                {slide.bullets && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                        {slide.bullets.map((b, i) => {
                            const isRead = readPoints.has(`pyramid-${i}`);
                            return (
                                <div key={i} onClick={() => markPointRead(`pyramid-${i}`)} className={`p-3 border rounded-lg cursor-pointer text-sm shadow-sm transition-all ${isRead ? 'bg-indigo-100 border-indigo-300 transform scale-95' : 'bg-white border-gray-200 hover:bg-indigo-50 hover:scale-105'}`}>
                                    {b.text}
                                </div>
                            )
                        })}
                    </div>
                )}
             </div>
             <div className="text-xs text-center mt-4 text-gray-400 animate-bounce">Click definitions to learn more</div>
           </div>
        );
      
      case SlideLayout.FINAL_SCORE:
        // Use 70% of maxScore as passing grade
        const passThreshold = maxScore * 0.7;
        const passed = currentScore >= passThreshold;
        
        return (
            <div className="flex flex-col h-full items-center justify-center text-center animate-fade-in-up relative">
                <Character />
                {passed ? (
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 relative overflow-hidden max-w-lg w-full z-10">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"></div>
                        <Medal size={80} className="text-yellow-500 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-4xl font-heading font-bold text-indigo-900 mb-2">Congratulations!</h2>
                        <p className="text-gray-600 mb-6">You have successfully completed Chapter 5.</p>
                        
                        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                            <span className="block text-sm text-gray-500 uppercase tracking-wide">Final Score</span>
                            <span className="text-6xl font-bold text-indigo-600">{currentScore} / {maxScore}</span>
                        </div>
                        
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold inline-block">
                            PASS ({Math.ceil(passThreshold)}+ Required)
                        </div>
                    </div>
                ) : (
                     <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-200 max-w-lg w-full z-10">
                        <Frown size={80} className="text-red-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">Almost there!</h2>
                        <p className="text-gray-600 mb-6">You need at least {Math.ceil(passThreshold)} marks (70%) to pass this chapter.</p>
                        
                        <div className="bg-red-50 rounded-xl p-6 mb-8">
                            <span className="block text-sm text-gray-500 uppercase tracking-wide">Final Score</span>
                            <span className="text-6xl font-bold text-red-500">{currentScore} / {maxScore}</span>
                        </div>
                        
                        <button 
                            onClick={onRestart}
                            className="flex items-center justify-center w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            <RotateCcw size={20} className="mr-2" /> Try Again
                        </button>
                    </div>
                )}
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between p-2 relative">
      {/* Audio Narration Toggle */}
      <div className="absolute top-0 left-0 z-20 m-2">
         <button
           onClick={toggleAudio}
           className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isSpeaking ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : 'bg-white/80 text-indigo-600 hover:bg-white'}`}
           title={isSpeaking ? (isPaused ? "Resume Narration" : "Pause Narration") : "Listen to Slide"}
         >
           {isSpeaking && !isPaused ? <PauseCircle size={24}/> : isSpeaking && isPaused ? <PlayCircle size={24}/> : <Volume2 size={24}/>}
         </button>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {renderContent()}
      </div>
      
      {/* Footer Area: Highlight Box AND Quiz */}
      {/* Only show footer if NOT final score slide */}
      {slide.layout !== SlideLayout.FINAL_SCORE && (
        <div className="mt-6 flex flex-col gap-4 relative z-10">
          {slide.highlightBox && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
              <p className="text-yellow-800 font-medium flex items-center">
                <span className="text-2xl mr-2">💡</span> {slide.highlightBox}
              </p>
            </div>
          )}
          
          {renderQuiz()}
        </div>
      )}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};