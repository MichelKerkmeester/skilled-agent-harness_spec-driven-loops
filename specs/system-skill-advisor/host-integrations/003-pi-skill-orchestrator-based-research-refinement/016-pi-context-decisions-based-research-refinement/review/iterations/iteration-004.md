# Iteration 004 - Maintainability

## Dispatcher

- Run: 4 of 5, generation 2, lineage `restart`, session `2026-11-23T05:51:03.170Z`.
- Dimension: maintainability (D4), the last unreviewed dimension.
- Iteration number derived from the state log: three prior `type:"iteration"` records, so this is iteration 4, matching the dispatch.
- Operator focus: judged the third-round deep-loop offer gate and its Python copy from code and from a run of both copies, not from the 027 parity claim. Also checked what the lane removal left behind in the lane registry, comment hygiene over the 54 code and test files in scope, and test names.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:267-500` (offer-gate vocabulary, loop-ask patterns, stuck-run, past-run, writing-about, loop-question helpers).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4463-4641` (the Python copy of the same gate).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (27 cases), `runtime/tests/deep-loop-offer-cases.vitest.ts:15`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:1-106` and its history since the semantic lane removal (`cf702d3fb9e`).
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md:22`.
- Comment-id grep over every `.ts`, `.mjs`, `.cjs` and `.py` file in `reviewScopeFiles` (54 files); test-title grep over the same set.
- Runs read with output and exit status: a differential probe that loads `command-attach.ts` under Node 26 type stripping and `skill_advisor.py` under `python3 -I`, then runs `asksForLoopRun`, `isStuckRunComplaint` and `isWritingAboutTopic` against the Python functions on 32 prompts outside the fixture. Both exited 0. All 32 results agree between the two copies.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The loop-run ask does not fold a curly apostrophe, though its sibling helpers do, so "I’d like a research loop" gets no offer** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:476 -- `asksForLoopRun` only lowercases the prompt [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:475-476], and its want-lead vocabulary spells the contraction with a straight quote [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:455]. Three helpers in the same module fold `‘’` to `'` before they match: `isStuckRunComplaint` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:388], `isPastRunRead` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:400] and `isNoEditRequest`. The module's own comment at line 441 notes that many keyboards type the contraction with a curly apostrophe. The Python copy has the same gap: `asks_for_loop_run` calls `prompt.lower()` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4597], while `_fold_quotes` serves only the stuck-run and past-run checks [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4558-4562]. The probe confirms it in both copies: `i'd like a research loop on cache eviction` returns true and `I’d like a research loop on cache eviction` returns false. The cause is maintainability, because each helper normalizes its input itself and one of them was missed. The visible effect is a lost offer. The gate's design treats a lost offer as the cheaper error, so this is P2.
   Finding class: inconsistent input normalization across sibling helpers (mirrored in both runtimes)
   Scope proof: every `toLowerCase` site in the gate section of `command-attach.ts` (lines 223, 388, 400, 443, 476) was checked. 388, 400 and 443 fold the quote, and 476 does not. In the Python copy, `_fold_quotes` has two callers, and `asks_for_loop_run` is not one of them.
   Affected surface hints: `command-attach.ts` `asksForLoopRun` (or one shared normalizer for the gate). `skill_advisor.py` `asks_for_loop_run`. A curly-apostrophe case in `tests/fixtures/deep-loop-offer-cases.json` would lock both copies together.
   Case: the prompt `I’d like a research loop on cache eviction` with a typographic apostrophe gets no deep-research offer, while the same prompt typed with `'` does.

2. **The iteration-count comment says "why does it stop after ten iterations" stays a question, but both copies read it as a request for a run** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494 -- The comment above `ITERATION_COUNT` says a question that quotes a spelled count, "as in 'why does it stop after ten iterations', stays the question it was" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:493-498]. The question exemption only applies when `LOOP_QUESTION` matches, and that pattern needs a loop name within two words of the question verb [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:487-491]. Meanwhile `LOOP_COUNT` matches `ten iterations` on its own, because `after` is not one of the look-back words [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:320-323]. The probe returns `asksForLoopRun("why does it stop after ten iterations") === true`, and the Python copy agrees, since its `_LOOP_DIGIT_COUNT_RE` mirrors the same rule [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4550]. The code may be right and the comment wrong: the comment's sentence names no loop, so the question exemption was never meant to reach it. Either way, the comment's own example contradicts the behavior, and the next person who tunes the question rule will rely on it.
   Finding class: comment contradicts code (gate vocabulary documentation)
   Scope proof: checked the comment's literal example sentence. Its control `how many passes does it run`, the example in the `MULTI_PASS` comment, returns false as that comment says, so the `ITERATION_COUNT` comment is the only one that disagrees.
   Affected surface hints: the `ITERATION_COUNT` comment in `command-attach.ts`, or the question rule if the comment states the intended behavior. The mirrored note above `_LOOP_DIGIT_COUNT_RE` in `skill_advisor.py`. A fixture case pins whichever is chosen.
   Case: `why does it stop after ten iterations` returns true from `asksForLoopRun` and `asks_for_loop_run`, while the comment at command-attach.ts:493-497 states it stays a question.

