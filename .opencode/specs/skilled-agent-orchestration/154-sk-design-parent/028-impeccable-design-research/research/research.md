---
title: "Research: adopting the impeccable design skill into sk-design"
description: "12-iteration GPT-5.5-xhigh deep research over the external impeccable design skill (shared design laws, 23 command flows, anti-pattern catalog, brand/product register, per-model defect blocks, prose denylist), crosswalked onto sk-design's five modes + register/hub, every candidate verified against the real post-adoption sk-design file. Yield is modest (high overlap with prior 022/023 + 024-027 adoptions): a frozen P1-P3 backlog of build/visual refinements into existing homes, no new mode, and a clear ruled-out ledger for the structural systems (register/score/detector/prose-validator/live-mode)."
trigger_phrases:
  - "impeccable sk-design research"
  - "impeccable adoption backlog"
  - "impeccable design skill crosswalk"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research"
    last_updated_at: "2026-06-27T14:44:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Converged 12-iteration impeccable research; froze the adoption backlog and no-new-mode verdict"
    next_safe_action: "Run the cross-model sweep, then finalize and validate the packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-028-impeccable-design-research"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Whether the cross-model sweep surfaces any net-new rec or rejects a backlog item as already-covered"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Research: adopting the impeccable design skill into sk-design

## 1. EXECUTIVE SUMMARY

The external `impeccable` corpus is one consolidated, user-invocable design skill with 23 commands, a brand/product register, opinionated numeric design laws, a `/20`-style audit + anti-slop posture, per-model `<codex>`/`<gemini>` defect blocks, an anti-pattern detection engine, and a prose denylist. It is the **most directly comparable corpus** studied for sk-design so far. sk-design already encodes impeccable's *structure* (register, audit score, AI tells, real-UI loop) — but the cross-model sweep (§11b) corrected an important under-claim: the GPT-5.5 loop assumed the 022/023 adoption already covered impeccable's *numeric design laws*, and verification proved otherwise. The genuine net-new yield is **moderate, concentrated in foundations/typography craft**, and lands entirely in existing homes.

**Key results:**
- **No new mode, no new system.** impeccable's register, audit score, anti-pattern detector, prose validator, and live-mode workflow all have sk-design analogues or are infrastructure; none justifies a sixth mode or a parallel system (DeepSeek adversarially confirmed all 9 rulings).
- **A two-tier adoption backlog:** the original P1-P3 structural/process items (§4) PLUS a verified foundations/typography + interface refinement tier surfaced by the sweep (§11b) — ~13 specific numeric rules the loop had wrongly assumed were already covered.
- The standout structural item is a **guarded native-image visual-direction branch** (palette-first probes → 1-3 mock directions → approval before code); the standout craft cluster is **specific typography/color/layout numbers** (font-loading perf, OpenType features, all-caps tracking, z-index semantic scale, auto-fit grid, dangerous-color-combos).

**Method:** 12 GPT-5.5-xhigh (cli-codex) iterations, converged (newInfoRatio 0.62 → 0.00); every candidate verified against the real current sk-design file before entering the backlog. A cross-model completeness sweep (Kimi-k2.7 completeness + DeepSeek-v4-pro adversarial, §11b) caught the under-claim and confirmed the rulings — model diversity, not more same-model iterations, is what made convergence-at-12 safe.

---

## 2. SCOPE & METHOD

**Corpus (scoped):** `skill/SKILL.src.md` (shared design laws + command router + per-model defect blocks), `skill/reference/*.md` (the 23 command flows + domain refs), `cli/engine/detect-antipatterns.mjs` (rule-catalog semantics), the brand/product register references, and `docs/STYLE.md` (prose denylist). **Excluded:** the generated provider duplicate skill trees (`.claude/`, `.cursor/`, `.gemini/`, …) which mirror `skill/`, and all build/site/test/extension/CLI plumbing — infrastructure, not design methodology.

**Frame:** crosswalk every impeccable slice onto sk-design's five modes (interface, foundations, motion, audit, md-generator) + the shared register + hub. sk-design is a taste-led build/visual skill.

**Verification discipline:** a finding is a hypothesis until the cited sk-design file is opened. Each candidate is classified NET-NEW (with the sk-design file checked + why absent), ALREADY-COVERED (with the location), or OUT-OF-SCOPE-INFRA.

