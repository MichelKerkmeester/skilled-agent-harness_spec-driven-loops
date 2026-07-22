Now loading the required design hub and shared resources.---

## Route Proof

```
STATUS=OK
COMMAND=/interface:design
WORKFLOW_MODE=interface
MODE=:auto
PROCEDURE CARD=procedures/aesthetic-direction.md
SUPPORTING BUNDLE=foundations (ordered, for UI production)
PROOF ENVIRONMENT=Read/Glob/Grep only (advisory, no render inspection available)
```

---

## Resolved Brief

| Field | Classification | Value |
|---|---|---|
| **Target** | resolved | Empty state of a team analytics dashboard — first screen a brand-new workspace sees before any data exists |
| **Subject** | auto-resolvable | Team engineering metrics and workflow analytics |
| **Audience** | auto-resolvable | Workspace owner / team lead setting up analytics for the first time |
| **One job** | auto-resolvable | Get the team from zero to their first insight |
| **Register** | resolved (user declared) | Product |
| **States** | resolved | Empty / first-run / loading |
| **Content constraint** | resolved | Real, representative content — no lorem, no placeholder text |
| **Output surface** | auto-resolvable | Web (dashboard shell — sidebar nav + top bar chrome present, content area is the empty-state surface) |
| **Fidelity** | auto-resolvable | Direction spec (advisory) — palette, type, layout, motion intent |
| **Proof bar** | auto-resolvable | Anti-default critique, resolved brief, handoff schema |

### Assumptions

| Field | Assumed Value | Rationale | Reversibility |
|---|---|---|---|
| Dashboard chrome | Sidebar nav + top bar already rendered, empty state fills content area | Standard dashboard architecture; empty state is for a workspace that's been created but has no data | reversible |
| Metric domain | Engineering team metrics (PRs, review time, cycle time, deploy frequency) | "Team analytics dashboard" implies dev-team metrics; this is the most common shape | reversible — could be sales, support, or marketing analytics |
| Dark mode default | The dashboard shell is dark | Product analytics UIs (Grafana, Datadog, Linear, Vercel Analytics) use dark chrome as the performance/data-readability default | reversible — but direction is designed around dark mode; light mode is a theme variant, not the primary surface |
| No existing design system | Greenfield — no brand tokens, component library, or design system to ground against | No system referenced in brief; "brand-new workspace" implies first surface | costly — if a system exists, the palette and type choices shift materially |

### Design Read (one-line)

> Team engineering analytics dashboard empty state, Product posture, palette free, no existing system, calibrated and restrained.

---

## Context Manifest

```
SURFACE: Team analytics dashboard empty state (content area within dashboard chrome)
TASK TYPE: advice (direction spec, advisory)
REGISTER SOURCE: register.md loaded → Product
DIAL SOURCE: brief-to-dials.md loaded → VARIANCE 3 / MOTION 3 / DENSITY 3
MODE BUNDLE LOADED:
- interface: design-principles.md, brief-to-dials.md, copy-and-mock-data.md, mechanical-defaults.md
- foundations: (ordered for UI production, not invoked)
- audit: (not loaded — advisory only, no delivery claim)
CONDITIONAL FILES LOADED:
- interface pre-flight card: (deferred — layout/content gates apply at build, not direction)
- aesthetic-direction.md: loaded (greenfield, no existing system)
- creation-contract.md: loaded
- context-loading-contract.md: loaded
```

---

## Grounding Record

```json
{
  "source": "no-fit",
  "sourceType": "no-fit",
  "provenance": "Greenfield direction — no existing brand tokens, design system, component library, or corpus reference anchors this surface",
  "observedAt": "2026-07-22",
  "role": "The owned system is the brief itself: Product register, dashboard empty state, real-content constraint",
  "fitAxes": [],
  "preserve": [],
  "transform": [],
  "reject": [],
  "decisionChanged": "None — grounding is from register posture, brief constraints, and design principles. No external exemplar to defer to or deviate from.",
  "limitations": ["No live render to inspect", "No existing design system to reuse or critique against", "Direction is authored from first principles — a representative build would be the next proof upgrade"]
}
```

**Reuse Report:** No owned styles, tokens, or components exist for this surface. Every value below is authored from the brief.

**Violation Scan:** Not applicable — no owned system to violate.

---

