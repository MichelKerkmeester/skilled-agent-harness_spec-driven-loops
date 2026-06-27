---
title: "Deep Research Report: make-interfaces-feel-better corpus → sk-design improvements"
description: "Canonical synthesis of a 3-iteration GPT-5.5-xhigh deep-research lineage that studied the external make-interfaces-feel-better skill corpus and produced a prioritized, corpus-traced and target-traced improvement backlog for sk-design and its five modes plus the shared register. Research only; no live sk-design changes."
trigger_phrases:
  - "make-interfaces-feel-better sk-design research"
  - "mifb design improvement backlog"
  - "external design corpus sk-design adoption"
  - "sk-design technique adoption research"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research"
    last_updated_at: "2026-06-27T08:45:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized the converged 3-iteration research deliverable"
    next_safe_action: "Build phase adopts backlog priorities 1-8 plus the shared-path doc fix"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-022-mifb-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Deep Research Report: make-interfaces-feel-better corpus → sk-design improvements

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. EXECUTIVE SUMMARY

A single GPT-5.5-xhigh deep-research lineage (cli-codex executor, three iterations, converged at the iteration cap with newInfoRatio 0.82 → 0.64 → 0.43) studied the external `make-interfaces-feel-better` (MIFB) skill corpus and mapped it against the live `sk-design` family to answer one question: what is genuinely worth adopting, where does it land, and what would only add bloat?

**The takeaway:** MIFB is not a replacement for `sk-design` — it contributes compact, prescriptive *micro-craft* that `sk-design` either lacks or currently phrases too broadly. The genuinely net-new, high-value items are few and small: concentric border-radius math, pure-rgba image-edge outlines, root-only macOS font smoothing, and a handful of audit detectors that convert subtle polish failures into reviewable checks. Most of MIFB's *motion* guidance is already encoded in `design-motion` (interruptible transitions, `AnimatePresence initial={false}`, press-scale `0.96`, zero-bounce springs) — there the only real gap is the contextual icon-swap CSS fallback plus a couple of escape hatches.

**The single highest-leverage home is `design-foundations`, with `design-audit` as its enforcement pair.** Most adoptable craft is a foundations rule first, then an audit detector that makes it reviewable. The hub stays logic-free; nothing routes into it.

This phase changed no live `sk-design` content. Every item below routes to a future build phase.

---

## 2. SCOPE AND METHOD

- **Question:** Which MIFB techniques are net-new vs already covered by `sk-design`; the correct home + minimal edit for each adoptable one; which to rule out; and a prioritized backlog.
- **Executor:** `cli-codex`, model `gpt-5.5`, reasoning `xhigh`, service tier `fast` (ChatGPT OAuth). 3 iterations, externalized JSONL state, reducer-synced registry/dashboard/strategy.
- **Inputs (read-only):**
  - Corpus: `../external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/{SKILL.md, surfaces.md, typography.md, animations.md, performance.md}`.
  - Targets: `.opencode/skills/sk-design/` hub + `mode-registry.json` + the five mode packets (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) + the shared base (`shared/`).
- **Iteration arc:** (1) corpus technique inventory + initial coverage hypothesis; (2) deep-read targets for exact anchors + Q3 conflict analysis; (3) prioritized backlog + per-mode rollup + do-not list.
- **Verification:** the orchestrator independently read all five corpus files and the most-cited sk-design targets; spot-checks confirmed the lineage's citations are accurate (ghost-card tell at `ai_fingerprint_tells.md:38`, over-rounded-card detector at `:46`, tinted-neutral token rule at `token_starter.md:38`, interruptible-transition + zero-bounce spring at `micro_interactions.md:50`, `initial={false}` at `animate_presence_patterns.md:43`, and the stale `references/` vs real `shared/` shared-base path).

---

## 3. CURRENT STATE (coverage baseline)

