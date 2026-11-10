# Iteration 5: Agents, subagents, commands and goal

## Focus

Angle 5: how this repo's `.skilled/agents/*.md` personas can be reached (subagents, presets, skills
or prompt inlining), how the nested command tree can be exposed, and whether the harness's goal and
plan support maps onto the repo's packet `goal.md` binding.

## Actions Taken

- Read the base bundle patch to establish what a headless profile actually mounts.
- Read the `agent-preset-registry`, `persona`, `tool-subagent`, `command-goal`, `goal`,
  `goal-round-driver` and `plan-mode` references.
- Read the subagent tool schema and the command-plane line in the architecture note.
- Compared against `.pi/prompts`, `.pi/agents` and `.hermes/prompts`.

## Findings

1. The base bundle already mounts the goal service, the goal round driver, `command-goal`,
   `plan-mode`, `tool-goal`, both in-process subagent providers, the subagent and subagent-control
   tools, the workflow engine and tool, `skill-filesystem` and `tool-skill`. Headless inherits all of
   it and disables only HMR, credentials, authorization and the DeepSeek account row, so delegation,
   workflows and goals need no extra configuration to be present.
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:315-453]
   [SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:35-46]
2. Agent identity in a headless dispatch is the `system-prompt` row's `personaPrefix`. Headless
   ships a one-line coding persona, and a `--patch` overlay can replace that prefix with an agent
   body, giving one persona per dispatch. There is no agent-file loader: nothing scans
   `.skilled/agents` or `.dsh/agents`. [SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:9-12]
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:521-526]
3. Presets are the declarative multi-composition mechanism: an `@deepseek-ai/dsh-agent-preset` row
   with `id` and `plugins`, mounted beside `agent-preset-registry`, with a `persona` row able to set
   the prefix and suffix for that composition only. Preset definitions are plugin rows, not scanned
   directories, and the registry is mounted by the web app, not by base or headless.
   [SOURCE: dsh-src/packages/preset/agent-preset-registry/README.md:26-41]
   [SOURCE: dsh-src/packages/preset/persona/README.md:24-35]
   [SOURCE: dsh-src/packages/bundle/web-app/cordis.patch.yml:598-599]
4. The `subagent` tool takes `description`, `prompt`, optional `name` and `cwd`; a child preset is
   selectable only through `agent_preset` when the tool is configured with a non-empty
   `allowedAgentPresets`, and there is no persona-file argument. A repo agent therefore reaches a
   subagent either as an inlined persona in the `prompt` or as a preset that must first be mounted.
   [SOURCE: dsh-src/docs/tool-catalog.md:2064-2110]
   [SOURCE: dsh-src/packages/subagent/tool-subagent/README.md:47-53]
5. Human commands are plugin registrations on `ctx.commands` that dispatch without a model turn;
   there is no filesystem command loader. `command-goal` states that headless and automation apps
   without a command adapter do not need the `/goal` command, so `.skilled/commands/**` cannot
   become native slash commands in a headless dispatch and must be composed into the prompt as
   templates by the dispatcher. [SOURCE: dsh-src/docs/architecture.md:155]
   [SOURCE: dsh-src/packages/goal/command-goal/README.md:12]
6. The goal service stores at most one goal per session, with compare-and-set updates keyed by id and
   revision, a default 256-round cap, and create/edit/pause/resume requiring a direct human request
   in a top-level agent turn; completing or blocking also works in an autonomous goal round. Nothing
   reads a `goal.md` file, so a packet goal binding needs either a plugin at session start or
   pre-step, or explicit instructions that make the model call `create_goal` with the packet goal's
   text. [SOURCE: dsh-src/packages/goal/goal/README.md:12-34]
   [SOURCE: dsh-src/packages/goal/tool-goal/README.md:12-18]
7. The goal round driver automatically continues an active goal while the agent is idle and the round
   allowance remains. In an unattended headless dispatch that is a real overrun risk: a goal created
   from the task could keep the process alive for up to 256 rounds, far past a fan-out lineage's
   per-iteration timeout. [SOURCE: dsh-src/packages/goal/goal-round-driver/README.md:12-30]
