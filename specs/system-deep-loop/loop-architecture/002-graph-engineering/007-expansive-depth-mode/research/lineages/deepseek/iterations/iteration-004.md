# Iteration 4: Frontier node F-1-002 (second pass) — partial-run reporting and budget sizing

## Focus

Frontier node F-1-002, second pass: what a partially complete fan-out tells the operator (failed label, failure class, rerun command), whether the dashboard exposes per-node progress, and whether the lineage budget actually funds the nodes it is dealt.

## Findings

1. **The partial-run summary reports only aggregate failure classes, never which lineage failed or how to rerun it.** `orchestration-summary.json` carries `total/succeeded/failed/all_failed`, a `failure_classes` count map and `timestamp_anomalies`; it has no per-lineage `{label, status, reason, rerun_command}` array. An operator whose deepseek lineage died on a 429 sees `failed: 1` and `quota: 1`, then has to open `orchestration-status.log` and the lineage logs to learn which one and what to run next. One concrete change: add a `lineages: [{label, status, reason, failure_class, rerun_command}]` array to the summary, with `rerun_command` the original argv narrowed to that label (`--only-lineage` from the iteration-1 finding, or the documented current workaround). Value: one file answers "what failed and what do I type". Effort S. Risk low. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/orchestration-summary.json:1] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4714] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json:1]

2. **The dashboard shows band spend but not per-node visits or status, so three single-node passes and three passes on one node look identical.** This lineage's dashboard after three iterations reports `Frontier size: 3 nodes (3 open…)`, `Revisits: 0` and `Budget depth1: 3 of 5 iterations spent`; nothing says each node was visited exactly once, and the registry already holds the data (`frontierNodeVisitRecords` in `reduce-state.cjs:2491`). One concrete change: add a per-node table to the dashboard frontier section (`nodeId, depth, visits, status, band, lastIteration`). Value: an operator can see a starved or a monopolised node before the band closes it. Effort S. Risk low. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:108] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2491]

3. **Every `observability-events.jsonl` row carries `subject.run_id: null`, so the event stream cannot be joined to a run or a lineage.** The payload names the label but not the run, and `run_id` is a first-class field on the envelope that is simply left empty. One concrete change: set `subject.run_id` (and `subject.label`) on every emitted event. Value: partial-run forensics and any external dashboard can correlate without parsing free text. Effort S. Risk low. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/observability-events.jsonl:1] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4801]

4. **The quota failure is detected but not turned into an instruction.** `fanout-run.cjs:4714-4717` produces `lineage <label> ...: provider quota exhausted (<cause>)`, while the single-executor workflow already carries the actionable sentence "Switch executor or wait, then resume this run" (`deep-research.yaml:1898`). The fan-out summary and the error line do not carry that clause or any resume step. One concrete change: append the same recovery clause plus the lineage-specific resume step to the quota failure message and to the summary's `rerun_command`. Value: the failure names the action, not just the cause. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4714] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1898]

5. **This lineage is a live instance of the budget split under-funding its nodes: 10 iterations give the depth-1 band 5 visits for 3 nodes, but each node needs a first pass and a verification pass.** The dashboard itself reports `Budget depth1: 3 of 5 iterations spent` after three single-node passes, which leaves two visits for the remaining second passes on all three nodes. The fan-out floor for a CLI lineage is 10 (`research.md:107`), independent of how many nodes it is dealt, so a 3-node share is funded as if it were a 1-node share. One concrete change: raise the CLI lineage floor to `max(10, 2 × dealtNodes + 2)` (research) so every dealt node is funded for a first and a verification pass. Value: removes the starvation this run has to work around by closing nodes early. Effort S. Risk low (the cap is still bounded by the explicit `iterations` value). [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:113] [SOURCE: .skilled/commands/deep/research.md:107] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:844]

## Ruled Out

- Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget.
- Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array.

## Dead Ends

- Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config.

## Edge Cases

- Ambiguous input: "rerun one failed lineage" could mean re-dispatch only the failed label or resume its half-finished loop. Both are served by the same `--only-lineage` filter plus the existing config-driven resume; the finding names both.
- Contradictory evidence: none.
- Missing dependencies: the failed 429 attempt's summary was not preserved; the quota text is read from the current code and the successful rerun's artifacts.
- Partial success: the node's first question (recovery) is answered; the dashboard and budget halves are answered by findings 2 and 5.

## Sources Consulted

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/orchestration-summary.json:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/observability-events.jsonl:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:108`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4714,4801`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2491`
- `.skilled/commands/deep/assets/deep-research.yaml:844,1898`
- `.skilled/commands/deep/research.md:107`

## Assessment

- New information ratio: 1.0
- Questions addressed: operator UX (frontier node F-1-002), second pass
- Questions answered: the operator-UX node question is answered: flags are documented but duplicated, budget sizing is under-funded for 3+ nodes, dashboards omit per-node detail, the dry run cannot show scopes before seeding, and recovery has no first-class path.

## Reflection

- What worked and why: using this lineage's own dashboard as evidence turned the budget-split arithmetic into an observed fact rather than a projection.
- What did not work and why: looking for a fan-out recovery section in the command docs found none, which confirms the gap rather than disproving it.
- What I would do differently: read the summary and observability files before the second pass, since they answer the "partial run" half directly.

## Recommended Next Focus

Close F-1-002 as answered. Next: F-1-004 failure-class pass, then F-1-006 receipt verification, then the design questions.
