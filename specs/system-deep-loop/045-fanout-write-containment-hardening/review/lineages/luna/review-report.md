# Deep Review Report

## Executive Summary

- Target: `specs/system-deep-loop/045-fanout-write-containment-hardening`
- Session: `fanout-luna-1789404700951-8xtlnk`
- Executor: `cli-codex model=gpt-5.6-luna`
- Execution: autonomous inline executor; no nested agent, CLI, or subprocess dispatched an iteration.
- Review dimensions: all configured dimensions, with five passes executed.
- Verdict: **FAIL**
- Active findings: **P0=1, P1=6, P2=1**
- Terminal stop reason: `maxIterationsReached`

The review cannot sign off the target. The P0 finding shows that a pre-existing symlink in the trusted quarantine destination can redirect containment evidence outside the artifact root. The remaining findings identify correctness gaps on baseline deletion and failed lanes, caller migration drift, contradictory packet contracts, an executable-threshold mismatch, mutable retry evidence, and missing regression tests.

The review read the target packet, the containment implementation and tests, the fan-out runner and pool, command callers, executor configuration, the relevant phase packet, and the deep-review artifacts. No target or repository file was changed. All files created by this lineage are under the configured lineage artifact directory.

## Planning Trigger

`/speckit:plan` is required before remediation because the review has an active P0 and multiple P1 findings spanning a security boundary, runner control flow, command callers, executable configuration, and canonical packet records. This review produced a remediation seed only; it did not implement fixes.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["LUNA-F003", "LUNA-F001", "LUNA-F002", "LUNA-F004", "LUNA-F005", "LUNA-F006", "LUNA-F007", "LUNA-F008"],
  "remediationWorkstreams": [
    "secure trusted quarantine destinations and preserve evidence across retries",
    "make containment run for failed and incomplete lanes and detect baseline-only deletions",
    "migrate command callers and reconcile packet contracts with the shipped isolation decision",
    "align churn-threshold rationale, executable defaults, and boundary regression tests"
  ],
  "specSeed": [
    "Define canonicalization and symlink rejection for every trusted quarantine write.",
    "Define containment coverage and evidence retention for failed, incomplete, and repeated lanes.",
    "Declare one authoritative isolation state and one authoritative churn-threshold policy across code and packet records."
  ],
  "planSeed": [
    "Add destination-side symlink and canonical-root checks before mkdir and every quarantine write.",
    "Move containment into the runner's failure-safe lifecycle and diff the complete baseline path set, including untracked deletions.",
    "Remove stale worktree and raw-state assumptions from all deep command callers.",
    "Reconcile goal, specification, ADR, acceptance, summary, handover, and phase-007 records.",
    "Add tests for all three uncovered boundary seams and replay containment after repeated passes."
  ],
  "findingClasses": ["security-boundary", "algorithmic", "control-flow", "cross-consumer", "documentation-contract", "contract-mismatch", "retention", "test-coverage"],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
    ".opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts",
    ".opencode/commands/deep/assets/deep-review-auto.yaml",
    ".opencode/commands/deep/assets/deep-review-confirm.yaml",
    ".opencode/commands/deep/assets/deep-research-auto.yaml",
    ".opencode/commands/deep/assets/deep-research-confirm.yaml",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/spec.md"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

All eight findings remain active after the fifth pass. The registry digest used for synthesis is `b9847c69c3e84f833b4d45670a58c322b0bc827ab9a8a8e3bf3bbbf29c5a9a18`.

### LUNA-F003 — P0 — Security boundary

