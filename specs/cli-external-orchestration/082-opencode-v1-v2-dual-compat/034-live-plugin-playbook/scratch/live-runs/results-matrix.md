# Live plugin utilization: results matrix

Runs on 2026-10-20 in worktree `174-live-plugin-playbook`, OpenCode 1.19.3 (`opencode run`) and OpenCode 2.0.32 (`opencode2 run --standalone`), model `llmgateway/deepseek-v4.1-flash` at the high effort level on both. Every request went through the capture proxy, so the system prompt each plugin added is in the evidence. Each cell names its evidence file in this folder.

| Plugin | v1 | v2 | Evidence | What was observed |
|---|---|---|---|---|
| `classifier-injection-screen` | PASS | PASS | `injection-screen.v{1,2}.txt` | `webfetch` of a page with an embedded instruction; the next request's system prompt carries `Jev injection screen: 1 of 1 sections ...` on both |
| `cli-dispatch-audit` (guard) | PASS | FAIL | `dispatch-guard.v{1,2}.txt` | v1 refuses `opencode run --help` with `Dispatch blocked by cli-opencode hard-rule(s)`; v2 runs it through the `shell` tool unblocked |
| `cli-dispatch-audit` (audit log) | PASS | FAIL | `dispatch-audit.v{1,2}.txt` | v1 appends a record to `.skilled/logs/cli-dispatch-audit.log`; v2 appends nothing |
| `codex-hooks-watchdog` | PASS | FAIL | `baseline.v{1,2}.txt`, `deep-loop-guard.v2.txt` | v1 logs `codex hook drift detected` on `session.created`; v2 never delivers `session.created` for the `run` session, so nothing is logged. It did fire for the subagent session the deep-loop scenario created |
| `mcp-route-guard` | PASS | PASS | `mcp-route-guard.v{1,2}.txt` | a stub MCP server named `mobbin`; both versions log `native call to "mobbin" -- Code Mode can route this family` |
| `opencode-goal` | PASS | PASS | `opencode-goal.v{1,2}.txt` | `set` returns `STATUS=OK ACTION=set`, the version's own state directory holds one file whose objective is the canary, and a later request carries `[active_goal:<id>]`. On v2 the model reaches the tool through the Code Mode `execute` tool |
| `session-cleanup` | PASS | FAIL | `baseline.v{1,2}.txt` | v1 injects `[session-cleanup] Startup safety warnings` and logs at dispose; v2 logs at dispose only, because the startup guards run on `session.created`, which the `run` session never gets |
| `session-relaunch` | PASS | FAIL | `session-relaunch.v{1,2}.txt` | inside a loop with a tiny window, v1 injects `[session-relaunch] Context is past the configured window`; v2 injects nothing |
| `sk-code-post-edit-quality` | PASS | PASS | `post-edit-quality.v{1,2}.txt` | writing a file whose comment holds `640/480` logs a comment-hygiene finding and the next request carries `[post-edit-quality] Advisory findings` |
| `sk-git-message-gate` | PASS | FAIL | `git-message-gate.v{1,2}.txt` | v1 refuses `git commit -m 'bad'` before it runs (`sk-git-message-gate: sk-git blocked this commit message`); on v2 the command runs and only the git `commit-msg` hook rejects it. HEAD is the same before and after on both (hashes in the evidence files) |
| `sk-git-preflight-advisory` | PASS | FAIL | `git-preflight.v{1,2}.txt` | v1 adds `[add-pathspec-matches-nothing]` to the next request; v2 adds nothing |
| `sk-vision` | PASS | PASS | `sk-vision.v{1,2}.txt` | with `SK_VISION_AUTOINSPECT=1`, `sk_vision_status` returns `provider: photon` on both (through `execute` on v2) |
| `system-completion-sentinel` | PASS | PASS | `completion-sentinel.v{1,2}.txt` | a completion claim for this packet, which the model was asked to repeat as a test fixture, logs `claimed done but only 0/12 P0 checklist item(s) are complete` on `session.idle` |
| `system-deep-loop-guard` | PASS | FAIL | `deep-loop-guard.v{1,2}.txt` | with `SYSTEM_DEEP_LOOP_GUARD_REJECT=1`, v1 refuses the mode-mismatched dispatch; v2 runs the subagent and it answers `OK` |
| `system-dist-freshness-guard` | PASS | PASS | `dist-freshness.v{1,2}.txt` | a stale sk-design backend dist puts `[dist-freshness-guard] Local compiled dist is stale` in the system prompt on both; v1 logs it from `session.created`, v2 from the transform |
| `system-skill-advisor` | PASS | PASS | `skill-advisor.v{1,2}.txt` | `Advisor: live; ambiguous: sk-git 0.84/0.16 ...` in the system prompt on both |
| `system-spec-gate` | PASS | PASS | `spec-gate.v{1,2}.txt` | with `SYSTEM_SPEC_GATE_ENFORCE=1` and no child flag, the write is refused with `system-spec-gate: DENIED` and the deferral line is in the system prompt |
| `system-speckit-completion` | PASS | PASS | `speckit-completion.v{1,2}.txt` | the `system_speckit_completion` tool returns the packet's JSON payload on both |

