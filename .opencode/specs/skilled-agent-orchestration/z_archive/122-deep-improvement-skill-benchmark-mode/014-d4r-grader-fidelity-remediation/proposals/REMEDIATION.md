# gpt-5.5-fast (high) Remediation Report

_Source: cli-opencode dispatch into wt/0007-d4r-remediation, applying all 28 deep-review findings. Verbatim model output below; verified by the operator + full suite 358/358 + drift 4/4 on main._

---

Applied all 28 findings. No deferred items.

**Findings**
| # | Finding | Status |
|---:|---|---|
| 1 | `harness.cjs` compose prompt dimension-aware | FIXED |
| 2 | `harness.cjs` fenced fallback validates/stamps `dim_id` | FIXED |
| 3 | `harness.cjs` regex fallback validates/stamps `dim_id` | FIXED |
| 4 | `harness.cjs` score-only fallback uses threaded `dimId` | FIXED |
| 5 | `harness.cjs` callers thread D4/D4-R dimension | FIXED |
| 6 | `harness.cjs` real dispatch uses verified `--append-system-prompt` | FIXED |
| 7 | `live-executor.cjs` graded response cap raised/named | FIXED |
| 8 | `live-executor.cjs` missing model defaults to `DEFAULT_MODEL` | FIXED |
| 9 | `live-executor.cjs` nested brace routing JSON parsing | FIXED |
| 10 | `dispatch-model.cjs` resume hint shell-quotes paths | FIXED |
| 11 | `dispatch-model.cjs` malformed config warns, missing stays silent | FIXED |
| 12 | `score-model-variant.cjs` permissive criteria exec warning/WHY | FIXED |
| 13 | `score-skill-benchmark.cjs` `scoreScenario` helper extraction | FIXED |
| 14 | `score-skill-benchmark.cjs` D1/cap magic numbers named | FIXED |
| 15 | `score-skill-benchmark.cjs` mode-A scoring aligned to `WEIGHTS` | FIXED |
| 16 | `score-skill-benchmark.cjs` D3 `wastedCount` semantics clarified | FIXED |
| 17 | `d4-ablation.cjs` shared grader-base builder | FIXED |
| 18 | `sweep-benchmark.cjs` shared event-stream parser reuse | FIXED |
| 19 | `SKILL.md` smart-router `SKILL_BENCHMARK` runtime assets branch | FIXED |
| 20 | `SKILL.md` missing script list entries | FIXED |
| 21 | `README.md` references count/table | FIXED |
| 22 | `README.md` scripts table | FIXED |
| 23 | `README.md` structure block | FIXED |
| 24 | `README.md` trigger phrases synced to `SKILL.md` | FIXED |
| 25 | `scoring_contract.md` funnel stages completed | FIXED |
| 26 | `scoring_contract.md` `advisorySignals` documented | FIXED |
| 27 | `changelog/v1.11.0.0.md` `DEFAULT_D4R_SCENARIOS` traceability | FIXED |
| 28 | Docs/code consistency across Lane C D4-R additions | FIXED |

**Files I Modified**
| File |
|---|
| `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs` |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs` |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` |
| `.opencode/skills/deep-improvement/SKILL.md` |
| `.opencode/skills/deep-improvement/README.md` |
| `.opencode/skills/deep-improvement/references/skill-benchmark/scoring_contract.md` |
| `.opencode/skills/deep-improvement/changelog/v1.11.0.0.md` |

**Syntax Checks**
| File | Command | Result |
|---|---|---|
| `harness.cjs` | `node --check .../harness.cjs` | PASS, no output |
| `live-executor.cjs` | `node --check .../live-executor.cjs` | PASS, no output |
| `dispatch-model.cjs` | `node --check .../dispatch-model.cjs` | PASS, no output |
| `score-model-variant.cjs` | `node --check .../score-model-variant.cjs` | PASS, no output |
| `score-skill-benchmark.cjs` | `node --check .../score-skill-benchmark.cjs` | PASS, no output |
| `d4-ablation.cjs` | `node --check .../d4-ablation.cjs` | PASS, no output |
| `sweep-benchmark.cjs` | `node --check .../sweep-benchmark.cjs` | PASS, no output |

**Behavior Preservation**
| File | Reasoning |
|---|---|
| `score-skill-benchmark.cjs` | Extracted helpers preserve the same formulas, branch order, return keys, weighted normalization, and live-evidence trimming. Constants use the same numeric values: `0.4`, `0.6`, `0.25`. |
| `d4-ablation.cjs` | Shared builder only centralizes the duplicated option object; D4 still uses `live`, D4-R still uses `live-d4r` and the task-outcome prompt path. |
| `sweep-benchmark.cjs` | `extractAssistantText` now delegates to the already-exported dispatcher stream parser. Malformed stream still returns `null`; event stream with no text still returns `''`, preserving the existing `|| stdout` fallback. |

**Boundary / Banned Ops**
Touched only the 11 allowed files listed above. `git diff --name-only` also shows existing `.opencode/package.json` and `.opencode/package-lock.json` diffs in the worktree; I did not edit them.

Ran no banned operations: no install commands, no package/lockfile edits, no git add/commit/push/checkout/reset, no deletes, no moves/renames, and no spec/test-fixture writes.