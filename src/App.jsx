import Nav from "./components/Nav.jsx";
import Timeline from "./components/Timeline.jsx";
import Hero from "./components/Hero.jsx";
import Work from "./components/Work.jsx";
import Process from "./components/Process.jsx";
import Services from "./components/Services.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <Timeline />
      <main>
        <Hero />
        <Work />
        <Process />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