**Totals.** OpenCode 1: 17 of 17 plugins PASS. OpenCode 2: 10 PASS, 7 FAIL, none NOT-TRIGGERABLE. A FAIL means the scenario's checked effect was missing; `session-cleanup` still logs its dispose step on v2.

**Fixture names.** These runs used per-version fixture names (`pe-probe-v1.js`, `scratch-probe/gate-probe-v1.txt` and so on). The committed scenarios later moved to unique temporary names; the checks are the same.

**Kill switch.** `SYSTEM_SKILL_ADVISOR_DISABLED=1` removes the `Advisor:` line on both versions (`killswitch-skill-advisor.v{1,2}.txt`: 0 lines with the switch, 2 on v1 and 1 on v2 without it).

## Root causes of the OpenCode 2 failures

Every cause below was read from the plugin source and confirmed with a probe plugin that logged each hook call on both versions (`event-probe-summary.txt`).

1. **The shell tool is named `shell` on OpenCode 2, not `bash`.** `lib/v2-bridge.js` passes the v2 tool name through unchanged, and five plugins return early unless the name is `bash`: `cli-dispatch-audit` (both hooks), `sk-git-message-gate`, `sk-git-preflight-advisory`, the `bash` leg of `system-dist-freshness-guard` and the `bash` leg of `system-spec-gate`. The probe saw `before bash {"command":"echo ..."}` on v1 and `before shell {"command":"echo ..."}` on v2, with the same `command` argument.
2. **The subagent tool is named `subagent` on OpenCode 2, and its argument is `agent`.** `system-deep-loop-guard` returns early unless the tool is `task`, and reads `subagent_type`. The v2 call was `subagent {"agent":"deep-research", ...}`.
3. **`opencode2 run` never delivers `session.created` for its own session.** The probe's v2 event list starts at `integration.updated` and goes straight to `session.execution.started`. `codex-hooks-watchdog` and the startup half of `session-cleanup` act only on `session.created`. A session created later, such as a subagent's, does get it.
4. **The bridge's `message.updated` lacks the fields `session-relaunch` needs.** The bridge maps `session.step.ended` to `message.updated` with properties `{ info }` only. `session-relaunch` reads `properties.sessionID`, which is absent, and then `info.time.completed`, which the mapping never sets, so it never records usage and never nudges. v2 also sends no user `message.updated`, so the handoff-seed path cannot fire either.

## Side findings

- `battery-receipt.txt`: CI battery run 39442263433 on 2026-10-20 reported all 17 plugin files `active` on OpenCode 2, and so did a local battery run that day. Registration does not show whether a hook that filters on a tool name or an event ever fires; these live runs do.
- `dist-freshness` (`dist-freshness-unprovisioned.txt`): a stale package with no `node_modules` of its own reports `unprovisioned` rather than `stale`. In a provisioned worktree that covers `system-spec-kit/shared`, `runtime/cli` and `runtime`, so their staleness is silent. This is the same on both versions.
- `advisor-first-run.txt`: the first v1 run of the session showed `Advisor: outage (fail_open)`. Every later run on both versions was `live`.
