---
title: "OpenCode Plugin Entrypoints"
description: "OpenCode plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools and post-action checks."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
version: 1.0.0.0
---

# OpenCode Plugin Entrypoints

`.opencode/plugins/` contains the JavaScript entrypoints that OpenCode loads as local plugins. Each entrypoint registers tools, hook handlers or lifecycle handlers with the OpenCode host.

---

## 1. OVERVIEW

OpenCode discovers the `.js` files in this directory and invokes each default-exported plugin factory. The factory receives the OpenCode plugin context and returns an object whose keys register tools or hook handlers.

Keep plugin files default-export only. OpenCode treats every module export as a plugin candidate. A named helper export can cause the loader to invoke an invalid plugin and drop the file's intended registration. Attach test seams to the default function, such as `Plugin.__test`, or place shared logic under the owning skill.

Most entrypoints act as thin runtime adapters. They translate OpenCode inputs into calls to shared cores under [`../skills/`](../skills/), then translate the results back into OpenCode tools, context or lifecycle behavior.

Current responsibilities include:

- Injecting continuity, code graph, skill routing and goal context
- Registering read-only status and completion tools
- Observing tool execution before or after a call
- Reacting to session and host lifecycle events
- Running advisory policy and quality checks
- Cleaning up session resources

---

## 2. ARCHITECTURE

```text
OpenCode startup
      |
      v
Discover .opencode/plugins/*.js
      |
      v
Invoke each default export
      |
      v
Plugin returns registrations
      |
      +--> tool
      |      Register callable OpenCode tools
      |
      +--> tool.execute.before
      |      Inspect or guard a tool call before execution
      |
      +--> tool.execute.after
      |      Observe a completed tool call
      |
      +--> experimental.chat.system.transform
      |      Add bounded system context before a model turn
      |
      +--> experimental.chat.messages.transform
      |      Add schema-safe message parts
      |
      +--> experimental.session.compacting
      |      Preserve context during compaction
      |
      +--> event
      |      Handle session, message and host lifecycle events
      |
      `--> dispose
             Run bounded host teardown cleanup
```

The entrypoints may import runtime-neutral cores, bridges and scripts from their owning skills. Shared cores hold policy and reusable behavior. Plugin files own only the OpenCode transport boundary where practical.

The plugins use a fail-open posture for advisory checks unless a plugin documents an explicit opt-in rejection mode. They avoid writing warnings to standard output or standard error because terminal output can interfere with the OpenCode interface.

---

## 3. HOOK EVENT MODEL

| Registration | When OpenCode calls it | Typical use |
|---|---|---|
| `tool` | When the plugin factory loads | Register a callable tool |
| `tool.execute.before` | Before a tool executes | Capture arguments, evaluate policy or refresh diagnostics |
| `tool.execute.after` | After a tool completes | Record telemetry, run post-edit checks or schedule refresh work |
| `experimental.chat.system.transform` | Before model context is finalized | Inject continuity, routing, goal or warning context |
| `experimental.chat.messages.transform` | While message context is prepared | Add validated synthetic message parts |
| `experimental.session.compacting` | During session compaction | Add recovery context |
| `event` | When OpenCode emits lifecycle or message events | Initialize, invalidate, sweep, account or archive state |
| `dispose` | When the plugin host disposes the instance | Run bounded teardown cleanup |

Plugins that correlate `tool.execute.before` with `tool.execute.after` use `callID` because the after-hook input may not repeat the original file path.

---

## 4. DIRECTORY TREE

```text
plugins/
+-- mk-cli-dispatch-audit.js
+-- mk-code-graph-freshness.js
+-- mk-code-graph.js
+-- mk-completion-sentinel.js
+-- mk-deep-loop-guard.js
+-- mk-dist-freshness-guard.js
+-- mk-goal.js
+-- mk-mcp-route-guard.js
+-- mk-post-edit-quality.js
+-- mk-skill-advisor.js
+-- mk-spec-gate.js
+-- mk-spec-memory.js
+-- mk-speckit-completion.js
+-- session-cleanup.js
+-- tests/
`-- README.md
```

---

## 5. KEY FILES

