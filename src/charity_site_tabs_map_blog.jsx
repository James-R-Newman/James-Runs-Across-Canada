import React, { useId, useEffect, useMemo, useRef, useState } from "react";
import { client } from "./sanityClient";


// ✅ Put your photos in: src/assets/ (exact filenames)
// - running-photo3.png
// - biking-photo.png
// - ukraine-photo.jpeg
// - family-photo.png   (or change the import extension below to match your file)
import runningBg from "./assets/jameshome62.webp";
import bikingBg from "./assets/biking-photo.png";
import ukraineBg from "./assets/ukraine-photo.jpeg";
import familyBg from "./assets/family-photo.jpg";
import heroLogo from "./assets/logo4.png"; 
import map from "./assets/map.png";           
import waveDivider from "./assets/wave-haikei3.svg";
import nature from "./assets/nature.avif";
import charity from "./assets/charity.png";
import janine from "./assets/janine.webp";
import karley from "./assets/karley.webp";
import { useTranslation } from "react-i18next";



/**
 * James Runs Across Canada
 * - Home: ONE combined hero + GPS tracker section on the running photo background, then charity on biking photo.
 *   The "How to support" section is now dark (no Ukraine photo).
 * - My Why: uses Family photo + Ukraine photo as section backgrounds.
 * - Blog: daily posts (localStorage)
 * - Contact: contact form (UI-only)
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




const SPONSOR_GROUPS = [
  // {
  //   key: "charity",
  //   title: "Charity Supporters",
  //   subtitle: "Organizations funding the scholarship / charity target.",
  //   items: [
  //     { id: "c1", name: "Sponsor Name", tier: "Title sponsor", blurb: "Helping fuel the scholarship fund." },
  //     { id: "c2", name: "Sponsor Name", tier: "Partner", blurb: "Supporting youth scholarships directly." },
  //   ],
  // },
  {
    key: "run",
    title: "Run Funders",
    subtitle: "Organizations, businesses, and community partners making the run finanically possible (travel, gear, food, etc.).",
    items: [
      { id: "r1", name: "Sponsor Name", tier: "Gear partner", blurb: "Shoes, kits, nutrition." },
      { id: "r2", name: "Sponsor Name", tier: "Logistics", blurb: "Helping cover travel + supplies." },
    ],
  },
  {
    key: "route",
    title: "The Team Behind The Run",
    subtitle: "Meet the team behind the run.",
    items: [
      {
        id: "t1",
        name: "Karley Gittens",
        tier: "GITTENCREATIVE",
        blurb: "Karley brings brands to life through standout brand identity, print and web design, social media, and photography for clients in various fields.",
        href: "https://www.gittencreative.com/", // or external link
        photo: karley,
      },
      {
        id: "t2",
        name: "Janine Fisher",
        tier: "THE NEST MARKETING & COMMUNICATIONS",
        blurb: "A full-service marketing agency that helps organizations clarify their message, elevate their brand and communicate with impact.",
        href: "https://www.nestmktg.com/", // or external link
        photo: janine,
      },
    ],
  },
];




function TeamCard({ person }) {
  const { t } = useTranslation();

  const CardInner = (
    <Glass className="p-6 h-full">
      <div className="flex items-start gap-4">
        <img
          src={person.photo}
          alt={person.name}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
          loading="lazy"
          draggable={false}
        />

        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
            {person.name}
          </div>
          <div className="mt-1 text-xs font-black uppercase tracking-widest text-yellow-300/90">
            {person.tier}
          </div>

          <div className="mt-3 text-sm leading-6 text-white/80">
            {person.blurb}
          </div>

          <div className="mt-4 text-xs font-black uppercase tracking-widest text-white/60">
            {t("team.viewMore")} →
          </div>
        </div>
      </div>
    </Glass>
  );

  return person.href ? (
    <a
      href={person.href}
      className="block h-full"
      target={person.href.startsWith("http") ? "_blank" : undefined}
      rel={person.href.startsWith("http") ? "noreferrer noopener" : undefined}
    >
      {CardInner}
    </a>
  ) : (
    CardInner
  );
}




function LogoPlaceholder({ size = "md" }) {
  const sizeCls =
    size === "lg"
      ? "h-32 w-36 sm:h-40 sm:w-44 md:h-48 md:w-52"
      : size === "sm"
      ? "h-18 w-20 sm:h-20 sm:w-22 md:h-22 md:w-24"
      : "h-24 w-28 sm:h-28 sm:w-32 md:h-32 md:w-36";

  return (
    <div
      className={[
        "shrink-0 rounded-3xl",
        "border border-white/15 bg-white/10",
        "backdrop-blur-xl",
        "shadow-[0_18px_60px_rgba(0,0,0,0.25)]",
        "flex items-center justify-center",
        sizeCls,
      ].join(" ")}
    >
      {/* Replace this with a logo later */}
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/40">
        Logo
      </span>
    </div>
  );
}

