---
title: "Implementation Plan: Doc, prompt & routing fixes (remove the fabrication mandates) [template:level_2/plan.md]"
description: "Remove the structural instructions in the format spec, style guide, prompt template, and SKILL.md that REQUIRE the AI to write content with no backing data. Adds the ABSENT-stamp path, the AP-29 anti-pattern, the per-section anti-fabrication ruleset, and loads the cardinal-rules card as a pre-write gate."
trigger_phrases:
  - "fabrication mandate removal"
  - "absent stamp"
  - "named principle evidence gate"
  - "comparative framing removal"
  - "per-section anti-fabrication ruleset"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/003-doc-prompt-routing-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 003 from research Phase 2"
    next_safe_action: "Implement T-section requirements data-driven first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Doc, prompt & routing fixes (remove the fabrication mandates)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (embedded Playwright tool) + Markdown resources |
| **Surface** | `.opencode/skills/sk-design-md-generator/` (tool/scripts, tool/resources, assets, SKILL.md) |
| **Testing** | `vitest`, `validate.ts` self-test, live anobel extraction, `package_skill.py --check`, `validate.sh --strict` |
| **Evidence** | `research/research.md` §6 (Phase 2) + §2.2 |

### Overview

These are doc/prompt edits with zero runtime risk — they REMOVE fabrication mandates rather than add logic. Land the section-demotion + named-principle/comparative-framing gates first (they kill the largest fabrication surface), then AP-29 + ABSENT-stamp + the cardinal-rules gate. Phase 004 adds the code that enforces them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research findings mapped to this phase
- [x] File targets identified with line references
- [ ] Baseline captured (tool tests + anobel/gold-standard snapshots)

### Definition of Done
- [ ] Every interpretive mandate is conditional-on-evidence or removed
- [ ] ABSENT-stamp + ESCALATE path documented
- [ ] AP-29 + per-section ruleset documented and loaded at WRITE and VALIDATE
- [ ] Re-authoring anobel: §6 ABSENT, no gradient-depth, no 'unlike most systems' claims
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Step 1 — Stop requiring empty content

Make section requirements data-driven and named-principle/comparative-framing conditional-on-evidence. This removes the largest fabrication surface (the empirical iter-043 invention sites).

### Step 2 — Give the AI a legal exit

Add the ABSENT-stamp output + ESCALATE-IF so 'no data' is a supported, correct answer instead of a void the model fills.

### Step 3 — Codify the rules

AP-29, the NEVER-qualitative rule, the per-section ruleset, and the cardinal-rules pre-write gate — one source of truth, loaded at the right phases.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Remove the mandates

- [ ] Make section requirements data-driven; demote §0/§7/§11/§12 (+§6.5/§9) to conditional
- [ ] [P] Named principle conditional-on-evidence (≥3 tokens/≥2 pages) in §9/§1/§3
- [ ] [P] Remove comparative-framing mandate; replace with intra-system comparison
- [ ] Motion fallback → OBSERVED/RECOMMENDED labeled blocks

### Add the legal exit + rules

- [ ] Add ABSENT-stamp output + ESCALATE-IF for zero-data sections (SKILL.md, format §22, prompt)
- [ ] [P] Add AP-29 Interpretive Fabrication + NEVER-qualitative rule (anti_patterns.md, SKILL.md)
- [ ] Load cardinal_rules_card.md as a pre-write gate; remove inline duplicates
- [ ] Resolve style-guide §10 vs format-spec philosophy contradiction

### Per-section ruleset

- [ ] Document the per-section FORBID/CITE-TOKEN/GATE/LABEL ruleset (iter-037) in the format spec
- [ ] Record the deterministic-vs-prose section split (iter-040) for phase 005

### Verification

- [ ] Re-author the anobel DESIGN.md by the new rules; confirm §6 ABSENT + no fabricated claims
- [ ] sk-doc template + validate.sh --strict on the skill docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: `vitest` per changed function (regression tests named in tasks.md).
- Integration: re-extract anobel + the 4 gold-standard sites; diff token counts + section coverage vs the captured baseline.
- Gate: `validate.sh --strict` on this phase; `package_skill.py --check`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

**Depends on:** Phase 002 (the ABSENT path is only honest once extraction reports real emptiness, not fake defaults).

Tooling: Playwright/Chromium, the embedded `tool/` test harness, `validate.ts`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each task is an isolated, reversible edit behind a regression test. Roll back by reverting the task's commit; the baseline snapshots make any fidelity regression detectable. No data migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

This phase depends on Phase 002 (the ABSENT path is only honest once extraction reports real emptiness, not fake defaults).. Within the phase, P0 tasks precede P1; verification runs last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimated scope: ~155 LOC of doc/prompt edits. Estimates are from `research/research.md` §6 (LOC corrected per iter-036).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-task revert + baseline-diff detection. If a fidelity regression appears on any gold-standard example, revert the offending task and re-open it with a tighter guard before re-attempting.
<!-- /ANCHOR:enhanced-rollback -->

---

