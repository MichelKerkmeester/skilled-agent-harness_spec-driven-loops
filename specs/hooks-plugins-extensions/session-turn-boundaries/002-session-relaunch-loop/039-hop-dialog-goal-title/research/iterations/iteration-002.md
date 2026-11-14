# Iteration 2: Packet 039 child 001 — the question dialog after prepare

## Focus

Settle the four open items of child 001 of packet 039: (1) which states leave a pending record that Stop cannot arm, and whether anything besides `cancel` clears it; (2) which other Claude Code dialogs hold a turn open, which of them a PreToolUse hook can see, and whether each can park a prepared hop; (3) what happens when the relaunch record is unreadable or malformed, and which test covers it; (4) whether the Pi, OpenCode and Codex adapters have the same question-tool gap and what guards it today.

## Actions Taken

1. Read the research state (config, state log, strategy) and the Known Limitations of `001-sender-dialog-after-prepare`.
2. Read the Claude guard, Stop arm, `armableRecord`, `readRelaunchFile`, `markDeferred`, `withdraw.cjs`, the UserPromptSubmit nudge, and the `cancel` command.
3. Read the hook-registry session-relaunch bindings and the generated `.claude/settings.json` matcher.
4. Read the Pi, OpenCode and Codex relaunch adapters, the ask-surface runtime/tool table, and the Pi question extension declarations.
5. Fetched the official Claude Code hooks reference for PreToolUse, PermissionRequest, Elicitation and Notification semantics.

## Findings

1. **CONFIRMED — limitation 5 is real, and the guard holds on any readable pending record.** `pendingHandOver` denies the dialog exactly when `armableRecord` reports `reason === 'pending'` [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:65] [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:82] [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:117]. `armableRecord` returns `pending` for any matching record whose `status` is `pending`, before it looks at anything else [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1133]. The recorded limitation matches the code [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:131].

2. **CONFIRMED — the states where Stop leaves a readable record pending.** After a successful read, `armPendingRecord` returns without arming and without changing `status` when `transcript_path` is missing [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:124], when no killer target pid resolves [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:169], and when `arm` throws or returns a non-armed record [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:196]. A read error is a fourth path but leaves the guard fail-open, so it does not produce the refusal [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:101].

3. **CONFIRMED — only the deferred state has an escape besides `cancel`.** The Claude UserPromptSubmit nudge calls `withdrawHandOver` without a pending policy [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:63], so the default `pending: 'deferred'` applies and only a pending record carrying `deferredAt` counts [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26]. `markDeferred` writes that stamp only inside the background-task branch [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:143]. Therefore a prompt clears a background-task deferral, but a record parked by a missing transcript path, a missing target pid, or an arm failure has no `deferredAt` and is cleared only by `cancel`, whose policy is `pending: 'any'` [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:877], or by a later Stop that succeeds. The limitation's own example ("because the Stop was deferred") is the one parked state that already has a way out [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:131].

4. **CONFIRMED — the smallest fix for item 1.** In `armPendingRecord`, call `markDeferred({ loopId, env })` on each post-read path that leaves the record pending (missing transcript, no target pid, arm failure), so the existing prompt-withdraw policy clears every parked state. Widening the nudge to `pending: 'any'` would also withdraw a record prepared moments earlier in the same turn, which `withdraw.cjs` deliberately excludes [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21]. The denial reason should also say a prompt clears a parked hop, matching the background-task notice [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:151].

5. **CONFIRMED — limitation 6 for plan approval.** Claude's PreToolUse matches every built-in tool except `EndConversation`, and `ExitPlanMode` is explicitly one of them; `AskUserQuestion` and `ExitPlanMode` both require user interaction [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. The registry binds the guard to `AskUserQuestion` only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1184], and the sync script only renders events named in the runtime's `eventOrder` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/sync-hook-registrations.cjs:125]. An `ExitPlanMode` approval after `prepare` therefore holds the turn open with no refusal; that it can park the hop is inference from the same turn-holding mechanism, not a live observation [INFERENCE: based on the guard matcher and the documented interaction requirement].

