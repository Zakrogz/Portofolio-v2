import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, CustomEase, MotionPathPlugin, useGSAP);

// Único ease de marca: deceleración cinematográfica (cubic-bezier).
// Se reutiliza en todo el sitio en vez de dejar cada tween con su ease por defecto.
export const EASE = CustomEase.create("soler", "0.65, 0, 0.35, 1");

gsap.defaults({ ease: EASE, duration: 0.9 });
ScrollTrigger.defaults({ toggleActions: "play none none reverse" });

export { gsap, ScrollTrigger };
