# Skill Benchmark Report -- cli-opencode

_Derived after the fact from this run's stored record, not written at run time._

> Manual-testing-playbook validation, not a Lane C D1-D5 skill-benchmark run. Scoring: `not-applicable-manual-outcome` · trace mode: `live`.

**Verdict: FAIL**

## Run

| Field | Value |
|---|---|
| Target skill | cli-opencode |
| Executor | opencode |
| Model | llmgateway/deepseek-v4.1-flash, high effort |
| Scenarios | 34 (17 plugins on two OpenCode versions) |
| Outcome tally | 27 PASS, 7 FAIL |

## Results

| Scenario | Plugin | OpenCode | Verdict | Reason |
|---|---|---|---|---|
| `CO-040-V1` | `classifier-injection-screen` | 1.19.3 | PASS | next request carries the Jev injection screen advisory |
| `CO-040-V2` | `classifier-injection-screen` | 2.0.32 | PASS | next request carries the Jev injection screen advisory |
| `CO-041-V1` | `cli-dispatch-audit` | 1.19.3 | PASS | refused opencode run --help by hard rule and appended an audit record |
| `CO-041-V2` | `cli-dispatch-audit` | 2.0.32 | FAIL | the shell tool is named shell on OpenCode 2; the command ran unblocked and no audit record was written |
| `CO-042-V1` | `codex-hooks-watchdog` | 1.19.3 | PASS | logged codex hook drift detected on session.created |
| `CO-042-V2` | `codex-hooks-watchdog` | 2.0.32 | FAIL | opencode2 run delivers no session.created for its own session; nothing logged |
| `CO-043-V1` | `mcp-route-guard` | 1.19.3 | PASS | logged a Code Mode route advisory for the native mobbin call |
| `CO-043-V2` | `mcp-route-guard` | 2.0.32 | PASS | logged a Code Mode route advisory for the native mobbin call |
| `CO-044-V1` | `opencode-goal` | 1.19.3 | PASS | set returned STATUS=OK, the state file holds the canary objective, [active_goal] injected |
| `CO-044-V2` | `opencode-goal` | 2.0.32 | PASS | same, with the tools reached through execute |
| `CO-045-V1` | `session-cleanup` | 1.19.3 | PASS | startup warnings injected and dispose logged |
| `CO-045-V2` | `session-cleanup` | 2.0.32 | FAIL | startup guards never run because the run session gets no session.created; dispose still logs |
| `CO-046-V1` | `session-relaunch` | 1.19.3 | PASS | handoff nudge injected past the configured window |
| `CO-046-V2` | `session-relaunch` | 2.0.32 | FAIL | bridged message.updated has no properties.sessionID or info.time.completed, so usage is never recorded |
| `CO-047-V1` | `sk-code-post-edit-quality` | 1.19.3 | PASS | comment-hygiene finding logged and injected |
| `CO-047-V2` | `sk-code-post-edit-quality` | 2.0.32 | PASS | comment-hygiene finding logged and injected |
| `CO-048-V1` | `sk-git-message-gate` | 1.19.3 | PASS | refused the off-template commit before git ran; HEAD unchanged |
| `CO-048-V2` | `sk-git-message-gate` | 2.0.32 | FAIL | the shell tool is named shell; only the git commit-msg hook refused; HEAD unchanged |
| `CO-049-V1` | `sk-git-preflight-advisory` | 1.19.3 | PASS | add-pathspec-matches-nothing advisory injected |
| `CO-049-V2` | `sk-git-preflight-advisory` | 2.0.32 | FAIL | the shell tool is named shell; no advisory |
| `CO-050-V1` | `sk-vision` | 1.19.3 | PASS | sk_vision_status returned provider photon |
| `CO-050-V2` | `sk-vision` | 2.0.32 | PASS | sk_vision_status returned provider photon through execute |
| `CO-051-V1` | `system-completion-sentinel` | 1.19.3 | PASS | advisory logged for the repeated completion claim |
| `CO-051-V2` | `system-completion-sentinel` | 2.0.32 | PASS | advisory logged for the repeated completion claim |
| `CO-052-V1` | `system-deep-loop-guard` | 1.19.3 | PASS | refused the mode-mismatched deep-research dispatch |
| `CO-052-V2` | `system-deep-loop-guard` | 2.0.32 | FAIL | the subagent tool is named subagent with argument agent; the guard never ran |
| `CO-053-V1` | `system-dist-freshness-guard` | 1.19.3 | PASS | stale-dist warning injected and logged |
| `CO-053-V2` | `system-dist-freshness-guard` | 2.0.32 | PASS | stale-dist warning injected and logged from the transform |
| `CO-054-V1` | `system-skill-advisor` | 1.19.3 | PASS | Advisor live brief injected; kill switch removes it |
| `CO-054-V2` | `system-skill-advisor` | 2.0.32 | PASS | Advisor live brief injected; kill switch removes it |
| `CO-055-V1` | `system-spec-gate` | 1.19.3 | PASS | write refused with system-spec-gate DENIED and the deferral injected |
| `CO-055-V2` | `system-spec-gate` | 2.0.32 | PASS | write refused with system-spec-gate DENIED and the deferral injected |
| `CO-056-V1` | `system-speckit-completion` | 1.19.3 | PASS | tool returned the packet JSON |
| `CO-056-V2` | `system-speckit-completion` | 2.0.32 | PASS | tool returned the packet JSON through execute |