6. **CONFIRMED — a permission prompt is not PreToolUse-visible as a prompt.** PreToolUse runs for every tool call whether or not it needs permission, while PermissionRequest runs only when Claude is about to ask for permission, and PreToolUse cannot refuse the prompt without refusing the tool call itself [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. PermissionRequest can deny through its own decision object, but exit code 2 is not honored there [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. The Claude `eventOrder` has no `PermissionRequest`, so no such binding can render today [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9]. Only Devin has a PermissionRequest binding in the registry [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917].

7. **CONFIRMED — the remaining hold-open surfaces are separate events.** MCP elicitation is visible only through `Elicitation`, which can decline on exit 2 or through its action field, not through PreToolUse [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. `Notification` exposes `permission_prompt` and `agent_needs_input` types but is observational and cannot end a turn [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. `EndConversation` skips PreToolUse but ends the conversation rather than holding it open, so it is not a hop-park [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]. None of these is bound to the guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1180].

8. **CONFIRMED — smallest fix for item 2, in two sizes.** The one-line increment is to accept `ExitPlanMode` in `pendingHandOver` [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:25] and change the matcher to `AskUserQuestion|ExitPlanMode` (the exact-string matcher supports `|`) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1184]. Covering permission prompts needs a second increment: add `PermissionRequest` to the Claude `eventOrder`, bind the guard, and branch its output to the PermissionRequest decision shape, because the envelope differs per event [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9]. Elicitation is a third binding. The denial wording for plan approval must say to end the turn and put the plan in the note, not to re-plan.

9. **CONFIRMED — an unreadable record fails open in the guard and silently kills the hop in Stop.** `readRelaunchFile` catches a JSON syntax error, logs `corrupt-relaunch-file`, and returns null [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1265]. The guard turns that null (and any thrown read) into `no-record`, so the dialog is allowed [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:74]. Stop reads null and returns without arming [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:101]. The dialog works and the prepared hop is dead; the only trace is the log line. The core read is tested [SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1011], but no guard or Stop test asserts the paired behavior, so limitation 3's "no test" is still true for this path [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:129].

10. **CONFIRMED by reading — a parseable but structurally malformed record is treated as pending.** `armableRecord` checks only `loopId`, `sessionId`, `runtime` and `status` before returning `pending` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1125]. A record with those fields and no `handoff` is denied with `undefined` interpolated into the note path [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:89], and `armLocked` spreads it into an armed record without validating `handoff` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1046]. This is worse than invalid JSON: the hop can arm with no note. No test feeds a shape-invalid record to the guard or Stop.

11. **CONFIRMED — smallest fix for item 3.** Validate the record shape once in `readRelaunchFile` (non-empty `handoff`, `loopId`, `sessionId`, known `status`) and treat a shape failure like corrupt JSON: log `corrupt-relaunch-file` and return null. That makes the guard fail open with a log line instead of denying on `undefined`, and makes Stop refuse rather than arm a note-less hop. A guard test writes `{invalid` and a shape-invalid pending object to `relaunchFilePath(LOOP_ID, sandbox.env)` and asserts a silent allow; a Stop test asserts no arm and the log line. Both belong beside the existing question cases in `subagent-guard.test.cjs` and the Stop cases in `claude-adapters.test.cjs`.

12. **CONFIRMED — Pi, OpenCode and Codex all have a question tool, and none is guarded.** The shared ask-surface table records Codex `request_user_input`, OpenCode `question`, and Pi `ask_user_question`/`question` [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:24]. Pi's tool comes from the installed `@juicesharp/rpiv-ask-user-question` package [SOURCE: .pi/PLUGINS.md:16], and Pi's context gates whether a session may ask at all on `hasUI` [SOURCE: .pi/types/pi-coding-agent.d.ts:34]. The arm events are Stop for Codex [SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:89], `session.idle` for OpenCode [SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:496], and `agent_settled` for Pi [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:606]; a question that blocks the turn keeps those events from firing, so the exposure class is the same. Today nothing in the relaunch path guards the tool: the Codex bindings are UserPromptSubmit, PostToolUse and Stop only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1191], Pi registers only message_end, before_agent_start, agent_end, agent_settled, agent_start and session_compact [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:505], and the OpenCode plugin handles only session.idle, message.updated, message.part.updated, session.compacted and session.deleted [SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:404]. The ask-surface guard is a different concern: it sends prose menus back through the question tool and cannot block Pi's end-of-run events [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4].

13. **CONFIRMED — their user-message withdrawal takes only an armed record.** Codex, OpenCode and Pi all call `withdrawHandOver` with `pending: 'none'` [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:67] [SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:290] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:643], so answering the question does not clear a still-pending record. Answering lets the run end, and the arm event then fires. The failure window is an unanswered question at the context limit, the same window the Claude guard closes.

