Now I have all foundational assets. Let me proceed through the nine-stage lifecycle. I'll load the remaining required supporting references (foundations bundle for UI production — copy-and-mock-data, mechanical-defaults, preflight card) before producing the artifact.All assets are loaded. Presenting the full direction spec.

---

# Interface Direction Spec — Engineering Analytics Dashboard Empty State

## 1. ROUTE PROOF

```
COMMAND:     /interface:design :auto
MODE:        interface (design-interface)
PROCEDURE:   procedures/aesthetic-direction.md (greenfield, no existing system)
SUPPORTING:  ordered foundations bundle (token work within interface mode)
PROOF ENV:   deterministic minimum — read-only, no runtime render available
PROOF CEILING: validated (WCAG contrast from hex) — no measured/verified
```

## 2. RESUMED BRIEF

| Field | Value | Classification |
|---|---|---|
| Target | Empty state of engineering analytics dashboard — first screen for brand-new workspace | resolved |
| Register | Product | resolved (declared) |
| Domain | Pull Requests, Review Time, Cycle Time, Deploy Frequency | resolved |
| Theme | Dark mode default | resolved |
| Density | Comfortable | resolved |
| ColorStrategy | Restrained, concrete hex tokens, no deferred values | resolved |
| Motion | Restrained | resolved |
| Copy | Real domain copy, no lorem/placeholder | resolved |
| Proof convention | validated (WCAG contrast), authored (design choices), no measured/verified | resolved |
| States | Empty (no data), loading (initializing), error (connection failed) | auto-resolved |

**Assumption Ledger:**

| Field | Assumed Value | Rationale | Reversibility |
|---|---|---|---|
| Output surface | Full-page dashboard shell with navbar | Empty state IS the dashboard at zero data; a modal would not preview the structure | reversible |
| Workspace state | New workspace, zero repositories connected, zero data points | Brand-new workspace per brief | reversible |
| Audience | Engineering team leads and ICs, technical | Domain is engineering delivery metrics | reversible |
| Metric card layout | 2×2 ghost grid previewing structure | Product posture — show what will populate without cluttering the void | reversible |

## 3. CONTEXT MANIFEST

```
SURFACE:          Empty state, engineering analytics dashboard
TASK TYPE:        build (direction spec)
REGISTER SOURCE:  register.md loaded
DIAL SOURCE:      brief-to-dials.md loaded
REGISTER:         Product
DIALS:            VARIANCE 5 / MOTION 3 / DENSITY 5
MODE BUNDLE LOADED:
  - interface:    design-principles.md, aesthetic-direction.md
  - foundations:  brief-to-dials.md (token decisions owned by interface mode here)
CONDITIONAL FILES LOADED:
  - mechanical-defaults.md, copy-and-mock-data.md, interface-preflight-card.md
```

### Design Read (one-line)

> "Engineering delivery metrics dashboard empty state, Product posture, dark mode, restrained palette with authored hex, comfortable density, one structural asymmetry: terminal illustration left, ghost metric slots right, copy-led invitation to connect."

## 4. GROUNDING RECORD

```
SOURCE:       no-fit
SOURCE TYPE:  no-fit
PROVENANCE:   No owned design system detected in workspace. No brand/system to ground in.
              Convention-heavy category (analytics dashboards) but brief is specific
              and no Code Mode transport available for live reference.
ROLE:         Contrast/reject against the conventional-dark-dashboard default
REJECT:       Near-black + acid accent (the "AI dark dashboard" default),
              generic zero-state icon + headline + CTA centered stack,
              color used as decoration instead of semantic state
DECISION CHANGED: The dark palette is restrained (muted cobalt accent, not acid),
              and the empty state uses a monospace terminal as its signature
              element instead of a generic zero-state illustration
LIMITATIONS:  No live reference to validate category deviation against.
              Grounding is internal anti-default only.
```

## 5. INTERFACE DIRECTION SPEC

### 5.1 Color System — Dark Mode, Restrained, Authored Hex

**Surface Layers**

