---
title: "Tasks: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-measurement-baseline"
    last_updated_at: "2026-06-15T14:05:58Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-measurement-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route

<!-- SPECKIT_LEVEL: 3 -->

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

Metric script and baseline capture.

- [ ] T001 Create the metric script with a defensive parser for deep-loop state JSONL plus iteration markdown (`.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs`). Verify: runs on one 002 lineage folder without crashing.
- [ ] T002 Implement the five metrics: tool:text ratio, median words/msg, "I'll/Let me" self-opener %, unsolicited-caveat %, evidence-backed-completion ratio (`.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs`). Verify: prints all five over the full 002 corpus with per-lineage coverage.
- [ ] T003 Capture the baseline snapshot over the 002 lineage state files (`.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs` output). Verify: snapshot records the five metrics and which lineages contributed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Non-blocking advisories and the read-only delivery route.

- [ ] T004 Emit non-blocking advisories on low tool:text ratio, self-openers, and high caveat density (`.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`). Verify: `vitest` fixture confirms a tripping input stays non-blocking.
- [ ] T005 Create the read-only doctor diagnostic that renders the metrics and the baseline comparison (`.opencode/commands/doctor/scripts/fable-mode-check.cjs`). Verify: a pre/post directory diff confirms zero writes.
- [ ] T006 Create the route asset describing inputs, behavior, and read-only status (`.opencode/commands/doctor/assets/doctor_fable-mode.yaml`). Verify: asset parses and matches the route entry.
- [ ] T007 Append the `fable-mode` route with `mutating: read-only` (`.opencode/commands/doctor/_routes.yaml`). Verify: `route-validate.sh` passes and `grep` confirms `mutating: read-only`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

End-to-end verification and docs.

- [ ] T008 [P] Optionally note the behavioral-metrics dimension with `/doctor fable-mode` as the primary surface (`.opencode/commands/deep/model-benchmark.md`). Verify: `grep` finds the note.
- [ ] T009 Run the deep-loop-runtime `vitest` suite and `route-validate.sh` end to end. Verify: both green; advisories non-blocking and route read-only.
- [ ] T010 Run `validate.sh --strict` on the phase folder and reconcile spec/plan/tasks/checklist. Verify: exit 0 (or warnings only).
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

