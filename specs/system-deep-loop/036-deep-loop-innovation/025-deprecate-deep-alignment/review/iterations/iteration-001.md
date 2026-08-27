# Deep Review — Iteration 001

- **Wave**: A (breadth)
- **Dimension**: Correctness (all three commits)
- **Executor**: cli-pi glm-5.3-flash (read-only)
- **Status**: complete

## Summary

No code-logic P0/P1. The reviewer executed real test suites against the working tree (routing-registry drift-guard 7/7; render/projection/legacy/contract 51/51; YAML parse OK; all 3 compiled-contract digests recomputed fresh) and confirmed the six-mode registry is internally consistent, `buildLineageCommand` has guarded main + cursor/devin/pi adapters with PATH preflight, no dangling imports of deleted modules, and zero Phase-0 gate / `general_agent_verified` residue under `commands/`. The only findings are stale documentation that still presents the removed `alignment` mode as active.

## Findings

- **[P1] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:58]** Hub SKILL.md still documents `alignment` as an active `workflowMode` (also the `alignment: <request>` mode hint at :20 and the runtimeLoopType/`alignment-convergence` backendKind prose at :59-60), contradicting `mode-registry.json` (six modes) and `hub-router.json` (no alignment signal). An operator following the loaded hub instructions routes to a packet that no longer exists.
  - **Fix**: strip alignment from SKILL.md lines ~4, 20, 58-60, 65-68 so the hub instructions match the six-mode registry.
- **[P2] [SOURCE: .opencode/commands/README.txt:45]** Commands index claims 8 deep commands and lists the deleted `alignment.md` (:95); the directory has 6.
  - **Fix**: count → 6, remove the alignment.md tree entry.
- **[P2] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/README.md:12]** Runtime domain READMEs still advertise alignment as a served mode (also `runtime/lib/mode-contracts/README.md:12`).
  - **Fix**: drop "alignment" from both README mode lists.
- **[P2] [SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1496]** The ~90-line single-executor dispatch heredoc is duplicated verbatim 6× across deep-review-auto.yaml (:1496/1587/1678) and deep-research-auto.yaml (:1170/1261/1352); the deleted deep-alignment-auto.yaml removed one of the original copies, leaving a six-copy sync obligation.
  - **Fix**: acceptable for the deterministic branch_on design; note the sync obligation in the command-assets README or collapse to a shared include.

## Delta

| New P0 | 0 | New P1 | 1 | New P2 | 3 |

Review verdict: CONDITIONAL
