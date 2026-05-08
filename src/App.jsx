import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import PlacementHighlights from './components/PlacementHighlights';
import ApplicationForm from './components/ApplicationForm';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingElements from './components/FloatingElements';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden font-sans">
      <Toaster position="top-center" />
      
      {/* Background animated blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-primary-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <WhyChooseUs />
          <PlacementHighlights />
          <ApplicationForm />
          <Feedback />
          <Contact />
        </main>
        <Footer />
        <FloatingElements />
      </div>
    </div>
  );
}

export default App;
