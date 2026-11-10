# Iteration 6: The reducer change that lowered open findings in 146 review folders

## Focus

Q8: what the reducer change was, why it lowered open findings counts across 146 review folders, and whether the drop removed duplicates or real findings. Read the round-four parser child's records and probes, the three reducer implementations compared (before, first build, final), and the shipped parser and reducer code.

## Actions Taken

1. Read the round-four findings-parser child's spec, plan, goal log and implementation summary, and its scratch probe outputs (`reducer-yield-before.txt`, `reducer-yield-after.txt`, `reducer-yield-after-review.txt`).
2. Read the shipped `iteration-findings.cjs` parser and the `reduce-state.cjs` yield rule at its final form.
3. Read the probe sources to see exactly what was compared and with which options (`write:false, lenient:true`).
4. Read the runtime changelog entry v1.9.4.0 that ships with the change.

## Findings

1. **The measured effect is exactly 146 of 499 folders changed, none raised, 310 unchanged and 43 erroring — recorded three times, including after the review fix.** Each probe run walks every folder under `specs` holding a `deep-review-state.jsonl`, reduces it twice with `write:false` and compares open/resolved counts. The final line in all three files is `mode=after dirs=499 same=310 changed=146 raised=0 liveErrors=43` (the before-mode file reads `mode=before` with identical totals). `raised=0` is the load-bearing number: no folder's open count increased, so every change is a reduction or a deduplication. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:147] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-before.txt:147] — **CONFIRMED** (read the recorded probe outputs). **P1 by external-user impact**: an adopter's historical review dashboards change counts after upgrading the runtime; the changelog is the only notice. **Smallest fix**: none — the changelog v1.9.4.0 documents the behavior and says "No migration required"; the synthesis should keep the change and cite the measurement.

2. **The mechanism is double counting, and the change is a deduplication rule in the review reducer.** A review iteration can narrate its findings as `- **F001**:` bullets *and* record the same findings as delta rows or `findingDetails`. Before the change, the reducer's structured-row rule yielded only numbered narrative findings to the structured rows (`numberedNarrativeFindings.has(finding) && structuredRuns.has(iteration.run)`), so an F### bullet that restated a structured row was counted a second time. The final rule at `reduce-state.cjs:1002-1004` yields a narrative finding to the structured rows of its iteration when it is a numbered finding, or, for an `F<digits>` finding, only to a structured row of the same iteration that carries the same id. The parser side (`iteration-findings.cjs`) stops counting indented numbered lines as findings and reads a findings section in one shape only, so a restated section counts each finding once. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs:1] [SOURCE: .skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md] — **CONFIRMED** (read the final rule and the parser; the probe compared exactly this line). **P1**. **Smallest fix**: this is the fix; no further change.

3. **The review caught the first version over-dropping, and the final rule preserves narrative-only findings.** The first build applied the run-level yield to F### bullets too, so an iteration that narrated a finding without a matching delta row lost it: luna-max measured `open 12 -> 5` in the pre-review probes, and the round-four log records "15 narrative-only findings in 3 folders lost every copy". The amended rule (T035/T036) requires the same id for F### findings, and the final probe records luna-max `open 12 -> 8` — the four remaining reductions are double counts, and F005/F006 survive. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after.txt:2] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md:92] — **CONFIRMED** (read all three probe outputs and the log; the before/after difference is visible per folder). **P1**: the review step is what kept a correctness fix from silently deleting findings. **Smallest fix**: none — the process already worked; the finding names why the same-id clause is load-bearing.

4. **A residual sits unexamined in the same measurement: 43 of 499 review folders error during reduction even in lenient mode.** The probe counts them in `liveErrors=43` and drops them from the comparison; no record names a single one or its error class. Since the reducer runs leniently for the repo-wide walk, an error there is either a malformed state file or a reducer path that cannot read a folder shape. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/probe/handoff-review-yield.cjs] — **CONFIRMED** (the probe's own counter; no further detail recorded). **P2**: an adopter rebuilding registries hits an unexplained failure on roughly one in twelve review folders. **Smallest fix**: change one line in the probe to print the first failing folder and error message alongside the count, so the next run identifies the class instead of the number.

## Ruled Out

- **Re-running the repo-wide probe in this lineage to reproduce 146/0/43.** The probe requires the saved pre-change reducer copy under `scratch/before/`, which is no longer present (the files left the packet before commit), so the run would exit `mode=unknown`; the three recorded outputs already carry the full per-folder comparison.
- **A migration step that rewrites existing review registries.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: registries are derived state, the reducer recomputes them on the next run, and the changelog tells the operator no migration is required. A rewrite pass would touch hundreds of files with no failing caller.

## Dead Ends

- The 43 erroring folders cannot be enumerated from the records; their identity is not stored anywhere the packet kept.

## Edge Cases

- Ambiguous input: "lowered open findings" could mean findings were lost; the recorded `raised=0` plus the per-folder pairs and the review correction show the net effect is deduplication, with the over-drop caught and fixed before shipping.
- Contradictory evidence: none; the pre-review and post-review probe outputs differ exactly where the reviewer said they would.
- Missing dependencies: the saved pre-change reducer is gone from the packet, so an independent re-run is not possible; recorded instead of attempted.
- Partial success: the mechanism and numbers are confirmed; the 43-error residual is recorded as unexplained. `Status: complete`.

## Questions Answered

- Q8: What did the reducer change that lowered open findings in 146 review folders, and what is the mechanism? — answered.

## Questions Remaining

- Q9, Q10.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-before.txt:147
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after.txt:2,147
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2,147
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/probe/handoff-review-yield.cjs
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md:92
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs:1
- .skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md

## Assessment

- New information ratio: 0.90
- Questions addressed: Q8
- Questions answered: Q8

## Reflection

- What worked and why: the child's scratch probes are a before/after experiment preserved in the packet; reading the three outputs in order showed both the mechanism and the review correction without running anything.
- What did not work and why: the 43 errors are anonymous by design of the probe; the packet never captured a named case.
- What I would do differently: for measurement claims, find the probe source before the totals — the options (`write:false, lenient:true`) are what make the result reproducible.

## Recommended Next Focus

Iteration 7: the external-user lens, first half — setup and install steps, the generated artifacts an adopter must regenerate and how they learn it, and recovery from a half-applied state. Mine the install guides, the doctor command, and the generated-artifact checks for what a fresh cloner actually experiences.
