---
title: Deep Review Iteration 010 - Final Verification Pass Against HEAD 5c5b9fe3e5b
description: Final iteration of generation 5. Re-verifies the four active P2 findings by probe at HEAD, then spends the remaining budget on the correctness dimension over the files the fix commit touched.
trigger_phrases:
  - "deep review iteration 010"
  - "advisor logic final verification pass"
  - "resolvedFindings closure probe"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Review Iteration 010

BINDING: target=.skilled/skills/system-skill-advisor
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement

## Dispatcher

Final iteration of a `max-iterations` run (iteration 10 of 10, `lineageMode=completed-continue`, generation 5, continued from run 9). Iteration number derived from the state log: nine `type:"iteration"` records, so 10. Dispatch carried an explicit final-verification brief: re-probe the four active P2 findings against the committed tree and close each only with evidence that was actually run, then spend the remaining budget on correctness over the files in `git show --stat HEAD`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts:1-19` - full read; the win32 branch and the default mode mask.
- `.skilled/skills/system-skill-advisor/runtime/tests/owned-private-dir.vitest.ts:80-93` - the stubbed-win32 case and its `process.platform` restore.
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:60-260` - path resolution, containment, the folder hardening and `appendPrivateLine`.
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:170-270` and `:320-340` - `dirReady`, `privateDirReady` and `appendPrivateLine`, plus the single path builder at `:324`.
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:26-30,281-290` - the `ownedFolder()` rewrite onto the shared predicate.
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:738-790,955-1055` - `isPathInside`, `realpathOfNearestAncestor`, `deleteMissingNodesUnderRoot` and the re-published `knownSkillIds`.
- `.skilled/bin/lib/launcher-ipc-bridge.cjs:179-226,445-515` - `ownershipProblem`, `checkIpcSocketOwnership` and the pre-bridge refusal.
- `.skilled/bin/lib/launcher-session-proxy.cjs:12-20` - the imported ownership check.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` - exercised by probe, not read.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. Four prior P2 findings were closed by probe this iteration (see Confirmed-Clean Surfaces); no new defect was confirmed in the HEAD diff, and nothing was recorded to reach a count.

## Resolved Findings

Each closure below rests on a command whose output and exit status were read, not on the change summary.

1. **G5-I8-P2-001 - Python fallback hard-fails at import when the shared prompt-policy file is missing.** Case: an operator points `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` at a path that does not exist and runs the fallback. Ran `SPECKIT_ADVISOR_PROMPT_POLICY_PATH=/nonexistent/p.json python3 runtime/scripts/skill_advisor.py "implement a retry helper" --force-local` → exit 0, one stderr line `skill_advisor: unusable prompt policy /nonexistent/p.json: [Errno 2] No such file or directory`, and a normal payload (`sk-code`, confidence 0.95, `passes_threshold: true`, `source: local`). The import no longer aborts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4085]
2. **G5-I2-P2-002 - Opt-in shadow sink appends to a non-gitignored path without mode or symlink guard.** Case: a shadow write at the default path lands in a tracked file, and a planted symlink redirects it. Both halves closed. `git check-ignore -v` on the default path prints `.gitignore:212` and exits 0; on the rotation `...jsonl.1` it prints `.gitignore:214` and exits 0. The guard half is present: `mkdirSync(dir, { recursive: true, mode: 0o700 })`, an `isOwnedPrivateDir` check that refuses a symlinked, foreign-owned or group/world-writable folder, a `chmodSync` recovery with a re-check, and `appendPrivateLine` opening `O_NOFOLLOW` with `nlink === 1`, a uid check and `fchmodSync(0o600)`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:137-186]
3. **G5-I9-P2-001 - A hardened writer turns silent on a platform where mode bits carry no meaning.** Case: a Windows run of any `isOwnedPrivateDir` consumer. The predicate now skips the POSIX mode test on win32 while keeping the symlink, directory and uid tests: `if (process.platform === 'win32') return true;` sits after those three checks and before `(stat.mode & forbiddenModeBits) === 0`. A stubbed-platform case pins it (`tests/owned-private-dir.vitest.ts:80-93`: a `0o777` directory is accepted under `platform: 'win32'` and the descriptor is restored in `finally`). Remaining limit, unchanged and accepted: the skip rests on Node's documented mode reporting, not on a Windows run. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts:12-18]
4. **G5-I9-P2-002 - A tracked module imports a file that git does not yet contain.** Case: a fresh clone where `hooks/lib/route-receipt.ts:29` imports `../../runtime/lib/owned-private-dir.js` and the target is untracked. Ran `git ls-files --error-unmatch .skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts` → prints the path, exit 0, so the module is tracked and the import resolves on a clone. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:29]

## Correctness Review of the HEAD Diff

The commit message leads with the graph-scan scoping and the shared ownership predicate, so both got a line-level read rather than a summary read.

