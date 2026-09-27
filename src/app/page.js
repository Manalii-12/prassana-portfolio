"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Upcoming from "@/components/Upcoming";
import Contact from "@/components/Contact";
import ContactDrawer from "@/components/ContactDrawer";
import Footer from "@/components/Footer";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080B11]">
      <Navbar openContact={() => setIsContactOpen(true)} />

      <Hero />
      <Portfolio />
      <About />
      <Upcoming />
      <Contact />
      <Footer />

      <ContactDrawer
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}