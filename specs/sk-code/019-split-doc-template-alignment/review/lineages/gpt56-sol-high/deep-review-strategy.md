# Deep Review Strategy

<!-- ANCHOR:topic -->
## Topic

Review `.opencode/specs/sk-code/019-split-doc-template-alignment` and its declared 163-file deliverable against the canonical create-skill reference/asset templates.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

- [x] Correctness
- [x] Security
- [x] Traceability
- [x] Maintainability
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

- Correctness: mechanical gates pass; canonical no-duplication rule fails in 21 files.
- Security: no executable, authentication, authorization, secret, or privilege boundary change found.
- Traceability: the checked hub-wide link gate fails on two tracked links.
- Maintainability: section numbering, mode sections, and related-resource ordering pass; duplicate overview prose remains.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings

P0: 0 | P1: 2 | P2: 0

- F001: 21 intro/Purpose duplicates.
- F002: 2 unresolved tracked Markdown links contradict checked evidence.
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked

- Iterations 1-2: Git inventory avoided `rg` ignore-rule undercounting and established 163 files.
- Iterations 4-6: fenced-code-aware tracked-link scan separated real Markdown links from code examples.
- Iterations 5-10: whole-corpus parsers bounded structural and duplication claims.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

- `rg --files` alone omitted six tracked workflow documents due ignore rules.
- Strict packet validation was unavailable because the compiled validation orchestrator is stale.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Re-running generic `validate_document.py` cannot detect intro/Purpose duplication.
- Broad link regexes without fenced-code filtering produce false positives from examples.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions

- The apparent 157-vs-163 count drift was disproved: six tracked workflow docs are hidden from ripgrep inventory.
- Surface `SKILL.md` package failures were reproduced and remain the documented out-of-scope header issue.
- No security vulnerability or executable behavior change was found.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus

Remediate F001 and F002, then rerun the 163-file semantic matrix, the 328-file tracked Markdown link scan, and strict packet validation after rebuilding the stale orchestrator.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context

Packet continuity claims 100% completion and 163/163 validation. `resource-map.md` was not present, so the Resource Map Coverage Gate is skipped. Memory retrieval timed out; canonical packet docs and current repository evidence were used.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status

| Protocol | Status | Evidence |
|---|---|---|
| spec_code | partial | Four mechanical requirements pass; F001 violates canonical template semantics. |
| checklist_evidence | fail | F002 contradicts the checked link gate. |
| feature_catalog_code | not applicable | Documentation conformance packet; no feature-catalog claim is required. |
| playbook_capability | not applicable | No executable capability introduced. |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review

| Scope | Coverage |
|---|---|
| Five canonical packet docs | Complete |
| 163 tracked reference/asset Markdown files | Complete |
| 328 tracked sk-code Markdown files for link replay | Complete |
| Canonical create-skill templates | Complete |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries

- Maximum iterations: 10
- Stop policy: max-iterations
- Convergence threshold: 0.1, telemetry only before iteration 10
- Review target is read-only
- Artifact writes are restricted to this lineage directory

### Non-Goals

- Implementing fixes
- Rewriting out-of-scope surface `SKILL.md` headers
- Auditing unrelated runtime behavior

### Stop Conditions

- Stop after exactly 10 complete iterations and synthesize with any failed gates preserved.
<!-- /ANCHOR:review-boundaries -->
