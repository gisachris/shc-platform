import React from 'react';
import SEO from '../components/SEO';
import Hero from "../components/mvpblocks/gradient-hero";
import Features from "../components/mvpblocks/feature-2";
import ProposalHighlights from "../components/ProposalHighlights";
import TestimonialsCarousel from "../components/mvpblocks/testimonials-carousel";
import FAQ from "../components/mvpblocks/faq-3";
import Sparkles from "../components/mvpblocks/sparkles-logo";

const Home = () => {
    return (
        <>
            <SEO 
                title="Smart Hybrid Conference Platform"
                description="A smart hybrid conference and event management platform designed for organizers, attendees, and destinations."
                url="/"
            />
            <Hero />
            <ProposalHighlights />
            <Features />
            <TestimonialsCarousel />
            <FAQ />
            <Sparkles />
        </>
    );
};

export default Home;
