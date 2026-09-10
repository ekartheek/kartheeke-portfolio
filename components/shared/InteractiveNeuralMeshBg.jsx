'use client';

import React, { useEffect, useRef } from 'react';

export default function InteractiveNeuralMeshBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Palette: Laser Sky, Single-Mode Blue, NOC Emerald, Console Amber
    const nodePalette = [
      { fill: '#38bdf8', stroke: 'rgba(56, 189, 248, 0.7)', glow: 'rgba(56, 189, 248, 0.45)' },
      { fill: '#0284c7', stroke: 'rgba(2, 132, 199, 0.7)', glow: 'rgba(2, 132, 199, 0.35)' },
      { fill: '#10b981', stroke: 'rgba(16, 185, 129, 0.8)', glow: 'rgba(16, 185, 129, 0.45)' },
      { fill: '#f59e0b', stroke: 'rgba(245, 158, 11, 0.7)', glow: 'rgba(245, 158, 11, 0.35)' }
    ];

    // Node class with spring dynamics and drag physics
    class Node {
      constructor(x, y, paletteItem) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = 2.5 + Math.random() * 2.5;
        this.color = paletteItem;
        this.isDragged = false;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        if (!this.isDragged) {
          // Subtle natural drift
          this.x += this.vx;
          this.y += this.vy;

          // Boundary bouncing with margin
          if (this.x < 10) { this.x = 10; this.vx *= -1; }
          if (this.x > width - 10) { this.x = width - 10; this.vx *= -1; }
          if (this.y < 10) { this.y = 10; this.vy *= -1; }
          if (this.y > height - 10) { this.y = height - 10; this.vy *= -1; }

          // Velocity damping to maintain calm, elegant flow
          this.vx *= 0.99;
          this.vy *= 0.99;

          // If velocity gets too low, give a subtle nudge
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed < 0.2) {
            this.vx += (Math.random() - 0.5) * 0.15;
            this.vy += (Math.random() - 0.5) * 0.15;
          }
        }
        this.pulsePhase += 0.03;
      }

      draw(ctx) {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const currentRadius = this.isDragged ? this.radius * 1.6 : this.radius + pulse * 0.8;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.fill;
        ctx.shadowColor = this.color.glow;
        ctx.shadowBlur = this.isDragged ? 18 : 10;
        ctx.fill();

        // Subtle outer boundary ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Traveling packet / pulse across active links
    class Packet {
      constructor(fromNode, toNode, speed, color) {
        this.from = fromNode;
        this.to = toNode;
        this.progress = 0;
        this.speed = speed;
        this.color = color;
        this.alive = true;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.alive = false;
        }
      }

      draw(ctx) {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize nodes based on screen size
    const isMobile = width < 768;
    const nodeCount = isMobile ? 38 : 72;
    const maxLinkDistance = isMobile ? 120 : 155;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const palette = nodePalette[Math.floor(Math.random() * nodePalette.length)];
      nodes.push(
        new Node(
          Math.random() * (width - 40) + 20,
          Math.random() * (height - 40) + 20,
          palette
        )
      );
    }

    let packets = [];
    let packetTimer = 0;

    // Mouse & Touch Interaction State
    const mouse = {
      x: -1000,
      y: -1000,
      isDown: false,
      draggedNode: null,
      lastScrollY: window.scrollY
    };

    // Global Pointer Listeners for dragging & pulling
    const onPointerDown = (e) => {
      // Don't hijack clicks on buttons, links, inputs, or control cards
      if (e.target && e.target.closest('a, button, input, textarea, select, [role="button"], [data-interactive="true"]')) {
        return;
      }

      mouse.isDown = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Find closest node within grab radius
      let closestNode = null;
      let minDist = 55; // grab threshold in pixels

      for (let node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestNode = node;
        }
      }

      if (closestNode) {
        mouse.draggedNode = closestNode;
        closestNode.isDragged = true;
      }
    };

    const onPointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (mouse.draggedNode) {
        // Calculate velocity while dragging for momentum throw
        mouse.draggedNode.vx = (e.clientX - mouse.draggedNode.x) * 0.45;
        mouse.draggedNode.vy = (e.clientY - mouse.draggedNode.y) * 0.45;
        mouse.draggedNode.x = e.clientX;
        mouse.draggedNode.y = e.clientY;
      }
    };

    const onPointerUp = () => {
      if (mouse.draggedNode) {
        mouse.draggedNode.isDragged = false;
        mouse.draggedNode = null;
      }
      mouse.isDown = false;
    };

    // Parallax scroll reactivity
    const onScroll = () => {
      const deltaY = window.scrollY - mouse.lastScrollY;
      mouse.lastScrollY = window.scrollY;

      // Impart gentle vertical drift to nodes during scroll
      for (let node of nodes) {
        if (!node.isDragged) {
          node.y -= deltaY * 0.15;
          // Wrap if scrolled past edges
          if (node.y < 0) node.y += height;
          if (node.y > height) node.y -= height;
        }
      }
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check if mouse is hovering over any node
      let hoveredNode = null;
      if (mouse.x > 0 && mouse.y > 0) {
        for (let node of nodes) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          if (Math.sqrt(dx * dx + dy * dy) < 28) {
            hoveredNode = node;
            break;
          }
        }
      }

      // Handle hover proximity pull (magnetic attraction when cursor is near)
      if (!mouse.draggedNode && mouse.x > 0 && mouse.y > 0) {
        const pullRadius = 150;
        for (let node of nodes) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pullRadius && dist > 2) {
            const force = (1 - dist / pullRadius) * 0.9;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }
      }

      // If a node is dragged, pull its connected neighbors with elastic spring tension
      if (mouse.draggedNode) {
        const dragged = mouse.draggedNode;
        for (let node of nodes) {
          if (node === dragged) continue;
          const dx = dragged.x - node.x;
          const dy = dragged.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLinkDistance) {
            // Spring pull force
            const springForce = (dist / maxLinkDistance) * 0.35;
            node.vx += (dx / dist) * springForce;
            node.vy += (dy / dist) * springForce;
          }
        }
      }

      // Update all nodes
      for (let node of nodes) {
        node.update();
      }

      // Draw neural synaptic links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLinkDistance) {
            const alpha = (1 - dist / maxLinkDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            // If either node is dragged, brighten the connecting lines with high tension glow
            if (n1.isDragged || n2.isDragged) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, alpha * 2.8)})`;
              ctx.lineWidth = 1.6;
            } else if (n1 === hoveredNode || n2 === hoveredNode) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.9, alpha * 1.8)})`;
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
              ctx.lineWidth = 0.85;
            }
            ctx.stroke();

            // Spawn occasional data packets across connected links
            if (packetTimer % 35 === 0 && Math.random() < 0.05 && packets.length < 22) {
              const packetColors = ['#38bdf8', '#10b981', '#38bdf8', '#f59e0b'];
              const pColor = packetColors[Math.floor(Math.random() * packetColors.length)];
              packets.push(new Packet(n1, n2, 0.016 + Math.random() * 0.02, pColor));
            }
          }
        }
      }

      // Update and draw traveling packets
      packetTimer++;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.update();
        if (p.alive) {
          p.draw(ctx);
        } else {
          packets.splice(i, 1);
        }
      }

      // Draw all nodes
      for (let node of nodes) {
        node.draw(ctx);

        // If hovered, draw grab cue ring
        if (node === hoveredNode && !node.isDragged) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
