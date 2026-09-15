# Iteration 2: D2 Security — the restore writer, quarantine writes, and the config surface

## Focus

Dimension: **security** (D2).
Files: `runtime/lib/deep-loop/write-containment.ts` (revert, quarantine, capture), `runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs` (mode resolution), `.opencode/commands/deep/assets/*.yaml` (inline callers, read-only).
Scope: the change set's write paths and trust boundaries, against the packet's NFR-S01/NFR-S02 and REQ-001/REQ-002. Static evidence only (no test execution available in this lineage).

## Scorecard

- Dimensions covered: security
- Files reviewed: 3 primary + 4 supporting
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker

None.

### P1, Required

- **F-005**: Baseline-targeted restore follows a symlink and can write outside the working tree, `runtime/lib/deep-loop/write-containment.ts:1184-1187`. Under the opt-in `restore` remedy, the new baseline branch restores bytes with `writeFileSync(join(opts.repoRoot, violation.path), baselineBytes)`. `fs.writeFileSync` opens with `w` and therefore follows a symlink in the final path component; the pre-existing HEAD branch (`checkoutFromHead`, `write-containment.ts:1167-1176`) does not have this property because `git checkout HEAD -- <path>` writes the link itself. The reachable sequence: a path is dirty before dispatch and its bytes are captured (`captureBaselineFile`, `write-containment.ts:739-757`), something swaps that path for a symlink during the lane (the guard's own premise is that it cannot prove who), and the restore writes the captured bytes through the link to its target — a file of the attacker's choosing that the process can write. The patch capture that precedes a restore (`captureRevertPatch`, `write-containment.ts:869-916`) makes the destroyed content recoverable but does not constrain where the write lands. Severity P1 rather than P0: the remedy is opt-in and documented as single-operator only, and the preconditions (already-dirty at baseline with captured bytes, plus a link swapped in at exactly that path mid-lane) are narrow. It is a genuine arbitrary-write primitive in the shipped code, so it is required rather than advisory.

### P2, Suggestion

- **F-006**: The quarantine writer does not canonicalize its destination, `runtime/lib/deep-loop/write-containment.ts:943-951, 983-1044`. NFR-S01 states the quarantine writer "never follows a symlink out of that directory" (`spec.md:195`), and the detector does canonicalize the path it judges (`isContainedInArtifact`, `write-containment.ts:588-596`). The writer does not: `writeQuarantineFile` calls `mkdirSync(dirname(destination), { recursive: true })` and writes, and the destinations are built by string-joining the git-reported path (`content/${violation.path}`, `patch-baseline/${violation.path}.patch`). A symlink already present at any component of `<lineageDir>/containment/quarantine/...` redirects the write. The practical risk is low — the leaf already holds unrestricted write access to the checkout by design, so it gains nothing — but the stated containment rule is enforced on the read side and not on the write side, which is the asymmetry the requirement exists to prevent.
- **F-007**: Quarantine copies out-of-scope file content into a publishable artifact plane, `runtime/lib/deep-loop/write-containment.ts:983-999` with `fanout-run.cjs:3223-3231`. The pre-dispatch baseline already copies *every* dirty out-of-scope file into `<lineage>/containment/baseline/` (`captureBaselineFile` via `snapshotOutOfScopeDirtyPaths`, `write-containment.ts:790-798`), and the quarantine copies violated paths again under `containment/quarantine/content/`. An implementation summary on this very packet records a live run capturing 893 files at 8.2 MB, "including in-progress files belonging to eight other packets" (`implementation-summary.md:128`). Any dirty file holding credentials or personal data is duplicated into the lineage directory, which is an artifact plane that gets copied back and can be committed. This is new exposure the packet introduced: the old remedy destroyed such files rather than copying them. Severity P2: it is bounded by the same size limits and it is an operator-visible artifact, but nothing filters or redacts content before it is copied.
- **F-008**: The removed `containment.worktrees` key is silently accepted, `runtime/lib/deep-loop/executor-config.ts:695-716`. The schema dropped `worktrees` when the mechanism was removed, and the object schema drops unknown keys silently — the file says so in the comment directly below the containment block and guards the removed `stopPolicy` key with `z.never().optional()` for exactly that reason (`executor-config.ts:710-715`). `worktrees` got no such guard even though the packet's own spec (REQ-007, `spec.md:141`) and handover (`handover.md:35`) documented `containment.worktrees: false` as a supported opt-out, and callers that pinned `--worktrees`/`worktrees: true` now receive a shared-checkout run with no isolation and no warning. Severity P2: the removal is deliberate and ADR-007 records it, so the issue is the silent acceptance of a key whose behavior changed rather than the removal itself.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial (this iteration's slice) | hard | `spec.md:195` vs `write-containment.ts:943-951` | NFR-S01 write-side asymmetry (F-006); full verdict in iteration 3 |
| playbook_capability | pass | advisory | `manual-testing-playbook/write-containment/shared-checkout-run.md` | scenario still describes the preserve remedy accurately |

## Assessment

- New findings ratio: 0.55 (one P1 plus three P2 against the reviewed write paths).
- Dimensions addressed: security.
- Novelty justification: F-005 and F-006 sit on writers the change set introduced or extended (baseline restore is new in REQ-002; the quarantine writer is new in REQ-001); F-008 is a direct consequence of phase 7's schema removal. None duplicates iteration 1.

## Claim Adjudication

### F-005

```json
{
  "findingId": "F-005",
  "claim": "In restore mode the baseline branch writes captured bytes with fs.writeFileSync to a repo-relative path, so a symlink swapped in at that path after capture redirects the write outside the working tree.",
  "evidenceRefs": [
    "runtime/lib/deep-loop/write-containment.ts:1184-1187",
    "runtime/lib/deep-loop/write-containment.ts:1167-1176",
    "runtime/lib/deep-loop/write-containment.ts:927-935"
  ],
  "counterevidenceSought": "Read the whole revert function for a guarded-open, lstat, or realpath check before the write; checked readBaselineContent for a canonicalization step; grepped the module for O_NOFOLLOW and lstat; compared against the HEAD branch. None exists.",
  "alternativeExplanation": "The restore remedy is opt-in, documented as single-operator only, and the guard already assumes a checkout where every writer is trusted — under that assumption the symlink case cannot arise. Rejected as a full explanation because the packet's own premise is that attribution is impossible even on a shared checkout, and the fix is a one-line lstat/O_NOFOLLOW guard that costs nothing.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If the restore path is changed to write through a temp file plus rename, or to refuse a path that is not a regular file (lstat check), downgrade to P2 documentation of the residual risk.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery, confirmed by re-reading the write site and the HEAD branch's different behavior" }
  ]
}
```

## Ruled Out

- Quarantine content bound: enforced at 2 MiB per file and 64 MiB per sweep with truncation recorded (`write-containment.ts:707, 716, 983-999`). Matches NFR-P02.
- `isContainedInArtifact` narrowing rule: name test plus canonical test can only narrow, never widen (`write-containment.ts:574-596`). Correct as documented.
- The escaping-symlink carve-out: an escaping path is held out of the regenerable-state exemption and stays fatal (`write-containment.ts:1286-1293`). Correct.

## Dead Ends

- Reviewing the deleted worktree modules for security regressions: they no longer exist in HEAD and are not reachable code; only their documentation traces matter (iteration 3/4).

## Recommended Next Focus

D3 Traceability: run the `spec_code` and `checklist_evidence` protocols against the packet's requirements, acceptance criteria and shipped state, including the worktree supersession and the stale-evidence citations.

Review verdict: CONDITIONAL
