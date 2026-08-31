# Iteration 1 — Deep Review Packet 045

**Session:** 2026-08-31-auto-deep-review-045 · **Generation:** 1 · **Lineage:** new
**Iteration:** 1 of 4 (convergenceThreshold 0.10, stopPolicy convergence)
**Focus:** D2 Security + D1 Correctness on the four predicate-bearing guards.
**Mode:** review · **Target:** `specs/system-speckit/045-daemon-and-test-harness-hardening`
**Budget profile:** scan (target ≤ 12 tool calls).

---

## Dispatcher

- Dispatched by `/deep:review` loop for one iteration.
- Spec folder: `specs/system-speckit/045-daemon-and-test-harness-hardening`
- Artifact directory: `specs/system-speckit/045-daemon-and-test-harness-hardening/review`
- Adjacent in scope: `specs/cli-external-orchestration/058-flag-enum-authority` and the cli-devin surface (deferred — not the riskiest per operator brief).

---

## Files Reviewed (Read-Only)

| File | Path | Lines | Dimensions Touched |
|------|------|-------|--------------------|
| `process-sweep.ts` | `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | 1–428 | D1, D2 |
| `paths.ts` | `.opencode/skills/system-spec-kit/shared/paths.ts` | 1–160 | D1, D2 |
| `run-tests.mjs` | `.opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs` | 1–120 | D1, D2 |
| `git-live-follow.sh` | `.opencode/bin/git-live-follow.sh` | 1–260 | D1, D2, D4 |
| `production-db-isolation.vitest.ts` | `.opencode/skills/system-spec-kit/mcp-server/tests/production-db-isolation.vitest.ts` | 1–103 | D3 (negative-control provenance) |
| `orphan-daemon-reaping.vitest.ts` | `.opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts` | 1–370 | D3 (negative-control provenance) |
| `process-memory-harness.ts` | `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | (grep only, 573 lines) | D2 (classification surface) |

Not yet touched this iteration (deferred to iter 2/3 per operator brief — predicate-bearing files have priority): `system-spec-memory-launcher.cjs`, `model-server-supervision.cjs`, `session-cleanup.js`, both `vitest.config.ts` files, and the cli-external-orchestration surface. None of those carry the kill-switch / predicate / fail-closed risk; the operator brief explicitly named the four files reviewed here.

---

## Findings — New

### P0 Findings

(none)

### P1 Findings

#### 1. **P1-001 [P1] Orphan-sweep kill switch bypassable via the library surface**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:78-87, 232-252, 389-405`
- Evidence: The `SPECKIT_SESSION_START_ORPHAN_SWEEP` kill switch is consulted only in `buildCliPayload` (line 394 — `enabled: isSweepEnabled(env)`). The exported `applySweep` function checks only `opts.enabled === false` at line 246. A caller that imports `applySweep` and forwards a partial `ApplySweepOptions` object (forgetting the `enabled` field) will pass `undefined`, which is not `=== false`, so the env-var kill switch is silently ignored. The help banner at line 385 advertises the env var as the authoritative disable for the apply command, but the library surface treats it as advisory.
- Concrete scenario: `session-cleanup.js` (the orchestrator) currently invokes the sweep via `spawnSync` of the compiled JS CLI (test at line 320–342 of `orphan-daemon-reaping.vitest.ts` confirms — `args: [..., 'apply']`), so today the kill switch is honored. A future maintenance caller that inlines the predicate via `import { applySweep } from './process-sweep.js'` and forgets to mirror the env-var check would silently start reaping orphans on machines where the operator set `SPECKIT_SESSION_START_ORPHAN_SWEEP=off`.
- Finding class: cross-consumer (the kill switch is documented; the library does not enforce it)
- Scope proof: `grep -n "isSweepEnabled\|applySweep\|SPECKIT_SESSION_START_ORPHAN_SWEEP" .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` shows the env var is read once (line 394) and the function `applySweep` is exported (line 232) without the same guard.
- Affected surface hints: ["process-sweep library API", "session-cleanup plugin", "CLI entry point", "kill switch contract"]
- Claim adjudication:
  - type: `correctness`
  - claim: `applySweep` does not honor the documented kill switch when called directly
  - evidenceRefs: `process-sweep.ts:78-87, 232-252, 389-405`
  - counterevidenceSought: any in-repo caller that passes `enabled: isSweepEnabled(env)` from a non-CLI path — none found in the packet scope
  - alternativeExplanation: the kill switch is "CLI-only by design" — not supported by the help banner at line 385 which presents it as the disable for the apply command regardless of caller
  - finalSeverity: P1
  - confidence: high
  - downgradeTrigger: if a future caller wants to bypass the switch, it must opt-in explicitly; the default-undefined path is the surprise

