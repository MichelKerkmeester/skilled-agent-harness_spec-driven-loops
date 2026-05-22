---
title: "Tasks: system-code-graph Vitest Suite Triage"
description: "Concrete task ledger for triaging the system-code-graph broader Vitest baseline."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "009 phase 011"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage"
    last_updated_at: "2026-05-22T15:53:50Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-011-system-code-graph-suite-triage"
    next_safe_action: "start-arc-009-phase-012-rss-benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source baseline documented in arc 009 phase 007 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: system-code-graph Vitest Suite Triage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read parent arc spec, child phase spec, and arc 009 phase 007 source baseline. (`spec.md`, phase 007 `implementation-summary.md`)
- [x] T002 Read the listed failing test files that exist in the workspace. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [x] T003 Reconcile missing source-inventory entry: `walker-dos-caps.vitest.ts` is absent from the current workspace and must be checked against live suite output. (`tests/walker-dos-caps.vitest.ts`)
- [x] T004 Replace scaffold placeholders in `plan.md` with concrete execution details. (`plan.md`)
- [x] T005 Replace scaffold placeholders in `tasks.md` with one task per source-baseline file or missing inventory entry. (`tasks.md`)
- [x] T006 Run the broader suite and capture exact failure output. (`scratch/baseline-failures.md`)
- [x] T007 Strict-validate the phase folder after plan/task authoring. (`validate.sh --strict`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Classify and resolve failures in `runtime-detection.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts`)
- [x] T011 Classify and resolve failures in `graph-payload-validator.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/graph-payload-validator.vitest.ts`)
- [x] T012 Classify and resolve failures in `tree-sitter-parser.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts`)
- [x] T013 Classify and resolve failures in `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`)
- [x] T014 Classify and resolve failures in `code-graph-context-handler.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts`)
- [x] T015 Reconcile `walker-dos-caps.vitest.ts`; DELETE/obsolete if absent from live suite, otherwise classify its live failures. (`.opencode/skills/system-code-graph/mcp_server/tests/walker-dos-caps.vitest.ts`)
- [x] T016 Classify and resolve failures in `edge-metadata-sanitize.test.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/edge-metadata-sanitize.test.ts`)
- [x] T017 Classify and resolve failures in `code-graph-query-handler.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts`)
- [x] T018 Classify and resolve failures in `startup-brief.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts`)
- [x] T019 Classify and resolve failures in `auto-rescan-policy.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/auto-rescan-policy.vitest.ts`)
- [x] T020 Classify and resolve failures in `code-graph-siblings-readiness.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts`)
- [x] T021 Classify and resolve failures in `symlink-realpath-hardening.vitest.ts`; current action pending baseline. (`.opencode/skills/system-code-graph/mcp_server/tests/symlink-realpath-hardening.vitest.ts`)
- [x] T022 Run targeted Vitest commands for every changed test file. (`.opencode/skills/system-code-graph`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run broader `system-code-graph` Vitest suite and confirm exit 0. (`.opencode/skills/system-code-graph`)
- [x] T031 Run `npm run typecheck` and confirm exit 0. (`.opencode/skills/system-code-graph`)
- [x] T032 Run OpenCode alignment drift verification for changed implementation scope. (`.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`)
- [x] T033 Update this phase's `implementation-summary.md` with metadata, decisions, verification, limitations, per-file triage table, continuity frontmatter, and commit handoff. (`implementation-summary.md`)
- [x] T034 Update arc 009 phase 007 Limitations with closure note. (`../009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`)
- [x] T035 Update arc 009 parent spec status: phase 011 Completed and completion_pct 67. (`../spec.md`)
- [x] T036 Strict-validate this phase, arc 009 parent, and arc 009 phase 007. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T010-T021 cover every live failing test from the source baseline, plus any stale inventory reconciliation.
- [x] T022-T031 pass with evidence.
- [x] T033 records the final per-test triage outcome table.
- [x] T034-T036 complete with strict validation exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source baseline**: `../../009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
