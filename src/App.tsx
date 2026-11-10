import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Plane, 
  Copy, 
  Check, 
  Trophy, 
  ShieldCheck, 
  Code
} from 'lucide-react';

// Configuration
const MY_PHONE_NUMBER = '6282241913710';
const WHATSAPP_MESSAGE = "Right, I finished your quiz. Dua Lipa was completely rigged, but a deal is a deal—I’m claiming those unlimited hugs when we meet. But first, card game date tonight? 😉";
const FEEDBACK_PAUSE_MS = 2500; // Comfortable pause to read notes

type Step = 
  | 'start' 
  | 'q1_dualipa' 
  | 'q2_happiness' 
  | 'q3_lore' 
  | 'q4a_coffee' 
  | 'q4b_sleep' 
  | 'q4c_manutd' 
  | 'q_closing' 
  | 'loading' 
  | 'card_flip' 
  | 'final';

// Synthesized sound effects using Web Audio API
class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio context might be restricted
    }
  }

  public playWhoosh() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Silent catch
    }
  }

  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {
      // Silent catch
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Silent catch
    }
  }
}

const soundManager = new SoundFX();

// Ultra-fast, zero-freeze Dodging Button component
interface DodgeButtonProps {
  label: string;
  onDodge?: () => void;
  className?: string;
}

function DodgeButton({ label, onDodge, className = "" }: DodgeButtonProps) {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDodgeTime = useRef<number>(0);

  const triggerDodge = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    // Fast throttle to avoid event storm while keeping movement lightning-fast
    if (now - lastDodgeTime.current < 50) return;
    lastDodgeTime.current = now;

    soundManager.playWhoosh();
    onDodge?.();

    // Fast random jump vector ensuring large displacement away from current cursor
    const signs = [-1, 1];
    const signX = signs[Math.floor(Math.random() * 2)];
    const signY = signs[Math.floor(Math.random() * 2)];

    const jumpX = signX * (65 + Math.random() * 75);
    const jumpY = signY * (40 + Math.random() * 55);

    setPos({ x: jumpX, y: jumpY });
  };

  return (
    <button
      type="button"
      onPointerEnter={triggerDodge}
      onPointerDown={triggerDodge}
      onTouchStart={triggerDodge}
      onMouseMove={triggerDodge}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className={`w-full sm:w-44 py-3.5 px-6 rounded-2xl border border-stone-200 bg-stone-50 text-stone-600 font-semibold text-sm shadow-sm select-none cursor-pointer active:scale-95 touch-none ${className}`}
    >
      {label}
    </button>
  );
}