- Location: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943-950`
- Evidence: The trusted quarantine helper creates directories and writes through paths that are not canonicalized against the artifact root. Content, HEAD patch, baseline patch, fixed quarantine, and manifest writes occur at `:988-991`, `:1014-1017`, `:1037-1040`, `:1078-1087`, and `:1110-1113`. A pre-existing symlink in the trusted destination can redirect those writes outside the artifact root.
- Impact: The containment mechanism can preserve evidence in an attacker-selected location while reporting a successful quarantine, violating the packet's NFR-S01 promise at `spec.md:194-196`.
- Recommendation: Resolve and validate the trusted destination and its existing ancestors before any mkdir or write; reject symlinked destination components and verify every final path remains beneath the canonical artifact root. Add destination-side symlink fixtures, including manifest and patch writes.
- Disposition: Release-blocking active finding.

### LUNA-F001 — P1 — Correctness

- Location: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823-835`
- Evidence: The detector iterates current status entries. A path that was untracked in the baseline and deleted before the post-dispatch sample is absent from current status and therefore absent from the containment diff. Existing tests around `write-containment.vitest.ts:1625-1715` do not cover this baseline-only deletion.
- Impact: A stated baseline-preservation guarantee can be bypassed by deleting an untracked baseline path.
- Recommendation: Snapshot the full baseline path set, including untracked entries, and compare it with the post-dispatch path set before applying containment. Add a regression test for a baseline-only untracked deletion.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F002 — P1 — Control flow

- Location: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381-3420`
- Evidence: Failure, missing-artifact, stop-policy, and salvage gates throw before `enforceWriteContainment` at `:3422-3436` is reached. A failed or incomplete lane can therefore leave an out-of-scope write unreported.
- Impact: Failure paths have weaker write containment than successful paths, precisely where cleanup and evidence handling are most important. The limitation is acknowledged at `implementation-summary.md:120-123`.
- Recommendation: Put containment in a failure-safe `finally` or equivalent outer lifecycle, record the lane outcome, and rethrow only after containment and evidence persistence have completed. Add failed-lane and incomplete-lane tests.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F004 — P1 — Cross-consumer migration

- Location: `.opencode/commands/deep/assets/deep-review-auto.yaml:1304-1308`
- Evidence: The caller still rejects shared checkout and retains a direct `appendFileSync` state write at `:1365-1369`. Related assumptions remain in `deep-review-confirm.yaml:1164-1198`, `deep-research-auto.yaml:1475-1521`, and `deep-research-confirm.yaml:1092-1126,1523-1525`. Phase 007 states that worktree wiring and its flag/config must be removed at `007-worktree-removal/spec.md:50-71`, with acceptance coverage at `007-worktree-removal/acceptance-criteria.md:57-59`.
- Impact: A caller can reject the intended shared-checkout mode or bypass the canonical state gateway after the isolation migration.
- Recommendation: Migrate every listed command caller to the current shared-checkout and gateway contract, then verify the command-level acceptance rows against the actual runtime path.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F005 — P1 — Documentation contract

- Location: `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:62-63`
- Evidence: The goal and accepted ADR-006/ADR-007 decision records at `decision-record.md:528-548` say isolation is off or removed. The parent specification at `spec.md:133,141`, acceptance rows at `acceptance-criteria.md:79,102-108`, implementation summary at `implementation-summary.md:83-112`, and handover at `handover.md:35-37` still describe worktree/default-on behavior.
- Impact: Operators and later agents cannot reliably determine the isolation contract or the expected execution surface.
- Recommendation: Select one shipped isolation state, update every canonical packet surface and acceptance/closure record to that state, and rerun the acceptance evidence check.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F006 — P1 — Executable contract mismatch

- Location: `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:192`
- Evidence: The safety rationale states thresholds of 12 per heartbeat and 40 cumulative, while REQ-004 at `spec.md:139` and executable defaults in `executor-config.ts:701-706` ship 3 and 12.
- Impact: The documented safety envelope and the runtime behavior disagree, so operators cannot know which churn policy is actually enforced.
- Recommendation: Align the rationale, REQ-004, schema defaults, tests, and any user-facing configuration documentation; preserve the chosen values as one executable contract.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F007 — P1 — Retention

- Location: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1050-1059`
- Evidence: The implementation states that a later containment pass replaces the manifest and named files. The fixed quarantine path and fixed nested paths are created or written at `:1078-1113`, `:988`, `:1014`, and `:1037`, without an attempt or iteration identity.
- Impact: A repeated containment pass can overwrite earlier out-of-scope evidence, weakening auditability and replay diagnosis.
- Recommendation: Use unique, append-only attempt/iteration directories or immutable evidence records, and test that repeated passes retain every prior manifest and patch.
- Disposition: Active P1; must be fixed before sign-off.

