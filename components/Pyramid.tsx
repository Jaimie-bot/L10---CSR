import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Info, Sparkles, HelpCircle } from 'lucide-react';

const LEVELS = [
  {
    id: 'philanthropic',
    title: 'Philanthropic',
    subtitle: '(Desired)',
    color: 'bg-purple-500',
    hoverColor: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    description: "At the peak: 'Be a Good Corporate Citizen'.\n\nThis level involves active contribution to the community and society. It is about giving back resources to improve quality of life.\n\n• Examples: Corporate donations to arts/education, employee volunteer programs, building schools.\n• Nature: Desired by society. A company is not 'unethical' if it skips this, but it is considered less virtuous.",
    width: 'w-1/4',
    suggestedQuestions: ["Why is philanthropy not required?", "Does giving money excuse bad behavior?"]
  },
  {
    id: 'ethical',
    title: 'Ethical',
    subtitle: '(Expected)',
    color: 'bg-pink-500',
    hoverColor: 'bg-pink-600',
    lightColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-900',
    description: "The obligation to do what is right, just, and fair—even if the law doesn't force you to.\n\nThis level embraces those activities and practices that are expected or prohibited by societal members, even though they are not codified into law.\n\n• Examples: Fair trade practices, paying above minimum wage, refusing to work with oppressive regimes.\n• Risk: Ignoring this leads to severe reputational damage.",
    width: 'w-2/4',
    suggestedQuestions: ["Can something be legal but unethical?", "Who decides what is 'ethical'?"]
  },
  {
    id: 'legal',
    title: 'Legal',
    subtitle: '(Required)',
    color: 'bg-blue-500',
    hoverColor: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    description: "Obey the Law. The law is society's codification of right and wrong.\n\nBusinesses are expected to pursue their economic missions within the framework of the law.\n\n• Examples: Adhering to labor laws, environmental regulations (EPA), honoring contracts, consumer protection.\n• Consequence: Failure here leads to fines, lawsuits, or prison.",
    width: 'w-3/4',
    suggestedQuestions: ["Is following the law enough?", "What if the law is unjust?"]
  },
  {
    id: 'economic',
    title: 'Economic',
    subtitle: '(Required)',
    color: 'bg-indigo-600',
    hoverColor: 'bg-indigo-700',
    lightColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    description: "The Foundation: Be Profitable.\n\nA business has a responsibility to produce goods/services that society wants and to sell them at a profit. All other responsibilities rest on this base.\n\n• Logic: If a company goes bankrupt, it cannot pay employees, pay taxes, or give to charity.\n• Goal: Maximize earnings per share, ensure efficiency.",
    width: 'w-full',
    suggestedQuestions: ["Why is profit the base?", "Is profit more important than ethics?"]
  }
];

