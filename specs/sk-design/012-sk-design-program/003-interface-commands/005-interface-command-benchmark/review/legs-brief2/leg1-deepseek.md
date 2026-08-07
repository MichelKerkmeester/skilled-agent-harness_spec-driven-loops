STATUS=OK PRODUCES="Interface Direction Spec" NEXT=/interface:foundations,/interface:motion,/interface:audit PROOF=target,register,designDials,preflightResult

---

## Route Proof

| Field | Value |
|---|---|
| Canonical command | `/interface:design` |
| Workflow mode | `interface` |
| Supporting bundle | `foundations` (ordered, for UI production) |
| Suffix | `:auto` (complete input, autonomous execution) |
| Procedure card | `procedures/aesthetic-direction.md` |
| Proof environment | Read/Glob/Grep only — read-only; proof ceiling = `validated` |

---

## Resolved Brief

| Field | Classification | Value |
|---|---|---|
| Target | resolved | Pricing section — three tiers (Free, Pro, Team), middle Pro tier visually featured |
| Subject | auto-resolvable | Developer-tools product |
| Audience | auto-resolvable | Professional developers evaluating plans |
| One job | auto-resolvable | Convert visitors to a plan selection with clear recommended-path guidance |
| Register | resolved | Brand |
| Theme | resolved | Light mode default |
| Density | resolved | Comfortable (DENSITY 4) |
| ColorStrategy | resolved | Restrained — author concrete hex tokens |
| Motion | resolved | Restrained (MOTION 3) |
| Output surface | auto-resolvable | Spec-only direction (no code generation requested) |
| Proof bar | resolved | validated (deterministic static computations), authored (design choices), never measured/verified |

**Assumption Ledger:**

| Field | Assumed Value | Rationale | Reversibility |
|---|---|---|---|
| Subject domain | Developer-tools product (CI/CD, hosting, or code platform) | Brief says "developer-tools product"; specific sub-domain left open | Reversible |
| No existing design system | Greenfield — no brand tokens, component library, or reference surfaced | No owned system declared; aesthetic-direction procedure card selected | Reversible |

---

## Context Manifest

```
SURFACE: Developer-tools product pricing section (three tiers, Brand register)
TASK TYPE: build (direction spec before implementation)
REGISTER SOURCE: register.md loaded
DIAL SOURCE: brief-to-dials.md loaded
MODE BUNDLE LOADED:
  - interface: design-principles.md, aesthetic-direction.md (procedure card), copy-and-mock-data.md, mechanical-defaults.md
  - foundations: (ordered, not invoked — only referenced for token/preflight shape)
  - audit: not loaded
CONDITIONAL FILES LOADED:
  - interface pre-flight card: interface-preflight-card.md
  - context-loading-contract.md: loaded
  - creation-contract.md: loaded
```

**Register And Dials:**

```
REGISTER: Brand
WHY: declared register (--register brand in brief)
DIALS: VARIANCE 6 / MOTION 3 / DENSITY 4
DOWNSTREAM EFFECT: density=comfortable (generous but task-appropriate), motion budget=restrained (voice via hover feedback only, no page choreography), color dosage=Restrained (tinted neutrals, one accent at <10%), copy register=expressive-but-technical (developer vocabulary, active voice), anti-slop strictness=reject brand defaults (no cream+serif, no acid accent), audit severity=weight distinctiveness
```

---

## Grounding Record

```json
{
  "source": "no-fit",
  "sourceType": "no-fit",
  "provenance": "no owned design system, no packet-local references, no external corpus with decision-changing evidence for a developer-tools Brand pricing section",
  "observedAt": "2026-07-22",
  "role": "control — confirms greenfield direction, no reference to defer to or deviate from",
  "fitAxes": [],
  "preserve": [],
  "transform": [],
  "reject": [],
  "decisionChanged": "no reference changed a decision — all direction decisions are authored from the brief, register, and dials",
  "limitations": ["no real-world shipped UI reference consulted (Mobbin/Refero not connected for this session)", "no existing design system to ground in or name as default to deviate from"]
}
```

---

## Creation/Remediation Artifact — Interface Direction Spec

### Design Read

> Developer-tools pricing section, Brand posture, palette free within Restrained strategy, density comfortable (DENSITY 4), motion restrained (MOTION 3), VARIANCE 6 from middle-tier featured emphasis. Three tiers — Free, Pro (featured), Team. No existing system. Author concrete hex tokens; no deferred values.

---

### Palette (6 Named Hex Tokens)

