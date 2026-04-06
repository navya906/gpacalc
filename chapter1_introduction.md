# Chapter 1 — Introduction

## 1.0 Background

In the contemporary academic environment, students routinely need to track and compute their academic performance metrics — specifically the **Semester Grade Point Average (SGPA)** and the **Cumulative Grade Point Average (CGPA)**. Despite the straightforward nature of these calculations, students frequently rely on manual arithmetic or disjointed spreadsheet tools that are error-prone, non-portable, and lack a user-friendly interface. The absence of a dedicated, lightweight, and visually appealing tool that performs accurate credit-weighted GPA calculations represents a tangible gap in everyday academic utility software.

This project addresses the above problem by developing a **portfolio-integrated CGPA Calculator web application**. The system is a dual-purpose platform: it serves as a **personal portfolio website** showcasing the developer's profile, academic background, and technical skills, while simultaneously hosting a fully functional **SGPA & CGPA Calculator** as the featured academic utility project. The application is designed as a **frontend-only, client-side solution** — requiring no backend server, database, or user authentication — thereby ensuring maximum accessibility, portability, and ease of deployment.

The application domain falls under **educational technology (EdTech)** and **personal web development**, combining the need for professional self-presentation with practical academic tooling. The project demonstrates how modern web technologies can be leveraged to build interactive, visually rich, and functionally useful applications entirely on the client side.

---

## 1.1 Project Overview

The developed web application is a **React-based personal portfolio website** with an integrated **multi-page CGPA/SGPA Calculator** built using vanilla HTML, CSS, and JavaScript. The application is structured into two interconnected modules:

### Module 1 — Portfolio Website (React + Vite)

The portfolio module is a single-page application (SPA) built with **React 19** and bundled using **Vite 8**. It presents the developer's professional profile through the following sections:

| Section | Description |
|---|---|
| **Navbar** | A fixed-position, glassmorphism navigation bar with a frosted-glass backdrop-filter effect. Provides one-click navigation to the Calculator section. |
| **Hero Section** | A full-viewport landing area featuring the developer's name and role ("Computer Science Student"). It includes an interactive **LiquidEther** WebGL fluid-simulation background powered by **Three.js**, which reacts to mouse/touch input and produces a dynamic, cursor-tracking animation. |
| **About Me** | A content section describing the developer's academic background, including Registration Number (24BDS0262), University (VIT Vellore), Branch (CSE – Data Science), and expected Graduation Year (2028). |
| **Technical Skills** | A responsive grid of skill cards displaying proficiency in Python, C, JavaScript, HTML & CSS, Flask, React, SQL, and Data Structures. Each card features hover-lift micro-animations. |
| **Project (CGPA Calculator)** | A dedicated section describing the calculator utility with a direct link ("Open CGPA Calculator") that navigates to the multi-page calculator module. |
| **Footer** | A simple footer with copyright information. |

**Key visual features** of the portfolio module include:
- **Scroll-triggered fade-in animations** using the Intersection Observer API via a custom `useScrollAnimation` React hook.
- **LiquidEther WebGL background** — a GPU-accelerated fluid dynamics simulation using custom GLSL shaders (advection, divergence, Poisson pressure, viscous diffusion) rendered via Three.js. The simulation supports BFECC (Back and Forth Error Compensation and Correction) advection, configurable cursor influence, and an auto-demo mode with smooth ramp-in/takeover transitions.
- A **warm, earthy brown colour palette** defined through CSS custom properties on a cream/parchment background.
- **Inter** (Google Fonts) typography for a modern, professional appearance.

### Module 2 — CGPA/SGPA Calculator (Vanilla HTML/CSS/JS)

The calculator module is a **standalone, multi-page web application** located in the `public/calculator/` directory. It consists of three pages:

| Page | File | Purpose |
|---|---|---|
| **Landing Page** | `landing.html` | A hub page presenting two option cards — SGPA Calculator and CGPA Calculator — with navigation links and a "Back to Portfolio" button. |
| **SGPA Calculator** | `sgpa.html` + `sgpa-script.js` | Allows the user to add subjects (name, credits, grade), view them in a dynamic table, calculate the SGPA using a credit-weighted formula, and optionally compute an updated CGPA inline. Includes email-sharing functionality. |
| **CGPA Calculator** | `cgpa.html` + `cgpa-script.js` | A standalone form-based page where the user enters their current CGPA, credits completed, semester SGPA, and semester credits. The system computes the updated CGPA using the credit-weighted average formula. Includes email sharing and a reset function. |

**Grade system supported:** S (10), A (9), B (8), C (7), D (6), E (5), F (0), P (Pass — counts toward total credits but excluded from GPA calculation).

**SGPA Formula:**
```
SGPA = Σ (Credit_i × GradePoint_i) / Σ Credit_i
       (excluding Pass-graded subjects)
```

**CGPA Formula:**
```
Updated CGPA = (Previous_CGPA × Previous_Credits + Current_SGPA × Semester_Credits)
               / (Previous_Credits + Semester_Credits)
```