#### 2. **P1-002 [P1] Plan-time parent-pid gate leaves freshly-orphaned daemons alive (false-negative window)**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-216`
- Evidence: `applyCandidate` first checks `if (row.ppid !== 1) return { applied: false, reason: 'live-parent-preserved' }` at line 203. `row.ppid` comes from the inventory snapshot captured at `planSweep` time (line 348–356), a single `ps` read. The apply-time fresh parent re-check at line 215–216 (`readProcessParentPid`) only fires if the plan-time gate already passed. Between `collectInventory()` and the apply-time signal, the daemon's parent can die (operator shell crash, IDE tab close, session end) and the daemon can be reaped to PID 1 — but the row still carries the plan-time ppid and is refused at line 203 before the fresh check is ever consulted.
- Concrete scenario: User opens Claude Code, which spawns the spec-memory launcher daemon (ppid = claude process). User immediately closes Claude (e.g., the IDE tab crashes). The launcher daemon is reaped to launchd (PID 1) and is now a true orphan — but the next session's `applySweep` happens to run within the same wall-clock window, the plan-time `ps` saw ppid=claude, and the row is gated out before line 215. The orphan leaks until the NEXT session starts, at which point plan-time ppid is finally 1.
- Finding class: instance-only (the gate is conservative in the safe direction — but it contradicts goal.md D4 on the false-negative side by leaving real orphans alive)
- Scope proof: `grep -n "row.ppid\|live-parent-preserved" .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` shows the gate at line 203 is the only consumer of plan-time ppid inside `applyCandidate`.
- Affected surface hints: ["applyCandidate gate ordering", "plan-vs-apply snapshot freshness", "orphan reaper correctness"]
- Claim adjudication:
  - type: `correctness`
  - claim: a daemon whose parent dies between planSweep and applySweep is not reaped
  - evidenceRefs: `process-sweep.ts:203, 215-216`
  - counterevidenceSought: any test that exercises parent-dies-between-snapshots — none in `orphan-daemon-reaping.vitest.ts` (every test fixes `getParentPid` or seeds ppid=1 at fixture-build time, never simulates a transition)
  - alternativeExplanation: the gate is "fail safe" — refusing to reap is the conservative choice — supported by the same evidence but only on the false-positive axis; on the false-negative axis this leaks orphans across session boundaries
  - finalSeverity: P1
  - confidence: high
  - downgradeTrigger: if the design intent is to require a SECOND apply pass after a grace window to catch newly-orphaned daemons, the gate is correct as written — but no such second-pass logic exists in the packet

### P2 Findings

#### 3. **P2-001 [P2] Wall-clock grace window vulnerable to NTP adjustment**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:213-214, 254-255`
- Evidence: `nowMs - Math.max(evidence.ownerLeaseStartedAtMs, evidence.processStartedAtMs)` compares wall-clock timestamps from `Date.now()` (line 254) and `Date.parse(ps lstart)` (line 108). NTP step/slew can move wall-clock backward (artificially inflating age) or forward (artificially shrinking age). No monotonic clock is consulted anywhere in this module.
- Concrete scenario: A VM with `chrony` NTP jumps backward 60 seconds during session start. A daemon started 30 seconds ago now appears to be 90 seconds old; grace is 300 seconds by default (line 79) — the daemon still survives. With a tighter custom grace (e.g., 60s) and a 60s backward NTP step, a 30s-old daemon appears 90s old and is killed pre-grace. Flagged because the operator brief asked; practically rare.
- Finding class: instance-only
- Scope proof: `grep -n "Date.now\|Date.parse\|monotonic\|process.hrtime\|performance.now" .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` — no monotonic clock usage.
- Affected surface hints: ["age-check time source", "NTP-aware deployments"]

