# Iteration 6: Chat-only users — which mechanism actually reaches the command

## Focus

Angle 6 (chat-only users): compare the five candidate mechanisms the spec names — advisor brief, `AGENTS.md` gate, hook, skill-points-at-command, runner refusal — on the evidence already gathered, and name the one that works on every runtime without adding a fifth hand-maintained list.

## Actions Taken

1. Re-read the hook contract's advisory/fail-open guarantees.
2. Counted how many skills carry an explicit command-integration pointer.
3. Read the root-doc delivery manifest to establish what document every session loads.
4. Grepped the ruleset for existing anti-hand-rolling language as evidence of the failure being known.

## Findings

1. The brief is the only surface that fires on every prompt, and its own contract forbids enforcement: it "is advisory: it never replaces explicit skill loading, never persists raw prompt text, and never blocks the prompt on an advisor failure", and every adapter returns `{}` on error [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21]. So the brief can surface a command but cannot bind the model to run it.

2. `AGENTS.md` is the single always-loaded policy document: the agents-md manifest names `AGENTS.md` as `root_file` and `REPO RULES.md` as `router_file`, with a 16 KiB prefix budget and 21 anchors [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1]. There is no per-runtime copy (`CLAUDE.md`, `GEMINI.md`, `copilot-instructions.md` do not exist), so any binding rule has exactly one home.

3. Gates 2 and 4 are that home today, and they are skill-shaped: Gate 2 asks for the hook brief or an advisor CLI call and a `SKILL ROUTING` line; Gate 4's only command sentence resolves a tie in favour of `command-spec-kit` [SOURCE: AGENTS.md:63]. A command rule added here would be the second sentence in the file that names commands at all.

4. Skill-to-command linkage is nearly absent: exactly one SKILL.md in the tree carries a "Command Integration" table — deep-research's, which lists `/deep:research`, `/speckit:resume`, `/speckit:plan` and `/speckit:save` and their relationships [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:294]. The other skills have no pointer, and a skill only loads after routing, so a pointer can support execution but can never cause discovery.

5. Runner refusal exists only as normative prose, not enforcement: the deep-research skill says the loop is "invoked exclusively through `/deep:research:auto` or `/deep:research:confirm`" and never simulated "with ad hoc shell dispatch, nested CLI loops, direct `@deep-research` Task dispatch" [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:84]. A refusal only fires once that SKILL.md is in context, which is after the hand-roll decision would already have been made.

6. The ruleset already treats hand-rolling as a known failure mode: `AGENTS.md` carries PLAN-WORKFLOW LOCK ("NEVER silently hand-roll a substitute for a plan-named purpose-built workflow") and sk-git rule 16 forbids hand-rolling the publish path [SOURCE: AGENTS.md:13]. The gap the rules leave is discovery: they forbid substituting a known workflow, and say nothing about how a model learns the workflow exists when the user typed prose.

7. Combining the mechanisms yields a three-layer answer with no new list: the **brief** surfaces the command and its policy (iteration 3's contract addition), **`AGENTS.md`** binds the behavior in one sentence that points at the brief, and the **command file** is the executable workflow the model follows when it cannot type a slash (iteration 5). Each layer already exists; the work is contract + one rule line + one inventory field, not a new subsystem [INFERENCE: from the brief contract in finding 1, the root-doc precedence in finding 2, and the command router shape in iteration 5].

8. Rejected alternatives, each on evidence: hook enforcement contradicts the fail-open contract (finding 1); a new gate duplicates Gate 2, which already fires on every turn; a fifth registry would join the four hand-maintained sources that already drift (iteration 4, finding 5); and a runner refusal cannot fire before the runner loads (finding 5) [INFERENCE: from findings 1-5 of this iteration].

9. The concrete chat-only gap today: `/speckit:plan` on a plan-shaped prose prompt produces at best a `system-spec-kit` skill recommendation (iteration 2), and `system-spec-kit` carries no command-integration pointer (finding 4), so neither the skill nor the brief can lead the model to the plan workflow. That is the whole failure the packet is about, expressed in two existing artefacts [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:1].

## Answer to the chat-only question

The mechanism that reaches the command workflow on every runtime is **the brief carrying the command plus an `AGENTS.md` sentence that makes the brief actionable**, with the command file as the executable body. Concretely: `advisor_recommend` gains `kind`, `command`, `policy`, `ownerSkillId` (iteration 3); the brief renders `use {skill} → {command} ({policy})`; `AGENTS.md` Gate 2 gains one line saying that when the brief names a command whose policy is `run`, the model executes that command's workflow (loading the command doc), and when the policy is `ask`, it offers the command and waits. Nothing in that chain requires the runtime to expand a slash command, which is why it survives Devin and every future runtime.

## Ruled Out

- Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure.
- A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget.
- A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them.
- Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery.

## Dead Ends

- Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named.

## Edge Cases

- Ambiguous input: the spec lists five mechanisms as if they were alternatives; evidence shows they are layers with different reach (per-prompt vs per-session vs post-routing). Selected interpretation: treat them as a stack and name which one carries discovery.
- Contradictory evidence: the spec's premise that a rule about commands exists ("no rule says whether the model should run a surfaced command or ask first") is consistent with what I found — the only command sentence in `AGENTS.md` is a tiebreaker, not a policy. No contradiction.
- Missing dependency: skill count is approximate (~14 shared skills); the command-integration survey was exact (one file), which is the load-bearing number.
- Partial success: none.

## Questions Answered

- Which mechanism actually brings a plain-chat request onto the command workflow on every runtime: advisor brief, AGENTS.md gate, hook, skill-to-command pointer, or runner refusal?

## Questions Remaining

- 4 of 9 remain open.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- .skilled/commands/doctor/assets/agents-md-manifest.json
- AGENTS.md
- .skilled/skills/system-deep-loop/deep-research/SKILL.md
- .skilled/skills/sk-git/SKILL.md
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q6 (chat-only), Q7 partially (skill/command linkage)
- Questions answered: Q6
- Findings: 9, all new

## Reflection

- What worked and why: testing each candidate mechanism against a property it must have (fires every prompt, can bind, fires before the decision, already exists) eliminated three of five with cited evidence and left a stack rather than a winner. Counting command-integration tables turned "skills could point at commands" into "one skill does".
- What did not work and why: I expected a global rule about commands somewhere in the ruleset; grepping `hand-roll` found only the substitution prohibition, which assumes the workflow is named. That absence is itself the finding.
- What I would do differently: read the agents-md manifest first — knowing `AGENTS.md` is the single root doc with a 16 KiB budget would have framed the binding layer before I read the hook contract.

## Recommended Next Focus

Angle 7 (skill and command linkage): verify with a sample how many commands' metadata `ownerMode` names a SKILL.md the command workflow never loads, and whether a skill recommendation should imply its command. Start from the 19 metadata entries, whose `choreography` blocks name the resources each command loads.
