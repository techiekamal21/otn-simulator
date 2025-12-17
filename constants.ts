/**
 * OTN Simulator - Application Constants
 * 
 * Copyright (c) 2025 OTN Simulator Contributors
 * Licensed under the MIT License - see LICENSE file for details
 */

import { FrameSection, LearningModuleData, OduLevel, SignalType } from './types';

export const DEFAULT_CONFIG = {
  id: 'default',
  name: 'New Simulation',
  clientSignal: SignalType.ETHERNET_10G,
  tributaries: [
    { id: '1', type: SignalType.ETHERNET_10G, color: 'bg-blue-500' }
  ],
  oduLevel: OduLevel.ODU2,
  enableFec: true,
  simulationSpeed: 1000,
  timestamp: Date.now()
};

export const FRAME_STRUCTURE: FrameSection[] = [
  {
    name: 'FAS',
    description: 'Frame Alignment Signal. Bytes 1-6 in Row 1. Used for synchronization.',
    color: 'bg-yellow-500',
    rows: [1],
    cols: [1, 6]
  },
  {
    name: 'OTU OH',
    description: 'Optical Transport Unit Overhead. Bytes 7-14 in Row 1. Manages section monitoring.',
    color: 'bg-red-500',
    rows: [1],
    cols: [7, 14]
  },
  {
    name: 'ODU OH',
    description: 'Optical Data Unit Overhead. Columns 1-14 in Rows 2-4. End-to-end path monitoring.',
    color: 'bg-blue-500',
    rows: [2, 3, 4],
    cols: [1, 14]
  },
  {
    name: 'OPU OH',
    description: 'Optical Payload Unit Overhead. Columns 15-16 in Rows 1-4. Mapping information.',
    color: 'bg-purple-500',
    rows: [1, 2, 3, 4],
    cols: [15, 16]
  },
  {
    name: 'Payload',
    description: 'Client Data Payload area (3808 columns).',
    color: 'bg-slate-400',
    rows: [1, 2, 3, 4],
    cols: [17, 3824]
  },
  {
    name: 'FEC',
    description: 'Forward Error Correction. Reed-Solomon parity bytes.',
    color: 'bg-green-500',
    rows: [1, 2, 3, 4],
    cols: [3825, 4080]
  }
];

