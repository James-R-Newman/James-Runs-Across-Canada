import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * James Runs Across Canada
 * Single-file React site with tabs:
 * - Home: hero + marquee, interactive (pan/zoom + pin) map, charity block, scrollable blog summaries
 * - Blog: scrollable daily posts with photos + text + simple “Add post” form (saved to localStorage)
 * - My Story: long-form text
 * - Contact: contact form (UI-only)
 *
 * Dark theme inspired by bold campaign sites.
 */

const STORAGE_KEY = "james_runs_across_canada_blog_posts_v1";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function startOfDayExcerpt(text, n = 160) {
  const clean = (text || "").trim().split(/\s+/).join(" ");
  if (clean.length <= n) return clean;
  const cut = clean.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 60 ? cut.slice(0, lastSpace) : cut;
  return safe + "…";
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const SAMPLE_POSTS = [
  {
    id: "p1",
    date: "2026-01-01",
    title: "Day 1 — Setting out",
    content:
      "Today is the first step. We met early, checked supplies, and mapped the route. The goal is simple: show up daily, learn loudly, and keep the charity at the center of every mile. If you’re reading this, you’re part of the story already — thank you.",
    photos: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1520975958221-0f9d8a4e8aaf?auto=format&fit=crop&w=1400&q=70",
    ],
  },
  {
    id: "p2",
    date: "2026-01-02",
    title: "Day 2 — Small wins",
    content:
      "A little progress compounds fast. We hit our target distance and talked with people along the way. The charity exists because the ‘why’ matters more than the numbers — but the numbers help, too. We’re collecting stories and hope.",
    photos: [
      "https://images.unsplash.com/photo-1520975952025-817bd6a2f76d?auto=format&fit=crop&w=1400&q=70",
    ],
  },
  {
    id: "p3",
    date: "2026-01-03",
    title: "Day 3 — Weather and perspective",
    content:
      "Rain changes the mood, but it also sharpens the focus. We slowed down, stayed safe, and kept moving. If you’ve ever had to restart after a setback, you know the feeling: the work is still worth doing.",
    photos: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=70",
    ],
  },
];

function useLocalStoragePosts() {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return SAMPLE_POSTS;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return SAMPLE_POSTS;
      return parsed;
    } catch {
      return SAMPLE_POSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  return [posts, setPosts];
}

function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur " +
        className
      }
    >
      {children}
    </div>
  );
}

