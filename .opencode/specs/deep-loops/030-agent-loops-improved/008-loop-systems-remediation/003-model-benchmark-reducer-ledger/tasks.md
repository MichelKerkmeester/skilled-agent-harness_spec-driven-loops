---
title: "Tasks: model-benchmark reducer ledger [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "model-benchmark"
  - "benchmark_run"
  - "state-log"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "Run Vitest suites if a local runner becomes available"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-reducer-ledger-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct Node verification covers the affected runtime behavior when Vitest is unavailable."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: model-benchmark reducer ledger

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

- [x] T001 Read `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml`.
- [x] T002 [P] Read sibling research/review workflow ledger emission patterns.
- [x] T003 [P] Read `loop-host.cjs`, `run-benchmark.cjs`, `reviewer-scorer.cjs`, and reducer references.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add explicit `--state-log` forwarding to the non-reviewer auto model-benchmark command.
- [x] T005 Update ledger step ownership text to match runner-owned append semantics.
- [x] T006 Fix same-file YAML command quoting that prevented parse verification.
- [x] T007 Replace scaffolded Level-1 spec docs with filled docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Parse `deep_model-benchmark_auto.yaml` with bundled `js-yaml`.
- [x] T009 Assert the parsed benchmark command contains the explicit state-log flag.
- [x] T010 Verify `loop-host.cjs` forwards `--state-log`.
- [x] T011 Run direct model-benchmark runtime check and confirm a `benchmark_run` row is appended.
- [x] T012 Attempt targeted Vitest suites and record runner/network blocker.
- [x] T013 Run strict spec validation after doc authoring.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Direct runtime verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
