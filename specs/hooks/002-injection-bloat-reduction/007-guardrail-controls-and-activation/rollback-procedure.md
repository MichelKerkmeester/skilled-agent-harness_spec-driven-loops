# Per-block and Per-runtime Rollback Procedure

Rollback is scoped to one matrix cell and one injected block. It never disables unrelated runtime/candidate cells. The matrix's safe state after rollback is `emit`, meaning the runtime returns to full baseline emission.

## Cell rollback template

Record this tuple before taking action:

| Field | Value to record |
|---|---|
| Runtime | Native host/runtime name |
| Candidate | Candidate identifier from the matrix |
| Block | Canonical block identity and content hash |
| Session/lifecycle | Session identity and lifecycle epoch |
| Trigger | Observable regression, stale receipt, or ambiguity |
| Matrix state | Previous verdict and evidence artifact |

1. Disable the candidate flag for the named runtime and block. Do not change another runtime's flag or the shared default.
2. Clear delivery state for the named session/lifecycle epoch, message identity, block identity, and content hash. Remove suppression state only; preserve the failure receipt for diagnosis.
3. Confirm full baseline emission through the runtime's native serializer or host receipt on a first delivery and on the affected repeat/resume/compaction path.
4. Record the new delivery artifact and set the cell verdict to `emit`. A failed or ambiguous behavioral result cannot be converted into activation evidence.
5. Re-run the applicable negative controls before considering reactivation. Reactivation requires fresh passing behavioral and delivery evidence in the matrix schema.

This template instantiates for every runtime/candidate cell in `activation-matrix.json`. Inapplicable cells remain `N/A` and have no flag to roll back; applicable cells use their runtime, candidate, block, and receipt identities in the fields above.

## Worked hypothetical cell

Cell: `OpenCode / 003 / policy.governor.v1`

Assume this cell had previously passed both evidence types and was temporarily marked `activated`. A new OpenCode transform test then shows that two distinct user messages share an alias and the second governor block is suppressed. The end-to-end rollback is:

1. Disable the hypothetical `003` OpenCode dedup flag for `policy.governor.v1`.
2. Clear the delivery record keyed by the affected session, lifecycle epoch, message identity, block identity, and governor content hash. Keep the failed transform receipt as the behavioral failure artifact.
3. Re-run the two distinct messages with the flag disabled. Confirm the native OpenCode receipt contains the full baseline governor block for both messages, in the original transform order.
4. Change the cell verdict from `activated` to `emit`, retain the failed behavioral evidence, and require a new delivery receipt before any future activation decision.
5. Confirm the remaining 29 cells and all candidate defaults are unchanged. No runtime code or flag default is changed by this procedure.

The rollback is reversible: reactivation is possible only after the alias is fixed and both evidence records are fresh, passing, and attributable to this exact cell.