14. **Smallest fix per runtime for item 4 (recommendation).** Codex already has a PreToolUse event in its `eventOrder` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:24], so a `request_user_input` matcher can reuse the same pending check with no new event support. OpenCode needs a `tool.execute.before` hook in the plugin module, which today registers no tool hook [SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:404]. Pi needs a `tool_call` handler in the extension; the registry records that Pi's `tool_call` event already carries a decision [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:930]. The exact blocking semantics of each runtime's question tool were not observed live this iteration, per the no-runtime constraint.

## Questions Answered

None of the five strategy questions is fully answered. This iteration closes the four child-001 items of key question 2; the child-002 and child-003 items of that question remain.

## Questions Remaining

- Packet 039 residual gaps (children 002 and 003): a goal cleared by hand that comes back, a stale parent goal that is picked, a title ending in the hop number, the cost of one more log search.
- Packet 038 limits by child (001 to 017).
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal binding inside 4,000 characters, phase 033 Draft, the sk-git `Commit-Id` rebase claim.
- Live proof and ranking: which fixes lack a live hop, the smallest live-run set, and the impact-versus-cost ranking.

## Ruled Out

- **Treating the deferred example as the worst stuck state.** It is the one that a prompt already clears; the missing-transcript, missing-target-pid and arm-failure states are the ones with no prompt escape [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26].
- **Widening the Claude prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared, which the withdrawal policy deliberately refuses [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21].
- **A Claude PermissionRequest binding as today's smallest fix.** The registry's Claude `eventOrder` cannot render it without a new event entry, and the guard's envelope shape is event-specific [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9].
- **Reusing the ask-surface guard as the multi-runtime hop guard.** It is a re-prompt mechanism for prose menus, not a refusal for pending hand-overs [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4].

## Dead Ends

- No Claude `PermissionRequest` binding exists anywhere in the repository to copy; the only one is Devin's [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917].
- No adapter-level question guard exists for Pi, OpenCode or Codex to extend; each needs a new host hook.

## Edge Cases

- **Ambiguous input:** none. The dispatch named the four items and the packet.
- **Contradictory evidence:** the recorded limitation says the stuck state arises "for example because the Stop was deferred", but the deferred state is the one with a prompt escape. Both statements are true; the recorded example is the least severe instance. Recorded here rather than resolved silently.
- **Missing dependency:** none. The official Claude hooks reference was reachable.
- **Partial success:** all four items are settled at code level. The live blocking behavior of the Pi/OpenCode/Codex question tools is UNCONFIRMED because no runtime session was started, as the constraints require.

## Sources Consulted

- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md
- .skilled/hooks/session-relaunch/claude/subagent-guard.mjs
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs
- .skilled/hooks/session-relaunch/claude/context-nudge.mjs
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
- .skilled/hooks/session-relaunch/lib/withdraw.cjs
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts
- .skilled/hooks/session-relaunch/opencode/session-relaunch.js
- .skilled/hooks/session-relaunch/codex/stop-arm.mjs and shared.mjs
- .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs and pi/ask-surface-guard.ts
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json
- .skilled/skills/system-spec-kit/runtime/cli/sync-hook-registrations.cjs
- .pi/settings.json, .pi/PLUGINS.md, .pi/types/pi-coding-agent.d.ts
- https://docs.claude.com/en/docs/claude-code/hooks

## Assessment

- New information ratio: 0.83
- Questions addressed: the four child-001 items of key question 2 (Stop failure states and escapes, other hold-open dialogs and hook visibility, unreadable/malformed records, Pi/OpenCode/Codex question tools and guards)
- Questions answered: none of the five strategy questions in full

## Reflection

- What worked and why: reading the arm path and the withdraw path together showed that the recorded limitation conflates two states; the prompt escape exists only for the deferred one. The runtime question-tool table in the ask-surface core gave the Pi/OpenCode/Codex inventory without starting a runtime.
- What did not work and why: the official hooks page is large and was truncated on fetch; grepping the saved output for the specific event names was needed to extract the deciding lines.
- What I would do differently: read the guard and Stop arm before the limitation text, so the limitation is checked against state transitions rather than against its own wording.

## Next Focus

Packet 039 children 002 and 003: the goal cleared by hand that comes back two hops later, the stale parent goal that can be picked, the title ending in the hop number, and the cost of one more log search per hop. That is item 3 of the plan in section 12 of the strategy file.
