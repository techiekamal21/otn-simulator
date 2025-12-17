import React, { useState, useEffect, useRef } from 'react';
import { SimulationConfig, SimulationStep, SignalType, OduLevel, TributarySignal } from '../types';
import { Play, Pause, RotateCcw, Settings, CheckCircle, ShieldCheck, Layers, GitMerge, Plus, Trash2, Cpu, Gauge } from 'lucide-react';
import FrameVisualizer from './FrameVisualizer';
import InternalFlowVisualizer from './InternalFlowVisualizer';
import FecVisualizer from './FecVisualizer';

interface SimulationProps {
  config: SimulationConfig;
  updateConfig: (cfg: Partial<SimulationConfig>) => void;
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

const Simulation: React.FC<SimulationProps> = ({ config, updateConfig }) => {
  const [step, setStep] = useState<SimulationStep>(SimulationStep.IDLE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'FRAME' | 'FLOW'>('FLOW'); // Default to FLOW for mux demo
  const [showAdvanced, setShowAdvanced] = useState(false);
  const timerRef = useRef<number | null>(null);

  // FEC / BER State
  const [totalBits, setTotalBits] = useState(1); // Start with 1 to avoid divide by zero initially
  const [preFecErrors, setPreFecErrors] = useState(0);
  const [postFecErrors, setPostFecErrors] = useState(0);
  const [correctedErrors, setCorrectedErrors] = useState(0);

  // Ensure config has tributaries (for legacy configs loaded from local storage)
  useEffect(() => {
    if (!config.tributaries || config.tributaries.length === 0) {
      updateConfig({
        tributaries: [{ 
          id: '1', 
          type: config.clientSignal, 
          color: COLORS[0] 
        }]
      });
    }
  }, []);

  const getActiveSection = (s: SimulationStep) => {
    switch (s) {
      case SimulationStep.CLIENT_MAPPING: return 'Payload';
      case SimulationStep.PATH_OVERHEAD: return 'ODU OH';
      case SimulationStep.SECTION_OVERHEAD: return 'OTU OH';
      case SimulationStep.FEC_CALCULATION: return 'FEC';
      default: return null;
    }
  };

  const stepsOrder = [
    SimulationStep.IDLE,
    SimulationStep.CLIENT_MAPPING,
    SimulationStep.PATH_OVERHEAD,
    SimulationStep.SECTION_OVERHEAD,
    config.enableFec ? SimulationStep.FEC_CALCULATION : null,
    SimulationStep.TRANSMISSION
  ].filter((s): s is SimulationStep => s !== null);

  const resetSimulation = () => {
    setIsPlaying(false);
    setStep(SimulationStep.IDLE);
    // Reset Stats
    setTotalBits(1);
    setPreFecErrors(0);
    setPostFecErrors(0);
    setCorrectedErrors(0);

    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleInjectError = (type: 'SINGLE' | 'BURST') => {
    if (!config.enableFec) return;
    
    // Only allow meaningful error injection during Transmission or FEC phase
    // But for UX, we allow it anytime, and it just updates stats as if transmission occurred
    
    let errorAmount = 0;
    if (type === 'SINGLE') {
        errorAmount = 1;
    } else {
        // Random burst between 3 and 7 bytes
        errorAmount = Math.floor(Math.random() * 5) + 3; 
    }

    setPreFecErrors(prev => prev + errorAmount);
    
    // RS(255,239) can correct up to 8 bytes.
    // If we assume a "Block" context, < 8 errors are corrected.
    // Since we are just summing up errors over time, we simplify:
    // Single and small bursts are always corrected in this educational demo.
    setCorrectedErrors(prev => prev + errorAmount);
    
    // Optionally, if we wanted to simulate uncorrectable errors, we'd need a "Catastrophic" injection
    // setPostFecErrors(prev => ...);
  };

  const addTributary = () => {
    if ((config.tributaries?.length || 0) >= 4) return;
    const newTrib: TributarySignal = {
      id: Date.now().toString(),
      type: SignalType.ETHERNET_10G,
      color: COLORS[(config.tributaries?.length || 0) % COLORS.length]
    };
    updateConfig({ tributaries: [...(config.tributaries || []), newTrib] });
  };

  const removeTributary = (id: string) => {
    if ((config.tributaries?.length || 0) <= 1) return;
    updateConfig({ tributaries: config.tributaries.filter(t => t.id !== id) });
  };

  const updateTributaryType = (id: string, type: SignalType) => {
    updateConfig({
      tributaries: config.tributaries.map(t => t.id === id ? { ...t, type } : t)
    });
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        // Accumulate bits during transmission to make BER dynamic
        if (step === SimulationStep.TRANSMISSION) {
             setTotalBits(prev => prev + 1000000); // Add 1Mb per tick during transmission
        } else if (step !== SimulationStep.IDLE) {
             setTotalBits(prev => prev + 100000); // Add smaller amount during processing
        }

        setStep(currentStep => {
          const currentIndex = stepsOrder.indexOf(currentStep);
          // Loop logic: 
          // If not at end, go next.
          // If at end (Transmission), stay there until manually stopped or loop?
          // Let's loop back to Idle after some time in Transmission?
          // For now, let's keep the existing logic: Run once, then stop at Transmission.
          
          if (currentIndex < stepsOrder.length - 1) {
            return stepsOrder[currentIndex + 1];
          } else {
            // Reached Transmission
            // Stay in Transmission if playing, or stop?
            // To simulate continuous flow, we can loop back to Client Mapping?
            // Let's loop for continuous effect if user wants, but here we just stop auto-advance
            // to let user play with Error Injection.
            setIsPlaying(false); // Stop auto-advance
            return SimulationStep.TRANSMISSION;
          }
        });
      }, config.simulationSpeed);
    } else {
      // Even if paused, if we are in Transmission, keep adding bits? 
      // No, only when "running". But we might want to manually pulse bits.
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, step, config.simulationSpeed, config.enableFec]);

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Controls Header */}
      <div className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 flex flex-col gap-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-slate-900 shadow-lg`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button
              onClick={resetSimulation}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors shadow-lg"
            >
              <RotateCcw size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Status</span>
              <span className="text-lg font-mono text-blue-400">{step.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/50 p-2 rounded-lg px-4 border border-slate-700 flex-wrap">
             {/* Speed Control */}
             <div className="flex flex-col gap-1 w-32">
                <label className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold"><Gauge size={10} /> Speed ({config.simulationSpeed}ms)</label>
                <input 
                  type="range" 
                  min="200" 
                  max="3000" 
                  step="100"
                  value={config.simulationSpeed}
                  onChange={(e) => updateConfig({ simulationSpeed: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  title="Simulation Speed (ms per step)"
                />
                <div className="flex justify-between text-[8px] text-slate-600">
                   <span>Fast</span>
                   <span>Slow</span>
                </div>
             </div>
             
             <div className="w-px h-8 bg-slate-700 hidden sm:block"></div>

             <div>
              <label className="block text-xs text-slate-500 mb-1">Wrapper Level</label>
              <select
                value={config.oduLevel}
                onChange={(e) => updateConfig({ oduLevel: e.target.value as OduLevel })}
                className="bg-slate-800 border border-slate-600 text-xs rounded p-1 text-white"
              >
                {Object.values(OduLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
             <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">FEC</label>
              <input
                type="checkbox"
                checked={config.enableFec}
                onChange={(e) => updateConfig({ enableFec: e.target.checked })}
                className="toggle"
              />
            </div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded hover:bg-slate-700 transition-colors ${showAdvanced ? 'text-blue-400 bg-slate-800' : 'text-slate-400'}`}
              title="Advanced Multiplexing Controls"
            >
              <Cpu size={18} />
            </button>
          </div>
        </div>

        {/* Advanced Multiplexing Controls */}
        {showAdvanced && (
          <div className="bg-slate-900/80 p-4 rounded border border-slate-600 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <GitMerge size={16} /> Tributary Signals (Multiplexing)
              </h4>
              <button 
                onClick={addTributary}
                disabled={(config.tributaries?.length || 0) >= 4}
                className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-2 py-1 rounded"
              >
                <Plus size={12} /> Add Signal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {config.tributaries?.map((trib, idx) => (
                <div key={trib.id} className="bg-slate-800 p-2 rounded border border-slate-700 flex flex-col gap-2 relative group">
                  <div className={`h-1 w-full rounded-full ${trib.color}`}></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold">TS {idx + 1}</span>
                    {(config.tributaries?.length || 0) > 1 && (
                      <button onClick={() => removeTributary(trib.id)} className="text-slate-600 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <select 
                    value={trib.type}
                    onChange={(e) => updateTributaryType(trib.id, e.target.value as SignalType)}
                    className="w-full bg-slate-900 text-xs border border-slate-600 rounded p-1 text-slate-300"
                  >
                     {Object.values(SignalType).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Note: Simulating mapping of {(config.tributaries?.length || 1)} low-order signals into one High Order {config.oduLevel} wrapper.
            </p>
          </div>
        )}
      </div>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Process Flow & View Toggle */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex text-sm font-medium">
             <button 
               onClick={() => setViewMode('FRAME')}
               className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${viewMode === 'FRAME' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
             >
               <Layers size={16} /> Frame View
             </button>
             <button 
               onClick={() => setViewMode('FLOW')}
               className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${viewMode === 'FLOW' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
             >
               <GitMerge size={16} /> Signal Flow
             </button>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings size={18} /> Processing Pipeline
            </h3>
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700"></div>

              {stepsOrder.slice(1).map((s, idx) => (
                <div key={s} className="relative flex items-center gap-4 pl-0">
                  <div className={`
                    w-8 h-8 rounded-full z-10 flex items-center justify-center border-2 transition-all duration-500
                    ${stepsOrder.indexOf(step) >= idx + 1 
                      ? 'bg-blue-600 border-blue-400 text-white' 
                      : 'bg-slate-900 border-slate-600 text-slate-600'}
                  `}>
                    {stepsOrder.indexOf(step) > idx + 1 ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  <div className={`p-3 rounded border w-full transition-all duration-300 ${step === s ? 'bg-slate-700 border-blue-500 shadow-lg' : 'bg-slate-800/50 border-slate-700'}`}>
                    <p className="text-sm font-semibold text-slate-200">{s.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-400">
                      {s === SimulationStep.CLIENT_MAPPING && `Mapping ${config.tributaries?.length || 1} client(s) into OPU Payload.`}
                      {s === SimulationStep.PATH_OVERHEAD && 'Adding Path Overhead (TCM, PM) to LO ODU.'}
                      {s === SimulationStep.SECTION_OVERHEAD && 'Multiplexing LO ODUs into HO ODU & adding OTU Overhead.'}
                      {s === SimulationStep.FEC_CALCULATION && 'Calculating RS-FEC for the High Order Frame.'}
                      {s === SimulationStep.TRANSMISSION && 'Transmission of Colored Wavelength.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Frame Visualizer or Internal Flow */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          <div className="flex-1 min-h-[400px]">
            {viewMode === 'FRAME' ? (
              <FrameVisualizer activeSection={getActiveSection(step)} />
            ) : (
              <InternalFlowVisualizer step={step} config={config} />
            )}
            
            {/* FEC Visualizer moved to bottom of page */}
          </div>
          
          {/* Simulation Output / Console */}
          <div className="bg-slate-950 font-mono text-sm p-4 rounded-lg border border-slate-700 h-48 overflow-y-auto text-green-400 shadow-inner">
             <p className="text-slate-500">System Ready. Wrapper: {config.oduLevel}. Tributaries: {config.tributaries?.length || 1}.</p>
             {step !== SimulationStep.IDLE && (
               <>
                 <p>&gt; Initializing Pipeline...</p>
                 {stepsOrder.indexOf(step) >= 1 && <p>&gt; [OPU] GMP Mapping: Adapting {(config.tributaries?.length || 1)} client signals to LO ODU clock...</p>}
                 {stepsOrder.indexOf(step) >= 2 && <p>&gt; [ODU] Generating Path Overhead for LO ODUs...</p>}
                 {stepsOrder.indexOf(step) >= 3 && (
                   <>
                    <p>&gt; [MUX] Multiplexing LO ODUs into {config.oduLevel} Payload via Tributary Slots (TS)...</p>
                    <p>&gt; [OTU] Adding Section Overhead & Frame Alignment...</p>
                   </>
                 )}
                 {stepsOrder.indexOf(step) >= 4 && config.enableFec && <p>&gt; [FEC] Calculating RS(255,239) parity for the aggregate frame...</p>}
                 {stepsOrder.indexOf(step) >= 5 && (
                   <div className="mt-2 p-2 border border-green-800 bg-green-900/20 rounded">
                      <p className="font-bold text-white blink">&gt; TRANSMITTING WAVELENGTH...</p>
                      {config.enableFec && (
                        <div className="mt-2 text-yellow-400 flex flex-col gap-1">
                             <span className="flex items-center gap-1"><ShieldCheck size={14} /> Link Monitoring Active</span>
                             <span className="text-xs text-slate-400">Total Bits: {totalBits.toLocaleString()} | Errors: {preFecErrors}</span>
                        </div>
                      )}
                   </div>
                 )}
               </>
             )}
          </div>
        </div>
      </div>
      
      {/* ALWAYS VISIBLE FEC SECTION */}
      {config.enableFec && (
         <FecVisualizer 
           speed={config.simulationSpeed} 
           isProcessing={step === SimulationStep.FEC_CALCULATION} 
           errorStats={{ totalBits, preFecErrors, postFecErrors, correctedErrors }}
           onErrorInject={step === SimulationStep.TRANSMISSION ? handleInjectError : undefined}
         />
      )}
    </div>
  );
};

export default Simulation;