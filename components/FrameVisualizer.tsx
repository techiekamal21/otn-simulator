import React, { useState, useRef } from 'react';
import { FrameSection } from '../types';
import { FRAME_STRUCTURE } from '../constants';
import { Info, ZoomIn, ZoomOut, Maximize, Search, MousePointerClick, X } from 'lucide-react';

interface FrameVisualizerProps {
  activeSection?: string | null;
  onHoverSection?: (section: string | null) => void;
  showDetails?: boolean;
}

const FrameVisualizer: React.FC<FrameVisualizerProps> = ({ 
  activeSection, 
  onHoverSection,
  showDetails = true 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(1, Math.min(20, prev + delta));
      return newZoom;
    });
  };

  const handleSectionClick = (sectionName: string) => {
    setSelectedSection(prev => prev === sectionName ? null : sectionName);
  };

  // Priority: Hover > Selected > Prop Active
  const currentActive = hoveredSection || selectedSection || activeSection;

  return (
    <div className="w-full bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-700 flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Info size={18} /> OTN Frame Structure (4 Rows x 4080 Cols)
        </h3>
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700 shadow-sm">
           <button 
             onClick={() => handleZoom(-1)} 
             className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
             disabled={zoomLevel <= 1}
             title="Zoom Out"
           >
             <ZoomOut size={16} />
           </button>
           <span className="text-xs font-mono w-10 text-center text-slate-300 select-none">{zoomLevel}x</span>
           <button 
             onClick={() => handleZoom(1)} 
             className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
             disabled={zoomLevel >= 20}
             title="Zoom In"
           >
             <ZoomIn size={16} />
           </button>
           <div className="w-px h-4 bg-slate-700 mx-1"></div>
           <button 
             onClick={() => setZoomLevel(1)} 
             className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
             title="Reset Zoom"
           >
             <Maximize size={16} />
           </button>
        </div>
      </div>
      
      {/* Scrollable Viewport Wrapper */}
      <div 
        ref={scrollRef}
        className="relative w-full aspect-[4/1] bg-slate-900 border-2 border-slate-600 rounded overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 shadow-inner group/viewport"
        onMouseLeave={() => setHoveredSection(null)}
      >
        {/* Inner Content that scales width */}
        <div 
           className="h-full flex flex-col"
           style={{ width: `${zoomLevel * 100}%`, minWidth: '100%', transition: 'width 0.3s ease-out' }}
        >
          {[1, 2, 3, 4].map(row => (
            <div key={row} className="flex-1 flex w-full border-b border-slate-700 last:border-b-0">
              {FRAME_STRUCTURE.filter(s => s.rows.includes(row)).map((section, idx) => {
                const widthPercent = ((section.cols[1] - section.cols[0] + 1) / 4080) * 100;
                const isActive = currentActive === section.name;
                const isSelected = selectedSection === section.name;
                
                return (
                  <div
                    key={`${section.name}-${row}-${idx}`}
                    style={{ width: `${widthPercent}%` }}
                    className={`
                      relative h-full border-r border-slate-800 transition-all duration-200 cursor-pointer
                      ${section.color}
                      ${isActive ? 'opacity-100 brightness-110 saturate-150 z-10' : 'opacity-60 hover:opacity-90'}
                      ${isSelected ? 'ring-2 ring-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(section.name);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredSection(section.name);
                      if (onHoverSection) onHoverSection(section.name);
                    }}
                    onMouseMove={(e) => {
                      setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                  >
                    {/* Render text only if zoomed enough or section is wide */}
                    {(zoomLevel > 2 || widthPercent > 5) && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                         <span className="text-[9px] md:text-[10px] font-bold text-white drop-shadow-md whitespace-nowrap px-1 select-none">
                           {section.name}
                         </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Floating Tooltip */}
      {hoveredSection && !selectedSection && (
        <div 
          className="fixed pointer-events-none z-50 bg-slate-800/95 backdrop-blur text-white p-3 rounded shadow-2xl border border-slate-500 text-sm max-w-xs animate-fadeIn"
          style={{ 
            top: Math.min(mousePos.y + 20, window.innerHeight - 150), 
            left: Math.min(mousePos.x + 20, window.innerWidth - 250) 
          }}
        >
          {FRAME_STRUCTURE.filter(s => s.name === hoveredSection).map(s => (
            <div key={s.name}>
               <div className="flex items-center gap-2 mb-2">
                 <div className={`w-3 h-3 rounded-full ${s.color} ring-1 ring-white/50`}></div>
                 <span className="font-bold text-slate-100">{s.name}</span>
               </div>
               <p className="text-xs text-slate-300 mb-2 leading-relaxed">{s.description}</p>
               <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                 <MousePointerClick size={10} /> Click to lock details
               </div>
            </div>
          ))[0]}
        </div>
      )}

      {showDetails && (
        <div className="min-h-[120px] p-4 bg-slate-900 rounded border border-slate-700 transition-all shadow-inner relative overflow-hidden">
          {currentActive ? (
            FRAME_STRUCTURE.filter(s => s.name === currentActive).map(s => (
              <div key={s.name} className="animate-fadeIn flex flex-col md:flex-row items-start gap-6 relative z-10">
                 {/* Close button for selection */}
                 {selectedSection === s.name && (
                   <button 
                     onClick={() => setSelectedSection(null)}
                     className="absolute top-0 right-0 p-1 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors"
                     title="Clear Selection"
                   >
                     <X size={16} />
                   </button>
                 )}

                <div className={`mt-1 w-16 h-16 rounded-xl flex-shrink-0 ${s.color} shadow-lg ring-2 ring-white/10 flex items-center justify-center`}>
                  <Info className="text-white/90 drop-shadow-md" size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-xl">{s.name}</h4>
                    <span className="text-xs font-mono text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/30">
                      ID: {s.name.replace(/\s+/g, '_').toUpperCase()}
                    </span>
                    {selectedSection === s.name && (
                      <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                         <MousePointerClick size={10} /> Locked View
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed max-w-2xl border-l-2 border-slate-700 pl-3">
                    {s.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-slate-800 p-2 rounded border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Columns</span>
                        <span className="text-slate-200 font-mono text-sm">{s.cols[0]} - {s.cols[1]}</span>
                     </div>
                     <div className="bg-slate-800 p-2 rounded border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Rows</span>
                        <span className="text-slate-200 font-mono text-sm">{s.rows.join(', ')}</span>
                     </div>
                     <div className="bg-slate-800 p-2 rounded border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Size</span>
                        <span className="text-slate-200 font-mono text-sm">{(s.cols[1] - s.cols[0] + 1) * s.rows.length} Bytes</span>
                     </div>
                     <div className="bg-slate-800 p-2 rounded border border-slate-700/50">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Function</span>
                        <span className="text-slate-200 font-mono text-sm truncate">
                           {s.name.includes('OH') ? 'Management' : s.name.includes('FEC') ? 'Correction' : 'Transport'}
                        </span>
                     </div>
                  </div>
                </div>
              </div>
            ))[0]
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 py-4">
               <Search size={32} className="opacity-30" />
               <p className="text-slate-400 font-medium">No Section Selected</p>
               <p className="italic text-xs">Hover over the frame to inspect or click to lock details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrameVisualizer;