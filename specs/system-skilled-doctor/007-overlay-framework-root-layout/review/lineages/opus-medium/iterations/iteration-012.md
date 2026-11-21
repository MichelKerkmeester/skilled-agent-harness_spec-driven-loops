# Iteration 012 - Frontier node F-1-007: security and maintainability

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-007 (remediation records), dimensions security (registry next) and maintainability, each with its own pass; the last node with dimensions left.
- Review focus addressed: checked whether the push and re-pin records expose a credential or hide a bypassed control, and whether the record set stays cheap to keep correct.
- Sources: steer.md absent; strategy; registry frontier (F-1-007 next security).

## Files Reviewed

- Credential scan over `specs/system-skilled-doctor/007-overlay-framework-root-layout/001-*` through `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-*` and ai-speckit's 039 record (patterns: GitHub token prefixes, fine-grained PAT prefix, AWS key prefix, password, Authorization headers, GH_TOKEN and GITHUB_TOKEN assignments): no hit
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/goal.md:87`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:113-115`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:47` (push identity, rule bypass, push verify clause)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 stays active.

### P2 Findings

None.

## Security Pass

- No credential, token or key appears in any phase record or the 039 record.
- The push used the owner account through a per-command credential override after the active account got 403, and GitHub reported "Bypassed rule violations for refs/heads/main" (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/goal.md:87`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:113`). The record states this plainly, names both accounts, and says the active account was left unchanged. T005's own bar, no force and no --no-verify (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:47`), was met. Whether bypassing main's rules was intended is the operator's call, not a defect in the change; recorded as an edge case.

## Maintainability Pass

- Each phase states its verification three times (goal, tasks verify clause, summary table). Iterations 4 and 8 found the two stale lines (R4-P2-001, R4-P2-002) in the summaries and continuity blocks, not in the tasks, so the tasks file is the copy that stays current. Not raised separately.

## Traceability Checks

- checklist_evidence: pass for T005 (no force, no --no-verify; b5a630c6efa on origin/main).

## Edge Cases

- Main's branch rules were bypassed by the owner account on the landed push. The record discloses it; this lineage cannot tell whether the operator meant to bypass them.

## Confirmed-Clean Surfaces

- Credential hygiene of all records; push verify clause.

## Ruled Out

- A secret pasted into a record: none found.

## Next Focus

- Dimension: none left on the frontier
- Focus area: synthesis, if the convergence check allows a stop; otherwise a replay pass on the active P1
- Reason: every frontier node has covered all four dimensions
- Rotation status: all nodes done
- Required evidence: convergence decision after this iteration

Review verdict: CONDITIONAL
