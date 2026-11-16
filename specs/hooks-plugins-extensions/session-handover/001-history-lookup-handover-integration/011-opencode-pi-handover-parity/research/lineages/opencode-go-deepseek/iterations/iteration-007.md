# Iteration 7: Closing The Two Diversity Gaps

## Focus

The stop decision blocked on `sourceDiversity` for exactly two questions, `q-prepare-text` and `q-readers`, each reported at one source class. Read the guard again to find why the primary-class evidence already recorded did not count, then record the answering relation the ledger was missing.

## Actions Taken

- Read `buildAnsweringFindingsByQuestion` and `buildCitedSourcesByFinding`.
- Compared the reported class counts with the edges recorded in iteration 6.
- Re-filed two findings as answering findings, because each one answers its question directly.

## Findings

1. **Only `ANSWERS` edges count toward source diversity; `SUPPORTS` edges do not.** `buildAnsweringFindingsByQuestion` skips every relation except `ANSWERS` before it collects cited sources. The iteration-6 ledger had recorded the Pi note and pane as a `SUPPORTS` relation to the prepare-text question, so its two primary artifacts never entered the class count even though they were cited. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:339]

2. **Both blocked questions had their primary evidence filed one relation too weak.** The Pi note and pane answer what the prepare text failed to teach, and the measured 295-versus-160 offset answers what the browse reader fails to return. Recording them as answering findings raises each question to two classes without changing a conclusion or adding a source. [SOURCE: .skilled/hooks/session-handover/history/lib/navigator.ts:265]

## Ruled Out

- "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong.
- "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard.

## Dead Ends

- Re-running the same code reads as if they were a second class. They are not.

## Edge Cases

- Ambiguous input: none; the guard's implementation is explicit.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Questions Answered

None newly; the two blocked questions keep the answers recorded in iterations 1 and 2, now with both evidence classes counted.

## Questions Remaining

None.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:339
- .skilled/hooks/session-handover/history/lib/navigator.ts:265
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:28
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/meta.json

## Assessment

- New information ratio: 0.75
- Questions addressed: evidence-class coverage for the two blocked questions
- Questions answered: none newly

## Reflection

- What worked and why: reading the guard's edge filter instead of guessing at the threshold. One line explained both remaining violations.
- What did not work and why: assuming a `SUPPORTS` edge to a question was equivalent to answering it. In this graph it is not, and the metric is what the stop decision reads.
- What I would do differently: when a finding directly closes a question, record `ANSWERS` at the time, and reserve `SUPPORTS` for findings that merely corroborate someone else's answer.

## Recommended Next Focus

Re-evaluate convergence. If the stop now clears, synthesize; if a new blocker appears, name it in the report rather than looping further.
