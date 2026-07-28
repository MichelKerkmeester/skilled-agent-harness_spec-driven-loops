---
title: "eval-rig/scripts: rig-level dry-run gate, cache repair and iteration sanity gate"
description: "Orchestration scripts that validate the eval-rig without live dispatches, rebuild the cache index and gate iteration 1 for human review."
---

# eval-rig/scripts

---

## 1. OVERVIEW

`scripts/` holds the eval-rig's own operational scripts, distinct from the per-fixture scoring checks in `deterministic/`. It covers offline validation of the whole rig, cache-index recovery and the manual approve/reject gate the eval loop calls after its first iteration.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `dry-run.cjs` | Rig validation gate with no live model dispatches. Runs four subtests (cache concurrency, all four deterministic checks against canned outputs, the grader's `parseGraderResponse` on mocked shapes and cache-index reconstruction) and exits 0 only if all pass |
| `cache-reconstruct.cjs` | Rebuilds `cache/<kind>/index.jsonl` from the `.out.md` blob files when the index is corrupted or missing, for `det` and/or `grader` cache kinds |
| `iter1-sanity-gate.cjs` | Manual sanity-review gate invoked after iteration 1 completes, so the loop cannot auto-converge on a buggy first iteration before an operator confirms it. Can be skipped with `EVAL_LOOP_SKIP_ITER1_REVIEW=true` |
| `deterministic/` | The four deterministic per-fixture scoring checks, documented in its own README |
| `dry-run-fixtures/` | Canned SWE-output fixtures (`passing.canned.md`, `failing.canned.md`, `parse-error.canned.md`) that `dry-run.cjs` feeds through the deterministic checks and grader stub |

## 3. VALIDATION

```bash
node scripts/dry-run.cjs --full
```

Runs from `eval-rig/`. Exits 0 only when the cache, deterministic-check, grader-stub and cache-reconstruct subtests all pass. Use `--test-cache`, `--test-deterministic`, `--test-grader-stub` or `--test-cache-reconstruct` to run a single subtest.

## 4. RELATED

- [`SKILL.md`](../../../../SKILL.md)
- [`deterministic/README.md`](deterministic/README.md)
- [`../lib/README.md`](../lib/README.md)
