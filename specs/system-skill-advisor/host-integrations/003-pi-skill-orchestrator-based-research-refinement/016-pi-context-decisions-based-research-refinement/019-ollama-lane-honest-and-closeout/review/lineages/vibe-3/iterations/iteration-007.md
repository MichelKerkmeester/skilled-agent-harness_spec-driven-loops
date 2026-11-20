# Review Iteration 007

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-003 (daemon and launcher liveness), dimension `maintainability`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reading the launcher and the coverage code for duplication, dead surface and naming that would make the next change unsafe.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 31ffd18beab`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:118-130`, `:1311-1432`, `:1750-1815`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:325-420`
- `.skilled/bin/system-skill-advisor-launcher.cjs:1554-1660`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/embedding-coverage.vitest.ts:113`, `:136`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The coverage reader re-implements the vector-table read the embedding loader already owns** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1325-1432` -- `embeddingCoverage` declares its own `tableExists` helper (`:1313-1321`) and its own pair of `SELECT ... FROM vec_<dim>` / `command_vec_<dim>` queries, while `loadSkillEmbeddings` (`:1750-1815`) declares a local `hasTable` closure and reads the same two tables with the same active-dimension resolution. Two readers of one schema now have to be changed together, and the coverage reader's `tableExists` and the loader's `hasTable` already differ in shape.
   Finding class: maintainability
   Scope proof: `.skilled/skills/system-skill-advisor/runtime/lib` is inside frontier node F-1-003's scope and inside the review target.
   Affected surface hints: the vector schema, the coverage gate, the status handler's coverage read.
   Case: a later migration renames the command vector table; the loader is updated and the coverage reader is not, so the gate reports every command missing and the semantic lane silently disables.

2. **`incompleteIds` is exported but has no production consumer and mixes two id spaces** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:124`, `:1376-1428` -- the `EmbeddingCoverage` interface exposes `incompleteIds`, and the function pushes skill ids (`:1393`, `:1402`) and command ids (`:1412`, `:1421`) into the same array. No production caller reads it; only `tests/skill-graph/embedding-coverage.vitest.ts:113` and `:136` do. A reader of the interface cannot tell which id space an entry belongs to.
   Finding class: maintainability
   Scope proof: same module and node scope as the finding above.
   Affected surface hints: the public `EmbeddingCoverage` shape, the coverage tests.
   Case: a caller filters `incompleteIds` for skill ids and gets command ids too, because nothing in the shape distinguishes them.

## Traceability Checks

- `spec_code` -- pass -- the coverage reader and the loader agree on the active-dimension resolution and the content-hash recipe today, so the duplication is a maintenance risk rather than a live defect.
- `checklist_evidence` -- pass -- the D1 rows remain satisfied; this iteration added no claim the checklist does not already cover.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1313-1321` and `:1757-1762` -- the two table-existence helpers, one per reader, are the concrete duplication.
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/embedding-coverage.vitest.ts:113` -- the only consumer of `incompleteIds`, which confirms the field has no production reader.

## Edge Cases

- The duplication is currently harmless because both readers resolve the active dimension from `vec_metadata` the same way. The finding is about the cost of the next schema change, not about today's behavior.
- `incompleteIds` may be intended as a future diagnostic surface. It is reported as a P2 because nothing in the shipped code reads it, not because the field is wrong.

## Confirmed-Clean Surfaces

- The launcher's heartbeat watchdog is a single small function with an exported constant and a test that exercises the reaper end to end.
- `sameDirectory` is local to `generation.ts` and does not duplicate an existing helper.
- The coverage gate's early returns each set a distinct `disabledReason`, so an operator can tell why the lane is off.

## Ruled Out

- "The coverage reader and the loader disagree on the content-hash recipe": ruled out -- both call `computeContentHash(skillDescriptionForEmbedding(...).trim())`.
- "The launcher's watchdog duplicates the daemon's parent watch": ruled out -- one watches the child from the launcher, the other watches the launcher from the daemon.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node F-1-006, maintainability pass over the routing vocabulary and the committed records
- Reason: F-1-003 is complete on all four dimensions; F-1-006 needs its last dimension before the frontier can drain
- Rotation status: F-1-003 has 4 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the duplication and dead-surface reads each produced a P2
- Required evidence: the router's vocabulary structure and the decision-record template's repeated blocks
- Recovery note: none

Review verdict: PASS
