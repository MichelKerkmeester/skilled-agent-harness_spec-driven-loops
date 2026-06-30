---
title: "Implementation Plan: Extraction data fixes (stop feeding the AI fake or missing data) [template:level_2/plan.md]"
description: "Fix the extraction bugs that hand the WRITE phase fabricated defaults or empty fields, which it then writes about as if real. Covers the focus-consistent default, interaction capture off by default, dead a11y-async code, clustering/variant/component/shadow/contrast/motion corrections, the coverage-election pre-gate, and the un-audited detector modules."
trigger_phrases:
  - "extraction data fixes"
  - "focus consistent bug"
  - "interaction capture default"
  - "coverage election pre-gate"
  - "clustering accuracy"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/002-extraction-data-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 002 from research Phase 1"
    next_safe_action: "Capture baseline then implement T001 focus+interaction fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Extraction data fixes (stop feeding the AI fake or missing data)

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
| **Evidence** | `research/research.md` §6 (Phase 1) + §2.1 |

### Overview

Land the four P0 extraction fixes first (focus, interaction, a11yAsync, coverage-gate), each behind a vitest regression test and an anobel re-extraction diff. Then the P1 classification/quality corrections. The deltaE direction is settled by measurement (keep <3; coverage-gate for L4) — do not re-open it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research findings mapped to this phase
- [x] File targets identified with line references
- [ ] Baseline captured (tool tests + anobel/gold-standard snapshots)

### Definition of Done
- [ ] The 4 P0 extraction fixes landed with regression tests
- [ ] anobel + 4 gold-standard re-extractions diffed against baseline; deltas reviewed
- [ ] No real tokens lost; the two known hallucinations no longer have fabricated backing data
- [ ] `validate.sh --strict` + `package_skill.py --check` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Step 1 — Honest-absence at the source

Replace confident defaults with explicit absence: `extractFocusIndicator` returns `{captured:false}`; detector modules return absent not guessed. This is the root-cause fix for the focus-consistent class.

### Step 2 — Un-starve the sections

Turn interaction capture on (bounded + opt-out), wire the dead a11y-async path, merge motion across pages, lift the contrast cap. The data the AI needs now exists.

### Step 3 — Clustering fidelity (measurement-led)

Add the coverage-election pre-gate (the iter-044/048 SOUND fix for L4 leakage); keep deltaE tight; fix per-page frequency, variant default, component thresholds, shadow duplicate. Each guarded by a gold-standard regression test.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### P0 extraction fixes

- [ ] [P] Replace focus-indicator empty-return with `{captured:false}` + update all consumers (regression test: empty focus → not consistent)
- [ ] Flip interaction default ON; add `--fast-no-interaction`; fix findInteraction component key (test: hover diff attaches)
- [ ] [P] Wire `extractA11yAsync` per-page with cssAnalyses; delete dead a11y duplicate (test: 5 a11y fields populate)
- [ ] Add coverage-election pre-gate `pagesCoverage<0.3→L3`; fix per-page frequency; KEEP deltaE<3 (test: anobel 0 wrongful merges, #646464 excluded)

### P1 clustering/classification quality

- [ ] [P] classifyVariant: remove default-to-Primary; add Outline/Tertiary/Link branches; OKLCH-hue Destructive check
- [ ] [P] Generalize component geometric thresholds (Badge/Card)
- [ ] Delete classifyShadow inline duplicate; single exported source
- [ ] Touch-target/min-font visibility guards (skip hidden/1px)
- [ ] Merge motion across all cssAnalyses (not page 0 only)
- [ ] Lift contrast-pair cap; swap §9 source to DOM-derived pairs

### Detector-module audit

- [ ] [P] Audit icon-detect / framework-detect / dark-mode-detect for default-fabrication; return honest absent
- [ ] Add regression tests for each detector's empty-input behavior

### Verification

- [ ] Capture baseline (tool tests + anobel/gold-standard snapshots) BEFORE changes
- [ ] Re-extract anobel + 4 gold-standard; diff token counts + section coverage; review deltas
- [ ] `validate.sh --strict` + `package_skill.py --check`
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

**Depends on:** None — ships first (all later phases depend on accurate tokens).

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

This phase ships first (no prior dependency). Within the phase, P0 tasks precede P1; verification runs last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimated scope: ~195-250 LOC + vitest regression tests. Estimates are from `research/research.md` §6 (LOC corrected per iter-036).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-task revert + baseline-diff detection. If a fidelity regression appears on any gold-standard example, revert the offending task and re-open it with a tighter guard before re-attempting.
<!-- /ANCHOR:enhanced-rollback -->

---

