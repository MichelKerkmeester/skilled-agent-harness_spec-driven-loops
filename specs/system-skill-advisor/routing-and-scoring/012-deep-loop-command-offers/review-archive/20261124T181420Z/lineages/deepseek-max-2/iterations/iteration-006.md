# Iteration 6 - Correctness: the served head end to end

## Dimension

Correctness, second pass: the row that carries a command from the handler to the rendered label (`handleAdvisorRecommend` -> `enrichCompiledRoutes` -> `attachTypedCommand` -> `commandLabel`), including the cache-hit path and the two degraded paths. The operator focus is carried as the question of whether the head any reader sees still matches the REQ claims after the eighth round.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:370-460`, `:530-640`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:180-275`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:190-250`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:290-315`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:355-400`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440-500`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The duplicate-command guard cannot withhold a command** -- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:412` -- `enrichCompiledRoutes` builds `alreadyOffered` from the input rows and never adds to it while mapping, so inside one pass it is only non-empty when the rows already carry commands (the cache-hit path). The branch that "withholds" a duplicate spreads `...recommendation` first, which keeps the row's existing `command`, `policy` and `typed` fields, so the guard's only effect is to skip attaching a fresh `policy` while the very command it decided not to offer stays on the row. The comment above the set promises the owning hub "must not offer the same one again"; on the path that runs, it cannot.
Finding class: dead-guard
Scope proof: the set is written in one loop and read in another, and no other statement adds to it; the false branch of the conditional keeps the row's prior fields by construction.
Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:383-390`, `:409-424`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227`, `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts`
Case: a cached output whose second row already carries `/deep:review` is enriched again; the second row's `attachCommand` returns the same command, `alreadyOffered.has` is true and `index !== 0`, so the false branch runs and the row still renders `/deep:review` from its own field.

```json
{"type":"claim-adjudication","claim":"The duplicate-command guard is unreachable in its stated form and its fallback branch preserves the command it was meant to withhold.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:387",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:412",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:423"],"counterevidenceSought":"Read the whole function, both branches of the conditional, and the cache-hit caller at :556 and :628 which re-enriches a stored output; checked whether either branch strips command/policy/typed, and neither does.","alternativeExplanation":"The guard may be intended only to avoid a second policy lookup, in which case the comment is wrong rather than the code; the head still prints one command per row either way, and a brief renders at most the head and one partner.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Withdraw if a caller relies on the false branch to strip a command, or if the duplicate case is shown unreachable by construction."}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Held; no REQ claims a dedupe between rows, which is why this is a P2 and not a requirement failure |
| `checklist_evidence` | pass | Held; no ticked task claims the guard |

- REQ-029's served-head claim holds on the path that matters: `attachTypedCommand` runs last and overwrites the row's command, policy, owner and `typed` marker, and the schema declares all four fields (`advisor-tool-schemas.ts:296-308`).
- REQ-028's degraded plain `(ask)` holds: `commandLabel` prints the offer text only when `typed !== true` (`render.ts:250`), and both degraded paths set `typed` for a typed row.
- REQ-038's supplied-command validation holds: `trackedCommandForOwner` is the only way a child string survives (`skill-advisor-cli.ts:1489`).
- Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:412]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250]`

## Integration Evidence

- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:358-395` re-derives the compact recommendation the hook prints, carrying `command`, `policy`, `needsMode` and `typed`; a field the handler dropped would be invisible in the hook, so the two surfaces were read together.
- `/deep:review` step 0 tells the session to act on a brief with policy `ask`; the brief's option text is produced only by `render.ts:251`, so the renderer is the single place the offer's wording can drift.

## Edge Cases

- The cache-hit path is the only one where `alreadyOffered` can be non-empty, and the test suite's cache cases do not assert a duplicate-command suppression; the finding therefore stays at P2 rather than claiming a live duplicate.
- A row that carries `needsMode: true` and a typed command renders the command, not the mode complaint, because `commandLabel` reads the command first (`render.ts:230-243`); no finding.
- The hook's fallback copies only fields it recognises, so an unknown policy on a child row is dropped rather than rendered; that is the safe direction.

## Confirmed-Clean Surfaces

- `attachTypedCommand` (`advisor-recommend.ts:428-450`) overwrites rather than merges, so a typed command cannot be shadowed by a routed one, and it runs after enrichment on both the cached and fresh paths (`:556`, `:628`).
- The output schema declares `command`, `policy` (`run|start|ask`), `ownerSkillId` and `typed: true`, so a parsed head cannot silently lose the fields the renderer reads (`advisor-tool-schemas.ts:296-308`).
- The hook's compact recommendation keeps `typed` only when it is literally `true` (`skill-advisor-cli-fallback.ts:395`), so a truthy string cannot hide the offer options.
- `commandLabel` resolves `mutating` from `COMMAND_ROWS` for a command it did not derive from the row (`render.ts:241-243`), so a typed row still prints a policy word.

## Ruled Out

- A typed command losing a policy on the served head: the typed row sets policy, owner and typed in one overwrite.
- A row losing `needsMode` when a command is absent: the false branch adds it only when the route defers and no command was produced.
- A brief printing the offer options for a typed command: the renderer checks `typed !== true` before it builds the option text.

## Next Focus

- Dimension: traceability
- Focus area: closeout - re-open every finding this lineage filed, confirm its evidence still stands, and record the terminal state the synthesis reads
- Reason: the run reaches its cap next iteration, so the last pass is the one that proves the record is internally honest
- Rotation status: all four dimensions covered twice where depth was needed
- Blocked/productive carry-forward: the reducer's exhausted list freezes four directions, none of which is a finding re-check
- Required evidence: one file:line per finding, re-read at the terminal iteration
- Recovery note: none

Review verdict: PASS
