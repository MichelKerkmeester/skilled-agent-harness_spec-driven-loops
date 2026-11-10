# Iteration 004

## Focus
Repository rules: `.skilled/repo-rules/*.md` against Ponytail's doctrine and its portable rule copy, looking for doctrine the rules lack and for rules that already beat Ponytail.

## Actions Taken
- Read `prevent-overengineering.md`, `scope-discipline.md` and `root-cause-and-debugging.md` in full; read `evidence-and-proof.md` sections 10-11 and `answer-the-actual-request.md`'s structure.
- Searched all 14 rules for Ponytail's doctrine markers: reuse, reach, never-cut items, edge-case tiebreaks, move/merge preservation, decodability, accessibility, and gap disclosure.
- Compared the two Ponytail "Before you write" lists (the reach set and the break set) against the pre-write pass the rules already enforce.
- Confirmed the close-out disclosure the repo already requires is stronger than Ponytail's closing line.

## Findings
1. **The reach set is only half-enumerated in the pre-write pass. ALREADY-COVERED idea, NEW target.** Ponytail's brief lists every place the change must reach: callers, tests, fixtures, config, exports [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:14] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:21]. `prevent-overengineering.md` §2 asks for the owning module, one real caller and the contract when a change can break a caller [SOURCE: .skilled/repo-rules/prevent-overengineering.md:94] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:97] — the dangerous half, but not tests, fixtures, config or exports. `scope-discipline.md` §2 covers the same files from the other side (imports, signatures, generated files) [SOURCE: .skilled/repo-rules/scope-discipline.md:67] [SOURCE: .skilled/repo-rules/scope-discipline.md:70]. The extension is one sentence, and the rule already loads before the first new write. Priority P2. Target: prevent-overengineering.md §2.
2. **The decodability floor for minimal diffs is absent. NEW.** Ponytail's size rule has a readability guard: "The shortest working diff wins, once you know everything it must touch. A one-liner that needs decoding is not short" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:36]. The repo settles size by reversal cost — cheapest move first, with a climbing sentence [SOURCE: .skilled/repo-rules/prevent-overengineering.md:55] — and none of the 14 rules says a smaller diff that resists reading is not the smaller diff. This is the counterweight that keeps "build nothing" from turning into golf. Priority P2. Target: prevent-overengineering.md §1.
3. **Moved or merged code is not required to keep its error handling and validation. NEW.** Ponytail: "Code you move or merge keeps its error handling and validation" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:39]. `prevent-overengineering.md` §5 forbids using restraint to cut real error handling [SOURCE: .skilled/repo-rules/prevent-overengineering.md:150], but that protects against a deliberate cut, not against silent behavior loss during a rename, move or merge, which `scope-discipline.md` treats as a mechanical in-scope change [SOURCE: .skilled/repo-rules/scope-discipline.md:70]. Priority P2. Target: scope-discipline.md §2 or prevent-overengineering.md §5.
4. **No tiebreaker for equal-cost options on edge-case correctness. NEW.** Ponytail: "Between options of equal size, take the one that is correct on edge cases" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:40]. The reversal-cost order breaks ties by cost only, and the rule does not say what decides when two moves cost the same [SOURCE: .skilled/repo-rules/prevent-overengineering.md:58] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:66]. Without the tiebreak, the cheaper-looking option can win on taste. Priority P2. Target: prevent-overengineering.md §1.
5. **Accessibility is absent from the rules' never-cut set. ALREADY-COVERED idea, NEW target.** Ponytail's never-cut list names validation at trust boundaries, error handling that prevents data loss, security, accessibility, hardware calibration and anything the user asked for [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:44]. The rules carry the request, error handling and dependency floors [SOURCE: .skilled/repo-rules/prevent-overengineering.md:148] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:150] [SOURCE: .skilled/repo-rules/scope-discipline.md:44], but the word "accessibility" appears in none of the 14 rule files. Round one found the same absence in the sk-code standards and recommended adding it to the P0 tier [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:144]; the rules are the second untreated target. Priority P2.
6. **The root-cause doctrine already beats Ponytail's version. ALREADY-ADOPTED.** Ponytail's bug-fix rule (grep every caller, fix the root cause once in the shared code) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:38] is carried in fuller form: reproduce the exact symptom, locate the producer, trace its other consumers, fix at the source, re-run the failing check and the whole gate [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:52] [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:60] [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:61]. No action.
7. **Ponytail's closing line is already required, in stronger form. ALREADY-ADOPTED.** Ponytail ends every reply with what was skipped or not checked plus user risk [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15]. `evidence-and-proof.md` §10 requires a four-part close-out plus an explicit "what is not done" statement [SOURCE: .skilled/repo-rules/evidence-and-proof.md:187] [SOURCE: .skilled/repo-rules/evidence-and-proof.md:194]. No action. This makes the iteration-1 @code RETURN finding sharper: the repo rules already carry the disclosure duty; the agent's RETURN contract is the surface that does not.

