---
title: "Implementation Summary: 015-Residual Correctness — RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "Two Wave-0 always-on correctness residuals, both PENDING (neither in the 030 shipped record): A4 routes resolveSearchScore through the 015-calibrated absolute scale; A7 derives the maintenance marker TTL from ownerLease.ttlMs x K with two codified invariants. No schema migration, no shared-infra dependency."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author impl-summary; both A4-015-residual and A7-maintenance-grace-ttl PENDING (not in 030)"
    next_safe_action: "Implement A4: route resolveSearchScore through resolveAbsoluteRelevance"
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
    completion_pct: 0
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
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/021-residual-correctness |
| **Completed** | Not started — both candidates PENDING (specified, not yet coded) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is shipped yet. This sub-phase specifies two always-on correctness residuals the 008 retrieval-evaluation campaign surfaced — both Wave-0, both independent, neither present in the 030 shipped record, so both are PENDING. The document records the specified work honestly, with the seams confirmed by direct reads.

### A4-015-residual — the RRF-scale residual (pending)

The 015 search-intelligence fix corrected a scale-mismatch: ranking confidence must read the absolute, 0–1 cosine relevance signal, not the RRF ordering magnitude, which sits near 0.03 for the default `DEFAULT_K = 40` fusion and is calibrated for ordering, not for thresholds. That fix was scoped to `confidence-scoring.ts` and never reached the re-route and average-score path. The residual lives in `resolveSearchScore` (`handlers/memory-search.ts:494-499`): it prefers the RRF magnitude and applies a `> 1 ? /100` heuristic, so `computeAverageScore` averages the wrong scale. The fix routes that read through the same absolute-relevance signal the 015 fix uses — ideally the existing `resolveAbsoluteRelevance` helper, so the two paths cannot drift again — gated on the vector lane having fired (`row.similarity` present), with an effective-score fallback for lexical-only rows. The campaign flagged A4 as inferred and asked for independent verification first; the seam read here is that verification.

### A7-maintenance-grace-ttl — the TTL-as-a-relationship residual (pending)

When a daemon runs a long background phase it writes a `.maintenance-active.json` marker so a competing launcher adopts it instead of reaping it as wedged; the launcher's `shouldAdoptDespiteProbe` guard refuses to reap a live child that holds a fresh marker. The marker TTL is hardcoded at `MAINTENANCE_MARKER_TTL_MS = 180_000`, justified only against an observed ~79s phase. The load-bearing fact is implicit: 180s must exceed the owner-lease 2× stale-reclaim window of 120s (lease `ttlMs` 60000, reclaim `×2`), or both the lease heartbeat and the marker can lapse together during a long blocking span and a competing launcher reaps a live mid-scan daemon. The fix derives the TTL from `ownerLease.ttlMs × K` with `K = 3` — byte-identical at 180000 today, but now auto-tracking the lease window — and writes the two invariants into the module: the `marker-TTL > 2×-lease-reclaim` ordering, and the phase-yield rule that every synchronous phase longer than TTL/2 must call `maintenance.refresh()`, which caps zombie reap-latency at exactly one TTL. The lease and launcher reclaim policy are untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Pending (A4) | Route `resolveSearchScore`/`computeAverageScore` (`:494-508`) through the 015-calibrated absolute-relevance scale; effective-score fallback for lexical-only rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Pending (A7) | Derive `MAINTENANCE_MARKER_TTL_MS` from `ownerLease.ttlMs × K (K=3)` (`:23-25`); document the two invariants (`:13-14,29-31`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Both fixes are planned as small, independent, reversible hunks on the 028 branch. A4 is one `resolveSearchScore` edit plus a known-scale fixture test (RRF magnitude versus cosine) and a lexical-only fallback case, with the before/after average magnitude captured per the regression-baseline rule. A7 is one constant-derivation edit plus invariant comments, a TTL-derivation unit test (`=== ttlMs × K`, `K > 2`, `> 2× reclaim`), and a re-run of the existing `launcher-maintenance-guard.vitest.ts`. Each lands behind typecheck, build, and strict packet validation. They can ship in either order.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `resolveAbsoluteRelevance` for A4 rather than an inline read | Keeps `resolveSearchScore` reading the exact scale `confidence-scoring.ts` reads, so the two paths cannot drift into a second scale-mismatch |
| Gate the A4 absolute read on `typeof row.similarity === 'number'` | The absolute signal is only interpretable where the vector lane fired; lexical-only rows fall back to the effective score (zero divergence by construction), never throw |
| Derive A7's TTL with `K = 3` | Keeps the on-disk value byte-identical at 180000 while making the `marker-TTL > 2×-reclaim` relationship explicit and test-guarded |
| Keep A7's lease coupling soft | Derive from a shared `LEASE_TTL_MS` constant (or a documented inline `K × 60000`) rather than importing launcher internals, so the marker module gains no hard dependency on launcher config |
| Verify A4 independently before editing | The research marked A4 inferred; the seam read confirms the 015 fix is confined to `confidence-scoring.ts` and `resolveSearchScore` is the unpatched path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| A4-015-residual implemented | PENDING — specified, not yet coded |
| A7-maintenance-grace-ttl implemented | PENDING — specified, not yet coded |
| A4 residual independently verified | DONE (seam read) — 015 fix confined to `confidence-scoring.ts:343,402-403`; `resolveSearchScore` (`memory-search.ts:494-499`) is the unpatched re-route path |
| A7 invariant confirmed against live values | DONE (seam read) — lease `ttlMs:60000` (`mk-spec-memory-launcher.cjs:419`), reclaim `×2 = 120s` (`:455-456`); marker `180_000` (`maintenance-marker.ts:25`) > 120s by 60s |
| Both candidates' shipped status traced to 030 | DONE — neither appears in `030-memory-search-intelligence-impl/spec.md` §14 (both PENDING) |
| `validate.sh --strict` on this packet | PASS — Level 2, exit 0 |
| A4/A7 unit + regression tests | PENDING — to run with the implementation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Neither residual is implemented.** This document records two PENDING Wave-0 fixes and their confirmed seams, not shipped code.
2. **A4 changes recall-confidence magnitudes by design.** Reading the calibrated absolute scale instead of the RRF magnitude shifts the numbers `computeAverageScore` returns. That is the intended correctness effect; the before/after delta is captured at implementation time per the regression-baseline rule, not waved away.
3. **Effort is structural inference, not a benchmark.** The "S" tags, like every estimate in the 028 roadmap, are reasoning estimates, never build-measured. Both ship for correctness and reversibility, not a promised delta.
4. **A7's residual risk is a future non-yielding phase.** The phase-yield invariant covers the current phases via the existing 200-row / phase-boundary refresh hooks; a new synchronous phase longer than the TTL without a refresh hook would still risk a false reap — the module comment names this as the maintainer's contract.
<!-- /ANCHOR:limitations -->
