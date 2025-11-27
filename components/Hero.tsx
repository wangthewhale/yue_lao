
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative animate-fade-in font-sans">
      
      {/* Top Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-xs font-mono font-bold text-zinc-600 tracking-widest uppercase">
          Project_2026: De-Single Protocol
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-6xl md:text-9xl font-black text-zinc-900 tracking-tighter mb-4 relative z-10 select-none text-center">
        YUE-LAO<span className="text-cyan-600">.AI</span>
      </h1>
      <p className="text-base md:text-lg font-mono text-zinc-600 tracking-[0.1em] font-medium uppercase mb-12 flex items-center justify-center gap-4 text-center">
        <span className="hidden md:block h-[2px] w-8 bg-zinc-400"></span>
        根據你的狀態生成適合你的月老條件許願單
        <span className="hidden md:block h-[2px] w-8 bg-zinc-400"></span>
      </p>

      {/* Insight Section - Side by Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        
        {/* Problem Card */}
        <div className="relative group bg-zinc-50 text-zinc-700 p-8 rounded-sm overflow-hidden border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-400"></div>
            
            <div className="font-mono text-xs text-zinc-500 mb-4 tracking-widest uppercase flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Current Status: Inefficient
            </div>
            
            <h3 className="text-2xl font-bold mb-4 leading-snug text-zinc-900">
                「為什麼你的月老訂單，<br/>總是<span className="border-b-4 border-zinc-300">沒有下文</span>？」
            </h3>
            
            <p className="text-zinc-700 text-base leading-relaxed text-justify mb-6 font-medium">
                絕大多數人的拜月老條件都犯了兩個錯誤：<br/>
                <strong className="text-zinc-900">1. 脫離現實的幻想 (Unreasonable)</strong><br/>
                <strong className="text-zinc-900">2. 過於模糊的許願 (Too Vague)</strong>
            </p>
            
            <div className="p-4 bg-white border border-dashed border-zinc-300 rounded-sm text-sm font-mono text-zinc-500 italic">
                "希望他是個好人，對我不錯..." <br/>
                <span className="not-italic text-zinc-400 font-bold">-> Error: Parameters undefined.</span>
            </div>
        </div>

        {/* Solution Card */}
        <div className="relative group bg-white text-zinc-900 p-8 rounded-sm overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-100 hover:border-cyan-400 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-600"></div>
             <div className="font-mono text-xs text-cyan-700 mb-4 tracking-widest uppercase flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></span> Solution: Bio-Matching
            </div>

            <h3 className="text-2xl font-bold mb-4 leading-snug">
                「拒絕模糊許願，<br/>產出<span className="bg-cyan-100 px-1">最精準</span>的規格書。」
            </h3>
            
            <p className="text-zinc-700 text-base leading-relaxed text-justify mb-6 font-medium">
                AI 根據你的社會參數、外型與深層價值觀，運算出真正適合你的「互補型」或「同質型」伴侶。我們將產出一份<strong className="text-zinc-900 bg-yellow-100 px-1">月老看得懂、辦得到的精準指令</strong>。
            </p>

             <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-sm text-sm font-mono text-cyan-900 font-medium">
                > Output: "身高 178cm, 金融業, INTJ..."<br/>
                > Status: Target Acquired.<br/>
                > Probability: 89.4%
            </div>
        </div>
      </div>
      
      {/* Relationship Targets Display */}
      <div className="flex flex-col items-center mb-10 w-full">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 font-bold">Select Relationship Goal in Next Step</div>
        <div className="flex gap-2 opacity-80">
            {['CASUAL_PARTNER', 'LIFE_PARTNER'].map((t, i) => (
                <div key={i} className="border border-zinc-300 px-3 py-1 text-xs font-mono text-zinc-600 bg-white rounded-sm font-semibold">
                    [{t}]
                </div>
            ))}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onStart}
        className="group relative w-full max-w-md py-6 bg-zinc-900 text-white overflow-hidden rounded-sm shadow-2xl transition-all hover:shadow-cyan-500/20 hover:scale-[1.01]"
      >
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[size:10px_10px] opacity-0 group-hover:opacity-20 transition-opacity animate-[moveBackground_2s_linear_infinite]"></div>
        
        <span className="relative z-10 flex flex-col items-center justify-center leading-tight">
            <span className="font-mono text-cyan-400 text-sm tracking-widest uppercase mb-1 group-hover:text-cyan-300 font-bold">Ready for 2026?</span>
            <span className="font-bold text-2xl tracking-[0.2em] uppercase group-hover:tracking-[0.25em] transition-all">
                開始分析 (Initiate) &rarr;
            </span>
        </span>
      </button>

      <div className="mt-8 text-xs text-zinc-500 text-center max-w-lg leading-relaxed font-medium">
        *本系統採用演化心理學與社會同質性演算法，結果可能過於真實 (Brutally Honest)，心臟不強者請勿嘗試。
      </div>

    </div>
  );
};
