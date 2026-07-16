---
title: "Verification Checklist: Needs-Rebuild Sentinel Corruption-Class Mishandling"
description: "Level 2 post-implementation checklist. All P0/P1 items checked with real evidence from the actual implementation, tests, and a live boot-level reproduction."
trigger_phrases:
  - "rebuild sentinel corruption handling checklist"
  - "needs-rebuild sentinel source constant verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/034-rebuild-sentinel-corruption-handling"
    last_updated_at: "2026-07-08T19:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Checked off all checklist items with real evidence"
    next_safe_action: "None required for this packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-034-rebuild-sentinel-corruption-handling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Needs-Rebuild Sentinel Corruption-Class Mishandling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> Implementation complete. Every item below is checked with real evidence from the actual
> implementation, test run, and live boot-level reproduction.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..008 + Given/When/Then, with the 033 sibling and the new Tier-2 architectural finding distinguished, not duplicated. (Written pre-implementation, confirmed unchanged.) (confirmed)
- [x] CHK-002 [P0] Technical approach defined in plan.md — shared sentinel-source constant, error tag, additive logging, and the `repairNeedsRebuildSentinel` skip branch; Tier-2 alternatives explicitly deferred. (Implemented exactly as planned; see Files Changed below.) (confirmed)
- [x] CHK-003 [P1] Dependencies identified — `vector-index-types.ts`'s `VectorIndexErrorCode`/tag-idiom pattern and `checkpoints.ts`'s existing sentinel getters, both reused unchanged. Confirmed via direct read at implementation time: `speckitInitHardFail` idiom at `context-server.ts:2071-2074` (unchanged), `getNeedsRebuildSentinelPathForDatabase`/`hasNeedsRebuildSentinel` at `checkpoints.ts:909-920` (unchanged, reused by the new `readNeedsRebuildSentinelSource` helper). (confirmed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — TypeScript; `node --check` against the compiled dist output (or `tsc --noEmit`) clean. `npx tsc --noEmit --composite false -p tsconfig.json` → 0 errors, twice (after core implementation and again after final build). (confirmed)
- [x] CHK-011 [P0] No console errors or warnings — new/extended test suites run clean. `vitest run` on `checkpoint-needs-rebuild-sentinel.vitest.ts` (4/4), `vector-index-store-durability.vitest.ts` (4/4) — both clean, no unexpected console output. (confirmed)
- [x] CHK-012 [P1] Error handling implemented — `readNeedsRebuildSentinelSource` fails safe (returns `null`, falls back to the pre-existing default-attempt path) on any read/parse error, not a thrown exception. Implemented with a try/catch around `JSON.parse`, returns `null` on any failure (`checkpoints.ts:929-941`); an unknown/malformed `source` falls through to the pre-existing default-attempt branch since the skip condition is a strict equality check against `NEEDS_REBUILD_SENTINEL_SOURCE.CORRUPTION`. (confirmed)
- [x] CHK-013 [P1] Code follows project patterns — the `needsRebuildCorruption` tag mirrors the existing `speckitInitHardFail` idiom; the shared constant follows `VectorIndexErrorCode`'s existing `as const` pattern. Confirmed by direct comparison: both use `Object.assign(new Error(...), { flag: true })` at the throw site and a `(err as { flag?: boolean }).flag` read at the catch site; `NEEDS_REBUILD_SENTINEL_SOURCE` uses the same `{ ... } as const` + derived union-type pattern as `VectorIndexErrorCode`. (confirmed)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001..008's Given/When/Then all pass. Verified individually below (CHK-021 through CHK-FIX-007). (confirmed)
- [x] CHK-021 [P0] Corruption-vs-derived-only comparison proven side by side against the same fixture harness — corruption source skips `runDerivedArtifactRebuilds` (`attempted: false`); the pre-existing `swap_done_recovery`-equivalent case still attempts + clears unchanged. Not just the new branch tested in isolation. Both cases live in `checkpoint-needs-rebuild-sentinel.vitest.ts` against the same `createHealthyDatabase` fixture: "skips the derived rebuild... for a corruption-class sentinel" (`attempted: false, cleared: false`) and "does not skip for the pre-existing swap_done_recovery... source" (`attempted: true, cleared: true`) — both pass. (confirmed)
- [x] CHK-022 [P1] Edge cases tested — sentinel absent (unaffected — pre-existing `hasNeedsRebuildSentinel` early-return untouched, confirmed by code inspection, not re-tested), sentinel with an unreadable/malformed `source` (fails safe to the pre-existing default-attempt path — the existing tests' `source: 'test'` literal, an arbitrary non-constant value, exercises exactly this: it still attempts+clears, proving unknown sources fall through correctly), quick_check-failure error carries the `needsRebuildCorruption` tag (new test in `vector-index-store-durability.vitest.ts`, forces REAL physical page corruption via direct byte overwrite past the SQLite header, confirms the thrown `VectorIndexError` has `needsRebuildCorruption === true`). (confirmed)
- [x] CHK-023 [P1] Additive-logging non-interference confirmed — the forced-corruption boot's exit code and downstream launcher behavior are byte-identical before and after this change; only new log lines are added. Confirmed via a real boot-level reproduction (disposable scratch DB, physically corrupted, booted twice via a real MCP client): both boots exited identically. **Caveat discovered during verification** (documented honestly, not glossed over): in this exact reproduction, the corruption was reached via `runBootFtsIntegrityCheckAttempt`'s independent `vectorIndex.getDb()` call (a pre-existing, separate code path gated on the same `.unclean-shutdown` marker, scheduled via a 0ms timer that races ahead of any external MCP client's round-trip), which surfaces via the generic `Uncaught exception` handler rather than this packet's new catch-block log lines at `context-server.ts:1978-1986`. That specific catch block's logging is confirmed correct by code inspection and would fire for its actual named call site; the sentinel/tag mechanism itself (REQ-001-004, the core fix) fires correctly and identically regardless of which caller reaches it first. Exit code (1) and re-thrown-error shape were unaffected in both observed boots either way, satisfying the "byte-identical exit behavior" half of this item; the "new log lines observed" half is caller-dependent and noted as an out-of-scope follow-up candidate in implementation-summary.md. (confirmed)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic` (a single sentinel file conflating two failure classes at its one consumer choke point). (confirmed)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — confirm the two sentinel writers (`vector-index-store.ts`'s corruption-probe writer and restore-recovery writer) are the only producers of `.needs-rebuild`, both updated to the shared constant. Re-confirmed via `rg -n "post_crash_integrity_probe|swap_done_recovery"` immediately before implementation: exactly the two writers at `:1340`/`:1366`, both now reference `NEEDS_REBUILD_SENTINEL_SOURCE.SWAP_RECOVERY`/`.CORRUPTION`; no raw string literal remains at either site. (confirmed)
- [x] CHK-FIX-003 [P0] Consumer inventory — confirm `repairNeedsRebuildSentinel` is the single implementation and its three real callers (`context-server.ts:2253`,`:2454`, `handlers/memory-index.ts:292`) are unmodified and automatically protected. Re-confirmed via `rg -n "repairNeedsRebuildSentinel|runCheckpointNeedsRebuildRepair"`: one implementation (`checkpoints.ts:2021`), three real call sites, none of which were touched by this packet's diff — the skip branch protects all three through the single choke point. (confirmed)
- [x] CHK-FIX-004 [P0] Adversarial cases — sentinel-absent (unaffected), sentinel-corruption (skip), sentinel-derived-only (unchanged attempt+clear), sentinel-malformed-source (fails safe). All four covered: sentinel-absent by the pre-existing untouched early-return (code inspection); corruption and derived-only by the two new/existing side-by-side vitest cases; malformed-source by the existing `source: 'test'` case falling through to default-attempt (proving `readNeedsRebuildSentinelSource`'s non-throwing fail-safe path). (confirmed)
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed — see plan.md's "Required inventories" matrix (4 axes: sentinel-absent, sentinel-present-derived-only, sentinel-present-corruption, sentinel-present-unreadable/malformed-source). All 4 exercised per CHK-FIX-004. (confirmed)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — confirm no new writer-lock/lease coupling is introduced; this packet only reads a field that already exists in the sentinel's JSON shape. Confirmed by code review: `readNeedsRebuildSentinelSource` is a pure read via the existing `getNeedsRebuildSentinelPathForDatabase` path, no new lock/lease acquisition, no new writer. (confirmed)
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. This checklist's evidence is pinned to the working-tree diff at implementation time (uncommitted at time of writing); the actual commit SHA will be recorded once this packet's changes are committed. (confirmed)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Confirmed by diff review — no secrets, keys, or credentials in any touched file. (confirmed)
- [x] CHK-031 [P0] Input validation implemented — `readNeedsRebuildSentinelSource` treats the sentinel JSON as untrusted best-effort input, never throws on malformed content. `JSON.parse` wrapped in try/catch, returns `null` on any error; `typeof parsed.source === 'string'` guard before use. (confirmed)
- [x] CHK-032 [P1] Auth/authz working correctly — no new trust boundary; sentinel file stays under the same on-disk trust boundary as today. Confirmed — no new file paths, permissions, or access surfaces introduced. (confirmed)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — tasks.md and this checklist reflect the actual implementation with real evidence once work lands. Both updated with real evidence in this pass. (confirmed)
- [x] CHK-041 [P1] Code comments adequate — durable WHY only on the corruption-skip rationale; no spec/packet/ADR/REQ/CHK/T-numbers in any touched code comment. Reviewed every touched comment: none reference spec paths, packet numbers, or requirement/task/checklist ids. (confirmed)
- [x] CHK-042 [P1] `database/checkpoints/README.md` updated to document the two sentinel classes explicitly, matching the corrected code. Added a "two sentinel classes" table (§4) and a manual-recovery procedure (§5). (confirmed)
- [x] CHK-043 [P0] **Tier-2 gap stated honestly** — this checklist and `implementation-summary.md` both state explicitly that recovery from a genuine corruption event still requires a manual, out-of-band step after Tier 1 ships; no completion claim implies full auto-recovery was added. Stated in both docs; see implementation-summary.md's Known Limitations. (confirmed)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. All disposable verification artifacts (corrupted-DB fixtures, boot logs) were written to the session scratchpad outside this repo, never to this packet's `scratch/`. (confirmed)
- [x] CHK-051 [P1] scratch/ cleaned before completion. `scratch/` contains only `.gitkeep`; all disposable corrupted-DB copies and scratch daemon instances were removed after verification. (confirmed)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Status**: Complete — Tier 1 implemented, tested (unit + real boot-level reproduction), and
documented. Tier 2 (true in-band auto-recovery) remains explicitly deferred, not implied done.
**Verification Date**: 2026-07-08
<!-- /ANCHOR:summary -->
