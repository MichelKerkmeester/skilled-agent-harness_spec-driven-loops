# Iteration 5: Invocation mechanics across seven runtimes

## Focus

Angle 5 (invocation mechanics): whether a model can start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot. The selected interpretation is model-initiated workflow execution, not user-typed invocation.

## Actions Taken

- Counted the command surface in every runtime mirror in this worktree.
- Checked the command tree's own definition of how commands are invoked.
- Checked the model-facing routing rules in `AGENTS.md` for any instruction to type a slash command.
- Checked the advisor's fallback directive for the repository's one model-executable precedent.
- Read the per-runtime delivery table in the advisor hook reference.

## Findings

1. Every runtime except Devin mirrors the command tree into a user-facing slash surface, in different shapes: `.claude/commands` holds 45 markdown files in group directories, `.opencode/commands` symlinks the source group directories, `.cursor/commands` holds 46 flat files, `.codex/prompts` 45, `.pi/prompts` 46, and `.dsh/prompts` 45. `.devin` contains agents, hooks, skills and repo-rules but no commands or prompts directory. [SOURCE: .claude/commands:1] [SOURCE: .opencode/commands:1] [SOURCE: .devin/SYNC.md:1]

2. The command tree defines commands as user-invoked: "Commands are invoked as slash commands ... Each command is a markdown file with YAML frontmatter that defines its description, argument hints, and allowed tools." The definition names no model-callable surface. [SOURCE: .skilled/commands/README.txt:19]

3. The model-facing routing rule in `AGENTS.md` Gate 2 tells the model to use the hook brief or run `node .skilled/bin/skill-advisor.cjs advisor_recommend ...` and to emit `SKILL ROUTING: ...`; it never tells the model to type a slash command. Gate 4 names the `command-spec-kit` bridge as a tiebreak, again not as an invocation. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:90]

4. The one model-executable precedent in the advisor is the outage fallback, which prints `route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` for the model to run. The precedent covers a shell entry point, not a slash command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:590]

5. A command file is a thin router of plain repository markdown: for example `.skilled/commands/doctor/skill-advisor.md` resolves a target from `_routes.yaml` and loads a target workflow YAML. A model that can read files and run tools can therefore execute the workflow without the runtime expanding a slash. [SOURCE: .skilled/commands/doctor/skill-advisor.md:12]

6. Two fallbacks cover every runtime: (a) name the command and ask the user to type it, which requires a user-facing slash surface; (b) load the command document and follow its workflow, which works on all seven runtimes including Devin because it needs only file reads and the model's ordinary tools. [INFERENCE: from findings 1-5]

7. The delivery channel is not the constraint: the advisor already delivers a brief on Claude, Codex, Cursor, Devin, DSH, OpenCode and Pi through one shared renderer, while the command mirrors exist on six of those seven runtimes. The missing piece is a model-callable command entry, not a context channel. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53]

## Ruled Out

- "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one.
- Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user.

## Dead Ends

- Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command.

## Edge Cases

- Ambiguous input: "start a slash command" could mean user-typed invocation or model-initiated workflow execution; the selected interpretation is model-initiated execution.
- Contradictory evidence: the command docs call commands user-invoked while the advisor tells the model about bridges; both are true at different layers, and the contradiction is resolved by the load-and-follow fallback.
- Missing dependencies: Devin has no command surface to observe, so its behavior is inferred from its mirror contents and its hook configuration.
- Partial success: none.

## Sources Consulted

- `.claude/commands`, `.opencode/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts`, `.devin`
- `.skilled/commands/README.txt:19`
- `AGENTS.md:63-69,90`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:590`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53`
- `.skilled/commands/doctor/skill-advisor.md:1-12`
- Prior packet lineage `pi-deepseek/iterations/iteration-005.md` (same packet, cross-checked against the tree)

## Assessment

- New information ratio: 0.5
- Questions addressed: Can a model start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what is the fallback where it cannot?
- Questions answered: Can a model start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what is the fallback where it cannot?

## Reflection

- What worked and why: counting the mirrors and reading the command tree's own invocation sentence turned a capability question into a structural one; if no runtime exposes a command tool, the fallback must be file-based.
- What did not work and why: an initial `.devin` file count was inflated by nested skill content; the directory listing, not the count, established that Devin has no command surface.
- What I would do differently: test the load-and-follow path on one command end to end, which would turn the inference into an observed behavior.

## Recommended Next Focus

Angle 6 (chat-only users): which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today.
