
import React, { useState, useEffect } from 'react';
import { UserData, RelationshipType, AnalysisResult } from './types';
const analyzeIdealMatch = async (data, type) => {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData: data, relationshipType: type })
  });
  return res.json();
};

const generateMatchImage = async (prompt) => {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const json = await res.json();
  return json.image;
};

import { saveSubmission } from './services/storageService'; // Import storage
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { Hero } from './components/Hero';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminPanel } from './components/AdminPanel'; // Import Admin

const App: React.FC = () => {
  const [view, setView] = useState<'hero' | 'form' | 'analyzing' | 'result' | 'insufficient' | 'admin'>('hero');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedType, setSelectedType] = useState<RelationshipType>(RelationshipType.LIFE_PARTNER);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [matchImage, setMatchImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for admin access via URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setView('admin');
    }
  }, []);

  const handleStart = () => {
    setView('form');
  };

  const calculateCompleteness = (data: UserData): number => {
    // Include sliders (introExtroScale, thinkingFeelingScale) in the check
    const fieldsToCheck: (keyof UserData)[] = [
        'name', 'age', 'gender', 'sexualOrientation', 'height', 'weight', 
        'occupation', 'income', 'email', 'mbti', 'introExtroScale', 'thinkingFeelingScale',
        'interests', 'values', 'darkSide'
    ];

    const filledCount = fieldsToCheck.reduce((acc, field) => {
        const value = data[field];
        // Strings must be non-empty
        if (typeof value === 'string' && value.trim().length > 0) return acc + 1;
        // Numbers must be > 0 (sliders default to 5, so they pass)
        if (typeof value === 'number' && value > 0) return acc + 1;
        return acc;
    }, 0);

    return Math.round((filledCount / fieldsToCheck.length) * 100);
  };

  const handleFormSubmit = async (data: UserData, type: RelationshipType) => {
    setUserData(data);
    setSelectedType(type);

    // 1. Check Data Completeness (Threshold: 80%)
    const completeness = calculateCompleteness(data);
    console.log("Data Completeness:", completeness, "%");

    if (completeness < 80) {
        setView('insufficient');
        return;
    }

    setView('analyzing');
    setError(null);
    setMatchImage(null);
    
    // Save preliminary data (before result)
    saveSubmission(data, type);

    try {
      // 2. Analyze Text Profile & Photo
      const analysis = await analyzeIdealMatch(data, type);
      setResult(analysis);
      
      // Update DB with result
      saveSubmission(data, type, analysis);

      // 3. Generate Image based on the prompt from analysis
      if (analysis.imagePrompt) {
          try {
              const imageUrl = await generateMatchImage(analysis.imagePrompt, type);
              setMatchImage(imageUrl);
          } catch (imgErr) {
              console.error("Failed to generate image, proceeding with text only", imgErr);
          }
      }

      setView('result');
    } catch (err) {
      console.error(err);
      setError('實驗室連線異常，數據傳輸失敗。請檢查網絡連接。');
      setView('form');
    }
  };

  const handleReset = () => {
    setResult(null);
    setMatchImage(null);
    setView('hero');
  };

  const handleBackToForm = () => {
      setView('form');
  };

  return (
    <div className="min-h-screen bg-lab-50 text-lab-900 font-sans overflow-x-hidden relative">
      {/* Light Technical Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* Vignette for depth */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none z-0"></div>

      {view === 'admin' ? (
          <AdminPanel onClose={() => setView('hero')} />
      ) : (
      <>
      <header className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
          <div className="w-10 h-10 border border-zinc-300 bg-white flex items-center justify-center relative overflow-hidden shadow-sm group-hover:border-cyan-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-600 group-hover:text-cyan-600 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-tight text-zinc-800">
              YUE-LAO<span className="text-cyan-600">.AI</span>
            </h1>
            <div className="text-[9px] text-zinc-400 tracking-[0.25em] font-semibold">REALITY CHECK UNIT</div>
          </div>
        </div>

        {view !== 'hero' && (
            <button 
                onClick={handleReset}
                className="text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest border border-transparent hover:border-zinc-200 px-3 py-2 rounded-sm transition-all flex items-center gap-2"
            >
                <span>回到首頁</span>
                <span className="hidden md:inline">(Home)</span>
            </button>
        )}
      </header>

      <main className="pt-28 pb-12 px-4 md:px-8 container mx-auto min-h-screen flex flex-col items-center justify-center relative z-10">
        {view === 'hero' && <Hero onStart={handleStart} />}
        
        {view === 'form' && (
          <div className="w-full max-w-5xl animate-fade-in">
             {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-center font-mono text-sm shadow-sm">
                  ERROR: {error}
                </div>
             )}
            <InputForm onSubmit={handleFormSubmit} initialData={userData} />
          </div>
        )}

        {view === 'insufficient' && (
            <div className="max-w-md w-full bg-white border-2 border-red-500 p-8 shadow-2xl animate-fade-in text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🚫
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">資料不足</h2>
                <p className="font-mono text-red-500 text-xs tracking-widest uppercase mb-6">Insufficient Data Input (&lt;80%)</p>
                
                <p className="text-zinc-600 mb-8 leading-relaxed">
                    你提供的資料不足，AI 無法進行精準的運算。請返回並補充更多關於你的生活習慣、價值觀與個人特質的描述，這樣才能算出真正適合你的對象。
                </p>

                <button 
                    onClick={handleBackToForm}
                    className="w-full bg-zinc-900 text-white font-mono font-bold py-4 uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                    &larr; Return to Form
                </button>
            </div>
        )}

        {view === 'analyzing' && <LoadingScreen />}

        {view === 'result' && result && (
          <ResultCard 
            result={result} 
            imageUrl={matchImage} 
            userType={selectedType} 
            onRetry={() => setView('form')} 
          />
        )}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center text-zinc-400 text-[10px] font-mono border-t border-zinc-200 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center gap-4">
         <p>Sponsored by <a href="https://app.the-wknd.club" target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-cyan-600 underline decoration-dotted font-bold">The Weekend Club</a></p>
      </footer>
      </>
      )}
    </div>
  );
};

export default App;
