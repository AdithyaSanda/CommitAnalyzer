import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ArrowRight } from 'lucide-react';
import { Network } from 'lucide-react';
import { Bot } from 'lucide-react';
import { History } from 'lucide-react';
import { LockKeyholeOpen } from 'lucide-react';
import { GitGraph } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Home() {
  const canvasRef = useRef(null);
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    let time = 0;
    let mouse = { x: null, y: null };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const spacing = 35;
    const baseDotSize = 2;

    class Particle {
      constructor(x, y, row, col) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.baseSize = baseDotSize;
        this.size = baseDotSize;
        this.opacity = 0;
      }

      update(centerX, centerY) {
        // ===== Center radial interference =====
        const dxCenter = this.x - centerX;
        const dyCenter = this.y - centerY;
        const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

        const radialWave = Math.sin(distanceCenter * 0.05 - time * 2);
        const diagonalWave = Math.cos(time + this.row * 0.4 - this.col * 0.4);
        let combined = (radialWave + diagonalWave) / 2;

        // ===== Mouse ripple effect =====
        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = this.x - mouse.x;
          const dyMouse = this.y - mouse.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          const mouseInfluenceRadius = 200;

          if (distanceMouse < mouseInfluenceRadius) {
            const mouseWave = Math.cos(
              distanceMouse * 0.08 - time * 4
            );

            // Blend mouse ripple with base animation
            combined += mouseWave * (1 - distanceMouse / mouseInfluenceRadius);
          }
        }

        // Normalize safely between 0 → 1
        combined = Math.max(-1, Math.min(1, combined));
        this.opacity = (combined + 1) / 2;

        // Subtle size pulse
        this.size = this.baseSize + this.opacity * 1.2;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );

        gradient.addColorStop(0, `rgba(46,160,67,${this.opacity})`);
        gradient.addColorStop(1, `rgba(46,160,67,0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];

      const cols = Math.floor(canvas.width / spacing);
      const rows = Math.floor(canvas.height / spacing);

      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;
          particlesArray.push(new Particle(x, y, row, col));
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particlesArray.forEach((particle) => {
        particle.update(centerX, centerY);
        particle.draw();
      });

      time += 0.03;
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

    const text = "Turn Git History into Insights."

    useEffect(() => {
        if(index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[index])
                setIndex(prev => prev + 1)
            }, 100)

            return () => clearTimeout(timeout)
        }

        
    }, [index, text])


    const isAuthenticated = !!localStorage.getItem('token')
  return (
    <div className="w-full">
        <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-neutral-900"
        />
        <div className="flex items-center text-shadow-xs cursor-pointer">
            <GitGraph className="text-green-600 h-10 w-10 mt-8 ml-8"/>
            <span className="mt-8 ml-5 text-3xl tracking-wider text-green-600 font-bold">CommitAnalyzer</span>
        </div>
        <div className="xl:text-9xl font-bold mt-32 font-sans text-center xl:leading-35 tracking-wide xl:h-95 max-sm:text-3xl max-sm:leading-15 max-sm:h-50 max-sm:w-120 sm:text-7xl sm:leading-30 sm:h-80">
            <span>{displayText.slice(0,16)}</span>
            <br />  
            <span>{displayText.slice(16, text.length)}</span>
        </div>
        <div className="flex justify-center max-sm:w-120">
            <button onClick={() => isAuthenticated ? navigate("/dashboard", {replace: true}) : navigate("/login", {replace: true})} className="flex items-center bg-green-600 py-3 px-9 text-xl rounded-lg font-black tracking-wide cursor-pointer">Get Started <ArrowRight className="ml-2" strokeWidth={3}/></button>
        </div>
        <div className="flex gap-20 justify-center mt-25 mb-10 max-sm:flex-col max-sm:w-120 max-sm:items-center sm:grid sm:grid-cols-2 sm:gap-x-0 sm:place-items-center xl:flex xl:gap-20 ">
            <div className="bg-neutral-900 h-80 w-70 rounded-lg border-2 border-white/10">
                <div className="border-b-3 border-white/20 h-19 mb-10">
                    <Network className="mt-3 h-15 w-full p-3 mx-auto text-green-600"/>
                </div>
                <p className="text-center text-lg tracking-wide font-black">Interactive Commit Graph</p>
                <ul className="text-center text-sm mt-5  leading-10">
                    <li>Visual node-based commit history</li>
                    <li>Branch structure visualization</li>
                    <li>Click any node for deep details</li>
                </ul>
            </div>
            <div className="bg-neutral-900 h-80 w-70 rounded-lg border-2 border-white/10">
                <div className="border-b-3 border-white/20 h-19 mb-10">
                    <Bot className="mt-3 h-15 w-full p-3 mx-auto text-green-600"/>
                </div>
                <p className="text-center text-lg tracking-wide font-black">AI Commit Summaries</p>
                <ul className="text-center text-sm mt-5  leading-10">
                    <li>Understand large commits instantly</li>
                    <li>AI explains changes in plain English</li>
                    <li>Saves review time</li>
                </ul>
            </div>
            <div className="bg-neutral-900 h-80 w-70 rounded-lg border-2 border-white/10">
                <div className="border-b-3 border-white/20 h-19 mb-10">
                    <History className="mt-3 h-15 w-full p-3 mx-auto text-green-600"/>
                </div>
                <p className="text-center text-lg tracking-wide font-black">Repository History</p>
                <ul className="text-center text-sm mt-5  leading-10">
                    <li>See all previously analyzed repos</li>
                    <li>Re-analyze anytime</li>
                    <li>Track insights over time</li>
                </ul>
            </div>
            <div className="bg-neutral-900 h-80 w-70 rounded-lg border-2 border-white/10">
                <div className="border-b-3 border-white/20 h-19 mb-10">
                    <LockKeyholeOpen className="mt-3 h-15 w-full p-3 mx-auto text-green-600"/>
                </div>
                <p className="text-center text-lg tracking-wide font-black">Secure Authentication</p>
                <ul className="text-center text-sm mt-5  leading-10">
                    <li>JWT-based login system</li>
                    <li>Secure session handling</li>
                    <li>User-specific data</li>
                </ul>
            </div>
        </div>
        <div className="grid xl:grid-cols-2 mt-25 mb-10 gap-y-20 place-items-center max-sm:grid-cols-1 max-sm:w-120 sm:grid-cols-1 ">
            <div className="border-2 border-white/10 rounded-lg">
                <img src="/src/assets/demo/demo1.png" className="rounded-lg h-67 max-sm:h-50 " alt="demo1"/>
            </div>
            <div className="border-2 border-white/10 rounded-lg">
                <img src="/src/assets/demo/demo2.png" className="rounded-lg h-67 max-sm:h-50" alt="demo2"/>
            </div>
            <div className="border-2 border-white/10 rounded-lg">
                <img src="/src/assets/demo/demo3.png" className="rounded-lg h-67 max-sm:h-50" alt="demo3"/>
            </div>
            <div className="border-2 border-white/10 rounded-lg">
                <img src="/src/assets/demo/demo4.png" className="rounded-lg h-67 max-sm:h-50" alt="demo4"/>
            </div>
        </div>
        
    </div>
    
    
  );
}


export default Home