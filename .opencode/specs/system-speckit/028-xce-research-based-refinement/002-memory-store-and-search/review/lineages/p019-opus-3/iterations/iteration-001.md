# Iteration 1: Full single-pass audit (correctness, security, traceability, maintainability)

## Focus
All four dimensions in one pass (fan-out lineage, maxIterations=1). Target: spec folder
`019-maintenance-grace-daemon-survives-reelection` — a daemon-written maintenance-active
marker plus launcher adopt/refuse-respawn guards so a heavy reindex survives launcher
re-election.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` (writer module)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` (scan IIFE integration)
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` (embedding-queue integration)
- `.opencode/skills/system-spec-kit/mcp_server/core/config.ts` (DATABASE_DIR resolution)
- `.opencode/bin/lib/model-server-supervision.cjs` (pure predicate)
- `.opencode/bin/mk-spec-memory-launcher.cjs` (both guard sites + marker dir resolution)
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/storage/maintenance-marker.js` (shipped artifact)
- spec.md / plan.md / tasks.md / implementation-summary.md

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 10 (3 TS sources, 2 CJS sources, 1 config, 2 tests, 1 dist artifact, 4 spec docs)
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.40 (4 P2 against a small, well-scoped change)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F001**: impl-summary "embedding queue unprotected" limitation is contradicted by shipped code,
  `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1038`.
  The implementation-summary Known Limitations bullet 4 (`implementation-summary.md:104`) states the
  post-scan background-embedding queue is "busy-but-unprotected" and frames extending the marker to
  cover it as the follow-on that "closes the loop." The shipped code already protects it:
  `processBackgroundJob` calls `beginMaintenance('embedding-queue')` (retry-manager.ts:1038) inside a
  `try` whose `finally` calls `maintenanceHandle?.end()` (retry-manager.ts:1052-1055), and the marker
  module is reference-counted precisely so scan + embedding-queue can overlap and the marker persists
  while ANY source is active (`maintenance-marker.ts:9-14,58-83`). The doc's headline claim that the
  "reindex's data goal is not yet re-election-proof end to end" therefore no longer matches the code.
  A maintainer reading this would either re-implement work that is done or mis-assess release
  readiness. Recommend updating the limitation to reflect that the embedding queue is now covered, or —
  if this coverage was unintended scope — recording the scope addition in spec §3. (dimension:
  traceability)

- **F002**: Marker schema drift — docs and test fixtures say `jobId`, the shipped writer emits `labels`.
  spec.md:103, plan.md:55, and implementation-summary.md:56 all document the marker as
  `{ childPid, activeUntilMs, jobId, refreshedAtIso }`. The actual writer
  (`maintenance-marker.ts:44-50`) and the shipped artifact
  (`dist/lib/storage/maintenance-marker.js:34`) emit `labels: string[]`, with no `jobId` key. The unit
  test type and fixtures (`launcher-maintenance-guard.vitest.ts:8,32`) and the harness fixtures
  (`daemon-reelection-adoption-live.vitest.ts:366,430`) also still use `jobId`. No functional impact —
  the reader/predicate only validates `childPid` and `activeUntilMs`
  (`model-server-supervision.cjs:619`) — but the documented and tested marker shape does not match what
  the daemon writes. Recommend aligning docs + fixtures to `labels`. (dimension: traceability)

- **F003**: spec §3 "Files to Change" paths and coverage are inaccurate.
  spec.md:114-120 lists `mcp_server/bin/lib/model-server-supervision.cjs` and
  `mcp_server/bin/mk-spec-memory-launcher.cjs`, but no `bin/` directory exists under `mcp_server/`; the
  real files are `.opencode/bin/lib/model-server-supervision.cjs` and
  `.opencode/bin/mk-spec-memory-launcher.cjs`. Two changed files are also absent from the table: the
  new writer module `lib/storage/maintenance-marker.ts` and the modified
  `lib/providers/retry-manager.ts`. Recommend correcting the paths and adding the two files so the
  change inventory is auditable. (dimension: traceability)

- **F004**: Architecture drift — plan describes an inline scan-IIFE writer; shipped as a shared
  reference-counted module. plan.md:55 and §3 ARCHITECTURE describe the daemon writer as living "in the
  background scan IIFE" in `handlers/memory-index.ts`, writing and refreshing inline. The shipped design
  extracts it to a reference-counted module (`lib/storage/maintenance-marker.ts`) consumed by both
  memory-index.ts (`beginMaintenance('index_scan')`, memory-index.ts:1502) and retry-manager.ts. This
  is a reasonable improvement (testable, reusable), but the plan/spec were not updated to reflect it.
  Recommend a one-line plan note. (dimension: maintainability)

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:103,114-120; maintenance-marker.ts:44-50; retry-manager.ts:1038 | All P0/P1 acceptance criteria (REQ-001..004) resolve to correct shipped behavior; partial only on descriptive metadata (marker schema field name, file paths, stale limitation). No normative requirement contradicted, so the hard gate is not failed. |
| checklist_evidence | n/a | hard | folder listing (no checklist.md) | Level 1 folder; no checklist.md exists, so the protocol is not applicable. |
| feature_catalog_code | n/a | advisory | — | No feature-catalog entry in scope for this daemon-internal fix. |

