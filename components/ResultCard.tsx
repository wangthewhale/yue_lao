
import React, { useState, useRef, useMemo } from 'react';
import { AnalysisResult, RelationshipType } from '../types';
// @ts-ignore
import html2canvas from 'html2canvas';

interface ResultCardProps {
  result: AnalysisResult;
  imageUrl: string | null;
  userType: RelationshipType;
  onRetry: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, imageUrl, userType, onRetry }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate a deterministic theme based on the archetype title
  const theme = useMemo(() => {
    const seed = result.archetypeTitle || 'default';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 5;

    const styles = [
      { // Tech / Intellectual
        gradient: 'from-cyan-300/30 via-blue-200/20 to-indigo-200/10',
        accent: 'bg-cyan-500',
        text: 'text-cyan-800'
      },
      { // Passionate / Bold
        gradient: 'from-rose-300/30 via-orange-200/20 to-red-200/10',
        accent: 'bg-rose-500',
        text: 'text-rose-800'
      },
      { // Nature / Growth
        gradient: 'from-emerald-300/30 via-teal-200/20 to-lime-200/10',
        accent: 'bg-emerald-500',
        text: 'text-emerald-800'
      },
      { // Mystery / Deep
        gradient: 'from-violet-300/30 via-fuchsia-200/20 to-purple-200/10',
        accent: 'bg-violet-500',
        text: 'text-violet-800'
      },
      { // Warmth / Stable
        gradient: 'from-amber-300/30 via-yellow-200/20 to-orange-100/10',
        accent: 'bg-amber-500',
        text: 'text-amber-800'
      }
    ];

    return styles[index];
  }, [result.archetypeTitle]);

  const handleDownload = async () => {
    if (cardRef.current) {
      setIsDownloading(true);
      try {
        // Wait a brief moment to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 375, // Force render width
          height: 667, // Force render height
          scrollY: 0, // IMPORTANT: Ignore scroll position
          windowWidth: 375,
          windowHeight: 667,
          onclone: (document) => {
              // Ensure no transforms on cloned element
              const el = document.getElementById('share-card-target');
              if (el) {
                  el.style.transform = 'none';
              }
          }
        });
        
        const link = document.createElement('a');
        link.download = `YUE-LAO-SPEC-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Failed to generate image', error);
        alert('圖片生成失敗，請手動截圖 (Failed to generate image, please screenshot manually)');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-20 font-sans relative isolate">
      
      {/* Dynamic Ambient Background */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-tr ${theme.gradient} blur-3xl opacity-60 rounded-full transform scale-110 pointer-events-none transition-all duration-1000 animate-pulse`}></div>

      {/* Header */}
      <div className="flex items-end justify-between border-b-2 border-zinc-900 pb-4 mb-6">
        <div>
            <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">Analysis Complete</div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">MATCH SPECIFICATION</h2>
        </div>
        <div className="hidden md:block text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">
            Protocol: PRECISION_V1
        </div>
      </div>

      {/* The Weekend Club Partner Banner - Top Placement */}
      <div className="mb-10 w-full animate-fade-in">
         <div className="bg-zinc-50/90 backdrop-blur-sm border-2 border-zinc-900 p-6 flex flex-col md:flex-row items-start justify-between gap-6 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all relative overflow-hidden group rounded-sm">
            
            <div className="flex-1 pl-2">
                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-[10px] bg-cyan-400 text-zinc-900 px-2 py-0.5 tracking-widest border border-zinc-900">OFFICIAL PARTNER</span>
                        <h3 className="font-black text-zinc-900 tracking-wider text-xl uppercase">The Weekend Club</h3>
                    </div>
                    <h4 className={`font-bold text-lg tracking-wide mt-1 text-zinc-900`}>我們打造一個 全球早午餐社交聚會</h4>
                </div>
                
                <div className="text-zinc-800 text-base font-medium leading-relaxed space-y-3 max-w-3xl">
                   <p>The Weekend Club 是一個以現實生活為基礎的社交平台，讓六位陌生人於週末早午餐中自然相遇。</p>
                   <p>我們的使命簡單而真誠，讓一頓早午餐，成為人與人之間真實連結的起點。我們的 AI 演算法每週為上千位來自全球的用戶，配對成以六人為一桌的社交體驗，根據個人資料、性格特質與參加時段，幫助參與者在一頓早午餐中認識五位新朋友！</p>
                   <p className="font-black text-zinc-900 bg-cyan-100/50 inline-block px-1">沒有濾鏡，沒有虛擬。只有真實的對話與真誠的連結。無論你是剛抵達城市的新面孔，或是生活已久的在地居民，都能在這裡找到屬於你的週末聚會。</p>
                </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:self-center shrink-0">
                <a 
                href="https://app.the-wknd.club" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-4 bg-zinc-900 text-white border-2 border-zinc-900 text-sm font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all shadow-md whitespace-nowrap"
                >
                    Join the Club &rarr;
                </a>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Profile Image & Share Button */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-3 border-2 border-zinc-900 shadow-[8px_8px_0px_#000] rotate-1 transition-transform hover:rotate-0 duration-500">
                <div className="aspect-[3/4] overflow-hidden relative bg-zinc-100 mb-4 border-2 border-zinc-900">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt="Match" 
                            className="w-full h-full object-cover grayscale-[10%] contrast-110" 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 gap-2">
                            <span className="text-4xl">⚠️</span>
                            <span className="text-xs font-mono">IMG_GEN_FAILED</span>
                        </div>
                    )}
                    
                    {/* Watermark overlay */}
                    <div className="absolute top-4 left-4 border-2 border-white px-2 py-0.5 bg-black/80 backdrop-blur">
                        <span className="text-[12px] font-mono text-white tracking-widest uppercase font-bold">Target_Visual</span>
                    </div>
                </div>
                
                <div className="px-1 pb-2">
                    <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-none">{result.archetypeTitle}</h3>
                    <p className="text-sm font-mono text-zinc-600 mt-2 font-bold border-t-2 border-zinc-900 pt-2">{result.tagline}</p>
                </div>
            </div>

            {/* Stats Compact */}
            <div className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_#000]">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest font-bold">Compatibility Index</span>
                    <span className="text-5xl font-black text-zinc-900">{result.compatibilityScore}%</span>
                </div>
                <div className="w-full h-4 bg-zinc-200 border border-zinc-900 rounded-full overflow-hidden relative">
                     <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"></div>
                    <div className={`h-full ${theme.accent} border-r-2 border-zinc-900`} style={{ width: `${result.compatibilityScore}%` }}></div>
                </div>
            </div>

            {/* SHARE BUTTON */}
            <button 
                onClick={() => setShowShareModal(true)}
                className="w-full group relative flex items-center justify-center gap-3 bg-cyan-400 text-zinc-900 px-6 py-5 shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all border-2 border-black overflow-hidden"
            >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_25%,rgba(255,255,255,0.4)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.4)_75%,rgba(255,255,255,0.4)_100%)] bg-[size:10px_10px] opacity-20"></div>
                <span className="relative z-10 text-2xl">⚡</span>
                <div className="text-left relative z-10">
                    <div className="text-xs font-mono font-black uppercase tracking-widest text-zinc-800 leading-none mb-1">Generate Spec Sheet</div>
                    <div className="text-lg font-black tracking-wide leading-none uppercase">製作 IG 分享卡 (Share)</div>
                </div>
            </button>
        </div>

        {/* Right: Data Analysis */}
        <div className="lg:col-span-8 space-y-8">
             
             {/* Main Analysis */}
             <div className="bg-white border-2 border-zinc-900 p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] relative">
                 <div className="absolute -top-3 -left-3 bg-zinc-900 text-white px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest">
                    Psychological Profile
                 </div>
                 
                 <p className="text-zinc-900 leading-relaxed text-xl font-medium mb-8 mt-2">
                     {result.psychologicalProfile}
                 </p>
                 
                 <div className="flex flex-wrap gap-3">
                     {result.personalityTraits.map((trait, i) => (
                         <span key={i} className="px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-black border border-zinc-900 shadow-[2px_2px_0px_#000] hover:translate-y-[-2px] transition-transform cursor-default">
                             #{trait}
                         </span>
                     ))}
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Visual Description */}
                 <div className="border-2 border-zinc-900 p-6 bg-zinc-50">
                     <h4 className="text-zinc-900 font-black mb-4 flex items-center gap-2 font-mono uppercase text-sm tracking-widest border-b-2 border-zinc-900 pb-2">
                        👁️ 適合你的外型 (Visuals)
                     </h4>
                     <p className="text-zinc-800 text-lg leading-relaxed font-bold">
                         {result.physicalDescription}
                     </p>
                 </div>

                 {/* Interaction Advice */}
                 <div className="border-2 border-zinc-900 p-6 bg-cyan-50">
                     <h4 className="text-zinc-900 font-black mb-4 flex items-center gap-2 font-mono uppercase text-sm tracking-widest border-b-2 border-zinc-900 pb-2">
                        💡 如何接近他/她 (Advice)
                     </h4>
                     <p className="text-zinc-900 text-lg italic font-bold">
                         "{result.interactionAdvice}"
                     </p>
                 </div>
             </div>

             {/* Flags Table */}
             <div className="border-2 border-zinc-900 bg-white shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="p-6 border-r-2 border-zinc-900 border-b-2 md:border-b-0">
                        <div className="text-zinc-900 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 bg-green-100 w-fit px-2 py-1 border border-zinc-900">
                            <span className="text-green-600 text-xl">✅</span> 適合你的特質 (Green Flags)
                        </div>
                        <ul className="space-y-4">
                            {result.greenFlags.map((flag, i) => (
                                <li key={i} className="text-lg text-zinc-900 flex gap-3 items-start font-bold">
                                    <span className="text-green-600 font-black shrink-0 mt-0.5">✓</span>
                                    <span className="leading-snug">{flag}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                     <div className="p-6 bg-zinc-50">
                        <div className="text-zinc-900 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 bg-red-100 w-fit px-2 py-1 border border-zinc-900">
                            <span className="text-red-600 text-xl">❌</span> 絕對不合的雷點 (Red Flags)
                        </div>
                        <ul className="space-y-4">
                            {result.redFlags.map((flag, i) => (
                                <li key={i} className="text-lg text-zinc-900 flex gap-3 items-start font-bold">
                                    <span className="text-red-600 font-black shrink-0 mt-0.5">!</span>
                                    <span className="leading-snug">{flag}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                 </div>
             </div>

             {/* YUE LAO SECTION - REDESIGNED AS TERMINAL */}
             <div className="relative bg-zinc-900 p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] overflow-hidden group border-4 border-zinc-900">
                {/* Tech Deco */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10 border-b border-zinc-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-cyan-500 rounded-sm animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                        <h4 className="text-white font-mono text-lg tracking-widest uppercase font-black">
                            Yue_Lao_Protocol
                        </h4>
                    </div>
                    <div className="text-xs text-black font-black bg-cyan-400 px-2 py-1 uppercase tracking-widest">
                        PRECISION: MAX
                    </div>
                </div>

                <div className="relative z-10 p-0 font-mono">
                    <div className="text-sm text-zinc-400 mb-4 uppercase tracking-wide font-bold">
                        // EXECUTE PRAYER SEQUENCE:
                    </div>
                    <div className="text-cyan-50 text-lg leading-loose font-bold whitespace-pre-line border-l-4 border-cyan-500 pl-6">
                        {result.yueLaoPrayer}
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/90 backdrop-blur-md p-4 animate-fade-in cursor-pointer"
            onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md max-h-[95vh] overflow-y-auto rounded-sm border-2 border-zinc-500 shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-mono font-bold text-zinc-900 uppercase tracking-widest">Image Generator</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 flex flex-col items-center bg-zinc-200">
              
              {/* THE CANVAS TARGET - "VIRAL STREET POSTER" STYLE */}
              <div 
                ref={cardRef}
                id="share-card-target"
                className="relative bg-white flex flex-col overflow-hidden text-zinc-900 font-sans shadow-2xl border-4 border-zinc-900"
                style={{ 
                    width: '375px', 
                    height: '667px',
                    minWidth: '375px',
                    minHeight: '667px'
                }}
              >
                 {/* 1. TOP HERO SECTION (45%) */}
                 <div style={{ height: '300px' }} className="w-full relative bg-zinc-100 border-b-4 border-zinc-900">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[size:10px_10px]"></div>
                    
                    {/* Hero Image */}
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt="Target" 
                            className="w-full h-full object-cover grayscale-[10%] contrast-110" 
                        />
                    ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-200">
                            <span className="text-4xl">◼</span>
                         </div>
                    )}

                    {/* OVERLAY STICKER BADGE */}
                    <div className="absolute -bottom-8 -right-4 z-20 transform -rotate-12">
                        <div className="w-32 h-32 bg-cyan-400 rounded-full border-4 border-black flex flex-col items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <span className="font-black text-xs uppercase tracking-tighter">Match Rate</span>
                            <span className="font-black text-5xl italic tracking-tighter leading-none">{result.compatibilityScore}%</span>
                        </div>
                    </div>
                 </div>

                 {/* 2. BODY CONTENT (Flexible) */}
                 <div className="flex-1 bg-zinc-50 p-5 flex flex-col relative z-10">
                    
                    {/* TITLE BLOCK */}
                    <div className="mb-4 pr-10">
                        <div className="inline-block bg-black text-white px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest mb-1">
                            TARGET_ACQUIRED
                        </div>
                        <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-zinc-900 break-words">
                            {result.archetypeTitle}
                        </h2>
                    </div>

                    {/* SPECS BOX */}
                    <div className="flex-1 bg-white border-2 border-black p-3 relative shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 border-b border-zinc-100"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 border-b-2 border-zinc-100 pb-1">
                            Specification Sheet
                        </h3>
                        <p className="text-[11px] font-bold leading-relaxed text-zinc-900 whitespace-pre-line line-clamp-[12] overflow-hidden">
                           {result.yueLaoPrayer}
                        </p>
                    </div>
                 </div>

                 {/* 3. FOOTER (Branding) */}
                 <div style={{ height: '90px' }} className="bg-black w-full p-4 flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                    <div className="absolute top-0 right-4 w-8 h-12 bg-cyan-500 flex items-end justify-center pb-1">
                        <span className="text-black font-black text-lg">↓</span>
                    </div>

                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-1 font-bold">
                        Sponsored by
                    </p>
                    <div className="flex flex-col">
                        <h3 className="text-white text-xl font-black tracking-tight leading-none uppercase">
                            The Weekend Club
                        </h3>
                        <p className="text-[9px] text-zinc-400 leading-tight mt-1 line-clamp-2 w-[85%] font-medium">
                            全球早午餐社交聚會。讓一頓早午餐，成為人與人之間真實連結的起點。
                        </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-white flex flex-col gap-3">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-zinc-900 text-white font-mono font-bold py-3 uppercase tracking-widest hover:bg-zinc-700 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <span>⬇</span> Download Image
                    </>
                )}
              </button>

               <button 
                onClick={() => setShowShareModal(false)}
                className="w-full bg-white text-zinc-500 font-mono font-bold py-3 uppercase tracking-widest hover:text-zinc-900 hover:bg-zinc-100 transition-colors border-2 border-zinc-200 hover:border-zinc-400"
              >
                Close / 返回結果
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
