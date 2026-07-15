---
title: "Implementation Summary: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)"
description: "Implementation summary for the staged code-graph generation watermark. Q6-C2 is implemented and verified, Q6-C1 remains DEFER-speculative."
trigger_phrases:
  - "code graph generation watermark implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/003-generation-watermark"
    last_updated_at: "2026-07-06T16:45:38.011Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented and verified Q6-C2 soft watermark"
    next_safe_action: "Keep Q6-C1 hard gate pending until Q1-C1 schema work has a named consumer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-generation-watermark |
| **Status** | complete |
| **Completed** | 2026-06-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Q6-C2 is built. The code-graph subsystem now stores a monotonic `generation` counter in the existing `code_graph_metadata` KV table, advances it from the scan promotion finalize path and surfaces it as an additive field on `metadata.freshness` from `code_graph_context`.

### Q6-C2 - Soft generation watermark (DONE)

Every promoted full scan or selective reindex advances `graph_generation`, unchanged incremental scans and failed promotions leave it unchanged. Callers gain an as-of-generation key they can compare across reads, while the read path stays byte-identical: no filter change, no error gate, no schema migration.

### Q6-C1 - Hard as-of-generation gate (DEFER-speculative, PENDING)

The hard gate would turn a stale read into an explicit ERROR rather than silently-stale edges ("a successful call is itself proof of freshness"). It is deferred: no named consumer wants as-of/time-travel reads today, and its safety is largely redundant with the shipped binary readiness gate. It is kept on the books because the monotonic counter Q6-C2 introduces is the close-out key the Q1-C1 bi-temporal cluster needs (today's close-outs would key on a non-monotonic timestamp).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Added `getCodeGraphGeneration()` / `bumpCodeGraphGeneration()` over `code_graph_metadata` |
| `system-code-graph/mcp_server/handlers/scan.ts` | Modified | Bumps generation in the `scanPromotable` finalize block for actual promotions |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Adds `generation` to the freshness envelope and stamps it in `computeFreshness()` |
| `system-code-graph/mcp_server/tests/code-graph-db.vitest.ts` | Modified | Covers unset/malformed generation and 0→1→2 increments |
| `system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Covers full/selective promotion bumps and failed/no-op no-bump paths |
| `system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Verifies the envelope carries generation while node/edge output stays byte-identical |
| `system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | Modified | Keeps mocked DB surface in parity with the new helper export |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Q6-C2 shipped as an additive, reversible metadata field with no feature flag and no read-filter change. The counter is persisted in `code_graph_metadata`, bumped only after scan promotion and read into the freshness envelope. Tests cover generation defaults, malformed metadata fallback, promotion increments, failed/no-op no-bump behavior and byte-identical node/edge ordering. Q6-C1 ships only with the Q1-C1 cluster decision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump at the `handlers/scan.ts` `scanPromotable` block, not `ensure-ready.ts:497` | The `:497` site is `setLastGitHead` inside the out-of-scope-HEAD return-fresh branch - it never fires on a real `full_scan`/`selective_reindex`. The finalize block is the one site that fires for both (research iter-23/24). |
| Store the counter in `code_graph_metadata`, not a new column | The KV table already exists with an int-as-string precedent, so Q6-C2 stays off the schema migration chokepoint and ships independently of Q1-C1. |
| Defer Q6-C1 rather than build it now | No named consumer wants as-of-generation reads, and the hard gate's safety is redundant with the shipped readiness gate (synthesis `01`/`04`). |
| Keep Q6-C1 on the books | Its counter is the monotonic close-out key the Q1-C1 bi-temporal cluster needs, dropping it would orphan that dependency. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `tsc --noEmit -p tsconfig.json` | PASS |
| Baseline targeted Vitest | PASS: 3 files / 54 tests |
| Post-change `tsc --noEmit -p tsconfig.json` | PASS |
| Post-change targeted Vitest | PASS: 4 files / 64 tests |
| Real-scan smoke Vitest | PASS: 1 file / 5 tests |
| Mutation falsifier | PASS: removing the bump call made the focused scan test fail (0 calls vs expected 2) |
| Alignment drift | PASS: scanned 155 files, 0 findings |
| Comment hygiene | PASS on touched source/test files |
| `validate.sh --strict` on this folder | PASS: 0 errors, 0 warnings |
| Q6-C1 status | LEFT PENDING: requires Q1-C1 schema cluster plus a named consumer |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Q6-C1 deferred.** The hard as-of-generation error gate remains DEFER-speculative, it ships only on a named-consumer decision plus the Q1-C1 bi-temporal cluster (`SCHEMA_VERSION` 5→6).
2. **Generated `dist/` not refreshed.** Verification used TypeScript source checks and Vitest, no build artifact update was requested.
3. **Commit.** Q6-C2 shipped in commit `99bfa4427d` (feat(028) first-wave build, which names the generation watermark), touching `code-graph-db.ts`, `handlers/scan.ts` and `code-graph-context.ts` plus the three vitest files.
<!-- /ANCHOR:limitations -->
