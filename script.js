import { useState, useEffect, useRef, useCallback } from "react";

// ===========================
// AMBIENT MUSIC ENGINE
// Uses Web Audio API — no files, works everywhere
// ===========================

function useAmbientMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdxRef = useRef(0);

  // Romantic pentatonic melody (C major pentatonic)
  const MELODY = [523.25, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25,
                  523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 392.00, 523.25];
  const BASS   = [130.81, 130.81, 164.81, 174.61];

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0;
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  };

  const playNote = useCallback((freq: number, duration: number, time: number, type: OscillatorType = "sine", gainVal = 0.08) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = 1800;
    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current!);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.06);
    gain.gain.setValueAtTime(gainVal, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }, []);

  const scheduleMeasure = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const bpm = 72;
    const beat = 60 / bpm;
    const measure = beat * 4;

    // Pad chords (soft background)
    const CHORDS = [
      [261.63, 329.63, 392.00],  // C maj
      [293.66, 369.99, 440.00],  // D min
      [349.23, 440.00, 523.25],  // F maj
      [392.00, 493.88, 587.33],  // G maj
    ];
    const chord = CHORDS[noteIdxRef.current % CHORDS.length];
    chord.forEach(f => playNote(f, measure * 0.9, now, "sine", 0.04));

    // Melody note
    const melFreq = MELODY[noteIdxRef.current % MELODY.length];
    playNote(melFreq, beat * 0.7, now + beat * 0.5, "sine", 0.06);
    playNote(melFreq * 2, beat * 0.4, now + beat * 1.5, "sine", 0.03);

    // Soft bass
    const bassFreq = BASS[noteIdxRef.current % BASS.length];
    playNote(bassFreq, beat * 1.2, now, "sine", 0.07);

    noteIdxRef.current++;
    schedulerRef.current = setTimeout(scheduleMeasure, measure * 950);
  }, [playNote]);

  const start = useCallback(async () => {
    const ctx = getCtx();
    if (ctx.state === "suspended") await ctx.resume();
    masterGainRef.current!.gain.cancelScheduledValues(ctx.currentTime);
    masterGainRef.current!.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    scheduleMeasure();
    setPlaying(true);
  }, [scheduleMeasure]);

  const stop = useCallback(() => {
    if (schedulerRef.current) clearTimeout(schedulerRef.current);
    const ctx = ctxRef.current;
    if (ctx && masterGainRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    }
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop(); else start();
  }, [playing, start, stop]);

  useEffect(() => () => {
    if (schedulerRef.current) clearTimeout(schedulerRef.current);
    ctxRef.current?.close();
  }, []);

  return { playing, toggle };
}

function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={playing ? "Pause music" : "Play music"}
      style={{
        position: "fixed",
        bottom: "1.2rem",
        right: "1.2rem",
        zIndex: 999,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.5)",
        background: playing
          ? "linear-gradient(135deg, #ff6b9d, #ff4081)"
          : "rgba(255,255,255,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        fontSize: "1.3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: playing
          ? "0 4px 20px rgba(255,64,129,0.5), 0 0 0 4px rgba(255,107,157,0.15)"
          : "0 4px 16px rgba(0,0,0,0.1)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: playing ? "musicPulse 2s ease-in-out infinite" : "none",
      }}
    >
      {playing ? "🎵" : "🔇"}
    </button>
  );
}

type Screen =
  | "cinematic"
  | "screen1"
  | "screen2"
  | "screen3"
  | "yes-sequence"
  | "date-planner"
  | "complimentary"
  | "confirming"
  | "vip-pass";

const TYPEWRITER_TEXT = `You know what's strange?

Some people walk into your world quietly — no grand entrance, no dramatic music — just... there. And suddenly everything feels a little warmer.

That's kind of what happened with you.

You didn't try to be memorable. You just... were.

And now here I am, writing this little letter, wondering if maybe — just maybe — you'd want to make one tiny memory together? 🌸`;

const NO_REACTIONS = [
  { btn: "No 🙈",        reason: "Okay but... your smile while reading this said otherwise 😏" },
  { btn: "Still no 😅",  reason: "You literally re-read that twice. Your heart knows 💓" },
  { btn: "Nope 🙃",      reason: "I'm not nervous asking. I just really want it to be you 🌹" },
  { btn: "No way 😤",    reason: "Fine, I'll just write you another letter. And another. 💌" },
  { btn: "Nah 😒",       reason: "You're the only person I'd embarrass myself like this for 🥺" },
  { btn: "Hmm no 🫣",    reason: "One evening. That's all. I promise to make it unforgettable ✨" },
  { btn: "Nooo 😭",      reason: "Your stubbornness is honestly adorable. Say yes. Please. 💕" },
];

