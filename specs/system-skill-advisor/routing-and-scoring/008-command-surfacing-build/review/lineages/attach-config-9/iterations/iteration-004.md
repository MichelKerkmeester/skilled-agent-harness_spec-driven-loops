# Review Iteration 004

## Focus

- Dimension: all four (confirmation pass)
- Files: every scope file, re-read against the single active finding.

## Dispatcher

- Lineage: `attach-config-9` (fan-out child, session `fanout-attach-config-9-1794835877856-5ghgm4`)
- Area: `attach-config` per `review/review-scope-9.txt`
- Dimension: correctness, security, traceability and maintainability, as a confirmation pass selected by the strategy's next focus
- Operator review focus: `review/review-brief-9.txt` requires all four dimensions, every scope file under at least two of them, the graph and stop steps each iteration, and no re-report of the recorded limits. This iteration closes that contract: it re-reads each scope file against the one active P2, checks that the registry, the state log and the deltas describe the same run, and asks whether anything in the four files still supports a finding. Holdout rule honoured: no prompt store opened, no `--summary`, no CLI session text, no hook-flags file.
- Steer channel: `steer.md` still does not exist in this lineage folder.
- Sources read: `review/review-brief-9.txt`; `review/review-scope-9.txt`; the four area files at `05f776202e0` (matcher 197-244 and gate 465-536, boundary suite 414-470, config 1-35, brief tests 56-100); `deep-review-findings-registry.json`; `deep-review-state.jsonl`; `deltas/iter-001..003.jsonl`; `deep-review-strategy.md`; `goal.md:206,365-370,377`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (197-244, 465-536) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455]
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (1-35) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (56-100) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The one active P2 from iteration 3 was re-examined and confirmed:
`AC9-P2-001` -- the suffix chain's leading anchor is untested -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455`.

Compact skeptic and referee pass, because this finding decides the advisory set the terminal stop carries:

- Skeptic: the `^` is visible in the source, so the property may look self-evident and the test unnecessary. Counter: the branch's whole subject is what a suffix chain may consume, and the added chain is exactly what makes an unanchored search plausible. The suite already pins the sibling decision (a modifier on a command whose hint omits it), so leaving the anchor unpinned is an asymmetry, not restraint.
- Referee: confirmed at P2. Re-read the pattern and the negative test at `05f776202e0`: the four existing negatives all fail on the trailing lookahead, and `/speckit:complete:draft:auto` is refused only by the leading anchor. No downgrade to advisory-only beyond P2 and no upgrade: the shipped behavior is correct. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:459]

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Accepted vocabulary equals the documented union across 46 command files; the diff implements the two packet rows that name it (D-01 at `goal.md:206`, CRIT-4 at `goal.md:365`); no spec requirement narrows the set per command. [SOURCE: .skilled/commands/speckit/complete.md:3] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365] |
| `checklist_evidence` | notApplicable | No `checklist.md` in the phase-parent packet. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |
| `skill_agent` | notApplicable | No skill or agent definition is in the area's scope. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-9.txt:5] |
| `agent_cross_runtime` | notApplicable | The runtime mirror is build output of the same source, not a second definition. [SOURCE: .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:186] |
| `feature_catalog_code` | notApplicable | No catalog entry is in scope. |
| `playbook_capability` | notApplicable | No playbook entry is in scope. |

State integrity, re-checked from the files rather than from memory:

- The registry holds one open finding, `AC9-P2-001`, severity P2, status active, file `command-attach-guards.vitest.ts` line 455, dimension maintainability, with all four dimensions marked covered. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/deep-review-findings-registry.json:1]
- The state log holds one config row and three iteration records with ratios 0, 0 and 1.0, matching the three iteration files and the three deltas. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/deep-review-state.jsonl:1]
- `deltas/iter-003.jsonl` carries the iteration record followed by the finding row for `AC9-P2-001`, so the narrative, the state record and the delta agree on the count and the severity. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/deltas/iter-003.jsonl:2]
- `git status --porcelain` over the four scope files returns nothing, so no file under review was modified by this lineage.

## Integration Evidence

- The registry's `findingClass` and `affectedSurfaceHints` are empty because the delta finding row carries only the contract's minimum fields; the values are present in the iteration record's `findingDetails` and in the iteration narrative, so synthesis can build the Planning Packet from those two sources without inferring anything. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/deltas/iter-003.jsonl:2]
- The reducer derives a finding's dimension from the iteration's Focus/Dispatcher text; the iteration-3 Focus section was corrected to name only maintainability, and the registry now agrees with the narrative. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/iterations/iteration-003.md:3]
- The transcript scorer still mirrors the matcher's set, so the cross-surface divergence the previous pass raised stays closed. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613]
- The child/parent brief pins still match the ADR, and the renderer's only environment read is the one the config clears. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

## Edge Cases

- The `:suffix + extension` read remains a recorded, accepted trade-off and stays unpinned. This pass does not raise it, per the brief's instruction not to re-report a recorded limit; the observation is carried so a later pass that reopens the limit does not have to rediscover it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]
- The convergence decision cannot be appended as its own event row: the gateway accepts review `type:"event"` rows only for the five audit events, and the workflow prints its own stop row instead of appending it. The decision therefore travels in this record's `priorStopDecision` and in the synthesis closeout. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:955]
- The coverage graph is the shared deep-loop database rather than a lineage-local file; the brief names `upsert.cjs` as the persistence step, so the write is the brief's instruction and is the only write outside this folder.

## Confirmed-Clean Surfaces

- No new defect was found in the matcher, the config or the tests this pass; the single active P2 is the only item the terminal stop carries. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Every documented suffix is accepted and every undocumented one refused, including chains and the `:unattended` segment. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:435]
- The suite's temp isolation and child-flag clearing hold for every consumer this area owns. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- Both brief shapes are asserted, and the parent shape no longer depends on the ambient environment. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]
- Every scope file carries at least three dimensions and the whole area carries all four. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-9/deep-review-strategy.md:1]

## Ruled Out

- A false positive on `AC9-P2-001`: re-read the pattern and the four existing negatives; only a chain behind an unknown leading segment separates anchored from unanchored, so the finding stands.
- A further correctness defect in the chain: the full probe matrix from iteration 1 still matches the documented contract.
- A further security defect in the config: the iteration-2 sweep over every `AI_SESSION_CHILD` reference still shows each child-shape test injecting the flag.
- A state-integrity defect after the dimension correction: registry, state log, deltas and narrative now agree on one P2 in maintainability.

## Next Focus

- Dimension: none remaining; all four configured dimensions are complete.
- Focus area: synthesis -- compile `review-report.md` from the registry and the iteration files, derive the verdict from the registry, and close the run.
- Reason: the convergence signals and the coverage-age signal are both satisfied at this record; the remaining work is synthesis, not another review pass.
- Rotation status: correctness, security, traceability and maintainability complete; one active P2 advisory.
- Blocked/productive carry-forward: nothing blocked; the direct-read, sweep and variant-comparison approaches were productive from the first pass.
- Required evidence: none further; the single P2 carries file:line, a concrete input and a reproduction.
- Recovery note: not in recovery.

Review verdict: PASS
