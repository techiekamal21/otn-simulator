import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Activity, Play, Server, Radio, ArrowRight, Zap, RefreshCw, Box, Layers, Cpu, Cable, Network, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

// --- Data Definitions ---

interface NodeData {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'ROADM' | 'ILA' | 'TE'; // Reconfigurable OADM, In-Line Amp, Terminal Equipment
  description: string;
}

interface LinkData {
  source: string;
  target: string;
  distance: number; // km
  spanLoss: number; // dB
}

const NODES: NodeData[] = [
  { id: 'A', x: 100, y: 200, label: 'Mumbai (Gateway)', type: 'TE', description: 'Head-end Terminal. Contains 100G Transponders and Mux/Demux units.' },
  { id: 'B', x: 300, y: 100, label: 'Delhi (Core)', type: 'ROADM', description: 'CDC-ROADM Node. Optically switches wavelengths without OEO conversion.' },
  { id: 'C', x: 300, y: 300, label: 'Bangalore (Hub)', type: 'ROADM', description: 'CDC-ROADM Node. Major aggregation point for South traffic.' },
  { id: 'D', x: 500, y: 200, label: 'Chennai (Landing)', type: 'ROADM', description: 'Submarine Landing Station interconnect. Express path.' },
  { id: 'E', x: 700, y: 200, label: 'Kolkata (Metro)', type: 'TE', description: 'Tail-end Terminal. Drops signals to Metro Ethernet Network.' }
];

const LINKS: LinkData[] = [
  { source: 'A', target: 'B', distance: 1400, spanLoss: 22 },
  { source: 'A', target: 'C', distance: 980, spanLoss: 18 },
  { source: 'B', target: 'D', distance: 2100, spanLoss: 28 },
  { source: 'C', target: 'D', distance: 350, spanLoss: 9 },
  { source: 'D', target: 'E', distance: 1600, spanLoss: 24 }
];

// Defined trace path for simulation: Mumbai -> Delhi -> Chennai -> Kolkata
const TRACE_PATH = ['A', 'B', 'D', 'E'];

// Linear Sequence for the timeline view
const TIMELINE_STEPS = [
  { id: 'NODE_A', type: 'NODE', refId: 'A', label: 'Mumbai (Source)', subType: 'TE' },
  { id: 'LINK_AB', type: 'LINK', refId: 'A-B', label: 'Link: Mumbai → Delhi', subType: 'FIBER' },
  { id: 'NODE_B', type: 'NODE', refId: 'B', label: 'Delhi (Transit)', subType: 'ROADM' },
  { id: 'LINK_BD', type: 'LINK', refId: 'B-D', label: 'Link: Delhi → Chennai', subType: 'FIBER' },
  { id: 'NODE_D', type: 'NODE', refId: 'D', label: 'Chennai (Transit)', subType: 'ROADM' },
  { id: 'LINK_DE', type: 'LINK', refId: 'D-E', label: 'Link: Chennai → Kolkata', subType: 'FIBER' },
  { id: 'NODE_E', type: 'NODE', refId: 'E', label: 'Kolkata (Destination)', subType: 'TE' },
];

