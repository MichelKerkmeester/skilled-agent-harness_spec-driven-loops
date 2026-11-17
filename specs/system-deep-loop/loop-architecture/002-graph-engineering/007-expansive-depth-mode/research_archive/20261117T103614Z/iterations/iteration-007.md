# Iteration 7: RECOVERY (blocked_stop: source_diversity_guard) and the three carried verification items

## Focus

This is a recovery iteration after the `blocked_stop` on `source_diversity_guard`, where the graph `sourceDiversity` was 0.00 against a blocking threshold of 1.5. It has two parts:

1. Trace whether the graph upsert path really persists `metadata.quality_class`. Then re-cite the sources already used for Q1-Q7 with an honest class per source, so each QUESTION node can reach at least two classes.
2. Close the three verification items iteration 6 carried:
   - the review reducer's Next Focus twin;
   - whether `fanout-run.cjs` forwards the per-lineage Claude config dir on research lineages;
   - the stale carry-forward of answered questions.

## Actions Taken

1. Traced `quality_class` end to end:
   - the producer search;
   - `iteration-graph-upsert.cjs` event splitting;
   - `upsert.cjs` node build;
   - the `coverage-graph-db.ts` insert and update;
   - the `coverage-graph-query.ts` metadata allowlist;
   - the `coverage-graph-signals.ts` research diversity signal;
   - the two test files that hand-build the value.
2. Ran a read-only jq map over deltas 001-006 to list, for each QUESTION node, which SOURCE ids its ANSWERS findings CITE. Each source was then classified by what the file is.
3. Read the review reducer's Next Focus block and its fixed dimension list in `runtime/scripts/reduce-state.cjs`.
4. Read the `fanout-run.cjs` per-lineage env block and the `dispatch-iteration.cjs` `runClaude` config-dir branch.
5. Read `buildCarriedForwardOpenQuestions` in `continuity-thread.cjs` and its call site in the research reducer.

## Findings

1. **The persistence path for `metadata.quality_class` is intact end to end. The only gap is that nothing produces the value. This confirms iteration 5 finding 1 and does not refute it.**
   - `iteration-graph-upsert.cjs` spreads each node event whole (`{ ...event, name: ... }`), so any `metadata` key on the event survives. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:143]
   - `upsert.cjs` copies `metadata: n.metadata` into the stored node. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235]
   - The DB serializes metadata on insert and overwrites it on update of an existing id. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:617] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:628]
   - The read sanitizer keeps `quality_class` on its allowlist. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:131]
   - The signal reads it per cited SOURCE. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680]
   - The only places that set `quality_class` are tests, which hand-build it. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts:67]
   - What this means:
     - A leaf that puts `metadata.quality_class` on SOURCE node events inside the iteration record's `graphEvents` (delta line 1) gets it persisted. [INFERENCE: based on the spread at :143 and the copy at :235]
     - That holds even though the prompt contract's node shape does not mention `metadata`.
   - Status: confirmed by code trace only.
     - I did not run `upsert.cjs`, because it writes the coverage DB outside this packet.
     - The empirical check is the next `convergence.cjs` run after the workflow's graph upsert step: graph `sourceDiversity` should read at least 1.5.

2. **`quality_class` has no enforced vocabulary.**
   - The signal accepts any non-empty string. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:681]
   - The sanitizer only caps string values at 80 characters. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:120]
   - The tests use `primary` / `secondary` / `tertiary`. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:112]
   - The diversity number is therefore only as honest as the class taxonomy the producer picks.
   - With no shared vocabulary, a leaf can inflate it with synonyms, and `primary`/`secondary` labels say nothing about kind of evidence.
   - [INFERENCE: based on the unvalidated string check] An expansive-depth mode that relies on this guard needs a closed vocabulary, for example `runtime-code | test | command-contract | agent-contract | spec-doc | git-history | web`, validated in `upsert.cjs` next to the kind check. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:218]

