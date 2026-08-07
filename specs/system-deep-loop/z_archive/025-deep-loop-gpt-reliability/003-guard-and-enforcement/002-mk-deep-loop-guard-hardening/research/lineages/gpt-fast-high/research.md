# Research Synthesis: mk-deep-loop-guard Loop-Detection Hardening

## 1. Executive Summary

`mk-deep-loop-guard.js` can be extended without OpenCode core changes to detect repeated orchestrate-to-command-owned-loop-executor hand-offs. The SDK gives `tool.execute.before` a `sessionID`, `callID`, and mutable `output.args` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241]. Existing repo precedent (`mk-goal`) already persists session-scoped JSON state keyed by hex(sessionID) [SOURCE: .opencode/plugins/mk-goal.js:647-649] and also uses plugin-local runtime maps/sets inside the plugin factory [SOURCE: .opencode/plugins/mk-goal.js:1728-1736].

The recommended strict design is a durable per-session dispatch ledger keyed by `{sessionID, callerAgent, targetLoopAgent/workflowMode}`. Allow the first hand-off; allow a second only as an explicit or outcome-proven retry; warn/block subsequent same-key hand-offs through an env-gated policy. A lower-blast alternative is a volatile in-memory `Map` that warns on the second same-key hand-off and blocks only the third within a 15-minute window.

## 2. Research Questions and Answers

### Q1: Does `tool.execute.before` expose or allow session-scoped state across Task calls?

Yes, for same-session detection. `tool.execute.before` includes `sessionID` and `callID` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241]. `.opencode/plugins/*.js` entrypoints are auto-loaded once per session/startup [SOURCE: .opencode/plugins/README.md:24-36], so plugin closure state can persist across multiple hook invocations in the same plugin instance.

For robust blocking, use external state. `mk-goal` demonstrates a durable, atomic, per-session pattern: it derives a file path from hex(sessionID) [SOURCE: .opencode/plugins/mk-goal.js:647-649], reads the JSON state [SOURCE: .opencode/plugins/mk-goal.js:740-744], and writes via temp file plus atomic rename [SOURCE: .opencode/plugins/mk-goal.js:778-793]. This avoids relying on process lifetime and gives auditable state.

### Q2: What should "loop-like" mean mechanically?

Use a narrow, command-owned target definition:

`loop-like = same sessionID + callerAgent=orchestrate + same command-owned loop target + repeated non-retry hand-off inside the active session/window`.

The target set should include `deep-research`, `deep-review`, `deep-improvement`, and `prompt-improver`, but implementation should confirm prompt-improver's authoritative registry/source before enforcing it. For deep-loop targets already in `mode-registry.json`, use `workflowMode`, `command`, and `agent` entries as the source of truth [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:33-63], [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:81-99].

Do not key only on `args.subagent_type`. `orchestrate.md`'s task schema uses a `Deep Route:` line with `mode`, `target_agent`, `execution`, and `source_of_truth`, while `Subagent Type` can be the generic wrapper [SOURCE: .opencode/agents/orchestrate.md:186-210]. The guard should parse Deep Route first, then fall back to registry-backed `subagent_type` when present.

## 3. Current Dispatch Contracts

`cli-opencode/SKILL.md` states the current intended rule: command-owned loop executors are owned by parent commands, while `orchestrate` may perform exactly one bounded hand-off and must not re-implement iteration/convergence/continuity [SOURCE: .opencode/skills/cli-opencode/SKILL.md:279-295].

`cli-opencode/references/agent_delegation.md` confirms the direct CLI command-only side: `deep-research` and `deep-review` are dispatched only by parent commands, and direct `opencode run --agent deep-research|deep-review` is forbidden [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:203-230].

`orchestrate.md` routes explicit `/deep:review` loop requests to `@deep-review` [SOURCE: .opencode/agents/orchestrate.md:71-80], requires registry-backed Deep Route metadata [SOURCE: .opencode/agents/orchestrate.md:186-210], and marks leaf agents as no-dispatch depth-1 workers [SOURCE: .opencode/agents/orchestrate.md:83-93].

`deep-review.md` confirms the target leaf contract: one review iteration only, loop managed by `/deep:review`, no nested Task dispatch [SOURCE: .opencode/agents/deep-review.md:34-64], with orchestrate only a caller/coordinator [SOURCE: .opencode/agents/deep-review.md:276-284].

## 4. Phase 012 Evidence

The hardening is grounded in a specific inconsistency, not a broad model claim. Phase 012 observed GPT-5.5-fast refuse a direct `deep-research` Task dispatch by citing the command-only rule [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47-48], but allow an analogous direct `deep-review` dispatch despite the same command-only convention [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:50-60].

Phase 012 also explicitly did not run full multi-iteration convergence and did not root-cause the inconsistency further [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:75-80]. Therefore this design should block repeated loop-like orchestration patterns mechanically, not overfit to latency or classify single smoke timeouts as loops.

## 5. Design Option A: Durable Per-Session Ledger

