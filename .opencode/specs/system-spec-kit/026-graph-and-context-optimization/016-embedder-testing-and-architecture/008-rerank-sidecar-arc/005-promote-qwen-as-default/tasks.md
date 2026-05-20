---
title: "Tasks: Promote Qwen3-Reranker-0.6B as the spec-memory default [template:level_1/tasks.md]"
description: "Task breakdown for the decision-gated final promotion phase."
trigger_phrases:
  - "005 tasks promote qwen"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Wait for phase 004 verdict"
    blockers: ["awaiting phase 004 benchmark report"]
---
# Tasks: Promote Qwen3-Reranker-0.6B as the spec-memory default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Path-tag:** [P] = PROMOTE-only, [H] = HOLD-only, [B] = both paths
- **Evidence:** file:line, diff, smoke output
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | [B] Read `benchmarks/benchmark-2026-MM-DD-rerank-ab/benchmark_report.md` §8 RECOMMENDATIONS | `[ ]` | (pending phase 004) |
| T002 | P0 | [B] Quote verbatim §8 into this packet's `implementation-summary.md` §2 | `[ ]` | (pending) |
| T003 | P0 | [B] Choose PROMOTE or HOLD path; document in implementation-summary.md | `[ ]` | (pending) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | [P] Edit `cross-encoder.ts:55` — change `local.model` from ms-marco to `Qwen/Qwen3-Reranker-0.6B` | `[ ]` | (pending) |
| T005 | P0 | [P] Update cross-encoder.ts comment block (lines 8-21) to reflect new default | `[ ]` | (pending) |
| T006 | P0 | [P] Add `SPECKIT_CROSS_ENCODER=true` to `.mcp.json` spec-memory env block | `[ ]` | (pending) |
| T007 | P0 | [P] Add `SPECKIT_CROSS_ENCODER=true` to `opencode.json` | `[ ]` | (pending) |
| T008 | P0 | [P] Add `SPECKIT_CROSS_ENCODER=true` to `.gemini/settings.json` | `[ ]` | (pending) |
| T009 | P0 | [P] Add `SPECKIT_CROSS_ENCODER=true` to `.codex/config.toml` | `[ ]` | (pending) |
| T010 | P0 | [B] Update ENV_REFERENCE.md `SPECKIT_CROSS_ENCODER` row per chosen path's wording | `[ ]` | (pending) |
| T011 | P0 | [B] Update `embedder_architecture.md` Stage 3 section per chosen path | `[ ]` | (pending) |
| T012 | P1 | [P] Update `system-rerank-sidecar/SKILL.md` cross-reference (spec-memory adoption) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | [B] Strict validate this packet | `[ ]` | Exit 0 |
| T014 | P0 | [B] Path-correctness audit: `git diff HEAD~1 -- <expected files>` matches chosen path | `[ ]` | Diff shape verified |
| T015 | P0 | [P] Cold-start integration smoke: spec-memory uses Qwen by default | `[ ]` | trace shows `provider: 'local'` + Qwen model |
| T016 | P0 | [B] Update arc parent `graph-metadata.json` `last_active_child_id` to 005 | `[ ]` | (pending) |
| T017 | P0 | [B] Update arc parent `spec.md` phase-map row for 005 with path-specific status | `[ ]` | (pending) |
| T018 | P0 | [B] Update arc parent `graph-metadata.json.derived.status` to `complete` | `[ ]` | (pending) |
| T019 | P0 | [B] Strict validate arc parent | `[ ]` | Exit 0 |
| T020 | P1 | [B] Commit; final arc-complete summary in commit message | `[ ]` | Single commit on main |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All path-applicable tasks complete with evidence. Arc 008 ships when T020 lands.

Potential future packet — `006-shared-deduplication-from-cocoindex` — is a SEPARATE arc concern, not blocking this phase's completion.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-008 mapping to T001..T015
- `plan.md` §3 Architecture — decision-driven dispatch + smoke procedure
- Predecessor `../004-spec-memory-rerank-benchmark/` — provides the §8 verdict
- Arc parent `../spec.md` — receives the final status update
- Reference (cross-encoder.ts current state): `lib/search/cross-encoder.ts:34-62` (PROVIDER_CONFIG table)
- Reference (ENV_REFERENCE row pattern): row already exists; this phase updates wording
<!-- /ANCHOR:cross-refs -->
