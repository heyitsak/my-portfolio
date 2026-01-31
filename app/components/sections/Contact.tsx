'use client';

import { siteConfig, contactContent } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';
import { GitHubIcon, LinkedInIcon, TwitterIcon, MailIcon, CoffeeIcon } from '@/app/components/ui/SocialIcons';

export function Contact() {
  return (
    <ScrollReveal>
      <section id="contact" className="pb-20 scroll-mt-24">
        <SectionHeading>Get in touch</SectionHeading>

        <div className="space-y-10">
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            {contactContent}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Email Button */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)] active:translate-y-0 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <MailIcon className="w-5 h-5 relative" />
              <span className="relative font-display font-semibold">Send an email</span>
            </a>

            {/* Buy Me a Coffee Button */}
            <a
              href={siteConfig.social.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#FFDD00] hover:bg-[#FFED4E] text-black font-display font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_40px_-10px_rgba(255,221,0,0.4)] active:translate-y-0 active:scale-[0.98]"
            >
              <CoffeeIcon className="w-5 h-5" />
              Buy me a coffee
            </a>
          </div>

          {/* Footer */}
          <footer className="pt-16 mt-16 border-t border-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <SocialLink href={siteConfig.social.github} label="GitHub">
                  <GitHubIcon />
                </SocialLink>
                <SocialLink href={siteConfig.social.linkedin} label="LinkedIn">
                  <LinkedInIcon />
                </SocialLink>
                <SocialLink href={siteConfig.social.twitter} label="Twitter">
                  <TwitterIcon />
                </SocialLink>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </ScrollReveal>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 hover:scale-110"
    >
      {children}
    </a>
  );
}