export const LEARNING_MODULES: LearningModuleData[] = [
  {
    id: 'otn-layers',
    title: '1. OTN Layer Hierarchy',
    level: 'Basic',
    description: 'Understanding the electrical (digital) and photonic layers of the ITU-T G.709 standard.',
    diagramType: 'LAYERS',
    content: `
      ### The Digital Wrapper Concept
      OTN wraps client signals in a digital container to ensure transparent transport. This happens in layers, similar to the OSI model, but specific to optical networking.

      ### Electrical Layers (Digital)
      1.  **OPU (Optical Payload Unit)**: The first layer. It adapts the client signal (e.g., Ethernet, SONET/SDH) into the OTN domain. It handles rate adaptation (justification) and maps the client into the payload area.
      2.  **ODU (Optical Data Unit)**: The "heart" of OTN. It adds path-level monitoring, Tandem Connection Monitoring (TCM), and protection switching. This is the layer that is cross-connected in OTN switches.
      3.  **OTU (Optical Transport Unit)**: The physical interface layer. It adds Section Monitoring (SM) and Forward Error Correction (FEC) to the ODU to ensure signal integrity over the fiber link.

      ### Photonic Layers (Optical)
      Below the OTU, the signal enters the photonic domain:
      *   **OCh (Optical Channel)**: The individual wavelength (lambda).
      *   **OMS (Optical Multiplex Section)**: A group of wavelengths (DWDM).
      *   **OTS (Optical Transmission Section)**: The physical fiber link between two amplifiers or nodes.
    `,
    externalLinks: [
      { label: 'ITU-T G.709 Standard', url: 'https://www.itu.int/rec/T-REC-G.709/en' },
      { label: 'Wikipedia: Optical Transport Network', url: 'https://en.wikipedia.org/wiki/Optical_Transport_Network' }
    ]
  },
  {
    id: 'otn-frame-advanced',
    title: '2. Advanced Frame Structure',
    level: 'Intermediate',
    description: 'Detailed analysis of Overhead bytes: FAS, MFAS, SM, PM, TCM, and GCC.',
    diagramType: 'FRAME_MAP',
    content: `
      ### The Coordinate System
      The OTN frame is a matrix of 4 Rows x 4080 Columns. The frame repetition rate is frequency-dependent (e.g., approx 48 microseconds for OTU2).

      ### Key Overhead Areas
      *   **FAS (Frame Alignment Signal)**: Bytes 1-6 of Row 1. Pattern: F6 F6 F6 28 28 28. Allows the receiver to find the start of the frame.
      *   **MFAS (Multi-Frame Alignment Signal)**: Byte 7 of Row 1. Counts from 0-255. Used to sequence 256 frames together, essential for mapping low-speed signals into high-speed containers.
      *   **SM (Section Monitoring)**: Part of OTU OH. Contains BIP-8 for error counting on the link section.
      *   **PM (Path Monitoring)**: Part of ODU OH. End-to-end error monitoring.
      *   **TCM (Tandem Connection Monitoring)**: 6 levels (TCM1-TCM6). Allows network operators to monitor specific segments of a path (e.g., when passing through a leased network).
      *   **GCC (General Communication Channel)**: GCC0/1/2. Side-channels used for management communication between nodes without using client bandwidth.
    `,
    externalLinks: [
      { label: 'Ciena: OTN Frame Explained', url: 'https://www.ciena.com/insights/what-is/What-is-OTN.html' }
    ]
  },
  {
    id: 'otn-mux-mapping',
    title: '3. Multiplexing & Mapping',
    level: 'Advanced',
    description: 'AMP, BMP, GMP mapping procedures and the ODU Multiplexing Hierarchy.',
    diagramType: 'MUX_TREE',
    content: `
      ### Mapping Procedures
      How do we fit a client signal into an OPU payload?
      1.  **BMP (Bit-synchronous Mapping Procedure)**: Used when client and OTN clocks are identical. Simple, no stuffing.
      2.  **AMP (Asynchronous Mapping Procedure)**: Uses positive/negative stuffing bytes to adjust for small clock differences. Used in legacy ODU1/2/3.
      3.  **GMP (Generic Mapping Procedure)**: The modern standard for ODU4 and ODUflex. It uses a mathematical algorithm to evenly distribute data and stuff bytes. Supports any client rate.

      ### ODU Multiplexing Hierarchy
      OTN allows lower-speed "Low Order" (LO) ODUs to be multiplexed into higher-speed "High Order" (HO) ODUs.
      *   **Tributary Slots (TS)**: The HO OPU payload is divided into 1.25G or 2.5G slots.
      *   **Example**: An ODU2 (10G) payload is divided into tributary slots. It can carry:
          *   4 x ODU1 (2.5G each)
          *   8 x ODU0 (1.25G each)
          *   A mix of ODU0 and ODU1.
      
      This strictly hierarchical TDM approach guarantees bandwidth and latency, unlike packet switching.
    `,
    externalLinks: [
      { label: 'Infinera: ODU Multiplexing', url: 'https://www.infinera.com/optical-transport-network-otn' }
    ]
  },
  {
    id: 'otn-fec-deep',
    title: '4. FEC & Coding Gain',
    level: 'Advanced',
    description: 'Reed-Solomon RS(255,239) algorithm, Coding Gain, and Hard vs. Soft Decision FEC.',
    diagramType: 'FEC_BLOCK',
    content: `
      ### Forward Error Correction (FEC)
      FEC allows the receiver to detect and correct bit errors caused by noise (OSNR), dispersion (CD/PMD), and non-linearities.

      ### Standard G.709 FEC: RS(255, 239)
      *   **Block Size (N)**: 255 bytes.
      *   **Data Size (K)**: 239 bytes.
      *   **Parity Size (R)**: 16 bytes.
      *   **Correction Capability**: Up to 8 errored bytes per block can be corrected.
      *   **Interleaving**: OTN interleaves 16 byte-streams to disperse burst errors (like a scratch on a disk) across multiple FEC blocks, making them correctable.

      ### Coding Gain
      The improvement in signal quality provided by FEC, measured in dB.
      *   **GFEC (Standard)**: ~6.2 dB gain.
      *   **EFEC (Enhanced)**: Proprietary algorithms (Hard/Soft Decision) offering 8-11 dB gain.
      
      High coding gain allows signals to travel ultra-long distances (e.g., Trans-Atlantic) without regeneration.
    `,
    externalLinks: [
      { label: 'Nokia: Optical Networking Fundamentals', url: 'https://www.nokia.com/networks/insights/' }
    ]
  }
];