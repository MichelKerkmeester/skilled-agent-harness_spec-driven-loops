---
description: "9 aesthetic profiles with CSS variable values, font pairings, background atmosphere, and a compatibility matrix with diagram types"
---
# Aesthetics

Nine aesthetic profiles are supported. Each profile is a complete visual system: color palette, font pairing, background atmosphere, and animation character. The compatibility matrix at the bottom guides which aesthetic works best with each diagram type.

---

## Profile 1 — Monochrome Terminal

**Character:** Classic hacker aesthetic. Green or amber phosphor on near-black. Monospace everywhere. Scanline texture. Command-line precision.

**Use for:** Terminal output explanations, system logs, CLI tool documentation, low-level architecture.

**Font pairing:**
- Display: `JetBrains Mono` (or `Fira Code`, `Source Code Pro`) — weight 700
- Body: same monospace family — weight 400

**CSS Variables:**
```css
/* Dark (default) */
--ve-bg: #0a0e0a;
--ve-surface: #0f1a0f;
--ve-surface-elevated: #172217;
--ve-border: #1f3d1f;
--ve-text: #39ff14;         /* phosphor green */
--ve-text-dim: #2a8a0a;
--ve-accent: #39ff14;
--ve-accent-muted: #0f2d0f;

/* Amber variant: --ve-text: #ffb000; --ve-accent: #ffb000; */

/* Light override */
--ve-bg: #f5f0e0;
--ve-surface: #fffdf5;
--ve-text: #1a2e1a;
--ve-accent: #2a6e00;
```

**Background atmosphere:** Horizontal scanlines via `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)` on body.

**Animation:** No `fadeUp` — use `typewriter` or instant reveal only.

---

## Profile 2 — Editorial

**Character:** Magazine or book design. Serif headlines, generous whitespace, muted warm palette. Dignified and readable. Conveys considered thought.

**Use for:** Plan reviews, decision records, documentation, reports, research summaries.

**Font pairing:**
- Display: `Playfair Display` or `DM Serif Display` — weight 700, tight tracking (`-0.02em`)
- Body: `DM Sans` or `Source Serif 4` — weight 400

**CSS Variables:**
```css
/* Light (default for Editorial) */
--ve-bg: #faf8f3;
--ve-surface: #ffffff;
--ve-surface-elevated: #f0ece4;
--ve-border: #d8d0c0;
--ve-text: #1c1814;
--ve-text-dim: #6b5f52;
--ve-accent: #c0392b;
--ve-accent-muted: #fdecea;

/* Dark override */
--ve-bg: #1a1612;
--ve-surface: #221e18;
--ve-surface-elevated: #2e2820;
--ve-text: #e8e0d0;
--ve-accent: #e05a47;
```

**Background atmosphere:** Warm radial gradient: `radial-gradient(ellipse at 30% 0%, #f0e8d8 0%, #faf8f3 60%)`. Subtle paper texture optional.

**Animation:** Slow `fadeUp` (600ms, ease-out). Stagger delay 100ms per element.

---

## Profile 3 — Blueprint

**Character:** Technical drawing. Grid lines, precise geometry, muted blue palette, monospace accents. Engineering authority.

**Use for:** Architecture diagrams, system topology, diff reviews, infrastructure documentation.

**Font pairing:**
- Display: `Space Grotesk` or `IBM Plex Mono` — weight 600
- Body: `IBM Plex Sans` or `Inter` — weight 400

*Note: Inter is permitted here as a BODY font only, not as the primary display font.*

**CSS Variables:**
```css
/* Dark (default for Blueprint) */
--ve-bg: #0d1b2a;
--ve-surface: #1b2d3e;
--ve-surface-elevated: #243647;
--ve-border: #2d4a63;
--ve-text: #c8dce8;
--ve-text-dim: #7a9ab0;
--ve-accent: #4fc3f7;
--ve-accent-muted: #0d2a40;

/* Light override */
--ve-bg: #f0f4f8;
--ve-surface: #ffffff;
--ve-text: #0d1b2a;
--ve-accent: #0277bd;
```

**Background atmosphere:** Blueprint grid: `repeating-linear-gradient(#1f3a52 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #1f3a52 0 1px, transparent 1px 40px)` on `--ve-bg`.

**Animation:** Crisp, fast `fadeUp` (250ms). Grid lines draw in via SVG stroke animation on load.

---

## Profile 4 — Neon Dashboard

**Character:** Deep dark background. Saturated electric accent colors. Glowing borders and text. High contrast. Nightclub meets control room.

**Use for:** Dashboards, metrics, performance monitoring, gaming stats, real-time system overviews.

**Font pairing:**
- Display: `Rajdhani` or `Orbitron` — weight 700, wide tracking (`0.05em`)
- Body: `Barlow` or `Exo 2` — weight 400