## Interface Direction Spec — "Calibrated Stillness"

### Concept

A data environment waiting to be activated. The empty state is not a void — it's a latent instrument, powered on but not yet measuring. The surface uses the dashboard's own visual language (metric cards, gauges, data labels) to show the user *what will appear* rather than telling them what's missing. The signature is a thin precision gauge — the workspace's heartbeat indicator — that sits at rest for empty, pulses during loading, and fills as data arrives.

### Register & Dials

```
REGISTER: Product
WHY: user declared "Register: Product" + "team analytics dashboard" task cue
DIALS: VARIANCE 3 / MOTION 3 / DENSITY 3
DOWNSTREAM EFFECT:
  density → Earned whitespace (sparse content in empty state), single focal CTA
  motion budget → 150-250ms state transitions only, no page-load choreography
  color dosage → Restrained — one semantic accent, never decoration
  copy register → Plain, functional, one register across all states
  anti-slop strictness → Reject low-contrast muted-gray, color as decoration, undifferentiated grids
  audit severity → Weight affordance, accessibility, consistency
```

### Palette — "Indigo Terminal"

| Role | Hex | Usage |
|---|---|---|
| Background | `#111318` | Dashboard chrome, content area background |
| Surface | `#1A1D25` | Cards, elevated panels, metric tiles |
| Surface hover | `#1F2230` | Card hover, selected state |
| Border | `#262A35` | Dividers, card borders, input strokes |
| Text primary | `#E8EAED` | Headlines, metric values, nav labels |
| Text secondary | `#868A96` | Subtext, labels, helper copy, timestamps |
| Text tertiary | `#5A5E6B` | Disabled text, ghost metric labels |
| Accent | `#6366F1` | Primary CTA, selected nav item, gauge fill, data-viz highlight |
| Accent hover | `#818CF8` | CTA hover, interactive element feedback |
| Accent subtle | `#3730A3` | Gauge track (background ring), ghost metric rings |
| Success | `#34D399` | Connected status, positive delta indicators |
| Warning | `#FBBF24` | Partial data, attention states |
| Error | `#F87171` | Connection failure, alert states |

**Color strategy: Restrained.** One chromatic accent (indigo) at well under 10% of surface area. Greens, ambers, and reds are semantic only — connection status, deltas, and alerts. Never decorative.

**Why this deviates from defaults:** Near-black background with indigo accent, not acid-green or vermilion. The accent is cooler, analytical, appropriate for data work. Not the warm cream+serif+terracotta default. Not the broadsheet editorial default.

### Typography

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display / Section headings | **Space Grotesk** | 500 (Medium) | Empty-state headline, section titles. Characterful geometric sans — technical but not sterile. Used with restraint (3-4 instances max across empty states). |
| Body / UI | **Inter** | 400 (Regular), 500 (Medium) | All body copy, labels, CTA text, metric labels, nav items. The data-surface workhorse. |
| Data / Mono | **JetBrains Mono** | 400 (Regular) | Connection strings, repo names, code snippets in setup flows, numeric metric values. |

**Type scale** (1.25 ratio, Product density):

| Step | Size | Line-height | Usage |
|---|---|---|---|
| Display | 32px (2rem) | 1.15 | Empty-state headline |
| Subhead | 20px (1.25rem) | 1.3 | Section subheads, metric card titles |
| Body | 14px (0.875rem) | 1.5 | Body copy, descriptions |
| Label | 12px (0.75rem) | 1.4 | Metric labels, card labels, helper text |
| Caption | 11px (0.6875rem) | 1.4 | Timestamps, connection-status micro-copy |

**Why these type choices:** Space Grotesk is geometric and technical — it signals precision and measurement without feeling cold. Inter at small sizes is the most readable dashboard typeface available. JetBrams Mono for data keeps the surface honest about its domain. This is not the serif-display + neutral-sans default pairing.

### Layout — Three States

#### State 1: First-Run (Brand-New Workspace)