export const Pyramid: React.FC = () => {
  const [hoveredLevel, setHoveredLevel] = useState<typeof LEVELS[0] | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async (customPrompt?: string) => {
    const promptToUse = customPrompt || question;
    if (!promptToUse.trim()) return;

    setLoading(true);
    setAnswer('');
    // If using a suggested question, update the input visually
    if (customPrompt) setQuestion(customPrompt);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const levelContext = hoveredLevel ? `The user is specifically asking about the ${hoveredLevel.title} level.` : '';
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User Question: "${promptToUse}". ${levelContext}`,
            config: {
                systemInstruction: "You are an expert professor in Business Ethics, specifically teaching Carroll's CSR Pyramid. The pyramid has 4 levels: Economic (Base, Required), Legal (Required), Ethical (Expected), and Philanthropic (Top, Desired). Answer the student's question clearly, concisely (under 100 words), and engagingly. If the question relates to conflicts between levels (e.g. Legal vs Ethical), explain the tension."
            }
        });
        
        setAnswer(response.text || "I couldn't generate an answer. Please try again.");
    } catch (error) {
        console.error("AI Error:", error);
        setAnswer("Sorry, I'm having trouble connecting to the ethics database right now.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full py-4">
      
      {/* Left: The Pyramid Visual */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="relative flex flex-col items-center w-full max-w-lg transition-all pt-4">
            {LEVELS.map((level, index) => {
                const isHovered = hoveredLevel?.id === level.id;
                const isFaded = hoveredLevel && !isHovered;

                return (
                    <div 
                        key={level.id}
                        onMouseEnter={() => setHoveredLevel(level)}
                        onMouseLeave={() => setHoveredLevel(null)}
                        className={`
                            ${level.width} h-20 mb-1 
                            flex items-center justify-center 
                            shadow-xl cursor-pointer 
                            transition-all duration-300 ease-out
                            ${isHovered ? `${level.hoverColor} scale-105 z-10 ring-4 ring-offset-2 ring-indigo-200` : level.color}
                            ${isFaded ? 'opacity-40 blur-[1px]' : 'opacity-100'}
                            ${index === 0 ? 'rounded-t-[40px]' : ''} 
                            ${index === 3 ? 'rounded-b-xl' : ''}
                        `}
                    >
                        <span className="text-white font-heading font-bold text-center text-lg md:text-xl leading-tight drop-shadow-md">
                            {level.title}
                            <br/>
                            <span className="text-xs md:text-sm font-body font-light opacity-90">{level.subtitle}</span>
                        </span>
                    </div>
                );
            })}
        </div>
        <p className="mt-4 text-indigo-400 font-medium text-sm text-center flex items-center animate-pulse">
            <MousePointer className="mr-1 w-4 h-4"/> Hover over levels for details
        </p>
      </div>

      {/* Right: Info Panel & AI Chat */}
      <div className="flex-1 w-full flex flex-col gap-4 h-full min-h-[400px]">
         
         {/* Dynamic Detail Card */}
         <div className={`p-6 rounded-2xl border-2 shadow-sm transition-all duration-300 flex-grow ${hoveredLevel ? `${hoveredLevel.lightColor} ${hoveredLevel.borderColor}` : 'bg-gray-50 border-gray-100'}`}>
            {hoveredLevel ? (
                <div className="animate-fade-in">
                    <h4 className={`text-2xl font-heading font-bold mb-4 flex items-center ${hoveredLevel.textColor}`}>
                        <Info size={24} className="mr-2"/> {hoveredLevel.title} Responsibility
                    </h4>
                    <p className="text-gray-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-body">
                        {hoveredLevel.description}
                    </p>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                    <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                        <Info size={40} className="text-indigo-200"/>
                    </div>
                    <p className="text-lg font-medium text-gray-500">Explore the Pyramid</p>
                    <p className="text-sm">Hover over a pyramid level to unlock its definition and key examples.</p>
                </div>
            )}
         </div>

         {/* AI Chat Interface */}
         <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center text-white justify-between">
                <div className="flex items-center">
                    <Bot size={22} className="mr-2"/>
                    <span className="font-heading font-bold text-base">Ask Anything</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">AI Tutor</span>
            </div>
            
            <div className="p-4 bg-indigo-50/30 flex-grow flex flex-col justify-end min-h-[160px]">
                {loading ? (
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-indigo-100 mb-4 w-fit shadow-sm self-start animate-fade-in">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        </div>
                        <span className="sr-only">AI is thinking...</span>
                    </div>
                ) : answer ? (
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 text-gray-800 mb-4 animate-pop-in shadow-sm relative">
                        <Sparkles size={20} className="absolute -top-3 -right-2 text-yellow-400 bg-white rounded-full p-0.5 animate-spin-slow"/>
                        <p className="text-sm leading-relaxed">{answer}</p>
                        <button onClick={() => setAnswer('')} className="block mt-3 text-xs text-indigo-600 font-bold hover:underline">Ask another question</button>
                    </div>
                ) : (
                    <>
                        {/* Suggested Questions Chips */}
                        {hoveredLevel && (
                             <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
                                {hoveredLevel.suggestedQuestions.map((q, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => askAI(q)}
                                        className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors flex items-center"
                                    >
                                        <HelpCircle size={12} className="mr-1"/> {q}
                                    </button>
                                ))}
                             </div>
                        )}
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                            {hoveredLevel ? `Ask about ${hoveredLevel.title} responsibility...` : 'Ask any question about CSR...'}
                        </p>
                    </>
                )}

                <div className="flex gap-2 relative">
                    <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askAI()}
                        placeholder="Type your question here..."
                        className="flex-1 text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner bg-white"
                        disabled={loading || !!answer}
                    />
                    <button 
                        onClick={() => askAI()} 
                        disabled={loading || !question.trim() || !!answer}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
         </div>

      </div>
      
      {/* Helper Icon for visual only */}
      <div className="hidden">
        <MousePointer />
      </div>

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            60% { transform: scale(1.02) translateY(-2px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
            animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Simple Icon component for the "Hover" instruction
const MousePointer = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className={className}
    >
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
        <path d="M13 13l6 6"></path>
    </svg>
);