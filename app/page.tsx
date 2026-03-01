"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* ─── PALETTE & TOKENS ─────────────────────────────────────── */
const C = {
  bg: "#FFF9F6",
  blush: "#F8C8DC",
  peach: "#FFD8BE",
  lavender: "#CDB4DB",
  roseGold: "#C9858A",
  roseGoldLight: "#E8B4B8",
  text: "#3D2C2C",
  textSoft: "#7A5C5C",
  textMuted: "#B89898",
  white: "#FFFFFF",
  cardBg: "#FFFCFA",
  bubble: "#F4E8F0",
  bubbleOwn: "#F8C8DC",
};

/* ─── GOOGLE FONTS ──────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; color: ${C.text}; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${C.blush}; border-radius: 99px; }
    input, textarea { outline: none; border: none; background: transparent; font-family: 'DM Sans', sans-serif; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; background: none; }
  `}</style>
);

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const PROFILES = [
  { id: 1, name: "Aanya Sharma", branch: "Psychology", year: "3rd Year", bio: "Reading Haruki Murakami between lectures. Looking for someone to debate life's gentle contradictions.", interests: ["Philosophy", "Film", "Poetry", "Cafe hopping"], intent: "Meaningful connection", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80", commonSpots: ["The Reading Nook", "Art Block Café"] },
  { id: 2, name: "Priya Nair", branch: "Architecture", year: "4th Year", bio: "Sketching buildings and collecting sunsets. Probably lost somewhere between theory and practice.", interests: ["Sketching", "Music", "Yoga", "Urban walks"], intent: "Study Buddy", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80", commonSpots: ["Design Studio 3", "Campus Lake"] },
  { id: 3, name: "Meera Iyer", branch: "Literature", year: "2nd Year", bio: "Writing stories nobody asked for. Seeking a co-author for real-life chapters.", interests: ["Writing", "Theater", "Tea ceremonies", "Vintage things"], intent: "Just Vibing", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&q=80", commonSpots: ["Central Library", "Open Mic Thursdays"] },
  { id: 4, name: "Zara Khan", branch: "Computer Science", year: "3rd Year", bio: "Building things by day, staring at stars by night. Soft-spoken but loud in code.", interests: ["Astronomy", "Indie music", "Hiking", "Open source"], intent: "Dating", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80", commonSpots: ["CS Lab 2", "Telescope Hill"] },
  { id: 5, name: "Isha Mehta", branch: "Fine Arts", year: "1st Year", bio: "New here. Painting the world softer than it is.", interests: ["Painting", "Dance", "Journaling", "Film photography"], intent: "Event Buddy", img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&q=80", commonSpots: ["Art Block", "Annual Fest Grounds"] },
];

const MESSAGES = [
  { id: 1, from: "them", text: "Hey! I saw we both love Murakami 🌸", time: "2:41 PM", read: true },
  { id: 2, from: "me", text: "Yes!! Norwegian Wood basically lives in my bag right now", time: "2:43 PM", read: true },
  { id: 3, from: "them", text: "Okay we need to talk about the ending sometime. Are you free after Thursday's lecture?", time: "2:44 PM", read: true },
  { id: 4, from: "me", text: "Always. The Reading Nook at 4?", time: "2:46 PM", read: true },
  { id: 5, from: "them", text: "Perfect. See you there 🍂", time: "2:47 PM", read: false },
];

/* ─── FLOATING PETALS ANIMATION ─────────────────────────────── */
const Petal = ({ delay, startX }) => (
  <motion.div
    style={{ position: "absolute", top: -20, left: `${startX}%`, fontSize: 16, opacity: 0.6, userSelect: "none", pointerEvents: "none" }}
    animate={{ y: ["0vh", "110vh"], x: [0, 30, -20, 10], rotate: [0, 180, 360], opacity: [0, 0.7, 0.4, 0] }}
    transition={{ duration: 12 + Math.random() * 8, delay, repeat: Infinity, ease: "linear" }}
  >
    {["🌸", "🌺", "✿", "❀"][Math.floor(Math.random() * 4)]}
  </motion.div>
);

