---
title: "Deep Research Report: designer-skills-main corpus → sk-design improvements"
description: "Canonical synthesis of a 13-iteration GPT-5.5-xhigh deep-research run (9 sequential + 4 parallel) over the external designer-skills-main corpus (9 plugins, ~96 skills). Produces a per-plugin in-scope/out-of-scope ledger, a Q3 ruled-out list, a 10-item prioritized adoption backlog with exact sk-design targets, and a no-new-mode verdict. Research only; no live sk-design changes."
trigger_phrases:
  - "designer-skills-main sk-design research"
  - "designer skills adoption backlog"
  - "external design suite sk-design scope"
  - "sk-design no new mode verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T11:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized the 13-iteration designer-skills-main research deliverable"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Deep Research Report: designer-skills-main corpus → sk-design improvements

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. EXECUTIVE SUMMARY

A GPT-5.5-xhigh deep-research run (13 iterations — 9 sequential, then 4 parallel slice agents after the operator requested parallelism) studied the external `designer-skills-main` corpus: a 9-plugin marketplace of ~96 design skills spanning the whole design lifecycle (ops, research, systems, prototyping, interaction, UI, strategy, critique).

**The headline is scope, not volume.** `sk-design` is a taste-led build/visual skill with five modes; `designer-skills-main` is a full design-practice suite. Most of it — research, strategy, validation programs, design-ops, governance, adoption, decks, negotiation — is deliberately **out of scope** and must not be absorbed. The genuinely adoptable core is small, build-facing, and lands entirely in the existing five modes:

- **`visual-critique` → `audit`** is the single highest-leverage adoption: seven concrete screen-critique dimensions (hierarchy, brand, composition, typography, color, affordance, information density) become audit *lenses* mapped onto audit's existing P0–P3 severity and five-dimension model — a crosswalk, **not a second scoring system**.
- **`interaction-design` → `motion`/`interface`/`audit`**: a net-new state-machine fragment for branching UI, plus flow floors for forms/search/navigation/feedback/error/empty states.
- **`design-systems` → `audit`/`foundations`/`motion`**: production-hardening checks (component completeness, localization stress, accessibility modality coverage, motion-token verification) — its governance/adoption/localization *lifecycle* is ruled out.
- A few **`foundations`/`interface`** refinements (grid contract, density-mode spacing, dark-mode media, copy/state voice, earned-deviation restraint).

**No new sk-design mode is justified.** The strongest candidate (visual-critique) is a set of audit lenses, not a distinct intent/output/owner. Every adoptable item splits cleanly into the current five modes; the hub stays logic-free. `md-generator` receives nothing from this corpus (it is a CSS-extraction backend, not design-practice guidance).

---

## 2. SCOPE AND METHOD

- **Question:** Which of the 9 plugins / ~96 skills are genuinely adoptable for sk-design's build/visual modes vs out-of-scope lifecycle work; the correct home + minimal edit for each adoptable item; conflicts to rule out; and whether any cluster justifies a new mode.
- **Executor:** `cli-codex`, model `gpt-5.5`, reasoning `xhigh`, service tier `fast` (ChatGPT OAuth).
- **Iterations:** 13 total. **Iters 1–9 ran sequentially** (capability map → interaction-design → ui-design → out-of-scope plugins), newInfoRatio declining 0.78 → 0.16. After the operator asked for parallelism, **iters 10–13 ran as 4 concurrent slice agents** (visual-critique, design-systems, net-new extraction, scope-ledger/backlog), each on a fresh distinct slice (ratios ~0.56–0.68), each writing its own iteration file + delta to avoid shared-state races, then merged.
- **Inputs (read-only):** the corpus under `../external/designer-skills-main/`; the live `sk-design` hub + five mode packets + shared register; the sibling `022`/`023` precedent.

---

## 3. CURRENT STATE (coverage baseline)

`sk-design` already encodes the foundational visual-system craft (color/OKLCH, typography, layout, tokens), motion (interruptible transitions, reduced motion, micro-interactions), and an audit mode with a five-dimension score + P0–P3 severity + evidence + owner routing. The corpus's overlap with these is mostly **duplicate** (color-system, responsive, cognitive-laws, token/icon architecture). The gaps the corpus genuinely fills are in **audit critique depth**, **interaction state/flow structure**, and **production-hardening checks** — not new visual-system theory.

---

## 4. PER-PLUGIN IN-SCOPE / OUT-OF-SCOPE LEDGER