### Trigger

- On every Task-tool call, resolve target from `Deep Route:` fields first, then registry agent/subagent type.
- If target is a command-owned loop executor and caller is `orchestrate`, read ledger for `{sessionID, callerAgent, target}`.
- First same-key hand-off: allow and record `pending` with `callID`, prompt hash, timestamp, mode, and target.
- Use `tool.execute.after` to update outcome for the same `callID`; the SDK exposes after-hook `sessionID`, `callID`, original `args`, `title`, `output`, and `metadata` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:249-258].
- Second same-key hand-off: allow only if prior same-key call has `error|timeout` or the prompt carries an explicit retry marker (`retry_of_callID=<callID>`). Otherwise warn by default and throw only when `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`.
- Third same-key hand-off in session/window: warn/block even if no reject mode, because it is strong loop-like evidence unless all prior accepted calls were failed retries.

### Trade-offs

- Pros: closest to exactly-one, durable across restarts, auditable, can distinguish retry from loop once after-hook classification is implemented.
- Cons: more file I/O, requires corruption handling, retention cleanup, and smoke testing of Task after-hook metadata.
- False-positive risk: a second independent user request in the same long OpenCode session to the same loop target could look loop-like. Mitigate with a 15-minute window, explicit new-run tokens, or a command/run id if a future hook exposes one.

## 6. Design Option B: Volatile Map, Warn-Second Block-Third

### Trigger

- Keep `Map<sessionID, Map<caller+target, recentCalls[]>>` inside the plugin factory.
- First same-key hand-off: allow.
- Second same-key hand-off within 15 minutes: warn; allow even in reject mode unless the prompt declares `execution=loop|session`.
- Third same-key hand-off within 15 minutes: warn or throw under `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`.

### Trade-offs

- Pros: small change, fail-open friendly, no filesystem ledger, lower false-positive risk for retries.
- Cons: weaker enforcement, does not survive restart, allows a two-call mini-loop in default mode.
- False-positive risk: low for retries because the second call is allowed; false-negative risk is higher than Option A.

## 7. Design Option C: Prompt-Shape Companion Guard

### Trigger

- Parse `Deep Route:` on Task prompts.
- For command-owned loop targets, require `execution=single_iteration` and `source_of_truth=.opencode/skills/deep-loop-workflows/mode-registry.json`.
- Warn/block if the prompt declares `execution=loop|session` or omits the registry source.

### Trade-offs

- Pros: very low false-positive risk; catches attempts to make orchestrate own the loop even on the first dispatch.
- Cons: does not detect repeated `execution=single_iteration` calls; should accompany Option A or B.
- False-positive risk: mostly malformed prompt/schema drift. Start warn-only.

## 8. Recommendation

Implement Option A if the project wants mechanical exactly-one enforcement. Pair it with Option C for immediate prompt-shape violations. Keep both fail-open on internal errors, matching the current plugin's catch behavior [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:103-106], and gate rejection with a new env var so the default can remain warn-only while smoke tests calibrate metadata and false positives.

If the implementation phase wants lower blast radius first, implement Option B plus Option C, collect warnings, then promote to Option A once after-hook outcome classification is proven.

## 9. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| OpenCode core changes before any guard | Plugin hook already exposes sessionID and args; mk-goal proves per-session persistence pattern | [SOURCE: index.d.ts:235-241], [SOURCE: mk-goal.js:647-793] | 001 |
| `args.subagent_type`-only matching | Orchestrate uses prompt-level Deep Route fields for true target identity | [SOURCE: orchestrate.md:186-210] | 002 |
| Unconditional second-call block | Legitimate retry after timeout/error is an explicit phase edge case and before-hook-only state cannot classify outcome | [SOURCE: spec.md:122-126], [SOURCE: index.d.ts:249-258] | 003 |
| Latency-based blocking | Phase 012 reported latency/timeouts as smoke gaps, not confirmed routing defects | [SOURCE: benchmark-results.md:75-80] | 003 |

## 10. Open Questions

- Prompt-improver needs an authoritative identity source before being enforced alongside deep-loop registry entries.
- Task `tool.execute.after` metadata should be smoke-tested to classify `ok|error|timeout` reliably.
- If OpenCode exposes a command/run id in another hook, it would be a better strict key than time-window alone.

## 11. References

- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-258`
- `.opencode/plugins/mk-deep-loop-guard.js:78-106`
- `.opencode/plugins/mk-goal.js:647-793`
- `.opencode/plugins/mk-goal.js:1728-1854`
- `.opencode/plugins/README.md:24-50`
- `.opencode/skills/cli-opencode/SKILL.md:279-295`
- `.opencode/skills/cli-opencode/references/agent_delegation.md:203-230`
- `.opencode/agents/orchestrate.md:71-93`
- `.opencode/agents/orchestrate.md:186-210`
- `.opencode/agents/deep-review.md:34-64`
- `.opencode/agents/deep-review.md:276-284`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:33-99`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47-80`
