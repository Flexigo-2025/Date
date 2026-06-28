import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

/* =========================
   SCREEN TYPES
========================= */

type Screen =
  | "cinematic"
  | "screen1"
  | "screen2"
  | "screen3"
  | "compliments"
  | "date-planner"
  | "confirming"
  | "vip";

/* =========================
   MAIN APP
========================= */

export default function App() {
  const [screen, setScreen] = useState<Screen>("cinematic");
  const [compliments, setCompliments] = useState<string[]>([]);
  const [dateData, setDateData] = useState<any>(null);

  /* =========================
     CINEMATIC FLOW
  ========================= */

  const goNext = () => {
    if (screen === "cinematic") setScreen("screen1");
    else if (screen === "screen1") setScreen("screen2");
    else if (screen === "screen2") setScreen("screen3");
    else if (screen === "screen3") setScreen("compliments");
  };

  /* =========================
     YES / NO GAME HANDLER
  ========================= */

  const handleYes = () => {
    setScreen("compliments");
  };

  /* =========================
     COMPLEMENTS LOGIC
  ========================= */

  const toggleComp = (id: string) => {
    setCompliments(prev => {
      const exists = prev.includes(id);
      if (exists) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  };

  const confirmCompliments = () => {
    const final = ["holding-hands", ...compliments];

    if (final.length < 2) {
      alert("At least 2 gestures make the memory special 💖");
      return;
    }

    setCompliments(final);
    setScreen("date-planner");
  };

  /* =========================
     DATE CONFIRMATION
  ========================= */

  const confirmDate = (data: any) => {
    setDateData({
      ...data,
      compliments: compliments
    });

    setScreen("confirming");

    setTimeout(() => {
      setScreen("vip");
    }, 2500);
  };

  /* =========================
     SCREEN RENDER
  ========================= */

  return (
    <div className="app">

      {/* ================= CINEMATIC ================= */}
      {screen === "cinematic" && (
        <div className="cinematic-bg screen">
          <div className="glass-card">
            <h1>💌 One Tiny Question</h1>
            <p>A bird finally delivered your letter...</p>
            <button className="primary-btn" onClick={goNext}>
              Open Letter 💖
            </button>
          </div>
        </div>
      )}

      {/* ================= SCREEN 1 ================= */}
      {screen === "screen1" && (
        <div className="romantic-bg screen">
          <div className="glass-card">
            <h2>Hey you 👀</h2>
            <button className="primary-btn" onClick={goNext}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ================= SCREEN 2 ================= */}
      {screen === "screen2" && (
        <div className="romantic-bg screen">
          <div className="glass-card">
            <p>
              Some people become special without trying...
            </p>
            <button className="primary-btn" onClick={goNext}>
              I'm ready
            </button>
          </div>
        </div>
      )}

      {/* ================= SCREEN 3 ================= */}
      {screen === "screen3" && (
        <div className="romantic-bg screen">
          <div className="glass-card">
            <h2>Will you go on a date? 🌹</h2>

            <button className="yes-btn" onClick={handleYes}>
              YES ❤️
            </button>

            <button
              className="no-btn"
              onClick={() => alert("You smiled while reading this 😏")}
            >
              No 🙈
            </button>
          </div>
        </div>
      )}

      {/* ================= COMPLEMENTS ================= */}
      {screen === "compliments" && (
        <div className="romantic-bg screen">
          <div className="glass-card">

            <h2>💞 Complimentary Moments</h2>

            <p>
              Holding hands is always included 🤝
            </p>

            {/* HOLDING HANDS FIXED */}
            <div className="comp-card selected">
              🤝 Holding Hands (Always)
            </div>

            {/* OPTIONS */}
            {[
              { id: "hug", label: "🤗 Hug", desc: "Comfort & warmth" },
              { id: "kiss", label: "💋 Kiss", desc: "Emotional closeness" },
              { id: "waist", label: "🫶 Waist Hold", desc: "Gentle intimacy" },
              { id: "laugh", label: "😂 Laughter", desc: "Best connection" },
              { id: "eye", label: "👀 Eye Contact", desc: "Silent bond" }
            ].map(item => (
              <div
                key={item.id}
                className={`comp-card ${compliments.includes(item.id) ? "selected" : ""}`}
                onClick={() => toggleComp(item.id)}
              >
                <b>{item.label}</b>
                <p>{item.desc}</p>
              </div>
            ))}

            <button className="primary-btn" onClick={confirmCompliments}>
              Continue 💖
            </button>

          </div>
        </div>
      )}

      {/* ================= DATE PLANNER ================= */}
      {screen === "date-planner" && (
        <div className="romantic-bg screen">
          <div className="glass-card">

            <h2>📅 Plan Our Date</h2>

            <input type="date" id="date" />
            <input type="time" id="time" />

            <textarea placeholder="Anything you'd like to say 💌" />

            <button
              className="primary-btn"
              onClick={() =>
                confirmDate({
                  date: (document.getElementById("date") as HTMLInputElement).value,
                  time: (document.getElementById("time") as HTMLInputElement).value
                })
              }
            >
              Confirm 💖
            </button>

          </div>
        </div>
      )}

      {/* ================= LOADING ================= */}
      {screen === "confirming" && (
        <div className="romantic-bg screen">
          <div className="glass-card">
            <h2>Reserving the moment... ❤️</h2>
          </div>
        </div>
      )}

      {/* ================= VIP PASS ================= */}
      {screen === "vip" && (
        <div id="vipCard" className="finalPage">

          <div className="datePass">

            <h2>✨ VIP DATE PASS ✨</h2>

            <p>
              👩 Kavi Sree<br />
              👨 Nithish Kannan<br /><br />

              📅 {dateData?.date}<br />
              🕒 {dateData?.time}<br /><br />

              💞 Promised Moments:<br />
              🤝 Holding Hands (Always)<br />
              {compliments.includes("hug") && "🤗 Hug<br/>"}
              {compliments.includes("kiss") && "💋 Kiss<br/>"}
              {compliments.includes("waist") && "🫶 Waist Hold<br/>"}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}
