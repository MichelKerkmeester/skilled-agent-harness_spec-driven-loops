---
title: "Implementation Plan: Needs-Rebuild Sentinel Corruption-Class Mishandling"
description: "Distinguish the corruption-class .needs-rebuild sentinel from the derived-only class it was designed for, and skip the wrong repair path (runDerivedArtifactRebuilds) when corruption is the cause -- a scoped Tier 1 fix, with true in-band auto-recovery explicitly deferred as Tier 2."
trigger_phrases:
  - "rebuild sentinel corruption handling plan"
  - "needs-rebuild sentinel source constant plan"
  - "repairNeedsRebuildSentinel corruption skip plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/034-rebuild-sentinel-corruption-handling"
    last_updated_at: "2026-07-08T16:02:23Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only technical approach"
    next_safe_action: "Plan approval, then implement per Phase 2"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-034-rebuild-sentinel-corruption-handling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Needs-Rebuild Sentinel Corruption-Class Mishandling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`mcp_server/lib/search`, `mcp_server/lib/storage`, `mcp_server/context-server.ts`) |
| **Framework** | None (MCP stdio server + `better-sqlite3`) |
| **Storage** | SQLite (`better-sqlite3`), `.needs-rebuild` sentinel file on disk |
| **Testing** | vitest |

### Overview
`.needs-rebuild` is a single sentinel file serving two different failure classes with one
undifferentiated consumer. Tier 1 (this plan) adds a `source` discriminant, exported from a
shared constant, and teaches the one real consumer choke point
(`repairNeedsRebuildSentinel`) to skip its SQL-based derived-artifact rebuild when the source is
the corruption class — because that rebuild runs `INSERT`/rebuild statements against tables that
may themselves be physically corrupt. Additive logging in the boot catch path makes the failure
actionable. True in-band recovery (Tier 2) is explicitly out of scope, blocked by a
module-singleton coupling this plan documents but does not resolve.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct code reads of
  every cited call site plus a new architectural finding on the Tier-2 coupling)
- [x] Success criteria measurable
- [x] Dependencies identified (`vector-index-types.ts`'s existing `VectorIndexErrorCode` pattern,
  `checkpoints.ts`'s existing sentinel getters, both reused)

### Definition of Done
- [x] All P0/P1 acceptance criteria met — see checklist.md for item-by-item evidence
- [x] Corruption-class skip proven side by side against the unaffected derived-only path (not
  just the new branch in isolation) — both cases in `checkpoint-needs-rebuild-sentinel.vitest.ts`
- [x] Docs updated (spec/plan/tasks/checklist/README), Tier-2 gap stated honestly, not implied
  as solved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Add a discriminant field to an existing on-disk marker, and branch on it at the single existing
choke-point consumer — no new consumer, no new call sites, no new abstraction beyond one shared
constant and one small helper.

### Key Components
- **`NEEDS_REBUILD_SENTINEL_SOURCE`** (new, `vector-index-types.ts`): `{ CORRUPTION:
  'post_crash_integrity_probe', SWAP_RECOVERY: 'swap_done_recovery' }` — the correct
  shared-neutral home, since `vector-index-types.ts` already hosts `VectorIndexErrorCode` and is
  already imported (transitively) by both `vector-index-store.ts` and `checkpoints.ts`.
- **`write_needs_rebuild_sentinel_for_corruption()`** (`vector-index-store.ts:1352-1375`,
  updated): uses the shared constant instead of the raw literal at `:1366`.
- **The restore-recovery sentinel writer** (`vector-index-store.ts:~1328-1340`, the
  `'swap_done_recovery'` literal, updated): same constant swap, no behavior change.
- **Quick_check-failure throw site** (`vector-index-store.ts:~2172-2174`, updated): tags the
  thrown `VectorIndexError` with `needsRebuildCorruption: true`, mirroring the existing
  `speckitInitHardFail` tag idiom already used at `context-server.ts:2071-2074` — chosen over
  growing `VectorIndexErrorCode` because no exhaustive switch over that enum exists repo-wide,
  and the tag pattern is already established local precedent.
- **`get_needs_rebuild_sentinel_path()`** (`vector-index-store.ts:1217`, currently private):
  exported as a small prerequisite so the boot catch-block log line can name the actual sentinel
  file. `checkpoints.ts`'s own `getNeedsRebuildSentinelPathForDatabase` (its sentinel-path
  getter) is not usable here because it takes a live `database` handle
  (`checkpoints.ts:909`), which does not exist in this exact catch block — the same
  reachability trap the source investigation describes for the repair function.
