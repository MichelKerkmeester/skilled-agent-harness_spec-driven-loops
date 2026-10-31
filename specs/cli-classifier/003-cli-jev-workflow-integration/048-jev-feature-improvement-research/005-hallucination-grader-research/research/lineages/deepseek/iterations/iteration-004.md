---
title: "Iteration 4: Where else the same judgment pays off"
trigger_phrases: []
---
# Iteration 4: Where else the same judgment pays off

## Focus

Q4. Locate the surfaces inside `.skilled` where the D4 judgment shape — does this text name a flag, file or function that does not exist for the job? — would pay off, rank them by stake, and name where it does not fit.

## Actions Taken

1. Surveyed every "hallucination" mention in `.skilled` and read the review agent's output-verification contract.
2. Read the deep-review traceability protocol's core and overlay dimensions.
3. Read the sk-doc citation-drift-scan catalog entry (its scope and its own jev question).
4. Read the reviewer scorer's fixture contract and the 5-dim scorer's D4 seat.
5. Read the cli-classifier hub registry to see how a reusable judgment route is declared.

## Findings

1. **Review findings already promise the property the judgment measures; enforcement is self-attestation.** The review agent contract requires "All file paths mentioned actually exist (Read to verify; if not found, remove from scope)", "All issue citations reference real code with verified file:line locations", and "No hallucinated or false-positive issues — all findings traceable to source". Those are enforced by a self-validation questionnaire, not by an independent judge. A jev name-existence pass over the paths/symbols/flags a review cites would turn a promised property into a measured one, and the review output gates commits and fixes, so the stake is the highest of any surface here. [SOURCE: file:.skilled/agents/review.md:351,353,356] [SOURCE: file:.skilled/skills/sk-code/sk-code-review/SKILL.md:25,45] [SOURCE: file:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:113-118]

2. **The benchmark's reviewer-output grading is a second seat with fixtures already in place.** `reviewer-scorer.cjs` loads `kind: 'reviewer-prompt'` fixtures with `expectedVerdict`/`expectedFindings`, and the 21-fixture corpus already includes four reviewer fixtures. D4 already exists in the same 5-dim scorer. Extending name-existence grading to reviewer outputs is the same judgment in the seat directly beside the one measured in 047. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:46-51] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/ (reviewer-*.json)] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:53-58]

3. **Documentation already has an existence scan, but only for citation-shaped claims.** `cite-drift-scan.mjs` counts `<path>.<ext>:<line>` citations, resolves each against tracked files, refuses untracked/.env targets, and prints dead citations; it even runs its own jev question ("Does the cited code window still show what the citing sentence claims?"). A prose claim that a flag or function exists, phrased without a file citation, is outside its scope. That complement is exactly the D4 question, and applying it as an advisory lint over changed docs adds a guard where an author's only current check is care. [SOURCE: file:.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:19-31]

4. **Deep-loop evidence files are a high-volume, lower-stake surface.** Research and review iteration files cite `file:line`; dead citations are already caught for tracked docs by the drift scan, while never-existed targets are the complement again. The stake is lower than review findings because iteration evidence is read for synthesis rather than acted on directly, but the volume is high across every loop. [SOURCE: file:.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:21] [SOURCE: file:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:113-114]

5. **A reusable route already exists and is designed for new modes.** The cli-classifier hub registers exactly one transport today (`cli-jev`) and its own description says "The hub holds cli-jev today; future classifiers join as new modes". Every feature scorer in the 047 campaign hand-rolls its own jev question; a name-existence classifier mode would give the surfaces above one route and one measurement instead of N prompts. [SOURCE: file:.skilled/skills/cli-classifier/mode-registry.json:23,32] [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:3]

6. **Where the judgment does not fit.** Forward-looking planning documents (spec.md, plan.md, tasks.md) legitimately name files and symbols that do not exist yet; a name-existence judgment over them would flag the normal case and must not be applied as a defect check. And any adoption of the judgment over code answers must carry a populated allowlist of provided names, or it repeats the empty-allowlist false-positive trap documented in iterations 1 and 2 (34 of 47 honest rows flagged). [SOURCE: file:.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:23] [SOURCE: derived: iteration-1/2 reproduction]

**Answer to Q4 (ranked).** (1) Review findings (review agent, sk-code-review, deep-review `spec_code`/`checklist_evidence`): the property is already promised and the stake is highest. (2) Benchmark reviewer-output grading: same scorer, fixtures in place. (3) Documentation prose advisory lint: complements the citation-only drift scan. (4) Deep-loop evidence filings: high volume, lower stake. (5) Route the judgment through cli-classifier as a named mode rather than re-prompting per surface. Excluded by design: forward-looking planning docs.

## Sources Consulted

- `.skilled/agents/review.md` (§10 output verification)
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs`
- `.skilled/skills/cli-classifier/{SKILL.md,mode-registry.json}`

## Assessment

- **newInfoRatio: 0.75.** The review-contract and reviewer-fixture seats are new; the citation-drift scope refines an earlier assumption that docs lacked any existence check.
- **Confidence:** high for the cited contracts and fixtures; the payoff ranking is judgment from stake and enforcement evidence, stated as such.

## Reflection

- Worked: searching for the promise ("no hallucinated issues") found the enforcement gap in one read; the existing citation scan defined the complement precisely.
- Failed: nothing attempted failed.
- Ruled out: applying the judgment to planning documents, where naming the not-yet-existing is the expected case.

## Recommended Next Focus

Iteration 5: Q5 — what a default-on integration of the grader would need, cost, and risk, with the 024 wiring-precondition decision as the anchor.