`sk-design` already encodes most of the *temporal* craft MIFB teaches and a good portion of the *typographic* and *audit* craft. The gaps cluster in **surface micro-craft** (nested radius math, image-edge outlines, shadow-vs-border depth discipline) and in **audit enforcement** (turning subtle polish rules into reviewable detectors). The corpus's most prescriptive numeric recipes (exact `scale(0.96)`, `bounce: 0`, `initial={false}`, no `transition: all`) are *already* `sk-design` posture — they are reinforcement, not new doctrine.

---

## 4. CORPUS TECHNIQUE INVENTORY (16 techniques)

Source shorthand `external/` = the MIFB corpus dir. Grouped by corpus file.

| # | Technique | Gist | Corpus source |
|---|-----------|------|---------------|
| 1 | Concentric border radius | `outer = inner + padding` for close nested surfaces; separate layers when padding > 24px | `surfaces.md:5-13` |
| 2 | Optical over geometric alignment | Icons, play triangles, asymmetric SVGs, icon-text buttons need 1-2px nudges | `surfaces.md:57-115` |
| 3 | Shadows over borders | Layered transparent `box-shadow` for depth; dividers/inputs stay borders | `surfaces.md:117-176` |
| 4 | Dark-mode shadow simplification | Single low-opacity white ring instead of layered depth | `surfaces.md:140-149` |
| 5 | Image outline rule | Inset 1px outline, pure black/white alpha only, never tinted neutrals | `surfaces.md:178-219` |
| 6 | Minimum hit area + collision | 40-44px hit area via pseudo-element; never overlap adjacent targets | `surfaces.md:221-256` |
| 7 | Text-wrap split | `balance` for short headings, `pretty` for short-medium body, neither for long | `typography.md:5-63` |
| 8 | Root font smoothing | macOS `-webkit-font-smoothing: antialiased` at the root only | `typography.md:65-99` |
| 9 | Tabular numbers | `tabular-nums` for dynamic counters/timers/prices to stop layout shift | `typography.md:101-135` |
| 10 | Interruptible animations | CSS transitions retarget mid-flight; reserve keyframes for one-shots | `animations.md:5-40` |
| 11 | Split and stagger enters | Animate semantic chunks (title/body/actions) with ~100ms stagger | `animations.md:42-118` |
| 12 | Subtle exits | Shorter, softer than enters; small fixed translate, not full height | `animations.md:120-183` |
| 13 | Contextual icon swaps | Cross-fade opacity/scale `0.25→1`/blur `4px→0`; spring `bounce:0`, or CSS fallback | `animations.md:185-279` |
| 14 | Scale on press | `scale(0.96)` tactile feedback, never below `0.95`; `static` escape hatch | `animations.md:281-342` |
| 15 | Skip animation on load | `AnimatePresence initial={false}` for default-state elements | `animations.md:344-379` |
| 16 | Transition/layer hygiene | Never `transition: all`; `will-change` only on compositor props, after observed stutter | `performance.md:5-89` |

MIFB also ships a global **Review Output Format** (Before/After tables) and a **Review Checklist** — see §7 for why these are ruled out.

---

## 5. COVERAGE MAP — net-new vs covered, with exact sk-design anchors

Coverage: **Net-new** (no equivalent), **Partial** (concept present, precision/caveat missing), **Covered** (already encoded).

