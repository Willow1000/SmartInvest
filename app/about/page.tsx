import AboutNavbar from '../components/about/Navbar';
import AboutHero from '../components/about/Hero';
import Team from '../components/about/Team';
import Testimonials from '../components/home/Testimonials';
import Achievements from '../components/about/Achievements';
import Partners from '../components/about/Partners';
import AboutCTA from '../components/about/CTA';
import ContactLocation from '../components/about/ContactLOcation';
import Footer from '../components/home/Footer';

export default function AboutPage() {
  return (
    <main className="bg-[#1a1d29] min-h-screen">
      <AboutNavbar />
      <AboutHero />
      <Team />
      <Achievements />
      <Testimonials />
      <Partners />
      <AboutCTA />
      <ContactLocation />
      <Footer />
    </main>
  );
}
