/**
 * OTN Simulator - Type Definitions
 * 
 * Copyright (c) 2025 OTN Simulator Contributors
 * Licensed under the MIT License - see LICENSE file for details
 */

export enum SignalType {
  ETHERNET_1G = '1GbE',
  ETHERNET_10G = '10GbE',
  ETHERNET_100G = '100GbE',
  SDH_STM16 = 'STM-16',
  SDH_STM64 = 'STM-64',
  FC_1200 = 'FC-1200'
}

export enum OduLevel {
  ODU0 = 'ODU0',
  ODU1 = 'ODU1',
  ODU2 = 'ODU2',
  ODU3 = 'ODU3',
  ODU4 = 'ODU4'
}

export enum SimulationStep {
  IDLE = 'IDLE',
  CLIENT_MAPPING = 'CLIENT_MAPPING', // OPU
  PATH_OVERHEAD = 'PATH_OVERHEAD', // ODU
  SECTION_OVERHEAD = 'SECTION_OVERHEAD', // OTU
  FEC_CALCULATION = 'FEC_CALCULATION',
  TRANSMISSION = 'TRANSMISSION'
}

export interface TributarySignal {
  id: string;
  type: SignalType;
  color: string;
}

export interface SimulationConfig {
  id: string;
  name: string;
  clientSignal: SignalType; // Kept for backward compatibility/primary signal
  tributaries: TributarySignal[]; // New: Multiple signals
  oduLevel: OduLevel;
  enableFec: boolean;
  simulationSpeed: number; // ms delay
  timestamp: number;
}

export type DiagramType = 'LAYERS' | 'FRAME_MAP' | 'MUX_TREE' | 'FEC_BLOCK';

export interface LearningModuleData {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  description: string;
  content: string;
  diagramType?: DiagramType;
  externalLinks: { label: string; url: string }[];
}

export interface FrameSection {
  name: string;
  description: string;
  color: string;
  rows: number[];
  cols: number[]; // Simple representation [start, end]
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LEARNING = 'LEARNING',
  SIMULATION = 'SIMULATION',
  TOPOLOGY = 'TOPOLOGY'
}