const YES_TEXTS = [
  "YES ❤️",
  "Yes, let's! 🌸",
  "Okay yes, let's go 💗",
  "Yes! Take me out! 🌹",
  "Yesss, finally! 💕",
  "Of course yes! 🎉",
  "YES! I'm all yours 💌",
];

const COMPLIMENTARIES = [
  { id: "hands",    emoji: "🤝", label: "Holding Hands",  compulsory: true  },
  { id: "hug",      emoji: "🤗", label: "A Warm Hug",     compulsory: false },
  { id: "kiss",     emoji: "💋", label: "A Sweet Kiss",   compulsory: false },
  { id: "waist",    emoji: "🫶", label: "Holding Waist",  compulsory: false },
  { id: "forehead", emoji: "🥰", label: "Forehead Kiss",  compulsory: false },
  { id: "cheek",    emoji: "😘", label: "Cheek Kiss",     compulsory: false },
];

const ACTIVITIES = [
  { emoji: "☕", name: "Coffee Date" },
  { emoji: "🍕", name: "Food Date" },
  { emoji: "🌇", name: "Sunset Walk" },
  { emoji: "🎬", name: "Movie" },
  { emoji: "🎳", name: "Bowling" },
  { emoji: "🍦", name: "Ice Cream" },
  { emoji: "🚗", name: "Long Drive" },
  { emoji: "📚", name: "Bookstore + Coffee" },
  { emoji: "🌸", name: "You Surprise Me" },
];


function BirdSVG() {
  return (
    <svg className="bird-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="48" rx="22" ry="13" fill="#ff6b9d" />
      <circle cx="85" cy="38" r="12" fill="#ff6b9d" />
      <polygon points="97,36 108,33 97,40" fill="#ffd700" />
      <circle cx="90" cy="35" r="3" fill="#fff" />
      <circle cx="91" cy="35" r="1.5" fill="#333" />
      <ellipse className="bird-wing-left" cx="50" cy="36" rx="24" ry="9" fill="#ff4081" style={{ transformOrigin: "70px 48px" }} />
      <ellipse className="bird-wing-right" cx="50" cy="60" rx="24" ry="9" fill="#e91e63" style={{ transformOrigin: "70px 48px" }} />
      <polygon points="38,45 20,38 20,55" fill="#c2185b" />
    </svg>
  );
}

function EnvelopeSVG() {
  return (
    <svg className="envelope-svg" viewBox="0 0 48 36" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="46" height="34" rx="4" fill="#fff9c4" stroke="#ffd700" strokeWidth="1.5" />
      <path d="M1,1 L24,20 L47,1" stroke="#ffd700" strokeWidth="1.5" fill="none" />
      <path d="M1,35 L17,18" stroke="#ffe082" strokeWidth="1.2" />
      <path d="M47,35 L31,18" stroke="#ffe082" strokeWidth="1.2" />
      <text x="24" y="28" textAnchor="middle" fontSize="8" fill="#e91e63">♥</text>
    </svg>
  );
}

function FloatingParticles() {
  const particles = ["✨", "🌸", "💫", "⭐", "🌺", "💕", "🌷", "✿"];
  return (
    <div className="particles-container">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${6 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 8}s`,
            fontSize: `${0.7 + Math.random() * 0.8}rem`,
          }}
        >
          {particles[i % particles.length]}
        </div>
      ))}
    </div>
  );
}

function BackgroundHearts() {
  const hearts = ["❤️", "🩷", "💖", "💗", "💓", "💝"];
  return (
    <div className="bg-hearts">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-heart"
          style={{
            left: `${5 + i * 9.5}%`,
            animationDuration: `${10 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            fontSize: `${0.8 + Math.random() * 0.8}rem`,
          }}
        >
          {hearts[i % hearts.length]}
        </div>
      ))}
    </div>
  );
}