8. Plan mode is mounted in base, but `exit_plan_mode` presents the plan over the user-questions seam
   and fails closed when no interactive review exists; headless has no live approval-response
   channel. Plan mode must therefore stay off in unattended dispatches, and the exit tool is the
   first thing to disappear if a profile trims tools.
   [SOURCE: dsh-src/packages/plan/plan-mode/README.md:63]
   [SOURCE: dsh-src/packages/plan/plan-mode/README.md:93]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:100]
9. The Pi and Hermes precedents both expose commands as prompt templates
   (`.pi/prompts/<flattened-name>.md`, `.hermes/prompts/*.md`) and agents as mirrored files or
   persona skills. The harness has no `--prompt-template` or agent flag, so those two surfaces must
   be carried by the dispatch builder and the skill catalog, not by the runtime.
   [SOURCE: .pi/SYNC.md:26-34]
   [SOURCE: .hermes/SYNC.md:22-26]

## Ruled Out

- An agent-file loader or an `--agent` flag: none exists; personas come from the system-prompt row,
  presets or the prompt body.
- Native slash commands from `.skilled/commands/**`: the command plane is plugin-registered and
  headless has no adapter.
- Plan mode as an unattended gate: its exit path fails closed without an interactive review.

## Dead Ends

- Looking for a generic prompt-template loader: `tool-workflow` runs model-written JavaScript, not
  repo-authored prompt files, and Pi's `--prompt-template` has no harness equivalent.

## Edge Cases

- Ambiguous input: "agents as harness subagents" could mean the `subagent` tool or the subagent
  provider packages; both are recorded, and neither loads a persona file.
- Contradictory evidence: the agent preset registry is present in the source and used by the web app,
  but absent from base, so "presets exist" and "headless can select a preset" are different claims.
- Missing dependencies: no configured provider, so no live preset or goal round was exercised.
- Partial success: the mount inventory is confirmed from the base patch; the behavioral risks
  (goal rounds, plan review) are documented but not run.

## Sources Consulted

- `dsh-src/packages/bundle/base/cordis.patch.yml:315-453,521-526`
- `dsh-src/packages/bundle/headless/cordis.patch.yml:9-12,35-46`
- `dsh-src/packages/bundle/web-app/cordis.patch.yml:598-599`
- `dsh-src/packages/preset/agent-preset-registry/README.md:26-41`
- `dsh-src/packages/preset/persona/README.md:24-35`
- `dsh-src/packages/subagent/tool-subagent/README.md:47-53`
- `dsh-src/docs/tool-catalog.md:2064-2110`
- `dsh-src/packages/goal/{goal,tool-goal,goal-round-driver,command-goal}/README.md`
- `dsh-src/packages/plan/plan-mode/README.md:63,93`
- `dsh-src/docs/architecture.md:155`
- `.pi/SYNC.md:26-34`, `.hermes/SYNC.md:22-26`

## Assessment

- New information ratio: 0.90 (seven fully new findings, one that reframes the known Pi/Hermes
  prompt-template precedent as a missing harness feature)
- Questions addressed: Angle 5 agents, subagents, commands and goal
- Questions answered: How can this repo's agents, subagents, commands and goal binding be reached by the harness?

## Reflection

- What worked and why: reading the base bundle before the feature packages showed that headless
  already carries delegation, workflows and goals, which changes the integration from "build these"
  to "constrain these".
- What did not work and why: the preset documentation reads as if presets are universal, but the
  registry mount is web-only; the bundle grep was the only way to see that.
- What I would do differently: check the base mount list for every angle, since it is the single
  source of what a headless dispatch can actually do.

## Recommended Next Focus

Angle 6: plugins, hooks and guards, including which lifecycle seams exist and which of the 18 Pi
extensions must be ported, deferred or dropped.
