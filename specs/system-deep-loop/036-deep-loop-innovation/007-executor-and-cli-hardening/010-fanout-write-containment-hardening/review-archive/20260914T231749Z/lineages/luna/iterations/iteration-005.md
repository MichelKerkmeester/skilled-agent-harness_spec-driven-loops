# Deep Review Iteration 005

## Focus

Cross-dimension stabilization and replay of all active findings against the current source bytes.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:814-1117`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3350-3438`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:617-629,878-904`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1625-1970`
- `.opencode/commands/deep/assets/deep-review-auto.yaml:1293-1536`
- `.opencode/commands/deep/assets/deep-review-confirm.yaml:1164-1213`
- `.opencode/commands/deep/assets/deep-research-auto.yaml:1475-1521`
- `.opencode/commands/deep/assets/deep-research-confirm.yaml:1092-1126,1523-1525`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:695-709`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:57-64`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:528-548`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:130-142,192-196`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:48-50,63-80,102-108`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:55-61,83-112,120-140`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md:23-37`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/spec.md:38-90`
- `iterations/iteration-001.md` through `iterations/iteration-004.md`

## Findings

### P0

- **LUNA-F003**: Quarantine destinations are not canonicalized before trusted writes — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943` — replay confirms the writer still joins and writes fixed/nested destinations without a canonical boundary check.

### P1

- **LUNA-F001**: Pre-existing untracked deletions disappear from the baseline diff — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823` — replay confirms the current-status-only loop.
- **LUNA-F002**: Failed or incomplete lanes skip containment entirely — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381` — replay confirms the failure throws precede containment.
- **LUNA-F004**: Command caller migration still contains removed worktree assumptions and raw state writes — `.opencode/commands/deep/assets/deep-review-auto.yaml:1307` — replay confirms the stale preflight and direct append remain in the caller surface.
- **LUNA-F005**: Canonical packet records disagree about isolation state — `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:62` — replay confirms accepted decisions and closure surfaces still disagree.
- **LUNA-F006**: Churn threshold rationale contradicts executable defaults — `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:192` — replay confirms the 12/40 rationale beside the shipped 3/12 pair.
- **LUNA-F007**: Quarantine evidence is a mutable single snapshot across retries — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1058` — replay confirms fixed paths and explicit replacement semantics.

### P2

- **LUNA-F008**: Boundary regression tests omit the destination and failure seams — `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1714` — replay confirms adjacent coverage without the three boundary cases.

## Claim Adjudication Packets

No new P0/P1 candidates were introduced in this replay. Existing packets for LUNA-F001 through LUNA-F007 remain the governing adjudications; no source evidence downgraded or disproved them.

## Ruled Out

- `baseline-content-traversal`: `readBaselineContent` consumes paths produced by the snapshot's fixed `containment/baseline/` prefix, and no independent traversal path was found in the reviewed producer/consumer chain at `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:760-808,927-934`.
- `outcome-counting`: the pool keeps completed-with-containment-advisory inside succeeded and increments a separate advisory counter at `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:617-629,878-904`; this is not a new defect.
- `target-symlink-detector`: existing target-side symlink cases remain present at `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1718-1823`; the open security finding is the distinct trusted-destination seam.
- `quarantine-size-bound`: the over-bound case remains covered at `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1903-1921`.

## Traceability Checks

- `spec_code`: fail. The replay preserves the implementation and canonical-document mismatches already identified.
- `checklist_evidence`: fail. The closure evidence still does not cover the active P0/P1 boundary conditions.
- `feature_catalog_code`: pass; the feature entry remains shared-checkout oriented.
- `playbook_capability`: pass; the playbook remains shared-checkout oriented.
- `skill_agent`: notApplicable; the target is a spec folder.
- `agent_cross_runtime`: notApplicable; this lineage is inline cli-codex.

## Next Focus

Synthesis at the hard five-iteration cap; preserve all eight open findings and record `maxIterationsReached`.

## Assessment

Dimensions addressed: stabilization/replay. No new finding was warranted; eight findings remain open, including one P0, six P1s, and one P2. Low novelty is telemetry only because convergence mode is off and stop policy is max-iterations.

Review verdict: FAIL