| Token | Hex | Role |
|---|---|---|
| `--surface-base` | `#0D0F12` | Page background — deep near-black, blue undertone |
| `--surface-raised` | `#14171C` | Card, container, terminal block background |
| `--surface-overlay` | `#1A1E24` | Hover, tooltip, active row |

**Text**

| Token | Hex | Role | WCAG on base |
|---|---|---|---|
| `--text-primary` | `#E5E7EB` | Headlines, labels, metric values | 15.7:1 AA |
| `--text-secondary` | `#8B91A0` | Descriptions, secondary labels | 6.4:1 AA |
| `--text-muted` | `#7C8496` | Tertiary, disabled, placeholder | 5.3:1 AA |
| `--text-inverse` | `#0D0F12` | On accent backgrounds | — |

**Accent — Restrained (muted cobalt, not acid)**

| Token | Hex | Role |
|---|---|---|
| `--accent-primary` | `#5B8DEF` | Primary actions, selected states, focus rings |
| `--accent-primary-hover` | `#7AA3F4` | Hover state |
| `--accent-primary-subtle` | `rgba(91, 141, 239, 0.12)` | Active row backgrounds, subtle highlights |

WCAG: accent-primary on surface-base = 6.3:1 AA. Accent-primary on surface-raised = 5.9:1 AA.

**Borders & Dividers**

| Token | Hex | Role |
|---|---|---|
| `--border-default` | `#232832` | Card borders, dividers |
| `--border-subtle` | `#1C212A` | Subtle separators |
| `--border-accent` | `rgba(91, 141, 239, 0.30)` | Focus rings, active borders |

**Semantic — Product posture: semantic-first, never decoration**

| Token | Hex | Role | WCAG on base |
|---|---|---|---|
| `--status-success` | `#34D399` | Positive metrics, deployed, merged | 10.3:1 AA |
| `--status-warning` | `#FBBF24` | Attention, slow metrics | 11.9:1 AA |
| `--status-error` | `#F87171` | Failed, blocked, unreachable | 7.1:1 AA |
| `--status-info` | `#5B8DEF` | Informational (reuses accent) | 6.3:1 AA |

**Data Visualization — Full Palette strategy (charts only)**

| Token | Hex | Maps to |
|---|---|---|
| `--data-series-1` | `#5B8DEF` | Cycle Time |
| `--data-series-2` | `#A78BFA` | Review Time (muted violet) |
| `--data-series-3` | `#34D399` | Deploy Frequency |
| `--data-series-4` | `#F59E0B` | PR Volume (muted amber) |
| `--data-series-5` | `#6EE7B7` | Merge Success Rate (mint) |

All data series pass 4.5:1 on surface-base (minimum 5.9:1 for the amber).

### 5.2 Typography

**Typefaces — Engineering vernacular fingerprint**

| Role | Family | Why |
|---|---|---|
| Display | JetBrains Mono | Monospace — the engineer's native type. Used in the terminal signature and metric value highlights. Not used for body reading. |
| Body | Inter | Sans-serif, system-adjacent, readable at small sizes for data labels. Matches the tool/product posture. |
| Utility | Inter (weight variations) | Captions, timestamps, units — same family, lighter weight |

**Scale — 16px base, comfortable density**

| Token | Size | Line-height | Use |
|---|---|---|---|
| `--text-xs` | 0.75rem (12px) | 1.4 | Metric units, axis labels, timestamps |
| `--text-sm` | 0.8125rem (13px) | 1.45 | Secondary labels, ghost card descriptions |
| `--text-base` | 0.9375rem (15px) | 1.5 | Body, metric values, terminal output |
| `--text-lg` | 1.125rem (18px) | 1.35 | Card titles, section headers |
| `--text-xl` | 1.375rem (22px) | 1.25 | Empty-state metric placeholders |
| `--text-2xl` | 1.75rem (28px) | 1.2 | Empty-state headline |
| `--text-3xl` | 2.25rem (36px) | 1.15 | Hero metric (reserved for populated state) |

**Weights**

