# Iteration 007

**Pool:** native-a + native-b (sonnet) · **Focus:** deep-improvement model-benchmark CODE (dispatch-model.cjs + profile-validator.cjs 2nd Set); methodology=historical; 1 contradiction

## Findings (11)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` — KNOWN_EXECUTORS (137-142(141)) → inline-edit — [HARD] remove 'cli-devin' from Set
- `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` — buildSpawnSpec case 'cli-devin' (438-449) → delete-branch — [HARD] DEVIN_BIN/devin spawn; default throw handles residual
- `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` — KNOWN_EXECUTORS (2nd, hand-synced) (39) → inline-edit — [HARD/NEW] second executor Set 'kept in sync by hand'; remove or cli-devin profile passes validation
- `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` — executor loops + cli-devin perm test (49,211-217,224-227,229-235) → delete-branch — active fixtures; remove cli-devin from loops + delete dedicated permission-mode test or tests fail
- `.opencode/skills/deep-improvement/feature_catalog/04--model-benchmark-mode/model-dispatcher.md` — executor lists (26,38) → inline-edit — remove cli-devin from HOW-IT-WORKS + SOURCE FILES; 'five'->'three'
- `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md` — dispatcher entry (293) → inline-edit — remove ', and cli-devin'
- `.opencode/skills/deep-improvement/scripts/model-benchmark/README.md` — diagram + table row (37,73) → inline-edit — 'codex/devin'->'codex'; remove cli-devin table row
- `.opencode/skills/deep-improvement/SKILL.md` — Lane B + §6 methodology (290,310,313) → inline-edit — remove cli-devin from routing map(290); update §6 8+2 split prescription (310) + methodology pointer(313) - keep pattern w/ different breadth executor
- `.opencode/skills/deep-improvement/references/model-benchmark/mixed_executor_methodology.md` — entire doc (1-148) → leave — HISTORICAL methodology write-up (both seats agree); 19 hits are doc not control flow; LEAVE
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md` — role label line 3 (3) → CONTRADICTION — native-a=leave(historical artifact); native-b=edit(live grader, stale 'cli-devin SWE 1.6' label, grading is executor-agnostic). LOW-priority cosmetic; non-breaking. Surface, don't silently resolve.
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-skeptic.md` — role label line 3 (3) → CONTRADICTION — same divergence as system-grader.md

See `../seats/iter-007/` for the full per-seat finding sets.
