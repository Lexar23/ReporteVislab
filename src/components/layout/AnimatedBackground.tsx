"use client";

import React, { useEffect, useRef } from 'react';

/**
 * Componente de fondo animado con líneas modernas.
 * Proporciona una atmósfera visual premium con movimientos sutiles.
 */
export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    interface Line {
      x: number;
      y: number;
      length: number;
      speed: number;
      color: string;
      width: number;
      angle: number;
      opacity: number;
      growing: boolean;
    }

    const lines: Line[] = [];
    // Colores: Azul Celeste, Violeta, Verde
    const colors = [
      'rgba(14, 165, 233,', // Sky Blue
      'rgba(139, 92, 246,', // Violet
      'rgba(34, 197, 94,',  // Green
    ];

    const initLines = () => {
      lines.length = 0;
      const count = Math.floor((width * height) / 40000) + 20;
      for (let i = 0; i < count; i++) {
        lines.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 300 + 100,
          speed: Math.random() * 0.4 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          width: Math.random() * 1.2 + 0.4,
          angle: (Math.random() * 45 + 15) * (Math.PI / 180),
          opacity: Math.random() * 0.5,
          growing: Math.random() > 0.5
        });
      }
    };

    initLines();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      lines.forEach((line) => {
        // Actualizar opacidad para un efecto de parpadeo suave
        if (line.growing) {
          line.opacity += 0.005;
          if (line.opacity >= 0.5) line.growing = false;
        } else {
          line.opacity -= 0.005;
          if (line.opacity <= 0.1) line.growing = true;
        }

        ctx.beginPath();
        ctx.strokeStyle = `${line.color}${line.opacity})`;
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        
        // Efecto de brillo sutil
        ctx.shadowBlur = 4;
        ctx.shadowColor = `${line.color}${line.opacity * 0.8})`;
        
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;

        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Movimiento diagonal
        line.x += line.speed * Math.cos(line.angle);
        line.y += line.speed * Math.sin(line.angle);

        // Reposicionar si sale de la pantalla
        if (line.x > width + 100 || line.y > height + 100) {
          if (Math.random() > 0.5) {
            line.x = -100;
            line.y = Math.random() * height;
          } else {
            line.x = Math.random() * width;
            line.y = -100;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="animated-lines-bg"
      className="fixed inset-0 -z-10 pointer-events-none opacity-60 dark:opacity-30 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