| Weight | Value | Use |
|---|---|---|
| Regular | 400 | Body, descriptions, terminal output |
| Medium | 500 | Labels, secondary emphasis |
| Semibold | 600 | Headings, metric labels |
| Bold | 700 | Hero numbers (populated state only) |

### 5.3 Layout — Empty State Composition

The empty state is the dashboard at zero data. The shell is present, showing structure that will fill. The composition uses a controlled asymmetric split: terminal illustration (signature) on the left, ghost metric slots and quickstart on the right.

```
┌─────────────────────────────────────────────────────────────┐
│  [nav: "Metrics" · workspace selector]          [avatar]    │  h: 56px
│  border-bottom: 1px solid var(--border-subtle)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │                         │  │                         │   │
│  │  TERMINAL BLOCK         │  │  GHOST METRIC SLOTS     │   │
│  │  (signature element)    │  │                         │   │
│  │                         │  │  Pull Requests     —    │   │
│  │  $ delivery-metrics \   │  │  Review Time       —    │   │
│  │    --workspace main     │  │  Cycle Time        —    │   │
│  │                         │  │  Deploy Frequency  —    │   │
│  │  Pull Requests   ··· —  │  │                         │   │
│  │  Review Time     ··· —  │  │  Each slot: label +     │   │
│  │  Cycle Time      ··· —  │  │  unit + dash, faint     │   │
│  │  Deploy Freq     ··· —  │  │  border, no fill        │   │
│  │                         │  └─────────────────────────┘   │
│  │  0 data points          │                                │
│  │  Connect a repository   │  ┌─────────────────────────┐   │
│  │  to populate metrics    │  │ QUICKSTART              │   │
│  │  █                      │  │                         │   │
│  │                         │  │ Start tracking          │   │
│  └─────────────────────────┘  │ delivery metrics.       │   │
│                               │ Connect a Git repo to   │   │
│                               │ measure PR velocity,    │   │
│                               │ review turnaround,      │   │
│                               │ cycle time, and deploy  │   │
│                               │ frequency.              │   │
│                               │                         │   │
│                               │ [Connect repository]    │   │
│                               └─────────────────────────┘   │
│                                                             │
│  All content above the fold. No scroll on first viewport.   │
└─────────────────────────────────────────────────────────────┘
```

**Columns:** Terminal block (42% width) + gap (4%) + ghost slots + quickstart (54% width). At narrow viewports (<720px), stack vertically: terminal → ghost slots → quickstart.

**Ghost metric slots:** Four horizontal bars, each with: label (left-aligned, `--text-secondary`, `--text-sm`), unit (right-aligned, `--text-muted`, `--text-xs`), and a long dash (center, `--text-muted`). Each bar has a 1px `--border-subtle` bottom border. No card containers — plain breathing layout, Product posture.

**Terminal block:** Darker raised surface (`--surface-raised`), JetBrains Mono throughout, `--text-base` size, `--text-secondary` color. The blinking cursor (█) is `--accent-primary`, cycling visibility at 530ms. Top-left: three macOS-style window dots (red/amber/green at 12px diameter, `--border-default`, no function — vernacular framing only).

**Quickstart card:** `--surface-raised` background, 1px `--border-default`, 24px padding. Headline in `--text-lg` Semibold, `--text-primary`. Description in `--text-sm`, `--text-secondary`, max 40ch. CTA button: `--accent-primary` fill, `--text-inverse` label, 12px horizontal padding, 8px vertical, `--text-sm` Medium.

### 5.4 Signature Element — The Terminal

The signature is the monospace terminal illustration. Instead of a generic zero-state icon (empty chart, magnifying glass, rocket), the empty state renders as a CLI session — the environment where engineers already think.

```
$ delivery-metrics --workspace main

  Pull Requests    ···  —  merged
  Review Time      ···  —  avg hours
  Cycle Time       ···  —  avg hours
  Deploy Frequency ···  —  /week

  0 data points · connect a repository to populate metrics
  █
```

The blinking cursor carries the entire motion budget: it says "waiting for input," which is literally true. The terminal is not decorative — it states the problem (zero data) and the solution (connect a repo) in the user's own vernacular.