Severity doctrine: loaded `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, which defines P2 as a maintainability follow-up. Finding 1 has real reach, because user prompts are typed input, but its harm is a lost offer that the gate's own design ranks as the cheaper error, so it is not raised to P1. Finding 2 changes no behavior.

## Traceability Checks

- `spec_code` (pass): 027 claims the offer gate holds in both runtimes, with parity kept by the shared fixture. Beyond the 27 fixture cases, 32 extra prompts aimed at alternatives the fixture leaves out all agree between TS and Python. Those alternatives are the want-lead forms, "how many" questions, the hyphen count, `rounds of` subjects, stuck runs without the deep keyword, past-run reads of `review-report.md`, writing-about explainers, and digit and spelled counts in questions. Evidence: [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:474-481] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4595-4604]. The two shared defects (findings 1 and 2) are agreement on the wrong answer, not drift.
- `feature_catalog_code` (partial, unchanged): the weights catalog entry matches the four live lanes at 0.42/0.28/0.13/0.12 [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md:22] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-12]. The route-receipt gap R3-P2-002 is still open.

## Integration Evidence

- Native gate and Python fallback: `runtime/lib/command-attach.ts` `asksForLoopRun` and `runtime/scripts/skill_advisor.py` `asks_for_loop_run`, which `_apply_deep_loop_offer_gate` calls at `skill_advisor.py:5367`. Both were exercised directly by the probe.

## Edge Cases

- Duplication as design: the Python file keeps a hand-translated copy of the whole gate, about twenty pattern constants, and says so [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4466-4473]. A Python lookbehind must be fixed-width, so the copies cannot share one source string. Parity rests on 27 behavior cases. The 32-prompt differential found no drift, so no finding is raised. The cost is that every vocabulary edit has to be made twice, by hand. The `LOOP_WORDING` data list in TS is spelled inline in Python's `_LOOP_REQUEST_RE` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509]. The two agree today.
- Lane removal residue: since `cf702d3fb9e`, the live and shadow default weights each sum to 0.95. Nothing requires them to sum to 1. The override validator checks only that each weight lies in [0, 1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:63-68], and the catalog documents the four values, so this is not raised.
- Test titles carrying ids (`T014 ... via the 005 comparator`, `005-REQ-009`, `T243-SA-*`) and the file name `projection-fallback-049-005.vitest.ts` predate this epic. Blame shows commits `304a830e7e59` and `4452d57a120a` and the `.opencode` paths, so they are outside epic scope.

## Confirmed-Clean Surfaces

- Comment hygiene: no spec, packet, phase, task or finding ids appear in comments in the 54 code and test files in scope. The three hits name the placeholder `specs/<packet>` as a path shape, which is a durable explanation, not a label.
- Lane registry after the removal: no `semantic_shadow` entry, no dead shadow-only lane, and the BM25 shadow lane is the only `SHADOW_SCORER_LANE_DEFINITIONS` row, behind its env flag.
- The env allowlist key asymmetry noted in iteration 2 has no wrong output (neither key is a scorer setting). A drift test guards it, so it is not raised again.

## Ruled Out

- TS/Python offer-gate drift beyond the shared fixture: 32 off-fixture probes agree in both copies.
- Lane weights left unnormalized after the semantic lane removal: no sum-to-one contract exists, and the catalog states the values.
- Ephemeral ids in code comments of the epic's files: none found.

## Next Focus

- Dimension: cross-dimension stabilization pass (all four dimensions now covered).
- Focus area: confirm or close the six open P2s (R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001, R4-P2-002) against HEAD. Check the receipt-guard catalog entry against the Vibe and Codex adapters. Run one more pass over the pasted-reply strip mirror (`prompt-policy.ts:244-273` against `skill_advisor.py:5053`) with off-fixture probes, the method that worked here.
- Reason: dimension coverage is complete. The last iteration should firm up the findings rather than open new surface.
- Rotation status: D1 to D4 done.
- Carry-forward: checklist_evidence and feature_catalog_code partial. Blocked directions are listed in the strategy.
- Required evidence: a rerun or reread at HEAD for each carried finding, with file:line.

Review verdict: PASS
