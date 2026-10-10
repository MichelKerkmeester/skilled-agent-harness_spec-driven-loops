# Iteration 007

## Focus
The sk-code shared layer and the two workflow modes: `shared/references/*`, `sk-code-quality` and `sk-code-review` against Ponytail's review mechanics — including a closure check on round one's recommendations that touch these files.

## Actions Taken
- Swept all 12 shared references for Ponytail doctrine markers and read the two implementation-shaping files (`workflow-implement.md`, `code-quality-standards.md`) at their doctrine sections.
- Read `sk-code-review`'s Phase 1-4 process, output contract, rules and removal plan asset.
- Checked round one recommendations 4 and 6 against the current files, item by item.
- Confirmed `sk-code-quality` still has no ceiling-debt report surface (reinforcing iteration 2's finding).

## Findings
1. **Round one's doctrine-pass recommendation is fully implemented. VERIFIED CLOSURE.** The always-loaded ladder now carries the reuse step as rung 2 and runs seven rungs [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:47] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:52], its never-cut sentence names accessibility [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54], the implement workflow carries the full reach list verbatim — "callers, tests, fixtures, config and exports" [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:51] — and its Pre-Write Restraint section repeats the ladder with the reuse step [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:66]. Round one's recommendation 4 and the accessibility half of its never-cut finding are closed in the hub's own doctrine; the remaining reach-list gaps live only in the outer layers (the @code checklist, the @orchestrate Task Format and `prevent-overengineering.md` §2). Priority P1 as a scope correction.
2. **Round one's review-output recommendation is fully implemented. VERIFIED CLOSURE.** The review mode now carries the `Not checked:` line with its exact placement and the status-line contract [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:359] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:380], the performance workload instruction inside Risk [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:344], the reworded consequence line as User impact [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:345], and the widened removal search covering callers, tests, fixtures, config and string references [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:57]. Priority P1 as a scope correction.
3. **The review finding contract still lacks a reproducing case. NEW for the mode.** Ponytail's rule is "Every finding needs a concrete case: 'this input or situation leads to this wrong result'. No case, no finding" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:59]. The mode's finding format requires Risk, User impact, Finding class, Scope proof and Recommended fix [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:344] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:350]; its NEVER list bans vague findings [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:413] but no field demands the input or situation that produces the wrong result. The Scope proof field proves class coverage, not reproducibility. Priority P1; iteration 1 filed the same gap for the `@review` agent, and this mode is the contract both share.
4. **Findings are not numbered across severity groups. NEW.** Ponytail numbers across all groups so a user can say "fix 2 and 5" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:82]. The mode numbers items inside each severity section only [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:352]; the Next Steps example addresses fixes by description [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:387]. Priority P2.
5. **Phase 1 never enumerates the connected code. NEW for the mode.** Ponytail reads the diff and then the code it touches — callers of every changed function, the functions it calls, the tests, the README — and greps every caller when a signature or behavior changes [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:21] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:24]. The mode's Phase 1 inspects the review target and loads standards [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:290] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:294], and Phase 3 analyzes for defects without a named read of the changed code's callers or tests [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:304]. Same idea as iteration 1's @review finding; the mode is where the reviewer's process is written. Priority P1.
6. **The test-effectiveness check is partially present. VERIFIED PARTIAL.** Round one's original idea 9 asked for a check that agent-written tests can fail for the right reason [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:193]. The verify workflow now requires confirming a new or modified test can fail for the right reason when feasible [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:127]. No fault-injection harness exists, which round one deferred; the check itself is present. Priority P2.

## Questions Answered
- Which Ponytail teachings improve the sk-code shared layer and the quality and review modes beyond round one's adopted set and defects?

Two new process gaps in the review mode (reproducing case, connected-code read), one addressability gap, two verified closures of round-one recommendations, and the shared layer otherwise carries no Ponytail gap.

## Questions Remaining
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects, and which of round one's surface recommendations are now closed?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Adding Ponytail's "at most 20 findings, say how many you left out" cap to the review mode.** The mode is findings-first with a removal plan and explicit severities; a cap would trade completeness for brevity, and the disclosure half is already served by `Not checked:`. Rejected for review; the mechanism stays available for bounded audit lists.
- **Adding a second plain-English output contract to the mode.** The repo-wide communication rules own prose; duplicating them in the mode would create the version drift `REPO RULES.md` exists to prevent.
- **Re-proposing the reach list against the hub's doctrine.** Closed by finding 1; the remaining targets are outer layers.

## Dead Ends
- The other shared references (error recovery, verification checklist, debugging checklist, performance loading, multi-agent research) yielded no Ponytail gap; their coverage is at or above Ponytail's level.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: round one reported the doctrine and review-output items as open; the current files show them implemented. The files win; round one's lines are stale, not wrong for their date.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md
- .skilled/skills/sk-code/shared/references/workflow-implement.md
- .skilled/skills/sk-code/shared/references/workflow-verify.md
- .skilled/skills/sk-code/shared/references/*.md (doctrine sweep, 12 files)
- .skilled/skills/sk-code/sk-code-review/SKILL.md
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md
- .skilled/skills/sk-code/sk-code-quality/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md

## Assessment
- New information ratio: 0.83 (4 fully new: findings 3, 4, 5 and the closure checks in 1-2; 2 partially new: findings 1, 2, 6)
- Questions addressed: key question 5 (shared layer and modes)
- Questions answered: key question 5

## Reflection
- What worked and why: re-checking round one's recommendation texts against the current files before mining for new gaps found the two biggest results of the iteration; on a fast-moving tree, a stale prior synthesis is itself a finding source.
- What did not work and why: the doctrine sweep of the remaining shared references returned nothing, which is the correct result but took budget; the two files that mattered were the two round one had already touched.
- What I would do differently: check recommendation closure first for every surface before comparing doctrine; it front-loads the scope corrections the parent packet actually needs.

## Recommended Next Focus
Per-surface packets: `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian`, including closure checks on round one's D1 and D3 findings and its precedence recommendation.