**Convergence:** 12 iterations; corpus fully read by ~iteration 8; iterations 9-12 were synthesis/verification; newInfoRatio hit 0.04 then 0.00, crossing the 0.05 rolling-average threshold. The 30-iteration cap was not needed — a single fully-covered skill exhausts same-model novelty quickly; additional coverage comes from the cross-model sweep, not more same-model passes.

---

## 3. COVERAGE LEDGER

| Impeccable slice | Read | Crosswalk |
|------------------|------|-----------|
| Shared design laws (color/type/layout/motion/interaction + absolute-bans) | iter 1 | foundations + audit |
| audit / critique / polish / harden / optimize | iter 2 | design-audit |
| anti-pattern detector facade + STYLE denylist | iter 3, 7 | audit (semantics only) |
| brand / product / colorize / typeset / layout | iter 4 | foundations + register |
| animate / delight / interaction-design | iter 5 | design-motion |
| shape / distill / clarify / bolder / quieter / craft | iter 6 | design-interface |
| extract / document / adapt / live / onboard / overdrive / codex / hooks / init | iter 8 | md-generator / interface / ruled-out |
| `<codex>`/`<gemini>` per-model defect blocks | iter 1, 12 | audit (already-covered) |

---

## 4. ADOPTABLE BACKLOG (frozen, no new mode)

Every item maps to an existing sk-design home; each was verified absent in the cited target.

| Rank | Item | Impeccable source | sk-design target | Why net-new / more-specific | Effort |
|------|------|-------------------|------------------|------------------------------|--------|
| P1 | **Guarded native-image visual-direction branch** — Step-A questions → palette confirmation → 1-3 mock directions → approval before code, for net-new/ambiguous/image-led mid-fi+ work when native image gen is available | `codex.md`, `shape.md` | `design-interface/references/design-process/real_ui_loop.md` | real_ui_loop has only a guarded *optional* direction gate; no palette-first probe, mock-direction set, approval gate, or ingredient inventory before code | M |
| P1/P2 | **DESIGN.md / token-drift detection** belongs to audit, not md-generator | `audit.md` | `design-audit/references/anti_patterns_production.md` | drift between a DESIGN.md/token export and the rendered surface is an audit finding; current target lacks the explicit drift check | L–M |
| P1/P2 | **Overlay / top-layer clipping** hardening | SKILL.src dropdown-clipping rule, `harden.md` | `design-audit/references/hardening_edge_cases.md` | clipping of `position:absolute` dropdowns inside `overflow` containers (use dialog/popover/fixed/portal) is not an explicit hardening case | L |
| P2 | **First-value onboarding specifics** — skip/dismissal, contextual just-in-time teaching, first-value-fast | `onboard.md` | `design-interface/references/design-process/ux_quality_reference.md` | the flow floor covers empty/first-run broadly but not skip/dismissal or contextual-teaching specifics | L–M |
| P2 | **High-ambition interaction escalation guardrail** — propose-before-building for ambitious/extraordinary effects | `overdrive.md` | `design-motion/references/advanced_craft.md` | advanced craft lacks an explicit escalation guardrail for high-ambition effects (propose first, then build) | L |
| P3 | **Selected UI-copy examples** — hedge-stack removal, competitor-swappable-copy tell | `docs/STYLE.md` | `design-interface/references/design-process/copy_and_mock_data.md` | a few concrete copy tells worth adding as examples (NOT a wholesale prose validator) | L |
| P3 | **Typography / token / composition tail** — minor calibration refinements | various | foundations + shared | small wording refinements; verify-then-skip if already present | L |

### 4b. Sweep-surfaced refinement tier (verified net-new; the loop under-claimed these)

All verified 0-hit absent in the cited sk-design file (see §11b). Concentrated in foundations/typography.