| Plugin | Verdict | In scope (adoptable) | Out of scope / ruled out | Target home |
|--------|---------|----------------------|--------------------------|-------------|
| `visual-critique` | **Strongly in scope** | 7 critique dimensions as audit lenses (hierarchy, brand, composition, type, color, affordance, info density) | A separate 7-dimension score; a new critique mode; hallucinated brand truth (needs supplied references) | `audit` (+ light `interface`/`foundations` xref) |
| `interaction-design` | **Strongly in scope** | State-machine fragment; error/feedback/loading/search/form/nav/onboarding flow floors; gesture-conflict wording; state copy voice | Cognitive-law dupes; analytics/instrumentation/activation metrics; first-click testing; a new `interaction`/`delight` mode | `motion`, `interface`, `audit` |
| `ui-design` | **In scope (much already covered)** | Grid contract, density-mode spacing, containment restraint, dark-mode media, media/illustration contract, earned-deviation restraint, perceived-quality severity | Wholesale color-system/responsive/cognitive-law imports; illustration governance; user-study programs | `foundations`, `interface`, `audit` |
| `design-systems` | **Partly in scope** | Component completeness, localization stress, theme/motion-token verification, narrow naming/token clarity checks | Governance, contribution models, versioning, deprecation, adoption metrics, pattern-library graphs, doc templates, naming-lint | `audit`, `foundations`, `motion` |
| `prototyping-testing` | **Narrowly in scope** | Accessibility modality coverage; optional flow-path vocabulary; evidence guards for supplied tests | Prototype strategy, usability scenarios, A/B design, click tests, participant validation, sample-size planning | `audit` only |
| `designer-toolkit` | **Mostly adjacent** | `design-token-audit` (tier misuse + frequency); a tiny "voice stable, tone contextual" copy distinction | Rationale, decks, case studies, adoption, negotiation, stakeholder comms | `audit`; optional tiny `interface` copy |
| `design-ops` | **Mostly out of scope** | Only the evidence-honesty guard: no business/behavior-impact claims without supplied metrics | Critique facilitation, handoff packages, sprints, review gates, versioning, design-debt, impact reporting | `audit` evidence guard only |
| `design-research` | **Out of scope** | None (upstream input only) | Personas, journey maps, interviews, surveys, repositories, JTBD, card sorting | None |
| `ux-strategy` | **Mostly out of scope** | None standalone (IA/content can inform an interface prompt) | Competitive analysis, north-star, opportunity frameworks, stakeholder alignment, metrics, service blueprints | None |

---

## 5. ADOPTABLE TECHNIQUES (concrete, with exact targets)

From the deep-dive iterations (10–12), the concrete net-new techniques:

- **State-machine fragment** (`interaction-design/skills/state-machine`) → `design-motion/assets/motion_pattern_cards.md` — a card for branching async UI: states, events, transitions, guards, impossible states, entry/exit actions, visible UI per state. *Net-new structure.*
- **Error + feedback flow floor** (`interaction-design/skills/error-handling-ux` + `feedback-patterns`) → `design-audit/references/critique_hardening.md` + `design-interface/.../ux_quality_reference.md` — error proximity, feedback hierarchy, recovery path.
- **Visual-critique audit probes** (`visual-critique/skills/*`) → `design-audit/references/critique_hardening.md` — visual-hierarchy sub-probe, affordance/discoverability probe, scanability/cognitive-load checks, compact composition scan, brand-evidence guard, contrast-evidence tightening, named typography probes. *Mapped to existing severity, not a new score.*
- **Production-hardening bundle** (`design-systems` + `prototyping-testing`) → `design-audit/references/anti_patterns_production.md` + `accessibility_performance.md` — component completeness (anatomy/states/a11y), localization stress (RTL, text expansion), accessibility modality coverage (keyboard/screen-reader/zoom/high-contrast/reduced-motion).
- **Foundations refinements** (`ui-design`) → `design-foundations/references/layout/layout_responsive.md` + `color/palette_theming.md` — grid contract, density-mode spacing, containment restraint, dark-mode media/theme verification.
- **Motion-token verification** (`design-systems`) → `design-motion/references/motion_strategy.md` — product-scale duration/easing tokens, global reduced-motion override, no-motion cases.
- **Copy/state voice + earned-deviation restraint** (`interaction-design` + `ui-design`) → `design-interface/references/design-process/copy_and_mock_data.md` + `design_principles.md`.
- **Token-tier/frequency + evidence-impact guards** (`designer-toolkit` + `design-ops`) → `design-audit/references/anti_patterns_production.md` + `evidence_capture.md`.

---

