---
title: "Feature Specification: Needs-Rebuild Sentinel Corruption-Class Mishandling"
description: "The .needs-rebuild sentinel was designed for half-finished checkpoint restores (derived-artifact-only rebuild against a live connection) but the same file is also written for physical page corruption, a harsher class its consumer was never built to handle safely and, in that failure mode, structurally cannot even reach."
trigger_phrases:
  - "rebuild sentinel corruption handling"
  - "needs-rebuild sentinel corruption class"
  - "post_crash_integrity_probe sentinel"
  - "repairNeedsRebuildSentinel corruption"
  - "quick_check failure unreachable repair"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/034-rebuild-sentinel-corruption-handling"
    last_updated_at: "2026-07-08T19:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented and boot-verified the Tier 1 sentinel-class fix"
    next_safe_action: "None required; Tier 2 in-band recovery stays a future packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/database/checkpoints/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-034-rebuild-sentinel-corruption-handling"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the operator want launcher-level exit-code distinguishability for this failure mode (a dedicated exit code mirroring EXIT_DB_LOCK_HELD), given the launcher's generic crash-loop guard already bounds the retry loop regardless of exit code?"
    answered_questions:
      - "Is a genuine in-band auto-restore-and-retry within the same failed boot in scope here? -> No, explicitly deferred as Tier 2: restoreCheckpointV2/reopenActiveDatabase depend on vector-index-store.ts's module-singleton connection state, and checkpoints.init(database) (the only call site: context-server.ts:2242) requires a live handle this failure mode never produces -- see Background section."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Needs-Rebuild Sentinel Corruption-Class Mishandling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This packet's parent (`007-mcp-daemon-reliability`) has 32 prior children. Its sibling
`033-boot-wal-shm-sigbus-fix` was opened from the same test pass and shares a
boot-time-database-reliability theme, but is an independent, non-overlapping root cause: 033 is
a single PRAGMA contradiction fully contained in a ~7-line block at `context-server.ts:2207-2213`;
this packet is an error-handling/sentinel-design gap spanning three files
(`vector-index-store.ts`, `checkpoints.ts`, `context-server.ts`) plus tests/docs, touching a
non-adjacent region of `context-server.ts` (~`1979-1987`) with a distinct "Tier 2 deferred"
architectural caveat this packet's own investigation surfaced. Bundling the two would blur two
very different verification stories (033: `PRAGMA journal_mode` + crash-report monitoring; this
packet: a corrupted-DB vitest fixture) and violate SCOPE LOCK on a single problem statement — so
they are documented as separate packets rather than merged.

### Problem Statement
The needs-rebuild sentinel file conflates two failure classes: half-finished checkpoint restores, safely auto-repaired, and physical page corruption, which its one consumer was never built to handle and cannot even reach.

The `.needs-rebuild` sentinel mechanism was designed (per
`database/checkpoints/README.md:25,48-50,81`) for **half-finished checkpoint restores**: the
live main DB is structurally sound and openable, just missing derived artifacts (FTS shadow,
BM25, communities, degree snapshots — `checkpoints.ts:1923-1953`). `repairNeedsRebuildSentinel`
rebuilds those via SQL against an already-working connection, and that path is fine.

`write_needs_rebuild_sentinel_for_corruption()` (`vector-index-store.ts:1352-1375`) was later
bolted onto the **same sentinel file** for a much harsher class — physical page corruption
detected by a post-crash `quick_check(1)` probe (`:2144-2183`) — that the consumer was never
built to handle, **and structurally cannot even reach** in this failure mode:

1. `initializeDb()` opens the file, and — only when an `.unclean-shutdown` marker is present —
   runs the post-crash `quick_check(1)` probe.
2. On failure, it writes the corruption-class sentinel (source: `'post_crash_integrity_probe'`,
   confirmed literal at `:1366`, called from `:2172`) and then **unconditionally throws**
   `VectorIndexError` (confirmed at `:2174`).
