# Iteration 9: Token cost per turn, Level 1 lightness and the one-sentence opt-out

## Focus

Question 5 and the lightness half of question 4: what each mechanism costs in tokens, measured from file sizes rather than estimated, and whether Level 1 and trivial edits stay cheap under each. The opt-out question is answered by finding the existing carrier rather than inventing a new one.

## Actions Taken

1. Measured byte sizes with `wc -c` for every file a mechanism would add to context, and every file the chat path already loads.
2. Converted to tokens at the conventional 4-bytes-per-token ratio and kept the measured bytes alongside.
3. Read the plan workflow's ALWAYS rules block for level-conditional rules.
4. Read `AC_CLOSURE`'s level scope and `LEVEL_MATCH`'s Level 1 file set.
5. Read `AGENTS.md`'s bypass-phrase line and the hooks index's kill-switch table for the two existing opt-out shapes.

## Findings

1. **The chat path already pays about 30k tokens before any workflow step; the card is only 2.4k of it.** Measured: `AGENTS.md` 27,372 bytes, `SKILL.md` 28,185, `ROUTER.md` 26,012, `quick-reference.md` 30,232, `spec-authoring-card.md` 9,699 — 121,500 bytes in total, roughly 30.4k tokens at 4 bytes per token [INFERENCE: byte counts from `wc -c`, divided by 4].

2. **The workflow read is the most expensive single addition by a wide margin.** `speckit-plan.yaml` is 65,265 bytes (~16.3k tokens), `speckit-implement.yaml` 60,098 (~15.0k) and `speckit-complete.yaml` 93,496 (~23.4k) against the card's 9,699 (~2.4k) [INFERENCE: same conversion]. Executing the plan workflow costs roughly seven times the card.

3. **An `AGENTS.md` gate's marginal cost is small and its fixed cost is the shipped surface.** A ten-line gate is about 130 tokens added to a file already resident at 27,372 bytes, so the per-turn delta is near zero; the cost iteration 3 found is the product surface and the Cursor gap, not tokens. [INFERENCE: `AGENTS.md` byte count measured here, divided by 4]

4. **A hook injection is the cheapest per event and the most expensive to maintain.** The advisor brief is one `Advisor:` line plus a four-line directives block, on the order of 90 tokens per prompt [INFERENCE: from the brief recorded in this session's hook context]; the spec-gate notice is three sentences delivered once per session. Against that, the concern needs seven adapters [SOURCE: .skilled/hooks/README.md:343].

5. **The validator costs nothing per turn.** It is executed, not read; only its `RESULT:` line and failing rules enter context [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:169]. Its 47,234-byte rule reference is read only when diagnosing a failure.

6. **The workflow is already level-aware in two places, so Level 1 lightness is a solved shape rather than an open question.** The plan workflow's ALWAYS rules include `use_checklist_for_verification_level_2_plus` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:877], and implement's step 4 opens with `Skip for Level 1, MANDATORY for Level 2+` [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:539].

7. **But one workflow rule is unconditional and is exactly the check the chat path lacks: `document_all_decisions`.** It sits in the same ALWAYS block with no level qualifier [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:873], which means the workflow asks for a decision record at every level while the chat path asks for none at any level.

8. **Level 1's document set is four files and no closure gate, which is what "light" has to mean.** `LEVEL_MATCH` requires `spec.md, plan.md, tasks.md, implementation-summary.md` at Level 1 [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773], and `AC_CLOSURE` is scoped to Levels 2, 3 and 3+ only [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:81]. Any step that adds a fifth required artifact at Level 1 breaks the level contract.

9. **The one-sentence opt-out already has a carrier: the bypass-phrase list.** `AGENTS.md`'s consolidated question protocol ends with "**Bypass phrases:** `skip context` / `fresh start` / `skip memory` / [skip] for memory loading" [SOURCE: AGENTS.md:108], so adding one phrase to that line is a one-word edit in a line the session already reads. The runtime-level equivalent exists too: every hook concern honours a `SYSTEM_<CONCERN>_DISABLED` switch [SOURCE: .skilled/hooks/README.md:45].

10. **Token cost is not the binding constraint for four of the five mechanisms.** The card, the `AGENTS.md` line and the validator all cost less than 3k tokens per writing session; only running the workflow itself costs 16k, and its cost lands on the one mechanism that already needs an operator. [INFERENCE: from the measured sizes in findings 1-6 above]

## Ruled Out

- Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact.
- Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does.

## Dead Ends

- "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost.
- "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes.

## Edge Cases

- Ambiguous input: "per turn" was read as the tokens the assembled prompt carries for a turn, since every runtime re-sends its context each call.
- Contradictory evidence: none. The sizes are direct measurements.
- Missing dependencies: no tokenizer was run; the 4-bytes-per-token ratio is stated as an inference, and the byte counts are the evidence.
- Partial success: the advisor brief's size is an inference from the rendered brief rather than a measured instrument constant.

## Sources Consulted

- `wc -c` over `AGENTS.md`, `REPO RULES.md`, `.skilled/skills/system-spec-kit/SKILL.md`, `ROUTER.md`, `references/workflows/spec-authoring-card.md`, `references/workflows/quick-reference.md`, `references/validation/validation-rules.md`, `templates/core/plan.md.tmpl`, `.skilled/commands/speckit/assets/speckit-plan.yaml`, `.skilled/commands/speckit/assets/speckit-implement.yaml`, `.skilled/commands/speckit/assets/speckit-complete.yaml`, `.cursor/rules/skill-routing.md`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:873`, `:877`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:539`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:81`, `:773`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:169`
- `AGENTS.md:108`
- `.skilled/hooks/README.md:45`, `:343`

## Assessment

- New information ratio: 0.75
- Questions addressed: What is the token cost per turn of each mechanism, measured from file sizes? And how does each mechanism keep Level 1 and trivial edits light, and how does a user opt out in one sentence?
- Questions answered: What is the token cost per turn of each mechanism, measured from file sizes? How does each mechanism keep Level 1 and trivial edits light, and how does a user opt out in one sentence?
- Novelty justification: the measured cost table is new; the level-conditional rule and the bypass-phrase carrier are existing facts newly connected to the question.

## Reflection

- What worked and why: measuring bytes before estimating tokens kept two claims separate — the hard number and the conversion. It also ranked the mechanisms differently than intuition would: the hook looked cheap and is maintenance-heavy, the command looked free and is the most expensive.
- What did not work and why: treating the workflow as a single unit. Its ALWAYS rules list has a level-conditional entry and an unconditional one, and the unconditional `document_all_decisions` is the very check the chat path misses, which makes it the cheapest possible thing to port.
- What I would do differently: read the workflow's ALWAYS rules block before the step bodies in any future run. Nine lines there summarize nine checks, and one of them was the answer to a question this lineage had approached from four directions.

## Recommended Next Focus

The ranking and the recommendation: order the five mechanisms against reach, cost, enforcement and Level 1 lightness, name the smallest set of changes to existing files, and state what not to build.
