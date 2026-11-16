# Review Report: Command Surfacing Build, Pass Nine (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the ninth review pass. It read phase 038's net change to the scorer, the typed command matcher, the vitest config and the session tests (`85550ee946e..05f776202e0`, `review/review-scope-9.txt`, two areas).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-9.txt`, config `review/deep-review-fanout-config-pass-9.json`. Pass eight's report is kept as `review-report-pass-8.md`.

## 1. Executive Summary

- **Verdict: PASS.** P0 0, P1 0, P2 6, all six fixed as task T015 of phase 038.
- **Stop: converged.** This is the first pass whose leaves ran the workflow's graph and stop steps: each iteration recorded `graphEvents`, upserted them with `upsert.cjs` and asked `convergence.cjs` for a stop decision. scorer-9 stopped at iteration 5 with `converged` (`all_dimensions_clean`), attach-config-9 at iteration 4 with `converged`. Re-running `convergence.cjs` on copies of each lineage's final state (`038 scratch/conv-scorer-9`, `conv-attach-config-9`) returns STOP `converged` `all_dimensions_clean` for both, with no failed graph signal.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| S9-P2-001 | P2 | `score-command-transcripts.mjs` `guardedWriteCounts` | `/var/tmp` and a bare scratch root counted as real folders | Fixed, two cases |
| S9-P2-002 | P2 | `score-command-transcripts.mjs` `commandParts` | A mode typed ahead of a route stayed inside the name, so `speckit:complete:auto add auth` lost its start | Fixed: the route is split off first; the self-chosen auto check reads the name before the route too |
| S9-P2-003 | P2 | `score-command-transcripts.mjs` `MODE_SUFFIX` | The end-anchored suffix pattern was quadratic | Fixed: known suffix words are popped one segment at a time. A chain of 100000 suffixes took 12055 ms before and 8 ms after |
| S9-P2-004 | P2 | phase 038 | The suffix and self-auto changes had no requirement | REQ-006 and AC-006 added |
| S9-P2-005 | P2 | `score-command-transcripts.mjs` | The modifier vocabulary was written twice, and the longest chain was untested | One `WITH_MODIFIER` source builds both patterns; the longest chain is pinned. The TypeScript matcher in `lib/command-attach.ts` keeps its own copy, since a script cannot import the runtime's source |
| A9-P2-001 | P2 | `command-attach-guards.vitest.ts` | No test pinned the suffix chain's leading anchor | `/speckit:complete:draft:auto` pinned as refused |

## 3. Verification

`038-alignment-p1-remediation/scratch/after-pass-nine.txt`: build and typecheck exit 0, suite 2339 passed 0 failed with `AI_SESSION_CHILD` unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged. Three new scorer cases fail on the previous scorer, and the two pins pass on both.
