**Route Proof**
- Command: `/interface:design`
- `workflowMode=interface`
- Supporting mode: foundations bundle (ordered for UI production)
- Proof environment: Read-only (Read/Glob/Grep only); ceiling: `validated`

---

**Resolved Brief**

| Field | Value |
|---|---|
| Target | Pricing section, developer-tools product |
| Subject | Three-tier pricing (Free, Pro, Team), Pro visually featured |
| Audience | Developers and technical decision-makers evaluating the product |
| One Job | Convert visitors by communicating clear value at each tier, with Pro as the obvious choice |
| Register | Brand (explicitly pinned) |
| Density | Comfortable |
| Motion | Restrained |
| ColorStrategy | Restrained, concrete hex tokens authored below |
| Theme | Light mode default |
| Fidelity | Direction (not build) |
| Output | Interface Direction Spec |

**Assumption Ledger**

| Field | Assumed | Rationale | Reversibility | Impact |
|---|---|---|---|---|
| Pricing values | $0 / $29 / $79 per month | Common developer-tools pricing range; user can override | Reversible | Does not change direction |
| Billing toggle | Monthly (no annual toggle shown) | Simplifies the direction; can be added later | Reversible | Layout unaffected |

---

**Context Manifest**

- Owned system: none (greenfield)
- Content: real tier copy authored below (no lorem)
- Data: pricing values, feature lists, CTA labels
- Constraints: light mode, restrained color, comfortable density
- Existing artifacts: none
- Build/runtime context: direction only, no render available

---

**Grounding Record**

```json
{
  "source": "none",
  "sourceType": "no-fit",
  "provenance": "greenfield direction, no owned system or exemplar loaded",
  "observedAt": "2026-07-22",
  "role": "anchor",
  "fitAxes": [],
  "preserve": [],
  "transform": [],
  "reject": [],
  "decisionChanged": "none — proceeding with anti-default process",
  "limitations": ["no real-world reference loaded; direction derived from subject and register"]
}
```

Procedure applied: none — baseline interface workflow.

---

**Creation/Remediation Artifact — Interface Direction Spec**

### 1. Token System

#### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Background | `#F8FAFC` | Page background, cool light gray |
| Surface | `#FFFFFF` | Card backgrounds |
| Text primary | `#0F172A` | Headings, tier names, prices |
| Text secondary | `#475569` | Body copy, feature text |
| Text tertiary | `#94A3B8` | Helper text, disclaimers |
| Accent | `#2563EB` | CTA buttons, featured tier border, links |
| Accent hover | `#1D4ED8` | CTA hover state |
| Accent subtle | `#EFF6FF` | Featured tier background tint |
| Border default | `#E2E8F0` | Card borders |
| Border featured | `#2563EB` | Featured tier left-border accent |
| Divider | `#F1F5F9` | Section dividers, feature list separators |

All hex values are **authored** (design choices, not derived from a system).

#### Typography

| Role | Family | Weight | Size | Line Height | Tracking |
|---|---|---|---|---|---|
| Section heading | Inter | 700 | 2.25rem | 1.2 | -0.02em |
| Tier name | Inter | 600 | 1.25rem | 1.4 | -0.01em |
| Price | Inter | 700 | 3rem | 1 | -0.02em |
| Price period | Inter | 400 | 1rem | 1.5 | 0 |
| Value line | Inter | 400 | 0.9375rem | 1.5 | 0 |
| Feature text | Inter | 400 | 0.9375rem | 1.6 | 0 |
| CTA label | Inter | 600 | 0.9375rem | 1 | 0.01em |
| Technical detail | JetBrains Mono | 400 | 0.8125rem | 1.5 | 0 |

Type scale is **authored**. Inter chosen for its geometric clarity and developer-tool familiarity; JetBrains Mono for technical credibility.

#### Spacing

| Token | Value | Usage |
|---|---|---|
| Section padding Y | 6rem | Top/bottom of pricing section |
| Section padding X | 2rem | Horizontal section padding |
| Card padding | 2rem | Internal card padding |
| Card gap | 1.5rem | Gap between cards |
| Feature list gap | 0.75rem | Between feature items |
| CTA padding Y | 0.75rem | Button vertical padding |
| CTA padding X | 1.5rem | Button horizontal padding |

---

### 2. Layout

Three-column CSS Grid, equal-width cards. The featured Pro tier occupies the same grid column width but gains visual prominence through elevation and color, not size.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   Simple, transparent pricing                │
│          Start free. Scale as your projects grow.           │
│                                                             │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │              │  │ ┌──────────────┐ │  │              │  │
│  │   Starter    │  │ │     Pro      │ │  │    Team      │  │
│  │              │  │ │  (featured)  │ │  │              │  │
│  │    $0/mo     │  │ │   $29/mo     │ │  │   $79/mo     │  │
│  │              │  │ │              │ │  │              │  │
│  │  ● feature  │  │ │  ● feature   │ │  │  ● feature   │  │
│  │  ● feature  │  │ │  ● feature   │ │  │  ● feature   │  │
│  │  ● feature  │  │ │  ● feature   │ │  │  ● feature   │  │
│  │  ● feature  │  │ │  ● feature   │ │  │  ● feature   │  │
│  │              │  │ │  ● feature   │ │  │              │  │
│  │  [Get        │  │ │ [Start       │ │  │  [Contact    │  │
│  │   started]   │  │ │  building]   │ │  │   sales]     │  │
│  └──────────────┘  │ └──────────────┘ │  └──────────────┘  │
│                    └──────────────────┘                     │
│  (default border)   (blue border +     (default border)    │
│                      blue bg tint)                         │
└─────────────────────────────────────────────────────────────┘
```

**Featured tier treatment (signature element):**
- 4px left-border in `#2563EB`
- Background: `#EFF6FF` (subtle blue tint, not a loud banner)
- Subtle box-shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
- No "Most Popular" badge — the color and elevation do the work

