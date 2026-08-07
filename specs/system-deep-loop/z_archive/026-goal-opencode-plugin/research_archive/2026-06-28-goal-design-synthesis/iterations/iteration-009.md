# Iteration 9: G9 Completion Detection Decision

## Focus

G9: how `.opencode/plugins/mk-goal.js` should decide that an active `/goal` is complete: model self-report, verifiable shell gate, or supervisor model.

## Actions Taken

- Re-read the current deep-research strategy and state log before writing. The prompt asks for iteration 9, but the local state log currently contains iterations 1-7 and `iteration-008.md` / `iter-008.jsonl` are absent; I used the prompt's iteration-009 output paths and did not append to the shared state log.
- Re-read G2 and G7 to avoid reopening decisions already made: Claude-like behavior needs an independent verifier, and the state store is per-session flat JSON.
- Queried Codex's live `thread_goals` schema to confirm `complete`, `blocked`, `usage_limited`, and `budget_limited` are first-class statuses in the model we are porting.
- Read the vendored OpenHuman `thread_goals` runtime, continuation, tools, and UI files to separate active-goal steering, manual/model completion tools, budget gates, and continuation prompts.
- Re-read `.opencode/plugins/mk-spec-memory.js` for the exact OpenCode plugin seams that `mk-goal.js` can reuse: event hook, system transform, and plugin tools.

## Findings

### Finding 1: Automatic completion should be verifier-owned, not trusted assistant prose.

Evidence: Prior G2 found Claude completion detection is Stop-hook verifier driven: its binary-string evidence showed `active_goal`, `goal_met`, `impossible`, and an internal event emitted when the `/goal` Stop hook reports met or not-yet-met; G2 translated that to an OpenCode idle verifier that returns `met`, `not_met`, or `impossible` [SOURCE: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md:24]. The vendored OpenHuman active-goal block only tells the model to call `goal_complete` when evidence confirms completion [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:91], and its model-facing tool repeats that `goal_complete` should only be called when concrete evidence confirms the objective [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/tools.rs:169].

OUR target: `.opencode/plugins/mk-goal.js` should treat normal assistant text and any model-visible completion call as a `completionCandidate`, then run `verifyGoalCompletion(sessionID, goal, evidence)` before changing automatic state to `complete`.

Decision: Use a supervisor verifier as the authoritative automatic completion detector. The verifier returns strict JSON with `verdict: "met" | "not_met" | "blocked"`, `confidence`, `reason`, and `evidence`. Only `met` transitions to `complete`; `not_met` updates `lastReason` and permits continuation; `blocked` transitions to `blocked` with the verifier reason.

Risk: A verifier can false-positive on weak evidence. The verifier prompt must require concrete evidence and default to `not_met` when evidence is absent, ambiguous, or only based on the assistant's claim.

### Finding 2: Shell gates are evidence adapters, not the universal completion detector.

Evidence: Codex's live schema has durable status fields and usage/budget counters, but no column for a universal completion command; it models lifecycle outcome rather than a single verifier mechanism (sqlite output: `status CHECK(active|paused|blocked|usage_limited|budget_limited|complete)`, `token_budget`, `tokens_used`, `time_used_seconds`). OpenHuman's runtime includes a concrete shell-like stop hook only for budget enforcement: `GoalBudgetStopHook` stops when projected usage crosses the configured budget [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:207]. Its continuation prompt still asks the agent to assess progress against evidence, not to run a hardcoded command [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs:147].

OUR target: `.opencode/plugins/mk-goal.js` should support an optional `verification.gate` record in `.opencode/skills/.goal-state/<hex(sessionID)>.json` later, but should not infer shell commands from the objective text. Any shell output should be passed into the supervisor as evidence.

Decision: Do not make shell exit status the default detector. If an explicit gate is configured in a later command/API surface, run it with a timeout and store `lastGateExitCode`, `lastGateOutput`, and `lastGateAtMs`; passing gate output can support `met`, failing gate output usually supports `not_met` or `blocked`, but the supervisor remains the final automatic judge unless the user explicitly invokes `/goal complete`.

Risk: Running arbitrary commands from a user-authored goal would be a command-injection footgun. The v1 command contract should not auto-extract commands from natural language; explicit gate configuration needs a separate safety design.

### Finding 3: `/goal complete` is the manual override; automatic completion needs compare-and-set guards.

Evidence: The OpenHuman type comments make ownership asymmetric: the model may create/replace a goal and mark it complete, while pause and budget-limited are system-driven [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:15]. The tool implementation exposes `goal_complete` as a write tool and emits an update event after marking the goal complete [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/tools.rs:180]. The store already guards stale writes by comparing `expected_goal_id` before accounting usage, so in-flight work from a replaced goal cannot mutate the new goal [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:401].

