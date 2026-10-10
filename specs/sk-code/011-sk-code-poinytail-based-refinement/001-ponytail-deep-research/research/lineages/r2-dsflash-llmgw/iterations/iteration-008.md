# Iteration 008

## Focus
Per-surface packets and the closure state of round one's defects: the Webflow checker (D1), the stale scenario (D3), the stdin deadline (D4), the precedence/Obsidian recommendation, and the retirement-note recommendation.

## Actions Taken
- Read the Webflow minified-runtime checker's callback handling and error-collection path.
- Checked the design-restraint playbook index row and the stack-folder validator scenario's expected output.
- Read the shared hook stdin reader and both post-edit adapters' use of it.
- Swept `stack-detection.md`, `ROUTER.md`, the hub `SKILL.md`, the surface-detection playbook and the canary corpus for Obsidian and precedence state.
- Looked for the known-bad test input the D1 fix recommends and for a retirement note for the retired router-sync guard.

## Findings
1. **D1 is fixed: the Webflow checker now collects deferred callback errors. VERIFIED CLOSURE.** The mock environment takes a `callback_errors` array, `run_callback` catches and records errors from `setTimeout` and `requestAnimationFrame` callbacks, and the result reports "N deferred callback error(s), first in `<source>`" [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:37] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:138] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:358]. A script whose deferred code throws now fails instead of passing on top-level execution alone.
2. **D3 is fixed: the index row and the expected output are current. VERIFIED CLOSURE.** The playbook index now points the Design Restraint row at `design-restraint/stack-folders-validator.md` [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:383], and the scenario's expected language list names all six folders — `config, javascript, python, rust, shell, typescript` [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md:33]. The stale `assets/<fake-surface>` row and the five-language expectation are gone.
3. **D4 is fixed: one shared stdin deadline, and the post-edit adapters use it. VERIFIED CLOSURE.** The shared reader declares `readStdin({ timeoutMs = 3000 })`, settles on stream end or deadline, and clears its timer and listeners [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:14] [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:44]. Both post-edit adapters now import it instead of carrying their own copy [SOURCE: .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:34] [SOURCE: .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:98] [SOURCE: .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs:23] [SOURCE: .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs:105].
4. **The precedence and Obsidian recommendation is closed across the surfaces. VERIFIED CLOSURE.** The detection reference carries an OBSIDIAN row, the correct order OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN, and the Motion.dev note as a peer resource rather than a surface [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:30] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:33] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:39]; the hub repeats the order and the Obsidian packet in its surface table [SOURCE: .skilled/skills/sk-code/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/SKILL.md:135]; `ROUTER.md` names Obsidian in its surface vocabulary and precedence text [SOURCE: .skilled/skills/sk-code/ROUTER.md:26] [SOURCE: .skilled/skills/sk-code/ROUTER.md:271]; the playbook now carries SD-004 and a dedicated `surface-detection/obsidian-detection.md` [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:358]; the canary corpus carries both Obsidian cases [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:1]; and the advisor graph references Obsidian [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1]. One gap remains from iteration 6: the hub's own lexical classes still lack restraint vocabulary, which is a different finding.
5. **The D1 fix still lacks its known-bad test input. NEW residual.** Round one asked for a known-bad input beside the checker fix [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:210]. The checker script carries the handling, but no companion test or fixture feeding a throwing deferred callback exists: a tree search for files naming "deferred" under the Webflow packet matches only the checker itself [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:14]. Round one's recommendation 2 is half closed. Priority P2.
6. **The retirement-note recommendation is not closed. OPEN.** Round one recommended that a retired check's umbrella script name its successor or record the gap and an owner [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:215]. The successor exists — `.github/workflows/routing-registry-drift.yml` is present and titled "Routing Registry Drift Guard" — but no in-repo retirement note was located; the only references to the retired router-sync guard live in old spec records. Priority P2.

## Questions Answered
- Which Ponytail teachings improve the per-surface packets (sk-code-webflow, sk-code-opencode, sk-code-obsidian, sk-code-quality) beyond round one's cited defects?

The surfaces' cited defects are all closed (D1, D3, D4, precedence/Obsidian). What remains from this family is the residual D1 test input, the retirement note, and iteration 2's missing ceiling-debt report in sk-code-quality.

## Questions Remaining
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Re-proposing the D1, D3, D4 and precedence recommendations.** All four verified closed in the current tree; repeating them would misreport the parent's remaining work.
- **Extending the stack-folder validator to scan Webflow assets.** Round one settled that the validator is right and the scenario was stale; nothing in Ponytail's material changes that.
- **Adding a second Obsidian probe battery by hand.** The advisor graph, canary corpus and playbook scenario now carry Obsidian; a separate hand-kept battery would duplicate coverage.

## Dead Ends
- The retirement-note search found no umbrella script carrying the retired guard's contract; the guard itself appears removed and the successor is the CI workflow.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: round one listed these as open defects; the current files show fixes. Files win; round one's lines are stale for this tree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md
- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md
- .skilled/skills/sk-code/shared/references/stack-detection.md
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/ROUTER.md
- .skilled/hooks/shared/hook-adapter-shared.cjs
- .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs
- .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- .github/workflows/routing-registry-drift.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md

## Assessment
- New information ratio: 0.92 (5 fully new: findings 1-5; 1 partially new: finding 6)
- Questions addressed: key question 6 (per-surface packets and defect closures)
- Questions answered: key question 6

## Reflection
- What worked and why: reading the actual defect sites instead of trusting round one's defect list converted four of five recommendations into verified closure facts, which changes the parent packet's remaining scope more than any new doctrine would.
- What did not work and why: the advisor "probe battery" could not be located as a named artifact; only the graph and canary corpus were verifiable, so the finding reports what exists rather than a probe claim.
- What I would do differently: for defect closures, read the fix target and its guard in the same pass; the D4 check took one call only because the adapters and the shared reader were read together.

## Recommended Next Focus
Original ideas and rejections: assemble the ideas Ponytail inspires but does not contain for the round-two targets, and record each rejected transfer with its reason.
