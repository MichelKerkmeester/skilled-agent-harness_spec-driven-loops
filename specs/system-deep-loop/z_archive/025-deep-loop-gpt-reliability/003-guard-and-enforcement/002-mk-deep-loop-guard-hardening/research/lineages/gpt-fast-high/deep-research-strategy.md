# Deep Research Strategy: mk-deep-loop-guard Loop-Detection Hardening

## Research Topic

Investigate whether `.opencode/plugins/mk-deep-loop-guard.js` can be extended to mechanically detect and optionally block repeated/loop-like `orchestrate` to command-owned loop-executor dispatches (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`), while still allowing exactly one legitimate bounded hand-off.

## Known Context

- `resource-map.md not present; skipping coverage gate`.
- Current plugin only handles single-dispatch mode mismatch: it registers `tool.execute.before`, filters to `input.tool === 'task'`, reads `output.args`, checks `args.subagent_type || args.subagentType`, resolves that against `mode-registry.json`, compares a `mode=X` token in `args.prompt`, then warns or throws under `MK_DEEP_LOOP_GUARD_REJECT=1` [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:78-106].
- The SDK hook exposes `sessionID`, `callID`, and mutable `output.args` to `tool.execute.before` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241].
- The phase's own spec asks for session-scoped state feasibility and loop-like definitions, and requires options with false-positive risks [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/016-mk-deep-loop-guard-hardening/spec.md:67-89].

## Key Questions

- [x] Q1: Does the plugin hook expose enough session identity or state surface to track multiple Task calls in one session?
- [x] Q2: What should "loop-like" mean mechanically while allowing one bounded hand-off and legitimate retries?

## Answered Questions

- Q1: Yes for same-session tracking. `tool.execute.before` supplies `sessionID`, and the plugin factory is invoked once at session start according to the local plugin README, so a closure `Map` can track same-process call history. Durable tracking across reloads/restarts should use an external state file keyed by `sessionID`, patterned after `mk-goal`.
- Q2: "Loop-like" should be scoped to command-owned loop executors only, keyed by `{sessionID, callerAgent, workflowMode/targetAgent}`. A first dispatch is allowed. A second same-key dispatch in the same window should be allowed only when it is an explicit retry of a failed/timeout hand-off or should warn/block depending on policy. A third same-key dispatch is strong loop-like evidence.

## What Worked

- Reading SDK types before inferring hook behavior resolved the session-state question directly.
- Reading both `cli-opencode/SKILL.md` and `cli-opencode/references/agent_delegation.md` exposed an important distinction: command-owned loop executors are direct-command-only from CLI docs, while `orchestrate` is allowed exactly one bounded Task hand-off under the current SKILL wording.
- Reading `orchestrate.md` showed why current `args.subagent_type`-only detection is insufficient for orchestrate paths: the task schema uses `Subagent Type: "general"` while the true target is in `Agent:` and `Deep Route:` prompt fields.

## What Failed

- A pure before-hook approach cannot reliably know whether a prior hand-off failed or timed out unless the plugin also records `tool.execute.after` data or the prompt carries an explicit retry token.
- A detector keyed only by `subagent_type` would miss registry-backed orchestrate dispatches that wrap custom agents in the generic subagent type.

## Exhausted Approaches

- Treating all repeated Task calls as loop-like: too broad and would affect normal generic-agent retries.
- Using latency as a block signal: phase 012 reports latency gaps but does not classify those as correctness failures.
- Relying only on natural-language instruction compliance: phase 012 shows GPT enforced the command-only convention for `deep-research` but not for `deep-review`.

## Ruled-Out Directions

| Direction | Reason | Evidence |
|---|---|---|
| Hard-block the second same-target dispatch unconditionally | False-positives legitimate retries after failed or timed-out hand-offs | Phase spec edge case [SOURCE: spec.md:122-126] |
| Require OpenCode core changes for session state | Not needed for a first implementation; hook exposes `sessionID` and existing plugin patterns persist per-session files | [SOURCE: index.d.ts:235-241], [SOURCE: mk-goal.js:647-649] |
| Detect caller solely from `tool.execute.before` input | The before-hook input lacks `agent`; caller must be inferred from prompt fields or tracked from `chat.message` | [SOURCE: index.d.ts:187-199], [SOURCE: index.d.ts:235-241] |

## Next Focus

Synthesis complete. Recommended next implementation phase: durable per-session ledger plus prompt-shape companion guard, implemented fail-open by default and reject-gated by environment variable.

## Non-Goals

- Do not implement the plugin change in this research lineage.
- Do not change command, agent, or skill wording from this lineage.
- Do not re-litigate whether orchestrate may have one bounded hand-off; current docs already permit it.

## Stop Conditions

- Max iterations reached: 3/3.
- Required design options produced with evidence and false-positive risks.
