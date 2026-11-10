# Iteration 6 — Plugins, hooks, and guards

- Focus: Angle 6, plugins, hooks, and guards
- Timestamp: 2026-11-05T22:33:36Z
- Findings count: 6
- Novelty: 0.95

## Focus

Map DSH's plugin loading and typed interception seams onto every repo-local Pi extension, classify each for this headless runtime, and choose a maintainable repo plugin shape.

## Actions Taken

- Read DSH's Cordis primer, CLI profile and plugin-management reference, tool and agent event references, compaction contract, and native guard group.
- Compared those capabilities with the Pi extension inventory, shared guard ownership, and the Hermes sync precedent.
- Cross-checked the current upstream Cordis and tool references on GitHub on 2026-11-05; the repository source clone remains the version-specific evidence for installed 0.2.2-rc.1.

## Findings

1. DSH plugins are Cordis functions or Service classes registered through a profile's Cordis composition; typed service events and reversible effects provide plugin lifecycle. For repo-local code, the source supports an explicit .dsh/cordis.patch.yml passed through --patch and relative plugin rows resolved beside the patch. The dsh plugin command instead installs dependencies into a DSH_HOME profile. There is no documented scan of a project .dsh/extensions directory. [SOURCE: dsh-src/docs/cordis-primer.md:5-13,29-45; dsh-src/apps/cli/reference/README.md:11-17,83-87; https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md (fetched 2026-11-05)]

2. The shipped guard package covers loop hygiene (repeat-tool reminders and declared per-tool timeouts), not this repository's spec, dispatch, or git policies. DSH's tool API has the needed native seams: pre-execute can allow, deny, cancel, or ask; execute wraps dispatch for timeout/metrics; post-execute can replace or block a result; result is an observer; and monotonic guards can add a final denial after pre-execute. Tool arguments cannot be rewritten because they are already logged and presented. [SOURCE: dsh-src/packages/guard/README.md:8-32; dsh-src/docs/subsystems/tools.md:458-468,531-563,769-881; https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/tools.md (fetched 2026-11-05)]

3. Prompt and agent lifecycle work has a different shape from Pi's named events: agent/pre-step is the sole waterfall before request derivation and carries the claimed user messages; agent/created and agent/disposed bracket an Agent's lifetime; and agent/turn-stopping is a serial end-of-turn seam. DSH compaction is native and records compaction/start, summary, and end markers while replacing the conversation surface. Those seams can host context injection and cleanup, but adapters must bind to DSH events rather than expect Pi input/session_start/session_compact names. [SOURCE: dsh-src/docs/subsystems/core.md:382-405,874-940,1013-1032,1091-1116; dsh-src/packages/compaction/compaction/README.md:12-51,73-82; .pi/extensions/README.md:65-80]

4. Recommended per-extension disposition for this headless mode (Port means preserve the shared guard core and write a DSH adapter; Port later means wait for the relevant runtime contract or baseline plugin; Not relevant means keep the responsibility with the outer executor):
| Pi extension | Disposition | DSH mapping or reason |
|---|---|---|
| dispatch-audit | Port | Observe bash/tool results through tools/result. |
| dispatch-preflight-lint | Port | Apply shared dispatch rules in tools/pre-execute. |
| spec-gate-classify | Port | Classify claimed prompt messages at agent/pre-step. |
| spec-gate-enforce | Port | Deny guarded filesystem/shell mutations before execute. |
| completion-evidence | Port | Evaluate the final turn at agent/turn-stopping. |
| git-preflight-advisory | Port later | Add a warn-only git tool adapter after shell-tool mapping is fixed. |
| git-message-gate | Port later | Enforce shared sk-git rules at the command's pre-execute boundary. |
| goal-context | Port | Bind packet goal context into system-prompt or pre-step assembly. |
| session-start-context | Port | Rehydrate context once an Agent/Session is created. |
| session-start-advisories | Port later | Select the host checks that make sense for each headless invocation. |
| session-stop-context | Port later | Map save/cleanup to Agent disposal only after shutdown semantics are pinned. |
| session-compact-context | Port later | Reuse DSH compaction and restore packet context through its summary/next-step seam. |
| session-relaunch | Not relevant | Keep process restart and continuation with the fan-out runner; this is not a model-call plugin action. |
| prompt-advisor | Port | Run the shared recommendation before request derivation. |
| post-edit-quality | Port | Inspect filesystem tool outcomes in tools/post-execute. |
| mcp-route-guard | Port | Apply route warnings or denials to MCP tool calls when the mode enables MCP. |
| task-dispatch-guard | Port | Guard child/subagent tool calls before dispatch. |
| classifier-injection-screen | Port | Add the shared fetched-content advisory after a relevant tool result. |
| decision-capture | Port later | DSH can record session events, but the headless ask-user interaction contract is not pinned. |

