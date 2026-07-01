# Iteration 3: Design Options and False-Positive Risks

## Focus

Produce concrete, evidence-grounded design options and choose reasonable N/window thresholds.

## Findings

1. Phase 012's exact enforcement-inconsistency evidence is narrow but real: GPT refused a direct `deep-research` Task dispatch by citing the command-only rule [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47-48], but accepted a similar direct `deep-review` dispatch despite docs treating both as command-only [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:50-60].
2. The same benchmark explicitly says no full multi-iteration convergence run was covered and the GPT deep-research vs deep-review inconsistency was not root-caused further [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:75-80]. Therefore the hardening should target mechanical repeated hand-offs, not infer broad GPT unreliability from one smoke mismatch.
3. A before-only counter can enforce exactly-one hand-off, but cannot know whether the first hand-off failed unless the plugin also records after-hook outcome. The SDK exposes `tool.execute.after` with `tool`, `sessionID`, `callID`, prior `args`, and output fields [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:249-258]. That is enough to attach outcomes to the before-hook ledger, even if the exact Task metadata shape needs implementation-time smoke testing.
4. The existing guard is fail-open on internal errors and reject-gated by env var: it ignores non-task tools, missing args, missing registry, and non-registry targets, and only throws when `MK_DEEP_LOOP_GUARD_REJECT=1` [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:78-106]. Any hardening should preserve that pattern.

## Design Option A: Durable Per-Session Ledger, Strict Exactly-One Policy

Trigger condition:

- Scope only Task-tool calls targeting command-owned loop executors: `deep-research`, `deep-review`, `deep-improvement`, and `prompt-improver`.
- Resolve target from `Deep Route:` fields first, then registry agent, then `args.subagent_type`.
- Key ledger records by `{sessionID, callerAgent, targetAgent/workflowMode}`.
- Allow first hand-off for a key.
- Allow second hand-off only when the ledger marks the previous call as `error` or `timeout` from `tool.execute.after`, or when the prompt carries an explicit retry token such as `retry_of_callID=<prior-callID>`.
- Warn on second non-retry by default; block it when `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`.
- Always block/warn the third same-key hand-off in the same session/window unless every prior accepted hand-off is recorded failed/timeout.

State shape:

```json
{
  "sessionID": "...",
  "dispatches": [
    {"callID":"...","caller":"orchestrate","target":"deep-review","mode":"review","promptHash":"...","startedAt":0,"outcome":"pending|ok|error|timeout"}
  ]
}
```

Evidence basis:

- Session key and mutable args from `tool.execute.before` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241].
- After-hook outcome attachment point from `tool.execute.after` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:249-258].
- Durable per-session state precedent from `mk-goal` [SOURCE: .opencode/plugins/mk-goal.js:647-649], [SOURCE: .opencode/plugins/mk-goal.js:778-793].

Trade-offs:

- Strongest enforcement and survives plugin reloads.
- More implementation surface: file locking/atomic writes, retention cleanup, JSON corruption handling.
- Requires smoke testing Task after-hook output to classify failed vs successful calls accurately.

False-positive risk:

- A legitimate second independent user request in the same long OpenCode session could look like a loop if it targets the same loop executor and lacks a new command boundary. Mitigation: require callerAgent=orchestrate plus target match, cap strict ledger to a 15-minute window or current command/run id if discoverable, and support explicit retry/new-run tokens.

## Design Option B: Volatile Session Map, Warn-Second Block-Third Policy

Trigger condition:

- Keep a closure `Map` in `MkDeepLoopGuardPlugin`: `Map<sessionID, Map<caller+target, recentCalls[]>>`.
- On first same-key hand-off: allow.
- On second same-key hand-off within 15 minutes: warn with detail and include the prior callID; allow even in reject mode unless prompt declares `execution=loop|session`.
- On third same-key hand-off within 15 minutes: throw when reject-loop env is set, otherwise warn.

Evidence basis:

- Plugin factory is invoked once at session start [SOURCE: .opencode/plugins/README.md:24-36].
- `mk-goal` already uses plugin-local runtime maps/sets for volatile session locks/statuses [SOURCE: .opencode/plugins/mk-goal.js:1728-1736].
- Current guard already fails open on unexpected errors [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:103-106].

Trade-offs:

- Minimal and low risk; no filesystem ledger or retention.
- Does not survive OpenCode/plugin restart and cannot audit past calls after process loss.
- Weaker than "exactly one" because second non-retry is warning-only by design.

False-positive risk:

- Low for legitimate retry because the second same-key call is allowed. Higher false-negative risk: a two-call mini-loop can slip through in warn-only mode. Best suited as a first hardening layer or default-off reject path.

## Design Option C: Prompt-Shape Companion Guard

Trigger condition:

- Parse orchestrate's `Deep Route:` line.
- If `target_agent` is a command-owned loop executor and `execution` is anything other than `single_iteration`, warn/block immediately.
- If `source_of_truth` is absent or not `mode-registry.json`, warn/block as a prompt/route integrity issue.

Evidence basis:

- Orchestrate requires `Deep Route: mode=<workflowMode>; target_agent=@<agent>; execution=<single_iteration|loop|session>; source_of_truth=.opencode/skills/deep-loop-workflows/mode-registry.json` [SOURCE: .opencode/agents/orchestrate.md:186-210].
- Command-owned loop executors are single-iteration leafs; parent commands own iteration state and convergence [SOURCE: .opencode/skills/cli-opencode/SKILL.md:291-295], [SOURCE: .opencode/agents/deep-review.md:34-39].

Trade-offs:

- Very low false-positive risk because it checks declared prompt intent, not history.
- Does not detect repeated `execution=single_iteration` hand-offs by itself.
- Best used with Option A or B, not as the only hardening.

False-positive risk:

- Minimal, mostly malformed prompt/schema drift. Mitigate by warning-only first and only rejecting under explicit env flag.

## Sources Consulted

- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47-60`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:75-80`
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-258`
- `.opencode/plugins/mk-deep-loop-guard.js:78-106`
- `.opencode/plugins/mk-goal.js:647-793`
- `.opencode/plugins/mk-goal.js:1728-1736`

## Assessment

- `newInfoRatio`: 0.58
- Novelty justification: The iteration produced implementable thresholds and separated strict durable enforcement from a safer volatile default, grounded in actual hook and benchmark evidence.
- Confidence: High that Option A and B are implementable without OpenCode core changes. Medium on exact after-hook outcome classification until Task result metadata is smoked.

## Reflection

- Worked: Phase 012 kept the problem scope narrow and prevented overfitting to latency.
- Failed: Prompt-improver identity source was not verified in this lineage; implementation should add or locate a registry entry before enforcement.
- Ruled out: Latency-driven blocking and unconditional second-call rejection.

## Recommended Next Focus

Implement Option A if strict enforcement is desired, with Option C as a companion schema guard. Use Option B first if minimizing blast radius is more important than exactly-one enforcement.