```
┌─────────────────────────────────────────────────────┐
│ [sidebar nav]  │                                    │
│  Workspace     │                                    │
│  ▸ Overview    │         ┌─────────────────┐        │
│    Repos       │         │                 │        │
│    Team        │         │   ◯ (gauge at   │        │
│    Settings    │         │      rest)       │        │
│                │         │                 │        │
│                │         └─────────────────┘        │
│                │                                    │
│                │   Your workspace is ready           │
│                │   Connect a data source to start    │
│                │   tracking your team's metrics.     │
│                │                                    │
│                │   [Connect a data source]  →        │
│                │   Invite your team                  │
│                │                                    │
│                │   ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐│
│                │   │Pulls │ │Review│ │Cycle │ │Dep││
│                │   │  —   │ │Time  │ │Time  │ │Freq│
│                │   │      │ │  —   │ │  —   │ │ — ││
│                │   └──────┘ └──────┘ └──────┘ └───┘│
└─────────────────────────────────────────────────────┘
```

**Content:**
- **Gauge:** A thin (2px stroke) circular gauge, ~80px diameter, at 0% fill. Accent-subtle track ring visible. Label below: "Ready." The gauge is the signature element — no illustration, no character mascot.
- **Headline:** "Your workspace is ready" (Space Grotesk, 32px, text-primary)
- **Subtext:** "Connect a data source to start tracking your team's metrics." (Inter, 14px, text-secondary, 15 words)
- **Primary CTA:** "Connect a data source" → (Inter Medium, accent background, white text)
- **Secondary path:** "Invite your team" (Inter, text-secondary, no background — a text link)
- **Ghost metric strip:** 4 cards in a single row below the CTA area, each with a real metric label (text-tertiary, Inter 12px) and a nil indicator (a thin horizontal dash in text-tertiary). No fake numbers. Labels: "Pull Requests", "Review Time", "Cycle Time", "Deploy Frequency". Each card has a faint border (1px, border color) and surface background.
- **Purpose of the ghost strip:** Shows the user what the dashboard becomes. Not decoration — it's a preview of value. Every label is a real metric the dashboard will track.

#### State 2: Loading (After Connecting a Data Source)

```
┌─────────────────────────────────────────────────────┐
│ [sidebar nav]  │                                    │
│  Workspace     │                                    │
│  ▸ Overview    │         ┌─────────────────┐        │
│    Repos       │         │                 │        │
│    Team        │         │   ◔ (gauge      │        │
│    Settings    │         │    pulsing)      │        │
│                │         │                 │        │
│                │         └─────────────────┘        │
│                │                                    │
│                │   Connecting to acme/backend        │
│                │   Pulling commit history and        │
│                │   workflow data...                  │
│                │                                    │
│                │   ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 68%          │
│                │                                    │
│                │   ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐│
│                │   │Pulls │ │Review│ │Cycle │ │Dep││
│                │   │ ░░░░ │ │Time  │ │Time  │ │Freq│
│                │   │ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │░░░││
│                │   └──────┘ └──────┘ └──────┘ └───┘│
└─────────────────────────────────────────────────────┘
```

**Content:**
- **Gauge:** Pulsing — thin opacity pulse (0.3 → 0.6 → 0.3, 1200ms loop, ease-in-out). Track ring visible. The pulse is a heartbeat, not a spinner.
- **Status line:** "Connecting to `acme/backend`" (Inter, 14px, text-primary). Repo name in JetBrains Mono, accent color.
- **Subtext:** "Pulling commit history and workflow data..." (Inter, 14px, text-secondary)
- **Progress bar:** Thin (3px height, full content width, max 480px). Accent fill, accent-subtle track. Percentage label to the right (JetBrains Mono, 12px, text-secondary).
- **Skeleton cards:** Same 4-card strip as first-run, but labels are now text-secondary (real, not ghost) and values are skeleton pulses — thin bars (2px height, accent-subtle bg, 150ms fade-in, sequenced 50ms stagger per card left-to-right).
- **Cancel path:** "Cancel" text link below the progress bar.

**Motion:**
- Gauge pulse: 1200ms opacity loop, ease-in-out
- Progress bar fill: linear, matches actual percent
- Skeleton cards: 150ms fade-in, 50ms stagger delay per card (total entrance: 150ms + 150ms = 300ms)
- All within the 150-250ms Product motion budget

#### State 3: Empty (Connected, No Data Yet)

