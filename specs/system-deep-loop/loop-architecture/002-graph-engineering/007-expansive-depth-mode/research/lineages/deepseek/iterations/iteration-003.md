# Iteration 3: F-1-006 bookkeeping that fires on a healthy run

## Focus

Frontier node F-1-006 (depth 1, scope runtime/scripts/synthesis-closeout.cjs, .skilled/commands/deep/assets/deep-research.yaml step_stage_artifact_dir, this run's orchestration-status.log and state logs): Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm on a finding refined into an earlier id, the research commit step failing on an ignored pathspec exclude, the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.

The node was read as: confirm or refute each named suspect at HEAD and add the warnings this run itself produced, so "false alarm" means a reproduced mechanism rather than a remembered one.

## Actions Taken

1. Read the refinement branch in `runtime/scripts/reduce-state.cjs` and the invariant checks in `runtime/scripts/synthesis-closeout.cjs`.
2. Read `step_stage_artifact_dir` in `.skilled/commands/deep/assets/deep-research.yaml` and checked the excluded path against `.gitignore`.
3. Read `runScope` in `synthesis-closeout.cjs` and compared the `lineageId` it uses with the iteration records' identity.
4. Read the ledger compatibility warning and the schema field it refers to.
5. Re-read `iteration-graph-upsert.cjs` and `upsert.cjs`'s research-evidence derivation, then compared them with this run's iteration-1 and iteration-2 upsert outputs.
6. Read this run's `orchestration-status.log` (both lineages heartbeating, no failure rows).

## Findings

1. **The `structured_state_findings_partially_reflected_in_registry` alarm fires on a legitimate refinement.** The reducer folds a row that names `refines: <earlier id>` into that earlier entry and records a `Refinement of an earlier finding` transition, so the registry deliberately holds fewer entries than the iteration rows. `synthesis-closeout.cjs` then counts distinct iteration ids against distinct registry ids and raises the alarm when the registry count is lower. Any run that refines a finding therefore reports "synthesis incomplete" while the registry is correct. Storing the folded ids on the target (`refinedFrom`) and counting them in `registryEvidence` would make the two counts agree without weakening the invariant. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1004] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1022] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:373]

2. **The research commit step fails on every healthy run because it excludes a path git already ignores.** `step_stage_artifact_dir` passes `:(exclude){packet}/.legacy-projection-watermarks`, and `.gitignore` already carries `.legacy-projection-watermarks/`. Git refuses an exclude pathspec that names an ignored path, so the step exits non-zero and falls through to its warning `on_fail`; the dogfood log recorded exactly this. The exclude is redundant: removing it leaves gitignore doing the same job and the step succeeds. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2158] [SOURCE: .gitignore:449]

3. **The closeout scopes a research synthesis row to `parentSessionId`, while the run's own iteration rows are scoped to `sessionId`.** `runScope` sets `lineageId = lineage.parentSessionId` (falling back to `runId`) for research and puts it in the event stem's scope. For this lineage, `parentSessionId` is the fan-out root's session (`2026-11-20T12:56:45.419Z`) and `sessionId` is `fanout-deepseek-1795179440509-6d2wms`, which every iteration record uses as `lineageId` per the gateway contract. The terminal row is therefore filed on a different lineage id from the records it summarizes. One config-owned `lineageId` (written by init and read by both the leaf record and the closeout) removes the inference. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:280] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:294]

4. **Every iteration record produces a "Trusted evidence yield was absent" warning because the leaf contract does not carry the field the ledger schema requires.** `legacy-compatibility.ts` converts a contract-shaped iteration record into the ledger shape, sets `trustedEvidenceYield: 0`, and pushes the warning; the field is required as a ratio in the schema, yet the prompt pack's record example does not list it. This run's gateway receipts carried the warning on both iterations. Either the prompt pack adds a runner-computable yield (for example distinct cited sources per finding, capped at 1) or the compatibility layer derives it silently from `findingsCount` and cited sources. A warning that fires on every correct record trains the operator to ignore warnings. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:698] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:714] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:325]