#### 4. **P2-002 [P2] Apply-time socket-peer check passes empty socketPath, broadens the filter to ALL sockets**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:217-220, 115-131`
- Evidence: When `opts.getSocketPeerConnected` is not provided (CLI path), `readSocketPeerConnected(row.pid, '')` is called. Inside `readSocketPeerConnected` (line 124–126), an empty string makes the filter branch return ALL `lsof` socket lines, then `lines.some((line) => /->|\(CONNECTED\)|ESTABLISHED/i.test(line))` returns true if any line shows a connection. This is more conservative than the lease-derived check at line 152, but it diverges from the documented "connected socket peer" semantics.
- Concrete scenario: A developer attaches `lldb` to the orphan daemon, opening an unrelated TCP connection. The reaper refuses to kill an otherwise-reapable orphan until the debug session disconnects — annoying but safe (false-negative on the leak axis).
- Finding class: instance-only
- Scope proof: Two call sites — line 152 (evidence build) and line 219 (apply re-check) — only the latter passes empty string.
- Affected surface hints: ["socket-peer re-check semantics"]

#### 5. **P2-003 [P2] run-tests.mjs hardcoded 10-minute default timeout is excessive for the mcp-server lane**
- File: `.opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs:11, 57-69`
- Evidence: `DEFAULT_TEST_RUN_TIMEOUT_MS = 10 * 60_000` (600000 ms). The `SPECKIT_TEST_RUN_TIMEOUT_MS` env var overrides but has no per-lane defaults. For unit-style tests in the mcp-server lane, a 10-minute bound on a single hung fixture means an operator who hits Ctrl-C waits the full timeout — the runner ignores stdin because `stdin=subprocess.DEVNULL` (line 27) — plus 2-second SIGKILL grace (line 21).
- Concrete scenario: A fixture accidentally enters an infinite loop on a unit test. Operator cancels the run. Nothing responds (stdin is closed). Test runs the full 10 minutes + 2 seconds before the python wrapper issues SIGTERM, then SIGKILL. Operator loses 10 minutes.
- Finding class: instance-only
- Scope proof: One `DEFAULT_TEST_RUN_TIMEOUT_MS` constant, one env-var override, no per-lane tuning at lines 51–55.
- Affected surface hints: ["test-bound timeout policy", "lane selector map", "Ctrl-C responsiveness"]

#### 6. **P2-004 [P2] git-live-follow.sh LOCK_KEY uses CRC32 truncation only — collision risk in large worktree fleets**
- File: `.opencode/bin/git-live-follow.sh:83`
- Evidence: `LOCK_KEY="$(printf '%s' "$GIT_DIR_PATH" | cksum 2>/dev/null | awk '{print $1}')"` — only the CRC32 half of `cksum` output is used; byte count is discarded. CRC32 has 2^32 ≈ 4.3B possible values; birthday-paradox collision probability becomes non-negligible around 65k distinct worktrees.
- Concrete scenario: A monorepo with many worktrees (e.g., parallel agent fleet of 100+) hits a CRC32 collision between two worktrees' LOCK_KEYs. The second follower can never acquire its lock because the first's `LOCK_FILE` already exists; it exits with "another follower already running for this checkout" (line 250) — but actually no other follower is running for that worktree. Operator never sees live-follow on the affected worktree.
- Finding class: cross-consumer (affects every worktree in a large repo)
- Scope proof: One LOCK_KEY derivation, one use site (lines 84–85).
- Affected surface hints: ["lock key derivation", "multi-worktree deployments"]

#### 7. **P2-005 [P2] git-live-follow.sh log rotation mv-then-truncate can lose the only historical copy**
- File: `.opencode/bin/git-live-follow.sh:89-107, 183-186`
- Evidence: `rotate_log_if_needed` does `mv -f "$LOG_FILE" "$PREVIOUS_LOG_FILE"` then `exec >> "$LOG_FILE" 2>&1`. The `mv` (rename(2)) is atomic, but `exec >>` then creates a NEW empty `LOG_FILE`. `PREVIOUS_LOG_FILE` is unbounded in size — it retains the prior copy — but the very next rotation will overwrite `PREVIOUS_LOG_FILE` with the next generation, so only one historical copy is kept at any time. If a state transition happens immediately before a crash, the transition message is in `PREVIOUS_LOG_FILE`, but the next rotation cycle replaces that with the next generation; operator searching the log after restart sees only the current generation.
- Concrete scenario: A divergence warning fires (`diverged:5:3`). Operator is offline. Two minutes later, a fast-forward rotation overwrites `.log.1` (which contained the divergence warning) with the post-rotation content. Operator comes back, checks the log — sees no divergence record, cannot reconcile.
- Finding class: instance-only
- Scope proof: One rotation function, two call sites (lines 116, 195). No size cap on `.log.1`; no second historical tier.
- Affected surface hints: ["log rotation policy", "diagnostic completeness"]