### LUNA-F008 — P2 — Test coverage

- Location: `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1714-1970`
- Evidence: The boundary suite covers target-side symlink behavior and quarantine size, but omits a trusted destination symlink, a baseline-only untracked deletion, and failed-lane containment.
- Impact: The missing tests allow the P0/P1 seams to regress without a focused boundary failure.
- Recommendation: Add one regression test per omitted seam and a replay-retention assertion. Keep the tests at the containment and runner boundaries so they fail for the actual failure mode.
- Disposition: Active P2 advisory; it becomes part of the remediation completion proof for the related P0/P1 fixes.

## Remediation Workstreams

### Workstream 1 — Secure trusted evidence writes (P0 first)

1. Define the canonical trusted destination and reject symlinked ancestors or final paths that resolve outside the artifact root.
2. Apply the check before directory creation and before content, patch, baseline, and manifest writes.
3. Add destination-side symlink tests and verify an attempted escape fails closed.

### Workstream 2 — Contain every lane outcome

1. Make containment execute for success, failure, incomplete, missing-artifact, and salvage paths.
2. Expand the baseline diff to include untracked paths that disappear before the final sample.
3. Preserve each retry's evidence in an immutable attempt-specific location.
4. Add failed-lane, baseline-deletion, and repeated-pass tests.

### Workstream 3 — Complete the caller and contract migration

1. Remove stale worktree rejection and direct state writes from all deep command callers.
2. Reconcile goal, specification, ADR, acceptance, summary, handover, and phase-007 statements about isolation.
3. Align the churn rationale with the executable 3/12 defaults, or change all surfaces to the selected values together.

### Workstream 4 — Close the verification loop

1. Update the acceptance and task evidence for each corrected seam.
2. Rerun the focused containment and runner tests, then the authoritative workspace gate outside this detached lineage when operator policy permits.
3. Re-run the review after remediation; do not treat the current P2 test gap as independently closed while its related P0/P1 behavior remains open.

## Spec Seed

- Security invariant: every trusted quarantine destination must resolve inside the canonical artifact root, with no symlink escape at any existing or newly created component.
- Lifecycle invariant: containment is attempted and its result is recorded for every lane outcome, including thrown failure and incomplete evidence paths.
- Baseline invariant: the detector compares the complete baseline path set with the final path set, including disappearing untracked paths.
- Retention invariant: evidence from separate containment attempts is immutable and independently addressable.
- Contract invariant: isolation mode and churn thresholds have one authoritative value across executable configuration and packet records.
- Verification invariant: each invariant has an explicit negative test at the seam that enforces it.

## Plan Seed

1. Add a canonical trusted-path validator in the containment writer and route every trusted write through it.
2. Refactor fan-out runner cleanup so containment runs before failure propagation and record preservation is guaranteed.
3. Extend baseline capture/diff and add the baseline-only deletion regression.
4. Change quarantine layout to unique attempt-scoped paths and add replay-retention coverage.
5. Migrate four command workflow surfaces from worktree/raw-state assumptions to the current gateway contract.
6. Reconcile packet records and threshold documentation, then refresh acceptance evidence.
7. Run focused tests and a fresh review with the P0 replay explicitly recorded.

## Traceability Status

| Protocol or surface | Status | Evidence and unresolved drift |
|---|---|---|
| `spec_code` | partial/fail for release | The implementation and tests expose F001, F002, F003, F006, and F007; caller migration exposes F004. |
| `checklist_evidence` | partial/fail for release | Acceptance and closure records still conflict with implementation and phase-007 decisions (F005 and F006); the three missing seam tests are F008. |
| `feature_catalog_code` | no actionable finding in this review | The catalog surface was read; no separate defect was retained beyond the stale worktree/caller surfaces already represented by F004. |
| `playbook_capability` | not executed | No additional playbook claim is made inside this five-pass detached budget. |
| `AC_COVERAGE` | advisory shortfall | The focused negative cases for destination symlink, baseline deletion, and failed-lane containment are not represented in the boundary suite. |

