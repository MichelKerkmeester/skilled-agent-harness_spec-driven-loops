# Gate baseline, worktree at 5d9c970447, before phase 003

Captured 2026-10-10 with `scratchpad/gates.sh` and `scratchpad/gates2.sh`. Exit status, then the detail that explains a nonzero one.

| Gate | Exit | Detail |
|------|------|--------|
| runtime-vitest | 0 | 175 files, 2896 passed, 8 skipped, 1448 s |
| advisor-vitest | 1 | 7 failed, 1006 passed, 6 skipped. Failing: cli-parity ten prompts, compiled-route option (2), divergence ratchet (2), 195-prompt corpus parity, graph health |
| bin-vitest | 1 | 1 failed, 45 passed: move simulation cannot resolve hub `cli-classifier` |
| deep-improvement-vitest | 1 | 5 failed (timeouts in `d4-agreement.vitest.ts`), 496 passed. Suite is deleted in phase 005 |
| plugin-guards | 0 | |
| git-hook-tests | 0 | |
| broken-move-drill | 2 | Symlink loop in the drill's temp copy, then an empty pathspec at line 95 |
| mirror-check | 0 | |
| sk-doc-node-tests | 0 | |
| sk-doc-pytests | 0 | 171 passed, 2593 s |
| compiled-route-guard | 0 | |
| runtime-validators | 1 | `check-documentation-drift`: "lane count mismatch: 2"; `verify-authority` exits 2 with `allOnLedger: false` |
| cite-tags-vitest | 0 | 18 passed (run through the `cli` vitest project) |
| runtime-typecheck | 0 | |
| advisor-typecheck | 0 | |
| advisor-pytests | 0 | |
| advisor-regression | 1 | 92/94; both failures are `P0-CHROME-002` |
| router-sync | 0 | |
| leaf-manifest (deep-loop, sk-doc) | 0 | |
| runtime-mirrors doctor and the six generator `--check` runs | 0 | |
| deep-loop compiler load | 0 | |
| activation freshness (deep-loop, sk-doc) | 0 | |
| compiled-route status | 0 | |
| cite-drift node tests | 0 | |
| broken tracked symlinks | 0 | |
