import React from 'react';
import { SimulationStep, SimulationConfig } from '../types';
import { Zap, Activity, ArrowUp, ArrowDown } from 'lucide-react';

interface InternalFlowVisualizerProps {
  step: SimulationStep;
  config: SimulationConfig;
}

const InternalFlowVisualizer: React.FC<InternalFlowVisualizerProps> = ({ step, config }) => {
  // Determine active zones based on step
  const isClientActive = step === SimulationStep.CLIENT_MAPPING || step === SimulationStep.IDLE;
  const isLoActive = step === SimulationStep.CLIENT_MAPPING || step === SimulationStep.PATH_OVERHEAD;
  const isFabricActive = step === SimulationStep.PATH_OVERHEAD || step === SimulationStep.SECTION_OVERHEAD;
  const isHoActive = step === SimulationStep.SECTION_OVERHEAD || step === SimulationStep.FEC_CALCULATION;
  const isLineActive = step === SimulationStep.TRANSMISSION;

  // Ensure we have tributaries to render
  const tributaries = config.tributaries && config.tributaries.length > 0 
    ? config.tributaries 
    : [{ id: '1', type: config.clientSignal, color: 'bg-blue-500' }];

  // Calculate packet position percentage (approximate) for animation
  const getPacketPosition = () => {
    switch (step) {
      case SimulationStep.IDLE: return '100%';
      case SimulationStep.CLIENT_MAPPING: return '80%';
      case SimulationStep.PATH_OVERHEAD: return '60%';
      case SimulationStep.SECTION_OVERHEAD: return '40%';
      case SimulationStep.FEC_CALCULATION: return '25%';
      case SimulationStep.TRANSMISSION: return '5%';
      default: return '100%';
    }
  };

  return (
    <div className="w-full bg-slate-900 p-6 rounded-lg shadow-xl border border-slate-700 flex flex-col items-center min-h-[500px]">
      <div className="flex justify-between w-full mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-400" /> Digital Wrapper & Multiplexing
        </h3>
        <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div> Inactive
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div> Active Flow
            </div>
        </div>
      </div>

      {/* Main Diagram Container */}
      <div className="relative w-full max-w-lg flex-1 select-none flex flex-col justify-between py-4">
        
        {/* Layer 0: Optical Line System (Top) */}
        <div className="h-[15%] flex flex-col items-center justify-start z-20">
           <div className={`transition-all duration-500 flex flex-col items-center ${isLineActive ? 'opacity-100 scale-110' : 'opacity-60'}`}>
              <div className="relative">
                 <Zap className={`w-8 h-8 ${isLineActive ? 'text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-slate-600'}`} />
                 {isLineActive && <div className="absolute top-full left-1/2 -translate-x-1/2 text-red-400 text-xs font-bold whitespace-nowrap animate-pulse">λ 1550nm</div>}
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-2"></div>
           </div>
        </div>

        {/* Chassis / Device Box */}
        <div className="flex-1 bg-cyan-900/10 border-2 border-cyan-700/30 rounded-lg p-2 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
          
          {/* HO OTN Containers / OTU (Wrapper) */}
          <div className="relative h-[30%] w-full flex justify-center items-end pb-2 border-b border-cyan-500/10">
            <div className={`
              w-48 h-24 bg-yellow-100/10 border-2 border-yellow-200/50 rounded-lg flex flex-col items-center justify-between p-2 transition-all duration-500 relative
              ${isHoActive ? 'bg-yellow-100/20 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : ''}
            `}>
               {/* Wrapper Header */}
               <div className="w-full border-b border-yellow-200/30 pb-1 text-center">
                   <span className="text-xs font-bold text-yellow-100">OTU{config.oduLevel.slice(-1)} Wrapper</span>
               </div>
               
               {/* Payload Area showing Muxed Signals */}
               <div className="flex-1 w-full flex items-end justify-center gap-1 p-1">
                   {tributaries.map((trib) => (
                       <div key={trib.id} className={`
                          flex-1 rounded-t h-full opacity-30 transition-all duration-500
                          ${trib.color}
                          ${isHoActive ? 'opacity-80 h-full' : 'h-2'}
                       `}></div>
                   ))}
               </div>

               {step === SimulationStep.FEC_CALCULATION && (
                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-full border-l-2 border-green-400 bg-green-900/30 flex items-center justify-center">
                   <span className="text-[8px] font-bold text-green-400 -rotate-90">FEC</span>
                 </div>
               )}
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 w-20 text-right pr-2">
               High Order (HO) Wrapper
            </div>
          </div>

          {/* OTN Fabric / Switch / Multiplexer */}
          <div className="relative h-[20%] w-full flex items-center justify-center">
             <div className={`transition-all duration-500 flex items-center gap-4 ${isFabricActive ? 'scale-105 brightness-125' : 'opacity-60'}`}>
                {/* Visual Mux Representation */}
                <div className="w-10 h-10 border-2 border-slate-500 rounded rotate-45 flex items-center justify-center bg-slate-800">
                    <span className="text-[10px] text-slate-300 -rotate-45 font-bold">MUX</span>
                </div>
             </div>
             
             {/* Dynamic Lines from Fabric to HO */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <ArrowUp className={`text-yellow-500 transition-opacity duration-300 ${isFabricActive ? 'opacity-100 animate-bounce' : 'opacity-0'}`} size={16} />
             </div>
          </div>

          {/* LO OTN Containers */}
          <div className="relative h-[30%] w-full flex justify-center gap-2 items-start pt-2 border-t border-cyan-500/10">
            {tributaries.map((trib) => (
                <div key={trib.id} className={`
                  flex-1 max-w-[60px] h-20 bg-slate-800/50 border border-slate-600 rounded flex flex-col items-center justify-center transition-all duration-500 relative
                  ${isLoActive ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]' : ''}
                `}>
                   <div className={`w-full h-2 ${trib.color} absolute top-0 rounded-t opacity-80`}></div>
                   <span className="text-[9px] font-bold text-slate-300 mt-2">ODU-LO</span>
                   {isLoActive && <span className="text-[8px] text-yellow-400 animate-pulse">Mapping</span>}
                </div>
            ))}
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 w-20 text-right pr-2">
               Low Order (LO) ODUs
            </div>
          </div>

        </div>

        {/* Layer 2: Client Signals (Bottom) */}
        <div className="h-[15%] flex justify-center gap-2 mt-4">
           {tributaries.map((trib) => (
               <div key={trib.id} className="flex flex-col items-center gap-1 flex-1 max-w-[60px]">
                  <div className={`
                     w-full h-10 rounded bg-gradient-to-b from-slate-700 to-slate-800 border-b-4 border-slate-500 flex items-center justify-center shadow-lg transition-all duration-500
                     ${isClientActive ? `border-${trib.color.replace('bg-', '')} brightness-125` : 'opacity-60'}
                  `}>
                    <span className="text-[8px] font-bold text-white text-center leading-tight">{trib.type}</span>
                  </div>
                  <ArrowDown size={12} className={`text-slate-500 ${isClientActive ? 'text-white animate-bounce' : ''}`} />
               </div>
           ))}
        </div>

        {/* Moving Packets Animation */}
        {tributaries.map((trib, idx) => {
             // Calculate offset for multiple packets
             const total = tributaries.length;
             const centerOffset = (idx - (total - 1) / 2) * 40; 
             
             return (
                <div 
                  key={`pkt-${trib.id}`}
                  className={`absolute w-3 h-3 rounded-full ${trib.color} shadow-[0_0_5px_white] z-50 transition-all duration-[1000ms] ease-in-out`}
                  style={{ 
                     bottom: getPacketPosition(),
                     left: `calc(50% + ${centerOffset}px)`,
                     opacity: step === SimulationStep.IDLE ? 0 : 1,
                     transform: step === SimulationStep.TRANSMISSION ? `translateX(${-centerOffset}px)` : 'none' // Merge at top
                  }}
                >
                </div>
             )
        })}

      </div>
    </div>
  );
};

export default InternalFlowVisualizer;