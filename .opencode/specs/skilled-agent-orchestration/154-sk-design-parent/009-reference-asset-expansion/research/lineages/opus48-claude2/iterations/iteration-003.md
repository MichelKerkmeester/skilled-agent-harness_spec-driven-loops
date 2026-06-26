# Iteration 3: design-motion expansion matrix

## Focus
Assess `design-motion` against emil advanced interaction/gesture craft (08e), overdrive advanced rendering (06), and gpt-taste motion overlap; produce its matrix entry.

## Findings

### F3.1 — Gesture basics are already covered; the real 08e gap is emil's frequency-decision gate [confirmed]
`micro_interactions.md` §4 already covers gesture fundamentals: drag lift + target feedback + rollback, swipe thresholds, accessible alternatives, and `bounce:0` springs [SOURCE: design-motion/references/micro_interactions.md:61-66,52]. So gap 08e is NOT "add gestures." The distinctive, missing emil contribution is the **Animation Decision Framework** — a *frequency-gated restraint gate*: 100+/day (keyboard shortcuts, command palette) = **never animate**; tens/day = drastically reduce; occasional (modals/drawers/toasts) = standard; rare/first-time = may add delight; plus "never animate keyboard-initiated actions" [SOURCE: external/emil-design-eng.md:62-79]. `motion_strategy.md` has a *purpose* table (feedback/transition/etc.) but not the *frequency→animate-or-not* gate [SOURCE: design-motion/references/motion_strategy.md:40,67]. This is a high-leverage anti-slop restraint addition.

### F3.2 — Emil carries specific craft details not fully distilled [confirmed, should/nice]
Beyond `make-interfaces-feel-better`'s already-distilled `scale-on-press` / `bounce:0` / never-`transition:all` [SOURCE: design-motion/references/corpus_map.md:44], emil adds: popover `transform-origin` from its trigger (radix var) vs modals staying centered, `:active` scale(0.97) press, and `scale(0.95)+opacity` instead of `scale(0)` ("nothing appears from nothing"), plus the Before/After review-table craft format [SOURCE: external/emil-design-eng.md:42-48]. These are concrete top-ups to `micro_interactions.md`.

### F3.3 — overdrive is a real but propose-first, nice-to-have advanced-rendering source [confirmed, nice]
`overdrive` pushes interfaces past conventional limits (View Transitions morph-from-trigger, virtual-scroll 100k rows, GPU/Canvas/WebGL for data, spring drag-and-drop) but mandates **propose-before-building** and browser-automation iteration, and is explicitly context-gated ("a particle system on a settings page is embarrassing") [SOURCE: external/overdrive.md:13-55]. Gap 06 is nice-to-have [SOURCE: gap-analysis.md:30]. It overlaps interface (visual ambition) and audit (performance), so it must be bounded.

### F3.4 — Motion ships zero assets; a motion-plan card is the natural first asset [inferred]
Like interface/foundations, motion has references but **0 assets**. A fill-in per-element motion plan (purpose + frequency-decision + timing/easing + reduced-motion fallback) would operationalize the decision framework. Nice-to-have.

## Prioritized Additions (design-motion)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|----|------|-------|--------------------------|----------------|--------|
| MO-R1 | reference | `references/animation_decision_framework.md` (or a `motion_strategy.md` section) — frequency-gated "should this animate at all?" | Adds the missing restraint gate: 100+/day = never animate, never animate keyboard-initiated actions, tens/day = reduce. The strongest anti-slop motion lever; complements the existing purpose table. | emil-design-eng (Animation Decision Framework, §1–2) | S–M |
| MO-R2 | reference | advanced-craft top-up to `micro_interactions.md` | popover transform-origin-from-trigger vs centered modals, `:active` scale(0.97), `scale(0.95)+opacity` over `scale(0)`, Before/After review-table craft format. | emil-design-eng | S |
| MO-R3 | reference | `references/advanced_rendering.md` — propose-first advanced technique toolkit | View Transitions morph-from-trigger, virtual scroll, GPU/Canvas for data, spring drag-and-drop — bounded by overdrive's propose-before-building discipline. Nice-to-have. | overdrive; gpt-taste (GSAP); emil | M |
| MO-A1 | asset | `assets/motion_plan_card.md` — fill-in per-element motion plan | Operationalizes MO-R1: each animated element states purpose + frequency-decision + timing/easing + reduced-motion fallback. First motion asset. Nice-to-have. | emil; motion_strategy | M |

## Do-NOT-add (design-motion)
- **Gesture basics** — already in `micro_interactions.md` §4 (drag/swipe/thresholds/accessible alternatives). [if-effective bar: redundant]
- **gpt-taste GSAP scroll paradigms as default mandates** — interface-ambition-specific and contradict motion restraint; admit them only inside MO-R3 as optional, propose-first techniques.
- **Motion-performance REVIEW content** — owned by `audit` (motion build vs motion review is the existing, correct boundary) [SOURCE: design-motion/references/corpus_map.md:46].
- **emil's "Initial Response" identity framing** — a standalone-skill persona artifact, not transferable craft.
- **A separate `design-interaction` child (gap 15)** — net-new sub-skill; out of scope.

## Sources Consulted
- `.opencode/skills/sk-design/design-motion/references/{micro_interactions,motion_strategy,corpus_map}.md` (grep)
- `external/emil-design-eng.md` (lines 1–90), `external/overdrive.md` (head)
- `gap-analysis.md` rows 08e, 06, 15

## Assessment
- **newInfoRatio: 0.6** — Motion is well-covered, so most additions are top-ups; the genuinely new, high-leverage finding is the emil frequency-decision gate (MO-R1). Zero-assets and restraint patterns are now recurring across modes.
- **Novelty justification:** Reframes 08e from "add gestures" (already covered) to "add the frequency-decision restraint gate" — a sharper, higher-leverage target.
- **Confidence:** High on coverage (grep + corpus_map); High on MO-R1 value; Medium on MO-R3 scope.

## Reflection
- **Worked:** Grepping the live motion refs first prevented recommending already-covered gesture basics; reading emil surfaced the true gap.
- **Ruled out:** gesture basics; motion-performance review (audit's surface); emil persona framing.
- **Failed:** nothing.

## Recommended Next Focus
Iteration 4: `design-audit` — the densest expansion target (model-tells 07, remediation 11, mock-content N1, layout pre-flight gate N2, 7-lens critique 16, transform verbs 04); produce its matrix entry.