- `deleteMissingNodesUnderRoot` is scoped, not narrowed by accident: a row survives when it is in `scannedSkillIds`, and is deleted only when its stored path lands under the scan root by either the plain relative test or the canonicalized one. Both directions hold for a rename inside the root (the old row's stored path is under the root, so it is deleted) and for a scan of a nested skill (an outside row fails both tests, so it survives). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:748-778]
- `realpathSync(scanRoot)` cannot throw on a missing root from this route: no discovered skill means `skillIds.length === 0`, which returns the `EMPTY-SKILL-SCAN` summary before the transaction. `realpathOfNearestAncestor` terminates because `dirname` of a filesystem root is itself and that root exists. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:753-760]
- Recomputed `knownSkillIds` from the database is correct at that point: deletions ran first inside the same transaction, so every remaining id is a node the edge publisher can legitimately target. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1051-1053]
- `checkIpcSocketOwnership` asks for the right set of folders. A default unscoped socket checks only `/tmp/system-skill-advisor`; a scoped socket checks the scoped folder and `/tmp/system-skill-advisor` as its trusted parent; a configured dir outside the default checks only the leaf. `ownershipProblem` treats a missing socket as no problem (the caller has already tested existence), and refuses a symlink, wrong kind, foreign uid, or a group/world-writable folder. [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:202-226]
- `metrics.ts` keeps one directory, so its process-wide `dirReady` cache is sound: `DURABLE_METRICS_ROOT` is the only root and `:324` is the only path builder feeding `writeBoundedJsonl`. A refused write now returns instead of throwing, and the two-mode check (`isOwnedPrivateDir(dir, 0)` then `isOwnedPrivateDir(dir)`) separates "is a real owned directory" from "is private", which is what makes the `chmod` recovery reachable without accepting a symlink. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:263-283]

## Traceability Checks

- `spec_code` (`partial`): the four probed findings map onto acceptance criteria that claim `Met` - AC-003 (store symlink and foreign-owner refusal), AC-001 (narrow-scan node preservation), AC-012 (cited paths exist). The code at HEAD matches those claims for the paths this iteration touched. The protocol stays `partial` rather than `pass` because this pass re-verified four areas, not the full AC-001..AC-014 set: AC-013's gate run and AC-006..AC-008's mutation proofs were not re-run here. [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:54-67]
- `checklist_evidence` (`pass`): the 029 acceptance table carries thirteen `Met` rows with a verification cell and at least one `Unmet` row that names the outstanding gate honestly (AC-014 needs further review passes, which is this run). No row claims `Met` without a verification method. [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:66-67]
- Overlay protocols `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not run this iteration. They were covered in iterations 3 and 5 against the same target, and this pass spent its budget on the code diff. They are recorded as run-in-earlier-iterations rather than as pending.

## Integration Evidence

- `.skilled/bin/lib/launcher-ipc-bridge.cjs:471` is the single pre-bridge refusal point, reached from `maybeBridgeLeaseHolder` after the socket existence test and before the deep probe, so a foreign-owned socket is refused before any prompt is forwarded.
- `.skilled/bin/lib/launcher-session-proxy.cjs:15` imports the same check, so the reattach path and the launcher bridge share one predicate rather than two copies.
- Gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (`--mode review`) is the only writer of the state log for this record.

## Edge Cases

- **Ambiguous (recorded, not resolved by evidence):** the win32 skip in `isOwnedPrivateDir` now also relaxes `FileRouteReceiptStore.ownedFolder()`, because that method was rewritten onto the shared predicate. The behaviour is an improvement on Windows (the old inline test required `(mode & 0o077) === 0`, which `0o40777` never satisfies, so the receipt store could not write there at all), but it means one accepted P2 now has two call sites rather than one. Recorded under the closed finding, not re-raised.
- **Missing optional evidence:** nothing in this iteration ran a Windows or a second-uid process. Both closed findings that touch platform-specific behaviour (G5-I9-P2-001) and cross-user ownership (G5-I2-P2-002's foreign-owner branch) rest on the code and the in-repo tests, which is the same limit earlier iterations carried. The gitignore and mode-guard halves of G5-I2-P2-002 were proven by command; the foreign-uid branch was not executed.
- **Partial success:** no dimension was re-opened. The two overlay protocols that would have needed a fresh catalog and playbook sweep were not re-run; their earlier results stand and are not upgraded.

## Confirmed-Clean Surfaces

- `git status --porcelain` outside the review packet shows only the run's own `dispatch-receipts/` files - no source, doc or config file is dirty at HEAD. The committed tree is what was reviewed.
- The four closed P2s are clean on the evidence listed under Resolved Findings; each was proven by a command whose exit status was read (two `git` probes, one `git check-ignore` pair, one Python run) or by a full read of the predicate plus its pinning test.
- Comment hygiene in the diff: the new comments state durable reasoning only ("Windows has no POSIX mode bits (ACLs govern access)...", "An empty result is a wrong or missing root, not evidence that its skills were removed."). No spec path, ADR/REQ/CHK id or task id appears in a comment in the files read this iteration.

## Ruled Out

- **A defect in `realpathOfNearestAncestor` for a path with no existing ancestor:** `dirname` of a filesystem root returns itself, and that root exists, so the loop terminates. Not reachable as a hang.
- **`deleteMissingNodesUnderRoot` leaving a stale row after a skill-id rename:** the old row's stored path is still under the scan root, so it is deleted; the case is covered by the plain relative test, not only the canonical one.
- **A regression from recomputing `knownSkillIds` out of the database:** deletions precede it inside the same transaction, so it cannot contain a node that no longer exists.
- **Multiple-directory aliasing breaking `metrics.ts`'s `dirReady` cache:** one root, one path builder (`:324`), so the process-wide flag describes exactly one directory.
- **`checkIpcSocketOwnership` accepting a world-writable trusted parent:** the parent is checked through the same `ownershipProblem` predicate, including the `(stat.mode & 0o022) !== 0` refusal.

## Next Focus

- Dimension: none - final iteration of a `max-iterations` run.
- Focus area: synthesis.
- Reason: all four dimensions were completed across iterations 1-9; every registry finding is now either resolved (18) or closed by probe in this pass (4). No active P0, P1 or P2 remains.
- Rotation status: complete (4/4).
- Blocked/productive carry-forward: `SL-004` (state_transition, deferred at iteration 8) stays the only open search debt. Nothing is blocked.
- Required evidence: synthesis should recompute the registry from the deltas, which now carry `resolvedFindings` for this record, and confirm the merged verdict is PASS.
- Recovery note: not applicable.

Review verdict: PASS
