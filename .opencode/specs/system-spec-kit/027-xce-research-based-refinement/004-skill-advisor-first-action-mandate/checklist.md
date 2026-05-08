---
title: "Checklist — 027/004 skill advisor first-action mandate"
description: "QA checklist for the render.ts strengthening phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 027/004 skill advisor first-action mandate

<!-- SPECKIT_LEVEL: 1 -->

Mark each item `[x]` only with file:line evidence after completion.

## P0
- [ ] **C-001**: `FIRST_ACTION_HINT` map + `FIRST_ACTION_HINT_FALLBACK` present in render.ts; unknown labels render fallback (NEVER `undefined`)
- [ ] **C-002**: Brief format changed from `"use ${label}"` to `"MUST invoke ${label} FIRST (...) — ${hint}"` for confidence≥T ∧ uncertainty≤T cases ONLY
- [ ] **C-003**: Confidence ≥0.8 threshold logic at lines 124-133 unchanged (gate logic intact)
- [ ] **C-004**: capText safety net (DEFAULT_TOKEN_CAP / AMBIGUOUS_TOKEN_CAP) unchanged
- [ ] **C-005**: All known skills test coverage in render.vitest.ts
- [ ] **C-007** (REQ-007): High-uncertainty guard: `passes_threshold:true ∧ uncertainty>T` does NOT render mandate wording; renderer-side guard OR producer invariant fixture in place
- [ ] **C-008** (REQ-008): Legacy renderer + producer exact-string fixtures migrated to mandate wording + directive-shape assertions; non-string coverage (poisoning, null, freshness, cache, cap, ambiguous-output) preserved

## P1
- [ ] **C-006**: Action hints reflect each skill's domain (manual review)
- [ ] **C-009** (REQ-009): Boundary fixtures cover confidence ∈ {0.79, 0.80, 0.81} × uncertainty {at T, over T}

## Verification
- [ ] **C-V01**: `npm run check` green
- [ ] **C-V02**: `npx vitest run skill_advisor/tests/render.vitest.ts` all pass
- [ ] **C-V03**: strict validate passes (Level 1 — minimal docs required)
- [ ] **C-V04**: implementation-summary.md authored
