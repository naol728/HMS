import Footer from "@/components/landing/Footer";
import About from "@/components/landing/About";
import Home from "@/components/landing/Home";
import Navbar from "@/components/landing/Navbar";
import Newsletter from "@/components/landing/Newsletter";
import Rooms from "@/components/landing/Rooms";
import Testimonials from "@/components/landing/Testimonials";
import React from "react";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Home />
      <Rooms />
      <About />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}
