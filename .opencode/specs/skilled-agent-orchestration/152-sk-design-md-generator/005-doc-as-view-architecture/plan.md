---
title: "Implementation Plan: Doc-as-view architecture (deterministic render, AI out of the value tables) [template:level_2/plan.md]"
description: "The structural endgame: generate the value-bearing sections deterministically from tokens (no AI), reduce AI prose to short token-cited annotations, and enforce citation gating. Removes the AI from the value-table surface where it can fabricate."
trigger_phrases:
  - "doc as view architecture"
  - "deterministic formatters"
  - "prompt builder"
  - "citation gating"
  - "three-class section partition"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/005-doc-as-view-architecture"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 005 from research Phase 4"
    next_safe_action: "Build formatters.ts Phase A (§2 Color + §3 Typography) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Doc-as-view architecture (deterministic render, AI out of the value tables)

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
| **Evidence** | `research/research.md` §5 (Architecture) + §6 Phase 4 |

### Overview

Treat this as an additive, flag-gated rebuild. Ship formatters.ts Phase A (§2+§3) behind a flag, prove byte-parity with the AI-written tables on anobel + gold-standard, then expand formatters to the rest of class-(a) and add the prompt-builder + citation gate. The AI-write path remains the fallback until parity is demonstrated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research findings mapped to this phase
- [x] File targets identified with line references
- [ ] Baseline captured (tool tests + anobel/gold-standard snapshots)

### Definition of Done
- [ ] formatters.ts Phase A (§2+§3) deterministic + parity-proven
- [ ] build-write-prompt.ts produces the constrained, absence-aware prompt
- [ ] checkCitationGating enforces citations on (b)/(c)
- [ ] Three-class partition documented; remaining class-(a) formatters landed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Step 1 — Prove the model on 2 sections

formatters.ts renders §2 Color + §3 Typography from tokens; prove byte-parity with the current AI tables on anobel + gold-standard, behind a flag.

### Step 2 — Constrain the prompt

build-write-prompt.ts pre-renders the deterministic sections, marks PRESENT/ABSENT, and hands the AI only the annotation/prose zones.

### Step 3 — Enforce + expand

checkCitationGating requires citations on (b)/(c); expand formatters to the remaining class-(a) sections once parity holds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A formatters

- [ ] Build formatters.ts: formatColorTable + formatTypographyTable from tokens.json
- [ ] Prove byte-parity vs current AI tables on anobel + 4 gold-standard (behind a flag)
- [ ] Tests: deterministic output, matches tokens.json exactly

### Prompt-builder + gate

- [ ] Build build-write-prompt.ts (pre-render tables, PRESENT/ABSENT markers, stability pre-filter)
- [ ] Implement checkCitationGating in validate.ts (resolve [token:<path>] on (b)/(c) lines)
- [ ] Document the three-class section partition in the format spec + SKILL.md

### Expand

- [ ] Implement the remaining class-(a) formatters (spacing/radii/shadow/contrast/breakpoints/icons/token-dictionary)
- [ ] Parity-prove each before enabling

### Verification

- [ ] vitest for formatters determinism + citation gate
- [ ] anobel + gold-standard parity diffs
- [ ] validate.sh --strict; package_skill.py --check
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

**Depends on:** Phases 002-004 (accurate tokens + data-driven contract + the validator hooks the citation gate plugs into).

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

This phase depends on Phases 002-004 (accurate tokens + data-driven contract + the validator hooks the citation gate plugs into).. Within the phase, P0 tasks precede P1; verification runs last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimated scope: ~200 LOC Phase A (§2+§3), ~600 LOC full. Estimates are from `research/research.md` §6 (LOC corrected per iter-036).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-task revert + baseline-diff detection. If a fidelity regression appears on any gold-standard example, revert the offending task and re-open it with a tighter guard before re-attempting.
<!-- /ANCHOR:enhanced-rollback -->

---

