import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Menu, X, ChevronRight, ChevronLeft, Play, Facebook, Twitter,
  Send, Mail, MessageCircle, Share2, Bookmark, TrendingUp, Clock, MapPin,
  ChevronDown, LayoutDashboard, FileText, Users, Bell, BarChart3, Settings,
  Plus, Edit3, Trash2, Eye, CheckCircle2, XCircle, Upload, Calendar,
  Briefcase, Newspaper, Mic, Image as ImageIcon, ArrowUpRight, Sparkles,
  ThumbsUp, Video
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart,
  Bar, PieChart, Pie, Cell, CartesianGrid
} from "recharts";

/* ---------------------------------------------------------
   TOKENS
   Palette: Ink #0B0E0C (near-black), Paper #FAF8F3 (warm white),
   Bulletin Green #0B6E4F (primary), Signal Green #2FBF71 (live/accent),
   Flag Red #C8102E (breaking, used sparingly), Stone #6B7062 (meta text)
   Display: "Newsreader" (serif, editorial) / Body: "Inter" / Utility: "IBM Plex Mono"
--------------------------------------------------------- */

const COUNTIES = ["Marsabit", "Mandera", "Wajir", "Isiolo", "Turkana", "Samburu", "Garissa"];

const CATEGORIES = [
  "Latest News", "Politics", "Business & Economy", "Counties", "Education",
  "Health", "Climate & Environment", "Culture & Heritage", "Security",
  "Sports", "Opinion", "Investigations"
];