3. **Re-citation map: Q1-Q7 and their source classes.**
   - The convention used here is source kind: `runtime-code`, `command-contract`, `spec-doc`, `test`, `agent-contract`. This is a convention, not a runtime vocabulary (finding 2).
   - Mapped from the deltas' ANSWERS and CITES edges (jq over `deltas/iter-001..006.jsonl`):
     - q1: convergence.cjs (runtime-code) and deep-research.yaml (command-contract). 2 classes.
     - q2: reduce-state.cjs and continuity-thread.cjs (runtime-code), and deep-research.yaml (command-contract). 2 classes.
     - q3-breadth-levers: fanout-run.cjs, coverage-graph-signals.ts and divergent-research-pivot.ts (runtime-code), and deep-research.yaml (command-contract). 2 classes.
     - q4: five 002-graph-engineering research and reference docs (spec-doc), and convergence.cjs, append-mode-event.cjs and legacy-compatibility.ts (runtime-code). 2 classes.
     - q5: runtime-code only (coverage-graph-*.ts, convergence.cjs, skill-advisor `command-attach.ts` and `prompt-policy.ts`). 1 class.
       - Finding 1 of this iteration adds the test file `convergence-script.vitest.ts`, which brings q5 to 2.
     - q6: runtime-code only (convergence.cjs, dispatch-iteration.cjs, reduce-state.cjs). 1 class.
       - Finding 7 of this iteration adds the agent definition (agent-contract), which brings q6 to 2.
     - q7: dispatch-iteration.cjs, executor-*.ts and fanout-run.cjs (runtime-code), and deep-research.yaml and deep-review.yaml (command-contract). 2 classes.
   - Predicted graph sourceDiversity:
     - If the workflow upserts this iteration's SOURCE nodes, the result is 14 / 7 = 2.0, provided the graph holds exactly these 7 QUESTION nodes. [INFERENCE: based on the signal's per-question distinct-class average at coverage-graph-signals.ts:653-686]
     - Any extra QUESTION node in the session namespace lowers it.
   - Not available in this packet: git-history and web sources. No finding cites a commit or URL, so I did not assign those classes.

4. **The review reducer's Next Focus twin also never widens.** The review strategy's Next Focus is picked in this order:
   - the latest iteration file's `nextFocus`;
   - else the first uncovered entry of the fixed `REQUIRED_DIMENSIONS`;
   - then overridden by `registry.divergence.currentFocus`;
   - then by the latest blocked-stop recovery text. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2187] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2198]
   - `REQUIRED_DIMENSIONS` is a hard-coded set of four: correctness, security, traceability, maintainability. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24]
   - No candidate source introduces a new target. This matches iteration 2's finding for the research reducer.
   - For the integration map (Q6), the depth-mode frontier pick must be added to both reducers: the research reducer's `resolveNextFocus` and this review block.

5. **Fan-out forwards the per-lineage Claude config dir regardless of loop type.**
   - For every `cli-claude-code` lineage that has a `configDir`, `fanout-run.cjs` validates the dir and injects `CLAUDE_CONFIG_DIR` into the lineage's spawn env. The condition is only `lineage.kind === 'cli-claude-code' && lineage.configDir`, with no `loopType` check. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3962] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3995]
   - Research fan-out lineages therefore are routed to the configured account.
   - The Q7 defect is therefore narrower than iteration 6 assumed. It applies to single-executor (non-fan-out) research runs, where `dispatch-iteration.cjs` validates and sets `CLAUDE_CONFIG_DIR` only on the `loopType === 'review'` branch. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:355] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:389]
   - It also rejects an explicit `--claude-config-dir` on non-review runs. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:217]

6. **Unverified: a research lineage that re-enters `dispatch-iteration.cjs` may still inherit `CLAUDE_CONFIG_DIR` from its parent env.**
   - The review branch comments that the `CLAUDE_` prefix is on the cli-claude-code env allowlist. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:385]
   - If the research branch also filters the env through the same allowlist, an inherited `CLAUDE_CONFIG_DIR` (set by fan-out, finding 5) would pass to the child.
   - [INFERENCE: based on the allowlist comment at :385 and the fan-out injection at fanout-run.cjs:3995] I did not read the research branch's env construction.
   - Next check: read `runClaude`'s non-review path after line 392 and `buildExecutorDispatchEnv`.

7. **Contract drift: the agent definition and the rendered prompt pack disagree on `research/research.md`.**
   - The agent definition allows the leaf to write `research/research.md` when `progressiveSynthesis == true`. [SOURCE: .skilled/agents/deep-research.md:58] [SOURCE: .skilled/agents/deep-research.md:309]
   - This packet's config sets `progressiveSynthesis: true`. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-config.json:1]
   - The prompt pack's ALLOWED WRITE PATHS ("the ONLY paths") lists only the iteration file, the delta file and the gateway's writes. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/prompts/iteration-7.md:62]
   - I followed the narrower prompt pack and did not touch `research.md`.
   - For Q6, an expansive-depth sub-mode that adds new leaf write targets, such as a frontier file, must update both the agent definition and the prompt-pack renderer's allowed-write list. Otherwise one of them silently blocks the other. [INFERENCE: based on the two cited contracts]

