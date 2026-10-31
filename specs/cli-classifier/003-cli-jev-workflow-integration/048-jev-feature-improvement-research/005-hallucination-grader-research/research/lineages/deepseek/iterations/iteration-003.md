---
title: "Iteration 3: Making the measurement more trustworthy"
trigger_phrases: []
---
# Iteration 3: Making the measurement more trustworthy

## Focus

Q3. Audit the measurement's trust properties: pre-registration, label provenance and single-rater risk, corpus clustering against the sign test's independence assumption, family-wise significance, construct validity of the comparison, run stability, and reporting completeness.

## Actions Taken

1. Read the frozen keep rule and its requirements in the 024 spec (pre-registration, definitions, check order).
2. Read the 042 ADR-001 label method (delegated arbiter) and the 047 goal/acceptance-criteria rows that bind 024's labels.
3. Re-derived the uncertainty figures mathematically from the recorded counts (Clopper-Pearson intervals, Bonferroni thresholds, family-wise error).
4. Re-checked the report/requalify/reporting surfaces in `score-d4-agreement.cjs` against what was actually recorded.
5. Compared against the 027 rerun precedent recorded in the same 047 results table.

## Findings

1. **The keep rule is genuinely pre-registered.** The 024 spec fixes it verbatim: "Keep Rule (fixed 2026-09-29, before any model run)", with REQ-005 adding that changing it after the first model run voids every earlier verdict. The code carries the same rule as a printed constant, including the power floor ("a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031"). The recorded run applied it exactly (iteration 1 re-derived every check). [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:135,151-160] [SOURCE: file:score-d4-agreement.cjs:35,37,296-305]

2. **The labels are one delegated opinion by design.** 047's goal binds labels to "the operator or 042's delegated arbiter (a fresh Opus 5.5 medium labeler)"; 042's ADR-001 delegates each feature's row decisions to a fresh Opus 5.5 medium arbiter with blind drafts and an operator-vetoable digest. The 024 row records "delegated arbiter, blind, 56 rows". There is no second rater and no adjudication step on the one row where the grader disagreed with the label; the label set's reliability is therefore assumed, not measured. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/goal.md:47] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:44] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13]

3. **Rows are clustered, and the sign test treats them as independent.** The 42 honest rows are two runs of 21 fixtures; the 9 yes rows are one run of 9 fixtures; the discordant set is W+L=8 rows. The exact binomial behind p_win=2^-8 assumes eight independent fair trials, but the effective number of independent units is closer to the fixture count. The same clustering flatters the headline accuracy: 55/56 has a 95% Clopper-Pearson interval of [0.9045, 0.9995], while the sensitivity that carries the verdict, 8/9, spans [0.5175, 0.9972] (derived from the recorded counts; a perfect 9/9 would still only bound the lower end at 0.6637). The report prints one accuracy-style column and no per-class interval. [SOURCE: file:~/.skilled/.labels/024-labels.jsonl] [SOURCE: derived: Clopper-Pearson on recorded counts]

4. **The significance is per-column, not family-wise.** 047 measured 15 features in the same campaign, on top of the parent's 23 Jev integrations. A strict Bonferroni threshold is 0.003333 at k=15 and 0.002273 at k=22; p_win=0.00390625 sits above both. Across 15 independent tests at nominal 0.05 the chance of at least one false keep is 0.5367 (derived). The pre-registered per-scorer rule and the five-win floor mitigate cherry-picking, but the keep should be cited as a per-column nominal result, not a family-wide discovery. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/spec.md:62] [SOURCE: derived: Bonferroni and family-wise arithmetic]

5. **Construct validity: the baseline answers a broader question with the same name.** The check flags every extracted flag or symbol not in the fixture allowlist, and the allowlist is empty on all 21 fixtures, so it flags task-provided names (`compareVersions`, `echo`) and builtins (`split`, `slice`) that the jev question explicitly excludes ("that the task does not provide"). B=47 is the majority class, not the check, so the verdict's B is honest to its definition but the check column in the report (22) is not a same-question comparator. Populating allowlists is a trustworthiness fix as well as an accuracy lever: it makes B a real same-question baseline, and the margin 10*(A-B)=80 would face a harder bar. [SOURCE: file:score-d4-agreement.cjs:153-176,214] [SOURCE: command:in-memory reproduction (fp=34/47)] [SOURCE: file:.../024-hallucination-grader/spec.md:153-154]

