---
title: "Implementation Summary: Daemon Freshness and Health Truthfulness"
description: "Broke the dist-freshness deadlock that falsely reported a fresh build as stale, exempted --help/--version from the freshness gate, and made the health exclusion-audit fire again."
trigger_phrases:
  - "daemon freshness deadlock fixed"
  - "dist freshness cache prime"
  - "health content_text exclusion audit"
  - "spec-memory cli argv exempt"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-04T14:25:46.137Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified phase 011; deadlock broken, build clean, 20/20 freshness tests pass"
    next_safe_action: "Proceed to phase 001 (corpus identity repair)"
    blockers: []
    key_files:
      - "scripts/lib/dist-freshness.cjs"
      - "mcp_server/scripts/finalize-dist.mjs"
      - "bin/spec-memory.cjs"
      - "mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-011-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Exit-75 taxonomy: stale-dist stays inside 75 as a documented non-retryable sub-case (live consumer contract preserved)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-daemon-freshness-and-health-truthfulness |
| **Completed** | 2026-07-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dist-freshness checker no longer deadlocks. A successful build now pre-warms the per-entry source-hash cache, so the very next freshness check short-circuits to "fresh" instead of falling through to the mtime comparison that could never write the cache. This removes the false-stale state that blocked the compiled validator and the memory CLI for an entire working session.

### Freshness deadlock fix

`finalize-dist.mjs` now calls a new `writePackageSourceHashCache` helper after `tsc --build` succeeds. The helper is exported from the checker itself and reuses the checker's own `collectSourceFiles` enumeration plus `hashSourceFiles`/`cachePathFor`, so the finalizer hashes exactly the file set the checker will later compare against. If those two ever diverged the cache would never match and the deadlock would return, so keeping the enumeration single-sourced is the load-bearing invariant.

### CLI argv exemption and health truthfulness

`spec-memory.cjs` now exempts `--help`, `--version`, and `completion` from the freshness gate, so usage and version output work even when a rebuild is genuinely pending. Stale-dist stays on exit 75 as a documented non-retryable sub-case rather than moving to a new code, preserving the live "75 = retryable" consumer contract while flagging the sub-case in the recovery text. The health exclusion-audit now queries `content_text` instead of the nonexistent `content` column, so the audit's prepared statement no longer throws and the silent-risk diagnostic can actually fire.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/lib/dist-freshness.cjs` | Modified | Export `writePackageSourceHashCache` reusing `collectSourceFiles`; unify recovery texts |
| `mcp_server/scripts/finalize-dist.mjs` | Modified | Pre-warm the per-entry hash cache after a successful build |
| `bin/spec-memory.cjs` | Modified | Exempt `--help`/`--version`/`completion` from the gate; stale-dist sub-case; suppress ExperimentalWarning |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | `content` → `content_text`; sampled-orphan label; mismatchedIds cap; last-scan without runtime |
| `mcp_server/handlers/session-health.ts` | Modified | Expose last CLI-fallback status |
| `mcp_server/hooks/spec-memory-cli-fallback.ts` | Modified | Record and surface the fallback skip reason |
| `mcp_server/hooks/warm-cli-fallback-envelope.ts` | Modified | Carry `timedOut` on the envelope so fallback status can read it (final-verify correction) |
| `mcp_server/tests/dist-freshness.vitest.ts` | Modified | Deadlock-bootstrap regression coverage |
| `feature_catalog/16--tooling-and-scripts/dist-freshness-enforcement.md` | Modified | Corrected exit taxonomy and hash-cache paragraph |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the changes in an isolated git worktree; Opus 4.8 final-verified in the main build environment. Verification exercised the fixes end to end: `tsc --build` clean, the freshness check returns fresh immediately after a build (deadlock broken), `spec-memory.cjs --help`/`--version` exit 0 (previously exit 75), `memory_health` returns JSON instead of the stale-dist error, and the dist-freshness vitest suite passes 20/20. Final-verify also caught and corrected one type-threading gap: the fallback envelope did not carry `timedOut`, which the new status recorder reads.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pre-warm the cache in the finalizer rather than change the mtime gate | The mtime gate is correct; the bug was that a stale entry never reached the cache write, so priming it after a known-good build is the minimal fix |
| Reuse `collectSourceFiles` in the finalizer | If the finalizer hashed a different file set than the checker enumerates, the cache would never match and the deadlock would silently return |
| Keep stale-dist on exit 75 | Downstream hooks and doctor routes treat 75 as retryable; documenting a non-retryable sub-case avoids breaking that contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --build` (main tree) | PASS (exit 0, clean) |
| Freshness fresh after build (deadlock) | PASS (validation-orchestrator stale:false) |
| `spec-memory.cjs --help` / `--version` | PASS (exit 0; was 75) |
| `memory_health` returns JSON | PASS (no stale-dist error) |
| dist-freshness vitest | PASS (20/20) |
| `validate.sh --strict` | PASS (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full dist×argv×cache matrix deferred.** The regression test covers the deadlock-bootstrap path (20 cases). The exhaustive 4×4×3 state matrix and the hostile-env variant (CHK-FIX-005/006) are approved deferrals — low-risk since the core deadlock is regression-covered.
2. **CONTINUITY_FRESHNESS on `spec-memory.cjs` git-clean and the CONTINUITY_FRESHNESS import were not reproduced.** Both closed as not-a-bug against current code during verify-first.
<!-- /ANCHOR:limitations -->
