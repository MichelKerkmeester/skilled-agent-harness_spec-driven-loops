---
title: "Tasks: local-LLM feature test suite completion [template:level_1/tasks.md]"
description: "Open tasks for completing the missing local-LLM feature suite."
trigger_phrases:
  - "local-llm feature test suite completion"
  - "028 missing feature groups"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored open task list"
    next_safe_action: "Implement missing vitest groups and perf benches"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: local-LLM feature test suite completion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Priority**: P0 blocks packet completion; P1 can be deferred only with operator approval
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Re-read predecessor 028 spec rows 66-134 and 172. | `[ ]` | Planned |
| T002 | P0 | Confirm existing test folder layout and vitest config. | `[ ]` | Planned |
| T003 | P0 | Decide mock boundaries for provider availability and native modules. | `[ ]` | Planned |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Create 10 functional group vitest files. | `[ ]` | Planned |
| T005 | P0 | Create 4 deterministic benchmark files. | `[ ]` | Planned |
| T006 | P0 | Create suite README and baseline output directory handling. | `[ ]` | Planned |
| T007 | P0 | Stabilize cleanup for temp sqlite fixtures. | `[ ]` | Planned |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T008 | P0 | Run functional vitest suite. | `[ ]` | Planned |
| T009 | P0 | Run or dry-run benchmark command and inspect JSON output. | `[ ]` | Planned |
| T010 | P0 | Run strict-validate on the packet. | `[ ]` | Planned |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor `../028-local-llm-feature-test-suite/spec.md:66-134,172`
- `mcp_server/tests/local-llm-features/` planned suite root
- `shared/embeddings/factory.ts` and `shared/embeddings/profile.ts` provider/profile behavior
<!-- /ANCHOR:cross-refs -->