## Questions Answered
- Which Ponytail teachings improve the repository rules (.skilled/repo-rules/*.md) without weakening scope, evidence, verification or communication floors?

The five gaps above are the whole answer. The remaining rules have no Ponytail counterpart worth transferring: Ponytail's communication doctrine is one closing line (already exceeded by `evidence-and-proof.md` §10), it has no delegation or routing rules, and its ambiguity handling ("a vague request gets the smallest version that does the core job") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:27] is already enforced by `answer-the-actual-request.md`'s no-silent-reinterpretation rule and `scope-discipline.md` §6's amendment-over-absorption.

## Questions Remaining
- Which Ponytail teachings improve the root `REPO RULES.md` and `AGENTS.md` framework?
- Which Ponytail teachings improve the sk-code hub core beyond round one?
- Which Ponytail teachings improve the sk-code shared layer and the quality/review modes beyond round one's adopted set?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Porting Ponytail's numbered ladder into the rules.** `prevent-overengineering.md` deliberately keeps a reversal-cost order rather than rung numbers and points to the code skill's ladder as the authority [SOURCE: .skilled/repo-rules/prevent-overengineering.md:68]; a second numbered ladder would create the "rung 2" ambiguity the file already warns about.
- **Adding Ponytail's test reflex to the rules.** Round one rejected it against the stronger P1 coverage floor [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:148]; `prevent-overengineering.md` already defers to that floor [SOURCE: .skilled/repo-rules/prevent-overengineering.md:128].
- **Making "build nothing" a default answer.** Ponytail's step 1 could be read as license to narrow the ask; `scope-discipline.md` §1 explicitly blocks that reading [SOURCE: .skilled/repo-rules/scope-discipline.md:57].

## Dead Ends
- The communication and delegation rule files carry no Ponytail doctrine to mine; their content is about reply quality and dispatch mechanics, which Ponytail does not cover.

## Edge Cases
- Ambiguous input: "the repository rules" could mean 14 files or only the loaded few. The iteration read the four with direct doctrine overlap in full and searched all 14 for every tested marker, so the answer covers the set.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/repo-rules/prevent-overengineering.md
- .skilled/repo-rules/scope-discipline.md
- .skilled/repo-rules/root-cause-and-debugging.md
- .skilled/repo-rules/evidence-and-proof.md
- .skilled/repo-rules/answer-the-actual-request.md
- .skilled/repo-rules/*.md (marker sweep across all 14)
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md

## Assessment
- New information ratio: 0.57 (3 fully new: findings 2, 3, 4; 2 partially new for a new target: findings 1, 5; 2 reconfirmations: findings 6, 7 — scored 0.5, 1, 1, 1, 0.5, 0, 0 over 7 = 0.57)
- Questions addressed: key question 2 (repo rules)
- Questions answered: key question 2

## Reflection
- What worked and why: sweeping all 14 files with exact marker strings before reading turned "which rules lack what" into a checklist of absences, and reading the two most-loaded rules in full supplied the mechanism-level context to phrase each gap as one sentence.
- What did not work and why: the marker sweep initially flagged "reuse" as a repo-wide absence, but reading showed reuse is deliberately delegated to the code skill's ladder and the workflow references; reporting it as a gap would have been wrong, so it was dropped.
- What I would do differently: treat any absence found by grep as a hypothesis until the surrounding file explains why it is absent; two of the four marker hits were deliberate delegations.

## Recommended Next Focus
Root framework: `REPO RULES.md`'s trigger table and the `AGENTS.md` it expands, against Ponytail's always-on instruction model.
