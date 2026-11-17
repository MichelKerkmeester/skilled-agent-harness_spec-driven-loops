# Iteration 006 - consumer cross-reference

## Dimension

Correctness, consumer cross-reference: when the guard withholds or delivers a command, do both consumers behave as the same decision, and do the generated tables agree with the tracked rows for the two commands probed?

## Dispatcher

```text
BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=8
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
```

Resolved route: mode=review target_agent=deep-review; execution=single_review_iteration; state_source=externalized_files.

Operator review focus: pass fourteen, area `mention`. The pass read only the two scope files and honored the holdout rule.

Recovery note: the iteration-5 stop decision was `STUCK_RECOVERY` (stuckCount 4). This pass follows the recovery strategy's traceability replay by tracing both consumers end to end.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:190-264`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:501-572`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:372-390`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:515-603`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R1-P1-002` remain active.

### P2 Findings

None new. `R1-P2-001` remains active.

## Traceability Checks

Not re-run; iteration 3's results stand.

## Integration Evidence

- `MODE_COMMANDS['sk-doc']['sk-create-readme']` is `/create:readme`; `MODE_COMMANDS['system-deep-loop']['review']` is `/deep:review`.
- `TRACKED_COMMANDS['/create:readme']` is `{ policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false }`; `TRACKED_COMMANDS['/deep:review']` is `{ policy: 'ask', ownerSkillId: 'system-deep-loop', scorerRow: false }`.
- Mention prompt through `attachCommand('sk-doc', SINGLE('sk-create-readme'), 'read the /create:readme document and tell me what it does')` returns `undefined`; the matching request prompt returns `/create:readme`. The guard decision reaches the offer unchanged.
- `typedCommandForTop('system-deep-loop', 'run /deep:review now')` returns `{ command: '/deep:review', policy: 'ask', ownerSkillId: 'system-deep-loop' }`; the refused variant returns `undefined`; a top skill that does not own the command returns `undefined`.
- `routeNeedsMode('system-deep-loop', {action:'defer'}, ['system-deep-loop'])` is `true`; the same call with `action:'route'` is `false`. The mode hint is limited to hubs that have mode commands and to defer/clarify routes.

## Edge Cases

- `commandRowFor('sk-create-readme')` returns `undefined`: the mode id is not a command-row key, and the two tables serve different lookups (mode id → command, skill id → row). The consumer reaches the command through `row.ownerSkillId`, which matches `sk-doc`. No mismatch for the probed commands.
- The `sameCommandRow` branch in `typedCommandForTop` stayed `false` for every top skill id in the repository's generated tables; the owner check is what delivers both probed commands. This is unchanged by pass fourteen and outside the two rules, so it is recorded as context, not a finding.
- An unknown deep-loop command (for example `/deep:reviw`) is still not a typed command and is withheld; the diff does not touch that boundary.

## Confirmed-Clean Surfaces

- Both consumers route the guard's boolean identically: mention → withhold, request → deliver.
- The generated tables carry both commands once and agree on policy and owner.
- `routeNeedsMode` still returns false for a route action and for a skill with no mode table.

## Ruled Out

- A consumer finding for the two P1 shapes: the consumer already withholds when the guard returns a mention; the defect is the guard's reading, already carried by the two P1s.
- A table-mismatch finding: the mode rows and tracked rows agree for both commands.

## Next Focus

- Dimension: correctness (fixture invariance)
- Focus area: the wrapper matrix, the retired-name loop and the new request rows, to see which invariants the pass-fourteen fixtures join and which they skip.
- Reason: the consumer path is clean; the remaining surface is the suite's own invariance guarantees, which are the only defense against a future widening.
- Rotation status: four dimensions plus replay and consumer traces covered.
- Blocked/productive carry-forward: the traceability gate stays closed; expect recovery again.
- Required evidence: `PLAIN_ROWS` membership, the wrapper loop at 184-189, and the new rows at 210-218.

## Verdict

No new finding; both P1s and the P2 remain active.

Review verdict: CONDITIONAL