| File | Purpose | Hook events and registrations |
|---|---|---|
| `mk-cli-dispatch-audit.js` | Records redacted, rotated JSONL telemetry after completed `opencode run` and `claude -p` Bash dispatches. The adapter is observe-only and fail-open. | `tool.execute.after` |
| `mk-code-graph-freshness.js` | Correlates source edits, debounces edit bursts and requests a warm-only incremental code graph scan when an established graph needs refresh. It also sweeps stale freshness state and clears timers during disposal events. | `tool.execute.before`, `tool.execute.after`, `event` for `session.created`, `server.instance.disposed` and `global.disposed` |
| `mk-code-graph.js` | Loads transport-backed structural context through a Node bridge, injects system and message context, preserves compaction context and exposes plugin cache status. Session lifecycle events invalidate cached transport plans. | `tool` for `mk_code_graph_status`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, `experimental.session.compacting`, `event` for `session.created` and `session.deleted` |
| `mk-completion-sentinel.js` | Detects completion claims at session idle and checks recorded spec evidence without running tests, builds or validation scripts. It logs advisory results and sweeps stale sentinel state. | `event` for `session.created` and `session.idle` |
| `mk-deep-loop-guard.js` | Checks Task dispatches for deep-loop route mismatches and repeated non-command-driven loop handoffs. It warns by default and supports opt-in rejection. | `tool.execute.before`, `event` for `session.created` |
| `mk-dist-freshness-guard.js` | Checks watched compiled outputs before risky Bash commands and at session creation. It invalidates cached diagnostics after relevant mutations and injects bounded stale-dist warnings. | `tool.execute.before`, `experimental.chat.system.transform`, `event` for `session.created`, `session.deleted`, `server.instance.disposed` and `global.disposed` |
| `mk-goal.js` | Persists session goals, injects active goal guidance, tracks lifecycle and usage signals, supervises optional continuation and exposes goal management tools. | `tool` for `mk_goal` and `mk_goal_status`, `experimental.chat.system.transform`, `event` for session, message, permission and question lifecycle events |
| `mk-mcp-route-guard.js` | Detects native external MCP calls that should route through an available Code Mode manual. It writes advisory logs only and never rejects a call. | `tool.execute.before` |
| `mk-post-edit-quality.js` | Correlates file mutations with completed edits, runs the matching post-edit checker under a bounded deadline and injects advisory findings on the next turn. | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` |
| `mk-skill-advisor.js` | Resolves prompt-time skill recommendations through the advisor bridge, injects a bounded brief, manages per-session caches and exposes prompt-safe plugin status. | `tool` for `spec_kit_skill_advisor_status`, `experimental.chat.system.transform`, `event` for `session.created`, `session.deleted`, `server.instance.disposed` and `global.disposed` |
| `mk-spec-gate.js` | Classifies file-mutation intent, injects the Gate 3 question and evaluates mutating tool calls against per-session gate state. It advises by default and supports opt-in denial for eligible writes and edits. | `experimental.chat.system.transform`, `tool.execute.before`, `event` for `session.created` and `session.deleted` |
| `mk-spec-memory.js` | Retrieves warm Spec Kit continuity through a bridge, injects a deduplicated continuity brief, manages lifecycle caches and exposes bridge status. | `tool` for `mk_spec_memory_status`, `experimental.chat.system.transform`, `event` for `session.created`, `session.deleted`, `server.instance.disposed` and `global.disposed` |
| `mk-speckit-completion.js` | Registers a read-only tool that merges inferred spec level, checklist completion, evidence gaps and placeholder completeness. It has no event or execution hooks. | `tool` for `mk_speckit_completion` |
| `session-cleanup.js` | Runs bounded worktree and hook safety checks when sessions start, injects any startup warnings and runs the cleanup script when the plugin host disposes the instance. | `event` for `session.created` and `session.deleted`, `experimental.chat.system.transform`, `dispose` |

The [`tests/`](./tests/) directory contains the Node test runner suites for these entrypoints. Some plugins have multiple focused suites and the directory also includes cross-runtime contract tests.

---

## 6. BOUNDARIES AND STATE

| Boundary | Rule |
|---|---|
| Exports | Each plugin file exposes one default plugin factory. Test surfaces attach to that function instead of using named exports. |
| Shared logic | Runtime-neutral policy, bridges and reusable helpers belong under the owning skill in [`../skills/`](../skills/). |
| Terminal output | Advisory plugins write bounded logs or inject context. They do not write warnings to standard output or standard error. |
| Enforcement | Most checks fail open. Only explicit policy guards may reject, and rejection remains controlled by their documented environment switches. |
| State ownership | A plugin or its shared core owns its state directory, retention policy and cleanup behavior. |
| Tests | Plugin tests stay in [`tests/`](./tests/) rather than beside auto-loaded entrypoints. |

Plugins and their shared cores may write runtime state under these skill-owned folders:

| State folder | Owner |
|---|---|
| `../skills/.goal-state/` | `mk-goal.js` stores active, archived and diagnostic goal state. |
| `../skills/.loop-guard-state/` | `mk-deep-loop-guard.js` and its shared dispatch-guard core store session counters and warning logs. |
| `../skills/.code-graph-freshness-state/` | `mk-code-graph-freshness.js` and its shared freshness core store pending refresh and scan coordination state. |
| `../skills/.spec-gate-state/` | `mk-spec-gate.js` and its shared gate core store per-session Gate 3 decisions and telemetry. |
| `../skills/.completion-sentinel-state/` | `mk-completion-sentinel.js` and its shared sentinel core store advisory deduplication state. |

These folders contain runtime state rather than plugin entrypoints. OpenCode does not auto-load their contents.

---

## 7. CONTROL FLOW

The main prompt-time flow is:

```text
User turn
   |
   v
