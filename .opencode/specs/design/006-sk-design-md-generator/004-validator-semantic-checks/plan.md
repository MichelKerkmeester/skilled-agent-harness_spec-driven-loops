---
title: "Implementation Plan: Validator semantic checks (make the checker see prose) [template:level_2/plan.md]"
description: "Extend validate.ts beyond hex/section-header checks so it can detect prose fabrication: a section-coverage report, a prose-discipline check, non-color stability gating, source-sentinel provenance, and a values-vs-claims score split."
trigger_phrases:
  - "validator prose checks"
  - "section coverage report"
  - "non-color stability gating"
  - "source sentinel provenance"
  - "dual score split"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/004-validator-semantic-checks"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 004 from research Phase 3"
    next_safe_action: "Implement checkSectionCoverage first (mechanical hallucination detector)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Validator semantic checks (make the checker see prose)

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
| **Evidence** | `research/research.md` §6 (Phase 3) + §2.3 |

### Overview

Build the section-coverage report first — it is the cheap mechanical detector that both flags invention sites and enforces phase 003's data-driven requirements. Then the dual-score split (so values can't mask claims), then the WARNING-tier prose + provenance checks (carefully guarded against false-positives), then non-color stability gating.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research findings mapped to this phase
- [x] File targets identified with line references
- [ ] Baseline captured (tool tests + anobel/gold-standard snapshots)

### Definition of Done
- [ ] checkSectionCoverage + dual-score split landed and tested
- [ ] Prose-discipline + source-sentinel checks WARNING-tier with false-positive guards
- [ ] Non-color stability gating extended
- [ ] OLD anobel stub now flagged; corrected anobel passes clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Step 1 — Make emptiness visible

checkSectionCoverage maps sections to backing fields and reports empties. This is the mechanical detector that powers everything else.

### Step 2 — Stop the 99/100 illusion

Split the score so value-fidelity (hexes) and claims-provenance (prose) are scored separately; a doc can't hide invented prose behind real hexes.

### Step 3 — Carefully-guarded prose signals

Add the WARNING-tier banned-adjective + source-sentinel checks with numeric-anchor suppression, and extend stability gating to non-color tokens.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Mechanical detector + score

- [ ] Implement checkSectionCoverage (section→field map, isEmpty, inventionRisk) + SectionCoverageReport type
- [ ] Split score into valuesScore + claimsScore; update printResult + exit logic
- [ ] Tests: OLD anobel stub flagged; corrected anobel clean

### Guarded prose checks

- [ ] [P] Prose-discipline check (banned adjectives, numeric-anchor suppression, WARNING-tier)
- [ ] [P] Source-sentinel provenance (parse markers, resolve path, WARNING-tier)
- [ ] Extend checkStabilityGating to shadows/gradients/components/radii/typography
- [ ] False-positive guard tests for each

### Verification

- [ ] vitest for every new check
- [ ] Run against OLD stub + corrected anobel + gold-standard examples
- [ ] validate.sh --strict
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

**Depends on:** Phases 002 (accurate tokens to map) + 003 (the data-driven section contract these checks enforce).

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

This phase depends on Phases 002 (accurate tokens to map) + 003 (the data-driven section contract these checks enforce).. Within the phase, P0 tasks precede P1; verification runs last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimated scope: ~220 LOC + false-positive guard tests. Estimates are from `research/research.md` §6 (LOC corrected per iter-036).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-task revert + baseline-diff detection. If a fidelity regression appears on any gold-standard example, revert the offending task and re-open it with a tighter guard before re-attempting.
<!-- /ANCHOR:enhanced-rollback -->

---

