# Iteration 9: Prior art from public agent-harness documentation

## Focus

Angle 9 (prior art): how other agent harnesses route a free-text request to a packaged workflow, from their public documentation.

## Actions Taken

- Read the Claude Code skills documentation for automatic versus direct invocation and frontmatter controls.
- Read the Claude Agent SDK skills page for the model-invoked versus user-invoked distinction.
- Read the Codex custom-prompts page and the Codex `AGENTS.md` guidance.
- Read the ChatGPT desktop slash-command reference for skill and prompt invocation.

## Findings

1. Claude Code presents one skill surface with two invocation paths: "Claude uses skills when relevant, or you can invoke one directly with `/skill-name`." The model-invoked path is the default, not an exception. [SOURCE: https://code.claude.com/docs/en/skills]

2. Claude Code exposes the run-or-ask decision as skill frontmatter, not as a runtime prompt brief. `disable-model-invocation: true` "prevent[s] Claude from automatically loading this skill" for workflows the user wants to trigger manually, and `user-invocable: false` hides a skill from the user while leaving it model-invocable. [SOURCE: https://code.claude.com/docs/en/skills]

3. The Agent SDK documentation states the distinction directly: skills are "Model-invoked: Claude autonomously chooses when to use them based on context", and the same skill is "User-invoked: you dispatch a skill directly by sending `/<name>` in a prompt." [SOURCE: https://code.claude.com/docs/en/agent-sdk/skills]

4. Claude Code has merged custom commands into skills: a file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy`, and existing command files keep working while skills add supporting files, invocation control and automatic loading. [SOURCE: https://code.claude.com/docs/en/skills]

5. Codex has deprecated custom prompts in favor of skills: "Custom prompts are deprecated. Use skills for reusable instructions that Codex can invoke explicitly or implicitly." Custom prompts required explicit invocation, lived in `~/.codex/prompts`, and were not shared through the repository. [SOURCE: https://developers.openai.com/codex/custom-prompts]

6. Codex's durable instruction layer is `AGENTS.md`. The documentation describes project guidance as persistent instructions for every session, and the file is the portable place for repo rules. [SOURCE: https://developers.openai.com/codex/guides/agents-md]

7. The ChatGPT desktop app exposes skills in the slash list and lets the model or user invoke skills explicitly; custom prompts appear as `/prompts:<name>`. The industry pattern is a model-invocable packaged workflow plus a persistent instruction file, not a prompt-time brief naming a slash command. [SOURCE: https://developers.openai.com/codex/reference/slash-commands]

8. Implication for this repository: the advisor brief is a useful discovery nudge, but the durable mechanism should mirror the platform pattern. Command metadata should carry an invocation policy equivalent to `disable-model-invocation` (model-invocable, user-only, or ask), and the command document should be the workflow body the model loads. The brief then only needs to name the command and its policy. [INFERENCE: from findings 1-7]

9. Contradicting evidence: host frontmatter is platform-specific. Claude Code reads `.claude` skill frontmatter; OpenCode, Pi, Cursor, Devin and DSH do not read Claude's frontmatter. A repo-level policy therefore must live in the repository's command metadata and be rendered by the advisor, not rely on host frontmatter alone. [SOURCE: https://code.claude.com/docs/en/skills]

## Ruled Out

- Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it.
- A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions.

## Dead Ends

- Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`.

## Edge Cases

- Ambiguous input: "prior art" could mean prompt-routing products rather than agent harnesses; the selected scope is the four harness surfaces named in the packet plus their official docs.
- Contradictory evidence: Claude Code and Codex differ on whether commands are first-class or legacy, but both converge on model-invocable skills plus a persistent instruction file.
- Missing dependencies: the web pages were fetched successfully; no local runtime was exercised.
- Partial success: none.

## Sources Consulted

- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/agent-sdk/skills
- https://developers.openai.com/codex/custom-prompts
- https://developers.openai.com/codex/guides/agents-md
- https://developers.openai.com/codex/reference/slash-commands

## Assessment

- New information ratio: 0.85
- Questions addressed: How do other agent harnesses route a free-text request to a packaged workflow, from their public documentation?
- Questions answered: How do other agent harnesses route a free-text request to a packaged workflow, from their public documentation?

## Reflection

- What worked and why: the Claude and Codex docs independently show the same convergence on model-invocable skills, which makes the repository's skill-plus-command duopoly look like a transition state rather than a novel design.
- What did not work and why: searching for a harness that routes free text through a prompt-time brief found none, so the repository's advisor-brief approach is the local exception.
- What I would do differently: fetch one more harness (Cursor or Devin) to test whether the convergence holds outside Anthropic and OpenAI, which would strengthen or qualify finding 7.

## Recommended Next Focus

Angle 10 (failure modes): over-triggering, command-versus-skill ambiguity, a child session starting commands by itself, loops, and the brief budget.
