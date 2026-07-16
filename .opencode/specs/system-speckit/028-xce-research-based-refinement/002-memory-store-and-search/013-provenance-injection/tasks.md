---
title: "Tasks: Provenance Injection"
description: "Completed task list for provenance tagging regression remediation across governed ingest, async ingest, prediction-error update/reinforce paths, reachability verification, tests, and Level 2 documentation."
trigger_phrases:
  - "provenance injection tasks"
  - "governed ingest regression tasks"
  - "prediction error provenance tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection"
    last_updated_at: "2026-06-11T12:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Provenance remediation done; final verification gates recorded."
    next_safe_action: "None — phase complete; verification gates passed and recorded."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Guard-coverage expansion is explicitly deferred to a follow-on enforcement phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Provenance Injection

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `memory-index.ts` governed-ingest scan path [10m]
- [x] T002 Read `memory-ingest.ts` async ingest start path [10m]
- [x] T003 Read `memory-save.ts`, `pe-orchestration.ts`, and `pe-gating.ts` prediction-error paths [15m]
- [x] T004 [P] Read `write-provenance.ts` and `scope-governance.ts` contracts [10m]
- [x] T005 [P] Grep `memory_update`, `handleMemoryUpdate`, `vectorIndex.updateMemory`, and `__provenanceContext` reachability [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Remove default scan provenance from `validateGovernedIngest` input (`handlers/memory-index.ts`) [20m]
- [x] T007 Remove default async-ingest provenance from `validateGovernedIngest` input (`handlers/memory-ingest.ts`) [20m]
- [x] T008 Pass null/undefined governance for ungoverned scan and ingest while preserving explicit governed decisions [20m]
- [x] T009 Add persistence-only provenance support to `indexSingleFile` options (`handlers/memory-index.ts`) [20m]
- [x] T010 Apply default async-ingest provenance in the worker persistence call (`context-server.ts`) [15m]
- [x] T011 Pass `writeProvenance` into `evaluateAndApplyPeDecision` (`handlers/memory-save.ts`) [10m]
- [x] T012 Thread provenance through prediction-error orchestration to update and reinforce helpers (`handlers/save/pe-orchestration.ts`) [15m]
- [x] T013 Persist caller provenance in prediction-error update and reinforce mutations (`handlers/pe-gating.ts`) [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Add ungoverned `memory_index_scan` regression test (`tests/handler-memory-index.vitest.ts`) [25m]
- [x] T015 Strengthen ungoverned `memory_ingest_start` regression test (`tests/handler-memory-ingest.vitest.ts`) [10m]
- [x] T016 Add default scan/ingest row-tagging test (`tests/write-provenance.vitest.ts`) [15m]
- [x] T017 Add prediction-error row-level provenance test (`tests/pe-gating-provenance.vitest.ts`) [30m]
- [x] T018 Add prediction-error orchestration provenance-threading test (`tests/pe-orchestration-provenance.vitest.ts`) [25m]
- [x] T019 Run the new/modified provenance regression tests [15m]
- [x] T020 Create `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` [35m]
- [x] T021 Document `memory_update` reachability finding in phase docs [10m]
- [x] T022 Document same-path retire and auto-promotion guard follow-ons in `spec.md` [10m]
- [x] T023 Run `npx tsc --noEmit` from the MCP server directory [10m]. Evidence: PASS, exit 0 (rerun at epic review close, 2026-06-11).
- [x] T024 Run requested vitest suites and record exact counts [20m]. Evidence: provenance/guard vitest suite PASS — 5 files, 18 tests passed, 28 env-gated skips (rerun at epic review close).
- [x] T025 Run strict spec validation for this phase [10m]. Evidence: `validate.sh --strict` PASS, 0 errors, 0 warnings (rerun at epic review close).
- [x] T026 Run changed-code comment-hygiene checks and confirm `ENV_REFERENCE.md` untouched [10m]. Evidence: comment-hygiene clean (enforced by the pre-commit hygiene gate on the phase commit); `ENV_REFERENCE.md` not touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and documentation tasks are complete.
- [x] No live `mcp_server/database/**` shard or host daemon was used.
- [x] The two guard-coverage follow-ons are documented and not fixed in this phase.
- [x] Final TypeScript, requested tests, strict spec validation, and comment-hygiene checks pass. Evidence: `tsc --noEmit` 0; provenance/guard vitest 18 pass / 28 env-skips; `validate.sh --strict` 0/0; comment hygiene clean (rerun at epic review close, 2026-06-11; corroborated by `review/review-report.md`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