| Technique | Coverage | sk-design home + anchor | Minimal future edit |
|-----------|----------|-------------------------|---------------------|
| Concentric radius (1) | Net-new (formula) | `design-foundations/references/layout/layout_responsive.md` (after spacing rules); audit detector in `design-audit/references/anti_patterns_production.md`; interface preflight already has a broad radius check at `design-interface/assets/interface_preflight_card.md:151` | Add `outer = inner + inset` for close nesting; audit detector for same-radius nested surfaces with small padding |
| Optical alignment (2) | Partial | Concept at `design-foundations/.../layout_responsive.md:127` and `design-interface/references/design-process/mechanical_defaults.md:106` | Examples only (asymmetric icons, play triangles, icon-text buttons, 1-2px nudges); no new rule family |
| Shadows over borders (3) | Partial + conflict-prone | `design-foundations/references/color/palette_theming.md` (surface/depth); audit ghost-card tell at `design-audit/references/ai_fingerprint_tells.md:38,42` | Decision matrix: shadow ring *replaces* a decorative depth border; never border + wide shadow on one element; dividers/tables/inputs stay borders |
| Dark-mode shadow (4) | Partial | `design-foundations/SKILL.md:273`, `palette_theming.md:87`, `assets/token_starter.md:109` | Treat low-opacity white ring as optical/state separator, not primary dark elevation |
| Image outline (5) | Net-new (conflict-aware) | `design-foundations/references/color/palette_theming.md` (after border/stroke role); audit detector in `anti_patterns_production.md`; interface preflight imagery `interface_preflight_card.md:108` | Add explicit exception: image-edge outlines use inset pure black/white alpha, NOT tinted neutral tokens (`token_starter.md:38`), accent rings, or layout borders |
| Hit area + collision (6) | Partial (collision under-covered) | Interface floor `design-interface/references/design-process/ux_quality_reference.md:61`; audit threshold `design-audit/references/accessibility_performance.md:42` | Keep 44×44 target (do NOT downgrade to 40px); add collision detector for overlapping pseudo-element hit areas |
| Text-wrap caveats (7) | Partial (line-count caveats missing) | `design-foundations/references/type/typography_system.md` §5 (has balance/pretty at lines 71-72) | Add: balance→short headings, pretty→short-medium body, neither→long text |
| Root font smoothing (8) | Net-new | `design-foundations/references/type/typography_system.md` (after pairing/readability) | Root-only macOS smoothing; avoid per-component |
| Tabular numbers (9) | Covered | `typography_system.md` data role + `assets/token_starter.md:82` | Add dynamic layout-shift framing; don't require for decorative numerals |
| Interruptible transitions (10) | Covered | `design-motion/references/micro_interactions.md:50` + `assets/motion_pattern_cards.md:116` | None (optional cross-link to perf) |
| Split/stagger enters (11) | Partial | `design-motion/references/motion_strategy.md` (timing/material); `animate_presence_patterns.md:91` stagger cap | Semantic-split guidance; do NOT import 100ms group stagger as a universal default |
| Subtle exits (12) | Mostly covered | `design-motion/references/motion_strategy.md:55`; `animate_presence_patterns.md:39,60,66` | Add small fixed-translate examples; keep existing exit-duration rule |
| Contextual icon swaps (13) | Partial (CSS fallback missing) | `design-motion/references/micro_interactions.md` (after Animation Mechanism / before Morphing Icons) | Add no-dependency CSS cross-fade fallback (both icons in DOM, opacity/scale/blur) |
| Scale on press (14) | Covered (value); escape hatch under-covered | `design-motion/references/micro_interactions.md:40,46`; `assets/motion_pattern_cards.md:46` | Add optional `static` escape-hatch handoff note |
| `initial={false}` (15) | Covered | `design-motion/references/animate_presence_patterns.md:43,45`; `assets/animate_presence_checklist.md:50` | None; preserve the "don't suppress intentional entrances" caveat |
| Transition/layer hygiene (16) | Partial (audit detector missing) | Motion `assets/motion_performance_failure_card.md:55`; audit `accessibility_performance.md:79,91` | Add audit static-risk detector for `transition: all` next to broad/permanent `will-change` |

---

## 6. Q3 — CONFLICT DECISIONS (reconcile or rule out)

