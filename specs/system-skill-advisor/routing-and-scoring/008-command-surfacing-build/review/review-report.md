# Review Report: Command Surfacing Build, Pass Eight (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the eighth review pass. It read pass seven's fixes (`1c3d62def5a..3416b5e0526`) and this branch's net change to CONTRIBUTING.md against origin/main (`review/review-scope-8.txt`, two areas).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, five iterations each, threshold 0.10, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-8.txt`, config `review/deep-review-fanout-config-pass-8.json`. Pass seven's report is kept as `review-report-pass-7.md`.

## 1. Executive Summary

- **Verdict: PASS.** P0 0, P1 0, P2 3, all fixed as task T014 of phase 038.
- **Stop:** both lineages ended at the iteration cap with last ratios of 0. The review stop decision could not run for them, because the fan-out leaves recorded no coverage graph events: `convergence.cjs` on copies of their state returned BLOCKED on an empty graph, and after the workflow's canonical coverage projection (`038 scratch/review-graph-project.mjs`) it returned CONTINUE on finding stability and evidence density, which need finding and evidence nodes. Pass nine records them.

## 2. Findings and Dispositions

| Lineage | Severity | Location | Finding | Disposition |
|---------|----------|----------|---------|-------------|
| scorer-8 | P2 | `score-command-transcripts.mjs` `guardedWriteCounts` | A guarded write that names the checkout folder itself read as safe | Fixed, with a test |
| scorer-8 | P2 | `score-command-transcripts.mjs` `SELF_AUTO` | A self-chosen `:auto` followed by a `:with-*` modifier escaped the end anchor | Fixed, with a test |
| attach-docs-8 | P2 | `command-attach-guards.vitest.ts` | No test pinned `:with-phases` or a modifier on a command whose hint does not list it | Fixed, two cases |

## 3. Verification

`038-alignment-p1-remediation/scratch/after-pass-eight.txt`: suite 2335 passed 0 failed with `AI_SESSION_CHILD` unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged. The two new scorer cases fail on the previous scorer.