export default function App() {
  const [step, setStep] = useState<Step>('start');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>("Analyzing Compatibility...");
  const [loadingSubtext, setLoadingSubtext] = useState<string>("Cross-referencing coffee tolerance levels...");
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Toggle audio
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playPop();
  };

  const handleDodged = () => {
    setDodgeCount(prev => prev + 1);
  };

  // Helper for delayed question transition with comfortable reading pause
  const proceedWithFeedback = (text: string, nextStep: Step, confettiConfig?: confetti.Options) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFeedback(text);

    if (confettiConfig) {
      confetti(confettiConfig);
    }

    setTimeout(() => {
      setFeedback(null);
      setIsTransitioning(false);
      setStep(nextStep);
    }, FEEDBACK_PAUSE_MS);
  };

  // Step 1: Start Quiz
  const startQuiz = () => {
    soundManager.playPop();
    setFeedback(null);
    setDodgeCount(0);
    setStep('q1_dualipa');
  };

  // Round 1: Aldia chosen
  const handleAnswerQ1 = () => {
    soundManager.playChime();
    proceedWithFeedback(
      "Spot on. Good choice, top-tier taste.",
      'q2_happiness',
      {
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E11D48', '#FB7185', '#FDA4AF', '#FFE4E6']
      }
    );
  };

  // Round 2: Peak Happiness
  const handleAnswerQ2 = () => {
    soundManager.playPop();
    proceedWithFeedback(
      "10/10 answer. Honestly, you're a lucky guy.",
      'q3_lore',
      {
        particleCount: 45,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#F43F5E', '#10B981']
      }
    );
  };

  // Round 3: Lore Check
  const handleAnswerQ3 = () => {
    soundManager.playPop();
    proceedWithFeedback(
      "Confirmed. Identity verified, our brains are equally broken.",
      'q4a_coffee'
    );
  };

  // Round 4A: Coffee vs Aldia
  const handleAnswerQ4A = () => {
    soundManager.playPop();
    proceedWithFeedback(
      "Correct. Who needs caffeine when you have me keeping you awake anyway?",
      'q4b_sleep'
    );
  };

  // Round 4B: Sleep vs Aldia
  const handleAnswerQ4B = () => {
    soundManager.playPop();
    proceedWithFeedback(
      "Wise choice. Sleep is overrated, random 3 AM YouTube videos aren't helping you anyway.",
      'q4c_manutd'
    );
  };

  // Round 4C: Man United vs Aldia
  const handleAnswerQ4C = () => {
    soundManager.playChime();
    proceedWithFeedback(
      "Good choice. United would only break your heart this season anyway.",
      'q_closing',
      {
        particleCount: 85,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#E11D48', '#DC2626', '#FBBF24']
      }
    );
  };

  // Final Closing Question
  const handleAnswerClosing = (optId: 'A' | 'B' | 'C') => {
    soundManager.playPop();
    if (isTransitioning) return;
    setIsTransitioning(true);

    let feedbackMsg = "";
    if (optId === 'A') {
      feedbackMsg = "Caught in 4K. Put YouTube down and pay attention to me 😉";
    } else if (optId === 'B') {
      feedbackMsg = "Deal. Prepare to lose gracefully tonight 🃏";
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E11D48', '#F59E0B', '#10B981']
      });
    } else {
      feedbackMsg = "Top tier answer. My phone is waiting for your ring 📞";
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10B981', '#34D399', '#E11D48']
      });
    }

    setFeedback(feedbackMsg);

    setTimeout(() => {
      setFeedback(null);
      setIsTransitioning(false);
      setStep('loading');

      // Loading step sequence
      setTimeout(() => {
        setLoadingSubtext("Deducting 0.1% for Manchester United...");
      }, 1200);

      setTimeout(() => {
        setLoadingText("Card Fate Awaiting...");
        setLoadingSubtext("Preparing custom reward deck...");
      }, 2000);

      setTimeout(() => {
        setStep('card_flip');
      }, 2800);
    }, FEEDBACK_PAUSE_MS);
  };

  // Flip Mystery Card
  const handleFlipCard = () => {
    if (isCardFlipped) return;
    setIsCardFlipped(true);
    soundManager.playChime();
    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#E11D48', '#F43F5E', '#FB7185', '#F59E0B']
    });

    setTimeout(() => {
      soundManager.playSuccess();
      setStep('final');
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.5 },
      });
    }, 1300);
  };

  // Reset to Play Again
  const handleRestart = () => {
    soundManager.playPop();
    setIsCardFlipped(false);
    setFeedback(null);
    setIsTransitioning(false);
    setDodgeCount(0);
    setLoadingText("Analyzing Compatibility...");
    setLoadingSubtext("Cross-referencing coffee tolerance levels...");
    setStep('start');
  };

  // Copy WhatsApp link
  const handleCopyLink = () => {
    const waUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    navigator.clipboard.writeText(waUrl);
    setCopiedLink(true);
    soundManager.playPop();
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Step dots progress index calculation
  const getProgressIndex = (): number => {
    switch (step) {
      case 'start': return -1;
      case 'q1_dualipa': return 0;
      case 'q2_happiness': return 1;
      case 'q3_lore': return 2;
      case 'q4a_coffee': return 3;
      case 'q4b_sleep': return 4;
      case 'q4c_manutd': return 5;
      case 'q_closing': return 6;
      default: return 7;
    }
  };

  const progressIdx = getProgressIndex();

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900 flex flex-col items-center justify-between p-4 sm:p-6 selection:bg-rose-100 selection:text-rose-900 font-sans">
      
      {/* Top Header Controls */}
      <header className="w-full max-w-lg flex items-center justify-between py-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span className="text-xs font-bold text-stone-700 tracking-tight">Your Favourite Distraction</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title={soundOn ? "Mute audio" : "Enable audio"}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            aria-label="Export Single File Code"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            title="View Standalone HTML Code & Netlify Drop Guide"
          >
            <Code className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">HTML Code</span>
          </button>
        </div>
      </header>

      {/* Main Container Card */}
      <main className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-6 sm:p-9 relative overflow-hidden transition-all duration-300">
        
        {/* Progress Bar (Visible during questions) */}
        {progressIdx >= 0 && progressIdx <= 6 && (
          <div className="mb-6 flex justify-center items-center gap-1.5" aria-label={`Step ${progressIdx + 1} of 7`}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i <= progressIdx ? 'w-4 bg-stone-900' : 'w-2 bg-stone-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* ================= SCREEN 0: START ================= */}
        {step === 'start' && (
          <section className="text-center py-4 animate-fadeIn">
            <span className="inline-block py-1 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide uppercase mb-6">
              Curated Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
              Your Favourite Distraction
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium italic mb-6">
              (Specially calibrated for busy men who can't function without morning coffee)
            </p>
            <div className="h-px w-16 bg-stone-200 mx-auto mb-6" />
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 px-2">
              "Think you’re a 10/10 catch? Take this quick 2-minute test to see if you qualify for Aldia’s time."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startQuiz}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                Start The Test
              </button>
            </div>
          </section>
        )}

        {/* ================= SCREEN 1: QUESTION 1 (DUA LIPA) ================= */}
        {step === 'q1_dualipa' && (
          <section className="text-center py-2 animate-fadeIn">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Round 1</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-8 leading-snug">
              Who is objectively the most stunning girl on planet Earth?
            </h2>

            <div className="relative min-h-[160px] flex flex-col sm:flex-row items-center justify-center gap-4 p-2">
              <DodgeButton label="Dua Lipa" onDodge={handleDodged} />

              <button
                onClick={handleAnswerQ1}
                disabled={isTransitioning}
                className="w-full sm:w-44 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all active:scale-95 cursor-pointer z-10 disabled:opacity-80"
              >
                Aldia ✨
              </button>
            </div>

            {dodgeCount > 0 && !feedback && (
              <p className="text-[11px] text-stone-400 italic mt-3 animate-fadeIn">
                (Nice try! That button has evasive maneuvers enabled 😉)
              </p>
            )}

            {feedback && (
              <div className="mt-6 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-rose-700">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= SCREEN 2: QUESTION 2 (PEAK HAPPINESS) ================= */}
        {step === 'q2_happiness' && (
          <section className="py-2 animate-fadeIn">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2 text-center">Round 2</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 text-center leading-snug">
              What is scientifically proven to bring absolute joy to your life?
            </h2>
            <p className="text-xs text-stone-400 text-center italic mb-6">
              (Spoiler: There are no wrong answers here)
            </p>

            <div className="space-y-3">
              <button
                onClick={handleAnswerQ2}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm flex items-center justify-between transition-all group cursor-pointer disabled:opacity-80"
              >
                <span>A) Playing cards with Aldia</span>
                <span className="text-lg group-hover:scale-110 transition-transform">🃏</span>
              </button>
              <button
                onClick={handleAnswerQ2}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm flex items-center justify-between transition-all group cursor-pointer disabled:opacity-80"
              >
                <span>B) Playing Monopoly with Aldia</span>
                <span className="text-lg group-hover:scale-110 transition-transform">🎲</span>
              </button>
              <button
                onClick={handleAnswerQ2}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm flex items-center justify-between transition-all group cursor-pointer disabled:opacity-80"
              >
                <span>C) Eating cookies with Aldia</span>
                <span className="text-lg group-hover:scale-110 transition-transform">🍪</span>
              </button>
              <button
                onClick={handleAnswerQ2}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm flex items-center justify-between transition-all group cursor-pointer disabled:opacity-80"
              >
                <span>D) All of the above, obviously</span>
                <span className="text-lg group-hover:scale-110 transition-transform">✨</span>
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-rose-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= SCREEN 3: QUESTION 3 (LORE CHECK) ================= */}
        {step === 'q3_lore' && (
          <section className="py-2 animate-fadeIn">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2 text-center">Round 3</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 text-center leading-snug">
              Quick check: Which of the following topics do we have entirely too much lore on?
            </h2>

            <div className="space-y-3">
              {[
                'A) Frank', 
                'B) Squishy', 
                'C) My favourite candy', 
                'D) All of the above, we are actually ridiculous'
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={handleAnswerQ3}
                  disabled={isTransitioning}
                  className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all cursor-pointer disabled:opacity-80"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-stone-100 border border-stone-200 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-stone-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= SCREEN 4A: LOYALTY GAUNTLET 1 (COFFEE) ================= */}
        {step === 'q4a_coffee' && (
          <section className="text-center py-2 animate-fadeIn">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">The Loyalty Test (1/3)</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-8 leading-snug">
              Make your choice: The ultimate morning dilemma.
            </h2>

            <div className="relative min-h-[160px] flex flex-col sm:flex-row items-center justify-center gap-4 p-2">
              <DodgeButton label="Morning Coffee ☕" onDodge={handleDodged} />
              
              <button
                onClick={handleAnswerQ4A}
                disabled={isTransitioning}
                className="w-full sm:w-44 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer z-10 disabled:opacity-80"
              >
                Aldia ✨
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-stone-100 border border-stone-200 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-stone-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= SCREEN 4B: LOYALTY GAUNTLET 2 (SLEEP) ================= */}
        {step === 'q4b_sleep' && (
          <section className="text-center py-2 animate-fadeIn">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">The Loyalty Test (2/3)</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-8 leading-snug">
              Pick one, no hesitations:
            </h2>

            <div className="relative min-h-[160px] flex flex-col sm:flex-row items-center justify-center gap-4 p-2">
              <DodgeButton label="8 Hours of Sleep 😴" onDodge={handleDodged} />

              <button
                onClick={handleAnswerQ4B}
                disabled={isTransitioning}
                className="w-full sm:w-44 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer z-10 disabled:opacity-80"
              >
                Aldia ✨
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-stone-100 border border-stone-200 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-stone-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= SCREEN 4C: LOYALTY GAUNTLET 3 (MAN UTD) ================= */}
        {step === 'q4c_manutd' && (
          <section className="text-center py-2 animate-fadeIn">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">The Loyalty Test (3/3)</span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-8 leading-snug">
              The ultimate test of loyalty. Be very careful here:
            </h2>

            <div className="relative min-h-[160px] flex flex-col sm:flex-row items-center justify-center gap-4 p-2">
              <DodgeButton label="Manchester United ⚽" onDodge={handleDodged} className="sm:w-48" />

              <button
                onClick={handleAnswerQ4C}
                disabled={isTransitioning}
                className="w-full sm:w-44 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all active:scale-95 cursor-pointer z-10 disabled:opacity-80"
              >
                Aldia ✨
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-rose-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= CLOSING SCREEN: FINAL QUESTION ================= */}
        {step === 'q_closing' && (
          <section className="py-2 animate-fadeIn">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2 text-center">
              Final Question
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 text-center leading-snug">
              So, what is that cute guy actually doing tonight?
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswerClosing('A')}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all cursor-pointer disabled:opacity-80 flex items-center justify-between group"
              >
                <span>A) Pretending to be 'too busy' while falling down a YouTube videos</span>
                <span className="text-lg group-hover:scale-110 transition-transform">📱</span>
              </button>
              <button
                onClick={() => handleAnswerClosing('B')}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all cursor-pointer disabled:opacity-80 flex items-center justify-between group"
              >
                <span>B) Playing a game of cards with Aldia and losing gracefully</span>
                <span className="text-lg group-hover:scale-110 transition-transform">🃏</span>
              </button>
              <button
                onClick={() => handleAnswerClosing('C')}
                disabled={isTransitioning}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all cursor-pointer disabled:opacity-80 flex items-center justify-between group"
              >
                <span>C) Taking a break and ringing me right now</span>
                <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl animate-fadeIn text-center">
                <p className="text-sm font-semibold text-rose-700 italic">
                  {feedback}
                </p>
              </div>
            )}
          </section>
        )}


        {/* ================= SCREEN 6: LOADING ================= */}
        {step === 'loading' && (
          <section className="py-14 text-center animate-fadeIn">
            <div className="inline-block w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-6" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">{loadingText}</h3>
            <p className="text-xs text-stone-500 font-medium">{loadingSubtext}</p>
          </section>
        )}

        {/* ================= SCREEN 7: CARD FLIP ================= */}
        {step === 'card_flip' && (
          <section className="text-center py-6 animate-fadeIn">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">Mystery Card</span>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Pick a card to see what that cute guy gets...</h3>
            <p className="text-xs text-stone-400 mb-8">Tap the card to reveal your fate</p>

            <div 
              className="perspective-1000 w-44 h-64 mx-auto cursor-pointer"
              onClick={handleFlipCard}
            >
              <div 
                className={`relative w-full h-full transform-style-3d transition-transform duration-700 shadow-xl rounded-2xl ${
                  isCardFlipped ? 'rotate-y-180' : 'hover:scale-105 transition-transform'
                }`}
              >
                {/* Card Back */}
                <div className="absolute inset-0 w-full h-full bg-rose-600 rounded-2xl border-4 border-white flex flex-col items-center justify-center p-4 backface-hidden shadow-md">
                  <div className="w-full h-full border border-rose-400/50 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-5xl text-white mb-2">♠️</span>
                    <span className="text-[10px] uppercase font-bold text-rose-100 tracking-wider">Tap To Flip</span>
                  </div>
                </div>

                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-stone-200 flex flex-col justify-between p-4 backface-hidden rotate-y-180">
                  <div className="text-left text-rose-600 font-bold text-lg font-mono">A ♥</div>
                  <div className="text-center">
                    <span className="text-4xl block mb-1">🏆</span>
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-tight block">Grand Prize</span>
                    <span className="text-[10px] text-stone-400 font-semibold">Unlocked</span>
                  </div>
                  <div className="text-right text-rose-600 font-bold text-lg font-mono rotate-180">A ♥</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SCREEN 8: FINAL RESULT (PURE GRAND PRIZE) ================= */}
        {step === 'final' && (
          <section className="text-center py-2 animate-fadeIn">
            <div className="mb-6">
              <span className="inline-block py-1 px-3.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-2">
                Compatibility Verified
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight font-mono">99.9%</h2>
              <p className="text-xs text-stone-400 font-medium mt-1">
                *(Deducted 0.1% because you support Manchester United)*
              </p>
            </div>

            {/* Pure Grand Prize Showcase Card */}
            <div className="bg-stone-50/80 border border-stone-200 rounded-3xl p-6 mb-6 text-center relative shadow-sm">
              <div className="w-12 h-12 bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Trophy className="w-6 h-6 text-rose-600" />
              </div>
              
              <span className="font-mono text-[11px] text-rose-600 font-bold uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 inline-block mb-2">
                Official Grand Prize
              </span>

              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug mb-2">
                Unlimited Hugs When We Finally Meet
              </h3>
              
              <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto leading-relaxed">
                Terms: Non-refundable, non-transferable, and strictly zero dodging allowed like the Dua Lipa button.
              </p>

              <div className="pt-3 border-t border-stone-200/80 text-left bg-white/70 p-3.5 rounded-2xl">
                <p className="text-xs text-stone-800 font-bold mb-1 flex items-center gap-1.5">
                  <span>🃏</span>
                  <span>To claim this grand prize:</span>
                </p>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Since we're on different islands, this voucher is only valid once you play an online card game date with me. No excuses about being "busy" accepted.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 mb-6">
              <a
                href={`https://wa.me/${MY_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Accept Card Game Challenge on WhatsApp →</span>
              </a>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "WhatsApp Link Copied!" : "Copy WhatsApp Link"}</span>
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>

            {/* Distance Tracker Widget */}
            <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-1.5">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-stone-600 font-medium">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  Distance: <strong>960 km (Jakarta ⇄ Bali)</strong>
                </span>
                <span className="text-stone-300">|</span>
                <span className="flex items-center gap-1 text-stone-600 font-medium">
                  <Plane className="w-3 h-3 text-sky-500" />
                  Flight Time: <strong>1h 50m</strong>
                </span>
              </div>
              <p className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                Valid excuses for that cute guy not to ring me: <strong className="text-rose-600">0 remaining</strong>
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-lg mt-4 text-center text-xs text-stone-400 space-y-1">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by Aldia for That Cute Guy
        </p>
      </footer>

      {/* Standalone Export & Deployment Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">Ready-To-Share Netlify Drop Guide</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <p className="font-medium text-stone-800">
                You can share this live app link directly right now, or deploy a standalone <code>index.html</code> file to <strong>Netlify Drop</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-stone-700">
                <li>Open <strong>app.netlify.com/drop</strong> in your browser.</li>
                <li>Drag and drop the ready <code>index.html</code> file.</li>
                <li>Get an instant free live URL (e.g. <em>your-distraction.netlify.app</em>).</li>
                <li>Send it to him on WhatsApp!</li>
              </ol>

              <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-stone-700">
                <span className="font-bold text-rose-700 block mb-0.5">Suggested WhatsApp Opener to Him:</span>
                <p className="italic text-[11px] text-stone-600">
                  "I was bored and messing around building this silly little quiz, have a go and tell me what score you get lol"
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
