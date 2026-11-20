# Iteration 011 - Frontier node F-1-006: maintainability

## Dispatcher

- Lineage: opus (fan-out), iteration 11 of 24, dimension maintainability, frontier node F-1-006 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry (F-1-002 answered, F-1-004 exhausted), strategy; steer.md absent

## Dimension

Maintainability of the docs, playbooks and catalogs, through the overengineering lens: duplicated scenario content between the research and review playbook twins, restated rules, new tool dependencies, and BSD versus GNU command portability in the 37 added playbooks.

## Files Reviewed

- Four research/review twin playbooks: `entry-points-and-modes/expansive-depth-flag-and-default-identity.md`, `fanout/fanout-frontier-partition-round-robin.md`, `initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md`, `iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` under both `deep-review/manual-testing-playbook` and `deep-research/manual-testing-playbook`
- All 37 added playbooks (pattern scan for GNU-only flags and `jq`)
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` (1167-line index)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

No protocol run this iteration (maintainability pass).

## Integration Evidence

- None beyond the files listed; no command, workflow or mirror surface was exercised.

## Edge Cases

- Attribution side effect from iteration 10: this lineage marked F-1-004 `active` at iteration 10 before the stop decision returned STUCK_RECOVERY (the workflow marks the node active only after `step_handle_convergence`, `deep-review.yaml:1714`). The reducer therefore credited iteration 10's maintainability pass to F-1-004 as well, so the registry shows F-1-004 with four covered dimensions and status `exhausted`. The status is what the workflow decides; the extra coverage credit is a lineage-ordering artifact, corrected from iteration 11 on (activation now waits for a CONTINUE decision).
- The doc-restatement cost on this node is already captured by OPUS-F006-P2-003 (nine stale copies) and OPUS-F004-P2-004 (flag cell and seed step); not re-raised.

## Confirmed-Clean Surfaces

- Twin playbooks share 32 to 38 of about 100 lines each, almost all template headings and boilerplate; their scenarios, commands and pass criteria are loop-specific. Not a collapse candidate.
- No added playbook uses a GNU-only form (`sed -i` without suffix, `readlink -f`, `date -d`, `stat -c`, `grep -P`, `xargs -r`); the scan returned nothing.
- `jq` in seven new playbooks follows an existing convention: four playbooks at the range base already used it.

## Ruled Out

- Research/review playbook duplication as overengineering: the shared lines are the template.
- BSD versus GNU portability defects in new playbook commands: none found.
- New tool dependency: `jq` predates the range in this playbook set.

## Operator Focus Coverage

- Overengineering: nothing to delete on this node beyond the restated universe rule already filed; each playbook tests a distinct behavior.
- Operator UX: playbooks carry an "Observed cost" line with token and minute ranges, which helps an operator budget a live scenario.
- Cross-CLI and OS parity: commands are portable across macOS and Linux userlands.

## Next Focus

- Dimension: correctness
- Focus area: depth-2 node F-2-007 (commit-range relevance and touched-file producer), the last open node
- Reason: registry.frontier rotation; F-1-006 covers its fourth dimension this iteration
- Rotation status: F-1-002 answered, F-1-004 exhausted, F-1-006 completing
- Required evidence: file:line

Review verdict: CONDITIONAL
