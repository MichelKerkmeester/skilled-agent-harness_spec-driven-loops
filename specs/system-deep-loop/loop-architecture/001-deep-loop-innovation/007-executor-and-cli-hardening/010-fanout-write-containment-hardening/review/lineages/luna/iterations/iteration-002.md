# Review Iteration 2

## Dimension

Security: trusted baseline capture and reads, quarantine destination creation, and restore writes across symlink and race boundaries.

## Files Reviewed

- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:820-835,1048-1137,1357-1508
- .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:2202-2432
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3340-3382
- specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:187-207
- specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63-80

## Findings by Severity

### P0

None.

### P1

#### LUNA-S-001 [P1] Baseline capture and read paths are not symlink-contained

- File: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:820-835
- Evidence: captureBaselineFile writes to a path below the lineage baseline directory with recursive mkdir and copyFileSync, without canonical or no-follow destination validation. readBaselineContent consumes the recorded path without validating ancestry.
- Finding class: cross-consumer
- Scope proof: The runner passes the lineage directory as the capture root; focused symlink tests cover quarantine links but no baseline-destination or baseline-read link case.
- Claim adjudication: claim is that a stale or concurrent symlink can redirect baseline bytes outside the artifact; evidence refs are write-containment.ts:820-835,1048-1063 and fanout-run.cjs:3375-3382; counterevidence sought is destination refusal, canonical read validation, or atomic no-follow open; alternative explanation is that private lineage storage lowers likelihood but does not remove the shared trust boundary; final severity P1; confidence 0.95; downgrade trigger counterevidence.
- Recommendation: Apply canonical/no-follow validation to baseline capture and reads and refuse symlinked ancestors or final components.

#### LUNA-S-002 [P1] Restore checks only the final component and can follow a symlinked parent

- File: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1427-1450
- Evidence: Tracked restore checks only lstat of the final path before writeFileSync; not-in-HEAD restore also recreates parents and writes without an ancestor no-follow or canonical guard.
- Finding class: algorithmic
- Scope proof: Both restore branches share the same path-based boundary; the current security test covers only a final-component symlink.
- Claim adjudication: claim is that a child or concurrent actor can replace a repository parent directory with a symlink and redirect restore bytes; evidence refs are write-containment.ts:1427-1450,1491-1495 and write-containment.vitest.ts:2333-2432; counterevidence sought is ancestor validation or atomic no-follow write; alternative explanation is that the final-component guard blocks only the simplest case; final severity P1; confidence 0.97; downgrade trigger counterevidence.
- Recommendation: Validate every ancestor and use an atomic no-follow directory/file-handle strategy for both restore branches; add a parent-component symlink regression case.

#### LUNA-S-003 [P1] Quarantine destination validation is vulnerable to check-then-create replacement

- File: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1066-1137
- Evidence: quarantineDestinationRefusal checks current ancestors, then writeQuarantineFile recursively creates directories and opens by path. An actor can replace an ancestor in the gap. Existing tests cover pre-existing destination links, not replacement during the check/create gap.
- Finding class: cross-consumer
- Scope proof: All quarantine payloads and the manifest flow through writeQuarantineFile:1145-1355.
- Claim adjudication: claim is that path-based refusal followed by recursive creation is not atomic under concurrent writes; evidence refs are write-containment.ts:1066-1137,1145-1355 and write-containment.vitest.ts:2202-2318; counterevidence sought is directory-handle creation, O_NOFOLLOW, or a serialized writer lock; alternative explanation is that private single-writer operation lowers likelihood but concurrent fan-out keeps the invariant relevant; final severity P1; confidence 0.87; downgrade trigger counterevidence.
- Recommendation: Anchor quarantine creation to a verified directory handle or equivalent atomic no-follow operation, or lock validation and creation together; add a replacement-race regression case.

### P2

None.

## Traceability Checks

- spec_code: partial. The packet states a symlink-safe quarantine requirement, while this pass found uncovered baseline and restore trust paths plus a non-atomic quarantine boundary.
- checklist_evidence: partial. Existing tests prove final-component quarantine refusal and final-component restore refusal, but do not prove ancestor or race safety.
- feature_catalog_code: pending for the final traceability pass.
- playbook_capability: pending for the final traceability pass.

## Ruled-Out Directions

- final-component-quarantine-symlink: current refusal logic and tests reject an existing symlink destination.
- Correctness state-transition findings from iteration 1 were not re-entered; the security pass followed the trusted-write boundary instead.

## Verdict

Review verdict: CONDITIONAL

## Next Dimension

Traceability: reconcile the accepted ADR-007 worktree removal with packet requirements, acceptance criteria, task evidence, workflow callers, and current tests.