const NetworkTopology: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 representing path completion
  const [telemetry, setTelemetry] = useState({ power: -2, osnr: 28, ber: 0 });
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [progress]);

  // Animation Loop
  useEffect(() => {
    let interval: number;
    if (isSimulating) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 0;
          }
          return prev + 0.4; // Speed of simulation
        });

        // Update fake telemetry based on progress (simulating signal degradation)
        setTelemetry(prev => {
            // Power fluctuates between -2 and -15 dBm
            const newPower = -2 - (Math.random() * 2) - ((progress % 30) / 3); 
            // OSNR degrades over total distance
            const newOsnr = 28 - (progress / 5) + (Math.random());
            return {
                power: parseFloat(newPower.toFixed(1)),
                osnr: parseFloat(newOsnr.toFixed(1)),
                ber: progress > 80 ? 1.2e-4 : 0
            };
        });

      }, 50);
    }
    return () => clearInterval(interval);
  }, [isSimulating, progress]);

  // Determine current detailed stage based on progress
  const getSimulationState = () => {
    if (progress === 0) return { type: 'IDLE', activeStepId: null, detail: 'Waiting for simulation start' };
    
    // Logic to map progress % to TIMELINE_STEPS
    // Total steps = 7. Roughly 14.2% per step.
    // Let's refine intervals:
    // A: 0-10
    // A-B: 10-30
    // B: 30-45
    // B-D: 45-65
    // D: 65-75
    // D-E: 75-90
    // E: 90-100

    if (progress < 10) return { 
        type: 'NODE', activeStepId: 'NODE_A', 
        detail: 'Encapsulating Ethernet -> ODU4 -> OTU4 Frame. Adding FEC overhead.',
        subStage: 'MAPPING'
    };
    if (progress < 30) return { 
        type: 'LINK', activeStepId: 'LINK_AB',
        detail: 'Long Haul Transmission (1400km). Signal passes through EDFA Amplifiers.',
        subStage: 'TRANSMISSION'
    };
    if (progress < 45) return { 
        type: 'NODE', activeStepId: 'NODE_B',
        detail: 'Wavelength Selective Switch (WSS) routes λ to Chennai port without OEO.',
        subStage: 'SWITCHING'
    };
    if (progress < 65) return { 
        type: 'LINK', activeStepId: 'LINK_BD',
        detail: 'Ultra Long Haul (2100km). Coherent detection handles chromatic dispersion.',
        subStage: 'TRANSMISSION'
    };
    if (progress < 75) return { 
        type: 'NODE', activeStepId: 'NODE_D',
        detail: 'Express path switching. Dropping/Adding local wavelengths if configured.',
        subStage: 'SWITCHING'
    };
    if (progress < 90) return { 
        type: 'LINK', activeStepId: 'LINK_DE',
        detail: 'Final Span (1600km). Signal entering metro network.',
        subStage: 'TRANSMISSION'
    };
    return { 
        type: 'NODE', activeStepId: 'NODE_E',
        detail: 'DSP signal recovery. FEC corrects errors. De-mapping to client port.',
        subStage: 'DEMAPPING'
    };
  };

  const simState = getSimulationState();

  // Helper to calculate position of packet along the specific path A->B->D->E for Map
  const getPacketPosition = () => {
    const p = progress;
    let startNodeId = '', endNodeId = '', localP = 0;

    if (p < 10) return NODES.find(n => n.id === 'A') || { x: 0, y: 0 }; 
    if (p < 30) { startNodeId = 'A'; endNodeId = 'B'; localP = (p - 10) / 20; }
    else if (p < 45) { return NODES.find(n => n.id === 'B') || { x: 0, y: 0 }; }
    else if (p < 65) { startNodeId = 'B'; endNodeId = 'D'; localP = (p - 45) / 20; }
    else if (p < 75) { return NODES.find(n => n.id === 'D') || { x: 0, y: 0 }; }
    else if (p < 90) { startNodeId = 'D'; endNodeId = 'E'; localP = (p - 75) / 15; }
    else { return NODES.find(n => n.id === 'E') || { x: 0, y: 0 }; }

    const start = NODES.find(n => n.id === startNodeId);
    const end = NODES.find(n => n.id === endNodeId);
    if (!start || !end) return { x: 0, y: 0 };

    return {
      x: start.x + (end.x - start.x) * localP,
      y: start.y + (end.y - start.y) * localP
    };
  };

  const packetPos = getPacketPosition();

  // --- Sub-components for Internal Views ---

  const renderTerminalInternal = (isSource: boolean) => (
      <div className="flex items-center gap-1 h-full w-full px-4 relative py-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 mb-1 font-bold">Client</span>
              <div className={`w-12 h-16 rounded border-2 flex items-center justify-center ${isSource ? 'bg-blue-900/40 border-blue-500' : 'bg-green-900/40 border-green-500'}`}>
                 <Cable size={20} className={isSource ? 'text-blue-400' : 'text-green-400'} />
              </div>
          </div>
          
          <ArrowRight size={16} className={`text-slate-600 ${isSimulating ? 'text-yellow-500 animate-pulse' : ''}`} />

          <div className="flex-1 h-20 bg-slate-800 rounded border border-slate-600 p-2 flex flex-col justify-center gap-1 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/20"></div>
             <span className="text-[10px] text-slate-500 uppercase font-bold text-center">{isSource ? 'Tx Transponder' : 'Rx Transponder'}</span>
             <div className="flex gap-1 h-8">
                 {isSource ? (
                     <>
                        <div className="flex-1 bg-blue-500/20 rounded flex items-center justify-center text-[8px]">MAP</div>
                        <div className="flex-1 bg-purple-500/20 rounded flex items-center justify-center text-[8px]">OTU</div>
                        <div className="flex-1 bg-green-500/20 rounded flex items-center justify-center text-[8px]">FEC</div>
                        <div className="flex-1 bg-red-500/20 rounded flex items-center justify-center text-[8px]">DSP</div>
                     </>
                 ) : (
                    <>
                        <div className="flex-1 bg-red-500/20 rounded flex items-center justify-center text-[8px]">ADC</div>
                        <div className="flex-1 bg-green-500/20 rounded flex items-center justify-center text-[8px]">FEC</div>
                        <div className="flex-1 bg-purple-500/20 rounded flex items-center justify-center text-[8px]">DEMAP</div>
                     </>
                 )}
             </div>
          </div>

          <ArrowRight size={16} className={`text-slate-600 ${isSimulating ? 'text-yellow-500 animate-pulse' : ''}`} />

          <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 mb-1 font-bold">Line</span>
              <div className="w-12 h-16 rounded border-2 border-yellow-600 bg-yellow-900/20 flex items-center justify-center">
                 <Zap size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
          </div>
      </div>
  );

  const renderRoadmInternal = () => (
    <div className="flex items-center gap-2 h-full w-full px-4 py-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="w-10 h-14 bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-center">
            <span className="text-[8px] text-slate-400">Pre-Amp</span>
            <Activity size={12} className="text-yellow-500" />
        </div>
        
        <ArrowRight size={12} className="text-slate-600" />

        <div className="flex-1 h-24 bg-indigo-900/20 border border-indigo-500/50 rounded flex flex-col items-center justify-center relative p-2">
             <span className="text-[10px] text-indigo-300 font-bold mb-2">WSS (Switching Fabric)</span>
             <div className="flex w-full justify-between items-center px-4">
                 <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></div>
                 <div className="h-0.5 bg-yellow-500/50 flex-1 mx-2"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
             </div>
             <span className="text-[8px] text-slate-400 mt-2">Pass-through λ 193.10</span>
        </div>

        <ArrowRight size={12} className="text-slate-600" />

        <div className="w-10 h-14 bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-center">
            <span className="text-[8px] text-slate-400">Post-Amp</span>
            <Activity size={12} className="text-yellow-500" />
        </div>
    </div>
  );

  const renderFiberLink = () => (
      <div className="flex items-center h-full w-full px-8 relative overflow-hidden py-6 bg-slate-900/50 rounded-lg border border-slate-700">
          {/* Animated Fiber Core */}
          <div className="absolute left-0 right-0 h-1 bg-slate-700 top-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 right-0 h-0.5 bg-blue-500/50 top-1/2 -translate-y-1/2 animate-pulse"></div>
          
          {/* Moving Packet */}
          <div className="absolute top-1/2 -translate-y-1/2 w-32 h-8 bg-yellow-500/10 border border-yellow-500/50 rounded blur-[2px] animate-[slideRight_1s_linear_infinite]"></div>
          
          {/* Repeater/Amp Icons */}
          <div className="flex-1 flex justify-evenly z-10">
              {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 bg-slate-900 border border-slate-500 rounded-full flex items-center justify-center shadow-lg">
                      <Activity size={14} className="text-green-500" />
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Top Section: Map & Topology */}
      <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col min-h-[400px] shadow-lg">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-400" size={18} /> National Optical Backbone
          </h3>
          <div className="flex gap-4">
             {!isSimulating ? (
               <button 
                onClick={() => { setProgress(0); setIsSimulating(true); }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
               >
                 <Play size={14} /> Simulate Traffic Trace
               </button>
             ) : (
                <div className="flex items-center gap-2 bg-slate-700 text-green-400 px-3 py-1 rounded text-sm font-mono border border-green-500/30 animate-pulse">
                  <RefreshCw size={14} className="animate-spin" /> Tracing Path...
                </div>
             )}
             <div className="w-px h-6 bg-slate-600"></div>
             <div className="flex gap-1">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ZoomOut size={16} /></button>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ZoomIn size={16} /></button>
             </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-slate-950 grid-bg">
          <svg className="w-full h-full" viewBox="0 0 800 400">
            <defs>
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g transform={`scale(${zoom})`} style={{ transformOrigin: 'center' }}>
              {/* Links */}
              {LINKS.map((link, idx) => {
                const start = NODES.find(n => n.id === link.source)!;
                const end = NODES.find(n => n.id === link.target)!;
                // Highlight active link
                let isActiveLink = false;
                if (isSimulating) {
                   if (progress < 30 && link.source === 'A' && link.target === 'B') isActiveLink = true;
                   if (progress >= 30 && progress < 65 && link.source === 'B' && link.target === 'D') isActiveLink = true;
                   if (progress >= 65 && link.source === 'D' && link.target === 'E') isActiveLink = true;
                }

                return (
                  <g key={idx}>
                    <line
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke={isActiveLink ? '#eab308' : '#334155'}
                      strokeWidth={isActiveLink ? 4 : 2}
                      className="transition-all duration-300"
                      strokeDasharray={isActiveLink ? "5,5" : "0"}
                    />
                    <text x={(start.x + end.x)/2} y={(start.y + end.y)/2 - 8} fill="#64748b" fontSize="8" textAnchor="middle">{link.distance}km</text>
                  </g>
                );
              })}

              {/* Simulation Packet */}
              {isSimulating && (typeof packetPos === 'object') && (
                <g transform={`translate(${packetPos.x}, ${packetPos.y})`}>
                   <circle r="12" fill="#eab308" className="animate-ping opacity-50" />
                   <circle r="6" fill="#facc15" stroke="white" strokeWidth="2" />
                </g>
              )}

              {/* Nodes */}
              {NODES.map(node => {
                 const isActiveTraceNode = simState.activeStepId?.startsWith(`NODE_${node.id}`);
                 const isSelected = selectedNode === node.id;
                 
                 return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: isSelected || !selectedNode ? 1 : 0.5 }}
                  >
                    <rect 
                      x={node.x - 24} y={node.y - 18} 
                      width="48" height="36" 
                      rx="4"
                      fill={isActiveTraceNode ? '#22c55e' : isSelected ? '#3b82f6' : '#1e293b'}
                      stroke={isActiveTraceNode ? '#86efac' : isSelected ? '#93c5fd' : '#64748b'}
                      strokeWidth={isActiveTraceNode ? 3 : 2}
                    />
                    {node.type === 'ROADM' ? (
                        <g transform={`translate(${node.x-8}, ${node.y-8})`}>
                            <Network size={16} color="white" />
                        </g>
                    ) : (
                        <g transform={`translate(${node.x-8}, ${node.y-8})`}>
                            <Server size={16} color="white" />
                        </g>
                    )}
                    <text
                      x={node.x}
                      y={node.y + 30}
                      textAnchor="middle"
                      fill={isActiveTraceNode ? '#4ade80' : "#cbd5e1"}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          {/* Node Details Popup (code same as before) omitted for brevity as selection logic holds */}
          {selectedNode && (
            <div className="absolute top-4 right-4 w-72 bg-slate-900/95 backdrop-blur border border-slate-600 rounded-lg shadow-2xl animate-slideIn">
               <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-lg">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Server size={14} /> {NODES.find(n => n.id === selectedNode)?.label}
                  </h4>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">✕</button>
               </div>
               <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-slate-600 pl-2">
                     {NODES.find(n => n.id === selectedNode)?.description}
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Vertical Signal Flow Timeline */}
      <div className="flex flex-col bg-slate-900 rounded-lg border border-slate-700 shadow-xl max-h-[600px] flex-1">
        {/* Header Bar */}
        <div className="h-12 bg-slate-800 border-b border-slate-700 px-4 flex items-center justify-between flex-shrink-0">
             <div className="flex items-center gap-3">
                <Radio className={`text-green-400 ${isSimulating ? 'animate-pulse' : ''}`} size={16} /> 
                <span className="font-bold text-sm text-white">Path Trace & Signal Analysis</span>
             </div>
             
             {isSimulating && (
                 <div className="flex items-center gap-4 text-xs font-mono">
                     <div className="flex flex-col items-end">
                         <span className="text-slate-400">Power</span>
                         <span className="text-green-400 font-bold">{telemetry.power} dBm</span>
                     </div>
                     <div className="w-px h-6 bg-slate-700"></div>
                     <div className="flex flex-col items-end">
                         <span className="text-slate-400">OSNR</span>
                         <span className="text-blue-400 font-bold">{telemetry.osnr} dB</span>
                     </div>
                     <div className="w-px h-6 bg-slate-700"></div>
                     <div className="flex flex-col items-end">
                         <span className="text-slate-400">BER</span>
                         <span className={`font-bold ${telemetry.ber > 1e-3 ? 'text-red-500' : 'text-yellow-400'}`}>
                             {telemetry.ber === 0 ? '< 1e-12' : telemetry.ber.toExponential(2)}
                         </span>
                     </div>
                 </div>
             )}
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
            {!isSimulating && (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                    <Activity size={48} className="opacity-20 mb-2" />
                    <p>Start simulation to trace signal flow.</p>
                </div>
            )}

            {TIMELINE_STEPS.map((step, idx) => {
                const isActive = simState.activeStepId === step.id;
                // Check if step is passed
                const stepIndex = TIMELINE_STEPS.findIndex(s => s.id === simState.activeStepId);
                const isPassed = stepIndex > idx || (stepIndex === -1 && progress === 100);

                return (
                    <div 
                        key={step.id} 
                        ref={isActive ? activeStepRef : null}
                        className={`border rounded-lg transition-all duration-300 ${isActive ? 'bg-slate-800 border-yellow-500 shadow-md ring-1 ring-yellow-500/20' : isPassed ? 'bg-slate-900/50 border-green-900/50' : 'bg-slate-900/30 border-slate-800'}`}
                    >
                        {/* Accordion Header */}
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-yellow-500 text-slate-900' : isPassed ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    {isPassed ? <CheckCircle2 size={14} /> : idx + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${isActive ? 'text-white' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
                                    <span className="text-[10px] text-slate-500 uppercase">{step.subType}</span>
                                </div>
                            </div>
                            
                            {isActive && (
                                <div className="flex items-center gap-2 text-[10px] text-yellow-400 font-mono animate-pulse">
                                    <Activity size={12} /> Processing...
                                </div>
                            )}
                            
                            {isActive ? <ChevronDown size={16} className="text-yellow-500" /> : <ChevronRight size={16} className="text-slate-600" />}
                        </div>

                        {/* Expanded Detail View */}
                        {isActive && (
                            <div className="border-t border-slate-700 bg-black/20 p-4 animate-fadeIn">
                                <div className="mb-3 text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                                    &gt; LOG: {simState.detail}
                                </div>
                                
                                <div className="h-40 relative">
                                    {step.id === 'NODE_A' && renderTerminalInternal(true)}
                                    {step.id === 'NODE_E' && renderTerminalInternal(false)}
                                    {(step.id === 'NODE_B' || step.id === 'NODE_D') && renderRoadmInternal()}
                                    {step.type === 'LINK' && renderFiberLink()}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;