DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=review-of-synthesis; state_source=externalized_files; do_not_switch_mode=true

# Review step — adversarial review of a synthesis you did not write

Another model (Gemini 3.8 Flash High) synthesized a ten-iteration research run. You are a fresh
reviewer from a different model family. Your job is to try to break its report, not to agree with it.

A review that only praises the synthesis has failed. A review that finds a real defect and proves it
has succeeded, even if everything else in the synthesis holds.

## THE REPORT UNDER REVIEW

specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md

## THE PRIMARY SOURCES IT RESTED ON (the authority, not the report)

  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-001.md ... iteration-010.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-001.jsonl ... iter-010.jsonl
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/findings-registry.json
The two documents under audit:
  specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md
  README.md

You may read anything in the repository. Verification means opening the cited file or commit and
checking the claim yourself — a citation that resolves is not the same as a claim that is true.

## WHAT TO CHECK, IN PRIORITY ORDER

1. **Fabrication**: any claim, count, line number or commit in the report that the cited source does
   not actually support. Re-count the numbers rather than trusting them: mode counts, rule counts,
   template counts, symlink counts, the commit count since the changelog's last touch.
2. **Overclaiming**: statements asserted more strongly than the evidence allows, especially where an
   iteration hedged and the synthesis did not carry the hedge.
3. **Lost dissent**: places where iterations disagreed, the synthesis picked one, and either the
   choice is unsupported or the losing finding was material and got dropped.
4. **Missing material findings**: anything in the ten iteration files or deltas that changes a verdict
   or belongs in the apply list and does not appear in the report.
5. **Apply-list safety**: each row marked for application — would applying it make the document wrong?
   Each row marked do-not-apply — is that decision defensible?

## OUTPUT CONTRACT

Write exactly one file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/review-of-synthesis.md

Structure it as:
1. `## Verdict` — one of SOUND, SOUND WITH CORRECTIONS, or UNSOUND, plus two sentences saying why.
2. `## Claims that do not hold` — one entry per defect: the report's exact claim, what you observed,
   the evidence, and the corrected wording. If you find none, say so plainly and show which
   high-risk claims you tried and could not break.
3. `## What the synthesis got right that matters` — short; only claims you independently confirmed.
4. `## What it missed` — material findings absent from the report.
5. `## Apply-list corrections` — any row that should be added, removed or restated, with reasons.
6. `## Residual uncertainty` — what you could not settle and what would settle it.

Every entry carries `[SOURCE: relative/path:line]` or `[SOURCE: commit <sha>]`.

## WRITE AUTHORITY

You may write ONLY this file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/review-of-synthesis.md
The synthesis, the iteration artifacts and the two target documents are READ-ONLY. Do not edit,
rename, delete or move anything else. Do not run builds, tests or git writes.

## FINAL LINE

End with a single line: `Review complete: <n> defects, <n> missed findings, <n> apply-list corrections.`