/* ─── SWIPEABLE CARD ─────────────────────────────────────────── */
function SwipeCard({ profile, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, -20], [1, 0]);
  const [dragging, setDragging] = useState(false);

  function handleDragEnd(_, info) {
    setDragging(false);
    if (info.offset.x > 100) onSwipe("right", profile);
    else if (info.offset.x < -100) onSwipe("left", profile);
  }

  return (
    <motion.div
      style={{ x, rotate, opacity, position: "absolute", width: "100%", cursor: dragging ? "grabbing" : "grab" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
    >
      <div style={{ borderRadius: 28, overflow: "hidden", background: C.cardBg, boxShadow: "0 8px 40px rgba(200,130,140,0.15), 0 2px 8px rgba(200,130,140,0.08)", position: "relative", height: 520 }}>
        <img src={profile.img} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  
        {/* Like / Nope overlays */}
        <motion.div style={{ position: "absolute", top: 32, left: 24, opacity: likeOpacity, background: "rgba(248,200,220,0.9)", borderRadius: 12, padding: "8px 18px", backdropFilter: "blur(4px)", border: `2px solid ${C.blush}` }}>
          <span style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 600, color: C.roseGold }}>✦ Yes</span>
        </motion.div>
        <motion.div style={{ position: "absolute", top: 32, right: 24, opacity: nopeOpacity, background: "rgba(210,200,220,0.9)", borderRadius: 12, padding: "8px 18px", backdropFilter: "blur(4px)", border: `2px solid ${C.lavender}` }}>
          <span style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 600, color: "#9B88B0" }}>✕ Pass</span>
        </motion.div>

        {/* Bottom gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(40,20,20,0.85) 0%, rgba(40,20,20,0.4) 60%, transparent 100%)", padding: "0 20px 24px" }}>
          <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 600, color: "#FFF", lineHeight: 1 }}>{profile.name}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "2px 8px", backdropFilter: "blur(4px)" }}>✓ Verified</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>{profile.branch} · {profile.year}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {profile.interests.slice(0, 3).map(i => (
                <span key={i} style={{ fontSize: 11, background: "rgba(248,200,220,0.3)", color: "rgba(255,255,255,0.9)", borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(248,200,220,0.4)", backdropFilter: "blur(4px)" }}>{i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Intent badge */}
        <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,249,246,0.9)", borderRadius: 99, padding: "4px 12px", backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(200,130,140,0.2)" }}>
          <span style={{ fontSize: 11, color: C.roseGold, fontWeight: 500 }}>{profile.intent}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function AfterClass() {
  const [screen, setScreen] = useState("landing"); // landing | auth | onboarding | discover | match | chat | profile | safety
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [onboardData, setOnboardData] = useState({ intent: "", branch: "", year: "", interests: [], bio: "" });
  const [profileIdx, setProfileIdx] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [messages, setMessages] = useState(MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [likesLeft, setLikesLeft] = useState(8);
  const [swipedCards, setSwipedCards] = useState([]);
  const msgEndRef = useRef(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function handleSwipe(dir, profile) {
    setSwipedCards(prev => [...prev, profile.id]);
    if (dir === "right") {
      setLikesLeft(l => l - 1);
      if (Math.random() > 0.4) {
        setTimeout(() => { setMatchedProfile(profile); setScreen("match"); }, 400);
        return;
      }
    }
    setTimeout(() => setProfileIdx(i => Math.min(i + 1, PROFILES.length - 1)), 300);
  }

  function sendMessage() {
    if (!newMsg.trim()) return;
    const msg = { id: Date.now(), from: "me", text: newMsg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false };
    setMessages(m => [...m, msg]);
    setNewMsg("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, from: "them", text: "That's such a lovely thought 🌷", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);
    }, 2200);
  }

  /* ── LANDING ── */
  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: C.bg, overflow: "hidden", position: "relative" }}>
      <FontLink />
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {[...Array(12)].map((_, i) => <Petal key={i} delay={i * 1.2} startX={Math.random() * 100} />)}
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.blush}40 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.lavender}40 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "40%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.peach}35 0%, transparent 70%)`, filter: "blur(50px)" }} />
      </div>

      <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px" }}>
        <span style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 600, color: C.roseGold, letterSpacing: "-0.5px" }}>AfterClass</span>
        <button onClick={() => setScreen("auth")} style={{ background: C.blush, color: C.roseGold, borderRadius: 99, padding: "9px 22px", fontSize: 13, fontWeight: 500, boxShadow: "0 2px 12px rgba(200,130,140,0.25)" }}>Sign in</button>
      </nav>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
          <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${C.blush}, ${C.lavender})`, borderRadius: 99, padding: "6px 18px", marginBottom: 28, fontSize: 12, color: C.roseGold, fontWeight: 500, letterSpacing: "0.5px" }}>✦ Free to join with Gmail</div>
          <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: "clamp(46px, 10vw, 78px)", fontWeight: 500, lineHeight: 1.05, color: C.text, marginBottom: 20, letterSpacing: "-1px" }}>
            You both paused<br />
            <em style={{ color: C.roseGold }}>after class.</em>
          </h1>
          <p style={{ fontSize: 16, color: C.textSoft, lineHeight: 1.75, marginBottom: 44, maxWidth: 420, margin: "0 auto 44px" }}>
            A soft, safe space to find study partners, event companions, and meaningful connections — sign up free with your Gmail.
          </p>
          <motion.button
            onClick={() => setScreen("auth")}
            style={{ background: `linear-gradient(135deg, ${C.blush} 0%, ${C.peach} 100%)`, color: C.roseGold, borderRadius: 99, padding: "16px 44px", fontSize: 16, fontWeight: 500, boxShadow: "0 8px 32px rgba(200,130,140,0.3)", letterSpacing: "0.2px" }}
            whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(200,130,140,0.4)" }}
            whileTap={{ scale: 0.97 }}
          >Join Your Campus →</motion.button>
        </motion.div>

        {/* Preview cards */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} style={{ marginTop: 80, display: "flex", gap: 16, justifyContent: "center", overflowX: "auto", padding: "0 8px" }}>
          {PROFILES.slice(0, 3).map((p, i) => (
            <motion.div key={p.id} style={{ minWidth: 160, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 32px rgba(200,130,140,0.18)", flexShrink: 0, position: "relative", height: 220 }}
              animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(40,20,20,0.8), transparent)", display: "flex", alignItems: "flex-end", padding: "12px" }}>
                <div>
                  <p style={{ fontFamily: "Cormorant Garamond", fontSize: 15, fontWeight: 600, color: "#FFF" }}>{p.name.split(" ")[0]}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{p.branch}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ marginTop: 60, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {["Study Buddies", "Event Friends", "Meaningful Connections"].map(label => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blush}, ${C.lavender})`, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {label.includes("Study") ? "📚" : label.includes("Event") ? "🎪" : "🌸"}
              </div>
              <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── AUTH ── */
  if (screen === "auth") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <FontLink />
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.blush}50 0%, transparent 70%)`, filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.lavender}45 0%, transparent 70%)`, filter: "blur(40px)" }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, background: C.white, borderRadius: 32, padding: 40, boxShadow: "0 16px 60px rgba(200,130,140,0.12)" }}>
        <button onClick={() => setScreen("landing")} style={{ position: "absolute", top: 20, left: 20, fontSize: 22, color: C.textMuted }}>←</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: "Cormorant Garamond", fontSize: 30, fontWeight: 600, color: C.roseGold }}>AfterClass</span>
          <p style={{ fontSize: 13, color: C.textSoft, marginTop: 6 }}>{authMode === "login" ? "Welcome back 🌸" : "Join your campus"}</p>
        </div>

        <div style={{ display: "flex", background: `${C.blush}30`, borderRadius: 16, padding: 4, marginBottom: 28 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => setAuthMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 500, background: authMode === m ? C.white : "transparent", color: authMode === m ? C.roseGold : C.textMuted, boxShadow: authMode === m ? "0 2px 8px rgba(200,130,140,0.15)" : "none", transition: "all 0.2s" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {authMode === "signup" && (
            <input placeholder="Full name" style={{ background: `${C.blush}20`, borderRadius: 16, padding: "14px 18px", fontSize: 14, color: C.text, width: "100%" }} />
          )}
          <input placeholder="Your Gmail address" style={{ background: `${C.blush}20`, borderRadius: 16, padding: "14px 18px", fontSize: 14, color: C.text, width: "100%" }} />
          <input type="password" placeholder="Password" style={{ background: `${C.blush}20`, borderRadius: 16, padding: "14px 18px", fontSize: 14, color: C.text, width: "100%" }} />
          {authMode === "signup" && (
            <div style={{ background: `${C.lavender}20`, borderRadius: 14, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>🌸</span>
              <p style={{ fontSize: 11, color: C.textSoft }}>Sign up with any <strong>@gmail.com</strong> address. Quick, free, and no campus ID needed.</p>
            </div>
          )}
          <motion.button
            onClick={() => { setUser({ name: "Kavya Reddy", branch: "Design", year: "3rd Year" }); setScreen(authMode === "signup" ? "onboarding" : "discover"); }}
            style={{ background: `linear-gradient(135deg, ${C.blush}, ${C.peach})`, color: C.roseGold, borderRadius: 99, padding: "15px", fontSize: 15, fontWeight: 500, marginTop: 6, boxShadow: "0 4px 20px rgba(200,130,140,0.25)" }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >{authMode === "login" ? "Continue →" : "Create Account →"}</motion.button>
        </div>
        {authMode === "login" && <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 18 }}>Forgot password? <button style={{ color: C.roseGold }}>Reset</button></p>}
      </motion.div>
    </div>
  );

  /* ── ONBOARDING ── */
  if (screen === "onboarding") {
    const steps = [
      { title: "What brings you here?", sub: "Set your intention — you can always change this later." },
      { title: "Tell us about yourself.", sub: "This helps us find your people." },
      { title: "What are you into?", sub: "Pick at least 3 interests." },
      { title: "Say something lovely.", sub: "A short bio is all you need." },
    ];
    const intents = ["Study Buddy", "Event Buddy", "Dating", "Just Vibing"];
    const branches = ["Computer Science", "Literature", "Architecture", "Psychology", "Fine Arts", "Engineering", "Business", "Medicine", "Law"];
    const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"];
    const allInterests = ["Philosophy", "Film", "Poetry", "Music", "Sketching", "Hiking", "Astronomy", "Theater", "Dance", "Café hopping", "Writing", "Yoga", "Photography", "Reading", "Gaming", "Cooking", "Traveling", "Volunteering"];

    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <FontLink />
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.peach}45 0%, transparent 70%)`, filter: "blur(50px)" }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={onboardStep} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}
            style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 460, background: C.white, borderRadius: 32, padding: 40, boxShadow: "0 16px 60px rgba(200,130,140,0.12)" }}>

            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= onboardStep ? `linear-gradient(90deg, ${C.blush}, ${C.roseGold})` : `${C.blush}40` }} />
              ))}
            </div>

            <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 600, color: C.text, marginBottom: 6 }}>{steps[onboardStep].title}</h2>
            <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 28 }}>{steps[onboardStep].sub}</p>

            {onboardStep === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {intents.map(intent => (
                  <motion.button key={intent} onClick={() => setOnboardData(d => ({ ...d, intent }))}
                    style={{ borderRadius: 20, padding: "16px 12px", border: `2px solid ${onboardData.intent === intent ? C.roseGold : `${C.blush}60`}`, background: onboardData.intent === intent ? `${C.blush}30` : C.white, fontSize: 14, color: onboardData.intent === intent ? C.roseGold : C.textSoft, fontWeight: 500, transition: "all 0.2s" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    {intent === "Study Buddy" ? "📚 " : intent === "Event Buddy" ? "🎪 " : intent === "Dating" ? "🌸 " : "✨ "}{intent}
                  </motion.button>
                ))}
              </div>
            )}
            {onboardStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: C.textSoft, marginBottom: 6, display: "block" }}>Branch / Major</label>
                  <select value={onboardData.branch} onChange={e => setOnboardData(d => ({ ...d, branch: e.target.value }))}
                    style={{ width: "100%", background: `${C.blush}20`, borderRadius: 16, padding: "13px 18px", fontSize: 14, color: C.text, appearance: "none", border: "none", fontFamily: "DM Sans" }}>
                    <option value="">Select branch</option>
                    {branches.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: C.textSoft, marginBottom: 8, display: "block" }}>Year</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {years.map(y => (
                      <button key={y} onClick={() => setOnboardData(d => ({ ...d, year: y }))}
                        style={{ borderRadius: 99, padding: "8px 16px", border: `2px solid ${onboardData.year === y ? C.roseGold : `${C.blush}60`}`, background: onboardData.year === y ? `${C.blush}30` : C.white, fontSize: 12, color: onboardData.year === y ? C.roseGold : C.textSoft, fontWeight: 500 }}>
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {onboardStep === 2 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allInterests.map(interest => {
                  const selected = onboardData.interests.includes(interest);
                  return (
                    <button key={interest} onClick={() => setOnboardData(d => ({ ...d, interests: selected ? d.interests.filter(i => i !== interest) : [...d.interests, interest] }))}
                      style={{ borderRadius: 99, padding: "8px 14px", border: `2px solid ${selected ? C.roseGold : `${C.blush}60`}`, background: selected ? `${C.blush}30` : C.white, fontSize: 12, color: selected ? C.roseGold : C.textSoft, fontWeight: 500, transition: "all 0.2s" }}>
                      {interest}
                    </button>
                  );
                })}
              </div>
            )}
            {onboardStep === 3 && (
              <div>
                <textarea value={onboardData.bio} onChange={e => setOnboardData(d => ({ ...d, bio: e.target.value }))} placeholder="Tell your future study buddy something true about you..." maxLength={200}
                  style={{ width: "100%", background: `${C.blush}20`, borderRadius: 20, padding: "16px", fontSize: 14, color: C.text, lineHeight: 1.7, height: 120, resize: "none" }} />
                <p style={{ fontSize: 11, color: C.textMuted, textAlign: "right", marginTop: 6 }}>{onboardData.bio.length}/200</p>
                <div style={{ background: `${C.lavender}20`, borderRadius: 16, padding: "12px 16px", marginTop: 12 }}>
                  <p style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6 }}>🔒 Your profile is only visible to other AfterClass members. You're always in control of who sees you.</p>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, alignItems: "center" }}>
              {onboardStep > 0 ? (
                <button onClick={() => setOnboardStep(s => s - 1)} style={{ fontSize: 13, color: C.textMuted }}>← Back</button>
              ) : <div />}
              <motion.button
                onClick={() => onboardStep < steps.length - 1 ? setOnboardStep(s => s + 1) : setScreen("discover")}
                style={{ background: `linear-gradient(135deg, ${C.blush}, ${C.peach})`, color: C.roseGold, borderRadius: 99, padding: "12px 28px", fontSize: 14, fontWeight: 500, boxShadow: "0 4px 20px rgba(200,130,140,0.25)" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {onboardStep < steps.length - 1 ? "Continue →" : "Enter Campus 🌸"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ── MATCH SCREEN ── */
  if (screen === "match") return (
    <div style={{ minHeight: "100vh", background: "rgba(40,20,20,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <FontLink />
      <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(20px)" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${C.blush}30 0%, transparent 70%)` }} />

      {[...Array(8)].map((_, i) => <Petal key={i} delay={i * 0.5} startX={Math.random() * 100} />)}

      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <motion.div style={{ display: "flex", justifyContent: "center", marginBottom: 32, position: "relative" }}>
          {/* Two profile photos sliding together */}
          <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.blush}`, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.6 }}
            style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blush}, ${C.roseGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, zIndex: 3, margin: "0 -8px", alignSelf: "center", boxShadow: "0 4px 16px rgba(200,130,140,0.5)" }}>🌸</motion.div>
          <motion.div initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.blush}`, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
            <img src={matchedProfile?.img} alt={matchedProfile?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ fontFamily: "Cormorant Garamond", fontSize: 40, fontWeight: 500, color: C.white, marginBottom: 12, letterSpacing: "-0.5px" }}>
          You both paused.
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 36 }}>
          You and <strong style={{ color: C.blush }}>{matchedProfile?.name}</strong> have matched
        </motion.p>

        {matchedProfile?.commonSpots && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ background: "rgba(248,200,220,0.15)", borderRadius: 20, padding: "12px 20px", marginBottom: 28, border: "1px solid rgba(248,200,220,0.2)", backdropFilter: "blur(8px)" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>✦ You both frequent</p>
            <p style={{ fontSize: 14, color: C.blush }}>{matchedProfile.commonSpots.join(" · ")}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <motion.button onClick={() => { setScreen("chat"); setChatOpen(matchedProfile); setMatchedProfile(null); }}
            style={{ background: `linear-gradient(135deg, ${C.blush}, ${C.peach})`, color: C.roseGold, borderRadius: 99, padding: "14px 32px", fontSize: 15, fontWeight: 500, boxShadow: "0 8px 28px rgba(200,130,140,0.4)" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Start Talking 💬</motion.button>
          <motion.button onClick={() => { setProfileIdx(i => i + 1); setMatchedProfile(null); setScreen("discover"); }}
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "14px 24px", fontSize: 14, border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Keep browsing</motion.button>
        </motion.div>
      </motion.div>
    </div>
  );

  /* ── MAIN APP (discover/chat/profile/safety) ── */
  const currentProfile = PROFILES[profileIdx % PROFILES.length];
  const chatPartner = chatOpen || PROFILES[0];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden", boxShadow: "0 0 80px rgba(200,130,140,0.08)" }}>
      <FontLink />

      {/* REPORT MODAL */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(40,20,20,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              style={{ background: C.white, borderRadius: "28px 28px 28px 28px", padding: 32, width: "100%", maxWidth: 440 }}>
              <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, marginBottom: 6 }}>Report or Block</h3>
              <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 20 }}>Your safety matters. We review all reports within 24 hours.</p>
              {["Inappropriate content", "Harassment", "Fake profile", "Spam", "Other"].map(reason => (
                <button key={reason} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 16, fontSize: 14, color: C.text, marginBottom: 8, background: `${C.blush}20`, border: "none" }}>{reason}</button>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setReportOpen(false)} style={{ flex: 1, padding: 12, borderRadius: 99, fontSize: 13, background: `${C.blush}30`, color: C.roseGold, fontWeight: 500 }}>Cancel</button>
                <button onClick={() => setReportOpen(false)} style={{ flex: 2, padding: 12, borderRadius: 99, fontSize: 13, background: `linear-gradient(135deg, ${C.blush}, ${C.peach})`, color: C.roseGold, fontWeight: 500 }}>Submit Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 600, color: C.roseGold }}>AfterClass</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {activeTab === "discover" && (
            <div style={{ background: `${C.blush}30`, borderRadius: 99, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>🌸</span>
              <span style={{ fontSize: 12, color: C.roseGold, fontWeight: 500 }}>{likesLeft} left today</span>
            </div>
          )}
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.blush}` }}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 16px 80px" }}>
        <AnimatePresence mode="wait">

          {/* DISCOVER */}
          {activeTab === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 20, color: C.text, marginBottom: 4, paddingLeft: 4 }}>
                Discover <em style={{ color: C.roseGold }}>your campus</em>
              </h2>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, paddingLeft: 4 }}>Swipe right to connect · left to pass</p>

              <div style={{ position: "relative", height: 540 }}>
                {PROFILES.slice(profileIdx % PROFILES.length).slice(0, 3).reverse().map((profile, i, arr) => (
                  <motion.div key={profile.id} style={{ position: "absolute", width: "100%", top: (arr.length - 1 - i) * 6, left: 0, transform: `scale(${1 - (arr.length - 1 - i) * 0.03})` }}>
                    <SwipeCard profile={profile} onSwipe={handleSwipe} isTop={i === arr.length - 1} />
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
                {[
                  { emoji: "✕", bg: `${C.lavender}30`, color: "#9B88B0", action: () => handleSwipe("left", currentProfile) },
                  { emoji: "⭐", bg: `${C.peach}60`, color: "#C97C5A", action: () => {} },
                  { emoji: "🌸", bg: `${C.blush}50`, color: C.roseGold, action: () => handleSwipe("right", currentProfile) },
                ].map(({ emoji, bg, color, action }) => (
                  <motion.button key={emoji} onClick={action}
                    style={{ width: 58, height: 58, borderRadius: "50%", background: bg, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", color, boxShadow: "0 4px 16px rgba(200,130,140,0.15)" }}
                    whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(200,130,140,0.25)" }} whileTap={{ scale: 0.9 }}>
                    {emoji}
                  </motion.button>
                ))}
              </div>

              {/* Profile details strip */}
              <motion.div style={{ background: C.white, borderRadius: 24, padding: "16px 20px", marginTop: 16, boxShadow: "0 4px 20px rgba(200,130,140,0.08)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{currentProfile.name}</p>
                    <p style={{ fontSize: 11, color: C.textMuted }}>{currentProfile.bio.slice(0, 70)}...</p>
                  </div>
                  <button onClick={() => setReportOpen(true)} style={{ fontSize: 11, color: C.textMuted, background: `${C.blush}20`, borderRadius: 99, padding: "4px 10px" }}>⚑ Report</button>
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, color: C.textSoft }}>✦ Common spots:</span>
                  {currentProfile.commonSpots.map(s => <span key={s} style={{ fontSize: 10, background: `${C.lavender}30`, color: "#9B88B0", borderRadius: 99, padding: "2px 8px" }}>{s}</span>)}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CHAT LIST */}
          {activeTab === "chat" && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 20, color: C.text, marginBottom: 4, paddingLeft: 4 }}>Messages</h2>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, paddingLeft: 4 }}>Your connections</p>

              {PROFILES.slice(0, 4).map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => { setChatOpen(p); setActiveTab("chatopen"); }}
                  style={{ display: "flex", gap: 14, alignItems: "center", background: C.white, borderRadius: 20, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 12px rgba(200,130,140,0.08)", cursor: "pointer" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.blush}` }}>
                      <img src={p.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    {i < 2 && <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#7FD49A", border: `2px solid ${C.white}` }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: C.textMuted }}>2:47 PM</p>
                    </div>
                    <p style={{ fontSize: 12, color: C.textSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {i === 0 ? "Perfect. See you there 🍂" : i === 1 ? "That lecture was so good!" : i === 2 ? "Are you going to the fest?" : "Hey! Great to connect 🌸"}
                    </p>
                  </div>
                  {i === 1 && <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.roseGold, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, color: C.white, fontWeight: 600 }}>2</span></div>}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CHAT OPEN */}
          {activeTab === "chatopen" && chatOpen && (
            <motion.div key="chatopen" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
              {/* Chat header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, borderRadius: 24, padding: "12px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(200,130,140,0.08)" }}>
                <button onClick={() => setActiveTab("chat")} style={{ fontSize: 18, color: C.textMuted }}>←</button>
                <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.blush}` }}>
                  <img src={chatOpen.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{chatOpen.name}</p>
                  <p style={{ fontSize: 11, color: "#7FD49A" }}>● Online</p>
                </div>
                <button onClick={() => setReportOpen(true)} style={{ fontSize: 14, color: C.textMuted }}>⋯</button>
              </div>

              {/* Shared context banner */}
              <div style={{ background: `${C.lavender}20`, borderRadius: 16, padding: "8px 14px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12 }}>📍</span>
                <p style={{ fontSize: 11, color: C.textSoft }}>You both frequent <strong>{chatOpen.commonSpots?.[0]}</strong> · {chatOpen.branch}</p>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 8 }}>
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "72%", background: msg.from === "me" ? C.bubbleOwn : C.bubble, borderRadius: msg.from === "me" ? "20px 20px 6px 20px" : "20px 20px 20px 6px", padding: "10px 14px" }}>
                      <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{msg.text}</p>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4, justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                        <p style={{ fontSize: 10, color: C.textMuted }}>{msg.time}</p>
                        {msg.from === "me" && <span style={{ fontSize: 10, color: msg.read ? C.roseGold : C.textMuted }}>✓✓</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ background: C.bubble, borderRadius: "20px 20px 20px 6px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMuted }}
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={msgEndRef} />
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.white, borderRadius: 24, padding: "10px 10px 10px 16px", boxShadow: "0 -2px 20px rgba(200,130,140,0.08)", marginTop: 8 }}>
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Say something sweet..." style={{ flex: 1, fontSize: 14, color: C.text }} />
                <motion.button onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blush}, ${C.peach})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 2px 10px rgba(200,130,140,0.25)" }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>🌸</motion.button>
              </div>
            </motion.div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.blush}`, margin: "0 auto 12px", boxShadow: "0 4px 20px rgba(200,130,140,0.2)" }}>
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 24, color: C.text }}>Kavya Reddy <span style={{ fontSize: 14 }}>✓</span></h2>
                <p style={{ fontSize: 13, color: C.textSoft }}>Design · 3rd Year · Campus University</p>
              </div>

              {[{ label: "Bio", value: "Designing softer interfaces for a gentler world. Ask me about brutalist posters." },
                { label: "Intent", value: "Meaningful connection" },
                { label: "Common interests", value: "Philosophy · Film · Café hopping" }].map(item => (
                <div key={item.label} style={{ background: C.white, borderRadius: 20, padding: "16px 20px", marginBottom: 10, boxShadow: "0 2px 12px rgba(200,130,140,0.07)" }}>
                  <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{item.value}</p>
                </div>
              ))}

              <div style={{ background: C.white, borderRadius: 20, padding: "16px 20px", marginBottom: 10, boxShadow: "0 2px 12px rgba(200,130,140,0.07)" }}>
                <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Today's likes</p>
                <div style={{ background: `${C.blush}30`, borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(likesLeft / 10) * 100}%` }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.blush}, ${C.roseGold})`, borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11, color: C.textSoft, marginTop: 6 }}>{likesLeft}/10 likes remaining today</p>
              </div>

              <button onClick={() => setReportOpen(true)} style={{ width: "100%", background: C.white, borderRadius: 20, padding: "14px 20px", fontSize: 14, color: C.textSoft, textAlign: "left", boxShadow: "0 2px 12px rgba(200,130,140,0.07)", marginBottom: 10 }}>
                🛡 Safety & Community Guidelines
              </button>
              <button onClick={() => setScreen("landing")} style={{ width: "100%", background: `${C.blush}20`, borderRadius: 20, padding: "14px 20px", fontSize: 14, color: C.roseGold, textAlign: "center", fontWeight: 500 }}>
                Sign Out
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM NAV */}
      {activeTab !== "chatopen" && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${C.white}F0`, borderTop: `1px solid ${C.blush}40`, padding: "10px 32px 20px", display: "flex", justifyContent: "space-around", backdropFilter: "blur(12px)", zIndex: 50 }}>
          {[
            { id: "discover", icon: "✦", label: "Discover" },
            { id: "chat", icon: "💬", label: "Messages" },
            { id: "profile", icon: "◯", label: "Profile" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: activeTab === tab.id ? C.roseGold : C.textMuted, transition: "all 0.2s" }}>
              <motion.span style={{ fontSize: activeTab === tab.id ? 22 : 18 }} animate={{ scale: activeTab === tab.id ? 1.15 : 1 }}>{tab.icon}</motion.span>
              <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 500 : 400 }}>{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="tabDot" style={{ width: 4, height: 4, borderRadius: "50%", background: C.roseGold }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
