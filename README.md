# 🌐 OTN Simulator

<div align="center">

![OTN Simulator Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

**An interactive Optical Transport Network (OTN) simulator for learning and visualizing telecommunications protocols**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)

[Live Demo](#) • [Documentation](#features) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About

The **OTN Simulator** is an educational tool designed to help network engineers, students, and telecommunications professionals understand the complex processes involved in Optical Transport Networks. It provides interactive visualizations of:

- **OTN Frame Structure** (OPU, ODU, OTU layers)
- **Forward Error Correction (FEC)** mechanisms
- **Network Topology** and signal flow
- **Multiplexing** and demultiplexing operations
- **Real-time simulation** of data transmission

This simulator was built to bridge the gap between theoretical knowledge and practical understanding of OTN protocols.

---

## ✨ Features

### 🔬 Interactive Simulations
- **Step-by-step visualization** of OTN frame construction
- **Real-time monitoring** of signal processing stages
- **Configurable parameters** for different OTN scenarios

### 📊 Visual Components
- **Frame Visualizer**: See OPU, ODU, OTU, and FEC layers
- **Network Topology**: Interactive network diagram with signal flow
- **FEC Visualizer**: Understand error correction in action
- **Internal Flow**: Deep dive into multiplexing operations

### 🎓 Learning Hub
- Built-in educational content
- Explanations of OTN concepts
- Interactive tutorials

### ⚙️ Customization
- Multiple ODU levels (ODU0, ODU1, ODU2, ODU3, ODU4)
- Configurable tributary signals
- FEC enable/disable options
- Adjustable simulation speed

---

## 🎬 Demo

### Screenshots

**Main Simulation Interface**
![Simulation Interface](docs/screenshots/simulation.png)

**Network Topology View**
![Network Topology](docs/screenshots/topology.png)

**FEC Visualization**
![FEC Visualizer](docs/screenshots/fec.png)

> **Note**: Add screenshots to `docs/screenshots/` folder

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v8+
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/otn-simulator.git
   cd otn-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running Locally

**Development Mode**
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000/
- **Network**: http://[your-ip]:3000/

**Production Build**
```bash
npm run build
npm run preview
```

---

## 🌐 Deployment

### Automated Deployment with GitHub Actions

This project includes automated deployment workflows for popular platforms.

#### Deploy to GitHub Pages

1. **Enable GitHub Pages** in your repository settings
2. **Push to main branch** - deployment happens automatically
3. **Access your site** at `https://yourusername.github.io/otn-simulator/`

#### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/otn-simulator)

1. Click the button above or push to main branch
2. Vercel will automatically detect Vite and deploy

#### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/otn-simulator)

1. Click the button above
2. Connect your GitHub repository
3. Netlify will auto-deploy on every push

### Manual Deployment

**Build for production:**
```bash
npm run build
```

The `dist/` folder contains your production-ready files. Upload to any static hosting service:
- GitHub Pages
- Vercel
- Netlify
- AWS S3
- Azure Static Web Apps
- Google Cloud Storage

---

## 📁 Project Structure

```
otn-simulator/
├── components/              # React components
│   ├── FecVisualizer.tsx   # FEC visualization component
│   ├── FrameVisualizer.tsx # OTN frame structure display
│   ├── InternalFlowVisualizer.tsx # Multiplexing flow
│   ├── LearningHub.tsx     # Educational content
│   ├── NetworkTopology.tsx # Network diagram
│   └── Simulation.tsx      # Main simulation controller
├── .github/
│   └── workflows/          # CI/CD automation
│       ├── deploy-pages.yml
│       ├── deploy-vercel.yml
│       └── deploy-netlify.yml
├── docs/                   # Documentation (gitignored)
├── dist/                   # Build output (gitignored)
├── App.tsx                 # Root application component
├── constants.ts            # Application constants
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── .env.local              # Environment variables (gitignored)
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## 🛠️ Technologies Used

### Frontend
- **[React 19.2.3](https://reactjs.org/)** - UI library
- **[TypeScript 5.8.2](https://www.typescriptlang.org/)** - Type safety
- **[Vite 6.2.0](https://vitejs.dev/)** - Build tool and dev server
- **[Lucide React](https://lucide.dev/)** - Icon library

### Development Tools
- **[ESBuild](https://esbuild.github.io/)** - Fast bundler
- **[Node.js 18+](https://nodejs.org/)** - Runtime environment

### Deployment
- **GitHub Actions** - CI/CD automation
- **Vercel / Netlify / GitHub Pages** - Hosting platforms

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure no sensitive data is committed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
Copyright (c) 2025 OTN Simulator Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **Lucide Icons** - For the beautiful icon set
- **React Community** - For the amazing ecosystem
- **Vite Team** - For the blazing fast build tool
- **OTN Standards** - ITU-T G.709 specifications

---

## 📞 Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Email**: support@example.com

---

## 🗺️ Roadmap

- [ ] Add more OTN protocol simulations
- [ ] Implement ODUflex support
- [ ] Add performance metrics dashboard
- [ ] Create mobile-responsive design
- [ ] Add export/import configuration feature
- [ ] Implement collaborative simulation mode

---

<div align="center">

**Made with ❤️ by the OTN Simulator Team**

⭐ Star this repository if you find it helpful!

</div>