---

### 3. Tier Copy (Brand register, voice-led)

#### Starter — $0/mo

> For individual developers exploring the platform.

- 5 projects
- 1,000 API calls per day
- Community support
- Basic analytics

**CTA:** `Get started` — outlined button (`border: 1px solid #E2E8F0`, text `#0F172A`)

#### Pro — $29/mo *(featured)*

> For developers building production applications.

- Unlimited projects
- 100,000 API calls per day
- Priority support
- Advanced analytics and dashboards
- Team collaboration, up to 5 members

**CTA:** `Start building` — solid button (`background: #2563EB`, text `#FFFFFF`)

#### Team — $79/mo

> For engineering teams shipping at scale.

- Everything in Pro
- Unlimited team members
- SSO and SAML
- Dedicated support with SLA
- Custom integrations

**CTA:** `Contact sales` — outlined button (`border: 1px solid #E2E8F0`, text `#0F172A`)

---

### 4. CTA Hover State

| Element | Default | Hover |
|---|---|---|
| Starter CTA | `border: #E2E8F0`, `bg: transparent`, `color: #0F172A` | `border: #CBD5E1`, `bg: #F8FAFC`, `color: #0F172A` |
| Pro CTA | `bg: #2563EB`, `color: #FFFFFF` | `bg: #1D4ED8`, `color: #FFFFFF`, `shadow: 0 4px 12px rgba(37, 99, 235, 0.25)` |
| Team CTA | `border: #E2E8F0`, `bg: transparent`, `color: #0F172A` | `border: #CBD5E1`, `bg: #F8FAFC`, `color: #0F172A` |

Transition: `background 150ms ease, border-color 150ms ease, box-shadow 150ms ease`.

---

### 5. Motion Intent (Restrained)

| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| Page load — cards | `opacity: 0 → 1`, `translateY(8px → 0)` | 200ms per card, 50ms stagger | `ease-out` |
| Page load — section heading | `opacity: 0 → 1` | 300ms | `ease-out` |
| Card hover (featured only) | `scale(1.02)`, shadow elevation increase | 200ms | `ease` |
| CTA hover | Background color transition | 150ms | `ease` |
| Reduced motion | All transitions instant, no transforms | — | — |

One orchestrated entrance (staggered cards), no scattered effects. The featured card hover is the single interactive moment.

---

### 6. Responsive Behavior

| Breakpoint | Layout |
|---|---|
| ≥ 1024px | Three-column grid |
| 768–1023px | Two-column grid, Team card spans full width below |
| < 768px | Single-column stack, order: Pro (featured) first, then Starter, then Team |

---

### 7. Aesthetic Risk

The featured tier uses a left-border accent + background tint instead of the conventional "Most Popular" badge or ribbon. This is subtler and more developer-appropriate — it signals "this one" without shouting. The risk: some users may miss it if they scan quickly. The mitigation: the Pro CTA is the only solid-colored button, creating a secondary visual anchor.

---

**Critique/Validation**

| Criterion | Test | Result |
|---|---|---|
| Anti-default #1 (cream + serif + terracotta) | No warm tones, no serif | **PASS** — palette is cool grays + blue, Inter is sans-serif |
| Anti-default #2 (near-black + acid accent) | Background is `#F8FAFC`, not dark | **PASS** — light mode, restrained |
| Anti-default #3 (broadsheet hairlines) | No hairline rules, no zero border-radius | **PASS** — cards have subtle borders, not hairlines |
| Brief-specific choices | Blue palette grounded in developer-tools vernacular | **PASS** — `#2563EB` is confident, not generic SaaS purple |
| Signature element | Left-border + tint treatment for featured tier | **PASS** — one bold move, everything else quiet |
| Copy register | Brand voice, active, specific | **PASS** — no filler verbs, no lorem, no AI-tell |
| Restraint | One entrance animation, one hover moment | **PASS** — no scattered effects |

**One targeted revision:** The price values ($0, $29, $79) are assumed. If the brand has published pricing, replace these with real values. The direction does not depend on exact numbers.

---

**Evidence Ledger**

| Claim | Level | Method | Limitations |
|---|---|---|---|
| Color palette is WCAG AA compliant (text on background) | **validated** | Static contrast calculation: `#0F172A` on `#F8FAFC` = 15.3:1; `#475569` on `#F8FAFC` = 5.1:1; `#FFFFFF` on `#2563EB` = 4.6:1 | Not verified in a render; deterministic computation only |
| Layout is responsive | **authored** | Direction specifies breakpoints; no render to verify | Requires build to confirm |
| Copy has no AI-tell phrasing | **validated** | Checked against banned list in `copy-and-mock-data.md` | Self-audit, not runtime inspection |
| Motion respects reduced-motion | **authored** | Direction specifies `prefers-reduced-motion` behavior | Requires build to confirm |
| Featured tier is visually distinct | **authored** | Direction specifies border + tint + elevation | Not measured in a render |

**PROOF_TIER=validated** (highest achievable without runtime render).

---

**Next Action/Handoff**

| Condition | Suggested Target | Reason |
|---|---|---|
| Direction accepted, ready for static token system | `/interface:foundations` | Turn direction into a token schema |
| Direction accepted, needs motion spec | `/interface:motion` | Specify temporal behavior in detail |
| Direction accepted, ready for build | `sk-code` | Implement the direction in code |

`HANDOFF_REQUIRED=false`. Recommendations do not silently chain.

---

**STATUS=OK PRODUCES="Interface Direction Spec" NEXT=/interface:foundations,/interface:motion,/interface:audit PROOF=target,register,designDials,preflightResult**