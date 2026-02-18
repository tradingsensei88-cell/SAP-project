"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Github, Linkedin, Youtube, Zap } from "lucide-react";

const footerLinks = {
    Platform: ["Courses", "Instructors", "Pricing", "Blog"],
    Company: ["About Us", "Careers", "Press", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    Support: ["Help Center", "Community", "Status", "Changelog"],
};

const socials = [
    { icon: Twitter, href: "#" },
    { icon: Github, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
];

export default function FooterSection() {
    return (
        <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[var(--wonder-green)] rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-white font-black text-xl tracking-tight">WONDERLEARNING</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            The future of learning is here. Master premium skills with AI-powered guidance from WonderLearning.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[var(--wonder-green)] hover:border-[var(--wonder-green)]/40 transition-all duration-300"
                                >
                                    <s.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-500 text-sm hover:text-[var(--wonder-green)] transition-colors duration-200">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} WonderLearning. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                        Built with <span className="text-[var(--wonder-green)]">♥</span> for learners worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
}