#### 8. **P2-006 [P2] git-live-follow.sh lock acquisition has TOCTOU race between check and write**
- File: `.opencode/bin/git-live-follow.sh:125-142, 249-253`
- Evidence: `acquire_lock` is `[ -f "$LOCK_FILE" ] || return 1` (in `lock_held`) followed by `printf '%s\n' "$$" > "$LOCK_FILE"`. There is no `flock`, no `mkdir` race, no atomic-rename. Two followers starting simultaneously can both see `lock_held` return false, both write their PIDs. The second overwrites the first's PID; cleanup-on-exit (trap at line 140) then removes the WINNER's lock.
- Concrete scenario: SessionStart spawns two `--start` invocations within the lock-free window (e.g., parallel session hooks, or a parent re-invoking after a transient lock-file absence). One wins, one writes overlapping PID. When the loser exits, its trap removes the winner's LOCK_FILE. Next session sees no lock and starts a duplicate follower. Both run for a window until one or the other completes; double-polling happens.
- Finding class: cross-consumer (affects every startup race)
- Scope proof: One `lock_held`, one `acquire_lock`, no atomic primitive at lines 125–142.
- Affected surface hints: ["lock acquisition atomicity", "SessionStart startup race"]

#### 9. **P2-007 [P2] paths.ts isTestContext is env-only; a vitest worker without env inheritance silently loses isolation**
- File: `.opencode/skills/system-spec-kit/shared/paths.ts:67-71, 94-99`
- Evidence: `isTestContext()` checks three env vars (`VITEST`, `NODE_ENV === 'test'`, `SPECKIT_TEST`). It does NOT inspect `process.argv[1]`, the entry-point path, or the process name. A vitest worker spawned via `child_process.fork` with `env: { ...process.env, VITEST: undefined }` (some forks strip process-specific vars) would not be detected as a test context, and `assertDatabaseIsolation` at line 95 would permit a production-DB write.
- Concrete scenario: A future migration to vitest's `pool: 'forks'` with a custom `env` block that omits `VITEST` for workers — silently disables isolation for those workers. The current test at lines 91–102 of `production-db-isolation.vitest.ts` only checks vitest CONFIG files, not worker process env propagation.
- Finding class: class-of-bug (env-only detection is a known weak pattern for test-context gating)
- Scope proof: Single check site at line 67–71; relied upon by `assertDatabaseIsolation` at line 95.
- Affected surface hints: ["test context detection", "production DB isolation", "vitest worker env propagation"]

#### 10. **P2-008 [P2] paths.ts workspace-root walk uses symlinked dirname; symlinked deployment can mislead root resolution**
- File: `.opencode/skills/system-spec-kit/shared/paths.ts:33-50, 101-114`
- Evidence: `findUp` walks via `path.dirname(dir)` which does NOT resolve symlinks. The walked dirs may be symlinked paths, while `validateResolvedPath` later compares against `import.meta.dirname` (also symlink-unaware in dirname terms). If `paths.ts` is symlinked into the project (e.g., `npm link` of the system-spec-kit skill), the workspace-root walk could diverge from the realpath-resolved comparison in `isProductionDatabaseDir`.
- Concrete scenario: A consumer project `npm link`s the system-spec-kit skill. `findNearestSpecKitWorkspaceRoot` walks the symlinked path and finds the CONSUMER's root (because the consumer also has a `package.json` with `workspaces`, or none, leading to fallback). The fallback path at line 113 (relative to `import.meta.dirname`) then resolves to the symlinked location — but the realpath comparison at line 75 succeeds, so production-DB isolation still triggers. Practically, the fallback warning at line 111 would fire and the operator would notice; flagged because the comparison is fragile under symlink layouts.
- Finding class: instance-only (symlink layouts are rare; the warning at line 111 catches most cases)
- Scope proof: One `findUp` call site at line 102; relies on string comparison at line 75.
- Affected surface hints: ["workspace root resolution", "symlinked deployments"]

---

## Traceability Checks

### Spec/code alignment (core protocol: `spec_code`)

- **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified per phase — `production-db-isolation.vitest.ts:74-89` reproduces a non-test-context call against the production dir and asserts the named error; `orphan-daemon-reaping.vitest.ts:203-238` reproduces an aged orphan with exact ownership and asserts reap; both negative-control reproductions precede the guard assertion in the test body. **Aligned.**
- **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): `orphan-daemon-reaping.vitest.ts:240-268` covers the live-parent case. **Aligned but** the test injects `getParentPid: () => process.pid` as a constant — the parent-dies-mid-sweep window (see P1-002) is NOT exercised.
- **Adjacent packet 058 (Flag Enumeration Authority)**: deferred this iteration per operator brief — predicate-bearing files have priority. Surface evidence will be sampled in iter 2.