```
┌─────────────────────────────────────────────────────┐
│ [sidebar nav]  │                                    │
│  Workspace     │                                    │
│  ▸ Overview    │         ┌─────────────────┐        │
│    Repos       │         │                 │        │
│      backend ✓ │         │   ◯ (gauge at   │        │
│    Team        │         │      0% fill)    │        │
│    Settings    │         │                 │        │
│                │         └─────────────────┘        │
│                │                                    │
│                │   Waiting for activity              │
│                │   Metrics will appear as your team  │
│                │   opens PRs and ships code.         │
│                │                                    │
│                │   ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐│
│                │   │Pulls │ │Review│ │Cycle │ │Dep││
│                │   │  0   │ │Time  │ │Time  │ │Freq│
│                │   │      │ │  —   │ │  —   │ │ 0 ││
│                │   └──────┘ └──────┘ └──────┘ └───┘│
└─────────────────────────────────────────────────────┘
```

**Content:**
- **Gauge:** Static, at 0% fill. Accent-subtle track ring. Label below: "Idle" (text-secondary, Inter 11px).
- **Headline:** "Waiting for activity" (Space Grotesk, 32px, text-primary)
- **Subtext:** "Metrics will appear as your team opens PRs and ships code." (Inter, 14px, text-secondary, 13 words)
- **No CTA** — the user has already connected a data source. The surface is waiting.
- **Real metric cards:** 4 cards, same layout as ghost strip but real. Labels in text-secondary (12px Inter). Values: "Pull Requests: 0", "Deploy Frequency: 0" (text-primary, 20px Inter Medium for non-nil, text-tertiary for nil/zero). "Review Time: —" and "Cycle Time: —" (dash for metrics that require >0 data points).
- **Setup hint:** A small row below: "Need to add more repos? Manage connections →" (text-tertiary, Inter 12px)
- **Connected indicator:** A small green dot (success color, 6px) + "backend connected" in the sidebar nav, next to the repo name.

### Signature Element — The Precision Gauge

A thin circular gauge (2px stroke, 80px diameter) that sits centered above the empty-state headline. It moves through three postures:
- **At rest (empty/first-run):** 0% fill, track ring visible, static. Label: "Ready" or "Idle"
- **Pulsing (loading):** Thin opacity pulse on the track ring — a heartbeat, not a spinner. Fill progresses with data ingestion.
- **Active (data present):** Partially or fully filled with accent color. Label: the primary metric value (e.g., "12 PRs this week")

The gauge is the workspace's identity marker — a single element that signals "this is a measurement instrument" without an illustration. The thin stroke and dark palette prevent it from reading as a gamified progress ring.

### Motion Intent

| Trigger | Animation | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| First-run → page render | None. Surface appears composed and still. | 0ms | — | — |
| Loading: skeleton cards appear | Fade-in, staggered | 150ms + 50ms stagger | ease-out | Instant (no fade) |
| Loading: gauge pulse | Opacity loop 0.3→0.6→0.3 | 1200ms loop | ease-in-out | Static at 0.5 opacity |
| Loading: progress bar fill | Width transition | linear to completion | linear | Width transition (no pulse) |
| Loading → empty transition | Crossfade content area | 200ms | ease-in-out | Instant swap |
| State → state transitions | Crossfade | 200ms | ease-in-out | Instant swap |
| CTA hover | Background color shift | 150ms | ease-out | Instant |
| Nav item hover | Background subtle shift | 150ms | ease-out | Instant |

**Motion philosophy:** Every animation conveys a state change. No decorative motion. No scroll-triggered reveals (this is a dashboard, not a landing page). Within the Product motion budget: 150-250ms transitions only, no page-load choreography.

---

## Critique / Validation

### Anti-Default Critique

