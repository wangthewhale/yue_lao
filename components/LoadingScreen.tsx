import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] animate-fade-in font-mono">
      <div className="relative w-64 h-64 border border-zinc-200 bg-white shadow-xl mb-8 overflow-hidden rounded-sm">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         
         {/* Scanning Line - Blue */}
         <div className="absolute inset-0 w-full h-1 bg-cyan-500/50 animate-scan shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
         
         {/* Random Data visualization */}
         <div className="absolute top-6 left-6 text-[9px] text-zinc-400 space-y-2 uppercase tracking-widest font-bold">
            <div className="animate-pulse text-zinc-800">Sequence_01: Validated</div>
            <div className="animate-pulse [animation-delay:0.3s]">Face_Topology: Mapping...</div>
            <div className="animate-pulse [animation-delay:0.6s]">Social_Vector: Calculating...</div>
            <div className="animate-pulse [animation-delay:0.9s] text-cyan-600">Homophily_Index: Pending...</div>
         </div>
         
         {/* Center spinner */}
         <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-xl font-light text-zinc-800 tracking-[0.2em] mb-3">PROCESSING DATA</h2>
      <div className="w-64 h-0.5 bg-zinc-200 overflow-hidden">
         <div className="h-full bg-zinc-800 w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
      <p className="text-[10px] text-zinc-400 mt-3 tracking-widest uppercase">Laboratory AI is finding your mirror match</p>
      
      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};