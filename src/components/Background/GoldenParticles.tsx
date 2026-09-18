import { useEffect, useRef } from "react";
import "./GoldenParticles.css";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  life: number;
  maxLife: number;
}

export function GoldenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + 20,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.8 + 0.2),
        opacity: 0,
        opacitySpeed: Math.random() * 0.008 + 0.003,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    }

    // Initial particles
    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      p.opacity = Math.random() * 0.5;
      particles.push(p);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < 80 && Math.random() < 0.3) {
        particles.push(createParticle());
      }

      particles.forEach((p, i) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        // Opacity fade in/out
        if (p.life < 60) {
          p.opacity = Math.min(0.6, p.opacity + p.opacitySpeed);
        } else if (p.life > p.maxLife - 60) {
          p.opacity = Math.max(0, p.opacity - p.opacitySpeed);
        }

        // Gold sparkle color
        const goldColors = [
          `rgba(212, 175, 55, ${p.opacity})`,
          `rgba(245, 215, 110, ${p.opacity})`,
          `rgba(201, 162, 39, ${p.opacity * 0.7})`,
        ];
        ctx.fillStyle = goldColors[i % goldColors.length];
        ctx.beginPath();

        // Alternate between circles and sparkles
        if (p.size > 2) {
          // Draw 4-point sparkle for bigger particles
          ctx.save();
          ctx.translate(p.x, p.y);
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s * 2.5);
          ctx.lineTo(s * 0.4, -s * 0.4);
          ctx.lineTo(s * 2.5, 0);
          ctx.lineTo(s * 0.4, s * 0.4);
          ctx.lineTo(0, s * 2.5);
          ctx.lineTo(-s * 0.4, s * 0.4);
          ctx.lineTo(-s * 2.5, 0);
          ctx.lineTo(-s * 0.4, -s * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -20) {
          particles.splice(i, 1);
        }
      });

      // Ambient bokeh glows
      const time = Date.now() / 10000;
      const glows = [
        { x: 0.2, y: 0.3, r: 250 },
        { x: 0.8, y: 0.6, r: 300 },
        { x: 0.5, y: 0.8, r: 200 },
      ];

      glows.forEach((g) => {
        const gx = canvas.width * (g.x + Math.sin(time + g.r) * 0.05);
        const gy = canvas.height * (g.y + Math.cos(time + g.r) * 0.05);
        const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r);
        gradient.addColorStop(0, "rgba(212, 175, 55, 0.025)");
        gradient.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(gx, gy, g.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="golden-particles"
      aria-hidden="true"
    />
  );
}
