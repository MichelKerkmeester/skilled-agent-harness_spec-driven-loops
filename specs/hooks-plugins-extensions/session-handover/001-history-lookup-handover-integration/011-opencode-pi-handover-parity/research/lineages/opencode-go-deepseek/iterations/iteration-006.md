# Iteration 6: Evidence Classes And The Source Ledger

## Focus

The convergence quality guard blocked the stop on `sourceDiversity` for four of the five questions. This iteration records which evidence class each finding rests on, rather than assuming that five iterations of one class are five independent sources. No new external source was read; the work is a coverage audit of what iterations 1 to 5 already cited.

## Actions Taken

- Re-read the guard's definition: source diversity counts distinct `quality_class` values across the sources cited by the findings that answer each question.
- Classified every consulted source into one of three evidence classes.
- Recorded one SOURCE node per consulted artifact and one CITES edge per finding-to-source relation.

## Findings

1. **The five questions were answered from two very different evidence classes, and the guard was right to block.** Four questions (prepare text, readers, carry, known limits) rest primarily on production source code, which is one class. Only the claim-offer question rests on the runtime's own recorded state: the Pi note, the Pi pane, the receiver's session store and the scorecard. A stop justified by code reading alone is a single-lens claim, and the blocked stop named exactly that. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653]

2. **The evidence base is stronger than the earlier iterations' prose suggested, once the classes are recorded.** Three independent primary artifacts agree on the 4/5 case: the sender's note contains the false "cannot recover" instruction, the sender's pane shows the reasoning that produced it, and the receiver's own session store contains the rendered lookup offer plus a reply that denies the lookup works. Those are three artifacts from two processes, not one file read twice. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:330]

3. **Two questions still carry an inference, and the ledger makes that visible.** The Pi mid-session `cwd` hazard and the OpenCode two-instruction prompt are code-path conclusions with no live instance in `scratch/runs/`. They are recorded as secondary-class evidence and should not be counted as observed failures in synthesis. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:222]

## Ruled Out

- "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class.
- "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately.

## Dead Ends

- Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly.

## Edge Cases

- Ambiguous input: the schema does not define the class names, only that a string is expected. Chose `primary` for runtime-recorded or exercised artifacts, `secondary` for production source, `tertiary` for documentation.
- Contradictory evidence: none; the classification is a labelling of existing citations, not a new claim.
- Missing dependencies: none.
- Partial success: the ledger is complete for what was consulted; a live rerun of the Pi hop under a fixed prepare text would add an observed-primary source for the fix findings, which do not exist yet.

## Questions Answered

None newly answered; all five remain answered from iterations 1 to 5, now with their evidence classes recorded.

## Questions Remaining

None.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653
- .skilled/hooks/shared/session-readers/pi.mjs:222
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:330
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:28
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses_e1d2c7c81ffeJTAeWEY1UQO3wn.md:22
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:63
- .skilled/hooks/session-handover/lib/nudge.cjs:193
- .skilled/hooks/session-handover/lib/nudge.cjs:296
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072
- .skilled/hooks/session-handover/history/lib/lookup-offer.ts:82
- .skilled/hooks/session-handover/history/lib/navigator.ts:265
- .skilled/hooks/session-handover/history/lib/core.ts:56
- .skilled/hooks/shared/session-readers/project.mjs:40
- .skilled/hooks/shared/session-readers/opencode.mjs:256
- .skilled/hooks/shared/session-readers/index.mjs:127
- .skilled/hooks/session-handover/history/lib/cli.ts:406
- .skilled/hooks/session-handover/pi/session-handover.ts:594
- .opencode/plugins/session-handover.js:590
- .skilled/hooks/goal/lib/goal-core.cjs:1191
- .skilled/bin/skilled-loop:778
- .skilled/hooks/session-handover/README.md:198

## Assessment

- New information ratio: 0.75
- Questions addressed: evidence coverage for all five
- Questions answered: none newly

## Reflection

- What worked and why: reading the guard's implementation rather than treating the block as a nuisance. The block named a real weakness in the evidence base, and the fix was to record classes, not to argue.
- What did not work and why: treating "many files read" as diversity. The guard counts classes, and the run's own records are the class the earlier iterations under-cited.
- What I would do differently: classify sources as they are read, per iteration, instead of reconstructing the ledger at the end.

## Recommended Next Focus

Re-evaluate convergence. With the source ledger recorded, the stop decision should be able to pass the diversity and evidence-depth guards if the questions are genuinely answered; if it still blocks, the blocker names the remaining gap and synthesis proceeds on the documented partial.