**Key features** of the calculator module:
- **Dynamic subject management** — Add, view, and delete subjects with real-time SGPA recalculation on every change.
- **Inline CGPA calculation** — After computing SGPA, the user can optionally enter previous academic data to compute their updated CGPA without leaving the page.
- **Email sharing** — Both SGPA and CGPA results can be shared via the user's default email client using mailto links. A formatted summary (including all subjects, credits, and grades) is pre-composed in the email body.
- **Input validation** — All fields are validated before computation; user-friendly toast notifications appear for validation errors.
- **Colour-coded results** — CGPA results are colour-coded: green (8.5 and above), brown/default (6.5 and above), red (below 6.5).
- **Keyboard support** — Pressing Enter on any input field triggers the calculation.
- **Responsive design** — The calculator layout adapts to mobile viewports with grid breakpoints at 800px and 600px.
- **Smooth animations** — Row-add animations, result pop-in, slide-in transitions, and fade-in effects enhance user experience.

### Technology Stack Summary

| Technology | Version | Role |
|---|---|---|
| **React** | 19.2.4 | UI component framework for the portfolio SPA |
| **Vite** | 8.0.0 | Build tool and development server with HMR |
| **Three.js** | 0.183.2 | WebGL-based 3D rendering for the LiquidEther fluid simulation |
| **react-spring/web** | 10.0.3 | Spring-physics-based animation library (available for transitions) |
| **HTML5** | — | Semantic markup for the calculator module |
| **CSS3** | — | Custom properties, grid/flexbox layouts, animations, glassmorphism |
| **Vanilla JavaScript (ES6+)** | — | Calculator logic, DOM manipulation, email sharing |
| **Google Fonts (Inter)** | — | Modern sans-serif typography |
| **ESLint** | 9.39.4 | Code quality and linting |

### Application Architecture

```
                        index.html (Vite Entry Point)
                              │
                          main.jsx (React Root)
                              │
                        App.jsx (Portfolio SPA)
                    ┌─────────┼─────────────────────┐
                    │         │                     │
               ┌────┴───┐  ┌─┴──────────┐    ┌─────┴──────┐
               │ Navbar  │  │ Hero       │    │ About Me   │
               └─────────┘  │ + Liquid   │    └────────────┘
                            │   Ether    │
                            │ (Three.js) │    ┌────────────┐
                            └────────────┘    │  Skills    │
                                              └────────────┘
                                              ┌────────────┐
                                              │  Project   │
                                              │  Section   │──── Link ────┐
                                              └────────────┘              │
                                              ┌────────────┐              │
                                              │  Footer    │              │
                                              └────────────┘              │
                                                                          ▼
                                                           calculator/landing.html
                                                           ┌──────────┬──────────┐
                                                           │          │          │
                                                           ▼          ▼          │
                                                      sgpa.html  cgpa.html      │
                                                           │          │          │
                                                     sgpa-script  cgpa-script   │
                                                        .js          .js        │
                                                           │          │          │
                                                     Email Share  Email Share    │
                                                                          ◄─────┘
                                                                  Back to
                                                                 Portfolio
```

---

## 1.2 Objectives of the Project

The primary objectives of developing this web application are:

1. **To design and develop a functional, dual-purpose web application** that combines a personal portfolio website with an academic CGPA/SGPA calculator, demonstrating the integration of multiple web modules into a cohesive system.

2. **To create an interactive and visually engaging user interface** featuring modern design principles — including glassmorphism, WebGL fluid-simulation backgrounds, scroll-triggered animations, micro-interactions, and responsive layouts — to enhance user engagement and deliver a premium user experience.

3. **To implement robust form handling and real-time data processing** through dynamic subject management (add, delete, recalculate), input validation with user-friendly toast notifications, and accurate credit-weighted GPA computation using standard academic formulas.

4. **To enable seamless multi-page navigation** between the React-based portfolio (SPA) and the vanilla HTML/CSS/JS calculator module, demonstrating the ability to architect hybrid web applications where different technology stacks coexist within a single project.

5. **To demonstrate the practical use of modern web technologies in application development**, including:
   - **React 19** for component-based UI architecture,
   - **Vite 8** for fast module bundling and hot module replacement,
   - **Three.js** and custom **GLSL shaders** for GPU-accelerated visual effects,
   - **CSS Custom Properties** and **CSS Grid/Flexbox** for a maintainable, responsive design system,
   - **Intersection Observer API** for performant scroll-based animations,
   - **Vanilla JavaScript (ES6+)** for client-side logic without framework overhead.

6. **To provide utility features that extend beyond basic computation**, including email-based result sharing (via mailto protocol), colour-coded performance indicators, keyboard accessibility (Enter-to-calculate), and an inline CGPA extension on the SGPA page to minimize page transitions.

7. **To build a fully client-side, backend-free application** that operates entirely in the browser — requiring no server, no database, and no authentication — making it instantly deployable, highly portable, and accessible from any device with a modern web browser.

---

## 1.3 Relevance of the Project

This project holds relevance across several dimensions:

- **Academic Utility:** Provides a practical tool that students can use daily to track their semester and cumulative GPA, replacing error-prone manual calculations.
- **Skill Demonstration:** Serves as a portfolio piece that showcases full-stack frontend development capabilities — from WebGL shader programming to responsive CSS design and React component architecture.
- **Educational Value:** Illustrates how modern web technologies (React, Vite, Three.js, GLSL) can be combined to build real-world applications, serving as a reference implementation for web development coursework.
- **Accessibility:** Being entirely client-side with no backend dependencies, the application can be hosted on any static file server (GitHub Pages, Netlify, Vercel) at zero cost, making it universally accessible.

---

**Developer:** Navya Ghatta | **Reg. No.:** 24BDS0262 | **University:** VIT Vellore
**Branch:** Computer Science and Engineering (Data Science) | **Graduation Year:** 2028
