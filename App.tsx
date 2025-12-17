/**
 * OTN Simulator - Main Application Component
 * 
 * Copyright (c) 2025 OTN Simulator Contributors
 * Licensed under the MIT License - see LICENSE file for details
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Book, Activity, Share2, Save, Download, Menu, X } from 'lucide-react';
import { AppView, SimulationConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import Simulation from './components/Simulation';
import LearningHub from './components/LearningHub';
import NetworkTopology from './components/NetworkTopology';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load config on mount
  useEffect(() => {
    const saved = localStorage.getItem('otn_sim_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load config', e);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('otn_sim_config', JSON.stringify({ ...config, timestamp: Date.now() }));
    alert('Configuration saved to Local Storage!');
  };

  const updateConfig = (newCfg: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...newCfg }));
  };

  const NavItem = ({ view, label, icon: Icon }: { view: AppView; label: string; icon: any }) => (
    <button
      onClick={() => { setCurrentView(view); setMobileMenuOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left
        ${currentView === view 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">CodeByArt <span className="text-blue-500">OTN Simulator</span></h1>
            <p className="text-xs text-slate-500">v1.0.0 (Education)</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view={AppView.DASHBOARD} label="Overview" icon={LayoutDashboard} />
          <NavItem view={AppView.SIMULATION} label="Simulation" icon={Activity} />
          <NavItem view={AppView.LEARNING} label="Learning Hub" icon={Book} />
          <NavItem view={AppView.TOPOLOGY} label="Network Map" icon={Share2} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
           <div className="mb-4 space-y-2">
             <button onClick={handleSaveConfig} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white w-full p-2 hover:bg-slate-800 rounded">
               <Save size={14} /> Save Config
             </button>
             <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white w-full p-2 hover:bg-slate-800 rounded">
               <Download size={14} /> Export JSON
             </button>
           </div>
           <p className="text-[10px] text-slate-600 text-center">
             Designed by <a href="https://instagram.com/techiekamal" className="text-blue-500 hover:underline">techiekamal</a>
             <br />
             Dev by CodeByArt
           </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
           <h1 className="font-bold">CodeByArt OTN Simulator</h1>
           <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
             <Menu size={24} />
           </button>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 relative">
           {currentView === AppView.DASHBOARD && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
               <div className="text-center py-10">
                 <h2 className="text-4xl font-extrabold text-white mb-4">Welcome to CodeByArt OTN Simulator</h2>
                 <p className="text-slate-400 max-w-lg mx-auto">
                   Explore the Digital Wrapper technology. Learn how Client Signals are mapped, encapsulated, and transported over Optical Networks with real-time visualization.
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div onClick={() => setCurrentView(AppView.LEARNING)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors group">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                      <Book size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Learn OTN</h3>
                    <p className="text-sm text-slate-400">Structured modules covering Fundamentals, Frames, FEC, and Hierarchy.</p>
                 </div>
                 
                 <div onClick={() => setCurrentView(AppView.SIMULATION)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-green-500 transition-colors group">
                    <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                      <Activity size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Simulate</h3>
                    <p className="text-sm text-slate-400">Interactive frame encapsulation, overhead generation, and error correction demo.</p>
                 </div>

                 <div onClick={() => setCurrentView(AppView.TOPOLOGY)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-purple-500 transition-colors group">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                      <Share2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Topology</h3>
                    <p className="text-sm text-slate-400">Visualize network nodes, paths, and protection switching architectures.</p>
                 </div>
               </div>
             </div>
           )}

           {currentView === AppView.SIMULATION && (
             <Simulation config={config} updateConfig={updateConfig} />
           )}

           {currentView === AppView.LEARNING && (
             <LearningHub />
           )}

           {currentView === AppView.TOPOLOGY && (
             <NetworkTopology />
           )}
        </div>
      </main>
    </div>
  );
};

export default App;