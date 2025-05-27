"use client";
import Image from "next/image";
import clock from "../../public/file.svg";
import styles from "./page.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const handContainerRef = useRef(null);
  const handRef = useRef(null);
  const handImageRef = useRef(null);
  const introeRef = useRef(null);
  const h1ElementRef = useRef(null);
  const introCopytRef = useRef(null);
  const websiteContenttRef = useRef(null);

  const introHeders = [
    "<span>time to</span> be brave",
    "<span>time to</span> be playful",
    "<span>time to</span> design the future",
    "<span>time to</span> meet the team",
    "<span>time to</span> see project one",
  ];

  useGSAP(
    () => {
      let currentCycle = -1;
      let imageRevealed = false;

      const updateHeaderTezxt = () => {
        if (h1ElementRef.current) {
          h1ElementRef.current.innerHTML =
            introHeders[Math.min(currentCycle, introHeders.length - 1)];
        }
      };

      const pinnedHeight = window.innerHeight * 8;

      ScrollTrigger.create({
        trigger: stickyRef.current,
        start: "top top",
        end: `+=${pinnedHeight}`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const rotationProgress = Math.min((progress * 8) / 5, 1);
          const totalRotation = rotationProgress * 1800 - 90;
          const rotationInCycle = ((totalRotation + 90) % 360) - 90;

          gsap.set(handContainerRef.current, { rotationZ: rotationInCycle });

          const newCycle = Math.floor((totalRotation + 90) / 360);

          if (
            newCycle !== currentCycle &&
            newCycle >= 0 &&
            newCycle < introHeders.length
          ) {
            currentCycle = newCycle;
            updateHeaderTezxt();

            if (newCycle === 3 && !imageRevealed) {
              gsap.to(handImageRef.current, { opacity: 1, duration: 0.3 });
              gsap.to(introCopytRef.current.querySelectorAll("p"), {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
              });
              imageRevealed = true;
            } else if (newCycle !== 3 && imageRevealed) {
              gsap.to(handImageRef.current, { opacity: 0, duration: 0.3 });
              gsap.to(introCopytRef.current.querySelectorAll("p"), {
                x: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
              });
              imageRevealed = false;
            }
          }
          if (progress <= 6 / 8) {
            const animationProgress = Math.max(0, (progress - 5 / 8) / (1 / 8));
            const newHeight = gsap.utils.interpolate(
              52.75,
              100,
              animationProgress
            );

            const newOpasity = gsap.utils.interpolate(1, 0, animationProgress);
            gsap.set(handRef.current, { height: `${newHeight}%` });
            gsap.set(introeRef.current, { opacity: 1 });
            gsap.set(h1ElementRef.current, { opacity: newOpasity });
            gsap.set(h1ElementRef.current.querySelectorAll("span"), {
              opacity: newOpasity,
            });
          } else {
            gsap.set(introeRef.current, { opacity: 0 });
          }

          if (progress <= 7 / 8) {
            const scaleProgress = Math.max(0, (progress - 6 / 8) / (1 / 8));
            const newScale = gsap.utils.interpolate(1, 20, scaleProgress);
            gsap.set(handRef.current, { scale: newScale });
          }

          if (progress <= 7.5 / 8) {
            const opacityProgress = Math.max(0, (progress - 7 / 8) / (0.5 / 8));
            const newOpacity = gsap.utils.interpolate(1, 0, opacityProgress);
            gsap.set(handRef.current, { opacity: newOpacity });
          }

          if (progress > 7.5 / 8) {
            const revealProgress = (progress - 7.5 / 8) / (0.5 / 8);
            const newOpacity = gsap.utils.interpolate(0, 1, revealProgress);
            gsap.set(websiteContenttRef.current, { opacity: newOpacity });
          } else {
            gsap.set(websiteContenttRef.current, { opacity: 0 });
          }
        },
      });

      updateHeaderTezxt();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <>
      <ReactLenis
        root
        options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}
      >
        <div className="container" ref={containerRef}>
          <section className="sticky" ref={stickyRef}>
            <div className="hand-container" ref={handContainerRef}>
              <div className="hand" ref={handRef}>
                <Image
                  src={clock}
                  alt="clock"
                  ref={handImageRef}
                  className={styles.handImage}
                />
              </div>
            </div>
            <div className="intro" ref={introeRef}>
              <h1 ref={h1ElementRef}>
                <span>time to</span> be brave
              </h1>
              <div ref={introCopytRef}>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
            <div className="website-content" ref={websiteContenttRef}>
              <h1>Rustam</h1>
            </div>
          </section>
          <section className="about">
            <p>next section</p>
          </section>
        </div>
      </ReactLenis>
    </>
  );
}
