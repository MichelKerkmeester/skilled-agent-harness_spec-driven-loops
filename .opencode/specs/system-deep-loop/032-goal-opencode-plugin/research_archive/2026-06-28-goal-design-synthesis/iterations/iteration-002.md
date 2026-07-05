# Focus

G2: Claude Code `/goal` behavior: completion condition, autonomous continue-until-met behavior, independent verification, and status-line-style surfacing.

# Actions Taken

- Confirmed the local Claude wrapper reports `2.1.195 (Claude Code)`, while the installed native app's embedded version strings include `VERSION:"2.1.169"`. I did not find an unpacked `2.1.139` source tree locally.
- Searched npm cache metadata for `2.1.139`; cache metadata confirms Claude Code packages include a `2.1.139` release, but that is package availability evidence, not behavior implementation evidence.
- Extracted targeted strings from `/Users/michelkerkmeester/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude` with `strings -n 4 ... | rg -n -C 4 ...` for `/goal`, `goal_status`, `active_goal`, Stop hook, and status overlay terms.
- Read iteration 1 to avoid repeating G1's Codex state-model findings.

# Findings

## 1. `/goal` is a hooks/trust feature, not a plain command.

Evidence: binary-string extraction from `/Users/michelkerkmeester/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude` returned `/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.` at strings line `143046`, followed by `/goal can't run while hooks are restricted (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).` at line `143047`.

OUR target: `.opencode/commands/goal.md` should be a thin router, but `.opencode/plugins/mk-goal.js` must own the actual behavior because the feature depends on hooks/lifecycle. The command should fail loudly when the plugin cannot install or run the hook path, rather than silently storing an objective that will not drive continuation.

Decision: Treat `/goal` as a plugin-backed command. `set` validates hook/plugin availability before writing an active goal, while `show`, `pause`, `complete`, and `clear` can still operate on stored state.

Risk: OpenCode may not expose a direct equivalent of Claude's hook restriction flags. If plugin availability cannot be checked synchronously from the command, the first implementation should write state and immediately have `.opencode/plugins/mk-goal.js` publish a `lastError`/`hooksUnavailable` status.

## 2. Completion detection is verifier-driven by a Stop hook, not trusted assistant self-report.

Evidence: binary strings around `goal_status` include `Last check:`, `Stop`, `hooks_gate`, `trust_gate`, and `goal_set` at lines `187412-187420`. Another cluster includes `active_goal`, `goal_status`, `tengu_goal_failed`, `goal_met`, `impossible`, and `tengu_goal_achieved` at lines `188035-188040`. The clearest implementation note is at strings lines `313053-313054`: `active_goal` is an internal event emitted when the user's `/goal` Stop hook reports met or not-yet-met; when not yet met, it bumps iterations plus `last_reason`.

OUR target: `.opencode/plugins/mk-goal.js` should not mark a goal complete because the assistant says it is done in normal prose. It needs a separate verification step after each assistant turn, storing `lastCheck`, `lastReason`, and `iterations`.

Decision: Model Claude's verifier as an OpenCode idle verifier. After an assistant turn, if the goal is active, the plugin runs a bounded check that returns one of `met`, `not_met`, or `impossible`. Only `met` transitions the state to `complete`; `not_met` increments `iterations` and creates the next continuation prompt; `impossible` transitions to `blocked` with `lastReason`.

Risk: If OpenCode lacks a true Stop hook equivalent, using `session.idle` plus `message.updated` can lag behind the assistant's stop point or race with user input. The plugin must bail out if a new user message arrives before the verifier finishes.

## 3. Continue-until-met is implemented as a stop-prevention loop with an explicit user escape.

Evidence: binary strings show `/goal clear to stop early` at line `210099`, `Goal active` at line `210105`, and `Goal achieved` at line `210108`. The verifier cluster includes `hook_additional_context` and `Stop hook prevented continuation` at lines `188043-188044`, which matches a loop where a not-yet-met verifier result injects additional context and prevents the assistant from ending the goal run.

OUR target: `.opencode/plugins/mk-goal.js` should drive active continuation on the lifecycle edge closest to "assistant tried to stop". The OpenCode mechanism to test in G5 is `session.idle -> session.prompt`, with `message.updated` used to capture completion/usage evidence.

