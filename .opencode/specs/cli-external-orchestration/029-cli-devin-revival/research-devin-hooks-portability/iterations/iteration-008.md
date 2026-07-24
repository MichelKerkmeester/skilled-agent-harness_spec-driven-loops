# Iteration 8: OpenCode plugins that cannot port 1:1

## Focus

Determine which OpenCode plugin registrations cannot be reproduced by Devin lifecycle hooks, and identify the non-hook alternative for each of the five plugin surfaces named by the research prompt.

## Actions Taken

- Read the repository plugin registry and event model in `.opencode/plugins/README.md:81-94,122-139`.
- Read the concrete registrations for `mk-code-graph.js`, `mk-goal.js`, `mk-skill-advisor.js`, `mk-spec-memory.js`, and `mk-speckit-completion.js`.
- Re-read the pinned Devin contract in `001-devin-contract-pin/implementation-summary.md:50-59`, including the eight lifecycle hooks, project configuration limits, MCP support, rules/skills, and CLI flags.
- Cross-checked the repository's daemon-backed CLI alternatives in `system-code-graph/SKILL.md:331-345` and `system-spec-kit/references/cli/daemon-cli-reference.md:23-67`.
- No production plugin, hook, adapter, configuration, or neutral core was changed.

## Findings

The five plugins are not 1:1 Devin hook port targets. Their policy and data paths remain reusable, but Devin hooks do not expose OpenCode's plugin factory, callable tool registry, mutable system/message/compaction containers, message event stream, or plugin disposal callback. The correct split is: use Devin hooks for bounded lifecycle translation, and use Devin MCP servers, rules/skills, or explicit CLI wrappers for the plugin-only surfaces.

### Per-plugin alternative path table

| OpenCode plugin | What it does in this repository | What Devin hooks cannot reproduce | Recommended alternative path | Port verdict |
|---|---|---|---|---|
| `mk-code-graph.js` | Registers `mk_code_graph_status`; loads a transport plan; mutates `output.system`; optionally appends synthetic message parts; adds a compaction block; invalidates per-session transport caches (`.opencode/plugins/mk-code-graph.js:359-512`). | Devin hooks cannot register the status tool, mutate OpenCode `system`/`messages`/`context` containers, or run the same pre-compaction callback. `PostCompaction` can inject bounded recovery context only after compaction, and has no equivalent synthetic message-part or plugin-cache lifecycle. | Expose the existing `mk-code-index` daemon through Devin `mcpServers` for graph queries/status. Use the full-parity `node .opencode/bin/code-index.cjs <tool>` CLI from skills, CI, or explicit scripts. A `UserPromptSubmit` adapter may add one bounded graph brief; a `PostCompaction` adapter may add recovery context, but these are separate adapters, not the OpenCode plugin. | **Cannot port 1:1**; core behavior is available through MCP/CLI, with optional hook adapters for context injection. |
| `mk-goal.js` | Persists per-session goals; injects passive goal guidance; tracks message and message-part usage, session status, permission/question blocking, idle verification, optional continuation, cleanup, and `mk_goal`/`mk_goal_status` tools (`.opencode/plugins/mk-goal.js:2793-2952`). | Devin has no callable plugin tool registry and no equivalents for OpenCode `message.updated`, `message.part.updated`, `session.status`, `permission.*`, `question.*`, or `session.idle` events. A Devin `Stop` payload does not provide the OpenCode client/session message lookup that the verifier and continuation path use, so automatic idle verification and continuation cannot be preserved inside a hook. | Put the goal protocol in a Devin rule/skill and persist goal state in a project-owned file. Provide explicit status/set/check commands through a CLI wrapper or MCP tool. If automatic continuation is required, an external orchestrator can use Devin's documented `--continue`/`--resume` flags; do not hide that loop inside a lifecycle hook. `UserPromptSubmit`/`Stop` adapters can provide bounded reminders or final checks only. | **Cannot port 1:1**; goal guidance can be adapted, but event-rich supervision and tool UX need a skill/CLI/MCP or external orchestrator. |
| `mk-skill-advisor.js` | Sends the current prompt to the advisor bridge, caches per-session results, injects a bounded brief through `experimental.chat.system.transform`, resets cache state on session/disposal events, and registers `spec_kit_skill_advisor_status` (`.opencode/plugins/mk-skill-advisor.js:780-901`). | Devin hooks have no per-turn OpenCode system-transform output, no plugin status tool, no OpenCode message-history fallback through `ctx.client`, and no host disposal event. `UserPromptSubmit` supplies the prompt and can call a script, but it is a transport adaptation rather than the same plugin registration. | Register the `mk_skill_advisor` daemon in Devin `mcpServers` and teach a Devin skill/rule when to call it. For automatic prompt-time briefs, a `UserPromptSubmit` script can invoke `node .opencode/bin/skill-advisor.cjs advisor_recommend --json ... --warm-only` and return `additionalContext`. Use the CLI directly for operator/CI diagnostics. | **Cannot port 1:1**; MCP/CLI is the primary replacement, with UserPromptSubmit injection as an optional adapter. |
| `mk-spec-memory.js` | Calls the Spec Kit memory bridge for a warm continuity brief, deduplicates and caches it per session, injects it on every OpenCode system transform, invalidates session generations, resets on disposal, and registers `mk_spec_memory_status` (`.opencode/plugins/mk-spec-memory.js:454-545`). | Devin hooks cannot inject on every OpenCode transform, expose the status tool, or reproduce OpenCode's in-process cache-generation and disposal lifecycle. They also cannot turn Devin's post-compaction payload into the same before-model transform container; a post-compaction adapter must emit its own Devin context envelope. | Register `mk-spec-memory` in Devin `mcpServers`; place the resume protocol in a Devin skill/rule. Use `node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"resume previous work","mode":"resume"}' ...` for explicit recovery, hooks/CI, and transport-down fallback. Add `UserPromptSubmit` or `PostCompaction` adapters only when automatic bounded context injection is required. | **Cannot port 1:1**; the memory service is portable through MCP/CLI, while per-transform injection and cache lifecycle need explicit Devin adapters. |
| `mk-speckit-completion.js` | Registers the read-only `mk_speckit_completion` tool over the neutral completion-state core; it merges inferred spec level, checklist evidence gaps, and placeholder completeness, with no event hooks (`.opencode/plugins/mk-speckit-completion.js:23-81`). | Devin hooks cannot register the callable OpenCode tool or provide its interactive argument schema. There is no missing lifecycle behavior to adapt; the incompatibility is only the OpenCode tool surface. | Use the existing parity shim `node .opencode/bin/speckit-completion.cjs <spec-folder> [--strict] [--project-dir <dir>]` (`.opencode/bin/speckit-completion.cjs:48-89`) from a Devin skill/rule or explicit script. If a callable in-session tool is needed, expose the neutral core through a Devin MCP server. | **Cannot port as an OpenCode plugin**; behavior is already portable through the CLI shim and can be wrapped as MCP. |

