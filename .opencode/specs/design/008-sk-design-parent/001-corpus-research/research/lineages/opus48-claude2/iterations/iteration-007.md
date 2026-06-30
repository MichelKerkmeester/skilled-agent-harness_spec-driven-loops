# Iteration 7: impeccable as the parent-shaped flagship — hub anatomy and the pin bridge

## Focus
Read impeccable.md in full to lock the flagship interface/taste child and to learn what the corpus hub owns vs delegates — the template for how a design parent can be structured.

## Findings

### F27 — impeccable is a complete HUB-with-nested-mode-packets skill (the parent template)
Its anatomy is exactly a parent skill:
- **Shared setup (loaded once/session):** `context.mjs` prints PRODUCT.md/DESIGN.md; read the invoked sub-command's `reference/<command>.md`; familiarize with the project's design system; read the register reference (`reference/brand.md` for marketing, `reference/product.md` for app UI); `palette.mjs` for brand-new projects. [SOURCE: external/impeccable.md:13-21]
- **One shared rule base for all modes:** General rules (Color contrast/gray-on-color; Typography line-length/pairing/hero-ceiling/tracking-floor/text-wrap; Layout spacing/cards-lazy/flex-vs-grid/auto-fit/z-index; Motion ease-out/reduced-motion/materials; Interaction), **per-executor `<codex>`/`<gemini>` rule overrides**, **Absolute bans** (side-stripe borders, gradient text, glassmorphism, hero-metric, identical card grids, eyebrows, numbered markers, text-overflow + codex/gemini-specific bans), and the **AI slop test** (first-order + second-order category-reflex checks). [SOURCE: external/impeccable.md:27-117]
- **23 nested commands grouped by category** each with a `reference/<command>.md`: Build (craft, shape, init, document, extract), Evaluate (critique, audit), Refine (polish, bolder, quieter, distill, harden, onboard), Enhance (animate, colorize, typeset, layout, delight, overdrive), Fix (clarify, adapt, optimize), Iterate (live). [SOURCE: external/impeccable.md:119-146]
- **A context-aware router:** no-arg → run `context-signals.mjs` and recommend the 2–3 highest-value commands; first-word-match → load that reference; intent-match → load the mapped command; else general design. [SOURCE: external/impeccable.md:149-168]

### F28 — `pin`/`unpin` is the hub↔sibling bridge (lazy promotion to top-level shortcuts)
"**Pin** creates a standalone shortcut so `{{command_prefix}}<command>` invokes `{{command_prefix}}impeccable <command>` directly… The script writes to every harness directory present in the project." This means a hub can keep modes nested by default *and* promote hot modes to first-class shortcuts on demand — a migration path between the hub and umbrella models without re-architecting. [SOURCE: external/impeccable.md:174-182]

### F29 — Selective reference loading is how the hub controls context cost
impeccable never loads all 23 references; setup loads only the invoked command's `reference/<command>.md` plus the matched register reference. This directly answers the hub's main objection (co-loading everything inflates context): a hub with a small always-on base + lazily-loaded per-mode references gets umbrella-like lazy loading while keeping one identity. [SOURCE: external/impeccable.md:17-19], [SOURCE: external/impeccable.md:164]

### F30 — impeccable IS the matured interface/taste child AND the parent template (dual role)
impeccable's identity — "Designs and iterates production-grade frontend interfaces. Real working code, committed design choices, exceptional craft" — is the same identity as the existing `sk-design-interface` (distinctive, intentional, anti-templated UI with brainstorm-critique-build + interface writing). So the corpus offers impeccable as BOTH (a) the content of the flagship interface child and (b) the structural template for the sk-design parent. Its Enhance category (animate=motion, colorize=color, typeset=typography, layout=layout) is mode-first/domain-second — evidence that operations can be modes inside a domain child or category. [SOURCE: external/impeccable.md:11], [SOURCE: .opencode/skills/sk-design-interface/SKILL.md]

## Sources Consulted
- `external/impeccable.md` (full: setup, general rules, bans, slop test, 23-command table, routing, pin/unpin, hooks).
- `.opencode/skills/sk-design-interface/SKILL.md` (description: distinctive UI design, brainstorm-critique-build, interface writing).
- `external/taste-skill.md` (anti-slop frontend family context from iter 1; same core as impeccable).

## Assessment
- **newInfoRatio: 0.55** — impeccable's full hub anatomy, the pin bridge (F28), selective-loading answer to context cost (F29), and the dual child/parent role (F30) are new and high-value; many individual rules overlapped baseline/stitch.
- **Novelty justification:** Provides a concrete, in-corpus parent template and the mechanisms (selective loading + pin) that neutralize the hub model's main downsides — central to the KQ6 recommendation.
- **Confidence:** High — entirely from the full read of impeccable.md.

## Reflection
- **Worked:** Reading the hub end-to-end revealed the mechanisms (selective reference loading, pin promotion) that make the hub-vs-umbrella tradeoff far less binary.
- **Insight:** impeccable being both a child candidate and a parent template is the crux — sk-design should likely *adopt impeccable's structure* (hub + nested mode packets + shared base + router) at the family level.
- **Ruled out:** A hub that co-loads all children at once — impeccable proves selective per-mode loading is the norm.
- **Ruled out:** Treating impeccable's 23 commands as 23 children — they are modes/packets grouped into ~6 categories.

## Recommended Next Focus
Iteration 8: Examine the repo's OWN parent-skill conventions (create:sk-skill-parent, deep-loop-workflows umbrella, sk-code smart-router) and the existing sk-design-interface + sk-design-md-generator SKILL.md to ground the structural recommendation in local convention and start KQ7 (onboarding/compat).
