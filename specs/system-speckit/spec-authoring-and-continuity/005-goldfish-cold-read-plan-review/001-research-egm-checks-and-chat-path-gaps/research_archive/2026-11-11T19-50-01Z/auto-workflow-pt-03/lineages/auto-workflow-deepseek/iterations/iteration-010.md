# Iteration 10: Ranking, recommendation, smallest change set, and what not to build

## Focus

Questions 7 and 8: rank the five mechanisms, recommend one, name the smallest set of changes to existing files, and state what not to build. This iteration closes the lineage by scoring the five against the five criteria the earlier iterations established: reach, enforcement, token cost, Level 1 lightness, and change cost.

## Actions Taken

1. Consolidated the per-mechanism findings from iterations 3-7 into one scoring table.
2. Re-read the plan template's architecture fill note and the card's §4 statement that a fill note is the section contract.
3. Re-read the workflow's unconditional `document_all_decisions` rule and the card's §11 stop conditions.
4. Re-read the `ROUTER.md` intent signals and the `AGENTS.md` bypass-phrase line for the two one-line enablers.
5. Checked the repo-rules inventory size for the Gate 5 carrier option.

## Findings

1. **Mechanism B wins on four of five criteria and loses only on load reliability, which is itself a one-line fix.** Reach 7/7 (a file read), cost ~2.4k tokens in writing sessions only, Level 1 lightness inherited from the card's per-section Acceptance/Verify shape, and change cost one section. Its only failure is the keyword gate [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161].

2. **Mechanism D ranks second and should carry exactly one check, not the program.** It is universal, costs nothing per turn, and its rules are already level-scoped [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:81], but a new rule is a script plus a registry row and a new required anchor regrades the corpus [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:450].

3. **Mechanism C ranks third and is the right shape for a nudge, not for the check.** Tool-time delivery already exists in all seven runtimes [SOURCE: .skilled/hooks/README.md:343], it is advisory by default [SOURCE: .skilled/hooks/spec-gate/README.md:16], and it delivers nothing to a child [SOURCE: .skilled/hooks/spec-gate/README.md:24].

4. **Mechanism E ranks fourth and is mis-specified in the question.** Skill invocation is already automatic above 0.8 [SOURCE: AGENTS.md:67]; what does not exist is a command recommendation, because the bridges are slash-keyed [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1997]; and one runtime has no command surface at all [SOURCE: .devin/README.md:41].

5. **Mechanism A ranks last on change cost and enforcement at once.** It reaches 6/7, its marginal tokens are trivial, and it is a shipped product surface that is instruction rather than enforcement [SOURCE: AGENTS.md:296], with a fourth stop-and-ask surface on the same write [SOURCE: AGENTS.md:72].

6. **The check that the chat path is missing is the workflow's own unconditional rule `document_all_decisions`.** It appears in the plan workflow's ALWAYS list with no level qualifier [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:873], and the chat path's nearest equivalent is the authoring card's stop-and-ask list, which does not mention decisions [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:200].

7. **The card already declares that a fill note is the section contract, so the cheapest carrier is an existing fill note rather than a new section.** Section 4 says "Each section of your scaffold carries a fill note ... The note is the contract for that section" [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:86], and the plan template's architecture note already asks the author to "name what fails today without each component you add, or drop it" [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:84]. The decision requirement is one clause away from what that note already asks.

8. **The smallest change set is three one-line edits to existing files, no new file, hook, command or agent.** (a) extend the architecture fill note to require that every choice left to the implementer be named or resolved [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:84]; (b) add the write verbs `create`, `add`, `update`, `fix` to the PLAN and IMPLEMENT keyword lists so the card loads on an ordinary write [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:163]; (c) add `skip workflow` to the existing bypass-phrase line so the opt-out is one phrase [SOURCE: AGENTS.md:108]. A fourth candidate, if the operator wants the check to be visible at close, is one clause in §11's stop-and-ask list reusing its existing verify command [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206].

9. **What not to build is everything the ranking eliminated.** A new command or agent (the question already excludes it, and the command surface is missing on one runtime); a new hook concern (a core plus seven adapters plus a kill-switch row) [SOURCE: .skilled/hooks/README.md:45]; a new validator rule (a script plus a registry row, and it cannot read judgment) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3]; a new plan artifact (Level 1 has four required documents and no room for a fifth) [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773]; a chat-mode workflow variant (a second procedure that would drift from the first); a confidence-gated auto-invoke (the ceiling is 0.95 and ties are common) [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:130]; and any blocking gate at Level 1.

10. **The honest limit of the recommendation is that it lowers frequency, not the ceiling.** A fill-note clause and a keyword fix are instructions; neither proves a plan was read by anyone but its author. The one thing that could prove it is a fresh-context evaluator, which the packet's sibling lineage already found to be the real constraint, and which no mechanism in this ranking supplies without a dispatch it does not have. [INFERENCE: derived from the ranking in findings 1-5 and the validator's artifact-only input established in iteration 6]

## Ruled Out

- Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment.
- Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement.
- Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum.

## Dead Ends

- "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer.
- "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks.

## Edge Cases

- Ambiguous input: "recommend one" was read as one *carrier* per check, not one file to change; the three-line set is one carrier plus the two lines that make it reach and stoppable.
- Contradictory evidence: none new. The known Cursor dormancy and the Draft-token downgrade are both recorded and both reduce, not reverse, the recommendation.
- Missing dependencies: no runtime session and no live advisor call were exercised; the ranking rests on file evidence.
- Partial success: the empirical question — whether a fill-note clause reduces author-only plans — is not answerable from files and is left as the first measurable signal for a follow-up packet.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-plan.yaml:873`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:86`, `:200`, `:206`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:84`
- `.skilled/skills/system-spec-kit/ROUTER.md:161`, `:163`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:81`, `:450`, `:773`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3`
- `.skilled/hooks/README.md:45`, `:343`
- `.skilled/hooks/spec-gate/README.md:16`, `:24`
- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:130`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1997`
- `.devin/README.md:41`
- `AGENTS.md:67`, `:72`, `:108`, `:296`

## Assessment

- New information ratio: 0.6
- Questions addressed: How do the mechanisms rank, which one should be recommended, and what is the smallest set of changes to existing files? What should not be built?
- Questions answered: How do the mechanisms rank, which one should be recommended, and what is the smallest set of changes to existing files? What should not be built?
- Novelty justification: the ranking itself and the three-line change set are new; every supporting fact was established in iterations 1-9, so this iteration synthesizes rather than discovers.

## Reflection

- What worked and why: scoring against five criteria instead of one kept the answer honest. Mechanism D is free and universal and still cannot carry the check; mechanism B is keyword-gated and still wins because the gate is one line.
- What did not work and why: looking for a single mechanism that both instructs and enforces. None exists in this codebase at this cost, and the recommendation has to name that gap rather than paper over it with a combination.
- What I would do differently: read the fill-note mechanism in iteration 2. The card's statement that a note is the section contract would have moved the "smallest change" answer from "a new section" to "one clause in an existing note", which is the difference between a change an operator will accept and one they will defer.

## Recommended Next Focus

None: this is iteration 10 of 10 and the synthesis owns the consolidated answer. The open item for a follow-up packet is the empirical signal — whether the decision clause reduces plans that omit a decision, measured by the count of `Open question:` rows and the count of `[DEVIATION: ...]` markers in packets written after the change.