Decision: Choose active continuation as the behavior spec, but implement it with hard caps: max iterations per idle chain, max wall-clock span, budget-aware cutoff, and `/goal clear` as an immediate kill switch. Passive injection alone would not match Claude's `/goal` behavior.

Risk: An active continuation loop can run away, repeat low-value prompts, or continue after the user's intent changes. The state record needs `runId` or `generation` guards so stale idle callbacks cannot continue an old goal after `clear`, `pause`, or a new `set`.

## 4. Claude surfaces the goal through an active status indicator with last-check state.

Evidence: binary strings include the status/UI labels `Goal`, `Last check`, `Goal active`, `Goal achieved`, `/goal <condition> to set another`, `/goal <condition> to set one`, and `No goal set` at lines `210102-210111`. Another status marker appears as ` /goal active` at line `218886`. The internal `active_goal` event says any surface with a goal indicator re-renders from that event at lines `313053-313054`.

OUR target: OpenCode likely cannot clone Claude's status-line overlay directly in `.opencode/plugins/mk-goal.js`, so the buildable substitute should be three surfaces: inject the active goal into every turn, implement `/goal show` in `.opencode/commands/goal.md`, and expose a lightweight `goal_status` context/tool output if OpenCode plugin APIs allow it.

Decision: Define v1 UX as "status substitute" rather than status-line parity: active injection plus `/goal show` must display objective, status, last check, iterations, and budget fields. A later UI/status-line integration can consume the same `active_goal` state event if OpenCode exposes one.

Risk: Without a persistent overlay, users may miss that a goal is active until the next model turn or `/goal show`. This increases the importance of concise injected text and explicit command output after `set`, `pause`, `complete`, and `clear`.

## 5. Goals restore on resume and command output is short, stateful, and condition-limited.

Evidence: binary strings include `tengu_goal_restored_on_resume` beside `goal_status`, `goal_set`, `Stop`, and `prompt` at lines `221799-221803`. Command-facing strings include `No goal set`, `Goal cleared:`, `Goal set:`, `Goal condition is limited to ... characters`, `No goal set. Usage: /goal <condition>`, `not yet evaluated`, and `Goal active:` at lines `343969-343989`.

OUR target: the goal state store should persist active goals across OpenCode resume for the same session identifier. `.opencode/commands/goal.md` should keep the command surface terse: bare `/goal <condition>` sets/replaces, `/goal show` reads, `/goal clear` deletes, `/goal complete` marks complete, and `/goal pause` pauses.

Decision: Persist by session/thread key and restore active goals during `.opencode/plugins/mk-goal.js` session initialization. Add an objective length cap to the command contract, with the exact limit chosen in G6/G7 after store shape and command-router constraints are known.

Risk: Resume persistence can resurrect stale work after a long gap. The injected block and `/goal show` should include age/last-check data, and the plugin should avoid auto-continuing an old active goal until a fresh user turn confirms the session is live.

# Questions Answered

- G2 answered: Claude `/goal` is a trusted-workspace, hook-backed feature. It stores a user completion condition, checks completion through a Stop-hook verifier, continues when the verifier says not yet met, exposes a visible active/achieved/no-goal status surface, and restores active goal state on resume.
- The behavior spec for OpenCode should be active continuation with an independent verifier and a visible status substitute, not passive prompt injection alone.

# Questions Remaining

- Exact Claude `2.1.139` implementation source was not available locally. The behavior evidence comes from the installed native Claude app's embedded strings; npm cache only confirms that `2.1.139` existed.
- G5 must verify whether OpenCode has a true Stop-hook equivalent or whether `session.idle -> session.prompt` is the closest buildable continuation mechanism.
- G6/G7 must decide the objective length cap, command parsing details, and whether state persistence is flat JSON or SQLite.
- G9 must define the verifier prompt/schema and whether the verifier should run in the same model, a cheaper model, or a shell-backed gate when available.

# Next Focus

G3: mine the vendored OpenHuman reference for `thread_goals`, `goalsApi`, and `ThreadGoalChip` to compare lifecycle, UI surfacing, and resume semantics against the Claude behavior spec.