8. **The carried-forward open-questions list keeps answered questions (stale carry-forward).**
   - `buildCarriedForwardOpenQuestions` collects every `questionsRemaining` bullet from iteration markdown and every `openQuestions`/`questionsRemaining` entry from iteration records. It skips only texts that match a currently open machine question, and duplicates. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:88]
   - It never subtracts answered or resolved questions. When a question is answered, it leaves the machine-open set, so its old carried-forward text stops being suppressed.
   - Live evidence: this iteration's prompt carries Q2-Q6 texts and a "None of the strategy key questions remain open" sentence as open questions, while the strategy marks all seven answered. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/prompts/iteration-7.md:22] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-strategy.md:1]
   - The research reducer feeds this list into next-focus candidates. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2587]
   - So stale questions can steer focus. For expansive depth this matters doubly: a frontier fed from carried-forward text would re-admit closed nodes. The fix is to subtract answered keys from the registry's resolved set.

## Questions Answered

No strategy key question is newly answered. All seven were already answered. This iteration closes three of the four carried verification items (findings 4, 5, 8). It confirms iteration 5 finding 1 by code trace (finding 1) and supplies the class-tagged re-citation for the source-diversity guard (finding 3).

## Questions Remaining

No strategy key question remains open. The one unverified item is in finding 6: whether a research lineage inherits `CLAUDE_CONFIG_DIR` through `dispatch-iteration.cjs`'s research branch env filter. The read-only `convergence.cjs` confirmation from iteration 5 is still pending; it should run after the workflow upserts this iteration's graph events.

## Next Focus

1. Run `convergence.cjs` read-only after this iteration's graph upsert. Confirm that graph `sourceDiversity` is at least 1.5 and read `graph_decision`. That is the empirical proof for finding 1.
2. Read the research branch of `runClaude` and `buildExecutorDispatchEnv` in `dispatch-iteration.cjs` to settle finding 6.
3. If both pass, move toward synthesis. The design questions are saturated.

## Edge Cases

- **Contradictory input:** strategy §9 lists "Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes" as BLOCKED (iteration 5), but this iteration's dispatch focus explicitly orders it.
  - I followed the explicit dispatch, which ranks above strategy prose.
  - The iteration 5 rationale ("exact node shapes") is weak: prior SOURCE nodes already carry `path`, which is outside that shape, and finding 1 shows the extra key passes through.
  - The classes assigned are honest source kinds, not fabricated diversity.
- **Missing dependencies:** no git-history or web sources are cited by any finding, so those classes were not used. I did not run the upsert or convergence because both are outside the write scope.
- **Partial success:** finding 6 is inferred, not verified.
- **Ambiguous input:** none beyond the contradiction above.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:1-20, 137-221
- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:212-240
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:617-650
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:120-145
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:640-700
- .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49-112
- .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts:67-68
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24, 2178-2225
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:685-715, 3950-4000
- .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:213-217, 350-392
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76-120
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2580-2600
- .skilled/agents/deep-research.md:58, 309
- research/deltas/iter-001..006.jsonl (graphEvents ANSWERS/CITES map)

## Assessment

- New information ratio: 0.63. Of 8 findings, 3 are fully new (4, 5, 7) and 4 are partially new (1, 2, 6, 8). Findings 1 and 8 prove items earlier iterations flagged, finding 2 sharpens iteration 5, and finding 6 is inferred. Finding 3 is a re-citation of existing evidence, so it counts as 0. That gives (3 + 0.5 × 4) / 8 = 0.63.
- Questions addressed: Q5, Q6, Q7 (carried verification items), plus the source-diversity recovery.
- Questions answered: none newly. All seven were already answered.

## Reflection

- **What worked and why:** a single jq map over the deltas gave the exact QUESTION→SOURCE graph the signal walks. That let me re-classify existing source ids instead of inventing new ones, and add new sources only where a question sat at one class.
- **What did not work and why:** the persistence proof stays a code trace. The prompt's write scope forbids running `upsert.cjs` against the shared coverage DB, so the empirical confirmation moves to the workflow's own convergence step.
- **What I would do differently:** read the research branch of `runClaude` in the same call as the fan-out env block. That would have settled finding 6 instead of leaving it inferred.

## Recommended Next Focus

Run `convergence.cjs` read-only to confirm that graph `sourceDiversity` is at least 1.5 after the upsert, and settle finding 6 with one read of `dispatch-iteration.cjs`'s research env path. Then synthesize.
