import React, { useEffect, useRef } from 'react';
import LiquidEther from './LiquidEther';
import './index.css';

// Intersection Observer Hook for fade-in animations
function useScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return ref;
}

const Navbar = () => (
  <nav className="navbar">
    <h3>Navya Ghatta</h3>
    <a href="#project" className="nav-btn">Calculator</a>
  </nav>
);

const Hero = () => {
  const scrollToProject = () => {
    document.getElementById("project").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" style={{ background: '#633018ff', position: 'relative', overflow: 'hidden' }}>
      {/* Background Simulation */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <LiquidEther
          colors={['#ffffff', '#f4efe8', '#dccfc2']}
          cursorSize={70}
        />
      </div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 1, color: '#faf8f4', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <h1 style={{ color: '#ffffff' }}>Navya Ghatta</h1>
        <p style={{ color: '#eee4da' }}>Computer Science Student</p>
        <button className="primary-btn" onClick={scrollToProject}>
          View Project
        </button>
      </div>
    </section>
  );
};

const About = () => {
  const ref = useScrollAnimation();

  return (
    <section className="section fade-in" ref={ref}>
      <h2>About Me</h2>
      <p>
        I am a Computer Science undergraduate specializing in backend engineering
        and full-stack development. I have hands-on experience building scalable
        applications with secure authentication, REST APIs, and database-backed
        systems. My interests include system design, semantic search, and
        logic-driven problem solving.
      </p>

      {/* ACADEMIC INFO */}
      <div className="card academic-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--brown-muted)' }}>
          Academic Information
        </h3>
        <p><strong>Registration Number:</strong> 24BDS0262</p>
        <p><strong>University:</strong> VIT Vellore</p>
        <p><strong>Branch:</strong> Computer Science and Engineering (Data Science)</p>
        <p><strong>Graduation Year:</strong> 2028</p>
      </div>
    </section>
  );
};

const Skills = () => {
  const ref = useScrollAnimation();

  const skills = [
    "Python", "C", "JavaScript", "HTML & CSS",
    "Flask", "React", "SQL", "Data Structures"
  ];

  return (
    <section className="section skills fade-in" ref={ref}>
      <h2>Technical Skills</h2>
      <div className="skill-cards">
        {skills.map((skill, index) => (
          <div key={index} className="card">{skill}</div>
        ))}
      </div>
    </section>
  );
};

const Project = () => {
  const ref = useScrollAnimation();

  return (
    <section id="project" className="section project fade-in" ref={ref}>
      <h2>CGPA Calculator</h2>
      <p>
        A frontend-only academic utility designed to compute SGPA and CGPA using
        accurate credit-weighted formulas. The application separates semester GPA
        and cumulative GPA calculations to reflect real academic evaluation
        systems, while remaining lightweight and backend-free.
      </p>

      <ul>
        <li>Letter-grade system (S, A, B, C, D, E, F)</li>
        <li>Separate SGPA and CGPA calculation pages</li>
        <li>Credit-weighted cumulative GPA logic</li>
        <li>No backend or database dependency</li>
        <li>Clean and responsive user interface</li>
      </ul>
      <br />
      <a href="calculator/landing.html" className="primary-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Open CGPA Calculator
      </a>
    </section>
  );
};

const Footer = () => (
  <footer>
    <p>© 2026 Navya Ghatta</p>
  </footer>
);

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Project />
      <Footer />
    </>
  );
}