OUR target: `.opencode/commands/goal.md` should keep `/goal complete` as a user/manual command that marks the current session goal complete through `.opencode/plugins/mk-goal.js`. Automatic verifier completion in `.opencode/plugins/mk-goal.js` must call `completeGoalIfCurrent(sessionID, expectedGoalID, verifierRunID)`.

Decision: Separate manual completion from automatic completion. User `/goal complete` can set `status: "complete"` immediately with `completionSource: "manual"`. Assistant self-report cannot. Supervisor `met` sets `completionSource: "supervisor"` only if `goalId` and `generation` still match the verifier input.

Risk: If a user manually completes too early, the plugin cannot prove the goal was met. That is acceptable because it is an explicit user override; `/goal show` should display `completionSource` so manual and verified completion are distinguishable.

### Finding 4: Verifier state must be first-class in the goal JSON record.

Evidence: Claude-like G2 behavior included `Last check`, `last_reason`, and iteration bumping when the verifier says not-yet-met [SOURCE: .opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md:26]. OpenHuman's UI polls thread goal state every 10 seconds so agent/continuation-driven changes surface without manual refresh [SOURCE: .opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx:23]. The existing OpenCode plugin pattern already exposes a status tool through the returned `tool` map [SOURCE: .opencode/plugins/mk-spec-memory.js:438].

OUR target: `.opencode/plugins/mk-goal.js` should add fields to the per-session JSON state: `lastCheckAtMs`, `lastVerifierVerdict`, `lastVerifierReason`, `lastVerifierConfidence`, `lastEvidence`, `completionSource`, `iterations`, and `verifierRunID`. The `mk_goal_status` tool and `/goal show` should display those fields.

Decision: Store verifier output alongside the goal, not in logs only. That gives `/goal show`, `mk_goal_status`, and every-turn injection a stable substitute for Claude's status-line `Last check` overlay.

Risk: Storing evidence snippets can leak sensitive transcript or shell output into `.opencode/skills/.goal-state`. Cap evidence length, redact obvious secrets, and store references/summaries rather than full command output.

### Finding 5: The OpenCode hook point for running completion checks is `session.idle` plus `message.updated` evidence capture.

Evidence: `.opencode/plugins/mk-spec-memory.js` shows the plugin return shape with `event`, `experimental.chat.system.transform`, and `tool` hooks [SOURCE: .opencode/plugins/mk-spec-memory.js:251]. It appends context every turn by pushing into `output.system` [SOURCE: .opencode/plugins/mk-spec-memory.js:404]. Its event hook receives all `message.*` and `session.*` events and invalidates session cache from the event session ID [SOURCE: .opencode/plugins/mk-spec-memory.js:417]. OpenHuman's continuation loop only selects active, unsuppressed, idle goals and skips threads with in-flight turns [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs:53].

OUR target: `.opencode/plugins/mk-goal.js` should use `message.updated` to cache the latest assistant transcript/evidence for a session, and `session.idle` to run `maybeVerifyGoal(sessionID)` before `maybeContinueGoal(sessionID)`.

Decision: Put completion detection before continuation: on `session.idle`, if the current goal is active and generation matches, run verifier; if `met`, complete and do not continue; if `blocked`, mark blocked and do not continue; if `not_met`, update last check and then allow the guarded continuation path from G8.

Risk: `session.idle` is later than Claude's Stop hook and can race a new user turn. Guard every verifier transition with `goalId`, `generation`, and a last-seen message timestamp; bail out if new user input appears while the verifier is running.

## Questions Answered

- G9 is answered: default automatic completion detection should be supervisor-verifier based.
- Assistant self-report is a candidate signal only, not authority to mark a goal complete.
- Shell gates are optional evidence adapters, not the universal detector, and must not be inferred from objective text.
- `/goal complete` remains a user-owned manual override with `completionSource: "manual"`.
- `.opencode/plugins/mk-goal.js` needs explicit verifier fields in the per-session JSON state.

## Questions Remaining

- G10: exact budget governance, including whether `usage_limited` is distinct from `budget_limited` in OpenCode state transitions.
- G11: exact `mk_goal_status` and `/goal show` display format for verifier fields.
- G12: final status set and whether OpenCode v1 keeps Codex's full six statuses.
- G13: prompt-injection sanitizer/fencing for the user-authored objective and verifier evidence.
- Protocol gap: the prompt asked for iteration 9, but local artifacts for iteration 8 are missing and the shared state log only reaches iteration 7.

## Next Focus

G10: budget governance. Completion detection now has a clear state machine; the next design dependency is when `tokensUsed`, `timeUsedSeconds`, `budget_limited`, and `usage_limited` should stop verification or continuation.