const AUTHORS = [
  { id: "a1", name: "Amina Roble", role: "Senior Political Correspondent", county: "Wajir", bio: "Amina has covered devolution and county governance across Northern Kenya for eight years, with a focus on how national policy lands in Wajir, Mandera and Garissa.", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "a2", name: "Daniel Lokwang", role: "Business & Economy Editor", county: "Turkana", bio: "Daniel reports on pastoralist economies, oil exploration in Turkana, and cross-border trade with Ethiopia and South Sudan.", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "a3", name: "Halima Guyo", role: "Health & Climate Reporter", county: "Marsabit", bio: "Halima writes on drought response, maternal health and climate adaptation in Marsabit and Isiolo.", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: "a4", name: "Peter Lekuton", role: "Security Correspondent", county: "Samburu", bio: "Peter has reported on banditry, disarmament and community policing across the Samburu-Isiolo border for The North Bulletin since 2021.", avatar: "https://i.pravatar.cc/150?img=51" },
];

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 3600 * 1000);
const fmtTime = (d) => {
  const diffH = Math.round((now - d) / 3600000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.round(diffH / 24)}d ago`;
};
const fmtDate = (d) => d.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

const IMG = (seed, w = 800, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const ARTICLES = [
  { id: 1, title: "Marsabit County Rolls Out Solar-Powered Water Points for 40 Drought-Hit Villages", dek: "The county government says the project, funded jointly with the national drought authority, will cut water-collection distances from 12km to under 2km for pastoralist households.", category: "Climate & Environment", county: "Marsabit", author: AUTHORS[2], date: hoursAgo(2), image: IMG("marsabit-water"), featured: true, trending: true, tags: ["drought", "water", "county government"] },
  { id: 2, title: "MPs From Northern Kenya Bloc Push for Amended Equalisation Fund Formula", dek: "Legislators argue the current formula undercounts the cost of service delivery in vast, sparsely populated constituencies.", category: "Politics", county: "Wajir", author: AUTHORS[0], date: hoursAgo(4), image: IMG("parliament-nk"), featured: true, tags: ["equalisation fund", "parliament", "devolution"] },
  { id: 3, title: "Turkana Oil Talks Resume as Investors Seek Clarity on Revenue-Sharing", dek: "Tullow and the national government are back at the table over the long-delayed South Lokichar project, with county leaders demanding a firmer local-content commitment.", category: "Business & Economy", county: "Turkana", author: AUTHORS[1], date: hoursAgo(6), image: IMG("turkana-oil"), featured: true, tags: ["oil", "investment", "Tullow"] },
  { id: 4, title: "Garissa University Reopens Satellite Campus for Nomadic Learners", dek: "The mobile-classroom initiative aims to reach children in pastoralist families who move seasonally in search of pasture.", category: "Education", county: "Garissa", author: AUTHORS[0], date: hoursAgo(9), image: IMG("garissa-school"), tags: ["education", "nomadic schools"] },
  { id: 5, title: "Cross-Border Livestock Market Reopens Between Mandera and Somalia's Bula Hawa", dek: "Traders say the reopening could restore an estimated KSh 200 million a month in cross-border commerce.", category: "Business & Economy", county: "Mandera", author: AUTHORS[1], date: hoursAgo(11), image: IMG("mandera-market"), tags: ["trade", "livestock"] },
  { id: 6, title: "New Maternal Health Wing Opens at Isiolo Referral Hospital", dek: "The 40-bed wing is expected to cut maternal referrals to Nairobi by more than half, health officials say.", category: "Health", county: "Isiolo", author: AUTHORS[2], date: hoursAgo(13), image: IMG("isiolo-hospital"), tags: ["maternal health", "hospitals"] },
  { id: 7, title: "Samburu Elders Broker Ceasefire After Weeks of Cattle-Raid Clashes", dek: "A council of elders from Samburu and neighbouring Baringo say the truce includes a compensation framework for stolen livestock.", category: "Security", county: "Samburu", author: AUTHORS[3], date: hoursAgo(15), image: IMG("samburu-elders"), trending: true, tags: ["banditry", "peace-building"] },
  { id: 8, title: "Wajir's Camel Milk Cooperative Signs Export Deal With Gulf Buyer", dek: "The deal, the first of its kind for the region, could open a new income stream for over 3,000 pastoralist households.", category: "Business & Economy", county: "Wajir", author: AUTHORS[1], date: hoursAgo(18), image: IMG("wajir-camel-milk"), tags: ["camel milk", "export"] },
  { id: 9, title: "Borana Cultural Festival Draws Record Crowds to Marsabit Town", dek: "Organisers say this year's Jila festival attracted visitors from as far as Ethiopia's Borana zone.", category: "Culture & Heritage", county: "Marsabit", author: AUTHORS[2], date: hoursAgo(20), image: IMG("borana-festival"), tags: ["culture", "festival"] },
  { id: 10, title: "Turkana Girls' Rugby Side Qualifies for National Finals", dek: "The team, formed only two years ago, beat three higher-ranked sides on its way to Nairobi.", category: "Sports", county: "Turkana", author: AUTHORS[1], date: hoursAgo(22), image: IMG("turkana-rugby"), tags: ["rugby", "youth sport"] },
  { id: 11, title: "Opinion: Why Northern Kenya's Development Deserves More Than Drought Headlines", dek: "A regional economist argues that framing the north only through emergency appeals obscures real, investable growth.", category: "Opinion", county: "Isiolo", author: AUTHORS[1], date: hoursAgo(26), image: IMG("nk-opinion"), tags: ["opinion", "development"] },
  { id: 12, title: "Investigation: Ghost Boreholes — Millions Spent, Villages Still Dry", dek: "A North Bulletin review of county procurement records found at least 14 borehole contracts marked complete with no working borehole on the ground.", category: "Investigations", county: "Garissa", author: AUTHORS[0], date: hoursAgo(30), image: IMG("ghost-boreholes"), featured: true, tags: ["investigation", "accountability"] },
  { id: 13, title: "Isiolo Airport Upgrade Nears Completion, Eyes Cargo Flights", dek: "Officials say the extended runway will support cargo flights for miraa and livestock exports by early next year.", category: "Business & Economy", county: "Isiolo", author: AUTHORS[1], date: hoursAgo(33), image: IMG("isiolo-airport"), tags: ["infrastructure", "aviation"] },
  { id: 14, title: "Mandera Launches Community Policing Units in Ten Wards", dek: "The initiative pairs national police reservists with local elders to respond faster to cross-border incidents.", category: "Security", county: "Mandera", author: AUTHORS[3], date: hoursAgo(36), image: IMG("mandera-police"), tags: ["security", "community policing"] },
  { id: 15, title: "Samburu Launches First County-Wide Climate Adaptation Plan", dek: "The plan sets out a ten-year roadmap for water harvesting, rangeland management and early-warning systems.", category: "Climate & Environment", county: "Samburu", author: AUTHORS[2], date: hoursAgo(40), image: IMG("samburu-climate"), tags: ["climate plan", "county government"] },
  { id: 16, title: "Wajir Girls Retain National Debate Championship Title", dek: "The team's coach credits a new county-funded reading programme for the back-to-back win.", category: "Education", county: "Wajir", author: AUTHORS[0], date: hoursAgo(44), image: IMG("wajir-debate"), tags: ["education", "youth"] },
  { id: 17, title: "Podcast: Unpacking the New Equalisation Fund Formula", dek: "This week on The Bulletin Brief, our politics desk sits down with two county finance officers to break down what the proposed formula would mean on the ground.", category: "Politics", county: "Garissa", author: AUTHORS[0], date: hoursAgo(48), image: IMG("podcast-cover"), isPodcast: true, tags: ["podcast", "equalisation fund"] },
  { id: 18, title: "Turkana's Lake Turkana Wind Power Reports Record Output", dek: "Africa's largest wind farm says improved turbine maintenance pushed output to a new quarterly high.", category: "Business & Economy", county: "Turkana", author: AUTHORS[1], date: hoursAgo(52), image: IMG("lake-turkana-wind"), tags: ["energy", "wind power"] },
];

const BREAKING = [
  "Marsabit declares partial drought recovery after above-average rains",
  "National Assembly to debate Equalisation Fund amendment on Tuesday",
  "Cross-border trade resumes at Mandera–Bula Hawa livestock market",
  "Turkana oil revenue-sharing talks set to resume this week",
];

const COMMENTS_SEED = [
  { id: 1, name: "Ibrahim K.", time: "3h ago", text: "This is long overdue for our villages. Hope the maintenance plan is as solid as the installation.", likes: 14, approved: true },
  { id: 2, name: "Fatuma A.", time: "1h ago", text: "Which villages exactly? The article doesn't list them.", likes: 3, approved: true },
  { id: 3, name: "Guest", time: "40m ago", text: "Great reporting, following this closely.", likes: 1, approved: true },
];

/* ---------------------------------------------------------
   SHARED UI PRIMITIVES
--------------------------------------------------------- */

const Logo = ({ dark = false, small = false }) => (
  <div className="flex items-center gap-2.5 select-none">
    <div className={`flex items-center justify-center font-black tracking-tight ${small ? "w-8 h-8 text-sm" : "w-11 h-11 text-lg"} rounded-sm`}
      style={{ background: "#0B6E4F", color: "#FAF8F3", fontFamily: "'IBM Plex Mono', monospace" }}>
      TNB
    </div>
    {!small && (
      <div className="leading-none">
        <div className={`font-black tracking-tight ${dark ? "text-white" : "text-[#0B0E0C]"}`} style={{ fontFamily: "'Newsreader', serif", fontSize: "1.35rem" }}>
          The North Bulletin
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: "#0B6E4F", fontFamily: "'IBM Plex Mono', monospace" }}>
          The Voice of Northern Kenya
        </div>
      </div>
    )}
  </div>
);

const CategoryTag = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm transition-colors"
    style={{
      background: active ? "#0B6E4F" : "rgba(11,110,79,0.1)",
      color: active ? "#FAF8F3" : "#0B6E4F",
      fontFamily: "'IBM Plex Mono', monospace"
    }}
  >
    {label}
  </button>
);

const AdSlot = ({ label = "Advertisement", h = "h-24" }) => (
  <div className={`w-full ${h} border border-dashed flex items-center justify-center text-xs tracking-wide`}
    style={{ borderColor: "#D8D3C4", color: "#9A9382", background: "#F2EFE6", fontFamily: "'IBM Plex Mono', monospace" }}>
    {label}
  </div>
);

const SectionHeading = ({ title, onSeeAll }) => (
  <div className="flex items-end justify-between mb-4 border-b-2 pb-2" style={{ borderColor: "#0B0E0C" }}>
    <h2 className="font-black text-xl sm:text-2xl" style={{ fontFamily: "'Newsreader', serif", color: "#0B0E0C" }}>{title}</h2>
    {onSeeAll && (
      <button onClick={onSeeAll} className="text-xs font-bold uppercase tracking-wide flex items-center gap-1" style={{ color: "#0B6E4F" }}>
        See all <ChevronRight size={14} />
      </button>
    )}
  </div>
);

const ArticleCard = ({ a, onOpen, variant = "default" }) => {
  if (variant === "row") {
    return (
      <button onClick={() => onOpen(a)} className="flex gap-3 text-left w-full group py-3 border-b" style={{ borderColor: "#EAE6DA" }}>
        <img src={a.image} alt="" className="w-24 h-20 object-cover flex-shrink-0 rounded-sm" loading="lazy" />
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#0B6E4F", fontFamily: "'IBM Plex Mono', monospace" }}>{a.category}</span>
          <h4 className="font-bold leading-snug mt-0.5 group-hover:underline" style={{ fontFamily: "'Newsreader', serif", fontSize: "0.98rem", color: "#0B0E0C" }}>
            {a.title}
          </h4>
          <span className="text-[11px]" style={{ color: "#9A9382" }}>{fmtTime(a.date)}</span>
        </div>
      </button>
    );
  }
  if (variant === "hero") {
    return (
      <button onClick={() => onOpen(a)} className="relative block w-full text-left group overflow-hidden rounded-sm">
        <img src={a.image} alt="" className="w-full h-72 sm:h-[26rem] object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <CategoryTag label={a.category} />
            {a.county && <span className="text-[10px] text-white/70 flex items-center gap-1"><MapPin size={11} />{a.county}</span>}
          </div>
          <h1 className="text-white font-black leading-tight" style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(1.4rem, 3.6vw, 2.4rem)" }}>
            {a.title}
          </h1>
          <p className="text-white/75 text-sm mt-2 hidden sm:block max-w-2xl">{a.dek}</p>
          <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
            <span>{a.author.name}</span><span>·</span><span>{fmtTime(a.date)}</span>
          </div>
        </div>
      </button>
    );
  }
  return (
    <button onClick={() => onOpen(a)} className="text-left group block">
      <div className="relative overflow-hidden rounded-sm">
        <img src={a.image} alt="" className="w-full h-44 object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
        {a.isPodcast && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center"><Play size={18} fill="#0B0E0C" color="#0B0E0C" /></div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2.5">
        <CategoryTag label={a.category} />
      </div>
      <h3 className="font-bold leading-snug mt-1.5 group-hover:underline" style={{ fontFamily: "'Newsreader', serif", fontSize: "1.05rem", color: "#0B0E0C" }}>
        {a.title}
      </h3>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]" style={{ color: "#9A9382" }}>
        <span>{a.author.name}</span><span>·</span><span>{fmtTime(a.date)}</span>
      </div>
    </button>
  );
};

/* ---------------------------------------------------------
   HEADER / NAV / TICKER
--------------------------------------------------------- */

const Ticker = () => (
  <div className="w-full overflow-hidden flex items-stretch" style={{ background: "#0B0E0C" }}>
    <div className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0" style={{ background: "#C8102E" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span className="text-white text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Breaking</span>
    </div>
    <div className="relative flex-1 overflow-hidden">
      <div className="whitespace-nowrap py-1.5 animate-[ticker_32s_linear_infinite] inline-flex" style={{ willChange: "transform" }}>
        {[...BREAKING, ...BREAKING].map((t, i) => (
          <span key={i} className="text-white/90 text-[13px] px-8 flex-shrink-0">{t}</span>
        ))}
      </div>
    </div>
    <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
  </div>
);

const Header = ({ onNav, onSearch, onOpenAdmin, activeCat }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40" style={{ background: "#FAF8F3" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "#EAE6DA" }}>
        <div className="hidden sm:block text-[11px]" style={{ color: "#6B7062", fontFamily: "'IBM Plex Mono', monospace" }}>{fmtDate(now)} · Nairobi, KE</div>
        <div className="flex items-center gap-4 ml-auto text-[11px]" style={{ color: "#6B7062" }}>
          <button className="hover:text-[#0B6E4F]">Newsletter</button>
          <button onClick={onOpenAdmin} className="hover:text-[#0B6E4F] font-semibold">Editor Login</button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <button className="sm:hidden" onClick={() => setMenuOpen(true)}><Menu size={24} /></button>
        <button onClick={() => onNav("Latest News")}><Logo /></button>
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center gap-1 border rounded-sm px-2 py-1" style={{ borderColor: "#0B0E0C" }}>
              <Search size={16} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && q.trim() && onSearch(q)}
                placeholder="Search The North Bulletin" className="bg-transparent outline-none text-sm w-40 sm:w-64" />
              <button onClick={() => setSearchOpen(false)}><X size={15} /></button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={22} /></button>
          )}
        </div>
      </div>
      <nav className="hidden sm:block border-t" style={{ borderColor: "#EAE6DA", background: "#0B0E0C" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-5 px-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => onNav(c)}
              className="py-2.5 text-[12.5px] font-semibold uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors"
              style={{ color: activeCat === c ? "#2FBF71" : "#D8D3C4", borderColor: activeCat === c ? "#2FBF71" : "transparent" }}>
              {c}
            </button>
          ))}
        </div>
      </nav>
      {/* County pulse strip — signature element */}
      <div className="border-t overflow-x-auto no-scrollbar" style={{ borderColor: "#EAE6DA", background: "#F2EFE6" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 px-4 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 flex-shrink-0" style={{ color: "#0B0E0C", fontFamily: "'IBM Plex Mono', monospace" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#2FBF71" }} /> County Pulse
          </span>
          {COUNTIES.map((c) => (
            <button key={c} onClick={() => onNav("Counties", c)}
              className="text-[11px] px-2.5 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap"
              style={{ borderColor: "#0B6E4F", color: "#0B6E4F" }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" style={{ background: "#0B0E0C" }}>
          <div className="flex items-center justify-between px-4 py-3">
            <Logo dark />
            <button onClick={() => setMenuOpen(false)}><X size={26} color="#FAF8F3" /></button>
          </div>
          <div className="px-4 flex flex-col gap-1 mt-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => { onNav(c); setMenuOpen(false); }}
                className="text-left py-2.5 border-b text-white/90 font-semibold uppercase text-sm tracking-wide" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

/* ---------------------------------------------------------
   AI RECOMMENDATIONS
--------------------------------------------------------- */
const AIRecommendations = ({ current, onOpen }) => {
  const recs = useMemo(() => {
    const pool = ARTICLES.filter((a) => a.id !== current?.id);
    const scored = pool.map((a) => {
      let score = 0;
      if (current) {
        if (a.category === current.category) score += 3;
        if (a.county === current.county) score += 2;
        const overlap = a.tags?.filter((t) => current.tags?.includes(t)).length || 0;
        score += overlap * 2;
      }
      score += Math.random();
      return { a, score };
    });
    return scored.sort((x, y) => y.score - x.score).slice(0, 4).map((s) => s.a);
  }, [current]);
  return (
    <div className="rounded-sm p-4" style={{ background: "#0B0E0C" }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} color="#2FBF71" />
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Recommended for you</h3>
      </div>
      <p className="text-white/50 text-[11px] mb-3">Picked by our AI based on this story's topic, county and tags.</p>
      <div className="flex flex-col gap-3">
        {recs.map((a) => (
          <button key={a.id} onClick={() => onOpen(a)} className="flex gap-3 text-left group">
            <img src={a.image} className="w-16 h-14 object-cover rounded-sm flex-shrink-0" alt="" />
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase" style={{ color: "#2FBF71" }}>{a.category}</span>
              <p className="text-white text-[12.5px] leading-snug font-medium group-hover:underline line-clamp-2">{a.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   HOMEPAGE
--------------------------------------------------------- */
const Homepage = ({ onOpen, onNav }) => {
  const featured = ARTICLES.filter((a) => a.featured);
  const trending = ARTICLES.filter((a) => a.trending).concat(ARTICLES.slice(0, 3)).slice(0, 5);
  const latest = [...ARTICLES].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-10">
      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ArticleCard a={featured[0]} onOpen={onOpen} variant="hero" />
        </div>
        <div className="flex flex-col gap-3">
          {featured.slice(1, 3).map((a) => (
            <div key={a.id} className="flex gap-3">
              <img src={a.image} className="w-28 h-24 object-cover rounded-sm flex-shrink-0" alt="" />
              <div>
                <CategoryTag label={a.category} />
                <button onClick={() => onOpen(a)} className="block text-left font-bold leading-snug mt-1 hover:underline" style={{ fontFamily: "'Newsreader', serif", fontSize: "0.95rem" }}>
                  {a.title}
                </button>
                <span className="text-[11px]" style={{ color: "#9A9382" }}>{fmtTime(a.date)}</span>
              </div>
            </div>
          ))}
          <AdSlot label="Advertisement · 300×100" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-10">
          {/* LATEST */}
          <section>
            <SectionHeading title="Latest News" onSeeAll={() => onNav("Latest News")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {latest.slice(0, 4).map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />)}
            </div>
          </section>

          {/* COUNTIES STRIP */}
          <section>
            <SectionHeading title="Counties" onSeeAll={() => onNav("Counties")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARTICLES.filter((a) => a.county).slice(4, 8).map((a) => (
                <div key={a.id} className="flex gap-3 border-l-4 pl-3" style={{ borderColor: "#0B6E4F" }}>
                  <img src={a.image} className="w-20 h-20 object-cover rounded-sm flex-shrink-0" alt="" />
                  <div>
                    <span className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: "#0B6E4F", fontFamily: "'IBM Plex Mono', monospace" }}>
                      <MapPin size={11} />{a.county}
                    </span>
                    <button onClick={() => onOpen(a)} className="block text-left font-semibold leading-snug mt-0.5 hover:underline text-[14px]">
                      {a.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdSlot label="Advertisement · Leaderboard 728×90" h="h-20" />

          {/* VIDEO + PODCAST */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <SectionHeading title="Video News" onSeeAll={() => onNav("Video News")} />
              <button onClick={() => onOpen(ARTICLES[6])} className="relative block group">
                <img src={ARTICLES[6].image} className="w-full h-48 object-cover rounded-sm" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={20} fill="#0B0E0C" color="#0B0E0C" />
                  </div>
                </div>
                <p className="mt-2 font-bold text-sm">{ARTICLES[6].title}</p>
              </button>
            </div>
            <div>
              <SectionHeading title="Podcasts" onSeeAll={() => onNav("Podcasts")} />
              <button onClick={() => onOpen(ARTICLES[16])} className="flex gap-3 items-center text-left rounded-sm p-3" style={{ background: "#F2EFE6" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#0B0E0C" }}>
                  <Mic size={22} color="#2FBF71" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-snug">{ARTICLES[16].title}</p>
                  <span className="text-[11px]" style={{ color: "#9A9382" }}>The Bulletin Brief · {fmtTime(ARTICLES[16].date)}</span>
                </div>
              </button>
            </div>
          </section>

          {/* PHOTO GALLERY */}
          <section>
            <SectionHeading title="Photo Gallery" onSeeAll={() => onNav("Photo Gallery")} />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {["borana-festival", "wajir-camel-milk", "samburu-elders", "turkana-rugby", "mandera-market"].map((s, i) => (
                <img key={i} src={IMG(s, 300, 300)} className="w-full h-24 object-cover rounded-sm" alt="" />
              ))}
            </div>
          </section>

          {/* COMMUNITY / OBITUARIES / JOBS / EVENTS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="border rounded-sm p-4" style={{ borderColor: "#EAE6DA" }}>
              <h4 className="font-black text-sm uppercase mb-2 flex items-center gap-1.5" style={{ color: "#0B0E0C" }}><Bell size={14} /> Community Notices</h4>
              <p className="text-[12.5px]" style={{ color: "#6B7062" }}>Chalbi Basin water users association AGM — 12 July, Marsabit Town Hall.</p>
            </div>
            <div className="border rounded-sm p-4" style={{ borderColor: "#EAE6DA" }}>
              <h4 className="font-black text-sm uppercase mb-2 flex items-center gap-1.5" style={{ color: "#0B0E0C" }}><Briefcase size={14} /> Jobs & Opportunities</h4>
              <p className="text-[12.5px]" style={{ color: "#6B7062" }}>County Government of Isiolo is hiring a Water Engineer — apply by 20 July.</p>
            </div>
            <div className="border rounded-sm p-4" style={{ borderColor: "#EAE6DA" }}>
              <h4 className="font-black text-sm uppercase mb-2 flex items-center gap-1.5" style={{ color: "#0B0E0C" }}><Calendar size={14} /> Events Calendar</h4>
              <p className="text-[12.5px]" style={{ color: "#6B7062" }}>Turkana Cultural Week begins 15 July in Lodwar.</p>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-sm p-4" style={{ background: "#0B0E0C" }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} color="#2FBF71" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wide">Trending Now</h3>
            </div>
            <div className="flex flex-col gap-3">
              {trending.map((a, i) => (
                <button key={a.id} onClick={() => onOpen(a)} className="flex gap-3 text-left group">
                  <span className="font-black text-2xl leading-none" style={{ color: "#2FBF71", fontFamily: "'Newsreader', serif" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-white text-[13px] leading-snug font-medium group-hover:underline">{a.title}</p>
                </button>
              ))}
            </div>
          </div>

          <AIRecommendations current={null} onOpen={onOpen} />

          <div className="rounded-sm p-5 text-center" style={{ background: "#0B6E4F" }}>
            <Mail size={22} color="#FAF8F3" className="mx-auto mb-2" />
            <h3 className="text-white font-black text-base" style={{ fontFamily: "'Newsreader', serif" }}>The Morning Bulletin</h3>
            <p className="text-white/80 text-[12px] mt-1 mb-3">Northern Kenya's top stories, every morning at 6am — free.</p>
            <input placeholder="you@email.com" className="w-full px-3 py-2 rounded-sm text-sm outline-none mb-2" />
            <button className="w-full py-2 rounded-sm font-bold text-sm" style={{ background: "#0B0E0C", color: "#FAF8F3" }}>Subscribe</button>
          </div>

          <AdSlot label="Advertisement · 300×250" h="h-64" />

          <div>
            <h3 className="font-black text-sm uppercase tracking-wide mb-3 pb-2 border-b-2" style={{ borderColor: "#0B0E0C" }}>Opinion</h3>
            <div className="flex flex-col">
              {ARTICLES.filter((a) => a.category === "Opinion").map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} variant="row" />)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   CATEGORY PAGE
--------------------------------------------------------- */
const CategoryPage = ({ cat, county, onOpen, onNav }) => {
  const filtered = ARTICLES.filter((a) => {
    if (county) return a.county === county;
    if (cat === "Latest News") return true;
    if (cat === "Counties") return !!a.county;
    if (cat === "Photo Gallery" || cat === "Video News" || cat === "Podcasts") return cat === "Podcasts" ? a.isPodcast : true;
    return a.category === cat;
  }).sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 border-b-2 pb-3" style={{ borderColor: "#0B0E0C" }}>
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#0B6E4F", fontFamily: "'IBM Plex Mono', monospace" }}>
          {county ? "County" : "Section"}
        </span>
        <h1 className="font-black" style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>
          {county || cat}
        </h1>
      </div>
      {county && (
        <div className="flex gap-2 flex-wrap mb-6">
          {COUNTIES.map((c) => (
            <button key={c} onClick={() => onNav("Counties", c)} className="text-[11px] px-3 py-1 rounded-full border"
              style={{ borderColor: "#0B6E4F", color: c === county ? "#FAF8F3" : "#0B6E4F", background: c === county ? "#0B6E4F" : "transparent" }}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.length ? filtered.map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />) : (
            <p className="text-sm" style={{ color: "#9A9382" }}>No stories published in this section yet — check back soon.</p>
          )}
        </div>
        <aside className="flex flex-col gap-6">
          <AdSlot label="Advertisement · 300×250" h="h-64" />
          <AIRecommendations current={filtered[0]} onOpen={onOpen} />
        </aside>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   SEARCH PAGE
--------------------------------------------------------- */
const SearchPage = ({ query, onOpen }) => {
  const results = ARTICLES.filter((a) =>
    (a.title + a.dek + a.category + (a.county || "") + a.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-black text-2xl mb-1" style={{ fontFamily: "'Newsreader', serif" }}>Search results</h1>
      <p className="text-sm mb-6" style={{ color: "#6B7062" }}>{results.length} result{results.length !== 1 && "s"} for "{query}"</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {results.map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />)}
        {!results.length && <p className="text-sm" style={{ color: "#9A9382" }}>No stories matched. Try a different keyword, county name or topic.</p>}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   ARTICLE PAGE
--------------------------------------------------------- */
const ArticlePage = ({ article, onOpen, onNav }) => {
  const [comments, setComments] = useState(COMMENTS_SEED);
  const [text, setText] = useState("");
  const [liked, setLiked] = useState(false);
  const related = ARTICLES.filter((a) => a.id !== article.id && (a.category === article.category || a.county === article.county)).slice(0, 3);

  const postComment = () => {
    if (!text.trim()) return;
    setComments([{ id: Date.now(), name: "You", time: "Just now", text, likes: 0, approved: true }, ...comments]);
    setText("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <article>
          <button onClick={() => onNav(article.category)} className="text-[11px] font-bold uppercase" style={{ color: "#0B6E4F" }}>← {article.category}</button>
          <h1 className="font-black mt-2 leading-tight" style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(1.7rem,4vw,2.6rem)", color: "#0B0E0C" }}>
            {article.title}
          </h1>
          <p className="mt-3 text-lg" style={{ color: "#6B7062", fontFamily: "'Newsreader', serif" }}>{article.dek}</p>

          <div className="flex items-center justify-between flex-wrap gap-3 mt-5 py-3 border-y" style={{ borderColor: "#EAE6DA" }}>
            <div className="flex items-center gap-3">
              <img src={article.author.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div>
                <p className="font-bold text-sm">{article.author.name}</p>
                <p className="text-[11px]" style={{ color: "#9A9382" }}>{article.author.role} · {fmtDate(article.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, MessageCircle, Send].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: "#EAE6DA" }}>
                  <Icon size={14} />
                </button>
              ))}
              <button onClick={() => setLiked(!liked)} className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: liked ? "#0B6E4F" : "#EAE6DA", background: liked ? "#0B6E4F" : "transparent" }}>
                <Bookmark size={14} color={liked ? "#FAF8F3" : "#0B0E0C"} />
              </button>
            </div>
          </div>

          <img src={article.image} className="w-full h-72 sm:h-96 object-cover rounded-sm mt-5" alt="" />
          <p className="text-[11px] mt-1.5" style={{ color: "#9A9382" }}>Photo: The North Bulletin / {article.author.name}</p>

          <div className="prose-like mt-6 flex flex-col gap-4 text-[16.5px] leading-relaxed" style={{ color: "#1A1D19" }}>
            <p>{article.dek} County officials confirmed the development on {fmtDate(article.date)}, describing it as part of a wider effort to address longstanding service gaps across {article.county || "the region"}.</p>
            <p>Residents interviewed by The North Bulletin welcomed the news, though several cautioned that implementation — not announcement — would determine whether the initiative delivers lasting change. "We have heard promises before," one local leader said. "This time we are asking for a maintenance plan, not just a launch date."</p>
            <AdSlot label="Advertisement · In-article 336×280" h="h-56" />
            <p>Analysts tracking devolved governance in Northern Kenya say the story fits a broader pattern: national attention tends to arrive during crises, while the harder work of sustained investment gets less coverage. The North Bulletin will continue following this story as it develops.</p>
            <p>For updates on this and related stories from {article.county || "across Northern Kenya"}, subscribe to The Morning Bulletin newsletter or follow our {article.category} section.</p>
          </div>

          <div className="flex gap-2 flex-wrap mt-6">
            {article.tags.map((t) => <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "#F2EFE6", color: "#6B7062" }}>#{t}</span>)}
          </div>

          {/* AUTHOR PROFILE */}
          <div className="mt-8 p-4 rounded-sm flex gap-4 items-start" style={{ background: "#F2EFE6" }}>
            <img src={article.author.avatar} className="w-16 h-16 rounded-full object-cover flex-shrink-0" alt="" />
            <div>
              <p className="font-black" style={{ fontFamily: "'Newsreader', serif" }}>{article.author.name}</p>
              <p className="text-[12px] font-semibold" style={{ color: "#0B6E4F" }}>{article.author.role}</p>
              <p className="text-[13px] mt-1.5" style={{ color: "#6B7062" }}>{article.author.bio}</p>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mt-8">
            <h3 className="font-black text-lg mb-3" style={{ fontFamily: "'Newsreader', serif" }}>Comments ({comments.length})</h3>
            <div className="flex gap-2 mb-5">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Join the discussion — be respectful."
                className="flex-1 border rounded-sm px-3 py-2 text-sm outline-none" style={{ borderColor: "#D8D3C4" }} />
              <button onClick={postComment} className="px-4 py-2 rounded-sm text-sm font-bold" style={{ background: "#0B0E0C", color: "#FAF8F3" }}>Post</button>
            </div>
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#0B6E4F", color: "#FAF8F3" }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-bold">{c.name}</span> <span className="text-[11px]" style={{ color: "#9A9382" }}>· {c.time}</span></p>
                    <p className="text-[14px] mt-0.5">{c.text}</p>
                    <button className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "#9A9382" }}><ThumbsUp size={12} /> {c.likes}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RELATED */}
          <div className="mt-10">
            <SectionHeading title="Related Articles" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />)}
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-6">
          <AdSlot label="Advertisement · 300×250" h="h-64" />
          <AIRecommendations current={article} onOpen={onOpen} />
          <div className="rounded-sm p-5 text-center" style={{ background: "#0B6E4F" }}>
            <Mail size={20} color="#FAF8F3" className="mx-auto mb-2" />
            <p className="text-white font-bold text-sm">Never miss a story from {article.county || "Northern Kenya"}</p>
            <input placeholder="you@email.com" className="w-full px-3 py-2 rounded-sm text-sm outline-none my-2" />
            <button className="w-full py-2 rounded-sm font-bold text-sm" style={{ background: "#0B0E0C", color: "#FAF8F3" }}>Subscribe</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   FOOTER
--------------------------------------------------------- */
const Footer = ({ onNav }) => (
  <footer style={{ background: "#0B0E0C" }} className="mt-10">
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-white/70 text-[13px]">
      <div className="col-span-2">
        <Logo dark />
        <p className="mt-3 max-w-xs text-white/50">Independent, regional journalism from Marsabit to Mandera — reporting the stories that shape Northern Kenya, verified and told with care.</p>
        <div className="flex gap-3 mt-4">
          {[Facebook, Twitter, MessageCircle, Send].map((Icon, i) => (
            <div key={i} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"><Icon size={14} /></div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold uppercase text-xs tracking-wide mb-3">Sections</h4>
        <div className="flex flex-col gap-2">
          {CATEGORIES.slice(0, 6).map((c) => <button key={c} onClick={() => onNav(c)} className="text-left hover:text-[#2FBF71]">{c}</button>)}
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold uppercase text-xs tracking-wide mb-3">More</h4>
        <div className="flex flex-col gap-2">
          {["Photo Gallery", "Video News", "Podcasts", "Community Notices", "Obituaries", "Jobs & Opportunities", "Events Calendar"].map((c) => (
            <button key={c} onClick={() => onNav(c)} className="text-left hover:text-[#2FBF71]">{c}</button>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-white/40 text-[11px]">
      © {now.getFullYear()} The North Bulletin. All rights reserved. · Registered under the Media Council of Kenya
    </div>
  </footer>
);

/* ---------------------------------------------------------
   ADMIN DASHBOARD
--------------------------------------------------------- */
const ADMIN_ARTICLES = ARTICLES.map((a, i) => ({
  ...a, status: i % 5 === 0 ? "Draft" : i % 7 === 0 ? "Scheduled" : "Published", views: Math.floor(500 + Math.random() * 12000)
}));

const ANALYTICS_TRAFFIC = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  views: Math.floor(8000 + Math.random() * 6000),
}));
const ANALYTICS_CATS = CATEGORIES.slice(0, 6).map((c) => ({ name: c, value: Math.floor(500 + Math.random() * 3000) }));
const PIE_COLORS = ["#0B6E4F", "#2FBF71", "#0B0E0C", "#6B7062", "#C8102E", "#9A9382"];

const StatCard = ({ label, value, icon: Icon, delta }) => (
  <div className="bg-white rounded-sm border p-4" style={{ borderColor: "#EAE6DA" }}>
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#9A9382" }}>{label}</span>
      <Icon size={16} color="#0B6E4F" />
    </div>
    <p className="font-black text-2xl mt-1" style={{ fontFamily: "'Newsreader', serif" }}>{value}</p>
    {delta && <span className="text-[11px] font-semibold" style={{ color: "#0B6E4F" }}>{delta}</span>}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = { Published: ["#0B6E4F", "#E7F3EE"], Draft: ["#9A9382", "#F2EFE6"], Scheduled: ["#B7791F", "#FBF0DC"] };
  const [c, bg] = map[status];
  return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: c, background: bg }}>{status}</span>;
};

const AdminDashboard = ({ onExit }) => {
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(null);
  const [articleList, setArticleList] = useState(ADMIN_ARTICLES);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "comments", label: "Comments", icon: MessageCircle },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const setStatus = (id, status) => setArticleList((list) => list.map((a) => a.id === id ? { ...a, status } : a));
  const removeArticle = (id) => setArticleList((list) => list.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen flex" style={{ background: "#F2EFE6" }}>
      {/* SIDEBAR */}
      <aside className="w-16 sm:w-56 flex-shrink-0 flex flex-col" style={{ background: "#0B0E0C" }}>
        <div className="p-4 hidden sm:block"><Logo dark small /></div>
        <div className="p-3 sm:hidden flex justify-center"><Logo dark small /></div>
        <nav className="flex flex-col gap-1 px-2 mt-2">
          {navItems.map((n) => (
            <button key={n.id} onClick={() => { setTab(n.id); setEditing(null); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold"
              style={{ background: tab === n.id ? "#0B6E4F" : "transparent", color: tab === n.id ? "#FAF8F3" : "#D8D3C4" }}>
              <n.icon size={17} /><span className="hidden sm:inline">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-2">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold text-white/60 hover:text-white">
            <ChevronLeft size={17} /><span className="hidden sm:inline">Exit to site</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-black text-2xl" style={{ fontFamily: "'Newsreader', serif" }}>
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
            <p className="text-sm" style={{ color: "#6B7062" }}>Signed in as Editor — Amina Roble</p>
          </div>
          {tab === "articles" && !editing && (
            <button onClick={() => setEditing({ new: true })} className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold text-sm" style={{ background: "#0B6E4F", color: "#FAF8F3" }}>
              <Plus size={16} /> New Article
            </button>
          )}
        </div>

        {tab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Published Today" value="6" icon={Newspaper} delta="+2 vs yesterday" />
              <StatCard label="Total Views (7d)" value="58.2K" icon={Eye} delta="+12.4%" />
              <StatCard label="Pending Comments" value="9" icon={MessageCircle} />
              <StatCard label="Newsletter Subs" value="14,208" icon={Mail} delta="+310 this week" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
              <div className="bg-white rounded-sm border p-4" style={{ borderColor: "#EAE6DA" }}>
                <h3 className="font-bold text-sm mb-3">Weekly Traffic</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={ANALYTICS_TRAFFIC}>
                    <CartesianGrid stroke="#EAE6DA" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#0B6E4F" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-sm border p-4" style={{ borderColor: "#EAE6DA" }}>
                <h3 className="font-bold text-sm mb-3">Reads by Section</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={ANALYTICS_CATS} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                      {ANALYTICS_CATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-sm border p-4" style={{ borderColor: "#EAE6DA" }}>
              <h3 className="font-bold text-sm mb-3">Recent Activity</h3>
              <ul className="text-sm flex flex-col gap-2" style={{ color: "#6B7062" }}>
                <li>Halima Guyo published <span className="font-semibold text-black">"Marsabit County Rolls Out Solar-Powered Water Points…"</span></li>
                <li>3 comments flagged for review on <span className="font-semibold text-black">"Ghost Boreholes"</span> investigation</li>
                <li>Newsletter "The Morning Bulletin — 4 July" sent to 14,102 subscribers</li>
              </ul>
            </div>
          </div>
        )}

        {tab === "articles" && !editing && (
          <div className="bg-white rounded-sm border overflow-x-auto" style={{ borderColor: "#EAE6DA" }}>
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left border-b" style={{ borderColor: "#EAE6DA", color: "#9A9382" }}>
                  <th className="p-3 font-semibold text-xs uppercase">Title</th>
                  <th className="p-3 font-semibold text-xs uppercase">Category</th>
                  <th className="p-3 font-semibold text-xs uppercase">Status</th>
                  <th className="p-3 font-semibold text-xs uppercase">Views</th>
                  <th className="p-3 font-semibold text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articleList.map((a) => (
                  <tr key={a.id} className="border-b" style={{ borderColor: "#F2EFE6" }}>
                    <td className="p-3 max-w-[280px]">
                      <p className="font-semibold truncate">{a.title}</p>
                      <p className="text-[11px]" style={{ color: "#9A9382" }}>{a.author.name} · {fmtTime(a.date)}</p>
                    </td>
                    <td className="p-3">{a.category}</td>
                    <td className="p-3"><StatusBadge status={a.status} /></td>
                    <td className="p-3">{a.views.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(a)} className="p-1.5 rounded-sm hover:bg-gray-100"><Edit3 size={15} /></button>
                        {a.status !== "Published" ? (
                          <button onClick={() => setStatus(a.id, "Published")} className="p-1.5 rounded-sm hover:bg-gray-100" title="Publish"><CheckCircle2 size={15} color="#0B6E4F" /></button>
                        ) : (
                          <button onClick={() => setStatus(a.id, "Draft")} className="p-1.5 rounded-sm hover:bg-gray-100" title="Unpublish"><XCircle size={15} color="#9A9382" /></button>
                        )}
                        <button onClick={() => removeArticle(a.id)} className="p-1.5 rounded-sm hover:bg-gray-100"><Trash2 size={15} color="#C8102E" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "articles" && editing && (
          <div className="bg-white rounded-sm border p-5 max-w-2xl" style={{ borderColor: "#EAE6DA" }}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Headline</label>
                <input defaultValue={editing.title} className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Dek / Summary</label>
                <textarea defaultValue={editing.dek} rows={2} className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Category</label>
                  <select defaultValue={editing.category} className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>County (optional)</label>
                  <select defaultValue={editing.county || ""} className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }}>
                    <option value="">—</option>
                    {COUNTIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Cover Image / Video</label>
                <div className="border border-dashed rounded-sm p-6 flex flex-col items-center gap-2 mt-1" style={{ borderColor: "#D8D3C4" }}>
                  <Upload size={20} color="#9A9382" />
                  <span className="text-xs" style={{ color: "#9A9382" }}>Drag & drop, or click to upload image / video file</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Publish Schedule</label>
                <input type="datetime-local" className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-sm text-sm font-bold border" style={{ borderColor: "#D8D3C4" }}>Cancel</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-sm text-sm font-bold" style={{ background: "#9A9382", color: "#FAF8F3" }}>Save Draft</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-sm text-sm font-bold" style={{ background: "#0B6E4F", color: "#FAF8F3" }}>Publish</button>
              </div>
            </div>
          </div>
        )}

        {tab === "comments" && (
          <div className="bg-white rounded-sm border divide-y" style={{ borderColor: "#EAE6DA" }}>
            {COMMENTS_SEED.concat([{ id: 99, name: "Anon1234", time: "20m ago", text: "This story seems one-sided, can you get a government response?", likes: 0 }]).map((c) => (
              <div key={c.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">{c.name} <span className="text-[11px] font-normal" style={{ color: "#9A9382" }}>· {c.time}</span></p>
                  <p className="text-sm mt-1">{c.text}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-1.5 rounded-sm border" style={{ borderColor: "#EAE6DA" }}><CheckCircle2 size={15} color="#0B6E4F" /></button>
                  <button className="p-1.5 rounded-sm border" style={{ borderColor: "#EAE6DA" }}><Trash2 size={15} color="#C8102E" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white rounded-sm border overflow-x-auto" style={{ borderColor: "#EAE6DA" }}>
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left border-b" style={{ borderColor: "#EAE6DA", color: "#9A9382" }}>
                  <th className="p-3 font-semibold text-xs uppercase">Name</th>
                  <th className="p-3 font-semibold text-xs uppercase">Role</th>
                  <th className="p-3 font-semibold text-xs uppercase">County Desk</th>
                  <th className="p-3 font-semibold text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {AUTHORS.map((a, i) => (
                  <tr key={a.id} className="border-b" style={{ borderColor: "#F2EFE6" }}>
                    <td className="p-3 flex items-center gap-2"><img src={a.avatar} className="w-7 h-7 rounded-full" alt="" />{a.name}</td>
                    <td className="p-3">{i === 0 ? "Editor-in-Chief" : "Reporter"}</td>
                    <td className="p-3">{a.county}</td>
                    <td className="p-3"><StatusBadge status="Published" /></td>
                  </tr>
                ))}
                <tr>
                  <td className="p-3 text-[13px]" style={{ color: "#9A9382" }} colSpan={4}>+ Invite a new team member by email</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "newsletter" && (
          <div className="bg-white rounded-sm border p-5 max-w-xl" style={{ borderColor: "#EAE6DA" }}>
            <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Newsletter Subject</label>
            <input defaultValue="The Morning Bulletin — Top stories from Northern Kenya" className="w-full border rounded-sm px-3 py-2 mt-1 mb-4 text-sm" style={{ borderColor: "#D8D3C4" }} />
            <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Featured Stories</label>
            <div className="flex flex-col gap-2 mt-1 mb-4">
              {ARTICLES.slice(0, 3).map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> {a.title}</label>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-4" style={{ color: "#6B7062" }}>
              <span>Recipients: 14,208 subscribers</span>
              <span>Est. open rate: 42%</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-sm text-sm font-bold border" style={{ borderColor: "#D8D3C4" }}>Send Test</button>
              <button className="px-4 py-2 rounded-sm text-sm font-bold" style={{ background: "#0B6E4F", color: "#FAF8F3" }}>Send Newsletter</button>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-sm border p-4" style={{ borderColor: "#EAE6DA" }}>
              <h3 className="font-bold text-sm mb-3">Top Articles by Views</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...articleList].sort((a, b) => b.views - a.views).slice(0, 6)} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid stroke="#EAE6DA" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#0B6E4F" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Avg. Time on Page" value="3m 42s" icon={Clock} />
              <StatCard label="Bounce Rate" value="38.1%" icon={ArrowUpRight} />
              <StatCard label="Google News Index" value="Active" icon={Newspaper} />
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white rounded-sm border p-5 max-w-xl flex flex-col gap-4" style={{ borderColor: "#EAE6DA" }}>
            <div>
              <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Site Title</label>
              <input defaultValue="The North Bulletin" className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>SEO Meta Description</label>
              <textarea rows={2} defaultValue="The North Bulletin — independent news and analysis from Marsabit, Mandera, Wajir, Isiolo, Turkana, Samburu and Garissa." className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase" style={{ color: "#9A9382" }}>Google AdSense Publisher ID</label>
              <input placeholder="pub-XXXXXXXXXXXXXXXX" className="w-full border rounded-sm px-3 py-2 mt-1 text-sm" style={{ borderColor: "#D8D3C4" }} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Submit new articles to Google News sitemap automatically</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Require comment approval before publishing</label>
            <button className="self-start px-4 py-2 rounded-sm text-sm font-bold" style={{ background: "#0B6E4F", color: "#FAF8F3" }}>Save Settings</button>
          </div>
        )}
      </main>
    </div>
  );
};

/* ---------------------------------------------------------
   ROOT APP
--------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState({ page: "home" });
  const [admin, setAdmin] = useState(false);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "instant" }); }, [view, admin]);

  const goCategory = (cat, county) => { setView({ page: "category", cat, county }); };
  const goArticle = (article) => setView({ page: "article", article });
  const goSearch = (q) => setView({ page: "search", q });

  if (admin) return <AdminDashboard onExit={() => setAdmin(false)} />;

  return (
    <div style={{ background: "#FAF8F3", fontFamily: "'Inter', sans-serif", color: "#0B0E0C" }} className="min-h-screen">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;0,700;0,800;1,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid #0B6E4F; outline-offset: 2px; }
      `}</style>
      <div ref={topRef} />
      <Ticker />
      <Header onNav={goCategory} onSearch={goSearch} onOpenAdmin={() => setAdmin(true)} activeCat={view.cat} />

      {view.page === "home" && <Homepage onOpen={goArticle} onNav={goCategory} />}
      {view.page === "category" && <CategoryPage cat={view.cat} county={view.county} onOpen={goArticle} onNav={goCategory} />}
      {view.page === "search" && <SearchPage query={view.q} onOpen={goArticle} />}
      {view.page === "article" && <ArticlePage article={view.article} onOpen={goArticle} onNav={goCategory} />}

      <Footer onNav={goCategory} />
    </div>
  );
}