### Checklist evidence (core protocol: `checklist_evidence`)

- Phase 1 (production-db isolation): checklist row `fails-closed-with-named-error` is exercised at `production-db-isolation.vitest.ts:74-89` (asserts `ProductionDatabaseResolutionError` instance + name + databaseDir). **Proven.**
- Phase 1 (negative control): the test at line 66-72 establishes that a normal vitest call lands under `os.tmpdir()` — but the assertion `isWithinDirectory(fs.realpathSync(resolvedDatabaseDir), resolvedTempDir)` does NOT verify that the resolved path is NOT inside any other sensitive tree (e.g., the skill's own `database/`). The production-DB-realpath comparison at line 70 catches it; **OK.**
- Phase 2 (orphan daemon reaping): checklist row `reaps-only-aged-exactly-owned-orphan` exercised at `orphan-daemon-reaping.vitest.ts:203-238`. **Proven**, but see P1-002 for the parent-pid staleness gap.
- Phase 2 (live-parent preserved): exercised at `orphan-daemon-reaping.vitest.ts:240-268`. **Proven.**
- Phase 2 (connected socket peer): exercised at `orphan-daemon-reaping.vitest.ts:270-296`. **Proven** (note: uses `evidenceByPid` injection, not live `lsof` — see P2-002).
- Phase 2 (kill switch): exercised at `orphan-daemon-reaping.vitest.ts:298-318`. **Proven** for the CLI path; **NOT proven** for the library path (see P1-001).
- Phase 3 (test-hang containment): not directly exercised in the reviewed test files — the tests in `production-db-isolation.vitest.ts` and `orphan-daemon-reaping.vitest.ts` run via vitest directly, not via `run-tests.mjs`. **Coverage gap** (no test in scope demonstrates that the python wrapper actually bounds a hung vitest). Logged for iter 3.
- Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap.** Logged for iter 3.

---

## Integration Evidence

External surfaces checked (this iteration):

- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` — provides `collectInventory`, `hasKnownProjectOwnerMarker`, `getProcessAncestry`, `syntheticFixtureSnapshot` to `process-sweep.ts`. Grep-only read (573 lines, 14 hits). The classification function `classifyProcess` (line 424) and `hasKnownProjectOwnerMarker` (line 135) are the upstream of the project-identity check at `process-sweep.ts:271`. **No new findings** — these helpers are referenced once and not modified by this packet.
- `.opencode/plugins/session-cleanup.js` — referenced by `orphan-daemon-reaping.vitest.ts:323, 348` (imported as a default export and exercised via hook events). Not directly read this iteration. **Deferred** — the test confirms the spawn contract; predicate surface is in `process-sweep.ts`.

External surfaces NOT yet checked (deferred per operator brief):

- `.opencode/bin/system-spec-memory-launcher.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/plugins/session-cleanup.js` (full read)
- `.opencode/skills/system-spec-kit/vitest.config.ts`
- `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`
- `specs/cli-external-orchestration/058-flag-enum-authority` and the cli-external-orchestration/cli-devin surface

---

## Edge Cases

| ID | Case | Classification | Notes |
|----|------|----------------|-------|
| EC-1 | Packet 058 flag-enum drift into cli-devin | deferred | Adjacent surface not reviewed this iteration; risk is style/spec drift, lower than the predicate-bearing files. |
| EC-2 | Phase 3 run-tests.mjs test coverage gap | open | No test in scope exercises the python wrapper's bounded vitest run. Iteration 3 should confirm a fixture exists or note the gap. |
| EC-3 | Phase 4 git-live-follow.sh test coverage gap | open | No test in scope asserts rotation, dedup, lock uniqueness. Iteration 3 should confirm a fixture exists or note the gap. |
| EC-4 | PID reuse between evidence read and signal | mitigated | `applyCandidate` line 207-212 re-checks `getProcessStartTimeMs` and rejects if the PID has been recycled. Mitigated by the re-check; the race window is the gap between line 207 and the kill at line 229. |
| EC-5 | Plan-time vs apply-time parent-pid staleness | flagged (P1-002) | See finding P1-002. |
| EC-6 | Library-side kill-switch bypass | flagged (P1-001) | See finding P1-001. |
| EC-7 | Wall-clock grace under NTP | flagged (P2-001) | See finding P2-001. |
| EC-8 | Symlinked `paths.ts` deployment | flagged (P2-008) | See finding P2-008. |
| EC-9 | Env-only test-context detection | flagged (P2-007) | See finding P2-007. |
| EC-10 | LOCK_KEY CRC32 truncation in large worktree fleets | flagged (P2-004) | See finding P2-004. |
| EC-11 | Lock acquisition TOCTOU in git-live-follow.sh | flagged (P2-006) | See finding P2-006. |
| EC-12 | Empty-socketPath socket check semantics | flagged (P2-002) | See finding P2-002. |
| EC-13 | Log rotation mv-then-truncate loses only copy | flagged (P2-005) | See finding P2-005. |
| EC-14 | run-tests.mjs 10-minute default | flagged (P2-003) | See finding P2-003. |

---

## Confirmed-Clean Surfaces

- `.opencode/skills/system-spec-kit/shared/paths.ts` — `isProductionDatabaseDir` correctly uses `realpathSync` on both sides (line 75). Symlink defeats of the production-database comparison are correctly handled.
- `.opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs` — process group containment is correct: `start_new_session=True` at line 27 ensures the child vitest is in its own session and process group; `os.killpg(process.pid, SIGTERM)` at line 33 targets the child's group only (the parent python and node runners are in a different group). **No caller-group kill possible.** This was an explicit operator concern and is cleared.
- `.opencode/bin/git-live-follow.sh` — fast-forward-only safety is correct: `git merge --ff-only` at line 221 refuses to clobber dirty tracked files; untracked scratch is preserved; diverged branches are reported (line 235) without being reset or merged. **Safety contract upheld on the merge axis.**
- `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` — PID-reuse defense at lines 207–212 (process start time re-check before kill) is correct.
- `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` — self-pid and ancestor-pid refusal at lines 307-313 is correct.

---

## Ruled Out

- **`paths.ts` symlink defeat of production-DB detection**: ruled out by `realpathSync` at line 75.
- **`paths.ts` bind-mount defeat**: realpath resolves bind mounts to the same physical directory, so `===` comparison catches it.
- **`run-tests.mjs` killing its own caller's process group**: ruled out by `start_new_session=True` and `killpg(child_pid, ...)` — the runner is in a different group.
- **`process-sweep.ts` killing self**: ruled out by `row.pid === opts.selfPid` check at line 307.
- **`process-sweep.ts` killing an ancestor process**: ruled out by `ancestorPids.has(row.pid)` check at line 311.
- **`process-sweep.ts` killing an unknown-owner process**: ruled out by classification checks at line 319-321 and the project-identity check at line 324-326.
- **`git-live-follow.sh` rebasing/merging/resetting**: ruled out by `--ff-only` at line 221 and the explicit diverged warning at line 235.
- **`git-live-follow.sh` clobbering a dirty tree**: ruled out by `--ff-only` refusal on dirty tracked files (line 221) plus the explicit warning at line 224.

---

## Next Focus

- **Dimension:** D3 Traceability + D2 Security (residual surface).
- **Focus area:** (a) Phase 3 (`run-tests.mjs`) bounded-vitest test coverage gap (EC-2); (b) Phase 4 (`git-live-follow.sh`) log-hygiene test coverage gap (EC-3); (c) adjacent packet 058 (Flag Enumeration Authority) and the cli-devin surface — look for flag-array drift introduced by the consolidation; (d) `session-cleanup.js` full read (referenced by the orphan-reaping test but not directly reviewed).
- **Reason:** Iteration 1 surfaced two P1s on the predicate-bearing files; iterations 2 should (i) confirm whether the gaps at EC-2/EC-3 have fixtures in unreviewed test files, and (ii) cross-reference the cli-external-orchestration surface that the operator flagged as adjacent.
- **Rotation status:** not stuck; the P1s are clear and the P2s are scoped.
- **Blocked/productive carry-forward:** none blocked; the parent-pid-gate finding (P1-002) and the kill-switch bypass (P1-001) are independent and can each be addressed in isolation by `/speckit:plan`.
- **Required evidence for iter 2:** direct read of `session-cleanup.js`, both `vitest.config.ts` files, `system-spec-memory-launcher.cjs`, `model-server-supervision.cjs`; grep for flag-enum arrays across `cli-external-orchestration/**/SKILL.md`.
- **Recovery note:** none — first iteration completed cleanly within budget.

---

Review verdict: CONDITIONAL