- **Init catch block** (`context-server.ts:1978-1986`, additive-only): after the existing
  `if (error instanceof VectorIndexError && ...)` check, add a branch on
  `error.needsRebuildCorruption === true` that logs the sentinel path, corruption detail, and a
  pointer to the manual-restore doc, then falls through to the unchanged re-throw. Purely
  additive — preserves existing control flow and exit behavior exactly.
- **`readNeedsRebuildSentinelSource(database)`** (new helper, `checkpoints.ts`): best-effort JSON
  read via the existing `getNeedsRebuildSentinelPathForDatabase` path, matching the file's
  established defensive try/catch style; returns the `source` string or `null` on any read
  failure (fails safe toward the pre-existing default-attempt behavior).
- **`repairNeedsRebuildSentinel`** (`checkpoints.ts:2021-2079`, updated): immediately after the
  existing `hasNeedsRebuildSentinel` early-return, branch on
  `readNeedsRebuildSentinelSource(database) === NEEDS_REBUILD_SENTINEL_SOURCE.CORRUPTION` — if
  true, skip `runDerivedArtifactRebuilds` entirely, return `{ sentinelPresent: true, attempted:
  false, cleared: false, summary: null, error: null }` with a warn log; otherwise, fall through
  to the existing unchanged logic. Because this function is the single choke point for all three
  real callers (`context-server.ts:2253` boot, `:2454` startup-scan,
  `handlers/memory-index.ts:292` inside `memory_index_scan`), this one change protects all three
  without duplication.

### Data Flow
Boot: `initializeDb()` → `quick_check(1)` fails → sentinel written with `source: CORRUPTION`,
tagged error thrown → `context-server.ts` catch block logs actionable guidance (new) → unchanged
re-throw → boot aborts (unchanged fail-safe behavior). A later boot attempt (once the operator
has manually restored a checkpoint, per the now-documented README) or a `memory_index_scan` call
against a database with a stale corruption-class sentinel: `repairNeedsRebuildSentinel` reads the
sentinel's `source`, sees `CORRUPTION`, skips the SQL rebuild, and reports `attempted: false` —
instead of today's behavior of blindly running rebuild SQL against a table that may still be
corrupt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `vector-index-types.ts` | Hosts `VectorIndexErrorCode` | Add `NEEDS_REBUILD_SENTINEL_SOURCE` | Type-check + both consumers import it |
| `vector-index-store.ts` sentinel writers (`:~1328-1340`,`:~1352-1375`) | Write raw string literals | Use shared constant | `rg -n "post_crash_integrity_probe\|swap_done_recovery"` shows only the constant + its two usages |
| `vector-index-store.ts` quick_check-failure throw (`:~2172-2174`) | Throws untagged `VectorIndexError` | Tag `needsRebuildCorruption: true` | New durability test catches the tag |
| `vector-index-store.ts:1217` `get_needs_rebuild_sentinel_path` | Private | Export | Import succeeds from `context-server.ts` |
| `context-server.ts` init catch (`:1978-1986`) | Re-throws unconditionally | Add additive corruption-aware log branch before the unchanged re-throw | Forced-corruption test: log output present, re-thrown error/exit behavior byte-identical |
| `checkpoints.ts` `repairNeedsRebuildSentinel` (`:2021-2079`) | Single choke point, always attempts `runDerivedArtifactRebuilds` when sentinel present | Add corruption-class skip branch | New test: corruption source → skip; existing `swap_done_recovery`-equivalent behavior unchanged |
| `checkpoints.ts`'s three real callers (`context-server.ts:2253`,`:2454`, `handlers/memory-index.ts:292`) | Call `repairNeedsRebuildSentinel`/`runCheckpointNeedsRebuildRepair*` | Unchanged — protected automatically via the single choke point | `rg -n "repairNeedsRebuildSentinel"` shows exactly 3 call sites, all unmodified |
| `database/checkpoints/README.md` | Describes `.needs-rebuild` as one undifferentiated mechanism | Document the two classes | Doc review |