The inventory is grounded in the Pi bridge map; the dispositions are recommendations from DSH's documented seams, not live DSH plugin execution. [SOURCE: .pi/extensions/README.md:38-80,99-120; .pi/extensions/completion-evidence.ts; .pi/extensions/session-relaunch.ts; dsh-src/docs/subsystems/tools.md:531-563,769-881; dsh-src/docs/subsystems/core.md:874-940,1013-1032,1091-1116]

5. One repo-local bundle package is the smaller unit than one installable package per guard, provided it exports individually mountable Cordis plugin factories and keeps policy implementations owned by their existing shared cores. A .dsh/cordis.patch.yml can list the needed factories, while the sync manifest maps shared source to DSH adapters. This follows Hermes's repo-guards packaging precedent without combining policy code or forcing every profile to load every guard. The plugin market is a catalog feature, not the runtime event bridge. [SOURCE: .hermes/SYNC.md:20-33; dsh-src/docs/cordis-primer.md:9-13,37-45; dsh-src/apps/cli/reference/README.md:13-17,83-87; dsh-src/docs/user/guide/plugin-market.md:16-24]

6. Preserve each guard's error policy explicitly. Pi's current adapter contract wraps handlers and fails open on an adapter exception, while DSH's monotonic guard can deny but cannot grant permission; moving a shared decision into that final guard without an adapter layer could change failure behavior. The documentation establishes callable seams, not that this repo's guards have been loaded and exercised in DSH headless. A live plugin pin must test denied mutations, observer failures, prompt injection, and teardown before claiming parity. [SOURCE: .pi/extensions/README.md:99-120; dsh-src/docs/subsystems/tools.md:458-468,531-563,818-840; https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/tools.md (fetched 2026-11-05)]

## Questions Answered

- None; plugin and hook choices are now scoped, but the broader runtime representation and third-party plugin disposition remain open.

## Questions Remaining

- How should the provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be integrated as one sync contract?
- Which Pi community plugins have a suitable DSH native replacement or market package?
- What fan-out executor changes and complete cross-repository touch points are required?
- What constraints, unknowns, and ordered phases should guide implementation?

## Next Focus

Angle 7: third-party Pi plugin migration and dropping.

## Ruled Out

- Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts.
- Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery.
- Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams.

## Uncertainties

- DSH headless plugin load behavior has not been live-pinned with a repo-local relative plugin in the installed 0.2.2-rc.1.
- Whether decision capture is useful depends on whether the selected headless composition exposes user-question tools and durable decision inputs.
- The official GitHub master pages were fetched live but may differ from the version-specific source clone.

## Sources

- dsh-src/docs/cordis-primer.md
- dsh-src/apps/cli/reference/README.md
- dsh-src/packages/guard/README.md
- dsh-src/docs/subsystems/tools.md
- dsh-src/docs/subsystems/core.md
- dsh-src/packages/compaction/compaction/README.md
- dsh-src/docs/user/guide/plugin-market.md
- .pi/extensions/README.md and .pi/extensions/completion-evidence.ts and session-relaunch.ts
- .hermes/SYNC.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md (fetched 2026-11-05)
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/tools.md (fetched 2026-11-05)

## Scope Violations

- None.
