# Iteration 001: SDK Session-State Capabilities + Mechanical 'Loop-Like' Definition

**Focus:** Q1 (plugin SDK session-scoped state) + Q2 (mechanical definition of 'loop-like' dispatch)

---

## Research Topic

Whether `.opencode/plugins/mk-deep-loop-guard.js` can be extended to mechanically detect and optionally block repeated/loop-like orchestrate-to-command-owned-loop-executor dispatches.

---

## Q1: Does the @opencode-ai/plugin SDK tool.execute.before hook expose or allow persisting session-scoped state?

### Answer: YES — two proven mechanisms exist in this codebase.

### Evidence A: sessionID is available per-call in the hook input

The SDK type definition (`@opencode-ai/plugin/dist/index.d.ts:235-241`) declares the `tool.execute.before` hook signature:

```typescript
"tool.execute.before"?: (input: {
    tool: string;
    sessionID: string;
    callID: string;
}, output: {
    args: any;
}) => Promise<void>;
```

The `input.sessionID` field is the session identifier, available on every hook invocation. The `input.callID` is a unique-per-call identifier. The current `mk-deep-loop-guard.js` ignores both — it only reads `output.args`.

[SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241]

### Evidence B: In-process closure-scoped Map<sessionID, ...> is the established pattern

Three sibling plugins already use closure-scoped `Map` objects keyed by sessionID, captured in the plugin factory's returned Hooks closures:

1. **mk-spec-memory.js** (`mk-spec-memory.js:259-271`): `const state = { continuityCache: new Map(), inFlight: new Map(), ... }` — caches per-session continuity data. Uses `normalizeSessionID(sessionID)` from `input.sessionID`.

2. **mk-code-graph.js** (`mk-code-graph.js:100,164`): `const transportCache = new Map()` with `cacheKeyForSession(sessionID, specFolder)` returning `"${specFolder}::${normalizeSessionID(sessionID)}"`.

3. **mk-skill-advisor.js** (`mk-skill-advisor.js:420-422`): `advisorCache: new Map(), inFlight: new Map()` with `cacheKeyForPrompt(prompt, options, sessionID, ...)`.

The plugin factory pattern is `Plugin = (input: PluginInput, options?) => Promise<Hooks>`. The factory runs once at plugin load; the returned Hooks object is stable for the process lifetime. Hook closures capture the mutable `state` object. This means **within a single OpenCode process, all `tool.execute.before` calls share the same closure-scoped state**.

[SOURCE: .opencode/plugins/mk-spec-memory.js:253-271, .opencode/plugins/mk-code-graph.js:100,164, .opencode/plugins/mk-skill-advisor.js:420-422]

### Evidence C: External file-based state keyed by sessionID is also proven

**mk-goal.js** (`mk-goal.js:24,647-649`) persists session state to an external JSON file:

```javascript
const DEFAULT_STATE_DIR = fileURLToPath(new URL('../skills/.goal-state/', import.meta.url));

function goalPathForSession(sessionID, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  return join(options.stateDir, `${sessionKeyForSession(sessionID)}.json`);
}
```

Where `sessionKeyForSession(sessionID)` returns `Buffer.from(sessionID, 'utf8').toString('hex')` (`mk-goal.js:178-179`). The state directory defaults to `.opencode/skills/.goal-state/` and is created with `mode: 0o700` (`mk-goal.js:629`).

This proves that external file persistence keyed by sessionID is already an established, working pattern in this codebase. The guard could follow the same pattern for cross-process persistence.

[SOURCE: .opencode/plugins/mk-goal.js:24,178-179,627-649]

### Trade-off: In-process vs External state

| Dimension | In-process closure Map | External file |
|-----------|----------------------|---------------|
| **Setup cost** | Trivial — add `Map` to closure | Moderate — mkdir, read/write JSON |
| **Persistence across `opencode run`** | NO — fresh process per invocation | YES — survives process exit |
| **Persistence across TUI session** | YES — same process | YES |
| **Garbage collection** | Automatic on process exit | Manual cleanup or TTL needed |
| **Precedent in codebase** | 3 plugins (spec-memory, code-graph, skill-advisor) | 1 plugin (goal) |
| **Concurrency safety** | Single-threaded JS — safe | Needs atomic write (temp+rename) |

**Critical implication for deep-loop detection:** The repeat-dispatch problem manifests **within a single session** (orchestrate dispatching the same loop executor multiple times in one conversation). For TUI/serve sessions, in-process state is sufficient. For `opencode run` one-shot invocations, each is a single dispatch — there's no "repeat" to detect because the process ends after one turn. So **in-process closure state is the primary mechanism**; external file state is a defense-in-depth layer for edge cases (e.g., resume/fork scenarios where the same logical session spans processes).

---

## Q2: What should 'loop-like' mean mechanically?

### Answer: Same deep-loop-executor agent identity dispatched ≥3 times within a session, identified by prompt parsing (not subagent_type).

### Why subagent_type cannot be the discriminator

`orchestrate.md` §2 explicitly states: `subagent_type: "general"` for ALL custom agent dispatches (`orchestrate.md:73-81,92,189`). The Agent Selection Priority table shows every agent uses `subagent_type: "general"` — including `@deep-research`, `@deep-review`, `@ai-council`, `@context`, `@code`. The agent identity lives in the **prompt body**, not in the runtime subagent_type field.

