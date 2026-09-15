# Iteration 2: D2 Security — the restore writer and the quarantine boundary after remediation

## Focus

Dimension: **security** (D2).
Files: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (revert and quarantine writers), `.opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (containment call site), `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (strict containment schema, phase 013).
Scope: the phase-011 restore guard, the phase-008 quarantine refusal, and the phase-013 schema strictness, read against the remediation's own contract. Static evidence only (no test execution, no git write experiments).

## Scorecard

- Dimensions covered: security
- Files reviewed: 4 primary + 2 supporting
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P0, Blocker

None.

### P1, Required

- **F-201**: The opt-in restore still writes through a symlinked *ancestor* directory, `runtime/lib/deep-loop/write-containment.ts:1433-1449` and `:1490-1495`. Phase 011 added `lstatSync(join(opts.repoRoot, violation.path))?.isSymbolicLink()` (`:1433-1434`), which inspects only the final component. Both baseline-write arms then build the destination by string join (`:1447-1449`, `:1493-1494`): `mkdirSync(dirname(join(repoRoot, path)))` followed by `writeFileSync(join(repoRoot, path), baselineBytes)`. If a lane replaces a *parent* directory of the violated path with a symlink to a directory outside the checkout — the link node itself is preserved by the not-in-HEAD branch (`:1480-1481`) — the final-component check sees the link target's own `a.txt` (or nothing) and passes, and the write follows the symlinked parent, so captured baseline bytes land outside the repository while the ledger reports a restored path inside it. The module already holds the rule this writer needs: `canonicalPath` resolves every component, including a dangling link, and `isSubpath` compares the result (`:616-677`); detection uses it (`:669-677`), the write path does not.

**Claim adjudication (P1)**
- *claim*: Under opt-in restore, a violated path whose parent directory the lane replaced with a symlink is written through that link, so captured baseline bytes land wherever the link points, possibly outside the repository.
- *evidenceRefs*: `runtime/lib/deep-loop/write-containment.ts:1433-1434`, `:1447-1449`, `:1490-1495`, `:616-677`, `:1480-1481`.
- *counterevidenceSought*: read the whole revert function for an ancestor canonicalization (none; `canonicalPath`/`isSubpath` are used only by detection and quarantine refusals); checked whether the symlink node is removed before the file write (the not-in-HEAD branch preserves it, `:1480-1481`); checked whether quarantine's destination refusal covers the repo-side write (it only guards artifact-dir destinations, `:1076-1104`); attempted no `git checkout` experiment because git writes are banned for this lineage, so the HEAD branch at `:1419-1425` is left unverified rather than claimed.
- *alternativeExplanation*: The lane must plant the symlink itself, and that write is itself a reported violation. Under the default preserve remedy nothing is written at all. The damage is therefore reachable only under the explicit restore opt-in — which is exactly the mode whose contract after phase 011 is "never writes through a symlink", and a directory the lane controls is enough to redirect it.
- *finalSeverity*: P1 — the guard's stated write-containment contract is bypassed on a path-handling surface, but the default remedy and the artifact-dir refusal both fail safe.
- *confidence*: 0.8 (static proof complete; no runtime reproduction).
- *downgradeTrigger*: downgrade to P2 if a caller is found that canonicalizes `join(repoRoot, violation.path)` before `revertOutOfScopeViolations` (none found across the shipped callers), or if restore mode is unreachable from the shipped command surface (it is reachable: `containmentMode` is wired through `fanout-run.cjs`).

### P2, Suggestion

- **F-202**: The restore writer addresses violation paths against a repo root that may be a subdirectory, `runtime/scripts/runtime-bootstrap.cjs:54-73` with `runtime/lib/deep-loop/write-containment.ts:1449`. `resolveContainmentRepoRoot` returns `cwd` unless the artifact tree lives in a different worktree, while git emits status paths relative to the worktree root regardless of `-C` (the prior review verified this live). The write arms join those paths against `opts.repoRoot` (`:1449`, `:1494`), so a run launched from a subdirectory under restore targets a wrong-but-in-repo path; the deletion pass's disk check correctly uses `scope.repoRealRoot` (`:944`), which shows the module already knows the right root. Latent for the shipped callers (all dispatch with `working_directory: {repo_root}`), but this lineage re-registers it because the remediation put the same path on a *write* surface rather than only detection — prior F-004, still active.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial (security slice) | hard | phase-011 description "never writes through a symlink" vs `write-containment.ts:1433-1449` | F-201 is the residual gap; full verdict in iteration 3 |
| checklist_evidence | notApplicable | hard | packet has no `checklist.md` | re-recorded |

## Assessment

- New findings ratio: 0.50.
- Dimensions addressed: security.
- Security-sensitive override: the target touches path handling, persistence and shared policy, so `minStabilizationPasses=2` applies to any legal STOP; iteration 3 is a third full pass, and the fix-completeness replay rows are recorded in the audit appendix.
- Novelty justification: F-201 is the one level up from the fixed P1 (F-005/F-013 class) — same writer, same class, different path component; F-202 is a re-registered prior finding whose blast radius the remediation widened onto a write path.

## Ruled Out

- Quarantine destination canonicality (phase 008): `quarantineDestinationRefusal` resolves the deepest existing ancestor and refuses any symlinked component below the artifact root, collecting refusals rather than throwing (`write-containment.ts:1076-1104`, `:1294-1347`). Verified correct for the artifact side; the repo-side write is F-201.
- Phase-013 strict schema: `containment` is a `z.strictObject` (`executor-config.ts:803`) and `normalizeFanoutUnionIssue` reports the closest union branch's issues (`:935-950`). Checked the removed-key shapes (`containment.worktrees` under either union branch): the closest branch is the one carrying the containment block, so the key is named. Ruled out.
- Quarantine TOCTOU: the lane process has ended before containment runs (`fanout-run.cjs:3466-3469`), so only a concurrent third party could race the check; that is a different threat model than this guard adjudicates.
- HEAD-branch restore through a parent symlink: not proven either way without a git write experiment, which this lineage forbids; recorded as unverified, not as a finding.

## Dead Ends

- Running the containment suite against a planted ancestor symlink: blocked by the lineage write-surface constraint; the finding rests on the read of both write arms.
- Fetching git documentation on checkout's symlinked-parent behaviour: review is code-only; no WebFetch.

## Recommended Next Focus

D3 Traceability + D4 Maintainability: the packet docs against the remediated tree (spec, acceptance criteria, phase map) and the unswept duplication/diagnostics residue.

Review verdict: CONDITIONAL
