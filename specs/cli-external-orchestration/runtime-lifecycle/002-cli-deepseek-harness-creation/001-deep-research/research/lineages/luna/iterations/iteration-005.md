# Iteration 5 — Agents, subagents, commands, and goal

- Focus: Angle 5, agents, subagents, commands, and goal
- Timestamp: 2026-11-05T22:29:13Z
- Findings count: 6
- Novelty: 0.9

## Focus

Determine which native DSH surfaces can represent shared agent personas, Markdown command templates, multi-step workflows, and the repository’s packet-bound goal behavior.

## Actions Taken

- Read DSH preset, persona, subagent, command, workflow, goal, and plan package references and the shipped base composition.
- Compared the repository’s Pi and Hermes sync manifests and goal bridges.

## Findings

1. DSH’s agent-preset registry accepts declared composition rows; it does not scan directories or accept preset paths. A preset can mount dsh-persona with a prefix/suffix, so .skilled/agents/*.md requires generated Cordis preset rows or an explicit skill/prompt route; the file alone is not a DSH agent. [SOURCE: dsh-src/packages/preset/agent-preset-registry/README.md:44-48] [SOURCE: dsh-src/packages/preset/agent-preset/README.md:28-48,84-85] [SOURCE: dsh-src/packages/preset/persona/README.md:28-53]
2. DSH ships in-process spawn/fork subagent providers and a model-facing tool; a separate DSH SDK backend can launch a full child runtime with its own profile, ordered patches, and required isolated DSH_HOME. That SDK backend accepts route options but rejects independent child presets, structured output, and numeric depth caps, so do not assume every shared persona can be selected on an external child. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:363-403] [SOURCE: dsh-src/packages/subagent/README.md:25-35] [SOURCE: dsh-src/packages/subagent/subagent-dsh-sdk/README.md:28-55]
3. DSH slash commands are code registrations through ctx.commands.register(), and interactive adapters dispatch them directly without a model message. Markdown files under .skilled/commands are not a native command source; the headless, ACP, and JSON-RPC entry points have no slash-command adapter. Port selected commands as plugin handlers, prompt/skill templates, or wrapper behavior according to their existing semantics. [SOURCE: dsh-src/packages/interaction/commands/README.md:28-64] [SOURCE: dsh-src/packages/feedback/command-feedback/README.md:12,25-28] [SOURCE: .pi/SYNC.md:26-37]
4. DSH’s workflow tool accepts a plain JavaScript script with metadata and arguments, then coordinates subagents through agent(), parallel(), pipeline(), phase(), and log(); the shipped base composes workflow-ptc and tool-workflow. A Markdown command template would need a generator or wrapper that supplies the task as data or renders it into a workflow script. [SOURCE: dsh-src/packages/workflow/workflow/README.md:28-53] [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:408-414]
5. The native DSH goal service persists one current goal per session across restarts and the base composes the goal tool, driver, and command. Plan mode is a separate interactive approval flow. Neither package reference describes binding the repository’s shared spec goal.md; Pi and Hermes use explicit runtime bridges to the shared goal core, so DSH needs its own binding if packet goal semantics must carry across runtimes. [SOURCE: dsh-src/packages/goal/goal/README.md:28-56] [SOURCE: dsh-src/packages/goal/command-goal/README.md:28-64] [SOURCE: dsh-src/packages/plan/plan-mode/README.md:28-63] [SOURCE: .pi/prompts/goal-pi.md:1-34] [SOURCE: .hermes/SYNC.md:84-85]
6. Pi and Hermes demonstrate runtime-specific generated mirrors, but their outputs have different consumers: Pi’s agent and prompt files are generated in Pi’s dialect, while Hermes builds prompt stubs and skills plus a project plugin. For DSH, generate preset declarations and any flattened skill mirrors, then hand-author or generate command/goal plugins; a DSH SYNC.md should name each source and generated surface. [SOURCE: .pi/SYNC.md:8-45,64-87] [SOURCE: .hermes/SYNC.md:20-33] [SOURCE: dsh-src/packages/preset/agent-preset-registry/README.md:46-48] [SOURCE: dsh-src/packages/interaction/commands/README.md:30-64]

## Questions Answered

- None; the native adapter options are established but the broader provider/runtime/skill/agent/command/plugin/hook/MCP representation remains open.

## Questions Remaining

- How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 6: plugins, hooks, and guards.

## Uncertainties

- The SDK child provider’s lack of per-child agent presets is a documented package boundary. Whether the planned fan-out adapter can instead use an in-process preset or a fully prepared child profile is a later executor-design question.
- Headless has no slash-command adapter; whether a particular human command can be safely translated to a user-invocable skill depends on its argument and side-effect contract.

## Sources

- dsh-src/packages/preset/agent-preset-registry/README.md
- dsh-src/packages/preset/agent-preset/README.md
- dsh-src/packages/preset/persona/README.md
- dsh-src/packages/subagent/README.md and subagent-dsh-sdk/README.md
- dsh-src/packages/interaction/commands/README.md
- dsh-src/packages/workflow/workflow/README.md
- dsh-src/packages/goal/goal/README.md, command-goal/README.md, and packages/plan/plan-mode/README.md
- dsh-src/packages/bundle/base/cordis.patch.yml
- .pi/SYNC.md and .pi/prompts/goal-pi.md
- .hermes/SYNC.md
