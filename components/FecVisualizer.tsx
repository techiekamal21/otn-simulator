import React, { useEffect, useState } from 'react';
import { Calculator, ArrowRight, Shield, Cpu, Activity, Zap, AlertTriangle, BarChart3, CheckCircle2 } from 'lucide-react';

interface FecVisualizerProps {
  speed: number;
  isProcessing: boolean;
  errorStats?: {
    totalBits: number;
    preFecErrors: number;
    postFecErrors: number;
    correctedErrors: number;
  };
  onErrorInject?: (type: 'SINGLE' | 'BURST') => void;
}

const FecVisualizer: React.FC<FecVisualizerProps> = ({ 
  speed, 
  isProcessing,
  errorStats = { totalBits: 1, preFecErrors: 0, postFecErrors: 0, correctedErrors: 0 },
  onErrorInject
}) => {
  const [parityProgress, setParityProgress] = useState(0);
  const [byteStream, setByteStream] = useState<string[]>([]);
  const [flashError, setFlashError] = useState(false);

  // Calculate internal animation interval based on global speed
  const animationInterval = Math.max(20, Math.floor(speed / 20));

  const preFecBer = errorStats.totalBits > 0 ? (errorStats.preFecErrors / errorStats.totalBits).toExponential(2) : '0.00e+0';
  const postFecBer = errorStats.totalBits > 0 ? (errorStats.postFecErrors / errorStats.totalBits).toExponential(2) : '0.00e+0';

  useEffect(() => {
    const interval = setInterval(() => {
        setParityProgress(prev => {
            if (prev >= 100) return 0;
            return prev + 4;
        });
        
        // Random byte visualization
        setByteStream(prev => {
            const newBytes = [...prev, Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')];
            if (newBytes.length > 8) newBytes.shift();
            return newBytes;
        });
    }, animationInterval);
    return () => clearInterval(interval);
  }, [animationInterval]);

  // Flash effect when errors change
  useEffect(() => {
      if (errorStats.preFecErrors > 0) {
          setFlashError(true);
          const t = setTimeout(() => setFlashError(false), 500);
          return () => clearTimeout(t);
      }
  }, [errorStats.preFecErrors]);

  return (
    <div className={`w-full bg-slate-900 border transition-all duration-500 rounded-lg shadow-xl mt-4 flex flex-col md:flex-row overflow-hidden ${isProcessing ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-green-500/30' : 'border-slate-700 opacity-90'}`}>
        
        {/* Left Panel: Visualization Engine */}
        <div className="flex-1 p-4 border-r border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-2">
                <h4 className={`font-bold flex items-center gap-2 transition-colors ${isProcessing ? 'text-green-400' : 'text-slate-400'}`}>
                    <Shield size={18} /> 
                    RS(255, 239) Engine
                    {isProcessing && <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded border border-green-700 animate-pulse">ACTIVE</span>}
                </h4>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-slate-500 font-bold">G(x) = Π(x - α^i)</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-2">
                {/* Input Data Stream */}
                <div className="flex flex-col items-center gap-2 group">
                    <div className={`w-28 h-16 bg-blue-900/10 border rounded flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm transition-colors ${flashError ? 'border-red-500 bg-red-900/20' : 'border-blue-500/20'}`}>
                        <span className="text-[10px] font-bold text-blue-200 z-10 mb-1">Data (K=239)</span>
                        <div className="absolute bottom-1 left-0 right-0 h-4 flex items-center justify-center gap-0.5 overflow-hidden px-1 opacity-50">
                            {byteStream.slice(0, 4).map((byte, i) => (
                                <span key={i} className={`text-[8px] font-mono ${flashError ? 'text-red-400 font-bold' : 'text-blue-300'}`}>{byte}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <ArrowRight className={`hidden md:block transition-colors ${isProcessing ? 'text-green-500' : 'text-slate-700'}`} size={16} />

                {/* Encoder Engine */}
                <div className="relative group">
                    <div className={`w-20 h-20 bg-slate-950 rounded-full border-2 flex flex-col items-center justify-center shadow-lg z-10 relative overflow-hidden transition-colors ${isProcessing ? 'border-green-500 shadow-green-900/20' : 'border-slate-700'}`}>
                        <Cpu className={`mb-1 transition-colors ${isProcessing ? 'text-green-500 animate-pulse' : 'text-slate-600'}`} size={24} />
                        <span className={`text-[8px] font-bold ${isProcessing ? 'text-green-400' : 'text-slate-500'}`}>ENCODER</span>
                        <div className={`absolute inset-0 border-t-2 rounded-full animate-spin ${isProcessing ? 'border-green-400/50' : 'border-slate-700'}`} style={{ animationDuration: `${Math.max(500, speed)}ms` }}></div>
                    </div>
                </div>

                <ArrowRight className={`hidden md:block transition-colors ${isProcessing ? 'text-green-500' : 'text-slate-700'}`} size={16} />

                {/* Output */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex shadow-lg opacity-80 scale-90">
                        <div className="w-24 h-16 bg-blue-900/10 border border-blue-500/20 border-r-0 rounded-l flex flex-col items-center justify-center relative">
                            <span className="text-[10px] font-bold text-blue-200">Payload</span>
                        </div>
                        <div className="w-12 h-16 bg-green-900/10 border border-green-500/30 rounded-r flex flex-col items-center justify-center relative overflow-hidden">
                            <div className={`absolute bottom-0 left-0 right-0 bg-green-500/20 transition-all border-t border-green-500/50 ${isProcessing ? 'opacity-100' : 'opacity-30'}`} style={{ height: `${parityProgress}%`, transitionDuration: '100ms' }}></div>
                            <span className="text-[8px] font-bold text-green-200 z-10">FEC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Controls & Statistics */}
        <div className="flex-1 bg-slate-950/50 p-4 flex flex-col justify-between">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900 border border-slate-700 p-2 rounded">
                    <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1"><AlertTriangle size={10} /> Pre-FEC BER</span>
                    <span className={`text-sm font-mono font-bold ${errorStats.preFecErrors > 0 ? 'text-yellow-400' : 'text-slate-300'}`}>
                        {preFecBer}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-1">Errors: {errorStats.preFecErrors}</div>
                </div>
                
                <div className="bg-slate-900 border border-slate-700 p-2 rounded relative overflow-hidden">
                    <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Post-FEC BER</span>
                    <span className={`text-sm font-mono font-bold ${errorStats.postFecErrors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {postFecBer}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-1">Corrected: {errorStats.correctedErrors}</div>
                    
                    {errorStats.postFecErrors === 0 && errorStats.preFecErrors > 0 && (
                        <div className="absolute top-1 right-1">
                            <Shield size={12} className="text-green-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* Injection Controls */}
            <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-2">
                    <Zap size={12} /> Error Injection
                </h5>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => onErrorInject && onErrorInject('SINGLE')}
                        disabled={!isProcessing && !onErrorInject} // Enable always if simulating transmission, or handle logic in parent
                        className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-slate-200 text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        title="Inject a single bit error (Correctable)"
                    >
                        <Zap size={12} className="text-yellow-400" /> Random Bit
                    </button>
                    <button 
                         onClick={() => onErrorInject && onErrorInject('BURST')}
                         disabled={!isProcessing && !onErrorInject}
                         className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-slate-200 text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                         title="Inject a burst error (Up to 8 bytes Correctable)"
                    >
                        <Activity size={12} className="text-orange-400" /> Burst Error
                    </button>
                </div>
                <div className="text-[9px] text-slate-500 text-center italic mt-1">
                    Inject errors during Transmission to test FEC correction.
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-600 font-mono">
                <span>Total Bits: {(errorStats.totalBits / 1000000).toFixed(2)} Mb</span>
                <span>Limit: 8 Bytes/Row</span>
            </div>
        </div>
    </div>
  );
};

export default FecVisualizer;