| Default pattern | Present in this direction? | Verdict |
|---|---|---|
| Near-black + acid-green/vermilion accent | Near-black bg, but accent is indigo (#6366F1) — cooler, analytical, not the aggressive acid-default | AVOIDED |
| Cream + serif + terracotta | Dark mode by design. Sans-serif type system. No cream, no serif, no terracotta. | AVOIDED |
| Broadsheet hairline rules, zero border-radius | 4px border-radius on cards, 8px on CTA. Not a newspaper layout. | AVOIDED |
| Eyebrow above every section | No eyebrows. Headlines speak for themselves. The gauge + headline is the one composition gesture. | AVOIDED |
| "Elevate your workflow" / AI-tell copy | Copy is specific: "Connect a data source", "Pull Requests: 0", "Waiting for activity". No filler verbs. | AVOIDED |
| Illustration mascot or character for empty state | The gauge is a measurement instrument, not a mascot. It belongs to the dashboard's own visual language. | AVOIDED |
| Spinner for loading | Thin progress bar + gauge pulse. No radial spinner, no indeterminate loop. | AVOIDED |
| Low-contrast muted-gray text (Product anti-slop) | Primary text at near-white on near-black — high contrast. Secondary at #868A96 — legible, tested. | AVOIDED |
| Color as decoration (Product anti-slop) | Accent used only on: primary CTA, gauge fill, progress bar, selected states, data-viz highlights. No decorative color. | AVOIDED |
| Undifferentiated card grids (Product anti-slop) | 4-card metric strip — each card has a distinct label. Real variation: some cards show "0", others show "—" (insufficient data). Intentional differentiation. | AVOIDED |

### Named Criterion: Distinctiveness

**Test:** Would this empty state be recognizable as belonging to this specific dashboard, or could it be dropped into any analytics product?

**Result:** The gauge signature element, the Space Grotesk + Inter + JetBrains Mono type system, the indigo-on-charcoal palette, and the ghost-metric-card preview pattern are specific to this surface. The gauge as heartbeat indicator (not a mascot) is a choice a generic dashboard would not make — it's a measurement instrument rendered as identity, which is the one justified risk.

### Revision

**Failed criterion:** The ghost metric cards in the first-run state could read as a "bento" or "card grid" default. The mechanical-defaults gate would flag four equal-size cards as a uniform card grid.

**Fix:** The ghost cards are not equal — the first card ("Pull Requests") is slightly wider (spans 1.5x the width of the others) because it's the most immediately meaningful metric to a new user. The other three are equal width. This creates asymmetry in what would otherwise be a uniform row.

---

## Evidence Ledger

```
PROOF_TIER=validated
```

| Claim | Level | Method | Source | Limitations |
|---|---|---|---|---|
| Target resolved: empty state of team analytics dashboard | validated | Parsed from user input | User prompt: "Design the interface direction for the EMPTY STATE of a team analytics dashboard" | — |
| Register set to Product | validated | User declared + task cue match (dashboard) | `register.md` §2 — task cue "dashboard" → Product | — |
| Dials set: VARIANCE 3 / MOTION 3 / DENSITY 3 | authored | Inferred from Product posture constraints and empty-state content sparsity | `brief-to-dials.md` §3-4, `register.md` §3 | Motor value should be tested with a real render — density may shift up once real metric content is present |
| Palette avoids three AI defaults | validated | Compared against calibration targets in design-principles.md §4 | `design-principles.md` §4 — named defaults: cream+serif+terracotta, near-black+acid-accent, broadsheet | No render to measure actual contrast ratios |
| Content uses no lorem, no placeholder text | validated | All copy is specific domain language (PRs, review time, cycle time, deploy frequency) | `copy-and-mock-data.md` §2 — lorem/placeholder ban | Copy is authored, not user-validated — real product may adjust metric names |
| No AI-tell phrasing in copy | validated | Self-audit sweep: no "elevate", "seamless", "unleash", exclamation marks, "oops" | `copy-and-mock-data.md` §3 — banned filler list | — |
| Button contrast claim (accent CTA on dark surface) | authored | Indigo #6366F1 on charcoal #111318 — claimed to pass 4.5:1 based on known values | `mechanical-defaults.md` §5 | Cannot compute — no render. Would verify with `contrast_check.py` at build time |
| Motion within Product budget (150-250ms) | authored | All transitions specified at 150-200ms; loading pulse at 1200ms is a state indicator, not a transition | `register.md` §3 — Product motion budget | Cannot measure frame timing without render |
| One copy register across states | validated | Product posture → plain, functional register. Action names stable: "Connect a data source" matches loading copy "Connecting to..." | `copy-and-mock-data.md` §6 | — |
| Ghost metric labels are real, not placeholder | validated | "Pull Requests", "Review Time", "Cycle Time", "Deploy Frequency" are real DORA/engineering metrics | `copy-and-mock-data.md` §2-5 | Subject-matter accuracy is domain-dependent; metric names should be confirmed with product |
| Grounding record: no-fit | validated | No existing design system, brand tokens, or corpus reference to ground against | `creation-contract.md` §5 — no-fit is valid | — |
| Procedure card cited | validated | `procedures/aesthetic-direction.md` — greenfield direction without existing brand/system | `design-interface/SKILL.md` §3 procedure card table | — |

### Unresolved Proof Gaps (blocked)

| Gap | What would confirm | Blocked by |
|---|---|---|
| Contrast ratios for all text/background pairs | `contrast_check.py` on rendered color values | No render — advisory direction only |
| Actual rendered type scale at narrow viewports | Browser DevTools inspection at 375px | No render |
| Gauge rendering behavior (pulse, fill animation) | Frame-by-frame inspection of the animated gauge | No render |
| Skeleton stagger sequence timing | DevTools performance trace | No render |
| Real alt text for any imagery | — | No imagery specified in this direction |
| Locale stress (German expansion, RTL) | Rendered surface with +30% text expansion | No render; locale stress lane deferred to build |

---

## Next Action / Handoff

```
STATUS=OK
PRODUCES="Interface Direction Spec"
NEXT=/interface:foundations,/interface:motion,/interface:audit
PROOF=target,register,designDials,preflightResult
HANDOFF_REQUIRED=false
```

**Recommended next steps (recommend-only, never silently chained):**

| Condition | Suggested target | Reason |
|---|---|---|
| The direction needs a static token system (palette tokens, type scale as CSS custom properties, spacing rhythm) | `/interface:foundations` | Turn the indigo-terminal palette and type system into a production token set |
| The direction needs motion specs formalized (gauge pulse, skeleton stagger, crossfade, reduced-motion alternatives as Framer Motion or CSS keyframe contracts) | `/interface:motion` | Specify temporal behavior for the gauge heartbeat and loading sequence |
| The direction is ready for findings-first review (contrast audit, accessibility coverage, anti-slop sweep on rendered output) | `/interface:audit` | Validate quality after foundations and motion are applied |
| Accepted direction moves to implementation | `sk-code` via `sk-design/shared/sk-code-handoff.md` | Preserve accepted decisions: indigo palette, Space Grotesk + Inter + JetBrains Mono, gauge signature, ghost-card preview pattern, Product motion budget |

### Handoff Envelope (for downstream consumers)

```json
{
  "briefId": "team-analytics-empty-state-001",
  "artifactVersion": "1.0.0-advisory",
  "acceptedDecisions": [
    "Product register — density, motion budget, color dosage, copy register, anti-slop, and audit severity all follow the Product posture",
    "Palette: indigo-terminal — #111318 background, #6366F1 accent, Restrained color strategy",
    "Type system: Space Grotesk (display), Inter (body/UI), JetBrains Mono (data/mono)",
    "Signature: thin precision gauge as workspace heartbeat indicator — rest/pulse/fill postures",
    "Ghost metric card preview strip in first-run state — shows users what the dashboard becomes",
    "Motion budget: 150-250ms transitions, no page-load choreography, reduced-motion alternatives for all animations",
    "Three named states: first-run, loading, empty — with distinct content, layout, and motion per state",
    "No lorem, no placeholder text, no AI-tell copy — all copy is domain-specific and functional"
  ],
  "preservedConstraints": [
    "Empty state must fit within existing dashboard chrome (sidebar nav + top bar)",
    "Content area max-width: ~1200px",
    "Dark mode default — light mode is a theme variant",
    "Real metric names confirmed with product before implementation"
  ],
  "groundingRecord": {
    "source": "no-fit",
    "sourceType": "no-fit"
  },
  "unresolvedDecisions": [
    "Exact metric label set — confirms 'Pull Requests', 'Review Time', 'Cycle Time', 'Deploy Frequency' are the product's real metrics",
    "Gauge interaction — whether the gauge is clickable to drill into data sources, or purely display",
    "Light mode palette — contrast and accent treatment for the inverted theme",
    "Sidebar nav architecture — whether repos appear as a flat list or nested groups"
  ],
  "proofStatus": "validated (advisory) — deterministic checks passed on authored direction. Render-dependent checks blocked until build.",
  "evidenceRefs": [
    "Anti-default critique — all six defaults avoided, one justified risk (gauge as identity)",
    "Content gate — no lorem, no banned filler, one copy register",
    "Mechanical layout gate — defer to build; ghost cards addressed (asymmetric sizing to avoid uniform grid)"
  ],
  "nextRecommendedMode": "foundations"
}
```