function Pill({ children, className = "" }) {
  return (
    <div
      className={
        "inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-black uppercase tracking-widest text-white/90 " +
        className
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-black uppercase tracking-widest text-white">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
    </div>
  );
}

function Marquee({ text = "JAMES RUNS ACROSS CANADA • FOLLOW ALONG • DONATE • DAILY BLOG • " }) {
  const repeated = useMemo(() => Array.from({ length: 12 }).map(() => text).join(""), [text]);
  return (
    <div className="overflow-hidden border-y border-white/10 bg-yellow-300">
      <div
        className="whitespace-nowrap py-2 text-xs sm:text-sm font-black tracking-widest uppercase text-neutral-950"
        style={{ animation: "marquee 18s linear infinite" }}
      >
        {repeated}
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function TopNav({ tab, setTab }) {
  const tabs = [
    { key: "home", label: "Home" },
    { key: "blog", label: "Blog" },
    { key: "story", label: "My Story" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Pill className="hidden sm:inline-flex bg-yellow-300 text-neutral-950 border-yellow-200/40">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-neutral-950" />
            Live
          </Pill>
          <div className="min-w-0">
            <div className="truncate text-sm sm:text-base font-black uppercase tracking-tight text-white">
              James Runs Across Canada
            </div>
            <div className="hidden sm:block text-xs text-white/60">GPS map • daily blog • charity mission</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "rounded-full px-3 py-1.5 text-sm font-black uppercase tracking-wide transition border " +
                (tab === t.key
                  ? "border-yellow-300 bg-yellow-300 text-neutral-950"
                  : "border-white/15 bg-white/[0.03] text-white hover:border-yellow-300/60 hover:bg-white/[0.06]")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Interactive SVG Map (pan/zoom + pin placement) ---
function InteractiveMap({ pins, setPins }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  const [hoverPinId, setHoverPinId] = useState(null);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    const next = clamp(scale * (delta > 0 ? 0.92 : 1.08), 0.85, 2.75);
    setScale(next);
  };

  const onPointerDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    setDrag({ startX: e.clientX, startY: e.clientY, startOffset: offset });
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setOffset({ x: drag.startOffset.x + dx, y: drag.startOffset.y + dy });
  };

  const onPointerUp = (e) => {
    const el = containerRef.current;
    el?.releasePointerCapture?.(e.pointerId);
    setDrag(null);
  };

  const onMapClick = (e) => {
    const svg = e.currentTarget.querySelector("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const x = (cx - rect.width / 2 - offset.x) / scale + 500;
    const y = (cy - rect.height / 2 - offset.y) / scale + 250;

    if (x < 0 || x > 1000 || y < 0 || y > 500) return;

    setPins((prev) => [
      ...prev,
      {
        id: uid(),
        x,
        y,
        label: `Pin ${prev.length + 1}`,
      },
    ]);
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const removeLast = () => {
    setPins((prev) => prev.slice(0, -1));
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-black uppercase tracking-widest text-white">GPS map</div>
          <div className="text-xs text-white/60">Scroll to zoom • Drag to pan • Click to drop a pin</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetView}
            className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:border-yellow-300/60"
          >
            Reset
          </button>
          <button
            onClick={removeLast}
            className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:border-yellow-300/60"
          >
            Remove last
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[360px] select-none bg-neutral-950"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => {
          e.preventDefault();
          resetView();
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPins([]);
          }}
          className="absolute right-3 top-3 rounded-full border border-white/15 bg-neutral-950/70 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white backdrop-blur hover:border-yellow-300/60"
        >
          Clear pins
        </button>

        <div className="h-full w-full" onClick={onMapClick}>
          <svg viewBox="0 0 1000 500" className="h-full w-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>

            <rect width="1000" height="500" fill="url(#grid)" />
            <rect width="1000" height="500" fill="url(#glow)" />

            <g
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) translate(-500px, -250px)`,
                transformOrigin: "50% 50%",
              }}
            >
              <path
                d="M138 155c38-27 91-45 140-32 45 12 72 43 78 66 7 29-8 58-38 78-31 21-75 34-113 34-44 0-86-12-109-39-22-26-12-78 42-107z"
                fill="rgba(255,255,255,0.10)"
              />
              <path
                d="M361 291c18-20 44-30 77-29 39 1 68 18 86 38 18 20 25 44 12 65-17 27-55 43-95 43-38 0-77-15-89-44-9-23-4-49 9-73z"
                fill="rgba(255,255,255,0.10)"
              />
              <path
                d="M511 171c37-35 86-56 144-56 57 0 112 19 153 54 36 31 49 72 21 103-31 35-96 56-165 56-62 0-127-17-159-56-25-31-18-71 6-101z"
                fill="rgba(255,255,255,0.10)"
              />
              <path
                d="M675 320c27-18 63-23 95-11 25 10 40 30 35 50-7 26-44 44-83 44-33 0-65-10-77-30-11-18-2-39 30-53z"
                fill="rgba(255,255,255,0.10)"
              />

              {pins.map((p) => (
                <g key={p.id} onMouseEnter={() => setHoverPinId(p.id)} onMouseLeave={() => setHoverPinId(null)}>
                  <circle cx={p.x} cy={p.y} r={7} fill="#FDE047" opacity={0.95} />
                  <circle cx={p.x} cy={p.y} r={16} fill="#FDE047" opacity={0.14} />
                  {hoverPinId === p.id ? (
                    <g>
                      <rect x={p.x + 10} y={p.y - 24} rx={10} ry={10} width={190} height={34} fill="rgba(0,0,0,0.85)" />
                      <text x={p.x + 18} y={p.y - 3} fontSize="12" fill="#FDE047">
                        {p.label} • ({Math.round(p.x)}, {Math.round(p.y)})
                      </text>
                    </g>
                  ) : null}
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-white/70">
            Pins: <span className="font-black text-white">{pins.length}</span>
          </div>
          <div className="text-xs text-white/50">Use pins for checkpoints, sponsor spots, or daily highlights.</div>
        </div>
      </div>
    </Card>
  );
}

function BlogSummary({ posts, onOpenPost }) {
  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  return (
    <Card className="h-full">
      <div className="border-b border-white/10 px-4 py-3">
        <SectionTitle title="Latest blog" subtitle="The beginning of each day’s post" />
      </div>
      <div className="max-h-[560px] overflow-y-auto p-4">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">No posts yet.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpenPost(p.id)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-yellow-300/40 hover:bg-white/[0.05]"
              >
                <div className="flex gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-neutral-950">
                    {p.photos?.[0] ? (
                      <img src={p.photos[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-white/50">No photo</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-black uppercase tracking-wide text-white">{p.title || "Daily update"}</div>
                      <div className="shrink-0 text-xs text-white/50">{formatDate(p.date)}</div>
                    </div>
                    <div className="mt-1 text-sm text-white/75">{startOfDayExcerpt(p.content, 140)}</div>
                    <div className="mt-2 text-xs font-black uppercase tracking-widest text-yellow-300">Read →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function CharityBlock() {
  return (
    <Card>
      <div className="p-5">
        <Pill className="bg-yellow-300 text-neutral-950 border-yellow-200/40">Charity</Pill>
        <div className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Why this run matters</div>
        <div className="mt-2 text-sm leading-6 text-white/70">
          Replace this with your real mission: what you’re raising for, where the money goes, and why it’s urgent.
          Keep it concrete — people donate when they understand exactly what changes.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
          >
            Donate
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
          >
            Learn more
          </a>
        </div>
      </div>
    </Card>
  );
}

function Hero({ latestPostId, onOpenPost }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=2400&q=75"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/65 to-neutral-950" />

        <div className="relative p-6 sm:p-10">
          <Pill className="bg-white/[0.06] text-white border-white/15">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-300" />
            Live run + daily blog
          </Pill>

          <h1 className="mt-4 text-3xl sm:text-6xl font-black uppercase tracking-tight text-white">
            James Runs Across Canada
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-6 text-white/80">
            Follow the journey coast-to-coast. Track the route on the GPS map, read the daily posts, and support the charity
            behind the run.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
            >
              Donate
            </a>
            <button
              onClick={() => latestPostId && onOpenPost(latestPostId)}
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
            >
              Read latest
            </button>
            <button
              onClick={() => window.scrollTo({ top: 620, behavior: "smooth" })}
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
            >
              View map
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Days", v: "01" },
              { k: "KM", v: "—" },
              { k: "Raised", v: "—" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white">
                <div className="text-xs font-black uppercase tracking-widest text-white/60">{s.k}</div>
                <div className="mt-1 text-2xl font-black tracking-tight">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Marquee />
    </div>
  );
}

function HomeTab({ posts, onOpenPost, pins, setPins }) {
  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);
  const latestPostId = sorted[0]?.id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Hero latestPostId={latestPostId} onOpenPost={onOpenPost} />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <InteractiveMap pins={pins} setPins={setPins} />
          <CharityBlock />
        </div>
        <BlogSummary posts={posts} onOpenPost={onOpenPost} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm font-black uppercase tracking-wide text-white">What we do</div>
          <div className="mt-2 text-sm text-white/70">One-line description of the program / impact.</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-black uppercase tracking-wide text-white">Who it helps</div>
          <div className="mt-2 text-sm text-white/70">Name the group and what changes for them.</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-black uppercase tracking-wide text-white">How to support</div>
          <div className="mt-2 text-sm text-white/70">Donate, volunteer, sponsor a day, or share the blog.</div>
        </Card>
      </div>
    </div>
  );
}

function BlogTab({ posts, setPosts, focusPostId, onFocused }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    content: "",
    photos: "",
  });
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  useEffect(() => {
    if (!focusPostId) return;
    const el = document.getElementById(`post-${focusPostId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocused?.();
    }
  }, [focusPostId, onFocused]);

  const addPost = () => {
    setError(null);
    if (!form.date || !form.content.trim()) {
      setError("Please add a date and some text.");
      return;
    }

    const photos = form.photos
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const next = {
      id: uid(),
      date: form.date,
      title: form.title.trim() || `Daily update — ${formatDate(form.date)}`,
      content: form.content.trim(),
      photos,
    };

    setPosts((prev) => [next, ...prev]);
    setForm({ date: new Date().toISOString().slice(0, 10), title: "", content: "", photos: "" });
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20";

  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <div className="border-b border-white/10 px-4 py-3">
          <SectionTitle title="Add a daily post" subtitle="Saved in your browser (localStorage)" />
        </div>
        <div className="space-y-3 p-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
          ) : null}

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Date</div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className={inputCls}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Title</div>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Day 12 — Something memorable"
              className={inputCls}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Photos (comma-separated URLs)</div>
            <input
              value={form.photos}
              onChange={(e) => setForm((f) => ({ ...f, photos: e.target.value }))}
              placeholder="https://… , https://…"
              className={inputCls}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Text</div>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="What happened today?"
              rows={7}
              className={inputCls + " resize-none"}
            />
          </label>

          <button
            onClick={addPost}
            className="w-full rounded-xl border border-yellow-300 bg-yellow-300 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
          >
            Publish post
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setPosts(SAMPLE_POSTS);
            }}
            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
          >
            Reset sample posts
          </button>
        </div>
      </Card>

      <Card className="min-h-[560px]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <SectionTitle title="Daily posts" subtitle="Scrollable feed with photos and text" />
          <div className="text-xs text-white/50">{sorted.length} posts</div>
        </div>

        <div ref={listRef} className="max-h-[760px] overflow-y-auto p-4">
          <div className="space-y-4">
            {sorted.map((p) => (
              <article key={p.id} id={`post-${p.id}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-base font-black uppercase tracking-wide text-white">{p.title}</div>
                    <div className="mt-0.5 text-xs text-white/50">{formatDate(p.date)}</div>
                  </div>
                  <button
                    onClick={() => deletePost(p.id)}
                    className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
                  >
                    Delete
                  </button>
                </div>

                {p.photos?.length ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {p.photos.slice(0, 4).map((src, i) => (
                      <div key={src + i} className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950">
                        <img src={src} alt="" className="h-48 w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/80">{p.content}</div>
              </article>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function StoryTab() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-base font-black uppercase tracking-widest text-white">My story</div>
          <div className="mt-1 text-sm text-white/60">Outline the charity and the “why” in more detail.</div>
        </div>
        <div className="space-y-4 px-6 py-6 text-sm leading-7 text-white/80">
          <p>
            <span className="font-black text-white">Start with the moment it became personal.</span> What happened that made this
            charity unavoidable for you? Be specific — a short story beats a long explanation.
          </p>
          <p>
            <span className="font-black text-white">Explain the mission in plain language.</span> Who does this help, what changes
            for them, and what does success look like?
          </p>
          <p>
            <span className="font-black text-white">Share your approach.</span> What are you doing day-to-day (and why this method)?
            Add a few measurable goals (e.g., funds raised, events, miles, visits, conversations).
          </p>
          <p>
            <span className="font-black text-white">Ask clearly.</span> Tell people what to do next: donate, share, volunteer,
            sponsor, or simply follow along.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">
            <div className="font-black uppercase tracking-widest text-white">Quick fill-in template</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Because of ______, I realized ______.</li>
              <li>This charity exists to ______ for ______.</li>
              <li>Right now, we’re doing ______ to create ______.</li>
              <li>You can help by ______.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ContactTab() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const submit = (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please fill out name, email, and message." });
      return;
    }

    setStatus({ type: "success", message: "Message ready to send. (Hook this to Formspree/Netlify Forms or a backend.)" });
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20";

  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 lg:grid-cols-2">
      <Card>
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-base font-black uppercase tracking-widest text-white">Get in touch</div>
          <div className="mt-1 text-sm text-white/60">Use this form, or add your email + socials here.</div>
        </div>
        <div className="space-y-3 px-6 py-6 text-sm text-white/80">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-black uppercase tracking-widest text-white">Suggested contact details</div>
            <div className="mt-2 space-y-1 text-sm text-white/70">
              <div>✉️ Email: you@example.com</div>
              <div>📷 Instagram: @yourhandle</div>
              <div>📍 Location: City, Canada</div>
            </div>
          </div>
          <div className="text-sm text-white/70">
            To make the form actually send messages, connect it to Formspree, Netlify Forms, or a simple server endpoint.
          </div>
        </div>
      </Card>

      <Card>
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-base font-black uppercase tracking-widest text-white">Contact form</div>
          <div className="mt-1 text-sm text-white/60">UI-only (no backend included yet).</div>
        </div>
        <form onSubmit={submit} className="space-y-3 px-6 py-6">
          {status.type === "error" ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{status.message}</div>
          ) : null}
          {status.type === "success" ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">
              {status.message}
            </div>
          ) : null}

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Name</div>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Email</div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputCls}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">Message</div>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={7}
              className={inputCls + " resize-none"}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl border border-yellow-300 bg-yellow-300 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
          >
            Submit
          </button>
        </form>
      </Card>
    </div>
  );
}

export default function CharitySiteApp() {
  const [tab, setTab] = useState("home");
  const [posts, setPosts] = useLocalStoragePosts();
  const [focusPostId, setFocusPostId] = useState(null);
  const [pins, setPins] = useState([]);

  const onOpenPost = (postId) => {
    if (!postId) return;
    setTab("blog");
    setFocusPostId(postId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TopNav
        tab={tab}
        setTab={(t) => {
          setTab(t);
          setFocusPostId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {tab === "home" ? <HomeTab posts={posts} onOpenPost={onOpenPost} pins={pins} setPins={setPins} /> : null}

      {tab === "blog" ? (
        <BlogTab
          posts={posts}
          setPosts={setPosts}
          focusPostId={focusPostId}
          onFocused={() => setFocusPostId(null)}
        />
      ) : null}

      {tab === "story" ? <StoryTab /> : null}
      {tab === "contact" ? <ContactTab /> : null}

      <footer className="mt-10 border-t border-white/10 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
            <div>
              <div className="text-base font-black uppercase tracking-tight text-white">James Runs Across Canada</div>
              <div className="mt-2 max-w-xl text-sm text-white/60">GPS map updates + daily blog. Built for a bold, campaign-style feel.</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
                >
                  Donate
                </a>
                <button
                  onClick={() => setTab("contact")}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:border-yellow-300/50"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-sm font-semibold text-white/70">© {new Date().getFullYear()} James Runs Across Canada</div>
              <div className="mt-2 flex flex-wrap gap-3 sm:justify-end">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-white/70 hover:text-white">
                  Privacy
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-white/70 hover:text-white">
                  Donate
                </a>
                <button onClick={() => setTab("contact")} className="text-sm font-semibold text-white/70 hover:text-white">
                  Get in touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
