# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Design an OpenCode `/goal` plugin + command mirroring Claude Code's `/goal`. Mine Codex `thread_goals`, Claude `/goal`, and the vendored openhuman reference; map onto OpenCode's plugin injection + command surface; resolve 9 design forks; output a buildable design. Full angle bank: `research/monitor/angle-bank.md`.

---

## 2. TOPIC

Build a `/goal` capability for OpenCode (set a session completion condition; persist; inject every turn until met; show/clear/complete/pause). Files to design: `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md`, a state store. Executor: cli-codex gpt-5.5 xhigh fast. 10 proper iterations.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] [G1] What is Codex's thread_goals data model + lifecycle (~/.codex/goals_1.sqlite: status enum, token/time budget fields, per-thread key)? -> our goal state model
- [ ] [G2] What exactly does Claude Code /goal (v2.1.139) do (completion condition, autonomous continue-until-met, independent supervisor, status-line overlay)? -> behavior spec
- [ ] [G3] What does the vendored z_future/openhuman reference (thread_goals + goalsApi + ThreadGoalChip) model for goal state + UI? -> reuse ideas
- [ ] [G4] How does OpenCode inject context via experimental.chat.system.transform (the .opencode/plugins/mk-spec-memory.js pattern)? -> mk-goal.js injection
- [ ] [G5] Which OpenCode event/lifecycle hooks (session.created/idle/deleted, message.updated) track + drive a goal; is session.idle the autonomy seam? -> mk-goal.js lifecycle
- [ ] [G6] What is the /goal command contract (thin-router like .opencode/commands/memory/learn.md; $ARGUMENTS set|show|clear|complete|pause)? -> goal.md
- [ ] [G7] Which state store (flat JSON .goal-state vs sqlite vs spec-kit memory MCP; port thread_goals; key by sessionID)? -> state store decision
- [ ] [G8] Which autonomy tier (passive inject / active continuation via session.idle->session.prompt / +supervisor) and what loop caps + kill-switch? -> decision
- [ ] [G9] How is completion detected (model self-report vs verifiable shell gate vs supervisor model)? -> decision
- [ ] [G10] How to govern budget (token_budget/tokens_used/time_used + usage_limited/budget_limited states)? -> state + lifecycle
- [ ] [G11] How to surface the active goal (inject-every-turn + an mk_goal_status tool) as a substitute for Claude's status-line overlay? -> UX
- [ ] [G12] What status set + scope/keying (per-session thread_id vs global)? -> decision
- [ ] [G13] Should injected goal text pass a prompt-injection sanitizer before entering context (kasper sanitizer idea)? -> safety
- [ ] [G14] SYNTHESIS: the recommended end-to-end design (mk-goal.js + goal.md + state store), chosen autonomy tier with guardrails, and ordered build sub-phases -> research.md

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Building the plugin in this phase (this phase produces the design; build is follow-up sub-phases).
- Replicating Claude's status-line overlay literally (OpenCode can't render it).

---