### Requirement verification (spec_code detail)
- **REQ-001** (daemon advertises live scan, 20s refresh, TTL, removed on exit): PASS. Writer writes on
  `beginMaintenance` (maintenance-marker.ts:61), refreshes via `setInterval(writeMarker, 20_000)`
  (line 63) and explicit phase-boundary `refresh()` (memory-index.ts:1510), removes in `end()` at
  refcount zero (lines 78-81). TTL is 180_000ms (line 25) — note this exceeds the spec.md:103 stated
  60s; the impl-summary.md:56 documents and justifies the raise to 180s after a live ~79s blocking
  phase, so the divergence is intentional and documented (not a finding).
- **REQ-002** (adopt at both guard sites): PASS. Dead-socket respawn path
  (mk-spec-memory-launcher.cjs:820-825) and stale-reclaim adopt path (lines 1688-1694) both read the
  marker and call `shouldAdoptDespiteProbe`, refusing respawn / adopting on a fresh marker.
- **REQ-003** (fail-safe toward reaping): PASS. `shouldAdoptDespiteProbe`
  (model-server-supervision.cjs:632-640) returns false on null marker, invalid/zero childPid, childPid
  mismatch, expired `activeUntilMs`, or non-`alive` liveness. All 7 branches covered by
  launcher-maintenance-guard.vitest.ts (cases a-g).
- **REQ-004** (identical marker-dir precedence both sides): PASS. Daemon resolves `DATABASE_DIR` via
  `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` → `path.resolve(cwd, …)` → realpath (config.ts:67-89). Launcher
  `maintenanceMarkerDir()` resolves the same env precedence via `canonicalizePath(path.resolve(cwd,
  override))` (launcher:329-333; canonicalizePath = `realpathSync.native` with ENOENT fallback,
  model-server-supervision.cjs:414-422). Isolated harness sets `SPEC_KIT_DB_DIR` to a fake root and
  both adopt and stale-marker cases pass (daemon-reelection-adoption-live.vitest.ts:343,408),
  empirically confirming path parity.

## Assessment
- New findings ratio: 0.40
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: single-pass fan-out lineage; all four findings are first-discovery
  traceability/doc-drift items. No correctness or security defects found.

### Correctness (PASS)
The pure predicate and both guard sites are logically correct and fail-safe. The reference-counted
marker module has no observable race within Node's single-threaded loop: `end()` is per-handle
idempotent (the `ended` flag, maintenance-marker.ts:73), the count floors at zero (line 75), and the
timer is cleared and the file removed only at zero (lines 78-81). The guards are evaluated before any
respawn lock acquisition, so an adopt/bail unwinds no shared state (launcher:819, 1685-1694).

### Security (PASS)
No findings. The marker is advisory and read-only on the launcher side: `readMaintenanceMarker` wraps
`JSON.parse` in try/catch and returns null on any error (model-server-supervision.cjs:615-626), so a
corrupt/hostile marker degrades to the safe reap path rather than throwing. `childPid` is validated as
an integer > 0 before use. The DB dir is constrained to project/home/tmp boundaries
(config.ts:81-86), so the marker cannot be redirected outside allowed roots. No credential exposure, no
command construction, no injection surface.

## Ruled Out
- **canonicalizePath vs realpathAllowMissing leaf-missing divergence**: The launcher's
  `canonicalizePath` returns the unresolved path on ENOENT of the full leaf, whereas config's
  `realpathAllowMissing` resolves parent symlinks even when the leaf is missing. This could diverge only
  when the DB dir's leaf is missing AND a parent is a symlink — but the marker only exists while the
  daemon is actively writing it, so the dir exists and both sides fully realpath-resolve and agree. Not
  a live-path defect. Evidence: config.ts:55, model-server-supervision.cjs:419.
- **Build / node --check re-run**: Not independently re-run in this read-only sandbox (the command was
  permission-blocked). Corroborating evidence that the build ran: the shipped artifact
  `dist/lib/storage/maintenance-marker.js` exists and matches the TS source, and the unit test
  `require`s the launcher `.cjs` successfully. impl-summary.md:88-93 records build exit 0 and
  `node --check` OK.

## Dead Ends
None.

## Recommended Next Focus
None for code — correctness and security are clean. Remaining work is documentation reconciliation
(F001-F004): update the impl-summary embedding-queue limitation, align the marker schema (`labels`),
and correct the spec Files-to-Change inventory. These are advisory and do not block the verdict.

Review verdict: PASS