function RunFundersLogoRows() {
  return (
    <div className="py-4">
      <div className="space-y-7">
        {/* Row 1: 2 large squares */}
        <div className="flex items-center justify-center gap-12 sm:gap-16">
          <LogoPlaceholder size="lg" />
          <LogoPlaceholder size="lg" />
        </div>

        {/* Row 2: 4 medium squares */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-7">
          {Array.from({ length: 4 }).map((_, i) => (
            <LogoPlaceholder key={`mid-${i}`} size="md" />
          ))}
        </div>

        {/* Row 3: 6 small squares */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <LogoPlaceholder key={`sm-${i}`} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}










function SponsorsGridSection({ groups = SPONSOR_GROUPS }) {
  const { t } = useTranslation();

  return (
    <ParallaxSection
      bg={nature}
      minH="min-h-fit"
      objectPosition="50% 55%"
      strength={60}
      overlay={true}
    >
      <section>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-14">
          <div className="max-w-3xl">
            <div className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                {t("sponsors.title")}
            </div>
            <div className="mt-2 text-sm sm:text-base text-white/80 leading-7">
                {t("sponsors.subtitle")}
            </div>
          </div>

          <div className="mt-10 space-y-10">
            {groups.map((g) => (
              <div key={g.key}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                        {t(`sponsorGroups.${g.key}.title`)}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      {t(`sponsorGroups.${g.key}.subtitle`)}
                    </div>
                  </div>

                  {/* <div className="text-xs font-black uppercase tracking-widest text-white/60">
                    {g.items?.length || 0} supporters
                  </div> */}
                </div>

                <div className="mt-5">
                  {g.key === "route" ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {(g.items || []).map((person) => (
                        <TeamCard key={person.id} person={person} />
                      ))}
                    </div>
                  ) : g.key === "run" ? (
                    <RunFundersLogoRows />
                  ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {(g.items?.length ? g.items : Array.from({ length: 2 })).map((s, i) => (
                        <Glass key={s?.id ?? `${g.key}-${i}`} className="p-6 h-full">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-black uppercase tracking-wide text-white">
                                {s?.name || "Sponsor Name"}
                              </div>
                              <div className="mt-1 text-xs font-black uppercase tracking-widest text-yellow-300/90">
                                {s?.tier || "Sponsor Tier"}
                              </div>
                            </div>

                            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/40">
                              Logo
                            </div>
                          </div>

                          <div className="mt-3 text-sm leading-6 text-white/80">
                            {s?.blurb || "Short sponsor blurb goes here."}
                          </div>

                          <div className="mt-4 text-xs font-black uppercase tracking-widest text-white/60">
                            Details soon →
                          </div>
                        </Glass>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </ParallaxSection>
  );
}




const SAMPLE_POSTS = [
  {
    id: "p1",
    date: "2026-01-01",
    title: "Day 1 — Setting out",
    content:
      "Today is the first step. We met early, checked supplies, and mapped the route. The goal is simple: show up daily, learn loudly, and keep the charity at the center of every mile. If you’re reading this, you’re part of the story already — thank you.",
    photos: [runningBg], //, bikingBg
  },
  {
    id: "p2",
    date: "2026-01-02",
    title: "Day 2 — Small wins",
    content:
      "A little progress compounds fast. We hit our target distance and talked with people along the way. The charity exists because the ‘why’ matters more than the numbers — but the numbers help, too. We’re collecting stories and hope.",
    photos: [runningBg],
  },
  {
    id: "p3",
    date: "2026-01-03",
    title: "Day 3 — Perspective",
    content:
      "Some days remind you why you started. When the hard moments hit, we keep moving, keep talking to people, and keep the mission front and center.",
    photos: [runningBg],
  },
];






async function fetchSanityPosts() {
  // Basic query: newest first
  return client.fetch(
    `*[_type == "post"] | order(date desc) {
      _id,
      title,
      date,
      content,
      "photos": photos[].asset->url
    }`
  );
}

function useSanityPosts() {
  const { t } = useTranslation(); // ✅ add this

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setPostsLoading(true);
        const data = await fetchSanityPosts();
        if (!alive) return;
        setPosts(data || []);
        setPostsError(null);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setPostsError(t("blog.loadError")); // ✅ now works
      } finally {
        if (alive) setPostsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [t]); // ✅ add t as dependency

  return { posts, postsLoading, postsError };
}





/** Parallax: move background a bit as its section scrolls */
function useParallaxOffset(sectionRef, strengthPx = 90) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / vh;
      const y = Math.max(-strengthPx, Math.min(strengthPx, Math.round(progress * -strengthPx)));
      setOffset(y);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionRef, strengthPx]);

  return offset;
}

/**
 * Fixed layering (no negative z-index).
 * - `isolate` prevents the background layer from disappearing behind other stacking contexts.
 */
function ParallaxSection({
  bg,
  minH = "min-h-[92vh]",
  objectPosition = "50% 35%",
  strength = 95,
  overlay = true,
  children,
}) {
  const ref = useRef(null);
  const y = useParallaxOffset(ref, strength);

  return (
    <section ref={ref} className={"relative isolate overflow-hidden " + minH}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{
            transform: `translate3d(0, ${y}px, 0) scale(1.08)`,
            objectPosition,
            filter: "saturate(1.08) contrast(1.08)",
          }}
          loading="lazy"
        />
        {overlay ? (
          <>
            {/* keep these lighter so the image reads */}
            <div className="absolute inset-0 bg-neutral-950/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950/85" />
          </>
        ) : null}
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}


function Pill({ children, className = "" }) {
  return (
    <div
      className={
        "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-white/90 backdrop-blur " +
        className
      }
    >
      {children}
    </div>
  );
}

function Glass({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-3xl border border-white/15 bg-neutral-950/55 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl " +
        className
      }
    >
      {children}
    </div>
  );
}



// function TrailDivider({ flip = false, fill = "#ffffff", height = 180 }) {
function TrailDivider({ flip = false, fill = "#fff" }) {
  const d =
    "M1.00012 357.716C8.95497 351.959 39.0488 325.35 86.8766 276.87C120.308 242.982 163.678 226.364 213.057 210.932C268.751 193.526 342.839 207.592 375.794 217.036C410.557 226.998 448.382 241.814 491.254 269.473C587.883 331.813 664.203 404.798 712.264 429.113C792.246 469.579 928.685 429.826 984.56 419.044C1070.75 402.41 1105.08 436.403 1178.24 487.398C1249.66 537.177 1328.21 553.68 1399.05 562.9C1444.5 568.816 1487.49 569.419 1577.87 567.518C1659.6 565.799 1710.9 541.035 1783.65 543.315C1854.15 545.525 1879.22 584.735 1938.05 614.976C1974.03 633.47 2015.45 615.737 2056.12 605.965C2092.39 597.252 2130.86 610.453 2156.2 624.276C2205.06 650.925 2244.88 711.227 2277.12 725.445C2338.85 752.22 2446.38 685.65 2502.91 658.216C2559.32 630.86 2654.48 571.227 2708.34 534.733C2799.22 473.077 2835.33 407.139 2894.48 384.337C2951.25 362.989 3026.82 360.123 3084.8 392.68C3099.2 435.45 3132.58 461.356 3182.24 499.899C3266.49 470.531 3299.29 455.39C3316.66 447.373 3326.65 430.399 3333.97 411.384C3372.4 311.551 3351.39 130.647 3362.57 80.2412C3370.36 45.1209 3387.74 18.3162 3400.86 7.32935C3426.3 -13.9697 3495.6 23.5653 3523.5 44.929C3555.5 69.429 3570.05 128.643 3602.5 135.929";

  return (
    <svg
      className={"block w-full " + (flip ? "rotate-180" : "")}
      viewBox="0 0 3604 737"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Fill BELOW the curve */}
      <path d={`${d} L3604 737 L0 737 Z`} fill={fill} />
    </svg>
  );
}




function TrailClipDefs({ id }) {
  const d =
    "M1.00012 357.716C8.95497 351.959 39.0488 325.35 86.8766 276.87C120.308 242.982 163.678 226.364 213.057 210.932C268.751 193.526 342.839 207.592 375.794 217.036C410.557 226.998 448.382 241.814 491.254 269.473C587.883 331.813 664.203 404.798 712.264 429.113C792.246 469.579 928.685 429.826 984.56 419.044C1070.75 402.41 1105.08 436.403 1178.24 487.398C1249.66 537.177 1328.21 553.68 1399.05 562.9C1444.5 568.816 1487.49 569.419 1577.87 567.518C1659.6 565.799 1710.9 541.035 1783.65 543.315C1854.15 545.525 1879.22 584.735 1938.05 614.976C1974.03 633.47 2015.45 615.737 2056.12 605.965C2092.39 597.252 2130.86 610.453 2156.2 624.276C2205.06 650.925 2244.88 711.227 2277.12 725.445C2338.85 752.22 2446.38 685.65 2502.91 658.216C2559.32 630.86 2654.48 571.227 2708.34 534.733C2799.22 473.077 2835.33 407.139 2894.48 384.337C2951.25 362.989 3026.82 360.123 3084.8 392.68C3099.2 435.45 3132.58 461.356C3182.24 499.899 3266.49 470.531 3299.29 455.39C3316.66 447.373 3326.65 430.399 3333.97 411.384C3372.4 311.551 3351.39 130.647 3362.57 80.2412C3370.36 45.1209 3387.74 18.3162 3400.86 7.32935C3426.3 -13.9697 3495.6 23.5653 3523.5 44.929C3555.5 69.429 3570.05 128.643 3602.5 135.929";

  // Big rect (full area) in the SAME coordinate system as your curve
  const rect = "M0 0 H3604 V737 H0 Z";

  // The shape "below the curve" (we will SUBTRACT this)
  const below = `${d} L3604 737 L0 737 Z`;

  // evenodd => rect minus below => keeps area ABOVE the curve
  const combined = `${rect} ${below}`;

  const sx = 1 / 3604;
  const sy = 1 / 737;

  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path
            d={combined}
            transform={`scale(${sx} ${sy})`}
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </clipPath>
      </defs>
    </svg>
  );
}




const WAVE_DIVIDER_PATH =
  "M1.00012 357.716C8.95497 351.959 39.0488 325.35 86.8766 276.87C120.308 242.982 163.678 226.364 213.057 210.932C268.751 193.526 342.839 207.592 375.794 217.036C410.557 226.998 448.382 241.814 491.254 269.473C587.883 331.813 664.203 404.798 712.264 429.113C792.246 469.579 928.685 429.826 984.56 419.044C1070.75 402.41 1105.08 436.403 1178.24 487.398C1249.66 537.177 1328.21 553.68 1399.05 562.9C1444.5 568.816 1487.49 569.419 1577.87 567.518C1659.6 565.799 1710.9 541.035 1783.65 543.315C1854.15 545.525 1879.22 584.735 1938.05 614.976C1974.03 633.47 2015.45 615.737 2056.12 605.965C2092.39 597.252 2130.86 610.453 2156.2 624.276C2205.06 650.925 2244.88 711.227 2277.12 725.445C2338.85 752.22 2446.38 685.65 2502.91 658.216C2559.32 630.86 2654.48 571.227 2708.34 534.733C2799.22 473.077 2835.33 407.139 2894.48 384.337C2951.25 362.989 3026.82 360.123 3084.8 392.68C3099.2 435.45 3132.58 461.356 3182.24 499.899C3266.49 470.531 3299.29 455.39C3316.66 447.373 3326.65 430.399 3333.97 411.384C3372.4 311.551 3351.39 130.647 3362.57 80.2412C3370.36 45.1209 3387.74 18.3162 3400.86 7.32935C3426.3 -13.9697 3495.6 23.5653 3523.5 44.929C3555.5 69.429 3570.05 128.643 3602.5 135.929";

function WaveSectionDivider({ className = "", fill = "#ffffff" }) {
  return (
    <div className={`section-divider full-bleed ${className}`} aria-hidden="true">
      {/*
        preserveAspectRatio="none" lets the wave stretch to match the viewport width.
        The wrapper is full-bleed (100vw) so it extends with the webpage, not the content container.
      */}
      <svg
        className="section-divider__svg"
        viewBox="0 -20 3603 780"
        preserveAspectRatio="none"
        role="presentation"
      >
        <path d={WAVE_DIVIDER_PATH} fill={fill} />
      </svg>
    </div>
  );
}



function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function daysSince(startDateStr) {
  const start = new Date(startDateStr + "T00:00:00");
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

function useCountUp(value, durationMs = 900) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = display;
    const to = value;

    const tick = (t) => {
      const p = clamp((t - start) / durationMs, 0, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

function StatCard({ label, value, suffix = "", prefix = "" }) {
  const animated = useCountUp(value);
  const formatted = new Intl.NumberFormat(undefined).format(animated);

  return (
    <div className="rounded-3xl border border-white/15 bg-black/55 px-5 py-4 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="text-[11px] font-black uppercase tracking-widest text-white/70">
        {label}
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
        {prefix}{formatted}{suffix}
      </div>
    </div>
  );
}

function RunCounters({
  startDate = "2026-05-18",
  kmPerDay = 80,
  totalGoalDays = 100,
  amountRaised = 1000, // swap this to real data later
}) {
  const [tick, setTick] = React.useState(0);
  const { t } = useTranslation();

  // refresh once a minute so "days passed" flips naturally at midnight-ish
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = Math.min(daysSince(startDate), totalGoalDays);
  const km = days * kmPerDay;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <StatCard label={t("stats.daysCompleted")} value={days} suffix={` / ${totalGoalDays}`} />
      <StatCard label={t("stats.kilometersRun")} value={km} suffix={t("stats.km")} />
      <StatCard label={t("stats.amountRaised")} value={amountRaised} prefix={t("stats.currency")} />
    </div>
  );
}






function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-black uppercase tracking-widest text-white">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-white/70">{subtitle}</div> : null}
    </div>
  );
}

function Marquee() {
  const { t } = useTranslation();
  const text = t("marquee.text");
  const repeated = useMemo(() => Array.from({ length: 12 }).map(() => text).join(""), [text]);

  return (
    <div className="overflow-hidden border-y border-white/15 bg-yellow-300">
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
  const { t, i18n } = useTranslation();

  const tabs = [
    { key: "blog", label: t("nav.blog") },
    { key: "home", label: t("nav.home") },
    { key: "contact", label: t("nav.contact") },
  ];

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const isActive = (k) => tab === k;

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
      <div className="w-full px-3 sm:px-8 py-3">
        {/* Row 1: Live (left) + Language (right) */}
        <div className="flex items-center justify-between gap-3">
          <Pill className="bg-yellow-300 text-neutral-950 border-yellow-200/40">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-neutral-950" />
            {t("common.live")}
          </Pill>

          {/* Language toggle */}
          <div className="flex items-center rounded-full border border-white/20 bg-white/5 p-1">
            <button
              onClick={() => setLang("en")}
              className={
                "rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide " +
                (i18n.language === "en"
                  ? "bg-yellow-300 text-neutral-950"
                  : "text-white/80 hover:text-white")
              }
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={
                "rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide " +
                (i18n.language === "fr"
                  ? "bg-yellow-300 text-neutral-950"
                  : "text-white/80 hover:text-white")
              }
            >
              FR
            </button>
          </div>
        </div>

        {/* Row 2: Tabs as one segmented control */}
        <div className="mt-3">
          <div className="grid grid-cols-3 rounded-full border border-white/15 bg-white/5 p-1">
            {tabs.map((tbtn) => (
              <button
                key={tbtn.key}
                onClick={() => setTab(tbtn.key)}
                className={
                  "rounded-full py-2 text-xs font-black uppercase tracking-wide transition " +
                  (isActive(tbtn.key)
                    ? "bg-yellow-300 text-neutral-950"
                    : "text-white/80 hover:text-white")
                }
              >
                {tbtn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop brand (optional): keep only on bigger screens */}
        <div className="hidden lg:flex mt-3 items-center justify-between">
          <div className="min-w-0">
            {/* <div className="truncate text-sm sm:text-base font-black uppercase tracking-tight text-white">
              {t("brand.title")}
            </div>
            <div className="text-xs uppercase text-white/70">
              {t("brand.tagline")}
            </div> */}
          </div>
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
  const { t } = useTranslation();

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const onWheel = (e) => {
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
    setPins((prev) => [...prev, { id: uid(), x, y, label: `${t("map.pin")} ${prev.length + 1}` }]);
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const removeLast = () => setPins((prev) => prev.slice(0, -1));

  return (
    <Glass className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-black uppercase tracking-widest text-white">{t("map.title")}</div>
          <div className="text-xs text-white/70">{t("map.hint")}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={resetView}
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:border-yellow-300/60"
          >
            {t("map.reset")}
          </button>
          <button
            onClick={removeLast}
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:border-yellow-300/60"
          >
            {t("map.removeLast")}
          </button> */}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[420px] select-none bg-neutral-950/35"
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
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            setPins([]);
          }}
          className="absolute right-3 top-3 rounded-full border border-white/20 bg-neutral-950/60 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white backdrop-blur hover:border-yellow-300/60"
        >
          {t("map.clearPins")}
        </button> */}

        <div className="h-full w-full" onClick={onMapClick}>
          <svg viewBox="0 0 1000 500" className="h-full w-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
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
                fill="rgba(255,255,255,0.12)"
              />
              <path
                d="M361 291c18-20 44-30 77-29 39 1 68 18 86 38 18 20 25 44 12 65-17 27-55 43-95 43-38 0-77-15-89-44-9-23-4-49 9-73z"
                fill="rgba(255,255,255,0.12)"
              />
              <path
                d="M511 171c37-35 86-56 144-56 57 0 112 19 153 54 36 31 49 72 21 103-31 35-96 56-165 56-62 0-127-17-159-56-25-31-18-71 6-101z"
                fill="rgba(255,255,255,0.12)"
              />
              <path
                d="M675 320c27-18 63-23 95-11 25 10 40 30 35 50-7 26-44 44-83 44-33 0-65-10-77-30-11-18-2-39 30-53z"
                fill="rgba(255,255,255,0.12)"
              />

              {pins.map((p) => (
                <g key={p.id} onMouseEnter={() => setHoverPinId(p.id)} onMouseLeave={() => setHoverPinId(null)}>
                  <circle cx={p.x} cy={p.y} r={7} fill="#FDE047" opacity={0.95} />
                  <circle cx={p.x} cy={p.y} r={16} fill="#FDE047" opacity={0.16} />
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
          {/* <div className="text-xs text-white/80">
            Pins: <span className="font-black text-white">{pins.length}</span>
          </div> */}
        </div>
      </div>
    </Glass>
  );
}



function BlogSummary({ posts, onOpenPost }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)), [posts]);

  return (
    <Glass className="h-full">
      <div className="border-b border-white/10 px-4 py-3">
        <SectionTitle title="Latest blog" subtitle="The beginning of each day’s post" />
      </div>
      <div className="max-h-[560px] overflow-y-auto p-4">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">No posts yet.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((p) => (
              <button
                key={p._id || p.id}
                onClick={() => onOpenPost(p._id || p.id)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-yellow-300/40 hover:bg-white/10"
              >
                <div className="flex gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/40">
                    {p.photos?.[0] ? (
                      <img src={p.photos[0]} alt="" className="h-full w-full object-contain bg-neutral-950/40" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-white/60">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-black uppercase tracking-wide text-white">{p.title || "Daily update"}</div>
                      <div className="shrink-0 text-xs text-white/60">{formatDate(p.date)}</div>
                    </div>
                    <div className="mt-1 text-sm text-white/80">{startOfDayExcerpt(p.content, 140)}</div>
                    <div className="mt-2 text-xs font-black uppercase tracking-widest text-yellow-300">Read →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Glass>
  );
}


 





function HomeHeroTop({ latestPostId, onOpenPost }) {
  const clipId = useId();
  const { t } = useTranslation();


  return (
    <section className=" hero relative overflow-hidden bg-white">
      <TrailClipDefs id={clipId} />

      {/* FULL-BLEED BACKGROUND PHOTO */}
      <div className="absolute inset-0 bg-white" id="photo">
        <img
          src={runningBg}
          alt=""
          className="h-full w-full object-cover grayscale brightness-95 contrast-110 [object-position:45%_100%] -translate-y-20 -translate--7"
          draggable={false}
          loading="eager"
          
        />
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/22 to-transparent" />
      </div>


      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 pt-27 pb-50">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* optional: keep your cropped runner or remove it */}
          <div className="hidden lg:block" />

          {/* Right side panel */}
          <div className="lg:justify-self-end w-full max-w-[720px]">
            <div className="p-6 sm:p-10">



              {/* <div className="text-3xl font-black uppercase tracking-widest text-yellow-300/90">
                Turning kilometers
              </div>
              <div className="text-3xl font-black uppercase tracking-widest text-yellow-300/90">
                into scholarships
              </div> */}

              {/* <h1 className="mt-3 text-4xl sm:text-6xl font-black uppercase tracking-tight text-yellow-300/90">
                James Runs Canada
              </h1> */}


              <p className="mt-8 text-4xl sm:text-6xl font-black tracking-tight text-white/80 drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)]">
                100 Days
              </p>
              <p className="mt-3 text-4xl sm:text-6xl font-black tracking-tight text-white/80 drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)]">
                7,500 km
              </p>

              <p className="mt-8 max-w-xl text-base sm:text-xl leading-7 text-white/80">
                {t("hero.followStarting")} 
                <span className="font-black text-white"> {t("hero.date")}</span>
              </p>



              {/* <p className="mt-8 max-w-xl text-base sm:text-xl leading-7 text-white">
                Follow the run starting May 18th 2026!
              </p>*/}

              <p className="mt-4 max-w-2xl text-base sm:text-xl leading-7 text-white/80">
                {t("hero.joinLine")}
              </p>


              



              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById("gps")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
                >
                  {t("common.map")}
                </button>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
                >
                  {t("common.donate")}
                </a>

                <button
                  onClick={() => latestPostId && onOpenPost(latestPostId)}
                  className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
                >
                  {t("common.feed")}
                </button>
              </div>

              

              <div className="mt-7">
                <img
                  src={heroLogo}
                  alt="James Runs Canada logo"
                  className="h-28 sm:h-36 lg:h-50 w-auto w-auto drop-shadow-[0_16px_30px_rgba(0,0,0,0.18)]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curvy divider */}
      {/* <div className="hero-divider" aria-hidden="true">
        <img src={waveDivider} alt="" className="hero-divider__img" draggable={false} />
      </div> */}




      

          


    </section>
  );
}






function HomeTrackerSection({ pins, setPins }) {
  const { t } = useTranslation();
  const bullets = t("tracker.missionBullets", { returnObjects: true });
  const safeBullets = Array.isArray(bullets) ? bullets : [];

  
  return (
    
    <section className="home-tracker-section bg-white text-neutral-950">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 pt-0 pb-16">
        {/* TOP: Video (left) + Mission (right) */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Video (LEFT) */}
          <div className="rounded-3xl border border-neutral-950/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)] p-4 sm:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-neutral-950">
                  {t("tracker.videoTitle")}
                </div>
                <div className="mt-1 text-sm text-neutral-950/70">{t("tracker.videoSubtitle")}</div>
              </div>
              <div className="inline-flex items-center rounded-full border border-neutral-950/15 bg-neutral-950/5 px-3 py-1 text-xs font-black uppercase tracking-widest text-neutral-950">
                {t("tracker.comingSoon")}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-950/10 bg-neutral-950/[0.03] p-6">
              <div className="text-sm font-semibold text-neutral-950/80">
                {t("tracker.videoBody")}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
                >
                  {t("common.donate")}
                </a>
                <button
                  onClick={() =>
                    document.getElementById("gps")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="rounded-full border border-neutral-950/20 bg-white px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-neutral-950/[0.03]"
                >
                  {t("common.map")}
                </button>
              </div>
            </div>
          </div>

          {/* Mission (RIGHT) — transparent (no card) */}
          <div className="self-center w-full max-w-xl">
            <div className="text-center">
              <div className="text-xs font-black uppercase tracking-widest text-neutral-950/60">
                {t("tracker.missionEyebrow")}
              </div>

              <div className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
                {t("tracker.missionTitle")}
              </div>

              
              {/* <div className="mt-2 text-[11px] font-black uppercase tracking-widest text-neutral-950/50">
                In support of
              </div> */}
            </div>

            <div className="mt-6 text-left">
              <p className="text-sm sm:text-base leading-7 text-neutral-950/80">
                {t("tracker.missionBody")}              
              </p>

              <ul className="mt-4 space-y-2 text-sm sm:text-base text-neutral-950/80">
                {safeBullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>


              <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                <a className="rounded-full border border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200">
                  {t("common.donate")}
                </a>
                <a className="rounded-full border border-neutral-950/20 bg-white px-5 py-2 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-neutral-950/[0.03]">
                  {t("common.learnMore")}
                </a>
              </div>
            </div>
            <div className="mt-4 w-full rounded-3xl border border-neutral-950/10 bg-white px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <img
                src={charity}
                alt="Charity partner"
                className="h-18 sm:h-max w-auto object-contain"
                loading="lazy"
                draggable={false}
              />
            </div>
            
          </div>













        </div>

        {/* BOTTOM: GPS Map with background image (pure image) */}
        <div id="gps"   className="relative mt-38 left-1/2 -translate-x-1/2 w-screen overflow-hidden" >


          {/* background image */}
          <div className="absolute inset-0">
            <img
              src={map}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            
          </div>

          


      {/* <section className="relative overflow-hidden text-neutral-950"> */}
      {/* <div className="absolute inset-0"> */}

        
          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-sm font-black uppercase tracking-widest text-neutral-950">
                {t("tracker.gpsEyebrow")}
              </div>
              <div className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                {t("tracker.gpsTitle")}
              </div>
              <div className="mt-2 text-sm text-neutral-950/70">
                 {t("tracker.gpsBody")}
              </div>
            </div>

            <div className="inline-flex items-center rounded-full border border-neutral-950/15 bg-neutral-950/5 px-3 py-1 text-xs font-black uppercase tracking-widest text-neutral-950">
                {t("common.live")}
            </div>
          </div>

          
          <RunCounters
            startDate="2026-05-18"
            kmPerDay={80}
            totalGoalDays={100}
            amountRaised={0} // TODO: wire to real fundraising total
          />

          
          <div className="mt-8 rounded-[28px] border border-neutral-950/10 bg-neutral-950 p-4 sm:p-6">
            <InteractiveMap pins={pins} setPins={setPins} />
            <div className="mt-3 text-center text-xs font-semibold uppercase tracking-widest text-white/60">
              Live GPS tracker
            </div>
          </div>

          

        </div>
      </div>
      </div>
    </section>
  );
}
















function LatestBlogBreakSection({ posts, onOpenPost, onViewAll }) {
  const { t } = useTranslation();
  
  const latest = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  }, [posts]);

  return (
    <section className="bg-neutral-950 -mt-px border-b border-white/10">
      {/* Marquee under hero */}
      <div className="relative z-10">
        <Marquee />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">{t("blog.latestTitle")}</div>
            <div className="mt-2 text-sm text-white/60">{t("blog.latestSubtitle")}</div>
          </div>

          <button
            onClick={onViewAll}
            className="shrink-0 text-sm font-black uppercase tracking-widest text-white/70 hover:text-white"
          >
            {t("blog.viewAll")}
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((p) => (
            <button key={p._id || p.id} onClick={() => onOpenPost(p._id || p.id)} className="group text-left">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
                  {p.photos?.[0] ? (
                    <img
                      src={p.photos[0]}
                      alt=""
                      className="h-full w-full object-contain bg-neutral-950/40 transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/50">No photo</div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/50">{formatDate(p.date)}</div>
                  <div className="mt-2 text-lg font-black uppercase tracking-tight text-white">{p.title}</div>
                  <div className="mt-2 text-sm leading-6 text-white/70">{startOfDayExcerpt(p.content, 130)}</div>
                  <div className="mt-4 text-xs font-black uppercase tracking-widest text-yellow-300">{t("blog.readArrow")} </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}



function SupportSection({ setTab }) {
    const { t } = useTranslation();
  
    return (
    <section className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(253,224,71,0.10),transparent_55%)]" />
      <div className="mx-auto max-w-6xl px-4 py-16 relative">
        <div className="max-w-2xl">
          {/* <Pill className="bg-white/10 border-white/20">More</Pill> */}
          <div className="mt-4 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              {t("support.title")}
          </div>
          <div className="mt-3 text-sm sm:text-base leading-7 text-white/80">
            {t("support.subtitle")}
            <br />
            {t("support.subtitle2")}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Glass className="p-6">
            <div className="text-sm font-black uppercase tracking-wide text-white">
              {t("support.cards.donate.title")}
            </div>
            <div className="mt-2 text-sm text-white/80">
              {t("support.cards.donate.body")}
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="rounded-full border border-yellow-300 bg-yellow-300 px-6 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
            >
              {t("support.cards.donate.cta")}
            </a>
          
        </div>
          </Glass>
          <Glass className="p-6">
            <div className="text-sm font-black uppercase tracking-wide text-white">
              {t("support.cards.share.title")}
            </div>
            <div className="mt-2 text-sm text-white/80">
              {t("support.cards.share.bodyPrefix")}{" "}
              <a
                href="https://en.wikipedia.org/wiki/Six_degrees_of_separation"
                target="_blank"
                rel="noreferrer noopener"
                className="text-yellow-300 underline underline-offset-4 hover:text-yellow-200"
              >
                {t("support.cards.share.linkText")}
              </a>
              !

            </div>
            <div className="mt-10 flex flex-wrap gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="rounded-full border border-yellow-300 bg-yellow-300 px-6 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
            >
              {t("support.cards.share.cta")}
            </a>
            
          </div>

          </Glass>
          <Glass className="p-6">
            <div className="text-sm font-black uppercase tracking-wide text-white">{t("support.cards.partners.title")}</div>
            <div className="mt-2 text-sm text-white/80">{t("support.cards.partners.body")}</div>
            <div className="mt-10 flex flex-wrap gap-2">
          
            <button
              onClick={() => setTab("contact")}
              className="rounded-full border border-yellow-300 bg-yellow-300 px-6 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
            >
              {t("support.cards.partners.cta")}
            </button>
          </div>
          </Glass>
        </div>


      </div>
    </section>
  );
}



function HomeTab({ posts, onOpenPost, pins, setPins, setTab }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)), [posts]);
  const latestPostId = sorted[0]?._id || sorted[0]?.id;
  const { t } = useTranslation();

  return (
    <div className="text-white">
      <HomeHeroTop latestPostId={latestPostId} onOpenPost={onOpenPost} />
      <HomeTrackerSection pins={pins} setPins={setPins} />
      <LatestBlogBreakSection posts={posts} onOpenPost={onOpenPost} onViewAll={() => setTab("blog")} />
      <SponsorsGridSection groups={SPONSOR_GROUPS} />
      <SupportSection setTab={setTab} />

      <footer className="border-t border-white/10 bg-neutral-950">
        <div className="w-full px-4 sm:px-8 py-10">

          <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
            <div>
              <div className="text-base font-black uppercase tracking-tight text-white">James Runs Canada</div>
              <div className="mt-2 max-w-xl text-sm text-white/60">
                Live GPS + Daily Blog
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-sm font-semibold texft-white/60">© {new Date().getFullYear()} James Runs Canada</div>
              <div className="mt-2 flex flex-wrap gap-3 sm:justify-end">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-white/70 hover:text-white">
                  Privacy
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-white/70 hover:text-white">
                  Donate
                </a>
                <button onClick={() => setTab("contact")} className="text-sm font-semibold text-white/70 hover:text-white">
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}




/** BLOG (read-only) */
function BlogTab({ posts, focusPostId, onFocused, postsLoading, postsError }) {
  const listRef = useRef(null);
  const { t } = useTranslation();

  const sorted = useMemo(
    () => [...(posts || [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [posts]
  );

  useEffect(() => {
    if (!focusPostId) return;
    const el = document.getElementById(`post-${focusPostId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocused?.();
    }
  }, [focusPostId, onFocused]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src={runningBg}
          alt=""
          className="h-full w-full object-cover opacity-15"
          style={{ objectPosition: "50% 30%" }}
        />
        <div className="absolute inset-0 bg-neutral-950/85" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <Glass className="min-h-[calc(100vh-140px)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <SectionTitle title={t("blog.dailyTitle")} subtitle={t("blog.dailySubtitle")} />
            <div className="text-xs text-white/60">{sorted.length} posts</div>
          </div>

          <div ref={listRef} className="p-4">
            {postsLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                {t("blog.loading")}
              </div>
            ) : postsError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {postsError}
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                {t("blog.none")}
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map((p) => (
                  <article
                    key={p._id || p.id}
                    id={`post-${p._id || p.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-base font-black uppercase tracking-wide text-white">
                          {p.title || t("blog.defaultTitle")}
                        </div>
                        <div className="mt-0.5 text-xs text-white/60">{formatDate(p.date)}</div>
                      </div>
                    </div>

                    {p.photos?.length ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {p.photos.slice(0, 4).map((src, i) => (
                          <div
                            key={(typeof src === "string" ? src : JSON.stringify(src)) + i}
                            className="rounded-xl border border-white/10 bg-neutral-950/40 p-2"
                          >
                            <img
                              src={src}
                              alt=""
                              className="w-full max-h-[520px] object-contain rounded-lg"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}


                    <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/85">
                      {p.content}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Glass>
      </div>
    </div>
  );
}







function SponsorCarousel({ sponsors = [] }) {
  const { t } = useTranslation();

  return (
    <Glass className="mt-6 overflow-hidden">
      <div className="flex items-end justify-between gap-3 border-b border-white/10 px-6 py-5">
        <div>
          <div className="text-base font-black uppercase tracking-widest text-white">{t("sponsorsCarousel.title")}</div>
          <div className="mt-1 text-sm text-white/70">{t("sponsorsCarousel.subtitle")}</div>
        </div>

        <div className="hidden sm:block text-xs font-black uppercase tracking-widest text-white/60">
          {t("sponsorsCarousel.scroll")} →
        </div>
      </div>

      <div className="px-6 py-6">
        {sponsors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
            {t("sponsorsCarousel.none")}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sponsors.map((s) => {
              const Card = (
                <div className="min-w-[260px] max-w-[260px] rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition hover:border-yellow-300/40 hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40">
                      {s.logo ? (
                        <img src={s.logo} alt={`${s.name} logo`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/40">
                          Logo
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-black uppercase tracking-wide text-white">{s.name}</div>
                      <div className="mt-0.5 text-xs font-black uppercase tracking-widest text-yellow-300/90">
                        {s.tier}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm leading-6 text-white/75">{s.blurb}</div>

                  {s.href ? (
                    <div className="mt-4 text-xs font-black uppercase tracking-widest text-white/60">
                      {t("sponsorsCarousel.learnMore")} →
                    </div>
                  ) : null}
                </div>
              );

              return s.href ? (
                <a key={s.id} href={s.href} target="_blank" rel="noreferrer noopener" className="shrink-0">
                  {Card}
                </a>
              ) : (
                <div key={s.id} className="shrink-0">
                  {Card}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Glass>
  );
}

const ALL_SPONSORS = SPONSOR_GROUPS.flatMap(g => g.items || []);


function ContactTab() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const { t } = useTranslation();

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
    "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img src={runningBg} alt="" className="h-full w-full object-cover opacity-13" style={{ objectPosition: "50% 50%" }} />
        <div className="absolute inset-0 bg-neutral-950/86" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ONE combined full-width box */}
      <Glass className="w-full">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-base font-black uppercase tracking-widest text-white">
            {t("contact.title")}
          </div>
          <div className="mt-1 text-sm text-white/70">
            {t("contact.subtitle")}
          </div>
        </div>

        {/* Contact details */}
        <div className="px-6 pt-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-black uppercase tracking-widest text-white">
              {t("contact.detailsTitle")}
            </div>
            <div className="mt-2 space-y-1 text-sm text-white/75">
              <div>✉️ {t("contact.emailLabel")}: TEAM@jamesrunscanada.ca</div>
              <div>📷 {t("contact.instagramLabel")}: @Jams_Newman</div>
            </div>
          </div>

          <div className="mt-3 text-sm text-white/60">
            {t("contact.subtitle")}
          </div>
        </div>

        {/* Form (same outer box) */}
        <div className="px-6 pb-6">
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 px-4 py-4">
              <div className="text-sm font-black uppercase tracking-widest text-white">
                {t("contact.formTitle")}
              </div>
              <div className="mt-1 text-sm text-white/70">
                {t("contact.formSubtitle")}
              </div>
            </div>

            <form
              action={import.meta.env.VITE_FORMSPREE_ENDPOINT}
              method="POST"
              className="space-y-3 px-4 py-5"
            >
              <label className="block">
                <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">{t("contact.fields.name")}</div>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20"
                />
              </label>

              <label className="block">
                <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">{t("contact.fields.email")}</div>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20"
                />
              </label>

              <label className="block">
                <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/70">{t("contact.fields.message")}</div>
                <textarea
                  name="message"
                  rows={7}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20 resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl border border-yellow-300 bg-yellow-300 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-yellow-200"
              >
                {t("contact.submit")}

              </button>
            </form>
          </div>
        </div>
      </Glass>

      {/* Sponsors stays full width right under it */}
      <SponsorCarousel sponsors={ALL_SPONSORS} />
    </div>

    </div>
  );
}

export default function CharitySiteApp() {
  console.log("RENDER CharitySiteApp", new Date().toISOString());

  const [tab, setTab] = useState("home");
  const { posts, postsLoading, postsError } = useSanityPosts();


  const [focusPostId, setFocusPostId] = useState(null);
  const [pins, setPins] = useState([]);

  const onOpenPost = (postId) => {
    if (!postId) return;
    setTab("blog");
    setFocusPostId(postId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <TopNav
        tab={tab}
        setTab={(t) => {
          setTab(t);
          setFocusPostId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {tab === "home" ? (
        <HomeTab posts={posts} onOpenPost={onOpenPost} pins={pins} setPins={setPins} setTab={setTab} />
      ) : null}

      {tab === "blog" ? (
        <BlogTab
          posts={posts}
          focusPostId={focusPostId}
          onFocused={() => setFocusPostId(null)}
          postsLoading={postsLoading}
          postsError={postsError}
        />
      ) : null}


      {/* {tab === "story" ? <StoryTab /> : null} */}
      {tab === "contact" ? <ContactTab /> : null}
    </div>
  );
}










