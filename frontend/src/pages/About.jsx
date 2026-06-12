import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Background Gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(147,51,234,0.06) 0%, transparent 100%)' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            About <span className="text-primary-500">JobBoard</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-12 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            JobBoard connects ambitious talent with companies that move fast. We help professionals across India discover verified openings from active employers.
          </p>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Briefcase size={22} strokeWidth={1.8} />, label: 'Real Openings', desc: 'Listings verified directly from top recruiters and companies hiring in India.' },
              { icon: <Target size={22} strokeWidth={1.8} />, label: 'Smart Search', desc: 'Advanced filters by role type, location, and department category.' },
              { icon: <Users size={22} strokeWidth={1.8} />, label: 'For Everyone', desc: 'Providing equal opportunities for job seekers and powerful recruitment tools.' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="rounded-2xl p-6 border transition-all duration-300 shadow-sm"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}
              >
                <div className="category-icon-circle mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2 text-lg" style={{ color: 'var(--text-primary)' }}>{item.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mission Card */}
          <div 
            className="rounded-3xl border shadow-sm p-8 transition-all duration-300" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 4px 25px rgba(0,0,0,0.02)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="category-icon-circle">
                <Rocket size={22} strokeWidth={1.8} />
              </div>
              <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Our Mission</span>
            </div>
            <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
              We connect talent with opportunity — making job discovery simple, transparent, and focused on roles that matter right now. By bypassing complex recruitment silos, we help developers, designers, and managers land their dream jobs quickly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
