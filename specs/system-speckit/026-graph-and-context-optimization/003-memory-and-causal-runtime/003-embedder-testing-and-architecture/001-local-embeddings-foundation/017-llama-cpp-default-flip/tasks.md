---
title: "Tasks: 017 llama-cpp default flip"
description: "Task ledger for pre-flight, migration, runtime config cascade, validation, rollback, docs, and parent close-out."
trigger_phrases:
  - "017 llama cpp tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip"
    last_updated_at: "2026-05-13T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded completed task ledger"
    next_safe_action: "Review implementation-summary.md for auto cascade metrics and fallback behavior"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:2170170170170170170170170170170170170170170170170170170170170170"
      session_id: "017-llama-cpp-default-flip-2026-05-13"
      parent_session_id: "017-llama-cpp-default-flip-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 017 llama-cpp default flip

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Symbol | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Not completed |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T000 | Inspect factory default resolution | Done | `scratch/pre-flight-notes.md` |
| T001 | Inspect `LlamaCppProvider` | Done | `scratch/pre-flight-notes.md` |
| T002 | Inventory sqlite stores | Done | `scratch/migration-targets.md`: 2488 rows, 92.29 MiB |
| T010 | Implement default flip/fallback chain | Done | `factory.ts` final auto path cascades through Voyage -> OpenAI -> llama-cpp -> hf-local |
| T011 | Add install helper | Done | `scripts/install-llama-cpp.sh` |
| T012 | Update `.env.example` | Done | final notes document llama-cpp auto-selection when GGUF runtime is installed |
| T013 | Normalize llama-cpp slug | Done | slug `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8` |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T020 | Add migration helper | Done | `scripts/migrate-embeddings-to-llama-cpp.ts` |
| T021 | Add migration pending warning | Done | `getStartupEmbeddingProfile()` warns for explicit llama-cpp empty target |
| T022 | Write migration runbook | Done | `scratch/migration-runbook.md` |
| T023 | Run live migration | Done | 2488 rows, 0 mismatches, 130.117s |
| T030 | Update Codex config notes | Done | `.codex/config.toml` final auto cascade notes |
| T031 | Update Claude config notes | Done | `.claude/mcp.json` final auto cascade notes |
| T032 | Update Gemini config notes | Done | `.gemini/settings.json` final auto cascade notes |
| T033 | Update OpenCode config notes | Done | `opencode.json` final auto cascade notes |
| T034 | Update MCP README | Done | optional llama-cpp section |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T040 | Run 1k retrieval probe | Done | MILD_DIVERGENCE |
| T041 | Run final latency benchmark | Done | llama p50 6.027083ms; hf p50 35.956375ms |
| T042 | Run MCP-path smoke | Done | PASS, 3809.154ms |
| T050 | Author packet docs | Done | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` |
| T051 | Strict validate packet | Done | final strict validator exits 0 |
| T052 | Update parent graph metadata | Done | last active child points to 017 |
| T053 | Update parent status/summary | Done | parent status complete with auto cascade close-out |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] Migration completed with 2488 target rows and zero mismatches.
- [x] 1k retrieval probe completed and controlled the default decision.
- [x] Operator accepted MILD_DIVERGENCE; llama-cpp stays in the auto cascade with hf-local as fallback.
- [x] Runtime configs and docs reflect the final auto cascade state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `scratch/migration-run-results.json`
- `scratch/probe-1k-results.json`
- `scratch/bench-final-results.json`
- `scratch/end-to-end-smoke.md`
<!-- /ANCHOR:cross-refs -->
