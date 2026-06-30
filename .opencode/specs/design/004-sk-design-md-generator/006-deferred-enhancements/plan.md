---
title: "Implementation Plan: Deferred enhancements & external-tool borrows (TIER-3 / future) [template:level_2/plan.md]"
description: "The TIER-3 items the research explicitly deferred plus the lower-priority borrow-list techniques: DTCG typed tokens + tokens.css, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP token endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering, and the semantic-data section gaps."
trigger_phrases:
  - "deferred enhancements"
  - "DTCG typed tokens"
  - "tokens.css output"
  - "gradient decomposition"
  - "MCP token endpoint"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/006-deferred-enhancements"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 006 (deferred bucket) from research TIER-3"
    next_safe_action: "Revisit after phases 002-005 ship; each item is independently optional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Deferred enhancements & external-tool borrows (TIER-3 / future)

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
| **Evidence** | `research/research.md` §3 (TIER-3) + 4 (borrow list) + 7 (open questions) |

### Overview

This phase is a structured backlog, not an immediate build. Each item carries the research's deferral rationale. Pick items up opportunistically after 002-005 ship; DTCG and tokens.css are the most-likely-next (downstream interop), the semantic-data section gaps are the deepest (need new extraction capability).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research findings mapped to this phase
- [x] File targets identified with line references
- [ ] Baseline captured (tool tests + anobel/gold-standard snapshots)

### Definition of Done
- [ ] Every TIER-3 + deferred borrow item captured with rationale + dependency
- [ ] DTCG framed as parallel-first; semantic-section gaps documented as accept-open
- [ ] No research §3/§4/§7 deferred item missing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Capture, don't build

This phase records each deferred item with full context so nothing is lost; building is opportunistic and gated behind the hardened baseline.

### Sequence the likely-next

DTCG parallel output + tokens.css are the most adoptable next (interop); gradient decomposition + multi-viewport unlock specific sections; the semantic-section gaps need new extraction capability.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Typed tokens + outputs

- [ ] Document + (later) build parallel tokens.dtcg.json (DTCG $type/$value); KEEP tokens.json as source of truth
- [ ] tokens.css (:root{}) emission for direct agent consumption
- [ ] Composite/aliased tokens (typography/shadow/border/transition + role aliases)

### New extraction capabilities

- [ ] Multi-viewport DOM re-extraction for §10 breakpoint Key Changes
- [ ] Gradient structural decomposition (GradientToken stops/angle/type)
- [ ] CIEDE2000 contrast + nearest-compliant-shade remediation

### Borrow-list niceties

- [ ] MCP token endpoint + CLI fallback
- [ ] Semantic component tagging (ARIA/role/class) over geometry
- [ ] Hybrid occurrence+perceptual clustering; deltaE per-corpus calibration

### Accept-open

- [ ] Document §0/§1/§7/§8 semantic-data gap as a future extraction-capability question
- [ ] Keep this phase as a living backlog updated as 002-005 ship
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

**Depends on:** Phases 002-005 (each enhancement assumes the hardened baseline).

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

This phase depends on Phases 002-005 (each enhancement assumes the hardened baseline).. Within the phase, P0 tasks precede P1; verification runs last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimated scope: Per-item; not on the critical path. Estimates are from `research/research.md` §6 (LOC corrected per iter-036).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-task revert + baseline-diff detection. If a fidelity regression appears on any gold-standard example, revert the offending task and re-open it with a tighter guard before re-attempting.
<!-- /ANCHOR:enhanced-rollback -->

---

