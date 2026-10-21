# Live plugin utilization: final results matrix

All runs are from 2026-10-21, 12:07 to 12:27 UTC, in worktree `190-final-two-version-proof` at origin/main `eb0c18f7e9`. They used OpenCode 1.19.3 (`opencode run`) and OpenCode 2.0.32 (`opencode2 run --standalone`), with model `llmgateway/deepseek-v4.1-flash` at the high effort level on both. Every block is the scenario file's own `Exact Command Sequence` under `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/`, run unchanged and one after another.

The verdict for each cell comes from the evidence files: the events stream, the captured system prompt, the plugin's log lines and the state files. It never comes from the model's reply. Each scenario's log is `<plugin>.txt` in this folder. The per-run effect and exit files are in `effects/`. The event and capture files stay in the gitignored `.skilled/skills/.state/plugin-utilization` folder of that worktree.

| Plugin | v1 | v2 | Evidence | What was observed |
|---|---|---|---|---|
| `classifier-injection-screen` | PASS | PASS | `classifier-injection-screen.txt` | After a `webfetch` of a page with an embedded instruction, the next request carries `Jev injection screen: 1 of 1 sections ...` on both versions |
| `cli-dispatch-audit` (guard) | PASS | PASS | `cli-dispatch-audit.txt` | `opencode run --help` is refused with `Dispatch blocked by cli-opencode hard-rule(s)`, through `bash` on v1 and `shell` on v2 |
| `cli-dispatch-audit` (audit log) | PASS | PASS | `cli-dispatch-audit.txt` | A record is appended to `.skilled/logs/cli-dispatch-audit.log` on both versions |
| `codex-hooks-watchdog` | PASS | PASS | `codex-hooks-watchdog.txt` | `codex hook drift detected` is logged at session start on both versions |
| `mcp-route-guard` | PASS | PASS | `mcp-route-guard.txt` | A stub `mobbin` server logs `native call to "mobbin" -- Code Mode can route this family`; v2 reaches the tool through `execute` |
| `opencode-goal` | PASS | PASS | `opencode-goal.txt` | `set` returns `STATUS=OK ACTION=set`, the state folder holds the goal record, and a later request carries `[active_goal:<id>]` |
| `session-cleanup` | PASS | PASS | `session-cleanup.txt` | `[session-cleanup] Startup safety warnings` reaches the prompt on both versions |
| `session-relaunch` | PASS | PASS | `session-relaunch.txt` | With a tiny window, `[session-relaunch] Context is past the configured window` is injected on both versions |
| `sk-code-post-edit-quality` | PASS | PASS | `sk-code-post-edit-quality.txt` | A comment-hygiene finding is logged and the next request carries `[post-edit-quality] Advisory findings` |
| `sk-git-message-gate` | PASS | PASS | `sk-git-message-gate.txt` | `sk-git-message-gate: sk-git blocked this commit message` refuses the commit in a throwaway repository; its HEAD stays `8b2230f5a3` on both versions |
| `sk-git-preflight-advisory` | PASS | PASS | `sk-git-preflight-advisory.txt` | `[add-pathspec-matches-nothing]` is added after a `git add` of a missing path, and nothing is staged |
| `sk-vision` | PASS | PASS | `sk-vision.txt` | `sk_vision_status` returns `provider: photon`; v2 reaches it through `execute` |
| `system-completion-sentinel` | PASS | PASS | `system-completion-sentinel.txt` | A completion claim logs `[completion-evidence-sentinel] claimed done but ...` on `session.idle` |
| `system-deep-loop-guard` | PASS | PASS | `system-deep-loop-guard.txt` | The mode-mismatched dispatch is refused with `Deep Route mode mismatch`, through `task` on v1 and `subagent` on v2 |
| `system-dist-freshness-guard` | PASS | PASS | `system-dist-freshness-guard.txt` | A stale sk-design backend dist puts `[dist-freshness-guard] Local compiled dist is stale` in the prompt and the log on both versions |
| `system-skill-advisor` | PASS | PASS | `system-skill-advisor.txt` | `Advisor: live; ambiguous: sk-git 0.84/0.16 ...` is in the system prompt on both versions |
| `system-spec-gate` | PASS | PASS | `system-spec-gate.txt` | With `SYSTEM_SPEC_GATE_ENFORCE=1` and no child flag, the write is refused with `system-spec-gate: DENIED` |
| `system-speckit-completion` | PASS | PASS | `system-speckit-completion.txt` | The `system_speckit_completion` tool returns the packet's JSON payload on both versions |

**Totals:** OpenCode 1 passes 17 of 17 plugins, and OpenCode 2 passes 17 of 17. No scenario needed a rerun, and every block exited 0 (`summary.txt`).

**Kill switch:** with `SYSTEM_SKILL_ADVISOR_DISABLED=1`, the capture holds 0 `Advisor:` lines on v1 and 0 on v2 (`system-skill-advisor.txt`).

**Shared service:** every v2 run used `--standalone`, and PID 46220 was never stopped, started or attached to.