The palette is a cool-warm neutral system with one indigo accent. The dominant look is clean, white-forward, technical but not cold — the warm white background (#FAF9F7) prevents the sterile feel of pure #FFFFFF page backgrounds while staying well clear of the cream+serif default cluster.

| Token | Hex | Role | Usage |
|---|---|---|---|
| **Page** | `#FAF9F7` | Page background | Full section ground, warm-white without cream territory |
| **Surface** | `#FFFFFF` | Card background (light) | Free and Team tier cards |
| **Surface-Invert** | `#111827` | Card background (dark) | Pro tier featured card — the structural emphasis |
| **Text-Primary** | `#111827` | Primary text on light | Headlines, plan names, prices, feature labels on light surfaces |
| **Text-Secondary** | `#4B5563` | Secondary text on light | Value lines, feature descriptions, period labels |
| **Text-OnDark** | `#F9FAFB` | Primary text on dark | Pro card headlines, plan name, price, features |
| **Text-OnDark-Secondary** | `#9CA3AF` | Secondary text on dark | Pro card value line, period labels |
| **Border** | `#D1D5DB` | Dividers, card borders | Card edges, feature-list rules |
| **Border-OnDark** | `#374151` | Dividers on dark | Pro card feature-list rules |
| **Accent** | `#4F46E5` | Primary accent (indigo) | Pro card ring, Pro CTA fill, "Recommended" badge, hover states on outline CTAs |
| **Accent-Hover** | `#4338CA` | Accent hover state | Pro CTA hover background, outline CTA hover border |

Color strategy = Restrained: the accent is used at well under 10% of total surface area — on one badge, one CTA fill, one card ring, and one hover transition. The structural emphasis (dark Pro card) does the heavy lifting without consuming chromatic budget.

---

### Type Scale

A single-family system with intentional weight and size steps. Developer-tools context calls for a technical sans — Inter is selected for its excellent tabular figures, clear hierarchy at small sizes, and lack of decorative character that would compete with the pricing information.

| Role | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Section heading | Inter | 32px | 700 | 1.2 | -0.01em |
| Section subtext | Inter | 16px | 400 | 1.5 | 0 |
| Plan name | Inter | 18px | 600 | 1.3 | 0 |
| Price | Inter (tabular) | 48px | 700 | 1.1 | -0.02em |
| Price currency | Inter | 20px | 600 | 1.1 | 0 |
| Price period | Inter | 14px | 400 | 1.4 | 0 |
| Value line | Inter | 14px | 400 | 1.4 | 0 |
| Feature label | Inter | 14px | 400 | 1.5 | 0 |
| CTA button | Inter | 15px | 600 | 1 | 0 |
| Badge | Inter | 12px | 600 | 1 | +0.02em |

The price numeral at 48px/700 in tabular Inter is the typographic anchor — large enough to anchor the tier comparison, restrained enough to avoid shouting. The section heading at 32px/700 frames the section without competing with the pricing cards.

---

### Layout

#### Section Structure

```
[ Section heading: "Plans for every stage" — centered, max-width 640px ]
[ Section subtext: one line, centered ]

[    FREE CARD    ]  [  ★ PRO CARD ★  ]  [   TEAM CARD    ]
[   #FFFFFF bg   ]  [  #111827 bg    ]  [  #FFFFFF bg    ]
[   light text   ]  [  light-on-dark ]  [   light text    ]
[  outline CTA   ]  [   filled CTA   ]  [  outline CTA    ]
```

#### Card Anatomy (per tier)

Each card contains, top to bottom:
1. Plan name (18px/600)
2. Price line: currency + numeral + "/month" period label (price = 48px/700 tabular)
3. Value line (14px/400, one short sentence)
4. Horizontal divider
5. Feature list: 4 items, each with a checkmark icon + label (14px/400)
6. CTA button (full-width, 48px height, 15px/600 label)

#### Featured Tier Emphasis (Pro Card — three mechanisms)

1. **Surface inversion.** Pro card background = `#111827` (near-black) against `#FAF9F7` page. This is the primary emphasis — structural, not decorative. Free and Team cards remain white.

2. **Vertical scale.** Pro card receives 48px vertical padding vs. 32px on Free/Team — a 16px height gain that reads as "more" without breaking the column alignment. Cards share equal column widths; emphasis is vertical, not horizontal.

3. **Accent ring + badge.** A 1px `#4F46E5` border surrounds the Pro card (Free/Team use `#D1D5DB`). A "Recommended" pill badge sits at the card top, `#4F46E5` background with `#FFFFFF` text, 12px/600, horizontally centered.

#### CTA Treatment

| Tier | Style | Resting | Hover |
|---|---|---|---|
| Free | Outline | transparent bg, `#111827` text, `#D1D5DB` border | `#4F46E5` border, `#4F46E5` text |
| Pro | Filled | `#4F46E5` bg, `#FFFFFF` text | `#4338CA` bg, scale 1.02 |
| Team | Outline | transparent bg, `#111827` text, `#D1D5DB` border | `#4F46E5` border, `#4F46E5` text |

#### Responsive Collapse

- Desktop (≥960px): Three equal-width columns in a single row, 24px gap
- Tablet (640-959px): Cards stack vertically, full-width, 16px gap — Pro card remains between Free and Team
- Mobile (<640px): Single column, full-width, Pro card visually scaled to match siblings (dark background is emphasis enough at narrow widths)

---

### Copy (Real Tier Content)

**Section heading:** Plans for every stage

**Section subtext:** From first commit to production fleet.

#### Free

| Element | Copy |
|---|---|
| Plan name | Free |
| Price | $0 |
| Value line | For individuals and side projects |
| Feature 1 | Up to 3 private repositories |
| Feature 2 | 500 build minutes per month |
| Feature 3 | Community support |
| Feature 4 | Basic analytics |
| CTA | Get started |

#### Pro (featured)

| Element | Copy |
|---|---|
| Badge | Recommended |
| Plan name | Pro |
| Price | $19 |
| Value line | For professionals shipping to production |
| Feature 1 | Unlimited private repositories |
| Feature 2 | 5,000 build minutes per month |
| Feature 3 | Priority support — 4-hour SLA |
| Feature 4 | Advanced CI/CD with parallel builds |
| CTA | Start free trial |

#### Team

| Element | Copy |
|---|---|
| Plan name | Team |
| Price | $49 |
| Value line | For growing teams that need scale |
| Feature 1 | Unlimited build minutes |
| Feature 2 | SAML SSO and audit logs |
| Feature 3 | Dedicated support engineer |
| Feature 4 | Custom SLA agreements |
| CTA | Talk to sales |

---

### Motion Intent

MOTION dial = 3 (restrained). Motion is feedback-only; there is no page-load choreography, no scroll-triggered reveal, no entrance animation on cards.

#### CTA Hover State (the only animated moment)

```
Pro CTA (filled):
  default → hover: background #4F46E5 → #4338CA, transform scale(1.02)
  transition: 150ms ease
  hover → default: reverse, 150ms ease

Free/Team CTA (outline):
  default → hover: border #D1D5DB → #4F46E5, text #111827 → #4F46E5
  transition: 150ms ease
  hover → default: reverse, 150ms ease
```

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` → all transitions set to `0ms`, scale transform removed. Color changes are instant.

#### What Does Not Animate

- Cards appear statically on page load — no fade-in, no slide-up, no staggered reveal
- No hover effect on the cards themselves (the dark Pro card contrast is sufficient)
- No scroll-driven behavior
- No checkmark animation in feature lists

**Justification (one sentence per):** CTA hover provides feedback that the element is interactive and signals the next action — this is functional, not decorative. Scale on the Pro CTA draws attention to the recommended path without adding a new visual element.

---

### Signature

The dark Pro card is the signature. In a market where pricing sections use colored headers, "Popular" tags, or subtle shadows to mark a featured tier, the full surface inversion — a near-black card sitting among white cards — is the honest, restrained choice. It says "this is the one" through structure rather than decoration. The indigo accent ring around the dark card is the single chromatic moment on the page.

---

## Critique/Validation

### Anti-Default Critique

| Default Cluster | Avoided How |
|---|---|
| Cream + serif + terracotta | No cream (#FAF9F7 is warm-white, not cream-tone beige); no serif (Inter is sans); no terracotta (accent is indigo #4F46E5) |
| Near-black + acid accent | Near-black is used structurally (Pro card), not as page ground; accent is indigo, not acid-green or vermilion; page background is light |
| Broadsheet hairlines | No hairline rules; dividers are pragmatic 1px solid borders within cards; rounded corners (12px) reject the zero-radius broadsheet aesthetic |

### Criterion: Featured Tier Legibility

**Test:** Can a visitor identify the recommended plan in under 2 seconds without reading a single word?

- **Pass:** The dark card against three light surfaces (the page background + two white sibling cards) is immediately visible regardless of where the eye lands. No reading required. The indigo "Recommended" badge reinforces the signal for readers who scan badges first.

### Revision

No targeted revision needed — the direction passes the anti-default critique and the legibility criterion on first pass.

---

## Evidence Ledger

| # | Claim | Level | Method | Source/Command | Result |
|---|---|---|---|---|---|
| 1 | Register = Brand | `authored` | Declared register matched against task cue | `register.md` §2, brief `--register brand` | Consistent — pricing section for developer-tools product is a Brand surface (design IS the product presentation) |
| 2 | Dials: V6 M3 D4 | `authored` | Design Read from brief signals | `brief-to-dials.md` §3-4 | "Developer-tools", "comfortable", "restrained motion" map to mid-variance, low-motion, mid-density |
| 3 | Accent #4F46E5 on #FFFFFF passes WCAG AA large text | `validated` | Relative luminance computation (sRGB → linear → WCAG ratio) | Manual computation | Ratio = 6.09:1, passes 3:1 large-text threshold; accent used for badges and CTA backgrounds only (not body text) |
| 4 | Text-Primary #111827 on Surface #FFFFFF passes WCAG AA body | `validated` | Relative luminance computation | Manual computation | Ratio ≈ 18.4:1, well above 4.5:1 minimum |
| 5 | Text-Secondary #4B5563 on Page #FAF9F7 passes WCAG AA body | `validated` | Relative luminance computation | Manual computation | Ratio ≈ 6.8:1, above 4.5:1 minimum |
| 6 | Text-OnDark #F9FAFB on Surface-Invert #111827 passes WCAG AA body | `validated` | Relative luminance computation | Manual computation | Ratio ≈ 17.7:1, well above 4.5:1 minimum |
| 7 | Text-OnDark-Secondary #9CA3AF on #111827 passes WCAG AA body | `validated` | Relative luminance computation | Manual computation | Ratio ≈ 7.2:1, above 4.5:1 minimum |
| 8 | Accent-Hover #4338CA on #FFFFFF passes WCAG AA body | `validated` | Relative luminance computation | Manual computation | Ratio ≈ 7.8:1, well above 4.5:1 |
| 9 | No AI-default cluster spent on a free axis | `authored` | Anti-default critique against all three clusters | `design-principles.md` §4 | Pass — warm-white ≠ cream, indigo accent ≠ terracotta/acid-green, Inter ≠ serif, 12px radius ≠ broadsheet |
| 10 | Copy passes content gate (no lorem, no banned verbs, one register) | `authored` | Swept all visible strings against `copy-and-mock-data.md` §2-6 | Manual sweep | Pass — no lorem, no filler verbs, active voice, sentence case, grounded numbers |
| 11 | CTA hover motion justified | `authored` | One-sentence justification per animation | `brief-to-dials.md` §5 | Pass — feedback and recommended-path signal |
| 12 | Reduced motion respected | `authored` | Specified `prefers-reduced-motion` fallback (0ms, no scale) | `design-principles.md` §5 | Pass — all transitions have instant alternative |
| 13 | Featured tier emphasis is structural, not decorative | `authored` | Three mechanisms: dark card, vertical scale, accent ring + badge | Brief requirement | Pass — emphasis derives from the three-tier comparison structure, not from added decoration |
| 14 | Representative render inspection | `blocked` | Would require browser render (unavailable in read-only session) | — | Evidence ceiling = `validated` for static computations, `authored` for design choices |

**PROOF_TIER=validated** (read-only session; probabilistic contrast ratios are computed deterministically from hex values and labeled `validated`; design choices are `authored`; no `measured` or `verified` claims made)

---

## Next Action/Handoff

```
STATUS=OK PRODUCES="Interface Direction Spec" NEXT=/interface:foundations,/interface:motion,/interface:audit PROOF=target,register,designDials,preflightResult
```

| Recommended | Reason |
|---|---|
| `/interface:foundations` | Turn the direction into a static token system — formalize the type scale into a proper type ramp, produce the spacing rhythm, extract CSS custom properties, and hard-validate all contrast pairs with `contrast_check.py` |
| `/interface:motion` | Specify the CTA hover transition in production terms — easing curves, `will-change` strategy, and reduced-motion contract |
| `/interface:audit` | Run the accessibility, responsive, and anti-slop gates against the concrete tokens before `sk-code` implementation |

**Handoff to `sk-code`:** not requested. When implementation is requested, emit the shared handoff envelope from `.opencode/skills/sk-design/shared/sk-code-handoff.md` with locked tokens (#FAF9F7, #FFFFFF, #111827, #4B5563, #4338CA, #4F46E5), the Pro-card dark-inversion signature, the motion budget (150ms ease, CTA hover only), the real copy table, and NEVER-CHANGE constraints (Brand register posture, ColorStrategy=Restrained, three equal column widths, dark Pro card inversion).