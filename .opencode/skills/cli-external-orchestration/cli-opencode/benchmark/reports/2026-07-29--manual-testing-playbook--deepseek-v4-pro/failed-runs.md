# Failed Runs

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · claude · deepseek-v4-pro + openai/gpt-5.6-luna · headless

No scenario recorded a FAIL verdict across 3 checked behavior(s): 0 PASS, 3 SKIP. Every SKIP is a documented headless-surface limitation (the `mk_goal` tool is not exposed to the default headless `opencode run` agent, and `experimental.chat.system.transform` does not fire in `opencode run --session`), not a model failure and not a regression in packet `032-goal-hooks-cross-runtime`.