3. In `context-server.ts`'s init flow, that exception is caught at `:1978-1986` and simply
   **re-thrown** (confirmed at `:1986`, since it isn't a `DB_LOCK_HELD` error) — boot aborts.
4. The only code that reads/consumes `.needs-rebuild` — `repairNeedsRebuildSentinel()`
   (`checkpoints.ts:2021-2079`) via `runCheckpointNeedsRebuildRepair(database, ...)` — sits at
   `context-server.ts:2253` (boot) and `:2454` (startup-scan), **thousands of lines
   downstream, gated behind a live `vectorIndex.getDb()` handle** that only exists if
   `initializeDb()` already returned successfully. `handlers/memory-index.ts:292`
   (`runCheckpointNeedsRebuildRepairForScan`, inside the `memory_index_scan` MCP tool) is the
   third and only other real caller — confirmed via repo-wide grep — same reachability
   requirement.

Since nothing on disk changes between boots (the sentinel write doesn't repair anything, and
`write_crash_probe_receipt` only fires on `verdict === 'ok'`), boot N+1 reruns the identical
`quick_check`, fails identically, and dies before ever reaching the repair function again. The
sentinel-consumer requires a database handle this exact failure mode structurally prevents ever
obtaining — the corruption is real, detected correctly, but then silently mishandled by a repair
path that was never reachable and, even if it were, was designed for a different, milder failure
class (`runDerivedArtifactRebuilds` runs SQL — INSERT/rebuild statements — against tables that,
per the source investigation, would likely fail again if physically corrupt).

### New architectural finding (this packet's own contribution, beyond the source investigation)
The investigation's own suggested option — "attempt checkpoint-based recovery... inline" — is
architecturally harder than it looks and must be explicitly deferred, not silently attempted.
Confirmed via code: `restoreCheckpointV2` (`checkpoints.ts:2590`, calling `reopenActiveDatabase`
at `vector-index-store.ts:2311-2323` via an injectable `opts.reopen`) depends on
`vector-index-store.ts`'s own module-singleton connection state (`db ??
db_connections.get(path.resolve(targetMainPath))`, confirmed at `vector-index-store.ts:2312`),
and `checkpointsLib`'s `getDatabase()`/`restoreCheckpointV2` require `checkpoints.init(database)`
to have already run with a **live** handle (`getDatabase()` throws `'Database not initialized.
The checkpoints module requires the MCP server to be running.'` otherwise, confirmed at
`checkpoints.ts:467-468`). `checkpointsLib.init()` has exactly one call site,
`context-server.ts:2242` — unreachable in this exact failure mode, one level up from the
reachability trap the source investigation already described. A genuine in-band
auto-restore-and-retry within the same boot attempt would need to bypass or refactor this
coupling — real new-capability work, not a bug fix — and is explicitly deferred (Tier 2, §3)
rather than attempted here.

