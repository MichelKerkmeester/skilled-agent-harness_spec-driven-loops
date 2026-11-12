# Iteration 6: Mechanism D — enforcement carried by templates and validate.sh

## Focus

Mechanism D: let the templates and the validator carry the check. This iteration asks what the validator can see, which existing rule is the cheapest carrier, what a template change costs across the corpus, and which of the workflow's checks the validator structurally cannot hold.

## Actions Taken

1. Read the rule summary table and the `ANCHORS_VALID` rule body, including its required-anchor rule and its explicit refusal to check template order.
2. Read the validator registry's entry shape and measured its size.
3. Read `check-comment-hygiene.sh` and `check-placeholders.sh` sizes and the comment-hygiene rule's file list, to establish that a rule can read HTML comments.
4. Read the plan template's stamp and anchor set.
5. Read the authoring card's §9 validation loop for the repair bound, and `AC_CLOSURE`'s level scope.

## Findings

1. **The validator is the one check both paths run, so a rule added there needs no reach story at all.** The plan workflow's step 5 runs `validate.sh [SPEC_FOLDER] --strict` as its post-write gate [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:781], the chat path's ALWAYS list says "Run validate.sh before completion" [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:211], and the authoring card tells the author to run it once after the last edit [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:163]. Every runtime executes the same shell script, so this is the only mechanism with no cross-runtime delivery question.

2. **A rule is code plus a registry row, which is the expensive part.** The registry holds `rule_id`, `aliases`, `script_path`, `severity`, `category` and `description` per rule and is 15,641 bytes [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:10], and the rule scripts are shell programs of a few hundred lines each — `check-placeholders.sh` is 295 lines and `check-comment-hygiene.sh` is 102 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-comment-hygiene.sh:1].

3. **A rule can read HTML comments, so a comment-borne convention is mechanically detectable.** `COMMENT_HYGIENE_MARKER` scans `spec.md`, `plan.md`, `tasks.md` and `decision-record.md`, skipping fenced code, and rejects ephemeral finding markers inside HTML comments [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-comment-hygiene.sh:30] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-comment-hygiene.sh:30]. That is the closest existing proof that plan-comment content is inside the validator's reach.

4. **The cheapest structural lever is a template anchor, because `ANCHORS_VALID` already makes every template anchor mandatory for a v2.3+ document.** Rule 7 fails a document stamped v2.3 or later with `required anchor '<id>' is missing` for each anchor its rendered template requires [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449], and the plan template is stamped `plan-core | v2.4` with eleven anchors [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:42] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:46]. Adding one anchor to the template therefore adds one required section to every future plan with no new rule.

5. **But that lever regrades the whole corpus, which the rule's own next paragraph explains is the reason it refuses to check order.** Rule 8 says template order is never compared because "a template that moves a section would regrade the whole corpus on every commit" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:450]. A newly required anchor does exactly that to every existing v2.4 plan document, one failing packet at a time.

6. **Level scaling is native to the validator, so the Level 1 exemption costs a condition rather than a gate.** `AC_CLOSURE` is scoped to Levels 2, 3 and 3+ and "Level 1 keeps acceptance criteria inline in `spec.md` and is never gated" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:81], and `LEVEL_MATCH` already varies the required file set by level [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773]. A new rule that applies from Level 2 is the existing pattern, not a new one.

7. **The validator sees artifacts and never sequence, so it cannot hold the workflow's process checks.** It cannot know that `plan.md` was written before code, that seven checkpoints ran, or that the reader was anyone other than the author. The workflow's seven named validations [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21] and its two scored gates [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403] are process state; the validator's whole input is the finished folder.

8. **Its per-turn token cost is zero, which no other mechanism achieves.** `validate.sh` is executed, not read: only the `RESULT:` line and the failing rules enter context [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:169]. Compare `AGENTS.md`'s roughly 6.8k resident tokens from iteration 3.

9. **Its repair loop is bounded and already ends in a written question.** The card allows three rounds and then says "Stop after three rounds and write the rules and their errors in the packet's `goal.md`" [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:171]. A quality rule that cannot be fixed mechanically therefore terminates in the same `goal.md` open-question surface that iteration 2 identified as the cheapest recording place.

## Ruled Out

- A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose.
- Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure.
- Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code".

## Dead Ends

- "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape.
- "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do.

## Edge Cases

- Ambiguous input: "enforcement carried by templates" was read as both halves — a template-level requirement and a validator rule — because only the pair produces a failure.
- Contradictory evidence: none new. The Draft-token downgrade from iteration 2 is the known soft spot and it applies here too.
- Missing dependencies: the validator was not executed in this lineage, by design; its rule semantics come from the registry, the rule scripts and the contract.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:81`, `:449`, `:450`, `:773`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:163`, `:169`, `:171`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3`, `:10`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-comment-hygiene.sh:20`, `:30`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:42`, `:46`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:21`, `:403`, `:781`
- `.skilled/skills/system-spec-kit/SKILL.md:211`

## Assessment

- New information ratio: 0.85
- Questions addressed: For each candidate mechanism, what it costs and what it breaks — the template-and-validator branch.
- Questions answered: none fully.
- Novelty justification: the ANCHORS_VALID required-anchor lever and its corpus-wide cost are new; the fact that both paths run validate.sh was already established in iteration 1.

## Reflection

- What worked and why: reading the `ANCHORS_VALID` rule's two adjacent paragraphs answered both halves at once — the cheapest lever and the reason the maintainers declined the analogous one. Rule text that explains its own refusals is the best kind of evidence for a cost question.
- What did not work and why: estimating cost from the registry alone. The registry row is small; the script is not, and the corpus regrade is invisible in both. The real cost of mechanism D is in what it would make fail.
- What I would do differently: check the level-scope line of any candidate rule first, because Level 1 lightness is a stated requirement and a rule whose scope is already level-aware is the only kind that can satisfy it without new vocabulary.

## Recommended Next Focus

Mechanism E: the session invoking the command itself when the advisor is confident — what the advisor actually emits, what confidence it carries, and what "a session can run a command" means when no operator typed one.
