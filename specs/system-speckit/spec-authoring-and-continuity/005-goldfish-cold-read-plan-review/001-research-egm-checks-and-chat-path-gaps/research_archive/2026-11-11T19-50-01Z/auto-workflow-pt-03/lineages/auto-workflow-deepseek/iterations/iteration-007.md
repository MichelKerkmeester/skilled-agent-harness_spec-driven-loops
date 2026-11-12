# Iteration 7: Mechanism E — the session invokes the command itself when the advisor is confident

## Focus

Mechanism E: let the session run the command when the advisor is confident enough. This iteration tests the premise rather than the design — what the advisor actually recommends, what confidence it can reach, whether a command can be recommended at all from natural language, and what a session would have to hold to execute a workflow it did not invoke.

## Actions Taken

1. Read `AGENTS.md` Gate 2 and Gate 4 for the invocation thresholds and the advisor's command bridge.
2. Read the advisor's ROUTER decision tree and the scorer's confidence calibration constants.
3. Read the generated command-bridge inventory for the `/speckit:*` entries and their matching keys.
4. Measured the three workflow YAMLs and read the plan workflow's `execution_mode` default and its `child_dispatch` clause.
5. Checked `system-spec-kit`'s machine `RESOURCE_MAP` for any route to the command assets.

## Findings

1. **Skill invocation is already mandatory above 0.8, so half of the premise is false: recommendation already drives use for skills.** Gate 2 states "Confidence ≥ 0.8 → MUST invoke skill" [SOURCE: AGENTS.md:67], and the advisor's routing tree says "top recommendation above confidence threshold -> invoke that skill" [SOURCE: .skilled/skills/system-skill-advisor/ROUTER.md:83]. What is not automatic is the *command*, not the skill.

2. **The advisor cannot recommend `/speckit:plan` from natural language, because its command bridges are keyed on slash markers.** The `/spec_kit` bridge's matching keys are `/speckit:plan`, `/speckit:resume`, `/deep:research` and `/deep:review` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1987] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1997], and the per-subcommand entries use `slashMarkers` such as `/speckit:implement` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:2071]. A bridge fires *after* the user types the command; it never surfaces one.

3. **"When the advisor is confident" is narrower than it sounds: confidence is capped at 0.95 and ambiguity is detected on a 0.05 margin.** The scorer's constants include `hardCeiling 0.95` and `ambiguityMargin 0.05` [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:130] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:137], and the routing tree sends ambiguous top scores to "surface top candidates and ask or route with caveat" [SOURCE: .skilled/skills/system-skill-advisor/ROUTER.md:85]. [INFERENCE: based on this session's rendered brief, "Advisor: live; ambiguous: system-deep-loop 0.95/0.16 vs system-spec-kit 0.95/0.12 pass", two recommendations at the 0.95 ceiling still report as ambiguous, so a confidence-gated auto-invocation would fire on a tie.]

4. **So the mechanism lands on the recommended skill, and the recommended skill has no route to the workflow assets.** For a spec-writing request the advisor recommends `system-spec-kit`; its machine `RESOURCE_MAP` lists reference, template, validation, workflow, structure, debugging, CLI and config families and no `.skilled/commands/` path at all [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:185] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:295]. Mechanism E therefore collapses into a pointer inside the skill, which is mechanism B's carrier.

5. **A chat session that decided to execute the workflow would first have to hold 65 KB of YAML.** `speckit-plan.yaml` is 65,265 bytes (885 lines) [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:1], `speckit-implement.yaml` 60,098 bytes and `speckit-complete.yaml` 93,496 bytes, so executing the plan workflow alone is roughly 16k tokens of procedure before any packet work.

6. **The workflow's default mode is the one a chat session cannot satisfy, and its autonomous mode is the one it must not take.** `execution_mode.default: confirm` makes every checkpoint block run in order [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:16] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:19], which is four approval prompts a chat user never asked for; `auto` skips every `applies_to: confirm` block, which removes the folder-choice question that Gate 3 exists to force [SOURCE: AGENTS.md:72].

7. **The YAML already knows about dispatched children and resolves its checkpoints there.** Its `child_dispatch` line says that when `AI_SESSION_CHILD=1` marks a non-interactive worker bound to a lineage directory, Gate 3 is pre-resolved and the worker does not ask [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:52], and its step 7 checkpoint defaults to Skip under the same condition. A child can therefore run the workflow without stalling, which is the one environment where mechanism E is structurally safe.

8. **Nothing forbids a session from reading a command YAML, and Gate 4 already reserves the tie it would create.** Gate 4 says the advisor's `command-spec-kit` bridge wins over `cli-*` when both match [SOURCE: AGENTS.md:89], which shows the framework already arbitrates command-versus-tool routing; it has no rule for command-versus-chat.

9. **The cheapest version of mechanism E is one sentence in the skill, and its cost is the YAML read.** A line in `SKILL.md` or `ROUTER.md` saying "when the request writes `plan.md`, follow `.skilled/commands/speckit/assets/speckit-plan.yaml`" costs one line, and the session then pays 16k tokens for the procedure — the same order as the entire `AGENTS.md` plus `REPO RULES.md` combined. [INFERENCE: byte counts for `speckit-plan.yaml`, `SKILL.md` and `AGENTS.md` measured in iteration 9, combined with the workflow-read cost in finding 5]

## Ruled Out

- Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it.
- Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved.
- Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check.

## Dead Ends

- "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit.
- "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read.

## Edge Cases

- Ambiguous input: "the session invoking the command itself" was read as the agent following the command's owned workflow asset, not as synthesizing a user slash command.
- Contradictory evidence: none new; the confidence ceiling explains the observed ambiguity rather than contradicting it.
- Missing dependencies: no live `advisor_recommend` call was made in this lineage, because the call can write runtime state outside the lineage directory; the constants and the session's own rendered brief carry the claim instead.
- Partial success: none.

## Sources Consulted

- `AGENTS.md:67`, `:72`, `:89`
- `.skilled/skills/system-skill-advisor/ROUTER.md:83`, `:85`
- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:130`, `:137`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1987`, `:1997`, `:2071`
- `.skilled/skills/system-spec-kit/ROUTER.md:185`, `:295`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:1`, `:16`, `:19`, `:52`

## Assessment

- New information ratio: 0.85
- Questions addressed: For each candidate mechanism, what it costs and what it breaks — the advisor-driven-command branch; and the framing question of whether a recommendation is automatic use.
- Questions answered: none fully; the premise correction is recorded for synthesis.
- Novelty justification: the slash-marker keying, the 0.95 ceiling and the ambiguity tie are new and they correct the question's framing; the Gate 2 threshold was already in context.

## Reflection

- What worked and why: testing the premise before the design changed the answer. The question assumes a recommendation is not automatic use; the evidence says skill use is automatic and command recommendation does not exist, which splits one mechanism into a working half and a missing half.
- What did not work and why: looking for an auto-invoke switch. There is no switch to flip, because the advisor's contract stops at recommending a skill; everything past that point is the skill's text.
- What I would do differently: measure the carrier before ranking mechanisms. A 16k-token read is not a substitute for a 40-line card, and that ratio will decide the recommendation more than any behavioral difference.

## Recommended Next Focus

The runtime and child-dispatch matrix: for each of the seven runtimes and for a dispatched child, which of the five mechanisms is actually deliverable, and where the delivery is silent.
