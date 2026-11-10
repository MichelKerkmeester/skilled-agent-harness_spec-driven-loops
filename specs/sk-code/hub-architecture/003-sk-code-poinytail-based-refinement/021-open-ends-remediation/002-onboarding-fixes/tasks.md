---
title: "Tasks: Phase 2: onboarding-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "onboarding fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: onboarding-fixes

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

- [x] T001 Read the spec, goal and research section 11, and capture test and doc-scan baselines (`spec.md`)
- [x] T002 Probe the proposed build step on a scratch clone of the branch base (`README.md`)
- [x] T003 [P] Write the four failing tests for R5, R6 and R9 before any fix (`.skilled/bin/check-agent-mirror-sync.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] R1, R2, R4, R8, R10 and R11 in the README install path, R2 in CONTRIBUTING (`README.md`)
- [x] T005 [P] R5 Pi session-start notice (`.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts`)
- [x] T006 [P] R6 Codex drift message, regenerated with its generator (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`)
- [x] T007 [P] R7 sk-vision Bun setup (`.skilled/skills/sk-vision/SKILL.md`)
- [x] T008 [P] R9 not-checkable exit in the checker and both pre-commit hooks (`.skilled/bin/lib/mirror-sync-verify.cjs`)
- [x] T009 Bump system-spec-kit and sk-vision once each with a changelog entry (`.skilled/skills/system-spec-kit/changelog/v2.7.11.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Follow the numbered README steps on a pristine clone through the first routed request and first spec packet (`README.md`)
- [x] T011 Run the five-iteration deep review and fix every confirmed advisory (`review/review-report.md`)
- [x] T012 Fill the ledger and Tests table, then run check-goal and strict validation (`implementation-summary.md`)
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
