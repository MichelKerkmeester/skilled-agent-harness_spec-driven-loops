---
title: "Implementation Summary: 015-Residual Correctness - RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "Two Wave-0 always-on correctness residuals implemented in this phase. A4 routes resolveSearchScore through the 015-calibrated absolute scale. A7 derives the maintenance marker TTL from ownerLease.ttlMs x K with two codified invariants. No schema migration, no shared-infra dependency."
trigger_phrases:
  - "015 residual correctness summary"
  - "resolveSearchScore rrf scale status"
  - "maintenance marker ttl lease summary"
  - "phase yield refresh invariant status"
  - "wave-0 memory correctness implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-07-06T19:16:33.681Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented both residual correctness candidates and verified focused code/test gates"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-residual-correctness"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 021-residual-correctness |
| **Completed** | 2026-06-19, both candidates DONE in this phase |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase implements two always-on correctness residuals the 008 retrieval-evaluation campaign surfaced. Both are Wave-0, independent, schema-free and reversible. Packet 030 remains untouched, this phase carries the implementation record.

### A4-015-residual, the RRF-scale residual

The 015 search-intelligence fix corrected a scale mismatch: ranking confidence must read the absolute, 0–1 cosine relevance signal, not the RRF ordering magnitude. That fix was scoped to `confidence-scoring.ts` and never reached the re-route and average-score path. This phase routes `resolveSearchScore` through `resolveAbsoluteRelevance` for semantic rows, uses `averageSimilarity` as the semantic fallback when that is the available field and falls back to the effective score for lexical-only rows. Rows without any finite score signal are still excluded from the average. The before/after fixed-fixture average moved from `0.032` to `0.715`, which is the expected correctness change from RRF magnitude to cosine-scale relevance.

### A7-maintenance-grace-ttl, the TTL-as-a-relationship residual

When a daemon runs a long background phase it writes a `.maintenance-active.json` marker so a competing launcher adopts it instead of reaping it as wedged. The marker TTL was a hardcoded `180_000`. This phase replaces the literal with exported derivation constants: owner lease TTL `60_000`, stale-reclaim multiplier `2`, marker multiplier `3` and marker TTL `180_000`. The runtime value is byte-identical, while tests now assert it stays greater than the stale-reclaim window and matches the launcher lease literal. The module comments document the stale-reclaim relationship and the refresh-before-half-window rule. The lease heartbeat, reclaim window and launcher guard were not changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified (A4) | Route `resolveSearchScore`/`computeAverageScore` through the 015-calibrated absolute-relevance scale, effective-score fallback for lexical-only rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Modified (A7) | Derive `MAINTENANCE_MARKER_TTL_MS` from owner-lease constants, document the stale-reclaim and refresh invariants |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts` | Modified | Assert cosine-scale average, lexical-only fallback, skipped no-signal rows and `averageSimilarity` normalization |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Modified | Assert TTL derivation, reclaim-safe margin, byte-identical value and `activeUntilMs = now + TTL` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as small, independent, reversible hunks. A4 is one handler helper edit plus known-scale fixture tests. A7 is one marker constant-derivation edit plus invariant comments and marker tests. Verification covered baseline typecheck/vitest, final typecheck/vitest/build, alignment drift, comment hygiene and two falsifier runs that proved the new A4 and A7 assertions fail when the guarded behavior is broken.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `resolveAbsoluteRelevance` for A4 rather than an inline read | Keeps `resolveSearchScore` reading the exact scale `confidence-scoring.ts` reads, so the two paths cannot drift into a second scale-mismatch |
| Gate the A4 absolute read on a finite semantic score | The absolute signal is only interpretable when a semantic score exists. Lexical-only rows fall back to the effective score and rows without any score signal stay excluded from the average |
| Derive A7's TTL with `K = 3` | Keeps the on-disk value byte-identical at 180000 while making the `marker-TTL > 2×-reclaim` relationship explicit and test-guarded |
| Keep A7's lease coupling soft | Derive from exported marker constants and assert the launcher literal in tests, so the marker module gains no runtime dependency on launcher config |
| Verify A4 independently before editing | The research marked A4 inferred, the seam read confirms the 015 fix is confined to `confidence-scoring.ts` and `resolveSearchScore` is the unpatched path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| A4-015-residual implemented | DONE, `resolveSearchScore` now reads cosine-scale absolute relevance for semantic rows and effective score for lexical-only rows |
| A7-maintenance-grace-ttl implemented | DONE, `MAINTENANCE_MARKER_TTL_MS` derives from owner-lease constants and remains 180000 |
| A4 residual independently verified | DONE (seam read), 015 fix confined to `confidence-scoring.ts:343,402-403`, `resolveSearchScore` (`memory-search.ts:494-499`) is the unpatched re-route path |
| A7 invariant confirmed against live values | DONE (seam read), lease `ttlMs:60000` (`mk-spec-memory-launcher.cjs:419`), reclaim `×2 = 120s` (`:455-456`), marker `180_000` (`maintenance-marker.ts:25`) > 120s by 60s |
| Packet 030 untouched | DONE, implementation and docs stayed in this phase and MCP-server scope |
| `npm run typecheck` | PASS, baseline and final runs green in `.opencode/skills/system-spec-kit/mcp_server` |
| Focused vitest | PASS, baseline 3 files / 32 tests, final 3 files / 36 tests |
| `npm run build` | PASS, `tsc --build && node scripts/finalize-dist.mjs` |
| Alignment drift | PASS, scanned 1132 files, 0 findings |
| Comment hygiene | PASS, touched code/test files clean |
| Falsifier checks | PASS, A4 semantic-score mutation failed 2 assertions, A7 multiplier mutation failed the reclaim-margin assertion |
| `validate.sh --strict` on this packet | PASS, Level 2, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A4 changes recall-confidence magnitudes by design.** Reading the calibrated absolute scale instead of the RRF magnitude shifts the numbers `computeAverageScore` returns. The fixed fixture moved `0.032 -> 0.715`.
2. **Effort is structural inference, not a benchmark.** The "S" tags, like every estimate in the 028 roadmap, are reasoning estimates, never build-measured. Both ship for correctness and reversibility, not a promised delta.
3. **A7's residual risk is a future non-yielding phase.** The phase-yield invariant covers the current phases via the existing 200-row / phase-boundary refresh hooks. A new synchronous phase longer than the TTL without a refresh hook would still risk a false reap, and the module comment names this as the maintainer's contract.
<!-- /ANCHOR:limitations -->
