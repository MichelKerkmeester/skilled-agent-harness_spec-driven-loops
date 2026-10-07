# Iteration 14: Adversarial pass against the top recommendations

## Focus

Try to refute the load-bearing claims behind the top recommendations, especially the anchor-violation premise, the archive repair step, the sidecar gap, idempotency, reversibility, and the never-change-prose boundary. Record refutations and qualifications with both sources.

## Actions Taken

- Read the live `validateAnchorIntegrity` implementation in the orchestrator.
- Re-read `fix-dup-anchors.mjs` pairing logic against the validator's anchor checks.
- Traced the path-drift writers (`repair-derived` rederive versus `migrate-generated-json` description write).
- Checked whether the trigger index embeds the manifest data; checked the advisory workflow's freshness command.

## Findings

1. REFUTATION of iteration 4's validation premise: `ANCHORS_VALID` does NOT enforce `validation-rules.md` rule 3 ("No nesting"). The implementation checks only: no anchors found, duplicate OPEN ids, opens never closed, closes never opened. Nested anchors pass; a duplicated CLOSER also passes when the id is open somewhere. The template's nested `questions` anchor is therefore not an ANCHORS_VALID failure today, and iteration 4's claim that every new Level 2/3 packet "starts life with an anchor violation" is wrong as stated. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:698] CONFIRMED
2. The divergence is itself a finding: the validation reference documents a no-nesting rule the orchestrator does not implement (and a doc-vs-code mismatch in either direction is a defect: either the check is missing or the doc overstates). The template bug remains real for a different reason: name-based anchor extraction returns the wrong region, and the documented contract says nesting is invalid. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:389] CONFIRMED
3. R-014 safety check holds under scrutiny: `fix-dup-anchors.mjs` keeps the first pair per id and deletes a later pair only when it is glued to other markers AND overlaps another pair; an isolated later pair is renamed with a numeric suffix, and the canonical id survives. The deletion rule therefore cannot remove the only copy of a template-signature anchor that `heal-spec-docs` uses as provenance evidence, provided the rule is tested against every template's anchor set. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:60] CONFIRMED for the logic, INFERRED that the first pair is always the canonical one (holds for template order, worth a test)
4. R-005 needs a scope correction: `migrate-generated-json.ts` computes and writes `description.json` `specFolder` from disk, while `repair-derived.cjs`'s re-derive targets graph metadata; the archive post-step must run the step that owns description paths as well, or the rule can still fail on the description half. An end-to-end archive fixture test is the confirmation. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:358] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:89] CONFIRMED as separate writers, INFERRED that repair-derived alone does not settle the rule
5. R-029 survives with a nuance: the trigger index embeds a `manifestHash` key, so manifest content is partially covered by index freshness; the three fixture sidecars themselves are still neither staged by the rebuild workflow nor compared by the advisory `--check`, so the staging gap stands. [SOURCE: node read of trigger-index.json keys] CONFIRMED
6. Idempotency claims survive: `repair-derived` compares before writing and writes atomically; `upgrade-legacy` returns `unchanged` for an identical baseline; the phrase cleanup reports zero on a second run at corpus scale; `refresh-track-roots` does not rewrite a matching track. No counterexample found in the code read. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:442] CONFIRMED
7. The never-change-prose claim needs one honest exception: two repair paths edit authored content lines. `repair-derived.cjs` rewrites the implementation-summary "Spec Folder" table row (a recorded fact, defensible), and the phase 013 lane rule 7 changes implementation-summary.md's status to match spec.md (an authored assertion). The status alignment is a semantic edit, so an absolute "prose never changes" contract must either keep status conflicts reported or explicitly carve out status as a derived-from-spec fact. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task:14] CONFIRMED

## Ruled Out

- Claiming the scaffold violates ANCHORS_VALID: the implementation does not check nesting; corrected and recorded.
- Treating repair-derived alone as the archive post-move fix: the description write is a different tool's step; the archive post-step must run both (or the pipeline's migrate step).

## Dead Ends

- Expecting code and validation reference to agree on nesting: they do not today; the divergence is recorded as its own finding rather than assumed resolved.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: rule 3 versus the implementation is a genuine contradiction, recorded with both sources; the resolution belongs to the maintainer as a doc fix or a check addition.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task`

## Assessment

- New information ratio: 0.90 (6 of 7 findings are new qualifications or refutations; 1 confirms idempotency across tools)
- Questions addressed: all five, adversarially
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-039 | Resolve the anchor doc-versus-code divergence explicitly: either implement the documented no-nesting and duplicate-closer checks in the orchestrator (then fix the template), or remove rule 3 from the reference and keep the template fix on extraction-correctness grounds; do both in one packet so the contract has one owner | Q2, Q5 | orchestrator anchor check and validation-rules.md | S to M | Med; changing the check regrades the corpus, so it needs a baseline run first | Orchestrator, reference doc, template | Nesting passes today (orchestrator.ts:698); rule 3 forbids it (validation-rules.md:389) | CONFIRMED divergence | n/a | Revert the commit | Doc and check only; template markers |
| R-040 | Add an end-to-end archive fixture test: scaffold a packet, archive it, run the post-move step, and assert both `description.json` `specFolder` and `graph-metadata.json` `spec_folder` (plus the pointer) settle to the archived path; this proves the R-005 fix settles the whole rule, not half of it | Q1, Q2 | spec-kit CLI tests | S | Low; fixture test | Test file | Separate writers found in finding 4 | CONFIRMED writer split | Yes (test) | Delete the test | No |
| R-041 | State the prose boundary honestly: derived facts include recorded paths, levels and (arguably) the status cell aligned to spec.md; document that status alignment is an allowed derived edit or keep it reported; either way the contract should not claim prose is absolutely untouched while the lane rule edits a status cell | Q3, Q4 | repair/heal docs and the doctor presentation | S | Low; wording | Docs | Lane rule 7 changes implementation-summary status; repair-derived edits the Spec Folder row | CONFIRMED exception | n/a | n/a | Documentation only |

## Reflection

- What worked and why: reading the live anchor implementation rather than the reference doc caught a wrong premise from iteration 4 in one read; the adversarial pass earned its place.
- What did not work and why: iteration 4 cited the documented rule without checking the implementation; the lesson is that a reference doc is a claim, not a check.
- What I would do differently: for every rule-based claim, read the implementation first and the reference second.

## Recommended Next Focus

Iteration 15: produce the ranked recommendation table across all five questions and the final synthesis, reconciling the corrected anchor premise and the qualified recommendations.
