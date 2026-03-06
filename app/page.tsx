import Navbar from './components/home/Navbar';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import Performance from './components/home/Performance';
import TradingAssets from './components/home/TradingAssets';
import Testimonials from './components/home/Testimonials';
import FAQ from './components/home/FAQ';
import CTA from './components/home/CTA';
import Footer from './components/home/Footer';

export default function Home() {
  return (
    <main className="bg-[#1a1d29] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <TradingAssets />
      <Performance />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
