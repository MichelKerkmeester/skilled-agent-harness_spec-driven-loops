# Iteration 1: D1 Correctness — the containment guard and its runner wiring

## Focus

Dimension: **correctness** (D1).
Files: `runtime/lib/deep-loop/write-containment.ts`, `runtime/scripts/fanout-run.cjs` (containment wiring, baseline snapshot, churn detector), `runtime/scripts/runtime-bootstrap.cjs`, `runtime/scripts/fanout-pool.cjs` (settlement mapping read-only).
Scope: the eight-commit change set `5340e39233..63b633c62f` on branch `skilled/v4.0.0.0`, read against the packet `spec.md` (REQ-001..REQ-008, NFR-P01, NFR-R01) and the packet's own acceptance criteria. No test execution: this lineage's write surface forbids commands that write outside the lineage directory, so every finding below is static evidence (file:line reads plus git history).

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4 primary + 3 supporting
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.62

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F-001**: A path deleted before dispatch is subtracted from detection forever, even if the lane then writes it, `runtime/lib/deep-loop/write-containment.ts:833-835`. `detectNewOutOfScopeViolations` short-circuits every baseline path whose recorded hash is empty (`if (!preHash) continue;`). The baseline hashes each dirty path with `git hash-object -- <path>` (`write-containment.ts:787`), and for a path deleted at baseline that command exits non-zero, so `gitHashObject` returns `''` (`write-containment.ts:425-429`). The recorded intent is the opposite — the comment at `write-containment.ts:783-786` says hashing every dirty path is what stops a stale advisory from hiding a later write — but the empty-hash branch preserves exactly that hole for the deletion shape. A neighbour's deletion before dispatch, followed by a lane (or the neighbour) recreating that path with new content, is never reported. Severity P2: under the shipped preserve default nothing is destroyed, so the cost is a missed report rather than data loss.
- **F-002**: The churn detector's first window is uncounted, `runtime/scripts/fanout-run.cjs:1676-1687`. The sampler is fed by the progress heartbeat (`fanout-run.cjs:3272-3283` → `fanout-run.cjs:3236-3270`), which first fires one cadence (default 60 s) after dispatch, and the sampler takes its *first* sample as the baseline (`previousPaths === null` → `newlyDirty = 0`, `fanout-run.cjs:1679-1687`). Every path a neighbour dirties between the pre-dispatch snapshot and that first heartbeat is therefore absorbed as "ordinary working-tree life" and contributes nothing to either the per-window or the cumulative arm. A neighbour that writes a burst in the lane's first minute is invisible to the detector whose whole purpose is proving a second writer. Severity P2: the detector is a safety net for the opt-in restore remedy, and under preserve nothing depends on it.
- **F-003**: NFR-P01 undercounts the sampler's real cost, `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:183` vs `runtime/scripts/fanout-run.cjs:3236-3248` and `runtime/lib/deep-loop/write-containment.ts:772-808`. NFR-P01 promises "no more than one `git status --porcelain` invocation per progress heartbeat per lane". The sampler calls `snapshotOutOfScopeDirtyPaths`, which per sample runs `rev-parse --show-toplevel` and `rev-parse --is-bare-repository` (`write-containment.ts:385-393` via `resolveArtifactScope`), one `status --porcelain`, and then one `hash-object` per dirty path (`write-containment.ts:787`). On a checkout with N dirty paths the heartbeat spawns O(N) git processes per lane, which is the shape a busy shared checkout — the case this packet exists for — makes worst. The three `git status` calls that are not `status` are cheap individually and the hash calls are needed by the baseline snapshot; the finding is that the NFR's single-invocation claim is not true of the shipped sampler.
- **F-004**: `resolveContainmentRepoRoot` can hand the guard a subdirectory while every guard path is repo-relative, `runtime/scripts/runtime-bootstrap.cjs:54-73` with `runtime/lib/deep-loop/write-containment.ts:616-624`. `resolveArtifactScope` computes `artifactRelPosix = relative(repoReal, artifactReal)` and compares it against `git status --porcelain` paths, which git emits relative to the worktree root regardless of the `-C` directory (verified: `git -C specs/system-deep-loop status --porcelain` returns `.opencode/...` paths, not paths relative to `specs/system-deep-loop`). `resolveContainmentRepoRoot` returns `cwd` unless the artifact tree is in a *different* worktree, so a runner launched from a subdirectory scopes every artifact path incorrectly: under preserve that is a flood of false advisories, and under the opt-in restore it would target paths the lane itself owns. Latent rather than live — every shipped caller dispatches with `working_directory: {repo_root}` (`deep-review-auto.yaml:1538`, and the same block in the three sibling YAMLs) — but the helper's contract does not state the toplevel requirement it depends on.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial (this iteration's slice) | hard | `spec.md:183` vs `write-containment.ts:772-808` | NFR-P01 cost claim (F-003); the full spec_code verdict is deferred to iteration 3 |
| checklist_evidence | notApplicable | hard | packet has no `checklist.md` | recorded as F-013 in iteration 3 |

## Assessment

- New findings ratio: 0.62 (4 new severity-1 findings against a small reviewed surface with no prior registry).
- Dimensions addressed: correctness.
- Novelty justification: all four findings sit on code paths the change set itself introduced or rewired — the baseline hash branch (F-001), the churn sampler's first sample (F-002), the NFR the sampler was written against (F-003), and the repo-root resolver the guard now depends on for every lane (F-004). None is a restatement of an existing packet finding.

## Claim Adjudication

No new P0/P1 findings this iteration; no packets required.

## Ruled Out

- Retry logic in `spawnGit` (`write-containment.ts:339-377`): retries only `index.lock` contention, bounded at 250/500/1000/2000 ms, and records an exhausted budget. Logic is sound; only the reporting reach is questioned in iteration 5.
- Quarantine bounds: `BASELINE_MAX_FILE_BYTES` / `BASELINE_MAX_LANE_BYTES` are enforced per file and per sweep with `content_truncated` recorded (`write-containment.ts:983-999`). No finding.
- Settlement mapping for the advisory status: `fanout-pool.cjs:883-908` counts it separately from success and failure and keeps it inside `succeeded`; `statusForLedgerEvent` (`fanout-run.cjs:326-344`) is unaffected because the advisory is carried on `output.status`, not a ledger event.

## Dead Ends

- Attempting to run the containment unit suite: blocked by the lineage write-surface constraint (test tooling writes caches outside the lineage directory). Static reading only.

## Recommended Next Focus

D2 Security: quarantine write paths, the restore writer's treatment of symlinks, secret exposure through quarantine content, and the silent-drop behavior of the removed `containment.worktrees` config key.

Review verdict: PASS