| Tier | Item | Impeccable source | sk-design target | Effort |
|------|------|-------------------|------------------|--------|
| F | Semantic z-index scale (dropdown→sticky→modal→toast→tooltip; ban 999/9999) | `SKILL.src.md` | `anti_patterns_production.md` / foundations layout | L |
| F | Breakpoint-free `repeat(auto-fit, minmax(280px,1fr))` grid recipe | `SKILL.src.md` | `layout_responsive.md` | L |
| F | Physical-scene theme grounding before light-vs-dark | `SKILL.src.md` | `palette_theming.md` | L |
| F | Dangerous color-combination warnings + ~8% color-blindness risk | `colorize.md` | `palette_theming.md` | L |
| F | Web-font loading perf (`font-display`, metric fallbacks, preload, variable-font threshold) | `typeset.md` | `typography_system.md` | L–M |
| F | Fluid `clamp()` max ≤ ~2.5× min | `typeset.md` | `typography_system.md` | L |
| F | OpenType features (fractions, small caps, ligatures, kerning) | `typeset.md` | `typography_system.md` | L |
| F | All-caps tracking range (5–12%) | `typeset.md` | `typography_system.md` | L |
| F | Light-on-dark three-axis type compensation | `typeset.md` | `typography_system.md` | L |
| I | Full 8-state interactive table (default…disabled/loading/error/success) | `interaction-design.md` | `ux_quality_reference.md` | L |
| I | `:focus-visible` + outline-offset + 3:1 ring-contrast | `interaction-design.md` | `ux_quality_reference.md` | L |
| I | Translation-expansion table (German +30%, French +20%, Chinese −30%) | `clarify.md` | `copy_and_mock_data.md` | L |
| I | Primitive-vs-semantic token-naming distinction | `extract.md` | md-generator `quality_checklist.md` | L |

**Rejected on verification (Kimi false positives):** color-strategy axis (already in `register.md`/`palette_theming.md`), image-hover tell (already in `ai_fingerprint_tells.md`), voice-vs-tone (partially in `copy_and_mock_data.md`).

---

## 5. RULED OUT

**Already-covered (do not re-adopt):**
- The shared numeric design laws (anti-cream OKLCH band, hero clamp ≤6rem, tracking floor ≥-0.04em, body line-length 65-75ch, ease-out-exp curves, reduced-motion, z-index semantic scale) — largely pulled in by the 022/023 adoption.
- Register-as-first-class — `shared/register.md` already exists and states it is not a sixth mode.
- The color-strategy commitment axis — already in register/foundations.
- Per-model codex/gemini tells — `design-audit/references/ai_fingerprint_tells.md` already carries model-specific tells.

**Out-of-scope infrastructure (deliberately not adopted):**
- The anti-pattern **detector architecture** (`detect-antipatterns.mjs`) — a CLI/engine facade; sk-design audits via methodology + findings-first reports, not a shipped detector engine. Only the rule *semantics* informed the backlog.
- A wholesale **prose validator** (the STYLE denylist as an enforced regex) — sk-doc owns prose/HVR; sk-design takes only selected copy examples.
- The **live-mode** browser-iteration workflow, the **document** token-seed system, the build/site/test plumbing — infrastructure, not sk-design's build/visual methodology.

---

## 6. NO-NEW-MODE VERDICT

