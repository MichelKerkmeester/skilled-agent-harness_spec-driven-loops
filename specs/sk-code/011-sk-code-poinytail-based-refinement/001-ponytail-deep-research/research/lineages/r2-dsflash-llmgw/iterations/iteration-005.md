# Iteration 005

## Focus
The root framework: `REPO RULES.md`'s trigger router and the `AGENTS.md` it expands, against Ponytail's always-on instruction model and its portable rule copy.

## Actions Taken
- Read `REPO RULES.md` in full: preamble, precedence ladder, the 11-row trigger table, the 13-file index and the scope carve-outs.
- Swept `AGENTS.md` (296 lines) and `REPO RULES.md` for Ponytail's root-level doctrines: close-out disclosure, never-cut items, persona framing, adapter alignment and trigger coverage.
- Verified table coverage mechanically: every one of the 13 rule files appears in the trigger table, and each rule's own "fires when" maps to a row.
- Checked the close-out contract's two homes for a residual-risk clause and found none.

## Findings
1. **The close-out contract never discloses a residual risk. NEW.** Ponytail's closing line is two parts: what was skipped or not checked, and "any risk the user must know" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15]. The repo's close-out requires what ran, what is inferred, what only the operator can verify and what is not done [SOURCE: .skilled/repo-rules/evidence-and-proof.md:187] [SOURCE: .skilled/repo-rules/evidence-and-proof.md:194], and the framework line matches [SOURCE: AGENTS.md:296]. Neither names a known residual risk the operator must weigh, and the word "risk" appears zero times in `evidence-and-proof.md` and `communication-handoff.md`. The gap is narrow but real: a change can report honestly what was not verified while never saying what could go wrong because of it. Priority P2. Target: `AGENTS.md` §10 and `evidence-and-proof.md` §10.
2. **Accessibility is absent from the root framework and the never-cut floor is split. ALREADY-COVERED idea, NEW target.** Ponytail keeps one never-cut list beside its ladder: trust-boundary validation, error handling that prevents data loss, security, accessibility, hardware calibration, the ask [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:44]. The root framework carries no never-cut list at all; the floors are split across `prevent-overengineering.md` §5, `scope-discipline.md` §1 and the Four Laws [SOURCE: .skilled/repo-rules/prevent-overengineering.md:148] [SOURCE: .skilled/repo-rules/scope-discipline.md:44] [SOURCE: AGENTS.md:11]. The word "accessibility" appears in neither `AGENTS.md` nor `REPO RULES.md`, and in none of the 13 rule files (iteration 4). Priority P2; it pairs with round one's recommendation to add accessibility to the P0 tier [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:144].
3. **Ponytail's self-application clause is already implied by universal binding. ALREADY-ADOPTED.** Ponytail ends its rule file by saying it applies to agents working on the ponytail repo itself [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:32]. The repo's framework binds agent behavior through the Four Laws and its gates without scoping itself to human users [SOURCE: AGENTS.md:11] [SOURCE: AGENTS.md:49], and `REPO RULES.md` states the router is mandatory before the first write of the session [SOURCE: REPO RULES.md:3]. No action.
4. **The adapter-alignment rule is carried by the precedence clause. ALREADY-ADOPTED.** Ponytail keeps copied rule text aligned with its always-on file, and where hosts copy instead of loading skills the copy must match [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:47] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:49]. The repo avoids copies at the root and instead bounds every rule file: each expands `AGENTS.md`, and where they appear to disagree `AGENTS.md` wins and the file is wrong [SOURCE: .skilled/repo-rules/prevent-overengineering.md:33] [SOURCE: REPO RULES.md:74] [SOURCE: REPO RULES.md:29]. No action.
5. **The trigger table mechanically covers every rule file. VERIFIED, no gap.** All 13 files under `.skilled/repo-rules/` appear in the trigger table's Load column, and each rule's "fires when" section maps to a row: overengineering, scope, evidence, delegation, blast radius, root cause, uncertainty, answer-the-actual-request, communication, prose, decisions, handoff and hub routing [SOURCE: REPO RULES.md:38] [SOURCE: REPO RULES.md:52]. The no-trigger fallback ("`AGENTS.md` alone governs") is explicit [SOURCE: REPO RULES.md:18]. No action; recorded because a router with an unindexed file is the failure mode worth checking.

## Questions Answered
- Which Ponytail teachings improve the root `REPO RULES.md` and `AGENTS.md` framework, including the trigger-table load model?

The answer is one real gap (the residual-risk clause) plus the accessibility extension; everything else Ponytail carries at the root level is already adopted in a stronger form.

## Questions Remaining
- Which Ponytail teachings improve the sk-code hub core beyond round one?
- Which Ponytail teachings improve the sk-code shared layer and the quality/review modes beyond round one's adopted set?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Adding a compact never-cut list as a second root file.** The floors are deliberately distributed at their points of use; a second consolidated list would be a copy that drifts, which `REPO RULES.md` §4's scope discussion and the precedence clause exist to avoid. The accessibility extension is one line in the existing homes, not a new file.
- **Importing Ponytail's persona framing at the root.** Rejected in iteration 1 for the agent definitions; the root framework's enforcement tone is the same argument.
- **Replacing the trigger router with an always-on compact file.** The router's known failure (a missed trigger) is already countered by Gate 5, the load-before-action rule and the precedence ladder; a compact file would either duplicate the rules or drop their detail.

## Dead Ends
- No root-level Ponytail teaching was found that is not already carried in stronger form; the sweep confirmed rather than found.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- REPO RULES.md
- AGENTS.md
- .skilled/repo-rules/*.md (trigger coverage sweep; bodies read in iteration 4)
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md

## Assessment
- New information ratio: 0.4 (1 fully new: finding 1; 2 partially new: findings 2, 5; 2 reconfirmations: findings 3, 4)
- Questions addressed: key question 3 (root framework)
- Questions answered: key question 3

## Reflection
- What worked and why: treating the root docs as the last mile of an already-adopted stack kept the iteration honest; the two real findings both came from checking a contract's exact words (the close-out list) rather than from doctrine comparison.
- What did not work and why: an early plan to propose an always-on compact rule file died on reading REPO RULES.md §4, which explains the deliberate split and its carve-outs; the router is a considered design, not an oversight.
- What I would do differently: on heavily-adopted surfaces, compare word-by-word against the specific contract sections instead of scanning for themes; that is what surfaced the missing risk clause.

## Recommended Next Focus
The sk-code hub core: `SKILL.md`, `ROUTER.md`, `mode-registry.json` and `hub-router.json`, looking specifically for Ponytail teachings round one did not already settle.