function CinematicScreen({ onOpen }: { onOpen: () => void }) {
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="cinematic-screen cinematic-bg" style={{ cursor: "default" }}>
        <div className="sky" />
        <div className="clouds" />
        <FloatingParticles />
        <div style={{ textAlign: "center", zIndex: 25, position: "relative", padding: "2rem 1.5rem" }}>
          <span style={{ fontSize: "5rem", display: "block", marginBottom: "0.8rem", filter: "drop-shadow(0 0 20px rgba(255,107,157,0.8))", animation: "letterOpenPulse 1.5s ease-in-out infinite alternate" }}>💌</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 7vw, 3.2rem)", fontWeight: 800, background: "linear-gradient(135deg, #c2185b, #ff6b9d, #ffd700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.5rem" }}>
            One Tiny Question ❤️
          </h1>
          <p style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", color: "rgba(120, 40, 60, 0.75)", fontWeight: 300, fontStyle: "italic", marginBottom: "1.5rem", padding: "0 1rem" }}>
            Some feelings don't need perfect timing... just the right moment.
          </p>
          <button className="open-letter-btn" style={{ opacity: 1, animation: "btnPulse 2s ease-in-out infinite" }} onClick={onOpen}>
            Open My Letter 💌
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cinematic-screen cinematic-bg" onClick={() => setSkipped(true)} style={{ cursor: "pointer" }}>
      <div className="sky" />
      <div className="clouds" />
      <div className="bird-container">
        <BirdSVG />
        <div className="envelope">
          <EnvelopeSVG />
        </div>
      </div>
      <div className="poetic-text-wrapper">
        <div className="poetic-text poetic-text-1">"You're late again..."</div>
        <div className="poetic-text poetic-text-2">"But I waited."</div>
        <div className="poetic-text poetic-text-3">"Because some messages are worth waiting for."</div>
      </div>
      <div className="letter-drop">
        <span className="letter-icon">💌</span>
        <div className="cinematic-title">
          <h1>One Tiny Question ❤️</h1>
          <p>Some feelings don't need perfect timing... just the right moment.</p>
        </div>
        <button className="open-letter-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          Open My Letter 💌
        </button>
      </div>
      <FloatingParticles />
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
        fontSize: "0.75rem", color: "rgba(120,40,60,0.5)", fontStyle: "italic", zIndex: 30,
        pointerEvents: "none", animation: "poeticAppear 1s ease forwards", animationDelay: "1s", opacity: 0,
      }}>
        Tap anywhere to skip ✨
      </div>
    </div>
  );
}

function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <div className="screen romantic-bg screen-enter">
      <BackgroundHearts />
      <div className="glass-card">
        <span className="screen1-emoji">💌</span>
        <h1 className="screen1-title">Hey you... 👀<br />Yes, you.</h1>
        <p className="screen1-text">
          I know you didn't expect this little letter to find you today. But here it is — delivered by a very determined bird who refused to give up, no matter how long it took.
          <br /><br />
          Maybe the universe has decent timing after all. 🌸
        </p>
        <button className="primary-btn" onClick={onNext}>Tap Here ❤️</button>
      </div>
    </div>
  );
}

function Screen2({ onNext }: { onNext: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setIsDone(false);

    const typeNext = () => {
      if (indexRef.current < TYPEWRITER_TEXT.length) {
        setDisplayedText(TYPEWRITER_TEXT.slice(0, indexRef.current + 1));
        indexRef.current++;
        const delay = TYPEWRITER_TEXT[indexRef.current - 1] === "\n" ? 60 : 28;
        timerRef.current = setTimeout(typeNext, delay);
      } else {
        setIsDone(true);
      }
    };

    timerRef.current = setTimeout(typeNext, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const skipToEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(TYPEWRITER_TEXT);
    setIsDone(true);
    indexRef.current = TYPEWRITER_TEXT.length;
  }, []);

  return (
    <div className="screen romantic-bg screen-enter">
      <BackgroundHearts />
      <div className="glass-card" style={{ maxWidth: "460px" }}>
        <div className="typewriter-container">
          <h2 className="typewriter-title">A Little Story... 📖</h2>
          <p className="typewriter-text">
            {displayedText}
            {!isDone && <span className="cursor" />}
          </p>
        </div>
        {!isDone && (
          <button
            className="primary-btn"
            style={{ marginTop: "1.2rem", background: "rgba(255,107,157,0.3)", color: "#8b1a4a", boxShadow: "none", border: "1.5px solid rgba(255,107,157,0.4)", fontSize: "0.85rem", padding: "0.6rem 1.4rem", maxWidth: 180 }}
            onClick={skipToEnd}
          >
            Skip →
          </button>
        )}
        {isDone && (
          <button className="primary-btn" style={{ marginTop: "1.2rem" }} onClick={onNext}>
            I'm ready 💗
          </button>
        )}
      </div>
    </div>
  );
}