## 6. PRIORITIZED ADOPTION BACKLOG

Ranked by leverage × effort. The **top 5 are the practical build slice.**

| Rank | Item | Target | Leverage | Effort |
|-----:|------|--------|:--------:|:------:|
| 1 | Visual-critique dimension crosswalk (7 lenses → audit severity/dimensions) | `design-audit/references/critique_hardening.md` (+ note in `audit_contract.md`) | High | L–M |
| 2 | Compact interface UX quality floor (forms, search, nav, feedback/error proximity, first-run/empty states) | `design-interface/references/design-process/ux_quality_reference.md` | High | M |
| 3 | Audit release-hardening bundle (component completeness, localization stress, a11y modality coverage) | `design-audit/references/anti_patterns_production.md`, `accessibility_performance.md` | High | M |
| 4 | State-machine fragment + interaction-state refinements | `design-motion/assets/motion_pattern_cards.md` (+ `micro_interactions.md`) | High | L–M |
| 5 | Foundations layout (grid contract, density-mode spacing, containment restraint) | `design-foundations/references/layout/layout_responsive.md` (+ `token_starter.md`) | High | L |
| 6 | Copy/state voice + earned-deviation restraint | `design-interface/.../copy_and_mock_data.md`, `design_principles.md` | M–H | L |
| 7 | Dark-mode media + theme-mode verification | `design-foundations/references/color/palette_theming.md` | M | L |
| 8 | Motion-system token verification | `design-motion/references/motion_strategy.md` | M | L |
| 9 | Token-tier/frequency + evidence-impact guards | `design-audit/references/anti_patterns_production.md`, `evidence_capture.md` | M | L |
| 10 | Media/illustration contract | `design-interface/.../design_principles.md` | M | L–M |
| 11 | **Perceived-quality / aesthetic-usability audit lens** (polish-as-trust: consistency + grid-alignment scan; error/empty/loading held to primary-flow quality) — *added by the cross-model sweep; fills the §4 "perceived-quality severity" entry that never landed* | `design-audit/references/critique_hardening.md` (+ `design-interface/.../design_principles.md`) | M–H | L |

**`md-generator` gets nothing** from this corpus (CSS-extraction backend, not design-practice guidance).

---

## 7. Q3 — CONFLICTS / RULED OUT

1. **Workflow/command-suite import** — the corpus chains skills into command workflows; sk-design is a five-mode hub, not a command-suite owner.
2. **Research, strategy, testing programs, operations** as first-class capabilities — out of scope unless reduced to a concrete observable UI check.
3. **Parallel scoring systems** — visual-critique supplies dimension labels; audit already owns severity/evidence/scoring/routing. Crosswalk, not a second score.
4. **Duplicate foundations imports** — color-system, responsive, cognitive-laws, token/icon architecture are already covered more strongly; only narrow edge checks survive.
5. **Business-impact / user-behavior claims without evidence** — audit may report static risk but must not claim conversion/findability/behavior without supplied metrics or tests.
6. **Documentation & governance systems** — pattern libraries, doc templates, naming-lint, contribution/versioning/deprecation/adoption, decks, negotiation belong to design-system ops, not sk-design.

---

## 8. NEW-MODE JUDGMENT

**No new sk-design mode is justified.** A new mode would need all three of: distinct user intent, distinct output contract, and distinct ownership not expressible as a packet edit to one of the five modes. No corpus cluster crosses that threshold. visual-critique (the strongest candidate) is a set of audit lenses; interaction-design and design-systems split cleanly into motion/interface/audit/foundations. The hub stays logic-free; new modes would require an explicit `mode-registry.json` extension, which the evidence does not warrant.

---

## 9. FUTURE BUILD — DEFINITION OF DONE

A build phase is done when backlog ranks 1–5 land in the named existing mode packets (no new mode, no hub logic), each edit preserves the scope line (no lifecycle/ops/governance import), the visual-critique adoption is a crosswalk onto existing audit severity (not a second score), every "no impact claim without evidence" guard is respected, and the packet passes strict validation. Re-check exact target anchors before editing.

---

## 10. OPEN QUESTIONS

- No research blocker remains. Remaining decisions are build-phase sizing: whether to batch the audit hardening bundle or split it, and whether the expanded interface flow-floor stays compact after wording is drafted.
- A README-level exclusion is sufficient for `design-research` and `ux-strategy` (their declared skills are upstream artifacts, not build-facing guidance).

---

## 11. CONVERGENCE REPORT