The four configured review dimensions were each examined in a full pass: correctness, security, traceability, and maintainability. A fifth stabilization/replay pass rechecked the highest-risk seams and introduced no additional finding. The legacy projection records the next focus reference on completed dimension rows; the per-iteration narratives and deltas are the authoritative dimension evidence for this inline run.

## Deferred Items

- Enumerate the playbook capability corpus and reconcile any operator-facing wording after the core contract is chosen.
- Re-run the full repository validation and canonical packet completion checks after remediation; those commands were intentionally not run because they can write outside this detached lineage.
- Rebuild graph-backed coverage and semantic-search telemetry in an environment where those services are available. The current run records `graphStatus: unavailable` and `semanticSearchStatus: unavailable`.

## Dimension Expansion Map

| Pass | Focus | Result | Expansion or replay |
|---:|---|---|---|
| 1 | correctness | 2 new P1 findings | Baseline deletion and failed-lane control flow. |
| 2 | security | 1 new P0 finding | Trusted destination canonicalization and symlink escape. |
| 3 | traceability | 3 new P1 findings | Caller migration, isolation contract, and threshold rationale. |
| 4 | maintainability | 2 new findings | Quarantine retention and boundary-test gaps. |
| 5 | stabilization/replay | no new findings | Replayed baseline traversal, outcome counting, target-side symlink detection, and quarantine-size bound; all were ruled out as the current root cause. |

Graph-backed expansion was unavailable. No divergent pivot or nested Council dispatch was used; convergence was configured off and the loop continued to the hard iteration cap as required.

## Search Ledger

- Search coverage: direct source reads and exact lexical searches across the target implementation, callers, tests, packet records, and phase-007 materials.
- Search debt: none recorded by the reducer.
- Ruled-out directions: baseline content traversal, outcome counting, target-side symlink detector, and quarantine size bound.
- Graph search: unavailable; no graph coverage claim is made.
- Semantic search: unavailable; no semantic coverage claim is made.

## Audit Appendix

### Convergence Report

```text
Stop reason: maxIterationsReached
Total iterations: 5
Provisional verdict: FAIL
hasAdvisories: false
Active findings: P0=1 P1=6 P2=1
Configured convergence mode: off
Configured threshold: 0.1
Convergence telemetry score: 0
Graph convergence score: 0
Graph status: unavailable
Semantic search status: unavailable
Decision: continue through all five passes; synthesize only at the cap
```

New-finding counts by pass were 2, 1, 3, 2, and 0. Open-finding counts were 2, 3, 6, 8, and 8. The cap, rather than early convergence, controlled the terminal transition.

### Core Protocols

- `spec_code`: partial; the active findings are linked to executable source and tests, but the security, failure-path, baseline, caller, and threshold contracts are not all satisfied.
- `checklist_evidence`: partial; canonical packet records and missing boundary tests prevent a clean closure claim.

### Overlay Protocols

- `feature_catalog_code`: no separate actionable finding retained.
- `playbook_capability`: not executed in this detached budget.

### Sources Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`
- `.opencode/commands/deep/assets/deep-review-auto.yaml`
- `.opencode/commands/deep/assets/deep-review-confirm.yaml`
- `.opencode/commands/deep/assets/deep-research-auto.yaml`
- `.opencode/commands/deep/assets/deep-research-confirm.yaml`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/spec.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/acceptance-criteria.md`

### Lineage Receipts

- Registry: `deep-review-findings-registry.json`
- Dashboard: `deep-review-dashboard.md`
- Strategy: `deep-review-strategy.md`
- Resource map: `resource-map.md`
- Iteration narratives: `iterations/iteration-001.md` through `iterations/iteration-005.md`
- Iteration deltas: `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`
- Terminal synthesis record: `deltas/synthesis.record.json`

## Resource Map Coverage Gate

`resource-map.md` was emitted in the lineage by the reducer. It is a deterministic artifact map for the captured lineage inputs. The graph service was unavailable, so structural graph coverage is not asserted and no graph-backed stop vote was used.

