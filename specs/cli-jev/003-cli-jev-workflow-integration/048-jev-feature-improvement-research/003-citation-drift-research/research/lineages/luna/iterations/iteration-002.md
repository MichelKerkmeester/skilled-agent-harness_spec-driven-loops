# Iteration 2: Improve accuracy, cost, and trust

## Focus

Use the sampling, label, scorer, and call-log implementation to propose evidence-backed improvements to semantic accuracy, total cost, and measurement validity.

## Actions Taken

- Read the sample construction and row identity fields, Jev call path, retry behavior, and score reporting.
- Checked the reported run's source commit and compared its Jev call/gate design with the current source.
- Traced where sentence/window content is sent and what the local call log stores; no measurement was rerun.

## Findings

1. **Make the gold set more representative and auditable.** The current draw uses a seeded selection from tracked skill docs, at most one pick per skill per pass, 20 live rows and 20 constructed rows (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:371-388,422-479`). The constructed rows are assigned `verdict: contradicts` and `labeler: construction` automatically (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:404-419`), while live labels are left for an operator (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:28`). Keep synthetic stress cases, but report them separately from live citations; enlarge the live set across claim types and skills; blind two human annotators to model/baseline outputs and adjudicate disagreements. A +60-line move may usually break support, but construction alone does not prove each moved window is truly contradictory, so validate a sample of those labels before treating them as gold.

2. **Use the row hashes as checks, not just metadata.** Drawn rows store a commit plus short hashes for the citing sentence and selected window (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:404-419`). `buildWindows` reads those locations at the stored commit but does not compare reconstructed text with `claim_sha12` or `window_sha12` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:574-585`). Recommendation: fail closed or mark a row stale when either hash differs, and preserve the full labels-file digest in the report. This guards against edited locators/labels that retain a plausible commit field.

3. **Measure generalization and uncertainty explicitly.** The label gate is exactly 40, and the keep rule reports a point estimate plus an exact paired sign-test p-value; the recorded result is tied to one commit and a fixed labels hash (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:70-82,674-707`; `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`). Keep the paired baseline, add a held-out commit or held-out skill split, report live and constructed strata separately, and show confidence intervals for precision, recall, accuracy, and paired gain alongside the p-value. The script already reports Brier score and per-call latency (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:748-767,1177-1188`); retain these and add uncertainty/calibration slices by claim type. The Brier score .1053 and zero observed false positives are useful, but 40 rows do not make those rates precise.

4. **Reduce Jev calls only through a measured staged policy.** The arm makes one auth test plus 3 `noul` calls per ready labeled row, with one retry when a call exits 4 (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1008-1015,1021-1036,1047-1071,1081-1105`). For 40 rows that is 121 planned calls before retries, matching the recorded 121 (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`). A cost-saving experiment is one initial call per row, with repeat calls reserved for probabilities near 0.5 or unstable rows; compare its accuracy, stability, coverage, and Brier score against the existing three-vote policy on a separate holdout before adopting it. A content-addressed cache keyed by commit, claim/window hashes, prompt, provider, and model could avoid duplicate calls, but would reduce independent rerun evidence and needs an explicit freshness/privacy policy.

5. **The deterministic census also has a measurable cost target.** The packet records about 171 seconds for the default zero-call scan (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:90,119`). `readCommittedLines` starts `git show` for a commit/path read (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:314-325`); `readWindow` calls that reader (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:338-344`), and `buildWindows` caches citing docs but reads each target window through `readWindow` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:574-585`). Inference: memoizing committed blobs by `(commit,path)` across census, sample, and window construction, then profiling the end-to-end scan, should reduce repeated Git process overhead without making a model call or changing verdict logic.

6. **Treat backend transmission as sensitive even when local logs are metadata-only.** The Jev arm constructs JSON containing the citing sentence, target path, and window and passes it to `jev noul` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1025-1032,1081-1087`). The checked-in call logger records row id, rerun, wall time, status, probability/flag, provider, version, and model rather than that JSON (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1059-1071,1127-1139`), while the packet says the call output contains doc text and stays outside the repo (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`). This is a provenance/retention discrepancy to resolve before default-on use. Irrespective of local logging, the request sends document content to the configured backend; preserve the tracked-file boundary, minimize/redact payloads where possible, and define retention and access controls.

7. **Do not count silent skips as successful semantic coverage.** The feature description says a gated Jev arm can skip for missing credentials, label gate, no headroom, or low power and that a skipped/stopped invocation exits 0 (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:30`). For any scheduled or default-on path, make the report distinguish completed, skipped, stopped, and partial; surface the reason and measured-row denominator in a status that cannot be mistaken for a semantic pass.

## Questions Answered

- **How to raise accuracy?** Improve and independently adjudicate gold labels; validate constructed drift labels; use a larger stratified live set and a held-out commit/skill evaluation; report live and constructed results separately; check saved row hashes against reconstructed text; report uncertainty and calibration by relevant strata.
- **How to lower cost?** Keep the zero-call structural scan; profile and cache committed file reads. For Jev, test a staged rerun policy and content-addressed cache on a holdout. Current cost is 121 planned Jev subprocess calls per 40 fully eligible labels, before retries; dollar cost is UNKNOWN without provider billing data.
- **How to make measurement more trustworthy?** Preserve commit and labels-file identity, validate per-row hashes, use blinded multi-rater labels and an adjudication record, add an independent holdout and uncertainty intervals, and report skips/coverage explicitly.
- **What content crosses the boundary?** The Jev request includes a citing sentence, path, and window. The checked-in call logger appears to retain call metadata rather than prompt text; the packet's statement about `calls.jsonl` should be reconciled with that code.

## Questions Remaining

- Which other `.skilled` tools make a semantic judgment that deterministic rules cannot settle?
- What would a default-on lifecycle, consent, privacy, latency, budget, and failure policy need to specify?

## Next Focus

Compare the goal-criteria semantic lint with other `.skilled` validation surfaces, then define a concrete default-on design and per-run call budget without changing the existing zero-call default contract silently.