System transform plugins
   |
   +--> Spec gate classifies mutation intent
   +--> Skill advisor injects routing guidance
   +--> Spec memory injects continuity
   +--> Code graph injects structural context
   +--> Goal plugin injects active goal context
   +--> Quality and freshness guards inject pending warnings
   |
   v
Model receives bounded combined context
```

The main mutation flow is:

```text
Mutating tool call
   |
   v
tool.execute.before
   |
   +--> Capture file path by callID
   +--> Evaluate applicable guards
   +--> Invalidate relevant freshness caches
   |
   v
Tool executes
   |
   v
tool.execute.after
   |
   +--> Recover correlated file path
   +--> Run bounded post-edit checks
   +--> Schedule warm code graph refresh
   +--> Record applicable audit telemetry
```

The main lifecycle flow is:

```text
session.created
   |
   +--> Initialize runtime readiness
   +--> Sweep stale plugin-owned state
   +--> Run startup safety checks
   |
session.deleted or host disposal
   |
   +--> Evict session caches
   +--> Archive or remove session state
   +--> Clear timers and volatile locks
   `--> Run bounded process cleanup
```

---

## 8. VALIDATION

Run the plugin regression suites from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Expected result: Node discovers the `*.test.cjs` suites and reports the passing and failing test totals. Treat any failing test as a validation failure.

Validate this README with the shared sk-doc validator:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/plugins/README.md
```

Expected result: the validator reports no blocking document errors.

See [`tests/README.md`](./tests/README.md) for the current suite inventory, helper layout and per-plugin coverage.

---

## 9. RELATED

- [`tests/README.md`](./tests/README.md): plugin regression suite documentation
- [`../skills/system-code-graph/`](../skills/system-code-graph/): code graph bridges and freshness policy
- [`../skills/system-deep-loop/`](../skills/system-deep-loop/): deep-loop dispatch policy
- [`../skills/system-skill-advisor/`](../skills/system-skill-advisor/): skill advisor bridge and runtime
- [`../skills/system-spec-kit/`](../skills/system-spec-kit/): continuity, spec gate, completion and dist freshness logic
- [`../skills/sk-code/code-quality/`](../skills/sk-code/code-quality/): post-edit quality routing
- [`../skills/mcp-code-mode/`](../skills/mcp-code-mode/): MCP routing policy
- [`../skills/cli-external-orchestration/cli-opencode/`](../skills/cli-external-orchestration/cli-opencode/): CLI dispatch audit core
