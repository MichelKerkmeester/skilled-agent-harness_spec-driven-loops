---
title: "Tasks: Router Keyword-Precision Narrowing (over-activation fix)"
description: "Task breakdown for the router keyword-precision narrowing phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "router keyword precision tasks"
  - "router over-activation narrowing tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Router Keyword-Precision Narrowing (over-activation fix)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the shipped Type-1 gold routing for deep-research and deep-improvement (`routeSkillResources`)
- [ ] T002 Reproduce the 4 deep-research probes and deep-improvement's probes that mis-route
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Narrow deep-research `STATE` (Tactic A compound, e.g. `dashboard` to `research dashboard`; Tactic B drop pure idioms) (deep-research `SKILL.md`)
- [ ] T004 Narrow the remaining deep-research keywords (`ITERATION`, `CONVERGENCE`) (deep-research `SKILL.md`)
- [ ] T005 Narrow deep-improvement's bare weight 4-5 keywords (`strategy`, `contract`, `integration`) (deep-improvement `SKILL.md`)
- [ ] T006 Optionally extend 2 deep-research scenario prompts so new compound keywords get positive coverage
- [ ] T007 Document deep-review residuals and deep-research secondaries as known; log sk-code as a follow-up
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run the gold-preservation proof — all shipped Type-1 scenarios' `intents[0]` and expected_resources unchanged, zero drift
- [ ] T009 Re-run the probes — all drop to `intents: []`
- [ ] T010 Confirm the D5 structural gate is unchanged (no intent emptied, no `RESOURCE_MAP` change) and the drift guards are green
- [ ] T011 Run Mode-A — D1intra flat, D3 flat on positives, D5 green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
