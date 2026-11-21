# Iteration 10 - F-1-003 maintainability: fan-out runner and merge change cost

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-003, dimension maintainability. Node scope: `fanout-run.cjs`, `fanout-merge.cjs` and their unit suites.
- Operator review focus covered in this iteration: overengineering (every duplicated helper named and judged against the two-instance rule), operator UX (merged warnings and attribution text), cross-CLI/OS parity (the adapter switch and its fallback).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -- prompt builders, adapter switch, budget and watchdogs.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` -- merge helpers, warning text and attribution output.
- Traceability sources: `009-fanout-review-coverage-merge` REQ-001..REQ-006.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The merge helpers restate the reducer rollup as R1-P2-004 records; no new maintainability contradiction. The iteration 3 REQ-007 admission claim remains the only partial. |
| `checklist_evidence` | partial | AC-010/AC-011 match; AC-008 remains outstanding. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3492-3515` keeps one adapter per executor kind and fails closed on an unknown kind, so a new kind has one registration point.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:946-1009` keeps each merge surface in its own function; the only duplicated arithmetic is the traceability rollup already recorded as R1-P2-004.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1780-1800` writes the partition warning and the merge summary with named fields, so an operator can tell a missing node from an open one.

## Edge Cases

- The native and CLI prompt builders carry two PRE-BOUND lists; they differ only in the surfaces each delivery path needs (`review_target_type`, the lineage artifact dir), and two instances do not earn a shared builder under `prevent-overengineering.md` section 4.
- `fanout-run.cjs` is a large file because it owns adapters, prompt rendering, budget derivation, containment and watchdogs; no single change in this range required touching more than one of those groups, so it is not reported as a cohesion defect.
- The review and research YAML retry blocks are literal twins; the per-loop workflow split is deliberate and the compiled-contract check is the existing drift guard.

## Confirmed-Clean Surfaces

- One adapter map covers all nine executor kinds and throws on an unknown one.
- The merge's helpers are separated by rule, and the only duplicated rule is already a finding.
- Warning and summary text names the missing, open or failed item instead of printing a generic failure.
- The per-lineage budget note names the lineage and its derived share, so an operator can trace a budget without reading the config.

## Ruled Out

- Extracting the PRE-BOUND block into a shared builder: two delivery paths, two lists, no third caller.
- Reporting file size or file count as a maintainability defect: no concrete change in this range paid a cost for it.
- A lint-style duplication finding for the two YAML retry blocks: the workflows are separate contracts and the contract-drift check is the existing guard.

## Next Focus

- Dimension: maintainability on F-1-005 (reducer and upsert clarity, duplication and change cost).
- Reason: F-1-003 is complete across all four dimensions; F-1-005 carries the shared reducer helpers and the evidence derivation that later changes will touch.
- Required evidence: the two reducers' parallel frontier helpers, the upsert's derived-evidence helpers, and the strategy/dashboard rendering paths.
- Rotation status: F-1-003 complete; F-1-005 and F-1-007 have maintainability left.

Review verdict: CONDITIONAL
