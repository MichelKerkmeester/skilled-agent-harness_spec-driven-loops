# Iteration 4: F-1-002 adapter contract and conformance test (synthesis)

## Focus

Frontier node F-1-002 (depth 1, scope fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts, runtime/scripts/dispatch-iteration.cjs, .claude .codex .pi .dsh .vibe .opencode mirrors against .skilled): Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences?

This pass is analytical: iteration 1 gathered the differences, so the remaining work is the contract shape and the test that would hold it. No new external source is introduced, which is why the status is `insight` rather than `complete`.

## Actions Taken

1. Re-read iteration 1's findings and the builders they cite, plus `EXECUTOR_KIND_FLAG_SUPPORT` and `effective_config`.
2. Checked that `buildLineageCommand` is the shared entrypoint the single-executor cursor/devin/pi branch already calls, so a table-driven test can target one function rather than eight.
3. Checked the stress matrix's fourteen rows and the `expectSuccessArgs` switch that duplicates the builders.
4. Composed the contract fields so each one maps to a difference that iteration 1 confirmed, and wrote the four fixture assertions.

## Findings

1. **The contract is one record per `ExecutorKind` with seven capability fields, and every field answers a difference this run found.** The fields are `binary`, `promptChannel` (`argv`/`stdin`/`file`), `outputFormat` (`text`/`json`/`export`/`none`), `costSource` (`step_finish`/`export`/null), `effortSurface` (`flag`/`model-suffix`/`model-id`/`config`/`none`), `sandboxSurface` (`os-flag`/`approval-flag`/`tool-allowlist`/`none`) and `resume` (`session-flag`/`artifact-only`/`none`). It belongs beside `EXECUTOR_KIND_FLAG_SUPPORT`, which already declares what each kind accepts but not how it is carried. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:19]

2. **The conformance test is four fixture assertions over `buildLineageCommand`, one per divergence that is currently undetected.** (a) Given a fixed lineage and a prompt, exactly one channel carries it: one `promptArgIndexes` entry, or `input === prompt` with a trailing `-`, or a `--prompt-file` path; `redactedArgs` must show one digest. (b) A requested `--sandbox-mode` round-trips into `effectiveConfig.sandboxEnforcement`, or the adapter refuses it; today five single-executor branches silently substitute `workspace-write`. (c) A synthetic log fixture per `costSource` must make `sumProviderCostFromLog` return the declared shape or null, so a null is labelled rather than anonymous. (d) A synthetic transcript per pending-question source must yield the expected `detectPendingQuestion` result, which today can never be true for a JSON log. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:21] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:538] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76]

3. **The test should iterate `EXECUTOR_KINDS` and fail on an unlisted kind, which retires the `expectSuccessArgs` switch instead of extending it.** The stress suite's per-kind switch is a second copy of each builder's decisions; a table-driven test reads the same contract the builder reads, so a new kind cannot be added with a builder and no assertions, or with assertions and no builder. The fourteen existing edge-case rows stay as they are; four adapter-contract rows are added to the matrix so the bijection validator covers them. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:18]

4. **The build order is: contract table and test first (S), then the held rows in F-1-004's order (30+12, then 13, then 29).** The contract is the cheap artifact that makes row 13's collapse safe: row 13 removes the hand-built `runClaude`/`runCodex` branches, and without the four assertions the collapse can re-introduce the sandbox substitution or the text-format cost gap silently. The mirror half needs no work: both gates pass, and the missing command trees in `.codex`, `.pi`, `.dsh` and `.vibe` are the crosswalk's sanctioned shape. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:961] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-002.md:27] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:67]

## Questions Answered

- Where do the eight kinds still differ? Iteration 1, Findings 1-5.
- What single adapter contract and conformance test would remove the differences, including the mirrors? Findings 1-4: a seven-field capability record and four fixture assertions over `buildLineageCommand`, with no new mirror gate.

## Questions Remaining

- None for this node. The contract shape is decided; implementation, value/effort/risk and the row-13 sequencing are recorded in the ledger for F-1-004's order.

## Recommended Next Focus

Frontier node F-2-007: whether the cli-adapter stress suite is part of a default gate and which matrix cells remain pending.

## Ruled Out

- **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces.
- **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it.
- **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot.

## Dead Ends

- Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried".

## Edge Cases

- Ambiguous input: none. The node's two questions were answered in iteration 1 and this pass.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: this is a synthesis pass; newInfoRatio is reported as `insight` because no new external evidence was gathered.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:538`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:961`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:18`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:19`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-002.md:27`

## Assessment

- New information ratio: 0.60
- Questions addressed: the adapter contract shape and the conformance test.
- Questions answered: the F-1-002 question in full.
- Finding mix: four partially new synthesis findings, plus the +0.10 simplicity bonus for collapsing six builder-level differences into one seven-field record and four assertions.

## Reflection

- What worked and why: mapping every contract field to a difference found in iteration 1 kept the design from becoming an aspiration; each field has a failure it prevents and a file:line that shows the failure today.
- What did not work and why: I considered a per-kind test list first, which would have recreated the duplication the test exists to remove; the table-driven shape only emerged after reading `expectSuccessArgs`.
- What I would do differently: write the four assertions in the same pass as the contract, because an assertion that cannot be written is a field that does not describe observable behaviour.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