**CSS Variables:**
```css
/* Dark only — neon doesn't have a light mode (use Data-dense instead) */
--ve-bg: #050810;
--ve-surface: #0c1220;
--ve-surface-elevated: #131d30;
--ve-border: #1e3a5f;
--ve-text: #e8f0fe;
--ve-text-dim: #8fa8d0;
--ve-accent: #00f5ff;           /* electric cyan */
--ve-accent-secondary: #bf5af2; /* electric purple */
--ve-accent-muted: #001a2a;

/* Light override (falls back to Data-dense if neon is forced light) */
--ve-bg: #f0f4ff;
--ve-surface: #ffffff;
--ve-text: #050810;
--ve-accent: #0080ff;
```

**Background atmosphere:** Radial glow from accent color: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%)`.

**Animation:** `fadeUp` with glow pulse on accent elements. `box-shadow` pulse: `0 0 8px var(--ve-accent)` → `0 0 20px var(--ve-accent)` over 2s infinite.

---

## Profile 5 — Paper and Ink

**Character:** Warm cream background. Dark ink tones. Analog warmth in a digital medium. Feels handmade without being sloppy.

**Use for:** Concept documentation, knowledge base entries, reading-heavy content, design explorations.

**Font pairing:**
- Display: `Lora` or `Merriweather` — weight 700
- Body: `Source Serif 4` or `Lora` — weight 400

**CSS Variables:**
```css
/* Light (default for Paper) */
--ve-bg: #f6f0e4;
--ve-surface: #fdfaf3;
--ve-surface-elevated: #ede6d4;
--ve-border: #c8b89a;
--ve-text: #2c1f0e;
--ve-text-dim: #7a5c3a;
--ve-accent: #8b3a0f;
--ve-accent-muted: #f5e6d4;