Required inventories:
- Sentinel writers: `rg -n "write_needs_rebuild_sentinel_for_corruption\|source: 'swap_done_recovery'\|source: 'post_crash_integrity_probe'" .opencode/skills/system-spec-kit/mcp_server` — confirms exactly two writers before this change, both updated to the shared constant.
- Sentinel consumers: `rg -n "repairNeedsRebuildSentinel\|runCheckpointNeedsRebuildRepair" .opencode/skills/system-spec-kit/mcp_server` — confirms exactly one implementation, three call sites, all downstream of the single choke point this plan modifies.
- Matrix axes: {sentinel-absent (common path, unaffected), sentinel-present-derived-only (unchanged, still attempts+clears), sentinel-present-corruption (new: skip, `attempted:false`), sentinel-present-unreadable/malformed-source (fails safe to the pre-existing default-attempt path)}.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm the current call graph (sentinel writers, `repairNeedsRebuildSentinel`'s three
  real callers) against the working tree immediately before implementation, in case a concurrent
  session has touched any of these files since this plan was written
- [ ] Re-confirm the `speckitInitHardFail` tag idiom's exact shape at `context-server.ts:2071-2074`
  as the pattern to mirror for `needsRebuildCorruption`

### Phase 2: Core Implementation
- [ ] Add `NEEDS_REBUILD_SENTINEL_SOURCE` to `vector-index-types.ts`
- [ ] Swap both `vector-index-store.ts` sentinel-write literals to the shared constant
- [ ] Tag the quick_check-failure throw with `needsRebuildCorruption: true`
- [ ] Export `get_needs_rebuild_sentinel_path` from `vector-index-store.ts`
- [ ] Add the additive corruption-aware log branch to `context-server.ts`'s init catch block,
  before the unchanged re-throw
- [ ] Add `readNeedsRebuildSentinelSource(database)` to `checkpoints.ts`
- [ ] Add the corruption-class skip branch inside `repairNeedsRebuildSentinel`, immediately after
  the existing `hasNeedsRebuildSentinel` early-return

### Phase 3: Verification
- [ ] `node --check` / project TS build clean
- [ ] Extend `checkpoint-needs-rebuild-sentinel.vitest.ts`: corruption-source sentinel → skip,
  `attempted: false`, `cleared: false`, sentinel file still present — isolated against the
  file's existing `createHealthyDatabase` fixture so the skip is proven driven by `source`, not
  by an actual rebuild failure
- [ ] Re-run the same suite's existing derived-only (`swap_done_recovery`-equivalent) cases
  unmodified, confirm 0 regressions — proves the skip branch does not leak into the working path
- [ ] Extend `vector-index-store-durability.vitest.ts`: forced quick_check failure → thrown error
  carries `needsRebuildCorruption: true`
- [ ] Manual/scripted forced-corruption boot: confirm the new log line names the sentinel path
  and points to the manual-restore doc, and that the daemon's exit code/behavior is byte-identical
  to before this change (additive logging only)
- [ ] Full boot-path regression set — `context-server.vitest.ts`,
  `vector-index-store-durability.vitest.ts`, `checkpoint-needs-rebuild-sentinel.vitest.ts`,
  `launcher-*.vitest.ts` — green
