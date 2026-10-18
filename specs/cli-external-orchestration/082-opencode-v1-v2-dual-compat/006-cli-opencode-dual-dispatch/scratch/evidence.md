# 006 evidence ledger (orchestrator-run)

The orchestrator ran every command below in the build worktree, starting from HEAD f8f6156c2d (the phase 004 commit). The output files are in this folder. Decisions 1 to 20 are in decisions.txt.

## Baseline (before any change)
- status-before.txt: git status at the phase start.
- deep-loop-suite-before.txt (T001): the full system-deep-loop vitest suite. 166 of 166 files, 2718 passed, 8 skipped, exit 0.
- line-check.txt (T003): the four sites at 2258, 2324, 2923 and 2961, and resolveExecutableVersion at 2093 (decision 1).
- The T002 backup of fanout-run.cjs and SKILL.md was taken, then deleted at closeout as planned.

## Live probes (T004, one operator-approved model run, 0.000919 USD)
- probes/run-slash.jsonl, probes/probe-log.jsonl, probes/fixture/dot-opencode/ (the fixture `.opencode` folder, renamed so no OpenCode run under specs/ loads it): `opencode2 run --standalone` in a scratch project outside the repository, with a fixture plugin and a fixture command.
- Q3: v2 `run` takes no positional directory (probes/v2-run-help.txt), and the plugin ran in the spawn directory (decision 2).
- Q2: a bare `/probe/echo ARG42` message was not expanded as a command. The model found the file with its own tools (decision 3).
- The child environment reached the plugin: AI_SESSION_CHILD=1 in setup() and session.prompt (decision 4).
- probes/v1-run-help.txt and v2-run-help.txt: the permission flag on each version (decision 5).
- probes/ps-before.txt and ps-after.txt: the process list before and after. The v2 service PID 46220 is in both with the same start time.
- probes/v2-model-providers.txt: v2 lists no opencode-go model on this machine (decision 12).

## Design settled (T005)
- Decisions 7 to 11: the resolver location, the doc lines, the refusal on a name fallback, the per-directory PATH order (a plan.md amendment), and the stub `--version` rule.

## Red first
- red-run.txt (T007): the new suite cannot load before the resolver exists.
- red-run-cases.txt and red-first-failures.txt: with an empty throwaway resolver, 21 of 23 cases fail on their first assertion. D1 and D3 pass by design, because they pin today's v1 argv (decisions 13 and 14).

## Build
- Luna wrote the resolver, both renderers, the availability check, the dispatch cwd and the stub `--version` answers. DeepSeek wrote the SKILL.md edit.
- green-run.txt (T013, first pass): the new suite, 23 of 23.
- deep-loop-suite-after-first.txt (T014, first pass): 2736 passed, 5 failed. The causes are in decision 16.

## Review and fixes
- review-doc-luna.txt (T012): one P1 and two P2s on the SKILL.md guard, all confirmed (decision 17).
- review-code-deepseek.txt (T018): one P1 and two P2s on the runtime, all confirmed, plus the stress-contract failure (decision 17).
- Fixes (T019): decision 18. green-run-after-fix.txt: the new suite plus the stress fanout suite, 42 passed, 1 skipped (that skip predates this phase).
- doc-guard-check.txt: the committed SKILL.md guard in six cases.

## Smoke dispatches (operator-approved runs, decision 19)
- smoke/v1 (T015): v1 1.19.3 through the builder. Exit 0, token in the reply, lineage file written. 0.002699 USD.
- smoke/v2 (T016): v2 2.0.32 through the builder with `--standalone`. Exit 0, token in the reply, lineage file written. 0.001162 USD.
- smoke/v2/smoke-v2-plugin.jsonl (T017): AI_SESSION_CHILD=1 in setup() and session.prompt of the v2 child.
- Total model spend this phase: 0.004780 USD.

## Final state
- deep-loop-suite-after.txt (T014): 167 of 167 files, 2741 passed, 0 failed, 8 skipped, exit 0. The delta from the baseline is the new file and its 23 cases. No other count moved.
- real-binary-watch.txt: during the final suite no real `opencode` or `opencode2` process ran. real-binary-watch-first.txt holds only the reviewer's three `--version` checks.
- static-checks.txt: CHK-004, CHK-005, CHK-006, CHK-030, CHK-031 and CHK-041, each read and met.
- The scoped diff from HEAD: cli-opencode/SKILL.md and its generated Hermes copy (decision 21), fanout-run.cjs, the new opencode-version.cjs and opencode-dual-dispatch.vitest.ts, the stub edits in five test files (decision 11), and plan.md (decisions 5 and 10).

## Carried forward
- To 007: v2 lists no opencode-go model here, so a v2 lineage that pins no model fails until that credential is added to v2 (decision 12).
- To 011: a v2 lineage prompt reaches the model wrapped in literal quotes (decision 6).
- To the operator: with both binaries in ~/.local/bin, every cli-opencode lineage now dispatches to v2, and every native lineage refuses until OPENCODE_BIN=opencode is set (decisions 3 and 10).
