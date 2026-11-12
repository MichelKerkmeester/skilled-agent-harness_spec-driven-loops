# Iteration 5: Invocation mechanics — what each runtime can actually start

## Focus

Angle 5 (invocation mechanics): whether a model can start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot. Chosen after iteration 4 established the policy that a surface must express; this iteration asks what each runtime's delivery and command surface can carry.

## Actions Taken

1. Enumerated the command/prompt surface in every runtime mirror and measured per-mirror command counts.
2. Read the advisor hook reference's per-runtime delivery table and compared it with the hooks tree on disk.
3. Read the DSH adapter link's README.
4. Grepped the model-facing rules for any instruction that has the model type a slash command.

## Findings

1. Every runtime except Devin mirrors the command tree into a slash surface, but in different shapes: `.claude/commands` holds 45 markdown files in group directories; `.opencode/commands` symlinks whole groups to `.skilled/commands/*`; `.cursor/commands` holds 46 flat files; `.codex/prompts` 45; `.pi/prompts` 46; `.dsh/prompts` 45 [SOURCE: .opencode/commands/create:1]. Devin has no `commands` or `prompts` directory at all — only `agents`, `hooks`, `skills`, `repo-rules` [SOURCE: .devin/SYNC.md:1].

2. Devin is therefore the single runtime where a command cannot be typed even by the user; the only ways a Devin session reaches a command workflow are the advisor brief and a model following the command doc [SOURCE: .devin/README.md:39].

3. The advisor brief reaches seven runtimes in the tree — `claude`, `codex`, `cursor`, `devin`, `dsh`, `opencode`, `pi` — but the hook reference's per-runtime table lists six and omits DSH entirely, even though `.skilled/hooks/skill-advisor/dsh/prompt-advisor.mjs` exists and its README documents an `agent/pre-step` adapter registered through `.dsh/plugins/repo-guards` [SOURCE: .skilled/hooks/skill-advisor/dsh/README.md:19]. This is documentation drift, not a missing capability: the adapter is present and fails open.

4. Delivery channels are not interchangeable: Claude/Codex/Cursor/Devin emit `hookSpecificOutput.additionalContext` JSON, OpenCode appends to `output.system` through `experimental.chat.system.transform`, Pi sends a model-visible message, and DSH adds a notice on the operator step [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53]. One shared renderer (`renderAdvisorBrief`) feeds all of them, so brief wording is a single change point even though transports differ.

5. No model-facing rule anywhere instructs the model to type a slash command. `AGENTS.md` Gate 2 tells the model to use the hook brief and to run `node .skilled/bin/skill-advisor.cjs advisor_recommend …`, and its output line is `SKILL ROUTING: …` [SOURCE: AGENTS.md:69]. The deep-research skill states it "is invoked exclusively through `/deep:research:auto` or `/deep:research:confirm`" — a statement about user entry, not model entry [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:1].

6. The repository already has a precedent for the model executing an *entry point it was told about*: the advisor's outage fallback prints the literal `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` line, expecting the model to run it [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:590]. The precedent covers shell entry points, not slash commands.

7. The only `AGENTS.md` text that names a command bridge resolves a tie in the bridge's favour — "When the advisor's `command-spec-kit` bridge, keyed to `/speckit:plan`, `/speckit:resume`, `/deep:research` and `/deep:review`, matches alongside `cli-*` for iteration phrases, `command-spec-kit` wins" [SOURCE: AGENTS.md:90]. So the model-facing rules know bridge ids and slash keys, never a command-to-workflow instruction.

8. Because a command file is plain repository markdown and every workflow it routes to is also a repository file, a model can execute a command's workflow without the runtime expanding a slash — the command doc is the entry, the YAML/SKILL it names is the workflow. That path exists on all seven runtimes, including Devin, and is the only one that does [INFERENCE: from the mirror counts above plus the command files' router shape, e.g. .skilled/commands/doctor/skill-advisor.md:1].

## Answer to the invocation question

No runtime in this repository gives the model a tool that starts a slash command; commands are user-typed entry points, and Devin cannot even surface them. Two fallbacks remain, and they should be chosen by intent rather than by runtime: (a) **name it and ask** — the brief prints the runnable command and the model asks the user to type it; (b) **load and follow** — the model reads `.skilled/commands/<group>/<name>.md` and executes the workflow it names, which works everywhere. (b) is only legitimate when the user already asked for that outcome and the command's run-or-ask policy (iteration 4) says run; otherwise (a) is the correct move. The important design consequence is that the brief must carry the command string for both fallbacks, and that the doctor-only runnable map has no reason to stay doctor-only.

## Ruled Out

- "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one.
- "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief.

## Dead Ends

- Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command.

## Edge Cases

- Ambiguous input: "start a slash command" could mean user-typed invocation or model-initiated workflow execution. Selected interpretation: model-initiated workflow execution, since the research question is what a model does when the user did not type a command.
- Contradictory evidence: the hook reference's six-runtime table versus the seven adapters on disk. Resolved in favour of the tree (the adapter files exist and are registered through `.dsh/plugins/repo-guards`); the table is stale and is recorded as a documentation failure mode.
- Missing dependency: Devin has no command surface to inspect, so its behavior is inferred from its mirror contents and hook config rather than observed.
- Partial success: none.

## Questions Answered

- Can a model start a slash command by itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot?

## Questions Remaining

- 5 of 9 remain open.

## Sources Consulted

- .claude/commands, .opencode/commands, .cursor/commands, .codex/prompts, .pi/prompts, .dsh/prompts, .devin/
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- .skilled/hooks/skill-advisor/dsh/README.md
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- AGENTS.md
- .skilled/commands/doctor/skill-advisor.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q5 (invocation mechanics), Q6 partially (chat-only delivery surfaces)
- Questions answered: Q5
- Findings: 8, all new

## Reflection

- What worked and why: counting command files per mirror turned a vague "runtime parity" question into a table with one real gap (Devin, zero command surface) and one documentation gap (DSH missing from the hook table). Reading the DSH adapter README prevented a wrong claim that DSH has no brief delivery.
- What did not work and why: the first mirror count used `find` without following symlinks, so `.opencode/commands` reported 2 files instead of 45. Symlinked mirrors are the OpenCode shape; a non-following count under-reports by an order of magnitude.
- What I would do differently: read the hooks tree before the hook reference — the tree is ground truth and the reference is a summary that has already drifted once.

## Recommended Next Focus

Angle 6 (chat-only users): given that the brief reaches seven runtimes and no runtime lets the model type a command, compare the four candidate mechanisms named in the spec — advisor brief, `AGENTS.md` gate, hook, skill-to-command pointer, runner refusal — against the evidence already gathered, and name the one mechanism with the fewest new hand-maintained surfaces.