**No new mode is warranted.** impeccable is itself one consolidated skill (the same consolidation philosophy as sk-design's hub). Every adoptable item is a refinement of an existing mode's references; every structural idea is either already analogous (register, audit score, AI tells) or infrastructure (detector engine, prose validator, live mode). No cluster clears the distinct-intent + distinct-output + distinct-owner bar.

---

## 7. CONVERGENCE REPORT

- **Iterations:** 12 (cap 30; converged early). newInfoRatio: 0.62 → 0.47 → 0.36 → 0.34 → 0.32 → 0.29 → 0.31 → 0.28 → 0.18 → 0.10 → 0.04 → 0.00.
- **Stop reason:** converged (rolling avg of last 3 ratios < 0.05). Corpus fully read by ~iter 8; iters 9-12 synthesis/verification.
- **Reducer:** iterationsCompleted 12, corruption 0. No iteration errors.
- **Questions:** Q1-Q4 answered (net-new vs already-covered vs out-of-scope split; per-mode homes; structural rulings; prioritized backlog).

---

## 11b. CROSS-MODEL COMPLETENESS SWEEP

Four read-only critics ran via `cli-opencode` — **Kimi-k2.7** ×2 (completeness: "what did the GPT-5.5 loop MISS?") and **DeepSeek-v4-pro** ×2 (adversarial: "is the backlog padded / are the rulings sound?"). The orchestrator verified every Kimi candidate against the real sk-design file before accepting (Kimi over-explores; verification is mandatory).

**The sweep materially corrected the GPT-5.5 conclusion.** The loop called the yield "modest," assuming the 022/023 adoption already covered impeccable's numeric design laws. That was an **under-claim**: verification shows ~13 specific typography/color/layout/interface rules are genuinely absent from sk-design. (This is the inverse of the 024 data-viz false positive — there the loop over-claimed; here it under-claimed. Model diversity caught both.)

**DeepSeek (adversarial) — confirmed the original backlog + rulings:**
- DeepSeek-A: every original backlog item verified REAL net-new (file:line) — **0 false positives, 0 misses** in the backlog it reviewed.
- DeepSeek-B: all 9 ruled-out structural systems (new mode, second register, second `/20` score, detector architecture, prose validator, live-mode, document-seed, color-strategy axis, per-model tells) confirmed **SOUND**; **no-new-mode verdict confirmed**.

**Kimi (completeness) — surfaced 31 candidates; verified to ~13 genuine net-new + ~3 rejected:**

*Verified NET-NEW — foundations/typography tier (the cluster the loop missed), all 0-hit absent:*
- Semantic z-index scale (dropdown→sticky→modal→toast→tooltip; ban 999/9999) → `anti_patterns_production.md` / foundations layout.
- Breakpoint-free `repeat(auto-fit, minmax(280px,1fr))` grid recipe → `layout_responsive.md`.
- Physical-scene theme grounding (one sentence: who/where/ambient light/mood before light vs dark) → `palette_theming.md`.
- Dangerous color-combination warnings (red/green, blue/red, yellow/white) + ~8% color-blindness risk → `palette_theming.md`.
- Web-font loading performance (`font-display: swap/optional`, metric-matched fallbacks, preload critical weight, variable-font threshold) → `typography_system.md`.
- Fluid `clamp()` bound: max ≤ ~2.5× min → `typography_system.md`.
- OpenType features (diagonal fractions, small caps, ligature control, explicit kerning) → `typography_system.md`.
- All-caps tracking range (5–12% for short uppercase labels) → `typography_system.md`.
- Light-on-dark three-axis type compensation (line-height +0.05–0.1, letter-spacing +0.01–0.02em, weight +1) → `typography_system.md`.

*Verified NET-NEW — interface/copy tier:*
- Full 8-state interactive table (default/hover/focus/active/disabled/loading/error/success) → `ux_quality_reference.md`.
- `:focus-visible` + outline-offset + 3:1 ring-contrast → `ux_quality_reference.md`.
- Translation-expansion table (German +30%, French +20%, Chinese −30%, keep-numbers-separate) → `copy_and_mock_data.md`.
- Primitive-vs-semantic token-naming distinction → md-generator `quality_checklist.md`.

*REJECTED on verification (Kimi false positives — already covered):*
- Color-strategy commitment axis — already in `shared/register.md` + `palette_theming.md` (Kimi checked the wrong target).
- Image-hover-transform tell — already in `ai_fingerprint_tells.md` (Kimi pointed at `motion_strategy.md`).
- Voice-vs-tone framework — partially present in `copy_and_mock_data.md` (downgrade to marginal).

*Overlap, not new:* em-dash overuse, the stolen-engineer denylist terms, and the structural prose tells are the existing **P3 "selected STYLE examples"** item — adopt as examples, NOT as the ruled-out wholesale prose validator.

**Net effect on the verdict:** no-new-mode and the ruled-out structural ledger are confirmed; but the backlog is **larger than the loop concluded** — a foundations/typography refinement tier (~9 items) + an interface/copy tier (~4 items) join the original P1-P3 set. See the additions folded into §4 below. A future build is now a more substantial foundations/typography + interface pass, not just the P1 interface item.

---

<!-- ANCHOR:references -->
## 12. REFERENCES

- **Corpus:** `external/impeccable-main/skill/SKILL.src.md`, `skill/reference/{audit,codex,shape,onboard,overdrive,harden,...}.md`, `cli/engine/detect-antipatterns.mjs`, `docs/STYLE.md`.
- **sk-design targets verified:** `design-interface/references/design-process/{real_ui_loop.md,ux_quality_reference.md,copy_and_mock_data.md}`, `design-audit/references/{anti_patterns_production.md,hardening_edge_cases.md,ai_fingerprint_tells.md}`, `design-motion/references/advanced_craft.md`, `shared/register.md`, `design-md-generator/references/quality_checklist.md`.
- **Iteration evidence:** `research/iterations/iteration-001.md` … `iteration-012.md` (1-8 corpus coverage; 9 synthesis; 10-11 overclaim-tightening + structural verdict; 12 convergence confirmation).
- **Prior sibling phases:** `022-mifb-design-research` / `023-mifb-design-adoption`; `024-designer-skills-research` / `025-027` adoption.
<!-- /ANCHOR:references -->
