# Iteration 3: Adjacent uses and default-on operation

## Focus

Identify high-value `.skilled` semantic review targets and define default-on operational requirements, cost, and risk from the existing implementation and documented contracts.

## Actions Taken

- Read the existing goal-criteria lint feature and its scored-label/model-arm description.
- Read the System Spec Kit AC_COVERAGE contract and implementation to see what its evidence checks do and do not decide.
- Rechecked the citation scanner's default, Jev gate, call count, timing, and `--out` behavior against the recorded run.

## Findings

1. **The nearest adjacent use is acceptance-criteria evidence support.** `AC_COVERAGE` counts Tested or Partially covered criteria when a Verification cell has a `file:line` citation; it checks whether the locator resolves, and even an unresolved citation still contributes to its covered count (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md:95,101-103`). The implementation checks path and line existence (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:438-457`) and reports the count against a coverage floor (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:567-589`). A bounded Jev advisory could judge whether the cited evidence actually demonstrates the criterion, prioritizing resolved evidence for rows marked Tested/Partially covered. Keep the existing deterministic coverage result intact and never let the semantic result alone close a packet.

2. **Goal criteria already provide a close, tested pattern.** `goal-criteria-lint` flags whether completion criteria are self-contained and checkable without another file, using lexical rules and no model call in its default path (`.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md:18-20,28`). Its feature already includes 98 operator-delegated labels, a Wilson interval and stale-label reporting, then an opt-in Jev arm with two questions and three reruns per labeled criterion (`.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md:30-32`). Reuse its label-quality and confidence-reporting lessons; do not duplicate a second evaluator for the same kind of checkability judgment.

3. **Default-on is a contract change, not a safe toggle of the existing benchmark arm.** The citation feature's goal explicitly says the default run makes zero model calls (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:44`), the catalog says it makes no call and writes no file (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:26`), and the Jev arm currently requires an explicit `--jev` plus `--out` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1261-1263,1336-1363`). A default-on rollout therefore needs the feature contract, command surface, privacy notice, and opt-out behavior deliberately amended. Keep the deterministic census independently usable and preserve it as the no-model path.

4. **Separate benchmark mode from a production semantic scan.** The measured labels are a fixed 40-row mixed evaluation set; the live run used 121 calls and records one commit/model identity (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`). Those labels are for scoring against known outcomes, not a gold set for every current citation. A production arm needs an explicit definition of which current, in-range citations it judges, a content hash for cache freshness, a distinct result status, and a human-reviewable output. On the only measured benchmark, cost was 1 auth plus 3 calls per row (121 total), with p50 326 ms and p95 423 ms per recorded call; the default structural scan itself took about 171 seconds in an earlier run (`goal.md:90,119,122`; `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1008-1036,1177-1188`). Cost generalizes as roughly `3N+1` planned calls for N eligible rows before retries. For scale only, an earlier census listed 208 in-range citations; applying the benchmark's three calls to all 208 would imply 625 calls, an unmeasured extrapolation, not a current bill or latency promise (`goal.md:90`). Dollar cost is UNKNOWN without the provider's billing terms.

5. **Availability and result semantics need explicit controls.** The gate pins Jev CLI version 0.6.2, checks a configured provider (default `official`) and credential, and skips on a missing binary/version/credential (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:954-1005`). A per-call timeout is 90 seconds and exit code 4 can add one retry (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:75-76,1008-1015,1085-1105`). The feature documentation says a skipped or stopped Jev arm may still exit 0 (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:30`). Default-on reporting therefore needs machine-visible `completed`, `skipped`, `partial`, and `failed` statuses; a per-run call/time budget and circuit breaker; a visible opt-out; and semantics that never label an unavailable run as a clean result.

6. **Content handling is a release gate.** Each Jev request includes the citing sentence, target path, and cited window (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1025-1032,1081-1087`). The packet says the output holds doc text and was kept outside the repository (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`), but the checked-in call logger serializes row identity and call metadata rather than the prompt payload (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1059-1071,1127-1139`). Reconcile the historical artifact and current logging claim before rollout. Regardless, the request transmits repository content to the provider; define path allowlists, redaction, data-retention rules, provider approval, audit retention, and access controls. Do not infer provider-side retention from local logger fields.

7. **Use advisory human review for semantic findings.** The scan's deterministic dead-citation output is direct and should remain independent (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-20,26`). Semantic flags can be wrong and current evidence is a small benchmark, so default-on results should explain the cited sentence/window, probability, model identity, and uncertainty, and route questionable support to an author or reviewer. Do not auto-rewrite citations or block validation until a representative holdout and an explicit acceptance threshold support that use.

## Questions Answered

- **Where else would this judgment pay off?** First, checking whether acceptance-criteria `file:line` evidence actually supports Tested/Partially covered criteria; second, auditing completion-goal criteria for self-contained/checkable meaning. The latter already has a Jev arm and a richer label/interval workflow.
- **What does default-on require?** A deliberate change to the current zero-call contract; a separate production scan definition; approved provider/consent and payload rules; visible opt-out; bounded call/time budgets; cache freshness identity; explicit skip/partial/failure status; audit output; and advisory human review.
- **What does it cost?** Measured benchmark cost was 121 subprocess calls for 40 rows, p50/p95 326/423 ms per call. Budget formula is `3N+1` planned calls before retries. An earlier 208-in-range census would imply 625 calls if every citation were included, as an unmeasured scale illustration. USD cost is UNKNOWN.
- **What are the main risks?** Sensitive document transmission and unclear artifact retention, latency/spend, silent skips that can look like success, small-sample/model error, and violating the existing zero-call default expectation.

## Questions Remaining

- What provider retention and exact historical output contents applied to the 047 run? The packet note and inspected call logger do not agree.
- What independent live-only holdout performance and operating budget would justify changing the default contract?

## Next Focus

Synthesize the three passes into evidence-backed findings, recommendations, the default-on call model, and unresolved validation limits. Stop at the configured iteration cap.
