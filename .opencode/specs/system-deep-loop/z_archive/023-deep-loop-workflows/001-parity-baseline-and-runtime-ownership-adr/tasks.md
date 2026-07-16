---
title: "Tasks: Parity baseline and runtime-ownership ADR"
description: "Tasks for phase 001 of the deep-loop-workflows merge: Parity baseline and runtime-ownership ADR."
trigger_phrases:
  - "deep-loop-workflows phase 001"
  - "parity-baseline-and-runtime-ownership-adr"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 001 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-parity-baseline-and-runtime-ownership-adr-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Parity baseline and runtime-ownership ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Author phase plan, tasks, and checklist from templates. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/plan.md`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/tasks.md`)
- [ ] T002 Capture pre-phase source-surface manifest. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.json`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.sha256`)
- [ ] T003 Capture per-mode artifact baselines. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/modes/context.json`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/modes/research.json`)
- [ ] T004 Capture all seven /deep:* command baselines. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/commands/ask-ai-council.json`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/commands/start-context-loop.json`)
- [ ] T005 Capture advisor routing baseline. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/advisor-routing.jsonl`)
- [ ] T006 Prove nested SKILL.md discovery safety and nested graph-metadata prohibition. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/nested-skill-discovery/scanner-proof.md`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/nested-skill-discovery/fixture-summary.json`)
- [ ] T007 Author runtime-ownership ADR. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/decision-record.md`)
- [ ] T008 Consolidate checklist evidence and implementation summary. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/checklist.md`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/implementation-summary.md`)
- [ ] T009 Refresh phase metadata and run strict validation. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/description.json`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/graph-metadata.json`)
- [ ] T010 Prove phase-001 did not modify behavior surfaces. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.json`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the parity check: Phase 001 creates the baseline and proves its own behavior preservation by comparing pre/post SHA-256 manifests for all non-phase behavior surfaces. Mode and command baselines require two consecutive single-executor normalized captures with byte-identical bytes. Later phases compare against these stored normalized bytes and hashes.
- [ ] T014 `validate.sh --strict` on this phase folder
- [ ] T015 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
