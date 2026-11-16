# Iteration 5: Live-run evidence consolidation and the scorecard's recall measurement

## Focus

What the two recorded live runs actually prove, as opposed to what their scorecards report. The packet's decision D1 makes the live-hop harness the only accepted proof, so a scorecard that passes on text the receiver never wrote is worse than a failing one: it hides the failure the packet exists to fix.

## Actions Taken

1. Read the scorecard builder's recall and carry blocks.
2. Re-derived `afterSeed` for both panes and compared it with the whole-pane text.
3. Read the Pi receiver's closing reply against the scorecard's `sideWordStated`.
4. Read the harness script for any token planting.
5. Compared the two scorecards' step blocks to locate the 4/5.

## Findings

1. The scorecard's recall check is `afterSeed.includes(meta.sideWord)`, where `afterSeed` is the pane from the last `[session-handover]` marker, or the whole pane when no marker exists. A pane with no marker therefore passes on the sender's own prompt echo. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74]

2. The Pi pane contains no `[session-handover]` marker at all, so its `afterSeed` is the entire 30,172-character capture, and the side word appears at character 12,812 inside the echoed sender prompt. The Pi `sideWordStated: true` is that echo, not a receiver statement. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:149]

3. The OpenCode pane's last marker sits at character 425, so its `afterSeed` starts after the seed and its side word is genuinely in the receiver's reply, which quotes the loaded turn. The OpenCode recall is real; the Pi one is not. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22]

4. The Pi receiver's own words contradict its scorecard: `A fresh session has no path to it — not through the note, not through history lookup, since it was never written.` The recall failed and the card recorded a pass. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:331]

5. The Pi 4/5 is the `noteClosed` step, not the recall block: the note's status stayed `claimed` because the receiver held the close open waiting for the operator's answer. The recall block is scored apart from the five steps, so a failed recall cannot lower the score. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json]

6. The harness plants no token. `live-hop.sh` contains no `token`, `REDACT` or `plant` reference, so the packet's `[REDACTED:` completion criterion has no evidence from either run. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh]

7. The carry block reports `unobservable` when the first launch line's basename equals the runtime and the line is exactly the runtime name, which is the Pi case, so Pi's carry can never be scored from the card even when it works. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:55]

## Ruled Out

- "The Pi run proves recall because its card says `sideWordStated: true`." The card's own input is the echoed prompt, and the receiver's reply says the opposite.
- "The 4/5 is the recall failure." The five steps do not include recall; the missing step is `noteClosed`.

## Dead Ends

- Looking for a token-planting branch in the harness. There is none, so the redaction criterion cannot be scored from the current harness at all.

## Edge Cases

- Ambiguous input: "the Pi hop scored 4/5" could mean four of five steps or four of five criteria including recall. The scorecard's `score` field is the five steps, so the second reading is wrong.
- Contradictory evidence: the scorecard says the side word was stated and the pane says it was not. The pane is the primary capture and the card is derived from it, so the card's derivation is the defect.
- Missing dependencies: no token plant in the harness.
- Partial success: the OpenCode recall is proven; the Pi recall is disproven; the redaction criterion is unproven.

## Sources Consulted

- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:55`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:149`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:331`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/scorecard.json`

## Assessment

- New information ratio: 0.62
- Questions addressed: what the live runs prove; the recall measurement
- Questions answered: none new; this iteration corrects the evidence base for the questions already answered

## Reflection

- What worked and why: recomputing `afterSeed` by hand instead of trusting the card exposed the false positive in one step. The card is a derivation, and a derivation is only as good as its input slice.
- What did not work and why: reading the scorecard first and the pane second. The card's `sideWordStated: true` set an expectation the pane then contradicted.
- What I would do differently: read the primary capture before any derived artifact, every time.

## Recommended Next Focus

The claim-to-complete lifecycle: why the Pi note stayed `claimed`, and what the question-hold guard does to a receiver that asks the operator.

## SCOPE VIOLATIONS

- `step_graph_upsert` was not run. `iteration-graph-upsert.cjs` spawns `upsert.cjs`, which writes the coverage graph into `COVERAGE_GRAPH_DATABASE_DIR` and takes a writer lock there — both outside this lineage's write authority. The conflict is recorded here rather than resolved by writing outside the lineage. Consequence: `convergence.cjs` reports `CONTINUE` with `reasonDetail: graph_convergence_continue` and `nodeCount: 0`, so the loop cannot reach a graph-settled STOP and runs to `config.maxIterations`.

## Fixes Named

- Slice the pane at the claim seed's own marker, or fail the recall check when no marker is present, so a pane without a seed cannot pass on the sender's echo. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74]
- Score recall inside the five steps, or report it as a separate gate that can fail the run, so a failed recall cannot sit beside a 4/5. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs]
- Plant a fake token in the sender's turn and assert a `[REDACTED:` marker in the receiver's lookup reply, which is the only way the redaction criterion gets evidence. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh]
