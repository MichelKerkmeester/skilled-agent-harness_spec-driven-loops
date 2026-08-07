# Iteration 1: Plugin Hook State Feasibility

## Focus

Determine whether the OpenCode plugin SDK exposes enough data to track repeated Task-tool calls within one session, and whether session state can be persisted without OpenCode core changes.

## Findings

1. `tool.execute.before` exposes a stable session key and call id: `input` includes `tool`, `sessionID`, and `callID`, while `output` includes mutable `args` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241]. This is enough to key a dispatch ledger by session.
2. The hook does not expose a first-class allow/deny status on `tool.execute.before`; contrast `permission.ask`, whose output explicitly contains `status: "ask" | "deny" | "allow"` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241]. The existing guard's reject mode therefore correctly uses `throw new Error(detail)` rather than a typed deny return [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:97-106].
3. Plugin-local in-memory state is plausible for same-process session tracking because `.opencode/plugins/*.js` files are auto-loaded once at session start and invoked once per boot/session [SOURCE: .opencode/plugins/README.md:24-36]. A closure `Map` inside `MkDeepLoopGuardPlugin` would persist across multiple hook invocations in that plugin instance.
4. Durable per-session state is already a repo pattern. `mk-goal` computes `goalPathForSession(sessionID)` as a hex(sessionID)-keyed JSON file [SOURCE: .opencode/plugins/mk-goal.js:647-649], reads that JSON on demand [SOURCE: .opencode/plugins/mk-goal.js:740-744], and atomically writes it via temp file, sync, and rename [SOURCE: .opencode/plugins/mk-goal.js:778-793].
5. `mk-goal` also combines durable files with plugin-local volatile runtime state: the plugin factory creates `runtimeState` sets/maps for in-flight locks and session statuses [SOURCE: .opencode/plugins/mk-goal.js:1728-1736], then returns hooks that use those state structures across event and transform calls [SOURCE: .opencode/plugins/mk-goal.js:1841-1854].

## Sources Consulted

- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241`
- `.opencode/plugins/README.md:24-36`
- `.opencode/plugins/mk-deep-loop-guard.js:78-106`
- `.opencode/plugins/mk-goal.js:647-649`
- `.opencode/plugins/mk-goal.js:740-793`
- `.opencode/plugins/mk-goal.js:1728-1854`

## Assessment

- `newInfoRatio`: 0.86
- Novelty justification: This iteration answered the state-feasibility question with direct SDK and existing-plugin evidence, not analogy.
- Confidence: High for sessionID availability and external-state feasibility. Medium for relying solely on in-memory closure state, because the docs prove auto-load once at session start but not cross-restart durability.

## Reflection

- Worked: SDK type read gave exact hook shape.
- Failed: SDK type alone does not prove whether throwing blocks execution, but current plugin already uses throw mode and prior phase documentation says it was live-tested.
- Ruled out: Requiring OpenCode core changes just to track a session counter.

## Recommended Next Focus

Ground the detection key in current dispatch paths: `cli-opencode` wording, orchestrate's Task schema, mode-registry identities, and deep-review's leaf contract.
