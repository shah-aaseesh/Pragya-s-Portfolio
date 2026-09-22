import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { PopupState } from "../types";
import { X, ArrowRight, ArrowLeft, ExternalLink, Mail, Linkedin, Github, MapPin, Heart } from "lucide-react";

interface PopupsProps {
  activePopup: PopupState;
  onClose: () => void;
  onNavigate: (state: PopupState) => void;
}

export function Popups({ activePopup, onClose, onNavigate }: PopupsProps) {
  
  const Overlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/10 z-40 backdrop-blur-[2px]"
      onClick={onClose}
    />
  );

  const Window = ({ 
    children, 
    title, 
    className = "",
    onBack,
    maxWidthClass = "max-w-4xl"
  }: { 
    children: ReactNode, 
    title?: string, 
    className?: string,
    onBack?: () => void,
    maxWidthClass?: string
  }) => (
      <div className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] sm:w-[92vw] ${maxWidthClass} max-h-[86vh] flex flex-col sketch-box p-3.5 sm:p-5 md:p-6 ${className}`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-ink/20 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onBack && (
              <button 
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 font-hand text-xs sm:text-sm md:text-base font-bold px-2.5 py-1 rounded-md bg-ink/5 hover:bg-ink hover:text-paper border border-ink/30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink flex-shrink-0"
                aria-label="Back to projects"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink" />
                <span className="text-ink">back</span>
              </button>
            )}
            {title && (
              <h2 className="font-hand text-base sm:text-xl md:text-2xl font-bold tracking-wide m-0 leading-tight truncate">{title}</h2>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 hover:bg-ink/10 rounded-full transition-colors -mr-1 text-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink flex-shrink-0"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="font-hand text-sm sm:text-base md:text-lg leading-[1.5] overflow-y-auto flex-1 custom-scrollbar pr-0.5 sm:pr-1">
          {children}
        </div>
      </div>
  );

  return (
    <>
      {activePopup !== 'NONE' && activePopup !== 'HANGUP' && <Overlay />}

      {activePopup === 'WHO' && (
        <Window title="W — WHO?">
          <p className="mb-4 text-xl">
            <strong>Pragya Silwal</strong><br/>
            Product person. Builder. Curious about why people do what they do — and how to make products they actually want to use.
          </p>
          <hr className="border-t border-ink/40 my-6" />
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="border border-ink px-2.5 py-1 text-xs tracking-wider uppercase font-retro font-bold">Product</span>
            <span className="border border-ink px-2.5 py-1 text-xs tracking-wider uppercase font-retro font-bold">Growth</span>
            <span className="border border-ink px-2.5 py-1 text-xs tracking-wider uppercase font-retro font-bold">Experimentation</span>
            <span className="border border-ink px-2.5 py-1 text-xs tracking-wider uppercase font-retro font-bold">AI</span>
            <span className="border border-ink px-2.5 py-1 text-xs tracking-wider uppercase font-retro font-bold">Consumer</span>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => onNavigate('PROJECTS')} className="px-5 py-2.5 sketch-box sketch-box-interactive hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-retro text-sm">
              View Projects
            </button>
            <button onClick={() => onNavigate('EXPERIENCE')} className="px-5 py-2.5 sketch-box sketch-box-interactive hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-retro text-sm">
              Experience
            </button>
            <button onClick={() => onNavigate('CONTACT')} className="px-5 py-2.5 sketch-box sketch-box-interactive hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-retro text-sm">
              Contact
            </button>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECTS' && (
        <Window title="A — WHAT HAVE YOU BUILT?" maxWidthClass="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
            {/* CardFit */}
            <div className="p-3 sm:p-4 sketch-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_CARDFIT')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#d9d1ef] border-2 border-ink rounded-lg flex items-center justify-center text-3xl font-retro mb-2.5 group-hover:scale-[1.02] transition-transform">
                    ▣
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <h3 className="font-hand text-xl font-bold group-hover:underline">CardFit</h3>
                    <span className="text-[10px] uppercase font-retro px-1.5 py-0.5 border border-ink/40 rounded bg-white font-bold">FinTech</span>
                    <span className="text-[10px] font-retro text-ink/70">Live</span>
                  </div>
                  <p className="text-xs sm:text-sm font-hand leading-[1.35] text-ink/80 mb-3 line-clamp-3">
                    Credit card discovery platform that uses live card data and a personalized ranking engine to help users find the right card.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-ink/15">
                <button 
                  onClick={() => onNavigate('PROJECT_CARDFIT')}
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive text-xs font-retro font-bold text-ink hover:bg-ink/10 transition-colors text-center cursor-pointer"
                >
                  Story →
                </button>
                <a 
                  href="https://cardfit.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive bg-white hover:bg-ink/10 transition-colors text-xs font-retro font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="Visit cardfit.me in new tab"
                >
                  <span className="text-ink">Visit</span>
                  <ExternalLink className="w-3 h-3 text-ink" />
                </a>
              </div>
            </div>

            {/* Noor Azaan */}
            <div className="p-3 sm:p-4 sketch-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_NOOR')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#cbddd5] border-2 border-ink rounded-lg flex items-center justify-center text-3xl font-retro mb-2.5 group-hover:scale-[1.02] transition-transform">
                    ⌂
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <h3 className="font-hand text-xl font-bold group-hover:underline">Noor Azaan</h3>
                    <span className="text-[10px] uppercase font-retro px-1.5 py-0.5 border border-ink/40 rounded bg-white font-bold">FaithTech</span>
                    <span className="text-[10px] font-retro text-ink/70">Live on iOS</span>
                  </div>
                  <p className="text-xs sm:text-sm font-hand leading-[1.35] text-ink/80 mb-3 line-clamp-3">
                    A modern lifestyle & prayer app for Gen Z Muslims designed for everyday routines. Currently live on the App Store!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-ink/15">
                <button 
                  onClick={() => onNavigate('PROJECT_NOOR')}
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive text-xs font-retro font-bold text-ink hover:bg-ink/10 transition-colors text-center cursor-pointer"
                >
                  Story →
                </button>
                <a 
                  href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive bg-white hover:bg-ink/10 transition-colors text-xs font-retro font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="View on App Store"
                >
                  <span className="text-ink">App Store</span>
                  <ExternalLink className="w-3 h-3 text-ink" />
                </a>
              </div>
            </div>

            {/* RateMySemesterAbroad */}
            <div className="p-3 sm:p-4 sketch-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_RMSA')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#e3dec9] border-2 border-ink rounded-lg flex items-center justify-center text-3xl font-retro mb-2.5 group-hover:scale-[1.02] transition-transform">
                    ▱
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <h3 className="font-hand text-xl font-bold group-hover:underline">RateMySemesterAbroad</h3>
                    <span className="text-[10px] uppercase font-retro px-1.5 py-0.5 border border-ink/40 rounded bg-white font-bold">EdTech</span>
                  </div>
                  <p className="text-xs sm:text-sm font-hand leading-[1.35] text-ink/80 mb-3 line-clamp-3">
                    Built a platform that helps students compare study abroad programs through verified reviews and first-hand experiences.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-ink/15">
                <button 
                  onClick={() => onNavigate('PROJECT_RMSA')}
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive text-xs font-retro font-bold text-ink hover:bg-ink/10 transition-colors text-center cursor-pointer"
                >
                  Story →
                </button>
                <a 
                  href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 sketch-box sketch-box-interactive bg-white hover:bg-ink/10 transition-colors text-xs font-retro font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="Read Haverford Feature"
                >
                  <span className="text-ink">Feature</span>
                  <ExternalLink className="w-3 h-3 text-ink" />
                </a>
              </div>
            </div>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_CARDFIT' && (
        <Window onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-3xl">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
            <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-[#d9d1ef] border-2 border-ink flex items-center justify-center font-bold text-ink text-2xl sm:text-3xl font-retro flex-shrink-0">
              ▣
            </span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">CardFit</h3>
              <p className="opacity-80 text-xs sm:text-base md:text-lg">
                <strong>Client:</strong> CardFit · <strong>Industry:</strong> FinTech · <strong>Timeline:</strong> Live<br/>
                <strong>Role:</strong> Founder, Product Manager & Product Designer
              </p>
            </div>
          </div>
          
          <div className="text-sm sm:text-base md:text-lg space-y-3 sm:space-y-4 mb-6 sm:mb-8 leading-relaxed">
            <p>Choosing a credit card is still surprisingly difficult. Most comparison sites rely on long lists, generic filters, and rankings that don't reflect individual needs.</p>
            <p>I built CardFit to make the process more intuitive by combining a searchable credit card directory with a ranking engine that adapts to different spending habits and preferences.</p>
            <p>I led the product end-to-end, defining the MVP, designing the user experience, building a web scraping pipeline to keep card data up to date, and developing the logic behind personalized card recommendations.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-ink" /> <span className="text-ink">Back to projects</span>
            </button>
            <a 
              href="https://cardfit.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-white text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="text-ink">Visit cardfit.me</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-ink" />
            </a>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_NOOR' && (
        <Window onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-3xl">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
            <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-[#cbddd5] border-2 border-ink flex items-center justify-center font-bold text-ink text-2xl sm:text-3xl font-retro flex-shrink-0">
              ⌂
            </span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">Noor Azaan</h3>
              <p className="opacity-80 text-xs sm:text-base md:text-lg">
                <strong>Client:</strong> Noor Azaan · <strong>Industry:</strong> Consumer Mobile · <strong>Timeline:</strong> Live<br/>
                <strong>Role:</strong> Founder, Product Manager & Product Designer
              </p>
            </div>
          </div>
          
          <div className="text-sm sm:text-base md:text-lg space-y-3 sm:space-y-4 mb-6 sm:mb-8 leading-relaxed">
            <p>After seeing friends interact with multiple Islamic apps, I noticed the same complaints kept coming up: the apps felt dated, cluttered, and weren't designed with younger users in mind.</p>
            <p>Most solved the functional problem of prayer times and Quran access, but not the experience of using them every day, especially for 20-something year old women. I experimented with building a modern, design-first app that fit naturally into people's daily routines.</p>
            <p>I led the product from concept to App Store launch - conducting user interviews, defining the MVP, designing the UI/UX, prioritizing features based on feedback, and integrating live APIs for prayer times, Quran, audio recitations, and Qibla.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-ink" /> <span className="text-ink">Back to projects</span>
            </button>
            <a 
              href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-white text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="text-ink">View on App Store</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-ink" />
            </a>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_RMSA' && (
        <Window onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-3xl">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
            <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-[#e3dec9] border-2 border-ink flex items-center justify-center font-bold text-ink text-2xl sm:text-3xl font-retro flex-shrink-0">
              ▱
            </span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">RateMySemesterAbroad</h3>
              <p className="opacity-80 text-xs sm:text-base md:text-lg">
                <strong>Client:</strong> Rate My Semester Abroad · <strong>Industry:</strong> EdTech, Travel · <strong>Timeline:</strong> 2025<br/>
                <strong>Role:</strong> Founder & Product Manager
              </p>
            </div>
          </div>
          
          <div className="text-sm sm:text-base md:text-lg space-y-3 sm:space-y-4 mb-6 sm:mb-8 leading-relaxed">
            <p>While planning to study abroad, I found that most university resources focused on logistics rather than the student experience. Information about academics, housing, cost of living, and campus culture was scattered across forums and social media, making it difficult to compare programs.</p>
            <p>I designed Rate My Semester Abroad as a centralized review platform where students can make informed decisions through authentic, structured insights from past participants.</p>
            <p>The project received $10,000 in venture funding and placed 2nd at the TriCo ProtoThon hosted by Girls Who Code which led to my selection as a Haverford Entrepreneurship Fellow.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-ink" /> <span className="text-ink">Back to projects</span>
            </button>
            <a 
              href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base md:text-lg sketch-box sketch-box-interactive bg-white text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="text-ink">Read Feature Article</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-ink" />
            </a>
          </div>
        </Window>
      )}

      {activePopup === 'EXPERIENCE' && (
        <Window title="B — WHERE HAVE YOU WORKED?" maxWidthClass="max-w-2xl">
          <div className="divide-y divide-ink/15">
            {[
              {
                role: 'AI Product Intern',
                company: 'Bryn Mawr Digital Technology Services',
                date: 'May 2026 – Jul 2026',
                badge: 'AI & Tech'
              },
              {
                role: 'Research Assistant',
                company: 'Econsult Solutions',
                date: 'Jan 2025 – May 2025',
                badge: 'Research'
              },
              {
                role: 'Strategy Intern',
                company: 'Paradigm Forum GmbH',
                date: 'Jun 2024 – Aug 2024',
                badge: 'Strategy'
              },
              {
                role: 'Program & Evaluation Lead',
                company: 'AfterSchool Programs',
                date: 'Jun 2025 – Present',
                badge: 'Leadership'
              },
              {
                role: 'President',
                company: 'South Asian Students',
                date: '2024 – 2025',
                badge: 'Community'
              }
            ].map((exp, i) => (
              <div 
                key={i} 
                className="py-2.5 sm:py-3 px-2 rounded hover:bg-ink/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-retro text-xs text-ink/40 font-bold">0{i + 1}</span>
                    <strong className="text-sm sm:text-base font-bold font-retro text-ink truncate">{exp.company}</strong>
                    <span className="text-[10px] uppercase font-retro px-1.5 py-0.5 border border-ink/30 rounded bg-white text-ink/70">
                      {exp.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-hand text-ink/80 mt-0.5 pl-6 sm:pl-6">{exp.role}</p>
                </div>
                <time className="text-[11px] sm:text-xs font-retro text-ink/70 whitespace-nowrap pl-6 sm:pl-0 self-start sm:self-center font-medium">
                  {exp.date}
                </time>
              </div>
            ))}
          </div>
        </Window>
      )}

      {activePopup === 'CONTACT' && (
        <Window title="2 — HOW DO I CONTACT YOU?">
          <div className="space-y-0">
            
            <div className="flex items-center gap-[14px] py-[13px] border-b border-[#aaa]">
              <div className="w-[30px] text-[21px] font-retro text-center">✉</div>
              <div>
                <strong className="block text-[14px] font-retro mb-[3px]">Email</strong>
                <a href="mailto:pragyasilwal@gmail.com" className="text-[12px] font-retro hover:underline">pragyasilwal@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-[14px] py-[13px] border-b border-[#aaa]">
              <div className="w-[30px] text-[21px] font-retro text-center font-bold">in</div>
              <div>
                <strong className="block text-[14px] font-retro mb-[3px]">LinkedIn</strong>
                <a href="https://linkedin.com/in/psilwal" target="_blank" rel="noreferrer" className="text-[12px] font-retro hover:underline">linkedin.com/in/psilwal</a>
              </div>
            </div>

            <div className="flex items-center gap-[14px] py-[13px] border-b border-[#aaa]">
              <div className="w-[30px] text-[21px] font-retro text-center font-bold">🌐</div>
              <div>
                <strong className="block text-[14px] font-retro mb-[3px]">Website</strong>
                <a href="https://pragyasilwal.com" target="_blank" rel="noreferrer" className="text-[12px] font-retro hover:underline">pragyasilwal.com</a>
              </div>
            </div>

            <div className="flex items-center gap-[14px] py-[13px] border-b border-[#aaa]">
              <div className="w-[30px] text-[21px] font-retro text-center">●</div>
              <div>
                <strong className="block text-[14px] font-retro mb-[3px]">GitHub</strong>
                <a href="https://github.com/captain737" target="_blank" rel="noreferrer" className="text-[12px] font-retro hover:underline">github.com/captain737</a>
              </div>
            </div>

            <p className="mt-8 text-base md:text-lg">
              Thanks for calling. Talk soon. ♡
            </p>

          </div>
        </Window>
      )}

    </>
  );
}
