# Review Iteration 3

- Mode: review
- Lineage: `accuracy-runner-confirm-4b`
- Run: `fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed`
- Iteration: 3 of 3
- Dimension: RECOVERY (least-covered traceability and maintainability)
- Budget profile: adjudicate (8-10 read actions)
- Sources read: `review-brief-4b.txt`, `steer.md` (absent), `review/verify-4/report.md`, phase 027 `tasks.md`, the iteration-2 narrative

## Dispatcher

`/deep:review` fan-out lineage `accuracy-runner-confirm-4b`. The recovery pass changes
granularity from code to line-level doc claims. It checks the two shared docs this area changed
(`routing-accuracy/README.md` and `doctor-agents-md-presentation.txt`) against the code and the
task rows that claim them.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-80,120-126,183-188`
- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:255-272`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1170-1209`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/tasks.md:84-110,218-244`

Context reads: `.skilled/commands/doctor/scripts/agents-md-check.cjs:757-808` and
`.skilled/commands/doctor/scripts/agents-md-embed.cjs:373-410,782-803` for the A11 claim;
`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:488-501`
for the backfill field set.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The README still says the backfill adds three fields and lists three in the runner row** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:76` -- The backfill now writes `offeredAs` as a fourth attribution field (`command-offer.mjs:496`, `run-command-behaviour.mjs:824`), and the output sentence at `:188` names it, but the paragraph at `:76` still says "adds those three fields" and the `run-command-behaviour.mjs` row at `:125` still says `--backfill` rewrites with `offeredCommand`, `offeredPolicy` and `briefDelivered`. A reader following the section learns a three-field contract that the code no longer has. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:76]
   Finding class: doc_code_drift
   Scope proof: the README is in the declared accuracy-runner scope; the two code lines are the changed writers, and phase 027 T012 claims the README field lists.
   Affected surface hints: README backfill section, runner table row, the `offeredAs` attribution contract.
   Case: run `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs --backfill in.jsonl --out out.jsonl`; every output line carries `offeredAs` (pinned by `command-offer.vitest.ts:385-388`), while `README.md:76` says three fields and `:125` names only three.

2. **The README says every run line carries four attribution fields, but a head-moved line carries none** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:65` -- `runTurn` appends the head-moved line before the offer replay at `run-command-behaviour.mjs:1180-1184`, so that line has no `offeredCommand`, `offeredPolicy`, `offeredAs` or `briefDelivered`. The blanket sentence is false for the exit-3 path the README itself documents. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:65]
   Finding class: doc_code_drift
   Scope proof: the README and `run-command-behaviour.mjs` are both in the declared scope; the early append is the same writer's own branch.
   Affected surface hints: head-moved run line, exit 3, attribution contract, scorer's `offerFieldAbsent`.
   Case: a turn that commits or stashes during the run sets `headMoved`; `run-command-behaviour.mjs:1183` appends `{ ...line, restored: false, headMoved: true }` and returns exit 3. The written JSON has none of the four fields, while `README.md:65` says each appended line carries them. A scorer reading that line sees `offerFieldAbsent` even though the run line is valid.

The A11 malformed-router row added at
`doctor-agents-md-presentation.txt:268` agrees with the code: the doctor check reports
`malformed <kind> row at line N: C cells where the header has H`
(`agents-md-check.cjs:776-778`), and the embed only splices missing rows into the table
(`agents-md-embed.cjs:373-410`), so the advice to fix the row by hand matches what embed will
and will not do. No finding.

## Traceability Checks

- `spec_code` -- partial. Phase 027 T006, T007, T010, T012, T013 and T017 are marked `[x]` with
  evidence, and the code matches T006/T007/T010. T012's "both field lists" is narrower than the
  README's actual field lists: the backfill paragraph and the runner table row still say three
  fields.
- `checklist_evidence` -- partial. `CHK-040` (tasks.md:244) asks `RA` to name `offeredAs` in both
  field lists; the two lists T012 edited are correct, but the backfill lists are the remaining
  drift. `CHK-FIX-003` and `CHK-FIX-004` remain open with the phase.
- `feature_catalog_code` -- notApplicable. No feature-catalog page describes the two changed
  writers; the routing-accuracy README is the shared doc.
- `agent_cross_runtime` -- notApplicable. No runtime branch in the changed docs or writers.
- `skill_agent` -- notApplicable. No agent definition changed.
- `playbook_capability` -- notApplicable. No playbook surface changed.

## Integration Evidence

- The routing-accuracy README is the only shared doc that describes `command-offer.mjs` and
  `run-command-behaviour.mjs`; phase 027 T012 and T013 edit it as the doc of record.
- The doctor presentation asset is the `/doctor:agents-md` troubleshooting text. Its new row
  points at the same two scripts the doctor check and embed run:
  `agents-md-check.cjs:757-808` and `agents-md-embed.cjs:782-803`.
- The head-moved branch is the same `runTurn` function that now spreads `offerLineFields`; the
  early return at `:1180-1184` is the one path that never reaches the offer replay.

## Edge Cases

- A malformed shipped router row makes the checker report it as malformed and as missing. The
  embed then adds a second, well-formed copy of that shipped row, and the malformed row stays.
  The added A11 advice does not warn about the duplicate; the row still says embed never rewrites
  a row, which is true, and the operator is told to fix the row by hand. Recorded as an operator
  note, not a finding, because the added text does not claim the duplicate cannot happen.
- The backfill's `--brief-only` path leaves a legacy line without `offeredAs`, which the README's
  `--brief-only` paragraph already covers. The stale "three fields" paragraph is about the
  default path, so the two statements do not conflict.
- A head-moved line is written before `restoreTurn`, so `leftoverPaths` is absent too. The
  README's head-moved paragraph names only `restored` and the changed paths; this is consistent
  with the line and part of the same all-or-nothing early return.

## Confirmed-Clean Surfaces

- The A11 malformed-row guidance matches the checker's message and the embed's insert-only
  behavior.
- The top attribution list (`README.md:65-70`) now names four fields, including `offeredAs`.
- The output sentence (`README.md:188`) names `offeredAs` alongside the other backfill fields.
- Phase 027 task rows T006, T007, T010, T012, T013 and T017 are marked `[x]` with evidence that
  matches the changed lines this lineage read.

## Ruled Out

- **The A11 row contradicts the doctor check.** Ruled out: the checker's malformed message names
  the cell count and the header width, and the embed only adds missing rows.
- **The top attribution list still says three fields.** Ruled out: `README.md:65` says four and
  the item at `:69` defines `offeredAs`.
- **The output-log sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.
- **The backfill paragraph's "three fields" is correct for `--brief-only`.** Ruled out: the
  paragraph introduces the default backfill, and the separate `--brief-only` paragraph is the
  one that describes copying offer fields untouched.

## Next Focus

- Dimension: none remaining within the cap; synthesis
- Focus area: compile the lineage report from the registry, the three deltas and the
  documentation findings.
- Reason: three iterations are complete, two clean code dimensions and two P2 doc drifts; the
  cap is reached without a legal convergence stop.
- Rotation status: correctness and security complete; traceability and maintainability covered by
  the recovery pass (partial, because the packet's checklist is still open).
- Required evidence: the registry's active counts, the three iteration final lines and the
  synthesis report.
- Blocked/productive carry-forward: no blocked approach.
- Recovery note: the recovery pass changed granularity to line-level doc claims and produced the
  two findings.

## Verdict

No active P0 or P1 finding. Two P2 documentation drifts remain active; the verdict is PASS with
advisories.

Review verdict: PASS
