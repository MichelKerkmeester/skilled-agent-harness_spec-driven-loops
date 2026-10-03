---
title: "Tasks: Build: improve the Jev Pi native classifier transport (037)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Build: improve the Jev Pi native classifier transport (037)

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

- [x] T001 Read 048's research for this feature and the adapter
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Honor `--provider` or refuse the Pi route for other providers
- [x] T004 Let `JEV_TRANSPORT=jev` override a per-call `pi` option
- [x] T005 Cache the runtime per process, pin the Pi version and preflight once
- [x] T006 Bound the combined Pi and CLI latency and keep fallback quiet
- [x] T007 Repair the paired benchmark run, record usage and digests, add the escalation arm
- [B] T008 Run the paired benchmark once with `--out` (blocked: Jev has no OpenRouter key and D1 gives Jev no secret)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the adapter and benchmark tests
- [x] T010 Check both current importers still pass their suites
- [x] T011 Run `validate.sh --strict` on this phase
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

---