### Cross-cutting Devin boundary

The Devin contract is a command/prompt hook boundary: eight named lifecycle events, regex matchers, stdin JSON, and documented decision/context output (`001-devin-contract-pin/implementation-summary.md:50-59`). OpenCode's plugin contract is broader: `tool`, `tool.execute.before/after`, system and message transforms, compaction mutation, arbitrary event handling, and `dispose` (`.opencode/plugins/README.md:81-94`). Therefore a hook can invoke a neutral core or a daemon, but it cannot recreate the host-side registration semantics that make these five files OpenCode plugins.

### Native Claude import does not cover these plugins

`read_config_from.claude:true` is relevant to `.claude/` configuration and may provide a compatibility baseline for Claude-style command hooks, but it does not discover or execute `.opencode/plugins/*.js`. It cannot synthesize `mk_*` tools, OpenCode transform output objects, message-part mutation, session/disposal events, or the plugin factories themselves. For this focus, native import covers **zero of the five OpenCode plugin registrations**. It can coexist with explicit Devin adapters for Claude hook rows, but it is not a substitute for the non-hook alternatives above.

The repository already has the required escape hatches: the code graph, Spec Memory, and skill advisor each expose daemon-backed CLI surfaces alongside MCP (`daemon-cli-reference.md:23-67`), and the completion plugin has a dedicated CLI shim. That makes Devin's recommended architecture explicit: MCP for callable in-session capabilities, CLI for scripts/CI/fallbacks, and Devin skills/rules for persistent operating guidance.

## Questions Answered

- **Q2, focus refinement:** The five named OpenCode plugins and their registrations are confirmed. Their transport surfaces are `tool`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, `experimental.session.compacting`, OpenCode-only event types, and/or `dispose`.
- **Q4, focus slice:** All five are **cannot port 1:1 as OpenCode plugins**. `mk-code-graph`, `mk-skill-advisor`, and `mk-spec-memory` retain useful behavior through MCP/CLI plus optional context adapters; `mk-goal` loses event-rich supervision and automatic continuation unless an external orchestrator is introduced; `mk-speckit-completion` already has a CLI parity path.
- **Q5, focus slice:** Native Claude import covers none of these OpenCode plugin registrations. It cannot import plugin factories or OpenCode-only transport hooks.
- **Q6, focus slice:** The table above is ready as ADR-001 evidence for the OpenCode-plugin branch of the adapter decision: do not attempt a hook-only 1:1 port; select MCP/CLI/skill alternatives per plugin and add lifecycle adapters only where context injection or guard behavior is required.

Q1 and the remaining Q3 contract enumeration were not revisited in this iteration; earlier evidence remains authoritative.

## Questions Remaining

- Run an authenticated Devin `/hooks` inspection to verify the imported Claude-settings behavior and the exact handling of unsupported `PreCompact`/`async` entries.
- Confirm the live Devin `mcpServers` registration shape for the repository's daemon launchers, including relative working directory and environment propagation.
- Smoke-test the `UserPromptSubmit`/`PostCompaction` context envelopes and verify whether the CLI alternatives can remain warm-only without changing the fail-open behavior.
- Fold this five-row alternative table into the complete per-hook/per-plugin matrix and ADR-001 synthesis.

## Next Focus

Iteration 9 — validate the native-import and MCP/CLI boundaries where possible, then consolidate the full Claude-hook, OpenCode-plugin, and seven-guard-core matrix for ADR-001.

## SCOPE VIOLATIONS

None. Only this iteration narrative, the append-only state-log record, and this iteration's delta file are written.

## Assessment

`newInfoRatio`: **0.92**. This iteration turns the generic plugin-host mismatch into five concrete verdicts and assigns a repository-backed alternative path to each plugin. Confidence is high for the registration and CLI evidence; live Devin import/MCP behavior remains unverified because the pinned contract records no authenticated session.

## Sources Consulted

- `.opencode/plugins/README.md:81-94,122-139`
- `.opencode/plugins/mk-code-graph.js:359-512`
- `.opencode/plugins/mk-goal.js:2793-2952`
- `.opencode/plugins/mk-skill-advisor.js:780-925`
- `.opencode/plugins/mk-spec-memory.js:454-545`
- `.opencode/plugins/mk-speckit-completion.js:23-81`
- `.opencode/bin/speckit-completion.cjs:48-89`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md:50-59`
- `.opencode/skills/system-code-graph/SKILL.md:331-345`
- `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:23-67`
