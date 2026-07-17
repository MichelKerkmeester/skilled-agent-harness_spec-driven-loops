# Iteration 001 — Full-coverage pass (4 dimensions)

Lineage: `p019-opus-4` | Executor: cli-claude-code / claude-opus-4-8 | maxIterations=1

Single-iteration fan-out review of spec 019 (maintenance-grace marker so a busy daemon
survives launcher re-election). Because maxIterations=1, this pass covers all four
dimensions plus both core traceability protocols in one cycle.

## Scope reviewed

- Daemon marker writer: `mcp_server/handlers/memory-index.ts:1432-1502` (constants + scan IIFE + `finally`)
- Pure predicate: `.opencode/bin/lib/model-server-supervision.cjs:601-639` (`maintenanceMarkerPath`/`readMaintenanceMarker`/`shouldAdoptDespiteProbe`) and exports `:1426-1430`
- Launcher: `.opencode/bin/mk-spec-memory-launcher.cjs:325-333` (`maintenanceMarkerDir`), `:814-825` (dead-socket respawn guard), `:1685-1694` (stale-reclaim adopt guard), re-exports `:1845-1847`
- DB-dir precedence anchor: `mcp_server/core/config.ts:63-94` (`computeDatabasePaths`)
- Unit test: `mcp_server/tests/launcher-maintenance-guard.vitest.ts` (12 cases)

## D1 Correctness

- **Marker writer lifecycle (REQ-001).** The scan IIFE writes the marker on `running`, refreshes via an interval timer (20s) **and** at every `onPhase` boundary, and a `finally` block clears the timer + `rmSync(force)` removes the marker. The `finally` covers all four terminal exits (complete/cancelled/failed-envelope/thrown). The interval timer is `unref()`'d, so it never holds the process open at shutdown. CONFIRMED by code; the documented hazard (a synchronous phase longer than the TTL cannot fire the interval timer) is mitigated by the phase-boundary refresh + the 180s TTL margin over the ~79s longest observed blocking phase.
- **Predicate logic (REQ-002/003).** `shouldAdoptDespiteProbe` returns `true` only when: marker present, `childPid` is a positive integer, `marker.childPid === childPid`, `marker.activeUntilMs > now`, and `childLiveness === 'alive'`. Every other branch falls through to `false` (reap). `nowMsFromOptions` (`model-server-supervision.cjs:557`) accepts a number, a function, or defaults to `Date.now()` — matches the unit test's `nowMs:NOW` usage. The boundary case `activeUntilMs === now` correctly yields `false` (strict `>`), verified by unit case (b). CONFIRMED.
- **Guard placement.** Both reap paths are guarded. The dead-socket guard reads the marker *before* acquiring the respawn lock or reaping ("a bail unwinds nothing") — correct ordering. The stale-reclaim guard sits after the primary adopt attempt and reuses the in-scope `adoptResult`. CONFIRMED.

## D2 Security

- **Path boundary.** `computeDatabasePaths` enforces an allowed-prefix boundary (cwd / home / tmpdir) with symlink resolution before the check, throwing for out-of-bounds `SPEC_KIT_DB_DIR`. The marker is written inside that already-validated DB dir; it introduces no new path-traversal surface.
- **Marker trust.** The marker is daemon-authored and advisory. `readMaintenanceMarker` validates `childPid` (positive integer) and `activeUntilMs` (finite) before returning, and a corrupt/missing file yields `null`. A forged marker still cannot pin a daemon because adoption also requires the named pid to be a *live* process AND an unexpired TTL; the worst case is the documented bounded PID-reuse window (≤180s).
- No secrets, no injection, no unsafe deserialization (plain `JSON.parse` in try/catch). No security findings.

## D3 Traceability (core protocols)

- `spec_code`: REQ-001 (write/refresh/clear), REQ-002 (both guard sites), REQ-003 (fail-safe reap), REQ-004 (identical marker-dir precedence) all resolve to shipped behavior. REQ-004 is additionally CONFIRMED empirically: the live `.maintenance-active.json` sits in `mcp_server/database/`, which equals the launcher's default `resolvedDbDir()` (`kitDir/mcp_server/database`); the override branch on both sides is `path.resolve(cwd, SPEC_KIT_DB_DIR||SPECKIT_DB_DIR)` + canonicalization. PASS.
- `checklist_evidence`: the implementation-summary Verification table (build, node --check, unit, harness, live 330s reindex) is corroborated by the commit record and the present marker artifact. PASS.
- **F001 (P2, docs-vs-code-drift):** the "Files to Change" tables in `spec.md:116-117`, `plan.md`, and `tasks.md` cite `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`, but no `mcp_server/bin/` directory exists — the real files are at `.opencode/bin/lib/...` and `.opencode/bin/...`. The handler and test paths are correct. Non-blocking: a reader following the spec's path would miss the files, but the actual deliverables shipped and are correct. Recommend correcting the three doc path references.

## D4 Maintainability

- Pure predicate with injectable fs/now, re-exported through the launcher and unit-tested without spawning a daemon — matches the established codebase convention. Comments explain the *why* (busy-by-design vs wedged, fail-safe-toward-reaping, TTL-must-outlast-longest-phase) without ephemeral artifact labels. Test names encode each fail-safe branch (a–g). Known Limitations are candidly documented, including the unclosed post-scan-embedding-queue gap (addressed by follow-on 020). Clean.

## Claim adjudication

No P0/P1 findings emitted, so no typed adjudication packets are required. The single P2 (F001) is documentation drift with direct file-existence evidence (the absence of `mcp_server/bin/` and the presence of `.opencode/bin/*`), not an inference.

## Verification note (confirmed vs inferred)

- CONFIRMED by direct read: all code logic, guard placement, exports, precedence, and unit-test coverage.
- CONFIRMED by artifact: the live marker file exists at the launcher's default dir (REQ-004 alignment).
- NOT independently re-run in this sandbox: `npx vitest` was blocked by the sandbox permission layer. The 12/12 unit + 6/6 harness + 330s live-reindex results are taken from the commit message and implementation-summary, which are mutually consistent and corroborated by the code and the on-disk marker. A reviewer with shell access can confirm by running the two vitest files.

## Severity counts (this iteration)

- P0: 0 | P1: 0 | P2: 1

Review verdict: PASS
