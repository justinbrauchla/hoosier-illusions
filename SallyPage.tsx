import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Home, PartyPopper, ArrowRight } from 'lucide-react';

const SallyPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#faf8f5] text-neutral-900 font-sans selection:bg-amber-100 scroll-smooth">
            {/* Decorative background element */}
            <div className="fixed top-0 right-0 w-1/3 h-screen bg-[#fdfaf5] -z-10" />

            {/* Navigation-like Header */}
            <nav className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-amber-200">S</div>
                    <span className="text-xl font-bold tracking-tight">Sally</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-500 uppercase tracking-widest">
                    <a href="#about" className="hover:text-amber-700 transition-colors">About</a>
                    <a href="#gallery" className="hover:text-amber-700 transition-colors">Gallery</a>
                    <a href="#itinerary" className="hover:text-amber-700 transition-colors">Community Events</a>
                </div>
            </nav>

            {/* Hero Content */}
            <motion.main
                id="about"
                className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="space-y-12">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">
                        <MapPin size={14} /> Local Living & Community
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter">
                            Meet<br />
                            <span className="text-amber-700">Sally.</span>
                        </h1>
                        <p className="text-xl text-neutral-500 max-w-lg leading-relaxed font-light">
                            Sharing stories from the heart of Indiana. From traditional harvest festivals to the warmth of a local community porch.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-neutral-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100 text-amber-700">
                                <Home size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-800">Setting</h3>
                                <p className="text-neutral-500">Sally's Home</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100 text-amber-700">
                                <PartyPopper size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-800">Content</h3>
                                <p className="text-neutral-500">Festivals & Events</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                        <button className="bg-neutral-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-amber-700 transition-all shadow-xl shadow-neutral-200 active:scale-95">
                            Explore Community <ArrowRight size={20} />
                        </button>
                        <div className="flex items-center gap-3 px-6 py-5 text-neutral-600 font-medium">
                            <Instagram size={20} className="text-neutral-400" /> @SilverSally750
                        </div>
                    </motion.div>
                </div>

                {/* Featured Image - Masked */}
                <motion.div
                    variants={itemVariants}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-amber-50 rounded-[4rem] -z-10 rotate-3" />
                    <div className="relative overflow-hidden rounded-[3.5rem] shadow-2xl">
                        <img
                            src="/sally/home_exterior.png"
                            alt="Sally's beautiful home"
                            className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                    {/* Floating Card */}
                    <div className="absolute -bottom-10 -right-10 md:-left-10 bg-white p-8 rounded-3xl shadow-xl max-w-[280px] border border-neutral-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">♥</div>
                            <div>
                                <h4 className="font-bold text-neutral-800 italic uppercase tracking-wider text-xs">Community Note</h4>
                                <p className="text-neutral-500 text-sm">Always a seat at the table</p>
                            </div>
                        </div>
                        <p className="text-neutral-700 text-sm leading-relaxed">"The best stories are the ones shared over a warm cup and a cool sunset on the farm."</p>
                    </div>
                </motion.div>
            </motion.main>

            {/* Dynamic Gallery */}
            <section id="gallery" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black tracking-tight text-neutral-900 mb-4 uppercase italic">From the Harvest</h2>
                        <div className="h-2 w-24 bg-amber-700 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { src: '/sally/cornfield_full.png', label: 'Golden Fields' },
                            { src: '/sally/cornfield_medium.png', label: 'Mid-Day Harvest' }
                        ].map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="overflow-hidden rounded-3xl shadow-lg mb-4">
                                    <img
                                        src={img.src}
                                        alt={img.label}
                                        className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 group-hover:text-amber-700 transition-colors">{img.label}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-neutral-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -z-0" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight italic">Rooted in <br /><span className="text-amber-500">tradition.</span></h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light">
                        Join us as we explore the best of rural life and seasonal celebrations.
                    </p>
                    <div className="text-xs font-black uppercase tracking-[0.5em] text-neutral-600 italic">hoosierillusions.com / sally</div>
                </div>
            </section>

            {/* Tiny Footer */}
            <footer className="py-12 border-t border-neutral-100 text-center">
                <p className="text-sm text-neutral-400">© 2026 Hoosier Illusions. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SallyPage;
