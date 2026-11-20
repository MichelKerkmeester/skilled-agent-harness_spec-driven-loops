# Iteration 3: Frontier node F-1-006 — cost and latency

## Focus

Frontier node F-1-006 (depth 1, scope `review/` and `review-archive/`): what do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs and the live playbook logs, and which change cuts the most time or money?

## Findings

1. **The 24-iteration ceiling is unreachable at the measured 8-11 minutes per iteration under the default 120-minute duration budget; the duration stop binds first.** The review protocol already admits it ("At about seven to eight minutes an iteration, a 24-iteration review can reach `maxDurationMinutes` (120) before its iteration cap"), and one committed archive run shows the operator's workaround: `review-archive/20261119T153733Z` raised `maxDurationMinutes` to 360 for 10 iterations. At 8-11 min/iteration, 120 minutes funds 11-15 iterations, not 24, so the advertised cap is not the effective one. One concrete change: at config creation, derive the default duration budget from the iteration cap (`max(120, 10 × maxIterations)` for review, `max(120, 12 × maxIterations)` for research) or print a one-line warning that names the iteration at which the duration stop will bind. Value: the cap an operator reads is the cap the run can reach. Effort S. Risk low (an explicit `--max-duration`/config value still wins). [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464] [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-expansive-research-two-node-frontier.md:34] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T153733Z/deep-review-config.json:1]

2. **Setup costs 3-10 minutes per lineage before iteration 1, and a fan-out pays it once per lineage.** Measured from config `createdAt` to the first iteration timestamp: opus 3 min, deepseek 4 min, the 10-iteration archive run 10 min, the 3-iteration archive run 6 min. The root has already resolved the topic, seeded the frontier and partitioned it before spawning, so most of that work is repeated inside each child. One concrete change: when `fanout_lineage_artifact_dir` is bound, skip the context-ladder ripgrep and the resource-map scan in the child and read the root's prepared `prior_context`/seed files instead; keep the config, strategy and registry creation because those are lineage-owned. Value: 3-9 minutes saved per lineage on a 3-lineage fan-out. Effort M. Risk medium (a lineage that starts without its own context summary must still render a valid prompt). [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/opus/deep-review-config.json:1] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T153733Z/deep-review-state.jsonl:1] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:117]

3. **The 50/35/15 split starves the depth-1 band on a review: with three nodes per lineage and four dimensions each, depth 1 needs 12 of 24 iterations, exactly its 50% share, leaving no room for growth.** `applyBandBudget` closes every open node in a band once `spent >= cap × share` (`frontier-admit.cjs:360-395`), and the review protocol tells the operator to set `--max-iterations` to at least `2 × ceil(nodes/lineages) × dimensions` — i.e. to double the budget so the fixed 50% happens to cover depth 1. One concrete change: size `budgetSplit.depth1` from the seed (`nodesPerLineage × dimensions / maxIterations`, capped at 0.7) and give the remainder to depth 2 and 3, instead of a fixed 0.5. Value: a wide review funds its seeds before it funds growth, without operator arithmetic. Effort M. Risk medium-high (it changes when budget closes fire; the existing split must remain the default for default-mode runs). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360] [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464]

4. **Per-iteration cost is dominated by cache re-read of the same context, not by output.** The live playbooks measure 0.33M input, 0.03M output and 6.2M cache-read tokens for one added iteration, and 0.57M-0.75M input with 11.9M-13.7M cache-read over three iterations; at 24 iterations that is roughly 8M input and 150M cache-read. The prompt pack restates the full research topic and the whole state summary every iteration (`prompt-pack-iteration.md.tmpl:12-19`), which is exactly the re-read. One concrete change: render the topic as a path plus a one-line digest in the per-iteration pack (the leaf already reads `deep-research-config.json`), and keep only the delta summary for the last three iterations. Value: the cheapest cut in the whole budget, because it removes repeated input on every iteration. Effort S. Risk low (the leaf reads the config anyway). [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-extend-expansive-research-run.md:34] [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-expansive-research-two-node-frontier.md:34] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:12]

5. **No host-measured duration reaches the iteration record, so every latency claim rests on model-written timestamps that mix queue, model and idle time.** The fan-out runner already computes `slotDurationMs` and the dispatch receipt carries it (`fanout-run.cjs:4058`), but the iteration row has no `durationMs`; this lineage's own rows have none, and the archive spans (10 iterations in 31 min, 3 in 36 min) cannot be separated into model time and queue time. One concrete change: stamp the host-measured `durationMs` (and `slotDurationMs` when present) onto the iteration row before the gateway append, or require it in the prompt pack's OUTPUT CONTRACT. Value: makes the cost question answerable per iteration instead of per run. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4058] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:67] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T183614Z/deep-review-state.jsonl:1]

## Ruled Out

- Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape.
- Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it.

## Dead Ends

- Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps.

## Edge Cases

- Ambiguous input: "8-11 minute setup" has two evidenced readings. Both are reported: setup 3-10 min per lineage (measured from the committed runs) and per-iteration 8-11 min (playbooks). Neither reading is silently chosen as the only one.
- Contradictory evidence: none; the 24-vs-120 tension is stated by the protocol itself and reproduced by the archive config.
- Missing dependencies: no OpenAI/Anthropic billing export; token counts come from the playbook logs.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-extend-expansive-research-run.md:34`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-expansive-research-two-node-frontier.md:34`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:34`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4058`
- `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:12,67`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/opus/deep-review-config.json:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T153733Z/deep-review-config.json:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T183614Z/deep-review-state.jsonl:1`

## Assessment

- New information ratio: 1.0
- Questions addressed: cost and latency (frontier node F-1-006)
- Questions answered: none yet; the node stays open for the duration-budget pass

## Reflection

- What worked and why: measuring `createdAt` against the first iteration timestamp turned "setup feels slow" into a 3-10 minute range, and reading the playbook token rows exposed cache-read as the dominant term.
- What did not work and why: the playbooks do not separate setup from iteration time, so the two readings of "8-11 minute" had to be reported side by side.
- What I would do differently: pull `slotDurationMs` from the dispatch receipts for the archive runs before asserting any per-iteration latency.

## Recommended Next Focus

Close F-1-006 after one verification pass on the dispatch receipts, then return to F-1-002 for the partial-run summary and open F-1-005 on the design questions.
