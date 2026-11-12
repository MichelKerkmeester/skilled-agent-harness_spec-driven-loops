# Iteration 6: How a chat-only request reaches a command workflow

## Focus

Angle 6 (chat-only users): which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today. The candidates are the advisor brief, an `AGENTS.md` gate, a hook, the skill pointing at its command, and a runner refusal.

## Actions Taken

- Read the advisor hook reference's statement of what the brief is and is not.
- Read the model-facing Gate 2 output contract and the PLAN-WORKFLOW LOCK.
- Read the runner-refusal prose in the deep-research skill.
- Read the hub `mode-registry.json` files for the command-to-mode mapping.
- Reused the measured zero-recommendation results from iteration 2.

## Findings

1. The hook is advisory and fails open. It "never replaces explicit skill loading, never persists raw prompt text, and never blocks the prompt on an advisor failure", so a hook cannot redirect a chat request into a command by itself. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21]

2. The brief names recommended skills; only a doctor command appears as a runnable `/doctor:` string. A non-doctor command therefore has no model-visible invocation in the one prompt-time channel that reaches all runtimes. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:43]

3. Gate 2 tells the model to use the brief or the advisor CLI and to emit `SKILL ROUTING: ...`; it never tells the model to run a command workflow. The ruleset routes to skills, so a chat-only request is steered toward a skill even when a command owns the workflow. [SOURCE: AGENTS.md:69]

4. The ruleset forbids hand-rolling a named workflow: PLAN-WORKFLOW LOCK says "NEVER silently hand-roll a substitute for a plan-named purpose-built workflow". It says nothing about discovering that an unnamed command owns the request, so the prohibition cannot fire when the user typed prose. [SOURCE: AGENTS.md:20] [SOURCE: AGENTS.md:27]

5. The brief is silent exactly when a chat-only user needs it: the measured planning and research prompts return zero recommendations at the shipped 0.8 threshold, so there is no skill line and no command line to act on. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:43]

6. A runner refusal exists only as normative prose. The deep-research skill says the loop "is invoked exclusively through `/deep:research:auto` or `/deep:research:confirm`" and never simulated with ad hoc dispatch, but that SKILL.md only loads after the skill has already been chosen, which is after the hand-roll decision. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:84]

7. The hub mode registries already bind modes to commands, and are the authoritative linkage to use. `sk-doc` records a `command` for every mode (for example `/create:skill`) and states that a command-bridge mode is "reached only via its command, never advisor-scored"; `system-deep-loop` records `/deep:research` on the research mode with lexical routing. A command-aware brief can therefore be generated from existing registries rather than from a new list. [SOURCE: .skilled/skills/sk-doc/mode-registry.json:13] [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:45]

8. Recommended mechanism: the brief carries `command`, `policy` and `ownerSkillId` from the hub registry, and `AGENTS.md` Gate 2 gains one rule: when the brief names a command whose policy is run, load that command document and execute its workflow; when the policy is ask, offer the command and wait. Rejected alternatives: a hook prompt rewrite (advisory-only and fail-open), a runner refusal (fires after skill selection), a skill that points at its command alone (requires the skill to load first and does not itself reach the model), and a static command list in `AGENTS.md` (45 entries that drift). [INFERENCE: from findings 1-7]

9. Contradicting evidence: on a runtime where the brief does not arrive, the mechanism must still work, so the Gate 2 rule should also say "if no brief arrived, ask the advisor CLI before hand-rolling". The hook reference lists all seven runtimes, but delivery can fail open to the directives fallback, so the static rule is the backstop. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21]

## Ruled Out

- A hook-only mechanism: the hook is advisory and cannot dispatch a command.
- A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll.
- A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget.

## Dead Ends

- Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named.

## Edge Cases

- Ambiguous input: "chat-only" could mean a runtime with no hooks; the selected interpretation is a user prompt with no slash command on any runtime, with the no-brief case handled as the backstop.
- Contradictory evidence: the deep hub says skills and commands are complementary surfaces over the same packets, while sk-doc says command-bridge modes are reached only via their command. Both are true per hub, and the brief must carry the hub's own routing class.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21,43`
- `AGENTS.md:20-27,69`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md:84`
- `.skilled/skills/sk-doc/mode-registry.json:13,40`
- `.skilled/skills/system-deep-loop/mode-registry.json:45`
- `spec.md:43-47` (measured zero recommendations)
- Prior packet lineage `pi-deepseek/iterations/iteration-006.md` (same packet, cross-checked)

## Assessment

- New information ratio: 0.6
- Questions addressed: Which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today?
- Questions answered: Which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today?

## Reflection

- What worked and why: the mode registries turned a design debate into a data question; the command already exists beside every mode, so the missing piece is exposure and a rule, not a new inventory.
- What did not work and why: looking for a runner refusal as enforcement failed because the refusal is prose that loads after the routing decision.
- What I would do differently: test the no-brief path on a runtime where the hook is disabled, to see whether the fallback directive gives the model enough to find the command.

## Recommended Next Focus

Angle 7 (skill and command linkage): which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and whether a skill recommendation should imply its command.