## 5. STOP CONDITIONS
- Completion gate is `proper_count >= 10` (orchestrator-tracked). Do not stop on convergence alone — broaden to a different fork/reference/mechanism.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- [G7] Finalize the state-store path and locking strategy. (iteration 3)
- [G5] Verify whether `session.idle` can safely trigger a continuation turn, and whether OpenCode exposes no-in-flight, approval, and event-status signals. (iteration 3)
- [G1] Confirm the exact Codex `thread_goals` SQLite schema and status set, especially `blocked` and `usage_limited`. (iteration 3)
- [G6] Verify whether markdown commands can call a plugin helper/tool or must route through model-visible file edits. (iteration 3)
- [G13] Decide the sanitizer/fencing rule before inserting user-authored objective text into every turn. (iteration 3)
- [G4] Verify the exact OpenCode `experimental.chat.system.transform` signature and how to push the `[active_goal]` block. (iteration 3)
- [G7] Finalize the state-store path, atomic write strategy, and cache policy. (iteration 4)
- [G5] Verify exact event payloads and whether `session.idle` can drive safe continuation without racing user input. (iteration 4)
- [G13] Decide how to sanitize or fence the user-authored objective before injecting it into every turn. (iteration 4)
- [G6] Verify whether `.opencode/commands/goal.md` can route through a plugin tool/helper or must instruct file-state mutation through normal command tooling. (iteration 4)
- [G11] Decide the exact `mk_goal_status` fields and how `/goal show` should differ from model-visible diagnostics. (iteration 4)
- [G10] Does `message.updated` expose token usage, or does budget accounting need another source? (iteration 5)
- [G9] What exact prompt-submission API should `maybeContinueGoal(sessionID)` call, and can it be invoked safely from a plugin hook? (iteration 5)
- [G8] Which autonomy tier should ship first: passive injection only, gated `session.idle` continuation, or continuation plus supervisor verification? (iteration 5)
- [G13] What sanitizer/fencing rule should wrap user-authored goal text before injection? (iteration 5)
- G10: exact budget governance and how to populate `tokensUsed` / `timeUsedSeconds` from OpenCode events. (iteration 7)
- G13: prompt-injection sanitizer/fencing for the user-authored objective before every-turn injection. (iteration 7)
- G12: final status set, especially `blocked` and `usage_limited`. (iteration 7)
- G8: autonomy tier and loop caps for `session.idle` continuation. (iteration 7)
- G9: completion detection: model self-report, verifier/supervisor, or shell gate. (iteration 7)
- [G10] Budget governance: how to populate and enforce `tokensUsed`, `timeUsedSeconds`, `budget_limited`, and `usage_limited`. (iteration 8)
- [G9] Completion detection: what exact verifier/supervisor or shell-gate rule turns a completion candidate into `complete`? (iteration 8)
- [G13] Prompt-injection sanitizer/fencing for the user-authored objective before every-turn injection and before autonomous continuation text. (iteration 8)
- [G12] Final status set, especially when cap-hit should be `blocked` versus a budget/usage status. (iteration 8)
- Protocol gap: the prompt asked for iteration 9, but local artifacts for iteration 8 are missing and the shared state log only reaches iteration 7. (iteration 9)
- G11: exact `mk_goal_status` and `/goal show` display format for verifier fields. (iteration 9)
- G12: final status set and whether OpenCode v1 keeps Codex's full six statuses. (iteration 9)
- G10: exact budget governance, including whether `usage_limited` is distinct from `budget_limited` in OpenCode state transitions. (iteration 9)
- G13: prompt-injection sanitizer/fencing for the user-authored objective and verifier evidence. (iteration 9)
- Implementation smoke: verify real OpenCode `message.updated` payloads include token totals or identify the persisted message/session field that does. (iteration 10)
- G11: exact `mk_goal_status` and `/goal show` presentation text, especially how terse the injected budget block should be. (iteration 10)
- G12: final status set and command behavior for `blocked` versus `paused` versus `usage_limited`. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
G12: final status set and command behavior for `blocked` versus `paused` versus `usage_limited`.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**Mission.** Design a buildable OpenCode `/goal` plugin + command. Output = a design recommending files, injection mechanism, lifecycle, a chosen autonomy tier, and build sub-phases.

**References to mine:** `~/.codex/goals_1.sqlite` (thread_goals); Claude Code `/goal` v2.1.139; `.opencode/specs/z_future/openhuman/external` (thread_goals/ThreadGoalChip); `.opencode/plugins/mk-spec-memory.js` (injection pattern); `.opencode/commands/memory/learn.md` (command pattern).

**Targets to design (cite exact files):** `.opencode/plugins/mk-goal.js` (new), `.opencode/commands/goal.md` (new), goal state store.

**Anti-convergence:** never stop early; on repetition, rotate to a different design fork (G7–G13), reference (G1–G3), or mechanism (G4–G6).

---

## 13. RESEARCH BOUNDARIES
- Max iterations (cap): 12. Completion gate: proper_count >= 10.
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Started: 2026-06-28
