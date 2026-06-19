---
title: "Implementation Summary: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry"
description: "Implemented Q2-C1 parser resilience: transient/fatal retry policy, additive retry_class storage, default max_retries=5, durable attempt_count budgeting, transient self-heal, fatal manual-review behavior, deterministic unit tests, typecheck, build, broad related vitest, and strict spec validation."
trigger_phrases:
  - "Q2-C1 implementation summary parser transient fatal"
  - "code graph bounded retry implemented"
  - "parser skip-list self-heal shipped locally"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience"
    last_updated_at: "2026-06-19T14:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Q2-C1 parser resilience"
    next_safe_action: "No implementation task remains; commit intentionally deferred per user instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-007-parser-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Owner sign-off satisfied by the 2026-06-19 user request that pre-approved the phase and requested implementation"
      - "TRANSIENT mapping covers WASM memory trap/OOM/timeouts/deadlines; unknown defaults FATAL"
      - "retry_class is additive storage; attempt_count remains the durable retry budget"
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/007-parser-resilience` |
| **Completed** | 2026-06-19 |
| **Level** | 1 |
| **Candidates** | Q2-C1 / `Q2-C1-parser-transient-fatal` (DONE) |
| **Shipped In** | Local workspace implementation, not committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Q2-C1 is implemented in the real Code Graph MCP subsystem. The parser skip-list now separates the existing crash cohort (`B1` / `B2` / `OTHER`) from a new retry policy axis (`transient` / `fatal`). A transient file remains eligible for a later parse until its durable `attempt_count` reaches `max_retries`; default is 5 via `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`. A fatal file is skipped immediately and remains manual-review-only.

Delivered behavior:

- `parser-skip-list.ts` now exposes raw entry reads, skip decisions, retry-class mapping, bounded promotion, and transient-only `recordSuccess` cleanup.
- `code-graph-db.ts` adds an additive `retry_class` column to `parser_skip_list`; legacy rows default to `fatal`.
- `tree-sitter-parser.ts` feeds both crash cohort and retry policy into the skip-list, clears transient entries after non-error parses, and preserves global B2 quarantine behavior.
- `structural-indexer.ts` classifies fallback parse exceptions before returning the existing empty-node error result, so poison-pill isolation stays intact.
- `parser-skip-list.vitest.ts` covers transient self-heal, exhaustion to fatal, fatal-from-first, poison-pill isolation, mapping fail-closed behavior, legacy schema upgrade, and B1/B2/OTHER preservation.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change stayed inside `.opencode/skills/system-code-graph/mcp_server` plus this phase packet. No packet 030 files were edited and no git commit was made.

The storage change is additive. Existing skip-list rows get `retry_class='fatal'`, which preserves old behavior until a new transient failure is explicitly recorded. `attempt_count` remains the durable retry budget, so process restarts or mid-scan crashes do not refresh a file's retry allowance.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the user request as owner sign-off | The 2026-06-19 request explicitly pre-approved this phase and asked to implement it, satisfying the no-self-heal reversal gate. |
| Add `retry_class` instead of overloading `error_class` | B1/B2/OTHER remains useful crash taxonomy; retry policy is an independent durable axis. |
| Default legacy and unknown failures to FATAL | Existing data keeps old permanent-skip behavior, and ambiguous new errors fail closed instead of retrying indefinitely. |
| Keep `max_retries` out of schema | The ceiling is operational policy, not per-row data; default 5 is configurable by env. |
| Keep benchmark/ranking behavior untouched | This phase is scan-time parser resilience only; no ranking or benchmark-acceptance defaults changed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline typecheck | PASS — `npm --prefix .opencode/skills/system-code-graph run typecheck`, 0 errors |
| Baseline broad related vitest | PASS — 5 files / 137 passed / 1 skipped |
| Focused affected vitest | PASS — 3 files / 42 passed |
| Final typecheck | PASS — `npm --prefix .opencode/skills/system-code-graph run typecheck`, 0 errors |
| Final build | PASS — `npm --prefix .opencode/skills/system-code-graph run build` |
| Final broad related vitest | PASS — 5 files / 144 passed / 1 skipped |
| Alignment drift | PASS — 158 files scanned, 0 findings |
| Strict spec validation | PASS — `validate.sh --strict` on this phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No live MCP scan, benchmark, reindex, or DB benchmark was run. This was deliberate per user instruction.
2. Q2-C2 content-addressed edge endpoints remain out of scope.
3. The older packet 030 shipped record still does not list Q2-C1; this phase implements it locally without touching packet 030.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Research evidence**: `../research/iterations/iteration-002.md` (Q2 findings 8/9/10, `cand-Q2-C1`), `../research/deltas/iter-002.jsonl` (`f2-8`, `cand-Q2-C1`)
- **External source**: `../../external/aionforge-memory-development/docs/consolidation.md:60-68`
- **Roadmap**: `../../research/roadmap.md` (Spine 6 — Q2-C1 row; owner sign-off note)
- **Wave-0 shipped record**: Wave-0 record (historical reference: Q2-C1 was absent there)
<!-- /ANCHOR:related-docs -->
