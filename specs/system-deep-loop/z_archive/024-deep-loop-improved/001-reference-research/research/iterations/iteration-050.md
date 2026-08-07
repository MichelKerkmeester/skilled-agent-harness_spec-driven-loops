# Iteration 50: W-06 Record-Replay Harness for Convergence Regression

## Focus

W-06 asked whether OUR deep-loop-runtime tests should gain a record-replay harness that captures each iteration's dispatch inputs and outputs so a full run can be replayed deterministically when convergence behavior changes.

## Actions Taken

- Checked prior packet artifacts for "record", "replay", "fixture", "golden", and "deterministic" to avoid duplicating earlier fixture and convergence-baseline findings.
- Mined Kasper's e2e harness and evaluator path for event capture, NDJSON parsing, replay-limited attach runs, and pending-evaluation reconstruction from user, assistant, tool-call, and tool-result messages.
- Mined loop-cli-main for the closest fixture-style mechanism: mocked command execution plus `runHistory` records with `logOffset`, `logSize`, and status fields that index per-run output regions.
- Mapped those mechanisms to OUR existing deep-loop-runtime helper, convergence integration tests, fanout dispatch script, and fanout unit tests.

## Findings

1. Ranked first: add a reusable runtime cassette helper beside the existing CJS spawn helper.
   - Reference mechanism: Kasper parses opencode `--format json` stdout as NDJSON and keeps raw output plus parsed events and exit status (`external/kasper/tests/e2e/harness.ts:101`, `external/kasper/tests/e2e/harness.ts:326`, `external/kasper/tests/e2e/harness.ts:337`); continuation runs pin replay scope with `--replay-limit 50` (`external/kasper/tests/e2e/harness.ts:349`, `external/kasper/tests/e2e/harness.ts:362`, `external/kasper/tests/e2e/harness.ts:386`).
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts`.
   - Why it helps: this file already centralizes script invocation and parsed JSON output (`.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts:70`, `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts:91`), so adding `recordScriptRun()` / `replayScriptRun()` keeps deterministic cassettes shared across convergence, fanout, and reducer tests.
   - Port difficulty: easy.
   - Tag: quick-win.

2. Ranked second: promote convergence scenarios from ad hoc graph seeding to checked-in replay cassettes.
   - Reference mechanism: Kasper reconstructs a complete evaluable turn from message pairs, tool calls, subagent calls, completion state, and `lastMessageId` (`external/kasper/src/evaluate.ts:621`, `external/kasper/src/evaluate.ts:687`, `external/kasper/src/evaluate.ts:727`, `external/kasper/src/types.ts:345`); the scorer prompt then serializes tool names, args, and truncated results into deterministic scoring input (`external/kasper/src/scorer.ts:1394`, `external/kasper/src/scorer.ts:1404`, `external/kasper/src/scorer.ts:1409`).
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts`.
   - Why it helps: the current tests manually seed a converged research graph and call `--persist-snapshot` before asserting novelty behavior (`.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:14`, `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:160`, `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:189`); storing the seed actions, CLI args, stdin, and expected JSON bridge output as cassettes would make convergence changes regression-testable without recreating scenario logic in each test.
   - Port difficulty: medium.
   - Tag: quick-win.

3. Ranked third: add opt-in dispatch cassette capture to fanout runs, not only raw stdout salvage.
   - Reference mechanism: Kasper writes timestamped append-only JSON log entries for lifecycle checkpoints (`external/kasper/src/logging.ts:27`, `external/kasper/src/logging.ts:33`, `external/kasper/src/logging.ts:35`) and records evaluation lifecycle boundaries before and after state persistence (`external/kasper/src/evaluate.ts:247`, `external/kasper/src/evaluate.ts:292`, `external/kasper/src/evaluate.ts:320`).
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
   - Why it helps: fanout currently builds a lineage command with `command`, `args`, and optional `input` (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:402`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:406`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:423`) and saves raw stdout for salvage (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:685`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:689`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:693`), but it does not persist the normalized dispatch envelope needed to replay a full run without invoking external CLIs.
   - Port difficulty: medium.
   - Tag: quick-win.

4. Ranked fourth: index replay cassettes by run-output regions, using loop-cli's `runHistory` shape as the model.
   - Reference mechanism: loop-cli-main's `RunRecord` stores `logOffset`, `logSize`, status, and chain metadata (`external/loop-cli-main/src/types.ts:50`, `external/loop-cli-main/src/types.ts:57`, `external/loop-cli-main/src/types.ts:58`); the controller captures the starting byte offset before each run and updates the same record after completion (`external/loop-cli-main/src/core/loop-controller.ts:345`, `external/loop-cli-main/src/core/loop-controller.ts:347`, `external/loop-cli-main/src/core/loop-controller.ts:375`, `external/loop-cli-main/src/core/loop-controller.ts:377`).
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`.
   - Why it helps: the fanout tests already use echo stubs to assert exact argv and stdin (`.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:105`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:109`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:684`); adding run-region assertions would let the replay harness verify multi-iteration and multi-lineage stdout segmentation instead of comparing one monolithic captured output.
   - Port difficulty: medium.
   - Tag: quick-win.

## Questions Answered

- W-06: Yes, build the harness as a test-first cassette layer. The lowest-risk shape is: capture normalized dispatch envelopes in `fanout-run.cjs`, store replay fixtures under the runtime tests, and run them through helper APIs in `tests/helpers/spawn-cjs.ts`.
- The prompt's "loop-cli fixture style" is not a named record-replay subsystem in loop-cli-main. The concrete portable pieces are mocked command execution, fake timers, and `runHistory` byte-region indexing.
- The strongest reference for replaying input/output payloads is Kasper: it parses NDJSON command output, keeps raw output for diagnostics, reconstructs pending evaluations from message history, and records lifecycle events as append-only JSON.

## Questions Remaining

- Decide whether cassette files should live under `tests/fixtures/record-replay/` or beside each consuming suite. The former is better for shared full-run regression; the latter keeps suite-specific fixtures easier to review.
- Decide the redaction contract before storing prompts and tool results. Kasper truncates tool results for scoring; OUR replay cassettes should probably store full test fixture data but redact real run data by default.
- Decide whether fanout cassette capture is always enabled under `NODE_ENV=test` or gated behind an explicit CLI flag such as `--record-cassette`.

## Next Focus

W-07: Mine the nearest unexplored wildcard mechanism around deterministic failure replay: how to replay interrupted or failed loop runs so reducer recovery, salvage, and convergence decisions can be regression-tested from the same cassette corpus.
