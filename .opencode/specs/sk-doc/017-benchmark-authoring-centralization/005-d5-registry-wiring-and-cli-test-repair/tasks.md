---
title: "Tasks: D5 registry-gate wiring + cli-* test repair"
description: "Task Format: T### [P?] Description (surface)"
trigger_phrases:
  - "d5 registry wiring tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/005-d5-registry-wiring-and-cli-test-repair"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown"
    next_safe_action: "Dispatch the fix agent"
    blockers: []
    key_files: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: D5 registry-gate wiring + cli-* test repair

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

**Task Format**: `T### [P?] Description (surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Call `scanHubRegistry` in `run-skill-benchmark.cjs`; thread into `aggregate` (deep-improvement)
- [x] T002 Add `BLOCKED-BY-REGISTRY` verdict branch in `aggregate` with structural precedence (deep-improvement)
- [x] T003 Add a registry-gate exit-code test in `skill-benchmark.vitest.ts` (hub-broken → exit 3; non-hub unaffected) (deep-improvement)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Repair the 6 relocated cli-* test references to `cli-external-orchestration/…` in `skill-benchmark.vitest.ts` (deep-improvement)
- [x] T005 Align the `/design:*` wrapper-choreography check to the thin-router architecture in `score-skill-benchmark.cjs`; no routing assertion weakened (deep-improvement)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Sonnet reviewer + orchestrator re-verify each fix against the real files via `git diff` review
- [x] T007 Run the full skill-benchmark vitest suite — `56 passed / 0 failed`
- [x] T008 Run validate.sh --strict; refresh graph metadata; commit + integrate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates green (full suite 0 failures, validate Errors 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