5. **An iteration with findings but no answered question writes zero graph evidence, so the evidence guards pass by having nothing to inspect.** `readResearchIterationEvidence` reads the delta's finding rows, but `deriveResearchFindingEvidence` runs only when `evidence.answeredQuestions.length > 0`. Iteration 1 of this run had seven cited findings and produced `insertedNodes: 0`; the stop decision then reported `nodeCount: 0` and marked `sourceDiversity` and `singleWeakSource` as `notEvaluated`, which counts as a pass. Iteration 2 answered a question and the same command inserted 9 nodes and 21 edges, so the switch is the answered-question guard, not a malformed delta. Attaching findings to the active frontier node when no question is answered, or reporting the guards as `insufficient` rather than `passed`, would stop the false green. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:357] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:481] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1200]

6. **This run's live ledger shows the healthy path, so the remaining warnings are bookkeeping rather than orchestration faults.** `orchestration-status.log` holds only `started`, `spawned` and one `progress` heartbeat per lineage per minute, with `failed: 0` throughout; the lineage's state log holds two iteration rows, both `complete`. The two gate receipts and the reducer run exited 0. That rules out a runner-side warning as the cause of any alarm above. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/orchestration-status.log:20]

## Questions Answered

- Does the synthesis_incomplete alarm fire on a refinement without a fault? Yes; mechanism confirmed in Findings 1.
- Does the commit step fail on a healthy run? Yes; the excluded path is ignored by `.gitignore`, confirmed in Finding 2.
- Is the closeout lineageId taken from the parent session? Yes; confirmed in Finding 3, and it differs from the iteration records' identity.
- Any other invariant or warning firing without a real fault? Yes; Findings 4 and 5, both observed in this run.

## Questions Remaining

- Whether the ledger schema can derive `trustedEvidenceYield` without a leaf-supplied number, or whether the prompt pack must require it.
- Whether attaching findings to the active node is semantically honest when the iteration did not answer that node.

## Recommended Next Focus

Frontier node F-2-007: whether the cli-adapter stress suite is wired into a default gate and which matrix cells remain pending. It is a depth-2 child of F-1-002 and the remaining open node after this one.

## Ruled Out

- **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss.
- **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning.
- **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half.

## Dead Ends

- Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it.
- Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one.

## Edge Cases

- Ambiguous input: none. Each suspect named a file and a line.
- Contradictory evidence: the dogfood log calls the alarm a "false alarm" and also says a refined finding keeps the wrong id. Both are true and distinct: the count alarm is false, the retained id is a separate provenance cost. Recorded, not collapsed.
- Missing dependencies: the root `orchestration-status.log` is root-owned; it was read, not written.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1004`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1022`
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:280`
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:294`
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:373`
- `.skilled/commands/deep/assets/deep-research.yaml:2158`
- `.gitignore:449`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:698`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:714`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:325`
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:357`
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:481`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1200`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/orchestration-status.log:20`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-state.jsonl:2`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-state.jsonl:3`

## Assessment

- New information ratio: 0.75
- Questions addressed: all four named suspects plus the live-warning sweep.
- Questions answered: all four.
- Finding mix: 3 fully new mechanisms (the yield warning, the graph-evidence guard, and the live green ledger) and 3 partially new confirmations of named suspects with file:line evidence.

## Reflection

- What worked and why: comparing iteration 1's `insertedNodes: 0` with iteration 2's `insertedNodes: 9` isolated the answered-question guard without a second experiment; the delta was otherwise identical in shape.
- What did not work and why: an initial grep for refinement logic in `synthesis-closeout.cjs` returned nothing, which looked like a missing file at first; the absence is the finding, but I spent a call confirming the file was read.
- What I would do differently: read `runScope` before the dogfood log, so the parent-session scope would have been a code-first finding rather than a confirmation.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
