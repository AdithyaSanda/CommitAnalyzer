import React, { useEffect, useState } from 'react'
import axiosPublic from '../api/axiosPublic'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { GitGraph } from "lucide-react";
import { useRef } from "react";

const Login = () => {
    const navigate = useNavigate()
    localStorage.clear('repo-info')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            navigate('/dashboard', {replace: true})
        }
    }, [navigate])

    

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    



    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosPublic.post('/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            })

            localStorage.setItem('token', response.data.token)
            navigate('/dashboard')
        }
        catch(err) {
            console.error(err)
            alert("Invalid login credentials")
        }
        finally {
            setFormData({
                email:'',
                password:''
            })
        }
    }

    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let particlesArray = [];
        const mouse = {
        x: null,
        y: null,
        radius: 120,
        };
        const numberOfParticles = 120;

        const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        window.addEventListener("mousemove", (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        });

        window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
        });

        class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction (repel effect)
            if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;

                this.x += directionX * force * 3;
                this.y += directionY * force * 3;
            }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }
        }

        const init = () => {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
        };

        const connectParticles = () => {
        const maxDistance = 140;
        const maxConnections = 2;

        for (let a = 0; a < particlesArray.length; a++) {
            let connections = 0;

            for (let b = 0; b < particlesArray.length; b++) {
            if (a === b) continue;
            if (connections >= maxConnections) break;

            const p1 = particlesArray[a];
            const p2 = particlesArray[b];

            // 🔥 Break connections when mouse is close
            if (mouse.x !== null && mouse.y !== null) {
                const dx1 = p1.x - mouse.x;
                const dy1 = p1.y - mouse.y;
                const dx2 = p2.x - mouse.x;
                const dy2 = p2.y - mouse.y;

                const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist1 < mouse.radius || dist2 < mouse.radius) {
                continue; // skip drawing this connection
                }
            }

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = dx * dx + dy * dy;

            if (distance < maxDistance * maxDistance) {
                const opacity = 1 - distance / (maxDistance * maxDistance);
                ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.8})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                connections++;
            }
            }
        }
        };

        const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach((particle) => {
            particle.update();
            particle.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
        window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <div className='flex-col'>
            <div className="fixed inset-0 -z-10">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="flex items-center cursor-pointer">
                <GitGraph className="text-green-600 h-10 w-10 mt-8 ml-8"/>
                <span className="mt-8 ml-5 text-3xl tracking-wider text-green-600 font-bold">CommitAnalyzer</span>
            </div>
            <div className='flex justify-center items-center mt-10'>
                <form onSubmit={handleSubmit} className='flex flex-col bg-[rgb(21,21,21)] gap-y-4 border border-green-300 rounded-md w-80 p-10 sm:w-150 sm:p-15 lg:w-150 lg:h-130 '>
                    <h1 className='text-2xl mb-3 text-green-300'>Login</h1>
                    <label htmlFor="email" className='text-lg text-green-300'>Email</label>
                    <input id='email' type="email" className='bg-neutral-800 w-60 sm:w-120 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' placeholder='example@mail.com' name='email' value={formData.email} onChange={handleInputChange}/>
                    <label htmlFor="password" className='text-lg text-green-300'>Password</label>
                    <input id='password' type="password" className='bg-neutral-800 w-60 sm:w-120 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange}/>
                    <button className='bg-green-600 w-60 sm:w-120 border border-green-600 mt-5 px-3 py-3 rounded cursor-pointer' type='submit'>Login</button>
                    <span className='mt-3 text-lg'>Not a user? <Link className='ml-2 text-green-400 underline' to={'/signup'}>Sign Up</Link></span>
                </form>      
            </div>
        </div>
    )
}

export default Login