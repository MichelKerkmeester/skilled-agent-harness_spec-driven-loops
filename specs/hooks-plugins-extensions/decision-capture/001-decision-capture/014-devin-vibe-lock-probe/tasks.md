---
title: "Tasks: Phase 14: devin-vibe-lock-probe"
description: "Probe the Devin and Vibe locks live, dispatch the lock choice and the Devin fallback, then rerun the suites and a seeded probe."
trigger_phrases:
  - "devin vibe lock probe tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: devin-vibe-lock-probe

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DC` is `.skilled/hooks/decision-capture`. `PROBE` runs sessions A and B at once in a scratch project. A's command records its process ancestry and the live locks, or, seeded, runs the old and new sweeps.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Probe Devin locks (`PROBE`). Verify: exactly one live lock names an ancestor of A's command, and it is session A.
- [x] T002 Probe Vibe leases (`PROBE`). Verify: exactly one live lease names an ancestor of A's command, and it is session A.
- [x] T003 Check Devin transcripts. Verify: `ls transcripts` shows none after 2026-11-10 and none for the probe sessions.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Devin lock choice (`DC/bin/sweep-devin.mjs`). Verify: the new test passes and fails on the old code.
- [x] T005 [P] Vibe lease choice (`DC/bin/sweep-vibe.mjs`). Verify: the new test passes and fails on the old code.
- [x] T006 Devin missing-transcript fallback (`DC/bin/sweep-devin.mjs`). Verify: the new test passes and fails on the old code.
- [x] T007 Update the README lines on session choice (`DC/README.md`, `DC/bin/README.md`). Verify: `rg -c session_locks DC/bin/README.md` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the hook suites. Verify: `node --test DC/lib/*.test.mjs DC/bin/*.test.mjs DC/claude/*.test.mjs DC/vibe/*.test.mjs` prints 0 failed.
- [x] T009 Seeded `PROBE` for Vibe and Devin. Verify: the new Vibe sweep prints session A where the old one prints B, and the new Devin sweep prints A's queued answer where the old one fails.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the seeded probes read session A
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
