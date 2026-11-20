# Review Iteration 008

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-006 (follow-up fixes and answer routing), dimension `maintainability`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reading the two test follow-ups in `0390556ee2b` and the routing follow-up in `571575632a4` for hand-copied constants and unguarded duplication.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 0390556ee2b`, `git show 571575632a4`, `git show 2f5fe41bb9e`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/hooks/session-handover/pi/session-handover.test.ts:43-52`, `:368`
- `.skilled/hooks/session-handover/lib/nudge.cjs:38-48`, `:246`, `:961-993`
- `.skilled/skills/sk-doc/hub-router.json:245-260`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:28`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` (existence and CI wiring)
- `.github/workflows/routing-registry-drift.yml:243`
- `specs/agents/006-agent-contract-and-registry-alignment/decision-record.md:1-30`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hand-over test hand-copies the writer path from a constant the module keeps private** -- `.skilled/hooks/session-handover/pi/session-handover.test.ts:48` -- the test rebuilds the continuity writer command with `fileURLToPath(new URL('../../../skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js', import.meta.url))`, while the source builds the same string from `path.join(__dirname, '..', '..', '..', 'skills', ...)` at `.skilled/hooks/session-handover/lib/nudge.cjs:43`. `CONTINUITY_WRITER_COMMAND` is not in the module's export list (`nudge.cjs:961-993`), so the test cannot import it and must restate the recipe. The two derivations agree today only because the test file and `lib/` sit at the same depth under `session-handover/`.
   Finding class: maintainability
   Scope proof: `.skilled/hooks/session-handover/pi/session-handover.test.ts` is in the review target and inside frontier node F-1-006's scope.
   Affected surface hints: the hand-over nudge text, the save step the nudge prints, the test that pins it.
   Case: the writer moves to a different folder under `skills/`; `nudge.cjs` is updated and the test is not, so the assertion at `:368` fails with a path mismatch that names neither the constant nor the move.

## Traceability Checks

- `spec_code` -- pass -- the test's expected string and the nudge's emitted string are byte-identical at HEAD, so the assertion is live rather than vacuous.
- `checklist_evidence` -- pass -- the D3 rows remain satisfied; this iteration added no claim the checklist does not already cover.

## Integration Evidence

- `.skilled/hooks/session-handover/lib/nudge.cjs:43` and `.skilled/hooks/session-handover/pi/session-handover.test.ts:48` -- the two derivations of one path, one private and one restated.
- `.skilled/hooks/session-handover/pi/session-handover.test.ts:368` -- the assertion that consumes the restated constant.
- `.github/workflows/routing-registry-drift.yml:243` runs `ci-hub-vocabulary-source.cjs` through the `.opencode/skills` symlink, which resolves to `.skilled/skills`, so the router vocabulary guard the `571575632a4` message credits does run.

## Edge Cases

- The restated path is correct at HEAD. The finding is about the cost of the next move, not about today's assertion.
- The router vocabulary is duplicated between `hub-router.json` and each mode's `SKILL.md` trigger line, but `ci-hub-vocabulary-source.cjs` guards that pair and the `571575632a4` message records the guard catching the drift. Recorded as guarded duplication rather than a finding.

## Confirmed-Clean Surfaces

- `571575632a4` removed the bare phrase from both the router intent list and the mode's trigger line, and `security.md` still routes, so the removal is symmetric.
- The compiled `sk-doc` manifest was re-minted in the same commit, so the served policy hash matches the edited vocabulary.
- The ten `docs(specs)` commits each write one packet's decision record and refresh that packet's description and graph metadata, with no continuity move.

## Ruled Out

- "The CI vocabulary guard points at a path that does not exist": ruled out -- `.opencode/skills` is a symlink to `../.skilled/skills` and the script resolves through it.
- "The decision records claim `completion_pct: 0` on completed packets": ruled out as a defect of these commits -- 7 of the 9 decision records in `specs/` carry the same value, so it is the writer's template default rather than something these ten commits introduced.
- "The decision record title drifts from the packet's spec title": ruled out -- the record title is `Decision Record: <spec title body>` by convention, and the sampled pair matches.

## Next Focus

- Dimension: none remaining
- Focus area: both frontier nodes have all four dimensions covered; the next phase is synthesis
- Reason: F-1-003 and F-1-006 each hold correctness, security, traceability and maintainability evidence
- Rotation status: F-1-003 4 of 4, F-1-006 4 of 4
- Blocked/productive carry-forward: productive -- the last dimension produced one P2
- Required evidence: none; synthesis reads the registry and the eight iteration files
- Recovery note: none

Review verdict: PASS