1. **Shadow-as-border vs ghost-card slop.** *Reconciled.* Legitimate = a tokenized transparent shadow ring *replacing* a decorative depth border (usually no solid border on the same element), scoped to raised controls/cards/overlays/hover-lift. Slop (already a Codex tell at `ai_fingerprint_tells.md:38`) = `1px solid` border **plus** a wide shadow blur on the same element. Adopt shadow-as-border as a *replacement* material, never as license to stack edge treatments.
2. **Image-outline pure rgba vs tinted-neutral tokens.** *Reconciled as an exception.* Foundations correctly tints neutral scales toward brand hue (`token_starter.md:38`), but image edges are not semantic borders — a tinted outline dirties the edge. Add the pure black/white alpha rule as an explicit optical exception under foundations color, not a new token scale.
3. **Global Review Output Format.** *Ruled out.* `design-audit` already owns findings-first severity output (`audit_contract.md`); a second global format would conflict with mode-owned contracts and the hub's no-per-mode-logic rule (`sk-design/SKILL.md:15,92`).
4. **Wholesale numeric defaults.** *Ruled out.* Keep already-owned values (`0.96`, `initial={false}`, no `transition: all`); do not transplant corpus numbers as universal constants (40px must not replace 44×44; 100ms group stagger is not a universal default; blur stays bounded/verified).

---

## 7. PRIORITIZED BACKLOG (for a future build phase)

Ranked by leverage × effort. The **top 8 are the practical build slice** — small, high-leverage, net-new or under-covered.

| Rank | Technique | Target file + anchor | Coverage | Leverage | Effort |
|-----:|-----------|----------------------|----------|:--------:|:------:|
| 1 | Concentric radius math | `design-foundations/.../layout_responsive.md` + audit `anti_patterns_production.md` | Net-new | H | S |
| 2 | Image-edge pure-rgba outline exception | `design-foundations/.../palette_theming.md` + audit `anti_patterns_production.md` | Net-new | H | S |
| 3 | Shadow-ring vs ghost-card detector | `design-audit/references/anti_patterns_production.md` (cross-link ghost-card tells) | Partial | H | S |
| 4 | Contextual icon-swap CSS fallback | `design-motion/references/micro_interactions.md` | Partial | H | S |
| 5 | Root-only font smoothing | `design-foundations/references/type/typography_system.md` | Net-new | H | S |
| 6 | Text-wrap line-count caveats | `design-foundations/.../typography_system.md` §5 | Partial | H | S |
| 7 | `transition: all` audit detector | `design-audit/references/accessibility_performance.md` | Partial | H | S |
| 8 | Hit-area collision detector | `design-audit/references/anti_patterns_production.md` | Partial | H | S |
| 9 | Static press-scale escape hatch | `design-motion/references/micro_interactions.md` | Partial | M | S |
| 10 | Shadow-as-border decision matrix | `design-foundations/.../palette_theming.md` (+ optional shared vocab) | Partial | M | M |
| 11 | Semantic split/stagger enters | `design-motion/references/motion_strategy.md` | Partial | M | S |
| 12 | Small fixed-translate exits | `design-motion/.../motion_strategy.md` or `animate_presence_patterns.md` | Partial | M | S |
| 13 | Optical alignment examples | `design-interface/.../mechanical_defaults.md` | Partial | M | S |
| 14 | Dark-mode white-ring separator | `design-foundations/.../palette_theming.md` | Partial | M | S |
| 15 | Dynamic tabular-number framing | `design-foundations/.../typography_system.md` | Covered | M | S |
| 16 | md-generator measured-capture reminder | `design-md-generator/SKILL.md` | Covered | L | S |

### Per-mode rollup

- **`design-foundations` — highest-leverage single home.** Concentric-radius math, image-outline exception, root-only font smoothing, text-wrap caveats, shadow-ring matrix, dark-mode white-ring, dynamic-number framing.
- **`design-audit` — enforcement pair.** Detectors for same-radius nesting, tinted/layout image outlines, shadow-ring-vs-ghost-card misuse, hit-area collision, `transition: all`.
- **`design-motion` — narrower refinements.** Biggest gap is the icon-swap CSS fallback; plus static press-scale escape hatch, semantic split/stagger, small fixed-exit translate.
- **`design-interface` — lightweight preflight prompts only** for optical alignment, image-edge outlines, nested radius, hit-area collision.
- **`design-md-generator` — no taste edits.** Only preserve measured outline/shadow/radius/smoothing/hit-target evidence when extracted.
- **`shared/` — optional vocabulary** for "image-edge outline" and "shadow ring" if multiple modes need the same terms; keep mechanics in foundations/audit.

