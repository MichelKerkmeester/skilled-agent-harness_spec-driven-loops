---
title: "Tasks: Native Rerun of Deferred Usefulness Cells"
description: "Task list for native rerun measurements, verdict update, backlog capture, and validation."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "native synthesis update"
importance_tier: "important"
contextType: "execution"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/002-native-deferred-trial-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Marked native rerun measurements complete with evidence"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "tasks.md"
      - "trials/trial-log.jsonl"
      - "synthesis-report-native-rerun.md"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-002-native-deferred-trial-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "Each supplied native measurement has a completed or blocked task."
---
# Tasks: Native Rerun of Deferred Usefulness Cells

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

**Task Format**: `T### [P?] Description (file path or scenario id)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 2 native rerun packet. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, metadata files.
- [x] T002 Read prior sandbox execution packet. Evidence: `../001-sandbox-usefulness-trials/` docs reviewed before authoring.
- [x] T003 Reuse existing scaffold. Evidence: `trials/raw/` and `analysis/` existed before packet authoring.
- [x] T004 Update parent graph metadata with `002-native-deferred-trial-rerun`. Evidence: `../graph-metadata.json.children_ids`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T020 [P] Log first code graph scan with `includeSkills: true`. Evidence: 9,280 files indexed, 56,843 nodes, 36,347 edges, 13,376 ms.
- [x] T021 [P] Log S-CG-01 `calls_to scoreLexicalLane` query. Evidence: blocked by candidate manifest drift.
- [x] T022 [P] Log S-CG-03 `blast_radius recommend_with_native_advisor` query. Evidence: blocked by candidate manifest drift.
- [x] T023 [P] Log S-CG-02 `imports_to skill-graph-db.ts` query. Evidence: blocked by candidate manifest drift.
- [x] T024 [P] Log default-scope scan failure. Evidence: zero nodes persisted, 764 edges, 10 parser crashes.
- [x] T025 [P] Log S-CG-04 outline query. Evidence: blocked with `graph is empty (0 nodes)`.
- [x] T026 [P] Log third scan recovery failure. Evidence: `includeSkills: true` still returned zero nodes and 764 edges.
- [x] T027 [P] Log S-HK-02 advisor frontend motion probe. Evidence: top-1 `sk-code`, score `0.86`, correct.
- [x] T028 [P] Log S-HK-02 advisor save context probe. Evidence: `system-spec-kit` then `memory:save`, correct.
- [x] T029 [P] Log S-HK-02 advisor new spec folder probe. Evidence: top-1 `system-spec-kit`, score `0.80`, correct.
- [x] T030 [P] Log S-HK-04 compaction formatting. Evidence: hook-cache source and cachedAt marker surfaced.
- [x] T031 [P] Log Codex hook smoke fix. Evidence: `node ...session-start.js --smoke` returned valid envelope.
- [x] T032 [P] Log Copilot offline preflight fix. Evidence: two `SPEC-KIT-COPILOT-CONTEXT` markers emitted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T100 Write native synthesis report. Evidence: `synthesis-report-native-rerun.md`.
- [x] T101 Record code graph verdict as OVERHEAD. Evidence: synthesis verdict table.
- [x] T102 Record hooks verdict as USEFUL. Evidence: synthesis verdict table.
- [x] T103 Record plugin/runtime verdict as DEFERRED. Evidence: synthesis verdict table.
- [x] T104 Record native-derived P0 backlog. Evidence: three P0 entries in synthesis.
- [x] T105 Record native-derived P1 backlog. Evidence: one P1 entry in synthesis.
- [x] T106 Run strict validation after packet authoring. Evidence: validation command output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Native measurements have trial-log rows.
- [x] Advisor probe raw files exist under `trials/raw/`.
- [x] Prior backlog fixes are verified.
- [x] Parent metadata includes this child packet.
- [x] Strict validation exit 0 is recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Trial Log**: See `trials/trial-log.jsonl`
- **Synthesis**: See `synthesis-report-native-rerun.md`
<!-- /ANCHOR:cross-refs -->
