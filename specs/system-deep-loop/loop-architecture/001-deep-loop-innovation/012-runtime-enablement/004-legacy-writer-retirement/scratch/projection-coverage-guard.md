---
title: "Projection-coverage guard"
trigger_phrases: []
---
# Projection-coverage guard

## What this establishes

The projection manifest declares 28 surfaces, 22 of them with disposition `project`. Exactly one
projection contract factory exists in the whole library, `createDeepResearchProjectionContract`,
covering `research-state`. So 21 projectable surfaces have no contract behind them.

Until now nothing in the tree failed when a projectable surface had no contract. That gap was
invisible: an append for such a mode succeeds, reports `projectionRefreshed` false with an error
naming the missing contract, and never refreshes the legacy file.

`scripts/check-projection-coverage.cjs` makes the gap a standing, counted fact and fails when it
grows.

## How it works

It parses the manifest textually rather than importing it, because a plain `.cjs` cannot require a
`.ts` module here; the sibling append-sites checker takes the same approach and uses only `fs` and
`path`. It selects every `disposition: 'project'` row, then partitions into a covered map (whose
named factory is verified to be exported by reading the contract module) and an explicitly
declared, explicitly counted uncovered list.

| Rule | Fires when |
| ---- | ---------- |
| `UNDECLARED_UNCOVERED_SURFACE` | projectable, not covered, not in the declared uncovered list |
| `UNCOVERED_COUNT_MISMATCH` | the declared count differs from the derived total |
| `STALE_UNCOVERED_DECLARATION` | a declared-uncovered surface became covered or non-projectable |
| `MISSING_CONTRACT_EXPORT` | a factory named in the covered map is not exported by its module |

Exit 0 clean, 2 violation, 1 script error. A block missing either field throws rather than being
skipped, because a parser that quietly drops rows would under-report the very gap being measured.

## Evidence

Against the tree: `{"ok":true,"projectable":22,"covered":1,"uncovered":21,"violations":[]}`, exit
0. Unit tests 6 of 6 pass.

Negative control on the real manifest, inserting a projectable surface with no contract: exit 2
with `UNCOVERED_COUNT_MISMATCH` and `UNDECLARED_UNCOVERED_SURFACE`. Restored, exit 0, manifest
byte-identical.

Because that first control tripped two rules at once, a second isolated control was run: insert
the surface and raise the declared count so the count rule is satisfied. Result was a single
violation, `UNDECLARED_UNCOVERED_SURFACE`, exit 2, with the count rule silent. The rule is proven
to fire on its own.

## Adversarial review and what survived

A reviewer instructed to refute the guard raised six objections. Three were tested and refuted,
three stand and are recorded here rather than argued away.

Refuted by measurement. The claim that textual parsing would silently miscount was tested by
rewriting a projectable entry to use double quotes, first on `surfaceId` and then on
`disposition`. The census stayed at 22 both times; the field patterns accept either quote style
and tolerate whitespace. The related claim of a false green fails for the same reason, and because
the declared count is a literal constant rather than a parsed value, so a dropped row always
changes the derived total and trips the count rule. The claim that the negative control was
confounded was fair, and was closed by the isolated control above.

Standing, and worth stating plainly:

- The uncovered list is a hand-maintained whitelist. Declaring 21 surfaces as expected keeps the
  gate green while 21 modes still never project. The guard makes the number visible and stops it
  growing silently; it does not create pressure to shrink it.
- The guard cannot make a projection happen. It prevents regression, not the existing gap.
- "Covered" means a factory of that name is exported. It does not verify the contract is correct,
  that the gateway resolves it, or that it is ever invoked. A surface could be covered by this
  definition and still never project, because the gateway resolves its contract through a separate
  path that this guard does not exercise.

## Bearing on this phase's requirements

The phase requires that every legacy file named in the projection manifest is still produced after
its writer is retired, and lists re-confirming that as in-scope work. The measurement says it
cannot hold as written: 21 of 22 projectable surfaces have no contract, so retiring their writers
would leave their legacy files unproduced. Registering those contracts is a build per mode, and is
not in this phase's frozen scope. This is recorded as a conflict for an amendment decision rather
than worked around.

## Refinement: which uncovered surfaces actually block retirement

The raw total of 21 uncovered surfaces was true but not actionable, because it mixes two
populations that this phase treats differently.

Retirement applies to the mode protocol document sets. A surface whose manifest writer is one of
the deep-loop modes is in that scope; a surface written by runtime infrastructure is not, and its
lack of a projection contract does not block retiring a mode's writer.

Measured split of the 22 projectable surfaces:

| population | total | uncovered |
| ---------- | ----: | --------: |
| mode-owned | 10 | 9 |
| runtime infrastructure | 12 | 12 |

The one covered surface, `research-state`, is mode-owned. So the number retirement is actually
waiting on is **nine**, not twenty-one. The nine are `research-deltas`, `research-projections`,
`research-strategy-inbox`, `review-state`, `review-deltas`, `review-projections`,
`alignment-state-deltas`, `council-config-state` and `improvement-ledgers`.

The twelve infrastructure surfaces — the fanout ledger and checkpoints, observability, the
compiled command manifest, the dispatch guard's state and archive, the model grader cache, the
benchmark output, the divergent-pivot transactions, and the three reducer-written surfaces — have
writers this phase never retires. Their coverage is a separate question and not a precondition
here.

The guard now reports that breakdown alongside the original totals, which are unchanged so nothing
reading them breaks, and a new rule fails when the declared mode-owned count drifts from the
derived one. Negative control against the real manifest: reassigning one mode surface's writer to
an infrastructure writer moved the derived total to 9 and produced exit 2 with
`MODE_OWNED_COUNT_MISMATCH` naming the drift; restored, exit 0, manifest byte-identical.

This corrects an earlier statement of mine that REQ-004 was unachievable for 21 of 22 surfaces.
The requirement is conditioned on a writer being retired, and this phase retires mode writers, so
the twelve infrastructure surfaces were never in its reach. The gap is real and it is nine.
