# ⚡ NutriTracker — Intelligent Calorie & Nutrition Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://letstracknutri.netlify.app/)
[![UI/UX](https://img.shields.io/badge/Design%20System-Antigravity%20HUD-ff007f?style=for-the-badge)](https://letstracknutri.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **Live Application:** [https://letstracknutri.netlify.app/](https://letstracknutri.netlify.app/)  
> A high-performance metabolic and nutritional tracking application featuring dynamic persona-based theming, one-tap authentication workflows, and a streamlined macro-management engine.

---

## 🌐 Live Preview

Experience the live web build directly:  
👉 **[Launch NutriTracker on Netlify](https://letstracknutri.netlify.app/)**

---

## 📌 Executive Summary

**NutriTracker** bridges high-precision metabolic tracking with an engaging, interactive user experience. Unlike standard static fitness logs, NutriTracker utilizes an **adaptive design system** that dynamically adjusts UI tokens, glow dynamics, and color energy based on user profile archetypes—keeping daily nutritional adherence intuitive, rewarding, and data-driven.

---

## ✨ Core Features & Workflows

### 1. Seamless Authentication
* **One-Tap Verification:** Fast-track login integration for Truecaller and Google Identity Services.
* **Streamlined Onboarding:** Instant baseline calculations for Basal Metabolic Rate (BMR) and daily caloric targets.

### 2. Core Performance Dashboard
* **Dynamic Reactor Ring:** Real-time visual progress showing consumed vs. burned calories with micro-animations.
* **Live Macro Distribution:** Responsive breakdown meters for Protein, Carbohydrates, and Fats.

### 3. Rapid Bio-Fuel / Meal Intake
* **Quick-Add Slots:** Preset time-of-day meal templates (Breakfast, Mid-Day, Post-Workout) for rapid logging.
* **Ingredient Matrix:** Granular search, portion scaling, and instant macro recalculation.

### 4. Adaptive Theme Engine
* **Antigravity Token Architecture:** Live theme repainting across surface cards, borders, and particle glows.
* **User Preferences:** Toggleable visual feedback, glow intensity, and low-latency rendering options.

### 5. Analytics & Daily Logs
* **Metabolic Trends:** Comprehensive multi-day view displaying intake vs. target burn.
* **Streak & Feats Engine:** Milestone badging system rewarding consistent logging habits.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React / Modern Web Architecture
* **Hosting & Deployment:** Netlify (Continuous Deployment via Git)
* **Design System:** Custom Antigravity HUD Engine (CSS Variables, Glassmorphism, Responsive Tokens)
* **Auth Integration:** Google Identity Services / Truecaller SDK
* **State Management:** React Context / Zustand
* **Icons & Assets:** Vector HUD icons, dynamic SVG gauges

---

## 📱 Application Flow

```text
[ Authentication (Google / Truecaller) ]
                   │
                   ▼
         [ Core HUD Dashboard ]
         ├── Calorie Balance & Burn Ring
         ├── Live Macro Distribution
         └── Daily Status Metrics
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[ Bio-Fuel / Meal Log ]   [ Settings & Preferences ]
├── Preset Quick Slots    ├── Dynamic Persona Themes
├── Ingredient Search     └── Particle & Glow Controls
└── Portion Matrix

🚀 Local Development Setup
Prerequisites
Node.js (>= 18.x)

npm or yarn

Installation & Run
# 1. Clone the repository
git clone [https://github.com/smartguy1986/NutriTracker.git](https://github.com/smartguy1986/NutriTracker.git)

# 2. Navigate to project root
cd NutriTracker

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

👤 Author
GitHub: @smartguy1986

Live Demo: letstracknutri.netlify.app

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