[SOURCE: .opencode/agents/orchestrate.md:73-81,189, .opencode/plugins/mk-deep-loop-guard.js:85-86]

### How to identify a deep-loop-executor dispatch from the prompt

The current guard already extracts `mode=([a-z0-9-]+)` from `args.prompt` (`mk-deep-loop-guard.js:43-46`). For the repeat-detection extension, the guard needs to identify which of the 4 loop executors is being dispatched. Three signal patterns are available in dispatch prompts, per `orchestrate.md` §3 Task Format:

1. **`Agent: @deep-research` / `Agent: @deep-review`** etc. — from the Task Format `Agent:` field (`orchestrate.md:187`)
2. **`Deep Route: mode=research`** — from the Task Format `Deep Route:` field (`orchestrate.md:188`)
3. **`mode=research`** — the existing regex pattern already used by the guard

The `mode-registry.json` maps workflowMode → agent for all 4 loop executors:

| workflowMode | agent | command |
|---|---|---|
| `research` | `deep-research` | `/deep:research` |
| `review` | `deep-review` | `/deep:review` |
| `agent-improvement` | `deep-improvement` | `/deep:agent-improvement` |
| (prompt-improver) | `prompt-improver` | `/prompt` |

Note: `prompt-improver` is NOT in mode-registry.json (it's owned by `/prompt`, not `/deep:*`). The guard would need an additional static set for `prompt-improver` agent identity.

[SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:18-145, .opencode/skills/cli-opencode/SKILL.md:293]

### What N/window avoids false-positiving on legitimate retries?

**The contract says "exactly one bounded hand-off"** (`cli-opencode/SKILL.md:293`): `orchestrate` may perform "exactly one bounded hand-off dispatch to a recognized loop request, but never manages the loop itself."

However, `orchestrate.md` §6 documents a legitimate **RETRY protocol** (attempts 1-2): "RETRY (Attempts 1-2): Provide additional context from other sub-agents, clarify success criteria, re-dispatch same agent with enhanced prompt." This means up to **2 dispatches of the same loop executor** is legitimate (1 original + 1 retry).

**Recommended thresholds:**

| Count (same loop-executor type per session) | Action | Rationale |
|---|---|---|
| 1 | Allow (silent) | The one legitimate bounded hand-off |
| 2 | Allow + WARN | Legitimate retry per §6 RETRY protocol |
| ≥3 | Block (when REJECT env set) or WARN (default) | Violates the "exactly one bounded hand-off" contract |

The window is **session-scoped** (per `sessionID`), not time-windowed. A session is the natural boundary because the contract violation is "orchestrate re-implementing the loop by dispatching the executor repeatedly" — this pattern accumulates within a single orchestration session, not across sessions.

[SOURCE: .opencode/skills/cli-opencode/SKILL.md:293, .opencode/agents/orchestrate.md:566-569]

### False-positive risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Legitimate retry after transient failure counted as violation | Medium | N≥3 threshold accommodates 2 retries |
| Different loop modes dispatched in sequence (research then review) | Low | Count is per-executor-type, not total |
| Resume/fork scenario re-dispatches | Medium | External file state with TTL or generation check |
| Prompt parsing fails to identify agent (missing `Agent:` line) | Medium | Multi-pattern fallback: `Agent: @X` → `Deep Route: mode=X` → `mode=X` |
| User explicitly orchestrates multiple independent loop sessions | Low | Document `MK_DEEP_LOOP_GUARD_SKIP_REPEAT=1` env escape hatch |

---

## Findings Summary

| # | Finding | Evidence |
|---|---------|----------|
| 1.1 | `tool.execute.before` exposes `input.sessionID` and `input.callID` per call | SDK index.d.ts:235-241 |
| 1.2 | In-process closure `Map<sessionID, ...>` is the established pattern (3 plugins) | mk-spec-memory:259-271, mk-code-graph:100,164, mk-skill-advisor:420-422 |
| 1.3 | External file state keyed by sessionID is proven (mk-goal.js) | mk-goal.js:24,647-649 |
| 1.4 | In-process state is primary; external is defense-in-depth | `opencode run` is one-shot, repeat detection needs same-process |
| 2.1 | `subagent_type` is always `"general"` — cannot discriminate loop executors | orchestrate.md:73-81,189 |
| 2.2 | Agent identity must be parsed from prompt (`Agent:` / `Deep Route:` / `mode=`) | orchestrate.md:187-188, mk-deep-loop-guard.js:43-46 |
| 2.3 | Threshold: N≥3 same-loop-executor dispatches per session = block | cli-opencode SKILL.md:293, orchestrate.md:566-569 |
| 2.4 | `prompt-improver` not in mode-registry.json — needs static set | mode-registry.json, cli-opencode SKILL.md:293 |

## Ruled Out

- **Using `subagent_type` as discriminator**: always `"general"` — no signal.
- **Time-windowed detection**: session-scoped is the natural boundary; time windows add complexity without value.
- **Detecting the repeat via `callID` patterns**: callID is unique-per-call, not correlated across calls — useful for logging, not for counting.