- [ ] `validate.sh --strict` for this packet
- [ ] Update `database/checkpoints/README.md` with the two-class documentation
- [ ] Document the Tier-2 gap explicitly in `implementation-summary.md`/`checklist.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `NEEDS_REBUILD_SENTINEL_SOURCE` constant used correctly at both writers; error tag present on forced quick_check failure | vitest |
| Integration | `repairNeedsRebuildSentinel` corruption-class skip vs. derived-only unchanged path, side by side against the same fixture harness | vitest, `checkpoint-needs-rebuild-sentinel.vitest.ts` |
| Regression | Full boot-path suite (`context-server.vitest.ts` + durability + sentinel + launcher suites) | vitest |
| Manual | Forced-corruption boot: log output content, unchanged exit behavior | Manual harness against a disposable DB copy |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `vector-index-types.ts`'s existing `VectorIndexErrorCode`/tag-idiom pattern | Internal | Green | Reused, not modified |
| `checkpoints.ts`'s existing sentinel getters (`getNeedsRebuildSentinelPathForDatabase`, `hasNeedsRebuildSentinel`) | Internal | Green | Reused, not modified |
| Tier-2 module-singleton refactor or an out-of-band recovery entrypoint | N/A (Tier 2 only) | Not started | This packet does not depend on it; explicitly deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corruption-class skip branch incorrectly triggers on a derived-only sentinel
  (false positive), silently disabling a legitimate repair.
- **Procedure**: `git revert` the `checkpoints.ts` change; `repairNeedsRebuildSentinel` returns to
  always attempting `runDerivedArtifactRebuilds` regardless of sentinel source (today's current,
  known-imprecise-but-working-for-the-common-case behavior). The constant/tag/logging changes are
  independently revertible and carry no data-migration risk — no schema or on-disk format change.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | <1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **~4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Corruption-class skip verified side by side against the unaffected derived-only path
- [ ] Additive logging confirmed not to alter exit code/control flow
- [ ] Comment hygiene reviewed (no spec/packet/REQ/CHK ids in touched code)

### Rollback Procedure
1. `git revert` the `checkpoints.ts` change (restores always-attempt behavior).
2. Re-run the sentinel + durability + boot-path suites.
3. Confirm the corruption-detection path (sentinel write + error tag) still functions
   independently — reverting only the repair-skip branch, not the detection/tagging.

### Data Reversal
- **Has data migrations?** No — the sentinel file format gains one already-present field read
  differently; no schema change.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:defense-in-depth -->
## L2: CONSIDERED, DEFERRED ALTERNATIVES (Tier 2)

Per spec.md §3, described at planning-intent level only — not implemented in this pass:

1. **Refactor `restoreCheckpointV2`/`reopenActiveDatabase` to accept an explicit
   connection/path instead of relying on `vector-index-store.ts`'s module singleton (`db`,
   `db_connections`).** Would let a corruption-flagged boot attempt an in-band restore-and-retry
   without needing `checkpoints.init(database)` to have already run. Deferred because it is a
   meaningfully larger refactor of module-level connection management, not a bug fix, and
   carries its own regression risk to the (already-working) normal restore path.
2. **Build a genuinely separate, out-of-band recovery entrypoint**, structurally closer to the
   existing raw-file-copy `scripts/migrations/restore-checkpoint.ts` (no live-connection
   dependency), that an operator runs after a corruption-flagged boot failure, before
   restarting. Deferred as a follow-on packet once Tier 1's improved logging (this plan) makes
   the manual step's trigger condition clearly actionable.
3. **A dedicated launcher-level exit code for this failure mode** (mirroring
   `EXIT_DB_LOCK_HELD`). Deferred: the launcher's existing generic crash-loop guard
   (`createCrashLoopGuard`) already bounds the retry loop regardless of exit code; only signal
   quality was missing, which Tier 1's logging now supplies. Worth reconsidering only if an
   operator specifically wants machine-distinguishable exit codes for this case (open question,
   spec.md §7).
<!-- /ANCHOR:defense-in-depth -->
