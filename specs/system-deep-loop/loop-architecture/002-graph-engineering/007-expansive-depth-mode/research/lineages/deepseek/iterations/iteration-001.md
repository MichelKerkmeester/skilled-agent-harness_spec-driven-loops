# Iteration 1: Frontier node F-1-002 — operator UX for expansive depth

## Focus

Frontier node F-1-002 (depth 1, scope `.skilled/commands/deep/research.md`, `review.md`, both presentation assets): how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?

The ambiguous half of the topic ("the 8-11 minute setup") is deferred to the cost node: the only literal "8-11" in the codebase is a retired iteration tool-call budget (`.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.13.0.md:3`), while the measured per-iteration wall clock in the playbooks is 7-11 minutes. This iteration treats "setup" as per-iteration latency and records the ambiguity rather than resolving it.

## Findings

1. **`research.md` still carries the 486-word `--depth-mode` table cell that the review already collapsed in `review.md`.** The research cell restates seeding, all six admission checks, the cap arithmetic, the 50/35/15 split, the derived-budget formula, the fan-out floors and the stop-veto list in one row, while the review surface now says four lines and links to its protocol. That is the same discoverability defect the fan-out review found in `review.md` (OPUS-F004-P2-004), fixed only on one side. One concrete change: replace `.skilled/commands/deep/research.md:107` with the `review.md` pointer shape and move the long form to `.skilled/commands/deep/assets/deep-research-presentation.txt` under one "Expansive depth" heading. Value: an operator scanning flags sees the flag, not the design. Effort S. Risk low (docs only). [SOURCE: .skilled/commands/deep/research.md:107] [SOURCE: .skilled/commands/deep/review.md:100] [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:74]

2. **There is no first-class way to rerun one failed lineage; recovery today is hand-editing the fan-out config.** `fanout-run.cjs` exposes no `--lineage`/`--only`/`--retry-failed` filter, and `readStoredLineageSessionId` deliberately returns `null` when a lineage config is `complete`, so a second invocation mints a fresh `fanout-<label>-<runId>` session for *every* lineage in the matrix and re-enters the same directory. A completed lineage then trips the `on_completed_session` halt, writes no new iteration, and fails `checkLineageCompletion` on the stale terminal row. The committed packet shows the workaround: `review/fanout-config-recovery.json` is a hand-rewritten one-executor matrix that re-runs only `deepseek`. One concrete change: add a repeatable `--only-lineage=LABEL` to `fanout-run.cjs`, filter `allLineages` before the frontier partition, and report filtered-out lineages as `skipped_complete` in the summary. Value: turns a config edit plus full re-spend into one flag. Effort M. Risk medium (partition and summary arithmetic must exclude skipped lineages). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:772] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3935] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4837] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json:1]

3. **The fan-out dry-run prints `frontier_scope: []` for an unseeded expansive run, which is indistinguishable from "this lineage was dealt no nodes".** The preview path builds `frontier_scope` from `resolveFrontierPartition` over the on-disk store, and on a first run the store does not exist yet because seeding happens after the preview; the docs explain the empty value in prose instead of encoding it. One concrete change: emit `frontier_scope: null` plus `frontier_scope_status: "pending-seed"` when `depthMode === 'expansive'` and no store exists, and print a one-line runner warning that scopes appear only after the seed. Value: removes a false-negative read of the most important preview field. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4007] [SOURCE: .skilled/commands/deep/research.md:145] [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:31]

4. **Question intake has two paths, and this lineage's own dashboard shows the duplicate state it produces.** Init wrote six questions into strategy Section 3; the fan-out root had already written three frontier rows to `inbox.jsonl`; the reducer imported both sets as `legacy-import` and `frontier`, so the dashboard reports 9 open questions that are really 6 topics with 3 near-duplicates. The strategy template still tells the operator that direct Section 3 edits work as a compatibility path (`.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:61-68`). One concrete change: have `step_create_strategy` write key questions to `inbox.jsonl` with `origin: "analyst-strategy"` and leave Section 3 empty; the reducer then owns the only intake. Value: one question list, no `question_conflict` noise, honest 6/6 progress. Effort M. Risk medium (older packets depend on legacy import; keep the import read-only for them). [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:34] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:61] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:928]

5. **The budget warning never reaches a fan-out operator.** `seedBudget` is the only place that says "no growth slot past depth 1" (`.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:521`), and its CLI entry is skipped on a lineage (`deep-research.yaml:839`); the fan-out root's `step_frontier_seed` prints admitted/pruned nodes but no per-lineage budget, and `fanout-run.cjs` knows the partition and every lineage's `iterations` value at spawn time. One concrete change: have `fanout-run.cjs` print, per lineage, `<label>: <iterations> iterations, <growth slots> growth slots past depth 1`, and raise the same warning when the count is zero. Value: budget sizing becomes visible where the money is spent. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:521] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:839] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4007]

## Ruled Out

- Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail.
- Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run.

## Dead Ends

- Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead.

## Edge Cases

- Ambiguous input: "the 8-11 minute setup" has two readings (setup latency vs per-iteration tool-call budget). Selected: per-iteration wall clock, with the deferred setup-latency reading named above.
- Contradictory evidence: none found.
- Missing dependencies: no live fan-out run was available for this lineage; recovery evidence comes from the committed run artifacts in `review/`.
- Partial success: none; all five findings are source-backed.

## Sources Consulted

- `.skilled/commands/deep/research.md:107,145`
- `.skilled/commands/deep/review.md:100`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:31,74`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:772,3935,4007,4714,4837`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:521`
- `.skilled/commands/deep/assets/deep-research.yaml:839,928`
- `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:61`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json:1`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:34`

## Assessment

- New information ratio: 1.0
- Questions addressed: operator UX (frontier node F-1-002)
- Questions answered: none yet; the node stays open for recovery-path verification

## Reflection

- What worked and why: reading the two command surfaces side by side exposed the one-sided collapse immediately, and reading `fanout-run.cjs` from the preview path into the completion check showed the rerun gap end to end.
- What did not work and why: the recovery search for a documented one-lineage rerun flag found no flag, then no text, because the mechanism is absent rather than hidden.
- What I would do differently: start from the committed run artifacts (`review/`, `review-archive/`) to find which recovery paths were actually exercised, then confirm them in code.

## Recommended Next Focus

Keep F-1-002 open for one more pass: verify what a partially complete fan-out summary tells the operator (failed label, failure class, rerun command) and whether the dashboard exposes per-node budget spend. Then move to F-1-004 (cross-CLI parity) and F-1-006 (cost and latency).