/* Dark override */
--ve-bg: #1a1208;
--ve-surface: #231a0a;
--ve-text: #e8d8b8;
--ve-accent: #d4782a;
```

**Background atmosphere:** Very subtle noise texture (SVG filter or CSS): `filter: url(#paper-noise)`. Warm radial gradient: `radial-gradient(ellipse at 50% 0%, #faf0d8 0%, #f6f0e4 80%)`.

**Animation:** No entrance animation — content appears immediately as if typed/written. Optional letter-by-letter typewriter for headers.

---

## Profile 6 — Hand-Drawn

**Character:** Sketchy, imprecise, exploratory. Uses Mermaid's built-in `look: 'handDrawn'` mode combined with a font that evokes pen-on-paper.

**Use for:** Brainstorm visualizations, concept explorations, early-stage architecture sketches, mind maps.

**Font pairing:**
- Display: `Caveat` or `Patrick Hand` — weight 700
- Body: `Caveat` — weight 400

*Note: Only aesthetic where a handwriting font is appropriate as body font.*

**CSS Variables:**
```css
/* Light (default for Hand-drawn) */
--ve-bg: #fafaf8;
--ve-surface: #ffffff;
--ve-border: #c8c0b0;
--ve-text: #1a1a18;
--ve-text-dim: #787060;
--ve-accent: #4a90d9;

/* Dark override */
--ve-bg: #1a1a18;
--ve-surface: #252520;
--ve-text: #e8e8e0;
--ve-accent: #7ab8f5;
```

**Mermaid config:**
```javascript
mermaid.initialize({ startOnLoad: false, look: 'handDrawn', theme: 'base' });
```

**Background atmosphere:** Grid paper effect: `repeating-linear-gradient(rgba(0,0,0,0.04) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 24px)`.

**Animation:** Subtle `wobble` on hover for interactive elements. No entrance animation.

---

## Profile 7 — IDE-Inspired

**Character:** Familiar developer color schemes: Dracula, Nord, Catppuccin, Solarized, Gruvbox, One Dark. Comfort zone for developers.

**Use for:** Code reviews, technical documentation, developer-facing diagrams, spec reviews by engineers.

**Font pairing:**
- Display: `Fira Code` or `JetBrains Mono` — weight 600
- Body: `Fira Code` or system monospace — weight 400

**Sub-themes (choose one):**

| Sub-theme | `--ve-bg` | `--ve-accent` | Character |
|-----------|-----------|---------------|-----------|
| Dracula | `#282a36` | `#bd93f9` | Purple/pink, playful |
| Nord | `#2e3440` | `#88c0d0` | Arctic blue, calm |
| Catppuccin | `#1e1e2e` | `#cba6f7` | Pastel, modern |
| Solarized | `#002b36` | `#268bd2` | Classic, balanced |
| Gruvbox | `#282828` | `#fabd2f` | Warm amber, retro |
| One Dark | `#282c34` | `#61afef` | Blue/green, clean |

**Background atmosphere:** None — IDE themes are clean and content-focused.

**Animation:** No decorative animation. Syntax highlighting is the visual interest.

---

## Profile 8 — Data-Dense

**Character:** Maximum information per viewport. Small type, tight spacing, compact layout. No decorative elements. Signal over noise.

**Use for:** Recaps, dashboards with many metrics, comparison tables, configuration references, log analysis.

**Font pairing:**
- Display: `IBM Plex Sans` — weight 600, small caps for section headers
- Body: `IBM Plex Sans` — weight 400, `font-size: 13px`

**CSS Variables:**
```css
/* Dark (default) */
--ve-bg: #111118;
--ve-surface: #18181f;
--ve-surface-elevated: #22222c;
--ve-border: #2a2a38;
--ve-text: #d8d8e8;
--ve-text-dim: #8080a0;
--ve-accent: #6c8ebf;
--ve-accent-muted: #1a2030;

/* Light */
--ve-bg: #f4f4f8;
--ve-surface: #ffffff;
--ve-text: #111118;
--ve-accent: #2c5282;
```

**Layout:** Dense grid with `gap: 0.5rem`. `padding: 0.5rem 0.75rem` on cards. Font size 12–13px for body, 11px for metadata.

**Animation:** None — every millisecond of animation delay is a millisecond where data is not visible.

---

## Profile 9 — Gradient Mesh

**Character:** Bold, modern, high-production-value. Multi-point gradient mesh background. Glassmorphism cards. Large type. Feels like a premium landing page.

**Use for:** Executive summaries, presentations, polished architecture overviews, design system documentation.

**Font pairing:**
- Display: `Clash Display` (or `Plus Jakarta Sans`) — weight 700, tight tracking
- Body: `Plus Jakarta Sans` or `Satoshi` — weight 400

**CSS Variables:**
```css
/* Dark (default) */
--ve-bg: #0f0c29;
--ve-surface: rgba(255,255,255,0.06);
--ve-surface-elevated: rgba(255,255,255,0.10);
--ve-border: rgba(255,255,255,0.12);
--ve-text: #f8f8ff;
--ve-text-dim: rgba(248,248,255,0.6);
--ve-accent: #a78bfa;
--ve-accent-secondary: #38bdf8;

/* Light */
--ve-bg: #f0ebff;
--ve-surface: rgba(255,255,255,0.8);
--ve-border: rgba(167,139,250,0.2);
--ve-text: #1e1b4b;
--ve-accent: #7c3aed;
```

**Background atmosphere:** Multi-point gradient mesh on `body::before`:
```css
body::before {
  content: '';
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse 80% 60% at 0% 0%, #4c1d95 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, #1e3a5f 0%, transparent 50%),
    radial-gradient(ellipse 40% 40% at 50% 50%, #312e81 0%, transparent 60%);
}
```

**Card styling:** `backdrop-filter: blur(12px); background: var(--ve-surface); border: 1px solid var(--ve-border)`.

**Animation:** `fadeUp` with `scale` (0.96 → 1.0) entrance. Hover: card lifts with `transform: translateY(-2px); box-shadow: ...`.

---

## Compatibility Matrix

Rating: Excellent / Good / Poor / Avoid

| Aesthetic | Arch (Text) | Arch (Topology) | Flowchart | Sequence | Data Flow | ER/Schema | State | Mindmap | Table | Timeline | Dashboard |
|-----------|-------------|-----------------|-----------|----------|-----------|-----------|-------|---------|-------|----------|-----------|
| Monochrome Terminal | Good | Excellent | Excellent | Good | Excellent | Good | Excellent | Poor | Good | Avoid | Good |
| Editorial | Excellent | Poor | Good | Good | Poor | Avoid | Avoid | Good | Excellent | Excellent | Avoid |
| Blueprint | Excellent | Excellent | Good | Excellent | Excellent | Excellent | Good | Poor | Good | Good | Good |
| Neon Dashboard | Poor | Good | Good | Poor | Good | Poor | Good | Avoid | Avoid | Avoid | Excellent |
| Paper & Ink | Excellent | Avoid | Good | Good | Avoid | Poor | Avoid | Excellent | Excellent | Excellent | Avoid |
| Hand-Drawn | Good | Good | Excellent | Good | Good | Poor | Good | Excellent | Avoid | Avoid | Avoid |
| IDE-Inspired | Good | Excellent | Excellent | Excellent | Good | Excellent | Excellent | Poor | Excellent | Avoid | Good |
| Data-Dense | Good | Good | Good | Good | Good | Good | Good | Avoid | Excellent | Good | Excellent |
| Gradient Mesh | Excellent | Poor | Poor | Poor | Avoid | Avoid | Avoid | Good | Good | Good | Good |

**Selection guidance:**
- "Excellent" = ideal pairing, use confidently
- "Good" = works well with minor adjustments
- "Poor" = use only if explicitly requested; warn user
- "Avoid" = do not combine; the aesthetic actively harms readability for this type

---

## Cross References
- [[diagram-types]] — Select diagram type first, then use this node for aesthetic selection
- [[how-it-works]] — Phase 1 (Think) walks through aesthetic selection process
- [[commands]] — Each command has a default aesthetic (Blueprint, Editorial, Data-dense)
- [[rules]] — NEVER rule 5: Inter/Roboto/Arial prohibition applies regardless of aesthetic
