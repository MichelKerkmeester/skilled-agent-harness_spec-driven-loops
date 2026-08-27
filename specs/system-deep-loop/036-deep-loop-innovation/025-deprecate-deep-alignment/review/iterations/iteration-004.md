# Deep Review — Iteration 004

- **Wave**: A (breadth)
- **Dimension**: Completeness / residue (all three commits)
- **Executor**: conductor grep (the cli-pi pass hung 13 min on the whole-tree sweep and was killed; the executor cannot reliably run whole-tree grep passes — see review-report.md "Method & deviations")
- **Status**: complete (authoritative git-grep, conductor-run)

## Summary

Authoritative residue sweep of the active git-tracked tree (`git grep` for `deep-alignment|deep:alignment|command-benchmark|conformance_benchmark|conformance-benchmark`, excluding changelog / historical reports / this review packet). Confirms the P0 from iteration 003 and finds one additional low-severity doc mention; no other hard-token residue.

## Findings

- **[P0] (same as F5, iteration 003)** The 4 orphaned prompt mirrors are the only hard-token dispatch-surface residue: `.codex/prompts/deep-alignment.md`, `.codex/prompts/deep-command-benchmark.md`, `.pi/prompts/deep-alignment.md`, `.pi/prompts/deep-command-benchmark.md`. Fix via the sync generators.
- **[P2] [SOURCE: .claude/SYNC.md:112]** SYNC.md uses `deep-alignment` as a past-drift example ("`deep-alignment` was missing from agents/README.txt while the agent file existed") — now a stale example since the mode is removed. Explanatory prose, not a dispatch surface.
  - **Fix**: reword the example or drop the specific name.

**Also confirmed** (doc-drift, already recorded as F1-F3 in iteration 001): bare `alignment` remains listed as an active deep-loop mode in `system-deep-loop/README.md`, `SKILL.md`, `ROUTER.md`, `runtime/lib/README.md`, `runtime/lib/mode-contracts/README.md`, and `commands/README.txt` — the `alignment-convergence` backendKind literal and historical changelog refs are correctly NOT residue.

## Delta

| New P0 | 0 (confirms F5) | New P1 | 0 | New P2 | 1 |

Review verdict: FAIL