---

## 8. DO-NOT / RULED-OUT LIST

- Do **not** import MIFB's global Review Output Format — `design-audit` owns findings shape; the hub stays logic-free.
- Do **not** transplant wholesale numeric defaults (keep 44×44 over 40px; no universal 100ms stagger; blur stays bounded).
- Do **not** put per-mode mechanics in the hub — edits land in mode packets or, narrowly, shared vocabulary.
- Do **not** re-adopt already-covered motion rules as if new (interruptible transitions, `initial={false}`, `0.96`, zero-bounce) — they are reinforcement.
- Do **not** make image-edge outlines semantic/tinted/accent/layout borders — optical exception only.
- Do **not** use shadow-as-border to legitimize border-plus-wide-shadow cards — replacement, not stacking.

---

## 9. SEPARATE NON-CORPUS CLEANUP (found while researching)

The `sk-design` hub `SKILL.md:105` lists the shared base as `references/anti_slop_principles.md`, `references/cognitive_laws.md`, `references/design_token_vocabulary.md`, but no `references/` directory exists — the real shared base lives under `shared/` (`shared/anti_slop_principles.md`, `shared/cognitive_laws.md`, `shared/design_token_vocabulary.md`, `shared/register.md`, `shared/sk_code_handoff.md`), which the mode packets correctly reference (e.g. `design-foundations/SKILL.md:318`). This is a live hub doc inaccuracy, **not** a MIFB-adoption item — record it as its own small doc-fix in the build phase.

---

## 10. FUTURE BUILD — DEFINITION OF DONE

A build phase is done when: the top-ranked corpus-adoption edits land surgically in the named mode files; each edit preserves the §6 conflict decisions; and the diff proves three absences — no global review-format import, no hub-level per-mode mechanics, no wholesale numeric-default transplant. It should also fix the §9 shared-path doc inaccuracy as a separate cleanup, run packet spec validation, and leave an implementation summary mapping each changed file back to this backlog.

---

## 11. OPEN QUESTIONS

- No research questions remain inside this three-iteration loop (Q1–Q4 answered).
- The exact shared-vocabulary shape for "image-edge outline" / "shadow ring" (whether they need cross-mode terms in `shared/design_token_vocabulary.md`) is a build-phase decision, not a research gap.
- Implementation is intentionally unstarted — the build phase still edits, verifies, and summarizes the target files.

---

## 12. CONVERGENCE REPORT

- **Stop reason:** maxIterationsReached (3 of 3)
- **Iterations:** 3 — newInfoRatio 0.82 → 0.64 → 0.43 (monotonic decline; healthy convergence)
- **Status per iteration:** all `insight`
- **Coverage graph:** unavailable this run (`better-sqlite3` ABI mismatch — built for Node MODULE_VERSION 141, runtime is 127); per the workflow's degradation path, the inline 3-signal vote governed and the hard iteration cap terminated the loop. Graph upsert was best-effort and skipped.
- **Findings recorded:** 16 findings, 8 observations, 11 edges, 9 ruled-out directions, 3 invariants across the three delta files.
- **Questions:** 4/4 key questions answered.

---

<!-- ANCHOR:references -->
## 13. REFERENCES

- **Iteration evidence:** `research/iterations/iteration-001.md` (inventory), `iteration-002.md` (anchors + conflicts), `iteration-003.md` (backlog).
- **State:** `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, `research/deep-research-dashboard.md`, `research/deep-research-findings-registry.json`, `research/deltas/iter-00{1,2,3}.jsonl`.
- **Resource inventory:** `research/resource-map.md`.
- **Corpus (read-only):** `../external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/{SKILL.md, surfaces.md, typography.md, animations.md, performance.md}`.
- **Targets:** `.opencode/skills/sk-design/` hub + five mode packets + `shared/`.
- **Sibling research:** `../015-per-skill-improvement-research/implementation-summary.md` (plumbing-over-theory context).
<!-- /ANCHOR:references -->
