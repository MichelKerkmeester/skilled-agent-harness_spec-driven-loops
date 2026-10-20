# Live plugin utilization after the bridge fix: results matrix

Runs on 2026-10-20 in worktree `176-v2-bridge-plugin-effects`, with the bridge at `68fc5fff70` and the runner follow-ups at `598bf4842f`. OpenCode 1.19.3 ran through `opencode run` and OpenCode 2.0.32 through `opencode2 run --standalone`, both on `llmgateway/deepseek-v4.1-flash` at the high effort level. Each scenario's bash block ran unchanged from the playbook with `EVIDENCE_DIR` set to the worktree's gitignored `.skilled/skills/.state/plugin-utilization`. Each `<scenario>.txt` file in this folder holds the block's full output, and `blocks/<scenario>.sh` holds the exact block that ran. The `system-completion-sentinel` and `system-skill-advisor` blocks were rerun after their checks were fixed, from the scenario files committed with this matrix; the `HEAD` line in those two outputs predates that commit. After the first review round, `codex-hooks-watchdog`, `session-cleanup`, `session-relaunch`, `system-deep-loop-guard` and `sk-git-message-gate` were rerun with the bridge's in-flight tracking of a real `session.created` and the commit gate's fatal checks, both committed with that rerun's evidence; their outputs show `HEAD db73b963b3` because the fixes were not yet committed when they ran. `session-relaunch` ran once more after main's session-relaunch hop-history change was merged (`HEAD 6a0c74c9c3`), with the same result. The before column is phase 034's matrix.

| Plugin | v1 | v2 before | v2 now | Evidence | What was observed on v2 |
|---|---|---|---|---|---|
| `classifier-injection-screen` | PASS | PASS | PASS | `classifier-injection-screen.txt` | The `webfetch` result is followed by `Jev injection screen: 1 of 1 sections ...` on both versions |
| `cli-dispatch-audit` (guard) | PASS | FAIL | PASS | `cli-dispatch-audit.txt` | `["shell","error","Dispatch blocked by cli-opencode hard-rule(s) ..."]` |
| `cli-dispatch-audit` (audit log) | PASS | FAIL | PASS | `cli-dispatch-audit.txt` | `.skilled/logs/cli-dispatch-audit.log` gains a record for the v2 session |
| `codex-hooks-watchdog` | PASS | FAIL | PASS | `codex-hooks-watchdog.txt` | `codex hook drift detected` is logged for the v2 run session |
| `mcp-route-guard` | PASS | PASS | PASS | `mcp-route-guard.txt` | `native call to "mobbin" -- Code Mode can route this family` on both |
| `opencode-goal` | PASS | PASS | PASS | `opencode-goal.txt` | `STATUS=OK ACTION=set` through `execute`, one state file holds the canary, and `[active_goal:goal-<uuid>]` reaches a later request |
| `session-cleanup` | PASS | FAIL | PASS | `session-cleanup.txt` | `[session-cleanup] Startup safety warnings:` is in the v2 system prompt |
| `session-relaunch` | PASS | FAIL | PASS | `session-relaunch.txt` | `[session-relaunch] Context is past the configured window` is in the v2 system prompt after the `shell` call |
| `sk-code-post-edit-quality` | PASS | PASS | PASS | `sk-code-post-edit-quality.txt` | A comment-hygiene finding is logged and `[post-edit-quality] Advisory findings` reaches the next request |
| `sk-git-message-gate` | PASS | FAIL | PASS | `sk-git-message-gate.txt` | `["shell","error","sk-git-message-gate: sk-git blocked this commit message ..."]`; the block prints the probe repository's `HEAD` before and after, `8ec23d559c` both times on each version |
| `sk-git-preflight-advisory` | PASS | FAIL | PASS | `sk-git-preflight-advisory.txt` | `[add-pathspec-matches-nothing]` reaches the next v2 request |
| `sk-vision` | PASS | PASS | PASS | `sk-vision.txt` | `sk_vision_status` returns `provider: photon` through `execute` |
| `system-completion-sentinel` | PASS | PASS | PASS | `system-completion-sentinel.txt` | `[completion-evidence-sentinel] claimed done but 4 completed P0/P1 checklist item(s) ... lack an evidence marker` on both |
| `system-deep-loop-guard` | PASS | FAIL | PASS | `system-deep-loop-guard.txt` | `["subagent","error","system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type=\"deep-research\" ..."]` |
| `system-dist-freshness-guard` | PASS | PASS | PASS | `system-dist-freshness-guard.txt`, `shell-legs.txt` | The stale warning is in the system prompt; the log line is now `session.created:` on v2 as on v1, and the shell leg logs `risky-bash:` on both |
| `system-skill-advisor` | PASS | PASS | PASS | `system-skill-advisor.txt` | `Advisor: live; ambiguous: sk-git 0.84/0.16 ...`; with `SYSTEM_SKILL_ADVISOR_DISABLED=1` the count is 0 on both |
| `system-spec-gate` | PASS | PASS | PASS | `system-spec-gate.txt`, `shell-legs.txt` | `["write","error","system-spec-gate: DENIED: ..."]`, the deferral line in the system prompt, and a `would-deny` log line |
| `system-speckit-completion` | PASS | PASS | PASS | `system-speckit-completion.txt` | The tool returns the packet JSON through `execute` |

**Totals.** OpenCode 1: 17 of 17 plugins PASS. OpenCode 2: 17 of 17 PASS, against 10 of 17 in phase 034. Every scenario block exited 0.

**Kill switch.** `SYSTEM_SKILL_ADVISOR_DISABLED=1` removed the `Advisor:` line on both versions: 0 lines with the switch, 2 on v1 and 1 on v2 without it.

## Notes on individual runs

- **`system-spec-gate` on v1.** In the full pass the v1 model asked the documentation question instead of calling `write`, so the denial was not exercised; the deferral line was in its system prompt. A rerun with the same prompt (`shell-legs.txt`, last section) called `write`, which was denied with `system-spec-gate: DENIED`, logged `would-deny`, and left the probe file absent.
- **`system-completion-sentinel` wording.** Phase 034 has closed, so the advisory now reports items without an evidence marker rather than an incomplete P0 count. The scenario's check was widened to `claimed done but` and its expected signals name both wordings.
- **`system-skill-advisor` exit status.** The first pass ended with `grep -c` counting 0 lines, which exits 1 even though 0 is the passing count. The check now records the count and tests it with `[ "$n" -eq 0 ]`, and the rerun exited 0.
- **`system-spec-gate` shell leg.** A shell redirect write (`echo hello > <dir>/probe.txt`) runs unrefused on both versions with the gate enforced (`shell-legs.txt`). The gate's core finds no file path in a shell command, so it allows it. That is the same on v1 and v2 and is not a bridge gap.
- **Fixture paths.** The commit-gate probe ran against a disposable repository whose `skgit.contractDir` points at this checkout's commit rules, so a missed refusal could only have committed there.
