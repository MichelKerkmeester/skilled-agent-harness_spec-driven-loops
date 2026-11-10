# Live-run evidence, 2026-11-03 (orchestrator ran every run)

Runner: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs from the main checkout,
--repo-root ~/worktrees/public/313-detached-runner-sandbox-live-runs (detached at 4c3222d5b9 = main HEAD).
Run environment fix before round 1: the worktree held committed files only, so every gitignored build output (26 dist/ and
node_modules/ directories, 2.2G) was copied in from the main checkout. Without them every hook was missing and guards
correctly reported SKIP ("fixtures are missing"). Nothing was installed or rebuilt.
Pass rule: every turn PASS, repo.changed false, cleanup ok (sessions, socket, process group and children gone).

## Final results (all PASS)
| scenario folder | runtime | verdict | turns | repo.changed | cleanup.ok | finished (UTC) |
|---|---|---|---|---|---|---|
| cli-hooks-and-plugin__goal-opencode-plugin-conversation | opencode | PASS | bind-goal:PASS, later-task:PASS | false | true | 2026-11-03T06:52:36.027Z |
| goal-hook__goal-hook-conversation | devin | PASS | read-active-goal:PASS, later-task:PASS | false | true | 2026-11-03T06:50:55.675Z |
| goal-hook__goal-hook-conversation | opencode | PASS | bind-goal:PASS, read-active-goal:PASS | false | true | 2026-11-03T06:50:42.800Z |
| goal-hook__goal-hook-conversation | pi | PASS | bind-goal:PASS, later-task:PASS, restart:PASS, post-restart-task:PASS | false | true | 2026-11-03T06:50:42.796Z |
| hook-extension-layer__session-lifecycle-bridges-conversation | pi | PASS | marker-seed:PASS, compact:PASS, marker-recall:PASS | false | true | 2026-11-03T06:52:36.026Z |
| plugin-utilization__session-relaunch | opencode | PASS | seed-context:PASS, read-later-nudge:PASS | false | true | 2026-11-03T06:59:49.439Z |
| plugins-and-hooks__cli-dispatch-preflight-authorization-conversation | pi | PASS | deny-unnamed-executor:PASS, allow-named-executor:PASS | false | true | 2026-11-03T06:58:30.084Z |
| session-continuity__continue-last-session-conversation | opencode | PASS | plant-phrase:PASS, follow-up:PASS | false | true | 2026-11-03T06:31:35.609Z |
| session-continuity__resume-by-session-id-conversation | opencode | PASS | plant-phrase:PASS, restart-session:PASS, recall-phrase:PASS | false | true | 2026-11-03T06:32:37.609Z |
| session-continuity__resume-continue-conversation | devin | PASS | plant-fact:PASS, restart-session:PASS, recall-fact:PASS | false | true | 2026-11-03T06:32:13.930Z |
| session-continuity__session-resume-fork-conversation | codex | PASS | plant-marker:PASS, restart-session:PASS, recall-marker:PASS | false | true | 2026-11-03T06:29:51.384Z |

## Rounds and fixes (scenario bugs fixed in the scenario file; no skill code changed)
- CO-046 session-relaunch.md (002-cli-opencode). Round 1 FAIL: send asked for "a handoff note"; the nudge was injected but is an instruction, so the subject said NONE. Fix 1 (Luna): send now asks to quote any system-context line starting with [session-relaunch]. Round 2 FAIL: OpenCode markdown dropped the brackets. Fix 2: check accepts the line with or without brackets. Round 3 FAIL: OpenCode keeps only the final frame, the echoed-send anchor had scrolled away. Fix 3: check greps the whole final screen (the send has no "Context is"). Round 4 PASS.
- CO-059 cli-opencode goal-hook-conversation.md (002-cli-opencode). Round 1 FAIL: bind tool output gone from the final frame although the goal was bound. Fix (Luna): bind proven from goal state JSON (status active, packetPath, boundAtMs). Round 2 PASS.
- CL-008 goal-opencode-plugin-conversation.md (014-system-skill-advisor). Same cause and fix as CO-059. Round 2 PASS.
- PI-024 cli-pi goal-hook-conversation.md (001-cli-pi). Round 1 FAIL: anchor scrolled out of screen.txt; state passed. Fix (Luna): task checks read history.txt. Round 2 PASS.
- PI-023 session-lifecycle-bridges-conversation.md (001-cli-pi). Round 1 FAIL: "Compaction failed: Nothing to compact (session too small)" (Pi keeps compaction.keepRecentTokens=20000). Fix (Luna): setup merges {"compaction":{"keepRecentTokens":200}} into ./.pi/settings.json. Round 2 PASS.
- DV-024 cli-devin goal-hook-conversation.md (017-cli-devin). Round 1 FAIL: subject correctly closed the goal after returning the marker; record archived with status complete. Fix (Luna): check searches .goal-state recursively and accepts active or complete. Round 2 PASS.
- CE-P05 cli-dispatch-preflight-authorization-conversation.md (013-cli-external-orchestration). Round 1 FAIL: send carried 2>&1, which the Pi preflight tokenizer treats as unsupported, so the named dispatch was denied as ambiguous. Fix (Luna): 2>&1 removed from sends, first-turn check requires the missing-executor denial, prose explains fd-duplication. Round 2 FAIL: UNEXPECTED_QUESTION, the subject asked how to proceed. Fix 2: optional answer selecting "Drop". Round 3 PASS.
- CO-057, CO-058, DV-023, CX-030: PASS in round 1.

## Findings recorded, not fixed here
- Skill bug: cli-codex/SKILL.md:180 rule 6 recommends `codex exec "$PROMPT" > "$LOG" 2>&1 </dev/null &`, but the Pi dispatch preflight (.skilled/hooks/dispatch/lib/dispatch-audit.mjs tokenizer, "<" or ">" followed by "&") marks any fd-duplication redirect unsupported and denies that dispatch as ambiguous.
- Runner gap (phase 018): OpenCode is a full-screen TUI that redraws in place, so `capture-pane -S -` yields only the final frame; history.txt gives no scrollback for OpenCode. Checks must use state files or the final frame.
- Deferred: all 15 claude-code scenarios. The subject's status line showed the account at 82% of its weekly limit; operator chose "Defer all Claude runs" (2026-11-03). A round-0 smoke of SD-008 is void (it ran before the build-output fix).