function Screen3({ onYes }: { onYes: () => void }) {
  const [noClicks, setNoClicks] = useState(0);
  const [noScale, setNoScale]   = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [noVisible, setNoVisible] = useState(true);
  const [noPos, setNoPos]   = useState({ x: 0, y: 0 });
  const [noJiggle, setNoJiggle] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const [showReason, setShowReason] = useState(false);

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);
    setNoJiggle(true);
    setTimeout(() => setNoJiggle(false), 500);

    const reaction = NO_REACTIONS[Math.min(next - 1, NO_REACTIONS.length - 1)];
    setReasonText(reaction.reason);
    setShowReason(false);
    setTimeout(() => setShowReason(true), 80);

    const newScale = Math.max(0.12, 1 - next * 0.12);
    setNoScale(newScale);
    setYesScale(Math.min(1.55, 1 + next * 0.08));

    const angle = Math.random() * Math.PI * 2;
    const dist  = 50 + Math.random() * 90;
    setNoPos(prev => ({
      x: prev.x + Math.cos(angle) * dist,
      y: prev.y + Math.sin(angle) * dist,
    }));

    if (next >= NO_REACTIONS.length || newScale <= 0.15) {
      setTimeout(() => setNoVisible(false), 500);
    }
  };

  const yesLabel = YES_TEXTS[Math.min(noClicks, YES_TEXTS.length - 1)];

  return (
    <div className="screen romantic-bg screen-enter">
      <BackgroundHearts />
      <div className="glass-card" style={{ overflow: "visible", minHeight: 320 }}>
        <span className="question-emoji">🌹</span>
        <h1 className="question-title">Will you go on a cute little date with me?</h1>
        <p className="question-sub">No pressure. But also… a little pressure. 🥺</p>

        {/* Flirty reason bubble */}
        <div
          className="no-reason-bubble"
          style={{
            opacity: showReason && reasonText ? 1 : 0,
            transform: showReason && reasonText ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
          }}
        >
          {reasonText}
        </div>

        {/* Button row */}
        <div style={{ position: "relative", minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1rem" }}>
          <button
            className="yes-btn"
            style={{
              transform: `scale(${yesScale})`,
              boxShadow: `0 6px ${20 + yesScale * 12}px rgba(255,64,129,${Math.min(0.85, 0.4 + (yesScale - 1) * 0.3)})`,
              transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s",
              zIndex: 5, position: "relative", whiteSpace: "nowrap",
            }}
            onClick={onYes}
          >
            {yesLabel}
          </button>

          {noVisible && (
            <button
              className={`hmm-btn${noJiggle ? " hmm-jiggle" : ""}`}
              style={{
                position: "absolute",
                transform: `translate(${noPos.x}px, ${noPos.y}px) scale(${noScale})`,
                opacity: noScale,
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s",
                pointerEvents: noScale <= 0.18 ? "none" : "auto",
                whiteSpace: "nowrap", zIndex: 4,
              }}
              onClick={handleNoClick}
            >
              {NO_REACTIONS[Math.min(noClicks, NO_REACTIONS.length - 1)].btn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplimentaryScreen({ onConfirm }: { onConfirm: (picks: string[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["hands"]));
  const [nudge, setNudge] = useState(false);

  const toggle = (id: string) => {
    if (id === "hands") return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setNudge(false);
  };

  const handleConfirm = () => {
    if (selected.has("hug") && !selected.has("kiss") && !selected.has("forehead") && !selected.has("cheek")) {
      setNudge(true);
      return;
    }
    onConfirm(Array.from(selected));
  };

  return (
    <div className="screen romantic-bg screen-enter">
      <BackgroundHearts />
      <div className="glass-card" style={{ maxWidth: 440 }}>
        <span style={{ fontSize: "2.8rem", display: "block", marginBottom: "0.5rem" }}>🎁</span>
        <h2 className="question-title" style={{ fontSize: "clamp(1.15rem,5vw,1.6rem)", marginBottom: "0.3rem" }}>
          Pick Your Promised Complimentaries
        </h2>
        <p className="question-sub" style={{ marginBottom: "1.2rem" }}>These come included with your date 😉</p>

        <div className="comp-grid">
          {COMPLIMENTARIES.map(c => (
            <button
              key={c.id}
              className={`comp-card${selected.has(c.id) ? " comp-selected" : ""}${c.compulsory ? " comp-compulsory" : ""}`}
              onClick={() => toggle(c.id)}
            >
              <span className="comp-emoji">{c.emoji}</span>
              <span className="comp-label">{c.label}</span>
              {c.compulsory && <span className="comp-badge">Always ✓</span>}
              {selected.has(c.id) && !c.compulsory && <span className="comp-check">✓</span>}
            </button>
          ))}
        </div>

        {nudge && (
          <div className="nudge-box">
            A kiss won't change a thing between us… except making it 10× more memorable 😏💋
          </div>
        )}

        <button className="confirm-btn" style={{ marginTop: "1.2rem" }} onClick={handleConfirm}>
          ✨ Lock In My Complimentaries
        </button>

        <p style={{ fontSize: "0.72rem", color: "rgba(120,40,60,0.5)", marginTop: "0.6rem", fontStyle: "italic" }}>
          🤝 Holding Hands is always included, no matter what 💕
        </p>
      </div>
    </div>
  );
}

function spawnConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;
  const colors = ["#ff6b9d", "#ffd700", "#ff4081", "#b39ddb", "#64b5f6", "#81c784", "#ffb74d"];
  const shapes = ["■", "●", "★", "▲"];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = `${8 + Math.random() * 14}px`;
    el.style.animationDuration = `${2 + Math.random() * 3}s`;
    el.style.animationDelay = `${Math.random() * 0.8}s`;
    container.appendChild(el);
  }
  setTimeout(() => { container.innerHTML = ""; }, 5000);
}

function spawnHearts() {
  const container = document.getElementById("hearts-container");
  if (!container) return;
  const heartEmojis = ["❤️", "🩷", "💖", "💗", "💓", "💝", "💕"];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement("div");
    el.className = "floating-heart";
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.bottom = `0`;
    el.style.fontSize = `${1 + Math.random() * 2}rem`;
    el.style.animationDuration = `${2 + Math.random() * 3}s`;
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(el);
  }
  setTimeout(() => { container.innerHTML = ""; }, 6000);
}

function YesSequence({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState<"celebration" | "loading" | "ready">("celebration");

  useEffect(() => {
    spawnConfetti();
    spawnHearts();
    const t1 = setTimeout(() => setPhase("loading"), 2200);
    const t2 = setTimeout(() => setPhase("ready"), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="yes-sequence romantic-bg">
      <div id="confetti-container" className="confetti-container" />
      <div id="hearts-container" className="hearts-container" />
      <BackgroundHearts />

      {phase === "celebration" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🎉</div>
          <div className="yes-message">SHE SAID YES!!! 🎊</div>
          <div style={{ fontSize: "2.5rem", marginTop: "0.5rem" }}>💖✨💖</div>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💌</div>
          <p className="loading-text">Processing the happiest decision<span className="loading-dots" /></p>
          <p style={{ color: "rgba(120,30,60,0.6)", fontSize: "0.85rem", marginTop: "0.5rem", fontStyle: "italic" }}>
            reserving a little spot in time just for us...
          </p>
        </div>
      )}

      {phase === "ready" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🌸</div>
          <p style={{ color: "#8b1a4a", fontSize: "clamp(1rem, 4vw, 1.3rem)", fontWeight: 600, marginBottom: "1.5rem" }}>
            Now let's plan something beautiful ✨
          </p>
          <button className="primary-btn" onClick={onContinue} style={{ maxWidth: 320 }}>
            🌸 Begin Our Little Adventure
          </button>
        </div>
      )}
    </div>
  );
}

function DatePlanner({ onConfirm }: { onConfirm: (data: { date: string; time: string; activity: string; message: string }) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!date || !time || !activity) return;
    onConfirm({ date, time, activity, message });
  };

  return (
    <div className="date-planner-screen romantic-bg">
      <BackgroundHearts />
      <FloatingParticles />
      <div className="date-planner-card screen-enter">
        <h2 className="planner-title">Plan Our Date 🗓️</h2>
        <p className="planner-sub">Make it special. Make it ours.</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">📅 Date</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="form-group">
            <label className="form-label">🕒 Time</label>
            <input type="time" className="form-input" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="activity-label">💕 Choose Our Vibe</div>
          <div className="activity-grid">
            {ACTIVITIES.map((act) => (
              <div key={act.name} className={`activity-card ${activity === act.name ? "selected" : ""}`} onClick={() => setActivity(act.name)}>
                <span className="activity-emoji">{act.emoji}</span>
                <span className="activity-name">{act.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label className="form-label" style={{ display: "block", marginBottom: "0.5rem" }}>💬 Sweet Little Message (Optional)</label>
          <textarea className="message-textarea" placeholder="Type something sweet here... 🌸" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} />
        </div>

        <button className="confirm-btn" onClick={handleSubmit} disabled={!date || !time || !activity}>
          ✨ Confirm Our Date
        </button>
      </div>
    </div>
  );
}

function ConfirmingScreen() {
  return (
    <div className="confirming-screen romantic-bg">
      <BackgroundHearts />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1.2rem" }}>💫</div>
        <div className="confirming-spinner" style={{ margin: "0 auto 1.2rem" }} />
        <p className="loading-text">Reserving the happiest moment<span className="loading-dots" /></p>
        <p style={{ color: "rgba(120,30,60,0.6)", fontSize: "0.85rem", marginTop: "0.6rem", fontStyle: "italic" }}>
          wrapping it in roses and tying it with a bow...
        </p>
      </div>
    </div>
  );
}

function VipPass({ dateData }: { dateData: { date: string; time: string; activity: string; message: string; complimentary: string[] } }) {
  const passRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const formatDate = (d: string) => {
    if (!d) return "";
    try {
      const [year, month, day] = d.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      return dateObj.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch { return d; }
  };

  const formatTime = (t: string) => {
    if (!t) return "";
    const [hours, minutes] = t.split(":");
    const h = Number(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getActivityEmoji = (name: string) => ACTIVITIES.find((a) => a.name === name)?.emoji ?? "💕";

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OneTinyQuestion-DatePass.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!passRef.current) return;
    setSharing(true);
    try {
      const html2canvas = (window as any).html2canvas;
      if (!html2canvas) { alert("Screenshot library not loaded. Please refresh."); setSharing(false); return; }
      const canvas = await html2canvas(passRef.current, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) { setSharing(false); return; }
        const file = new File([blob], "OneTinyQuestion-DatePass.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ title: "Our Date Pass 💌", text: "We're going on a date! ❤️", files: [file] }); }
          catch { downloadBlob(blob); }
        } else { downloadBlob(blob); }
        setSharing(false);
      }, "image/png");
    } catch { setSharing(false); alert("Couldn't capture the pass. Try downloading instead."); }
  };

  const vipParticles = Array.from({ length: 12 }).map((_, i) => ({
    left: `${8 + i * 7.5}%`, delay: `${i * 0.4}s`, duration: `${3 + (i % 4)}s`, top: `${10 + (i % 5) * 18}%`,
  }));

  return (
    <div className="vip-screen romantic-bg screen-enter">
      <BackgroundHearts />
      <FloatingParticles />

      <div ref={passRef} className="vip-pass">
        <div className="vip-particles">
          {vipParticles.map((p, i) => (
            <div key={i} className="vip-particle" style={{
              left: p.left, top: p.top, animationDuration: p.duration, animationDelay: p.delay,
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              background: i % 3 === 0 ? "rgba(255,215,0,0.7)" : i % 3 === 1 ? "rgba(255,107,157,0.6)" : "rgba(255,255,255,0.5)",
            }} />
          ))}
        </div>

        <div className="vip-badge">VIP DATE PASS</div>
        <div className="vip-title">💌 Date Confirmed 💌</div>
        <div className="vip-subtitle">EXCLUSIVE ACCESS · ONE OF A KIND</div>
        <div className="vip-divider" />

        <div className="vip-row">
          <span className="vip-row-icon">👩</span>
          <div className="vip-row-content">
            <div className="vip-row-label">Guest</div>
            <div className="vip-row-value">Kavi Sree ❤️</div>
          </div>
        </div>

        <div className="vip-row">
          <span className="vip-row-icon">👨</span>
          <div className="vip-row-content">
            <div className="vip-row-label">Date Partner</div>
            <div className="vip-row-value">Nithish Kannan 😊</div>
          </div>
        </div>

        <div className="vip-divider" />

        <div className="vip-row">
          <span className="vip-row-icon">📅</span>
          <div className="vip-row-content">
            <div className="vip-row-label">Date</div>
            <div className="vip-row-value">{formatDate(dateData.date)}</div>
          </div>
        </div>

        <div className="vip-row">
          <span className="vip-row-icon">🕒</span>
          <div className="vip-row-content">
            <div className="vip-row-label">Time</div>
            <div className="vip-row-value">{formatTime(dateData.time)}</div>
          </div>
        </div>

        <div className="vip-row">
          <span className="vip-row-icon">{getActivityEmoji(dateData.activity)}</span>
          <div className="vip-row-content">
            <div className="vip-row-label">Plan</div>
            <div className="vip-row-value">{dateData.activity}</div>
          </div>
        </div>

        {dateData.complimentary && dateData.complimentary.length > 0 && (
          <div className="vip-row" style={{ alignItems: "flex-start" }}>
            <span className="vip-row-icon">🎁</span>
            <div className="vip-row-content">
              <div className="vip-row-label">Promised Complimentary</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
                {dateData.complimentary.map(id => {
                  const c = COMPLIMENTARIES.find(x => x.id === id);
                  return c ? (
                    <span key={id} style={{
                      background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.35)",
                      borderRadius: "20px", padding: "0.2rem 0.6rem", fontSize: "0.78rem",
                      color: "rgba(255,235,180,0.95)", fontWeight: 600, whiteSpace: "nowrap",
                    }}>
                      {c.emoji} {c.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {dateData.message && (
          <>
            <div className="vip-divider" />
            <div className="vip-message-box">
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,200,200,0.5)", marginBottom: "0.3rem", textTransform: "uppercase", fontWeight: 700 }}>
                A Little Note
              </div>
              "{dateData.message}"
            </div>
          </>
        )}

        <div className="vip-divider" style={{ marginTop: "1rem" }} />
        <div className="vip-seal">💝</div>
        <div className="vip-footer">"Now all that's left… is meeting you ☕🌇"</div>
      </div>

      <button className="share-btn" onClick={handleShare} disabled={sharing}>
        {sharing ? "Capturing... 📸" : "📸 Save / Share Date Card"}
      </button>
      <p style={{ fontSize: "0.75rem", color: "rgba(120,30,60,0.6)", textAlign: "center", fontStyle: "italic", maxWidth: 360 }}>
        Tap to download or share the date pass image 🌸
      </p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("cinematic");
  const [dateData, setDateData] = useState<{
    date: string; time: string; activity: string; message: string; complimentary: string[];
  }>({ date: "", time: "", activity: "", message: "", complimentary: [] });
  const { playing, toggle: toggleMusic } = useAmbientMusic();

  const goTo = useCallback((s: Screen) => setScreen(s), []);

  const handleConfirmDate = useCallback(
    (data: { date: string; time: string; activity: string; message: string }) => {
      setDateData(prev => ({ ...prev, ...data }));
      goTo("complimentary");
    },
    [goTo]
  );

  const handleComplimentaryConfirm = useCallback(
    (picks: string[]) => {
      setDateData(prev => ({ ...prev, complimentary: picks }));
      goTo("confirming");
      setTimeout(() => goTo("vip-pass"), 3000);
    },
    [goTo]
  );

  const content = (() => {
    if (screen === "cinematic")     return <CinematicScreen onOpen={() => goTo("screen1")} />;
    if (screen === "screen1")       return <Screen1 onNext={() => goTo("screen2")} />;
    if (screen === "screen2")       return <Screen2 onNext={() => goTo("screen3")} />;
    if (screen === "screen3")       return <Screen3 onYes={() => goTo("yes-sequence")} />;
    if (screen === "yes-sequence")  return <YesSequence onContinue={() => goTo("date-planner")} />;
    if (screen === "date-planner")  return <DatePlanner onConfirm={handleConfirmDate} />;
    if (screen === "complimentary") return <ComplimentaryScreen onConfirm={handleComplimentaryConfirm} />;
    if (screen === "confirming")    return <ConfirmingScreen />;
    if (screen === "vip-pass")      return <VipPass dateData={dateData} />;
    return null;
  })();

  return (
    <div className="app">
      {content}
      <MusicToggle playing={playing} onToggle={toggleMusic} />
    </div>
  );
}
