# Iteration 5: Verification pass, two corrections and one withdrawal

## Focus

Verification, as the previous iteration recommended: check each recommendation against the tests, the guards and the root-doc instructions that already exist, and correct any claim the check falsifies.

## Actions Taken

1. Read `AGENTS.md` for the policy vocabulary and the instruction that governs how a model takes an offered command.
2. Read the attach-guard tests for the small-edit gate and the changelog command.
3. Re-read `SMALL_EDIT_WORDING` and the correction-verb rule against the one row R2 was meant to fix.
4. Checked the fresh set for a real changelog request that R2 could break.
5. Re-checked the strategy's exact question text against the registry so the carry-over question resolves.

## Findings

1. The policy vocabulary is defined once, in `AGENTS.md`, not in the brief: `run` starts it now, `start` starts it without `:auto`, `ask` offers it in one question and waits. All five arenas load that file (`@AGENTS.md` in the arena clone), so iteration 3's "the brief has no legend" is corrected to "the brief depends on the root doc for its legend". [SOURCE: AGENTS.md:68]
2. R3 is withdrawn as a brief change. Adding a legend to the brief would duplicate an instruction every measured runtime already reads and would spend bytes on the one payload the lane measured at 306 bytes; the remaining risk belongs to any surface that delivers the brief without the root doc, which no arm measured. [SOURCE: AGENTS.md:68]
3. R2's mechanism is wrong as stated. The small-edit gate fires only when a listed small-edit phrase appears, and "Change the release date in CHANGELOG.md from 2025-11-02 to 2025-11-09." contains none of them: no typo, spelling, grammar, punctuation, wording, link or line phrase. Adding `/create:changelog` to the gated set would therefore still leave the offer. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:294]
4. The smallest correct change for that row is a single-value edit phrase in the small-edit list, such as a release date or a version number, beside the existing vocabulary. Confirmation: `fresh-decline-small-edit-02` prints no command, and `fresh-fit-16` ("Assemble the changelog for this release from the pull requests merged since the last tag") keeps `/create:changelog`, because it carries a creation verb and no correction verb. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:16]
5. The existing guard tests already protect the changelog request from a wider gate: "add a changelog entry for the typo fixes in the cli help" keeps its command because the creation-request check stands the small-edit gate down. Any new phrase must be added without breaking that case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:312]
6. R5 is confirmed by the root doc, not only by the arm: `AGENTS.md` already tells the model to take either path whole and never an improvised one. The dsh substitution (`/create:sk-skill` on a typo-check request) breaks an existing instruction, so no new wording is needed for it; the gap is compliance, and the arm is where it should be measured. [SOURCE: AGENTS.md:68]
7. The carry-over question's exact text carries backticks around `/deep:review`; iteration 2 recorded the answer with a paraphrase, so the registry kept the question open. This iteration records the exact text and the same answer: the prose refusal cannot reach the typed-command guard, and the offer survives on all five runtimes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-5/deep-research-strategy.md:38]

## Recommendations

| Id | Change | Status after verification |
|----|--------|---------------------------|
| R1 | Extend the mention reader to a command's own depth phrase | Stands. Four of eight decline rows; floors unchanged is the check |
| R2 | Add a single-value edit phrase, not the changelog command, to the small-edit list | Corrected: the gate needs the wording, not the command |
| R3 | Define the policy word in the brief | Withdrawn: `AGENTS.md` already defines it for every measured runtime |
| R4 | Measure Claude's start-policy silence after the listing fix | Stands. 0 of 10 starts, 0 capped |
| R5 | Split the decline target between offer fit and model path choice | Stands. The root doc already forbids improvisation, so the arm must measure compliance |

## Ruled Out

- A brief legend (R3): the root doc carries the definition and every arena reads it.
- Gating `/create:changelog` by command name (R2): the row carries no small-edit wording, so the gate would not fire.

## Dead Ends

- A test that pins "change the release date" as a small edit: none exists, which is why the row still draws an offer.
- A policy-legend gap on any measured runtime: all five read the root doc.

## Edge Cases

- Ambiguous input: "the brief has no legend" could mean the brief or the delivered context. Corrected reading: the delivered context has it; the brief alone does not.
- Contradictory evidence: iteration 3's finding against `AGENTS.md:68`. The root doc wins as the stronger evidence, and the correction is recorded rather than smoothed over.
- Missing dependencies: no arm measured a surface that delivers the brief without the root doc.
- Partial success: R1 and R4 remain unconfirmed inside a read-only lane; their confirmation paths are named.

## Questions Answered

- Why did an ask offer of `/deep:review` reach the refusal decline row `fresh-decline-refusal-02`, and what does a declined or refused offer do on each runtime?

## Questions Remaining

- None. All four lane questions are answered; the remaining work is the confirmation runs the recommendations name.

## Sources Consulted

- `AGENTS.md:68`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:294`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:312`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:16`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-5/deep-research-strategy.md:38`

## Assessment

- New information ratio: 0.40
- Questions addressed: the carry-over Q2 text and the verification of R2 and R3
- Questions answered: Q2 (exact text)

## Reflection

- What worked and why: checking the root doc before the render falsified one of this lane's own findings, which is the cheapest kind of correction the lane can make; a recommendation built on it would have spent bytes for nothing.
- What did not work and why: iteration 2's paraphrase of the question text cost the registry a match and left a question open for three iterations. Exact text is not cosmetic in this machinery.
- What I would do differently: copy the question text into every record from the strategy file, never retype it.

## Recommended Next Focus

None for this lane. Synthesis should report R1, R2 (corrected), R4 and R5, with R3 withdrawn and the two corrections stated as part of the evidence.
