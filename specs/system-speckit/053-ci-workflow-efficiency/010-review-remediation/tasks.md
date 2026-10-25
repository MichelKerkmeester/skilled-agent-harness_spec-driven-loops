---
title: "Tasks: Phase 10: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Scaffold this phase and add it to the parent phase map (`../spec.md`)
- [x] T002 Record the baseline: the surface-hint suite printed `pass 7`, `fail 1`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `concurrency group` and add `.github/workflows/` in the CI vocabulary (`.skilled/skills/sk-code/{ROUTER.md,hub-router.json,graph-metadata.json,sk-code-ci/SKILL.md}`)
- [x] T004 [P] Fix the `sk-code-ci` rules and templates (`references/`, `assets/`)
- [x] T005 [P] Fix the `/doctor:ci` hint, the doctor contract operations and the `ci-report.cjs` comment
- [x] T006 [P] Reconcile the parent and the child phase records
- [x] T011 Fix the surface contract text in the hub `SKILL.md`, `hub-router.json` and `sk-code-ci/SKILL.md`, and add the three single-route replays (operator-delegated decision, 2026-10-25)
- [x] T007 Regenerate the skill graph, the activation manifest and its authored copy, and the Hermes copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the surface-hint suite, the serial compiled-route suites, router-sync, the drift guards and the parent-skill check
- [x] T009 Probe the path keyword and the guard prompt through the front door
- [x] T010 Run recursive strict validation on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