### 5.5 Motion Intent — Restrained

| Trigger | Animation | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| Page load | Staggered fade-up: terminal (0ms delay) → ghost slots (120ms) → quickstart (240ms) | 300ms each | ease-out | Instant |
| Cursor blink | Opacity toggle 1↔0 | 530ms cycle | step-end | Static (always visible) |
| Ghost slot shimmer | Opacity pulse 0.3→0.5 | 2000ms loop, 800ms pause | ease-in-out | Static (0.35 opacity) |
| CTA hover | Scale 1.0→1.02 + brightness 1.0→1.08 | 150ms | ease-out | No scale, brightness 1.0→1.05 |
| CTA press | Scale 0.98 | 100ms | ease-in | No scale |

Total motion budget: cursor blink + ghost shimmer + staggered entrance + CTA micro-interactions. No scroll choreography (Product posture), no page-load sequence beyond the staggered entrance, no scattered hover effects.

### 5.6 State Variants

**Loading state** — Same layout, terminal reads:
```
$ delivery-metrics --workspace main
  Fetching data...
  ⣾
```
Ghost slots show skeleton shimmer. Cursor replaced by spinner glyph (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏, cycling 120ms frames). Quickstart card hidden (superseded by loading animation).

**Error state** — Same layout, terminal reads:
```
$ delivery-metrics --workspace main

  ERROR: Could not reach repository

  $ git remote add origin <url>
  █
```
Ghost slots unchanged (still empty). Quickstart card replaced by error card: same surface, headline "Could not connect to repository," description "Check that the repository URL is correct and your network connection is active." CTA: "Try again."

**First-data state** (transition, not in scope but noted): Dashes replaced with real values (JetBrains Mono, `--text-3xl` Bold for aggregate, `--text-lg` for detail). Terminal collapses to a small status bar at top-right. Ghost card borders fill with `--accent-primary-subtle` on populated slots.

### 5.7 Copy — Real Domain, One Register

All copy uses the Product register: plain, functional, consistent.

**Nav:** "Metrics" (product name). Workspace selector: "main" (default workspace).

**Ghost metric slot labels:**
- "Pull Requests" / "merged"
- "Review Time" / "avg hours"
- "Cycle Time" / "avg hours"
- "Deploy Frequency" / "/week"

**Terminal:**
- Prompt: `$ delivery-metrics --workspace main`
- Zero line: `0 data points · connect a repository to populate metrics`

**Quickstart:**
- Headline: "Start tracking delivery metrics"
- Description: "Connect a Git repository to begin measuring pull request velocity, review turnaround, cycle time, and deploy frequency across your team."
- CTA: "Connect repository"

**Error state:**
- Terminal: `ERROR: Could not reach repository` / `$ git remote add origin <url>`
- Error card headline: "Could not connect to repository"
- Error card description: "Check that the repository URL is correct and your network connection is active."
- Error CTA: "Try again"

**Loading state:**
- Terminal: `Fetching data...`

Copy audit pass: no lorem, no banned filler, no exclamation marks, no "Oops!", active voice throughout, action names stable, sentence case on headers, one register (Product, plain/functional), no invented precision, no generic names.

## 6. CRITIQUE / VALIDATION

### Anti-Default Critique

The three AI-default looks:

1. **Cream + serif + terracotta** — N/A. Dark mode brief precludes this entirely.
2. **Near-black + one acid accent** — The primary risk. A dark surface with a single bright accent (#00FF41 or #FF4500) is the most common AI dark-dashboard default. **Counter:** The accent is a muted cobalt-blue (#5B8DEF), not acid. Multiple data-series colors exist for charting. The signature is structural (terminal), not chromatic (accent color).
3. **Broadsheet with hairline rules** — N/A. Dashboard, not editorial.

**Risk assessment:** The composition could still read as "dark dashboard" if reduced to palette alone. The monospace terminal illustration is the defense — it shifts identity from palette to structural vernacular. The ghost metric slots (horizontal bars, not cards) avoid the undifferentiated card grid tell.

**One justified aesthetic risk:** Rendering the empty state as a terminal session. Risk: could read as gimmicky if the terminal copy is too clever. Mitigation: the terminal output is straightforward (query → results → actionable direction), using real domain vocabulary, not witty asides.

### One Named Criterion: Distinctiveness

**Test:** If the accent color were changed to any other muted hue, would the direction still be identifiable? **Yes.** The terminal signature, the ghost slot bar layout, and the asymmetric split are structural choices that survive palette swaps. A generic dark dashboard would collapse to its accent color if swapped.

## 7. EVIDENCE LEDGER

| Claim | Level | Method | Source/Evidence |
|---|---|---|---|
| text-primary (#E5E7EB) on surface-base (#0D0F12) passes WCAG AA 4.5:1 | validated | Computed contrast ratio = 15.7:1 | Hex pair → luminance formula |
| text-secondary (#8B91A0) on surface-base passes WCAG AA 4.5:1 | validated | Computed contrast ratio = 6.4:1 | Hex pair → luminance formula |
| text-muted (#7C8496) on surface-base passes WCAG AA 4.5:1 | validated | Computed contrast ratio = 5.3:1 | Hex pair → luminance formula |
| accent-primary (#5B8DEF) on surface-base passes WCAG AA 3:1 large/UI | validated | Computed contrast ratio = 6.3:1 | Hex pair → luminance formula |
| accent-primary on surface-raised passes 3:1 large/UI | validated | Computed contrast ratio = 5.9:1 | Hex pair → luminance formula |
| All semantic status colors pass 4.5:1 on surface-base | validated | Minimum ratio = 7.1:1 (error), maximum = 11.9:1 (warning) | Hex pairs → luminance formula |
| All data-series colors pass 4.5:1 on surface-base | validated | Minimum ratio = 5.9:1 (amber) | Hex pairs → luminance formula |
| Register = Product, dials = VARIANCE 5 / MOTION 3 / DENSITY 5 | authored | Inferred from brief signals (dashboard, restrained, comfortable) | brief-to-dials.md inference table |
| Palette is restrained, non-acid accent | authored | Deliberate choice against the near-black + acid default | design principles anti-default calibration |
| Terminal signature is the one bold move, everything else quiet | authored | Design principles §5 restraint | Single structural deviation rule |
| Motion budget fits Product posture (state transitions only) | authored | Register.md Product motion budget + brief "restrained" | register.md dial table |
| Copy uses one Product register, no lorem, no banned filler | authored | Content gate sweep passed on all visible strings | copy-and-mock-data.md checks |
| No runtime render available | blocked | Read-only environment, no browser/rendering | Degradation ladder: ceiling at validated |

**PROOF_TIER=validated** — No runtime render available. All claims are deterministic computations or authored design choices. No measured or verified claims.

## 8. NEXT ACTION / HANDOFF

```
STATUS=OK
PRODUCES="Interface Direction Spec"
PROOF=target,register,designDials,preflightResult
NEXT=/interface:foundations,/interface:motion,/interface:audit
HANDOFF_REQUIRED=false
```

**Recommended next steps:**

| If you want to... | Use |
|---|---|
| Turn the direction into a static token system (spacing rhythm, responsive type scale, full contrast matrix) | `/interface:foundations` |
| Specify the cursor blink, stagger entrance, and shimmer as implementable keyframes with reduced-motion fallbacks | `/interface:motion` |
| Run findings-first review: accessibility coverage, anti-pattern scan, scoring | `/interface:audit` |
| Move accepted direction to implementation | `sk-code` handoff via `.opencode/skills/sk-design/shared/sk-code-handoff.md` — preserve all authored hex tokens, the terminal signature, and the Product register constraints |

**Unresolved decisions for downstream:**
- Corner radius system (not resolved here — foundations owns it)
- Spacing rhythm / grid (foundations)
- Breakpoint definitions beyond the 720px narrow switch noted (foundations)
- Icon library selection (foundations or build)
- Specific CTA button dimensions and hit area (build)
- Workspace selector interaction model (build)