6. **Requalification checks the model, not the labels.** A rerun reads a stored report only to compare provider/model and print `requalify: model changed`; the labels file's SHA-256 is recorded in the report and printed on the verdict line but never compared across runs. A rerun against a changed label set would silently produce a new verdict whose only trace is the new sha. The production grader cache has a related soft spot: the grader-model build hash is a hardcoded placeholder, mitigated in the harness by a composite identity (model name + system-prompt SHA) but not by a true build hash. [SOURCE: file:score-d4-agreement.cjs:841-845,356,1020-1027] [SOURCE: file:scorer/lib/cache.cjs:22-24,52] [SOURCE: file:scorer/grader/harness.cjs:388-403]

7. **Run-to-run stability is unmeasured for this feature.** The recorded run is a single execution; the same results table shows 027 ran four times across fix rounds and printed the same A, B, W, L each time, so rerun discipline exists in the campaign. For 024, the one flip (validate-semver.run3: 0.55/0.41/0.54) is direct evidence that sampling noise sits exactly at the decision boundary, and no second execution exists to show the verdict (not just the counts) is stable. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:16] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl]

8. **The receipts that do exist are strong and should be credited.** Labels SHA-256 on the verdict line and in the report; per-call `calls.jsonl` with noul, status, wall time, provider, model, and jev version; strict label parsing that exits 2 on a bad value, duplicate, or non-JSON row; a payload gate that refuses untracked outputs without `--accept-payload`; skip paths that leave the rest of the output byte-identical. The gaps are in what the report does not surface (per-class counts, unmeasured count in the printed line, threshold sensitivity, intervals), not in what it refuses to hide. [SOURCE: file:score-d4-agreement.cjs:139-163,356,436-480,1020-1027] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/report.json]

9. **The corpus tests one hallucination family, on cooperative text.** All 9 positives are invented local module paths/helper names produced by the careless run3 prompt on 14 fixtures; there are no planted hallucinations of other kinds (fake packages, URLs, config keys, versions) and no adversarial outputs. The harness hardens against injection-style output (random sentinel markers, explicit data-only instruction), but the agreement corpus contains no such case, so 98% accuracy here says nothing about hostile text. [SOURCE: file:~/.skilled/.labels/024-labels.jsonl] [SOURCE: file:.../047.../scratch/fixtures/024-outputs/] [SOURCE: file:scorer/grader/harness.cjs:98-110,201-220]

**Answer to Q3 (ranked).** (1) Add a second-labeler audit on a sample (all 9 yes rows plus every grader-label disagreement) and record inter-rater agreement; ADR-001's digest-veto already provides the human surface. (2) Report per-class metrics with intervals and name the effective independent unit count; print unmeasured in the verdict line. (3) Repeat the measurement to establish verdict stability, as 027 did. (4) Populate allowlists and rerun so B measures the same question. (5) Extend the corpus to other hallucination families and adversarial outputs. (6) Tighten requalification to compare labels SHA and a real grader model build hash.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md` (REQ-005, Keep Rule)
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/{goal.md,acceptance-criteria.md,spec.md,scratch/evidence/results.md}`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md` (ADR-001)
- `score-d4-agreement.cjs`, `scorer/grader/harness.cjs`, `scorer/lib/cache.cjs`
- `~/.skilled/.labels/024-labels.jsonl`, `~/.skilled/.labels/runs/047-024-jev-20261002/{report.json,calls.jsonl}` (read-only)
- Derived arithmetic: Clopper-Pearson intervals, Bonferroni and family-wise figures

## Assessment

- **newInfoRatio: 0.80.** Pre-registration and receipts were partly visible in earlier iterations; the clustering/interval analysis, family-wise arithmetic, construct-validity framing, and requalification gap are new.
- **Confidence:** high for the code and spec citations and for the arithmetic (reproducible); the label-reliability claim is a design observation, not a measurement.

## Reflection

- Worked: deriving the intervals and family-wise figures turned a vague "small corpus" caution into numbers a follow-up phase can act on.
- Failed: nothing attempted failed.
- Ruled out: reading p_win=0.003906 as a family-wide 5-sigma-style result; it is a per-column nominal tail on clustered rows.

## Recommended Next Focus

Iteration 4: Q4 — where else in `.skilled` the same invented-name judgment pays off, with file:line evidence and a payoff ranking.
