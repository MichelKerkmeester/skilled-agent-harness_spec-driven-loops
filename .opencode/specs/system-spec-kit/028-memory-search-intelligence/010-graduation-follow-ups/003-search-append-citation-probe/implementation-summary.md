---
title: "Implementation Summary: Search Append-Exempt Serializer + True-Citation Density Probe"
description: "Tail-appended search rows now survive the response-serialization token-budget trim, and the true-citation ledger reports when it holds enough usable pairs to train a reranker. Both behind their existing default-off flags, byte-identical when off."
trigger_phrases:
  - "append-exempt implementation summary"
  - "density probe implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/003-search-append-citation-probe"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented both follow-ups and authored tests"
    next_safe_action: "Hand the vitest pass to the cli executor"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/true-citation-emitter.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/append-exempt-serializer.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/true-citation-emitter.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-search-append-citation-probe |
| **Completed** | 2026-06-24 (code + tests; cli test pass pending) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 009 validation cleared the dark-flag winners but left two search-layer gaps open. Both are now closed behind their existing default-off flags, and both are byte-identical when those flags are off.

### Tail appends survive the serializer's token budget

The tail-append stage (deterministic multi-hop and lane-champion backfill) adds rows past the requested limit, and those rows correctly bypass the Stage-4 cap. But a second truncation at the response-serialization layer pops rows off the END of the result array to fit a token budget, which is exactly where the appended rows live. So the appends survived one cap only to be dropped by the next.

The formatter now marks every tail-appended row with `appendExempt: true`, derived from the `source` / `sources` markers the append modules already stamp (`multihop`, `lane-champion:<lane>`). The serializer's trim loop calls a new pure helper, `selectBudgetTrimIndex`, which drops by a fixed priority: ordinary rows first from the tail, then additive backfill (`appendExempt`) rows, then constitutional pins last. Two protections follow from a deep review of this work. It always reserves at least one non-backfill (primary) row, so the hardest budget squeeze can never collapse the answer to backfill-only and evict the top-scored requested result (P1-6). And it treats constitutional / always-surface rows as at least as protected as a backfill, so a squeeze never drops a pinned rule before an additive backfill (P2-14). When no row is `appendExempt` and no row is constitutional — the case whenever both append flags are off on an ordinary result set — the helper returns the last index every pass, so the trim is byte-for-byte the original `pop()`-from-end.

### The true-citation ledger now reports its training readiness

The `SPECKIT_TRUE_CITATION_EMITTER` ledger only becomes worth training a reranker on once it holds enough used/not-used pairs, but nothing measured that. `probeTrueCitationDensity` now reports the count of usable session-scoped pairs (`usedPairs` + `notUsedPairs`, both with a non-null session) and decides whether the corpus has crossed a reranker-training threshold. Legacy null-session rows count toward the raw `total` but never toward the usable count, because they can never yield session-scoped training data. Graduation is not a count alone: a deep review found the original both-classes gate passed a 199:1 split, so the gate now also requires each class to clear an absolute floor (`RERANKER_TRAINING_MIN_PER_CLASS`) AND the minority class to clear a ratio floor (`RERANKER_TRAINING_MIN_MINORITY_RATIO`). A lopsided ledger clears the count yet starves the minority class, so it is rejected (P2-12); a single-class ledger never graduates at all. When all gates pass, the probe returns an advisory string a caller can surface. `memory_health` now surfaces this reading, gated behind the emitter flag and a live DB, so its payload is unchanged when the flag is off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/formatters/search-results.ts` | Modified | `appendExempt` field + `isTailAppendedRow` detection from `source`/`sources` |
| `mcp_server/context-server.ts` | Modified | `selectBudgetTrimIndex` pure helper; tiered trim that reserves a primary row and pins constitutional rows above backfills |
| `mcp_server/lib/feedback/true-citation-emitter.ts` | Modified | `probeTrueCitationDensity` + count, per-class, and minority-ratio thresholds |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Surfaces the probe in `memory_health`, flag-gated |
| `mcp_server/tests/append-exempt-serializer.vitest.ts` | Created | Marking + tiered trim-selection (P1-6, P2-14) + survival tests |
| `mcp_server/tests/true-citation-emitter.vitest.ts` | Modified | Density-probe tests incl. the 199:1 lopsided regression (P2-12) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Everything lands behind the existing default-off flags. The marker is set only on appended rows, so the flag-off response carries no `appendExempt` key at all (proven by test A2). The trim selection collapses to the original `pop()` when no row is exempt and no row is constitutional (test B1, C2) — the constitutional-sparing of P2-14 changes behavior only when a pinned row is present and a squeeze actually fires, which is independent of the append flags. The density probe surfaces in `memory_health` only when `SPECKIT_TRUE_CITATION_EMITTER` is on and a DB is present, so the health payload is unchanged when off. Type safety was verified with `tsc`, and the trim and density logic were cross-checked by a standalone simulation; the two vitest suites are authored and handed to the cli executor for the test pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark appends in the formatter, honor in the serializer | The formatter is where rows become the response envelope; the serializer is the only second truncation point. Splitting producer/consumer keeps each change minimal. |
| `selectBudgetTrimIndex` returns the last index when nothing is exempt | This is the byte-identity guarantee — the flag-off path is the original pop()-from-end, line for line. |
| Density threshold = 200 usable session-scoped pairs, both classes required | A conservative floor for a binary pairwise ranker; a single-class ledger has nothing to discriminate, so it never graduates. |
| Exclude null-session rows from the usable count | The 1711 pre-fix null-session rows can never be session-scoped, so counting them would overstate readiness. |
| Surface the probe in `memory_health` behind the flag | The task asked for a surface through the existing health query; gating keeps the off-path byte-identical. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit --composite false -p mcp_server/tsconfig.json` | Exit 2, ONLY the pre-existing tsconfig `baseUrl` TS5101 deprecation. Proven pre-existing by git-stashing all four source edits and re-running (same error on the clean baseline). |
| Same command with `--ignoreDeprecations 6.0` (silences the pre-existing deprecation) | PASS, exit 0, zero source errors. |
| Test files typecheck (scratch tsconfig including tests) | PASS, exit 0, zero errors. |
| Vitest pass over the two suites | PENDING, deferred to the cli executor per the task instruction. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reranker threshold (200) is a judgment value, not a measured one.** It is a conservative floor for a binary pairwise ranker. When live session-carrying traffic accumulates, the threshold can be tuned against the actual class balance; `probeTrueCitationDensity` accepts a custom threshold argument for exactly this.
2. **The serializer fix only addresses the token-budget trim in the context-server after-tool callback.** That is the only second truncation point that pops `data.results`; if another truncation site is added later, it must also honor `appendExempt`.
3. **The cli executor test pass is pending.** Code and tests are authored and tsc-clean, but the vitest suite was not run here, per the task instruction.
<!-- /ANCHOR:limitations -->