- **Stop reason:** operator-directed pivot to parallel coverage at iteration 9, then a 4-agent wave (iterations 10–13); then an operator-requested cross-model completeness sweep (iterations 14–17) which confirmed completeness rather than surfacing a missed major rec. The 20-iteration cap was never needed.
- **Iterations:** 17 total. 1–9 sequential GPT-5.5-xhigh (newInfoRatio 0.78 → 0.16, converging); 10–13 parallel GPT-5.5-xhigh slices (0.62 / 0.56 / 0.68 / 0.62); 14–17 cross-model read-only sweep — Kimi-k2.7-code + DeepSeek-v4-pro (0.20 / 0.28 / 0.15 / 0.10, low because mostly-confirmatory).
- **Coverage graph:** unavailable this run (`better-sqlite3` ABI mismatch); inline convergence + operator direction governed.
- **Reducer:** iterationsCompleted 17, corruption 0.
- **Questions:** 4/4 answered, plus the new-mode question; the cross-model sweep added backlog rank 11 and confirmed the §7 rulings and the out-of-scope line are sound.

---

## 11b. CROSS-MODEL COMPLETENESS SWEEP (iterations 14–17)

The operator requested a diversity pass to "make sure we got every possible rec." Four read-only completeness critics ran via `cli-opencode` — **Kimi-k2.7-code** (COSTAR; iters 14, 16) and **DeepSeek-v4-pro** (RCAF, `--pure`; iters 15, 17). Each read the existing backlog + corpus slices and emitted candidate net-new recs; the orchestrator (Opus) verified every candidate against the live sk-design content before accepting (a finding is a hypothesis until the cited file is opened).

**Outcome: the GPT-5.5 backlog was largely complete and correctly scoped.** Both DeepSeek passes independently **confirmed all §7 rulings hold** (no wrongly-ruled-out items) and re-examined the out-of-scope plugins (design-research, ux-strategy, prototyping-testing, designer-toolkit) skill-by-skill, confirming they are correctly excluded.

**Genuine addition (verified):**
- **Perceived-quality / aesthetic-usability audit lens** → `design-audit/references/critique_hardening.md` (+ interface `design_principles.md`). Added as backlog **rank 11**; it fills the §4 ui-design "perceived-quality severity" entry that never landed in §5/§6.

**Minor / low-confidence (build-phase judgment):**
- WCAG POUR organizing scaffold for a11y findings (audit) — marginal.
- Gesture-accessibility alternatives beyond "gesture-conflict wording" (motion/audit) — thin.
- ux-writing concrete copy formulas (error/empty/CTA sequences) → interface copy — net-new only if rank-6 copy sources don't already subsume them (cross-check at build time).
- Script-specific typography / cultural color / pseudo-localization (foundations/audit) — thin localization extensions beyond the rank-3 RTL/text-expansion coverage.

**Rejected on verification (model false positives):**
- Data-visualization rules — already covered (`design-foundations/references/data_viz.md` + a data-viz playbook).
- Nielsen 10 heuristics — usability-eval methodology, scope-creep risk (both DeepSeek and verification concur).
- Icon-system checks — largely subsumed by rank-3 component completeness.
- Motion duration/easing taxonomy — `motion_strategy.md` already carries a duration-band table; only a thin stagger-recipe gap remains.

**Net:** the cross-model sweep confirms completeness and adds **one** verified backlog item (rank 11) plus a few build-phase-judgment refinements. It did not surface a missed major rec, and it found no scope-line error — which is the reassuring answer to "did we get every possible rec?"

---

<!-- ANCHOR:references -->
## 12. REFERENCES

- **Iteration evidence:** `research/iterations/iteration-001.md` … `iteration-017.md` (1–9 sequential; 10–13 parallel GPT-5.5 slices; 14–17 cross-model sweep — 14/16 Kimi-k2.7, 15/17 DeepSeek-v4-pro).
- **State:** `research/deep-research-state.jsonl`, `deep-research-strategy.md`, `deep-research-dashboard.md`, `deep-research-findings-registry.json`, `research/deltas/iter-00{1..9}.jsonl` + `iter-01{0,1,2,3}.jsonl`.
- **Corpus (read-only):** `../external/designer-skills-main/` (9 plugins: design-ops, design-research, design-systems, designer-toolkit, interaction-design, prototyping-testing, ui-design, ux-strategy, visual-critique).
- **Targets:** `.opencode/skills/sk-design/` hub + five mode packets + `shared/`.
- **Sibling precedent:** `../022-mifb-design-research/` (research) and `../023-mifb-design-adoption/` (adoption build).
<!-- /ANCHOR:references -->