### Purpose
Make the corruption-class sentinel distinguishable from the derived-only class it was designed
for, so `repairNeedsRebuildSentinel` never runs `runDerivedArtifactRebuilds`' SQL against a
table the daemon itself already proved is physically corrupt — closing the wrong-repair-path gap
honestly, without claiming to have solved full automatic recovery (which remains Tier 2, a
genuinely separate future packet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (Tier 1 — fixes both confirmed bugs safely)
- A shared, exported sentinel-source constant (`NEEDS_REBUILD_SENTINEL_SOURCE`) replacing the
  two currently-separate raw string literals (`'post_crash_integrity_probe'`,
  `'swap_done_recovery'`), removing a stringly-typed drift risk (today `'post_crash_integrity_probe'`
  has zero readers anywhere in the codebase — write-only).
- Tag the quick_check-failure throw (`vector-index-store.ts:~2174`) with a
  `needsRebuildCorruption: true` marker, mirroring the existing `speckitInitHardFail` tag idiom
  already used elsewhere in this same file's init flow (`context-server.ts:2071-2074`).
- Additive, non-control-flow-changing logging in `context-server.ts`'s init catch block
  (`:1978-1986`) that names the actual sentinel path and corruption detail before re-throwing
  the unchanged original error — requires exporting the currently-private
  `get_needs_rebuild_sentinel_path` (`vector-index-store.ts:1217`), since the catch block has no
  live database handle to use `checkpoints.ts`'s own (database-handle-based)
  `getNeedsRebuildSentinelPathForDatabase` getter.
- **The actual scope-mismatch fix**: inside `repairNeedsRebuildSentinel`
  (`checkpoints.ts:2021-2079`), branch on the sentinel's `source` field — if it is the
  corruption class, skip `runDerivedArtifactRebuilds` entirely and return
  `{ attempted: false, cleared: false }` with a clear warn log, leaving the sentinel in place.
  Protects all three real callers (`context-server.ts:2253`/`:2454`,
  `handlers/memory-index.ts:292`) through the single choke point, no duplication.
- Test coverage: a third case in the existing `checkpoint-needs-rebuild-sentinel.vitest.ts`
  (corruption-source sentinel → skip, `attempted: false`); a new case in
  `vector-index-store-durability.vitest.ts` (forced quick_check failure → thrown error carries
  `needsRebuildCorruption: true`).
- Doc correction: `database/checkpoints/README.md` updated to document the two sentinel classes
  (derived-only, auto-repaired vs. corruption-class, not auto-repaired today) so the doc matches
  the corrected code.

### Out of Scope (Tier 2 — explicitly deferred, not built here)
- True in-band automatic checkpoint-restore-and-retry within the same failed boot attempt.
  Blocked by the module-singleton coupling documented above (`restoreCheckpointV2`/
  `reopenActiveDatabase` need a live `checkpoints.init(database)`, unreachable pre-`initializeDb()`
  success). Two real paths forward for a **future** packet: (a) refactor those functions to
  accept an explicit connection/path instead of the module singleton, or (b) build a genuinely
  separate out-of-band recovery entrypoint (structurally closer to the existing raw-file-copy
  `scripts/migrations/restore-checkpoint.ts`, which has no live-connection dependency at all)
  that an operator runs after a corruption-flagged boot failure, before restarting.
- A dedicated launcher-level exit code for this failure mode (mirroring `EXIT_DB_LOCK_HELD`) —
  noted as a small, separable addition an operator may want, not assumed needed here; the
  launcher's existing generic crash-loop guard (`createCrashLoopGuard`, bounded deaths-per-window)
  already bounds the retry loop regardless of exit code, so only *signal quality* was missing,
  which Tier 1's logging now supplies.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` | Modify | Add exported `NEEDS_REBUILD_SENTINEL_SOURCE` constant |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Use shared constants at the two sentinel-write sites (`:1340`,`:1366` region); tag the quick_check-failure throw; export `get_needs_rebuild_sentinel_path` |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Additive corruption-aware logging in the init catch block (`:1978-1986`), before the unchanged re-throw |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modify | `readNeedsRebuildSentinelSource` helper; corruption-class skip branch inside `repairNeedsRebuildSentinel` (`:2021-2079`) |
| `mcp_server/tests/checkpoint-needs-rebuild-sentinel.vitest.ts` | Modify | Add the corruption-source skip case |
| `mcp_server/tests/vector-index-store-durability.vitest.ts` | Modify | Add the `needsRebuildCorruption: true` tag assertion |
| `mcp_server/database/checkpoints/README.md` | Modify | Document the two sentinel classes explicitly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The two sentinel-source literals are replaced by a single shared, exported constant in `vector-index-types.ts`. | `rg -n "post_crash_integrity_probe\|swap_done_recovery"` shows only the constant definition and its two consumers; no raw string literal remains at either write site. |
| REQ-002 | The quick_check-failure error thrown from `vector-index-store.ts` is tagged `needsRebuildCorruption: true` before being thrown. | A forced quick_check-failure unit test catches the thrown `VectorIndexError` and asserts `error.needsRebuildCorruption === true`. |
| REQ-003 | `repairNeedsRebuildSentinel` skips `runDerivedArtifactRebuilds` entirely when the sentinel's `source` is the corruption class, returning `{ attempted: false, cleared: false }` and leaving the sentinel in place. | A vitest case writes a sentinel with the corruption-class `source` against the file's existing `createHealthyDatabase` fixture and asserts `attempted === false`, `cleared === false`, sentinel file still present. |
| REQ-004 | The corruption-class skip protects all three real callers of `repairNeedsRebuildSentinel` (`context-server.ts:2253`,`:2454`, `handlers/memory-index.ts:292`) through the single choke point, with zero per-caller duplication. | `rg -n "repairNeedsRebuildSentinel"` shows exactly one implementation and three unmodified call sites; no caller-side branching added. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The init catch block logs actionable guidance (sentinel path, corruption detail, and today's real recovery step — manual checkpoint restore per `database/checkpoints/README.md`) before re-throwing the unchanged original error. | A forced-corruption boot's stderr output names the sentinel file path and points to the manual restore doc; the re-thrown error object and its downstream handling (exit code, launcher behavior) are byte-identical to before this change. |
| REQ-006 | `database/checkpoints/README.md` documents both sentinel classes (derived-only auto-repaired vs. corruption-class not-auto-repaired) so the doc matches the corrected code. | The README no longer describes `.needs-rebuild` as a single undifferentiated mechanism; a reader can tell which class triggers automatic repair. |
| REQ-007 | Comment hygiene. | Durable WHY only in any code comments touched; no ADR/REQ/CHK/spec-path ids embedded in code. |
| REQ-008 | This packet's docs state the Tier-2 gap explicitly — completion claims never imply full auto-recovery was added. | `checklist.md` and `implementation-summary.md` both contain an explicit statement that recovery from a genuine corruption event still requires a manual, out-of-band step after Tier 1 ships. |

### Acceptance Criteria (Given/When/Then)

- **Given** `initializeDb()`'s post-crash `quick_check(1)` probe fails, **When** the corruption
  sentinel is written and the error thrown, **Then** the thrown error carries
  `needsRebuildCorruption: true` and the sentinel's `source` field is the shared
  `NEEDS_REBUILD_SENTINEL_SOURCE.CORRUPTION` constant.
- **Given** a `.needs-rebuild` sentinel exists with the corruption-class `source`, **When**
  `repairNeedsRebuildSentinel` runs (from any of its three real callers), **Then** it does not
  execute `runDerivedArtifactRebuilds`, returns `attempted: false, cleared: false`, and leaves
  the sentinel file in place with a warn log.
- **Given** a `.needs-rebuild` sentinel exists with the pre-existing `swap_done_recovery` source
  (half-finished checkpoint restore, the original design case), **When**
  `repairNeedsRebuildSentinel` runs, **Then** behavior is unchanged from today — it still
  attempts `runDerivedArtifactRebuilds` and clears the sentinel on success.
- **Given** the corruption-class boot failure occurs, **When** the init catch block logs its
  guidance, **Then** the daemon's exit behavior (exit code, launcher bridging) is unchanged from
  before this packet — only additive logging was inserted.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A corrupted-DB vitest fixture proves the corruption-class sentinel is no longer
  fed to `runDerivedArtifactRebuilds` — the discriminating test the source investigation
  recommended, not just a unit assertion in isolation.
- **SC-002**: The pre-existing derived-only (`swap_done_recovery`) repair path is provably
  unaffected — same tests, same green result, before and after this change.
- **SC-003**: `implementation-summary.md` and `checklist.md` state the Tier-2 gap honestly:
  corruption is now distinguishable, logged actionably, and no longer silently mishandled by the
  wrong repair path — but recovery from a genuine corruption event still requires a manual,
  out-of-band step. No "auto-recovery" claim beyond what Tier 1 actually does.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tier 1 improves signal quality but does not restore boot capability after a genuine corruption event — the daemon still refuses to boot (correctly, fail-safe). | Med | State the Tier-2 gap explicitly in every completion doc; never imply auto-recovery was added. |
| Risk | The corruption-class skip branch itself has a bug that causes the derived-only (existing, working) repair path to also skip. | Med | REQ-003/SC-002 require both branches tested side by side against the same fixture harness, not just the new branch in isolation. |
| Dependency | `checkpoints.init(database)`'s module-singleton coupling to `vector-index-store.ts` (documented in the new architectural finding above) | N/A (Tier 2 dependency only) | Explicitly deferred; this packet does not depend on resolving it. |
| Risk | This packet and `033-boot-wal-shm-sigbus-fix` both touch `context-server.ts`'s boot sequence, an area shared with the already-shipped `032-boot-integrity-rebuild-maintenance-marker` and an extensive launcher test suite. | Low | Re-run the full boot-path test suite (`context-server.vitest.ts`, `vector-index-store-durability.vitest.ts`, `checkpoint-needs-rebuild-sentinel.vitest.ts`, `launcher-*.vitest.ts`) as the regression gate, not just the new/changed test files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No steady-state cost — the corruption-class branch only executes when a
  `.needs-rebuild` sentinel with the corruption source already exists, which itself only happens
  after a failed post-crash `quick_check` (already a rare, non-hot path).
- **NFR-P02**: No change to `quick_check` probe timing, `.unclean-shutdown` marker gating, or any
  other boot-path timing.

### Security
- **NFR-S01**: No new external surface; the sentinel file already lives under the same
  trust boundary as the rest of the daemon's on-disk state.
- **NFR-S02**: No operator-facing config surface added.

### Reliability
- **NFR-R01**: Stops the wrong repair path (`runDerivedArtifactRebuilds`, SQL against
  potentially-corrupt tables) from running against physically corrupt data — a real
  safety improvement even without full auto-recovery.
- **NFR-R02**: Preserves the existing fail-safe boot-refusal behavior on corruption exactly —
  this packet adds visibility and correctness to the mishandled path, not a new recovery
  capability.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Sentinel absent (the common case): `hasNeedsRebuildSentinel`'s existing early-return in
  `repairNeedsRebuildSentinel` is untouched by this change.
- Sentinel present with the pre-existing `swap_done_recovery` source: unchanged behavior,
  `runDerivedArtifactRebuilds` still runs, sentinel still clears on success.
- Sentinel present with the new corruption source: `runDerivedArtifactRebuilds` skipped,
  `attempted: false`, sentinel persists.
- Sentinel present with a malformed/unreadable `source` field (e.g., a hand-edited or
  older-format sentinel predating this change): `readNeedsRebuildSentinelSource` must fail safe
  — treat unknown/unreadable `source` the same as the pre-existing default path (attempt repair,
  matching today's undifferentiated behavior) rather than silently skipping or throwing.

### Error Scenarios
- `readNeedsRebuildSentinelSource`'s best-effort JSON read throws (corrupt sentinel file itself):
  caught and treated as unknown source (falls back to the pre-existing default-attempt path),
  matching the file's established defensive try/catch style.
- The init catch-block logging itself throws (e.g., `get_needs_rebuild_sentinel_path` errors):
  must not mask or replace the original re-thrown error — logging failure is itself
  best-effort/non-fatal.

### State Transitions
- A corruption-class sentinel from an older daemon version (pre-this-packet, written without the
  shared constant but with the same literal string value) must still be recognized correctly —
  the shared constant's value is unchanged (`'post_crash_integrity_probe'`), only its definition
  location moves.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~40-60 LOC across 4 production files, reusing existing primitives; four test/doc files touched |
| Risk | 12/25 | Shared daemon-boot path with an existing neighbor (032); mitigated by additive-only logging and a single, well-isolated skip branch |
| Research | 6/20 | Root cause already confirmed by the source investigation; this packet's own added architectural finding (Tier-2 coupling) further de-risks scope by ruling out the harder option explicitly |
| **Total** | **30/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the operator want launcher-level exit-code distinguishability for this failure mode (a
  dedicated exit code mirroring `EXIT_DB_LOCK_HELD`), given the launcher's existing generic
  crash-loop guard already bounds the retry loop regardless of exit code? Noted as a small,
  separable addition to flag during implementation review, not assumed needed here.
<!-- /ANCHOR:questions -->
