---
title: "Tasks: Rerank reaper env knobs and operator docs [template:level_2/tasks.md]"
description: "Task list for launcher env allowlist, skill docs, README docs, and verification handoff."
trigger_phrases:
  - "rerank reaper tasks"
  - "env knob docs tasks"
  - "sidecar operator docs tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "tracked-implementation-tasks"
    next_safe_action: "complete-verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
    session_dedup:
      fingerprint: "sha256:0100050040000000000000000000000000000000000000000000000000000000"
      session_id: "010-005-004-rerank-reaper-env-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rerank reaper env knobs and operator docs

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read governing AGENTS.md and relevant skills.
- [x] T002 Scaffold Level 2 packet at the user-approved path.
- [x] T003 [P] Strict-validate scaffold before target edits.
- [x] T004 [P] Read predecessor ADRs and completed sibling packets for env names, defaults, and telemetry path.
- [x] T005 [P] Read current `start.sh`, `SKILL.md`, and `README.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add reaper env knobs to explicit `start.sh` allowlist.
- [x] T007 Add launcher comments explaining heartbeat, disable, telemetry path, and idle timeout knobs.
- [x] T008 Add reaper lifecycle, env table, telemetry, and manual-debug opt-out docs to `SKILL.md`.
- [x] T009 Add operator lifecycle, env table, telemetry, manual debug, and troubleshooting docs to `README.md`.
- [x] T010 Remove phase-history references from modified public docs.
- [x] T011 Fill packet `spec.md`, `plan.md`, and `tasks.md`.
- [x] T012 Fill packet `checklist.md` and `implementation-summary.md` after verification evidence is available.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify `SKILL.md` is under 500 LOC.
- [x] T014 Verify public docs contain no phase references.
- [x] T015 Run launcher smoke command with bounded execution.
- [x] T016 Run packet strict validation.
- [x] T017 Run parent strict validation.
- [x] T018 Record commit handoff and manual integration smoke runbook in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification runbook documented.
- [x] Requested strict validations pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
