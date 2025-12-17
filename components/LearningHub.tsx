import React, { useState } from 'react';
import { LEARNING_MODULES } from '../constants';
import { BookOpen, ChevronRight, Check, Layers, Cpu, Network, Grid3X3 } from 'lucide-react';
import { DiagramType } from '../types';

const LearningHub: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(LEARNING_MODULES[0].id);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const activeModule = LEARNING_MODULES.find(m => m.id === activeModuleId);

  const handleComplete = (id: string) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
    }
    const idx = LEARNING_MODULES.findIndex(m => m.id === id);
    if (idx < LEARNING_MODULES.length - 1) {
      setActiveModuleId(LEARNING_MODULES[idx + 1].id);
    }
  };

  const renderDiagram = (type: DiagramType) => {
    switch (type) {
      case 'LAYERS':
        return (
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 my-6 flex flex-col items-center">
            <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers size={16} /> Protocol Stack
            </h4>
            <div className="flex flex-col w-full max-w-md gap-1">
              <div className="h-12 bg-blue-600/20 border-2 border-blue-500 rounded flex items-center justify-center text-blue-300 font-bold">Client (Ethernet/SDH)</div>
              <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-slate-600"></div></div>
              
              <div className="h-16 bg-purple-600/20 border-2 border-purple-500 rounded flex flex-col items-center justify-center p-1">
                 <span className="text-purple-300 font-bold">OPU</span>
                 <span className="text-[10px] text-purple-400">Rate Adaptation & Mapping</span>
              </div>
              <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-slate-600"></div></div>

              <div className="h-16 bg-indigo-600/20 border-2 border-indigo-500 rounded flex flex-col items-center justify-center p-1">
                 <span className="text-indigo-300 font-bold">ODU</span>
                 <span className="text-[10px] text-indigo-400">Path Monitoring & TCM</span>
              </div>
              <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-slate-600"></div></div>

              <div className="h-16 bg-red-600/20 border-2 border-red-500 rounded flex flex-col items-center justify-center p-1">
                 <span className="text-red-300 font-bold">OTU</span>
                 <span className="text-[10px] text-red-400">Section Mon + FEC</span>
              </div>
              <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-slate-600"></div></div>

              <div className="h-12 bg-yellow-600/20 border-2 border-yellow-500 rounded flex items-center justify-center text-yellow-300 font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                OCh (Wavelength λ)
              </div>
            </div>
          </div>
        );

      case 'FRAME_MAP':
        return (
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 my-6">
             <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Grid3X3 size={16} /> Frame Overhead Map (Row 1-4, Col 1-16)
            </h4>
            <div className="grid grid-cols-14 gap-0.5 text-[8px] sm:text-[10px] font-mono text-center">
               {/* Header Row */}
               <div className="col-span-14 text-slate-500 mb-1">Columns 1-14 (Overhead Area)</div>
               
               {/* Row 1 */}
               <div className="col-span-6 bg-yellow-500 text-slate-900 font-bold py-2 rounded-sm">FAS</div>
               <div className="col-span-1 bg-yellow-600 text-white font-bold py-2 rounded-sm" title="Multi-Frame Alignment Signal">MFAS</div>
               <div className="col-span-7 bg-red-500 text-white font-bold py-2 rounded-sm" title="Section Monitoring">SM / GCC0</div>

               {/* Row 2 */}
               <div className="col-span-14 bg-blue-500/80 text-white py-2 rounded-sm border border-blue-400/50 mt-1">
                 ODU Overhead (TCM, PM)
               </div>
               
               {/* Row 3 */}
               <div className="col-span-14 bg-blue-500/80 text-white py-2 rounded-sm border border-blue-400/50 mt-1">
                 ODU Overhead (TCM, GCC1/2)
               </div>

               {/* Row 4 */}
               <div className="col-span-14 bg-blue-500/80 text-white py-2 rounded-sm border border-blue-400/50 mt-1">
                 ODU Overhead (APS/PCC)
               </div>

               {/* Legend */}
               <div className="col-span-14 flex gap-4 mt-2 justify-center text-xs text-slate-400">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500"></div> Frame Align</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500"></div> OTU OH</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> ODU OH</span>
               </div>
            </div>
          </div>
        );

      case 'MUX_TREE':
        return (
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 my-6 flex flex-col items-center">
            <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Network size={16} /> ODU Multiplexing Hierarchy
            </h4>
            <svg viewBox="0 0 400 200" className="w-full max-w-lg">
               {/* Lines */}
               <line x1="100" y1="150" x2="200" y2="80" stroke="#475569" strokeWidth="2" />
               <line x1="300" y1="150" x2="200" y2="80" stroke="#475569" strokeWidth="2" />
               <line x1="200" y1="80" x2="200" y2="40" stroke="#475569" strokeWidth="2" />

               {/* Nodes */}
               <rect x="160" y="10" width="80" height="30" rx="4" fill="#3b82f6" />
               <text x="200" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ODU2 (10G)</text>

               <rect x="60" y="150" width="80" height="30" rx="4" fill="#0ea5e9" />
               <text x="100" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ODU1 (2.5G)</text>
               <text x="100" y="190" textAnchor="middle" fill="#94a3b8" fontSize="10">Client A</text>

               <rect x="260" y="150" width="80" height="30" rx="4" fill="#0ea5e9" />
               <text x="300" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ODU1 (2.5G)</text>
               <text x="300" y="190" textAnchor="middle" fill="#94a3b8" fontSize="10">Client B</text>

               {/* Mux Label */}
               <circle cx="200" cy="80" r="15" fill="#1e293b" stroke="#64748b" />
               <text x="200" y="83" textAnchor="middle" fill="#cbd5e1" fontSize="8">MUX</text>
            </svg>
            <p className="text-xs text-slate-500 mt-2 text-center">4x ODU1 can be multiplexed into 1x ODU2</p>
          </div>
        );

      case 'FEC_BLOCK':
        return (
           <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 my-6">
            <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={16} /> RS(255, 239) Structure
            </h4>
            <div className="flex w-full h-16 rounded border border-slate-600 overflow-hidden">
               <div className="flex-[239] bg-blue-900/40 flex items-center justify-center border-r border-slate-600 relative group cursor-help">
                  <span className="text-blue-200 font-bold z-10">Data (K=239)</span>
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               <div className="flex-[16] bg-green-900/40 flex items-center justify-center relative group cursor-help">
                  <span className="text-green-200 font-bold text-xs z-10 rotate-0 whitespace-nowrap px-1">FEC (16)</span>
                  <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
               <span>Byte 1</span>
               <span>Byte 239</span>
               <span>Byte 255</span>
            </div>
            <p className="text-sm text-slate-400 mt-4 border-l-2 border-green-500 pl-3">
               The Reed-Solomon decoder calculates "Syndromes" based on this 255-byte block. If the syndromes are zero, the data is error-free. If non-zero, the math locates and fixes up to 8 errored bytes.
            </p>
           </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar List */}
      <div className="w-1/4 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-900 border-b border-slate-700">
           <h3 className="font-bold text-white flex items-center gap-2">
             <BookOpen size={18} className="text-blue-400" /> Modules
           </h3>
        </div>
        <div className="overflow-y-auto flex-1">
          {LEARNING_MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              className={`w-full text-left p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors flex justify-between items-center group
                ${activeModuleId === module.id ? 'bg-slate-700/50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}
              `}
            >
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full 
                  ${module.level === 'Basic' ? 'bg-green-900 text-green-300' : 
                    module.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                  {module.level}
                </span>
                <p className="mt-2 font-medium text-slate-200 group-hover:text-white">{module.title}</p>
              </div>
              {completedModules.includes(module.id) && <Check size={16} className="text-green-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-3/4 bg-slate-800 rounded-lg border border-slate-700 p-8 overflow-y-auto relative">
        {activeModule && (
          <div className="max-w-3xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-white mb-2">{activeModule.title}</h1>
            <p className="text-lg text-slate-400 mb-6 border-b border-slate-700 pb-4">{activeModule.description}</p>
            
            {/* Diagram Area */}
            {activeModule.diagramType && renderDiagram(activeModule.diagramType)}

            <div className="prose prose-invert max-w-none">
              {activeModule.content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('###')) return <h3 key={i} className="text-xl font-bold text-blue-300 mt-8 mb-4 border-b border-slate-700/50 pb-2">{trimmed.replace('###', '')}</h3>;
                if (trimmed.startsWith('1.')) return <div key={i} className="ml-4 mb-3 flex gap-3 p-2 rounded hover:bg-slate-700/30 transition-colors"><span className="font-bold text-blue-400 bg-blue-900/20 w-6 h-6 flex items-center justify-center rounded-full text-xs flex-shrink-0">{trimmed.substring(0,1)}</span><span className="text-slate-200">{trimmed.substring(2)}</span></div>;
                if (trimmed.startsWith('*')) return <li key={i} className="ml-6 text-slate-300 list-disc marker:text-blue-500 mb-2">{trimmed.replace('*', '')}</li>;
                if (trimmed === '') return <br key={i} />;
                return <p key={i} className="text-slate-300 leading-relaxed mb-4">{trimmed}</p>;
              })}
            </div>

            <div className="mt-8 flex justify-end">
               <button
                 onClick={() => handleComplete(activeModule.id)}
                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-transform active:scale-95 shadow-lg shadow-blue-900/20"
               >
                 Mark Complete <ChevronRight size={18} />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;