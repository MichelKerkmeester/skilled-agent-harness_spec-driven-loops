# Findings And Recommendations

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · claude · deepseek-v4-pro + openai/gpt-5.6-luna · headless

No FAIL verdicts were recorded across 3 checked behavior(s) (0 PASS, 3 SKIP), so this run yields no remediation findings against packet `032-goal-hooks-cross-runtime`. It does carry one structural finding, tracked as an out-of-scope follow-up by packet `034-goal-hook-playbooks-and-validation`.

## 1. Headless `opencode run` cannot exercise mk-goal's live injection path

- **Behaviors**: `CO-039-HEADLESS-TOOL-DEEPSEEK`, `CO-039-HEADLESS-TOOL-LUNA`, `CO-039-HEADLESS-TRANSFORM-DEEPSEEK`
- **Observation, structural cause 1**: the `mk_goal` / `mk_goal_status` tools are not exposed to the default headless-run agent. `deepseek-v4-pro` replied verbatim "The `mk_goal` tool is not available in my tool set. I cannot call tools that don't exist." (zero tool calls made); `openai/gpt-5.6-luna` referenced `mk_goal` but never executed a `set` (no goal persisted).
- **Observation, structural cause 2**: `experimental.chat.system.transform` does not fire in `opencode run --session`, even against a pre-seeded ACTIVE `mk-goal` state file matching the shipped schema exactly (canary `GOALCANARY-CO-1010816640`); a resumed-session turn 2 asking "what is my active goal?" showed zero `[active_goal]` occurrences and the model reported none.
- **Recorded as**: SKIP, not FAIL, for all three rows -- both causes are a headless-run-surface limitation, independent of model quality, and orthogonal to packet `032-goal-hooks-cross-runtime` (mk-goal is a separate, pre-existing system from the cross-runtime hooks under `.opencode/hooks/goal/`, which ARE live-validatable headless -- see the sibling `cli-pi` report).
- **Recommendation**: building headless `mk_goal` tool exposure for `opencode run` is out of scope for packet `034-goal-hook-playbooks-and-validation` and is tracked as a finding for a future packet. Until then, a live proof of mk-goal's injection path requires an interactive OpenCode TUI or `serve` session; `mk-goal`'s `setGoal` / injection / lifecycle / supervisor behavior remains covered by its 7 committed unit suites (`.opencode/plugins/tests/mk-goal-*.test.cjs`).
