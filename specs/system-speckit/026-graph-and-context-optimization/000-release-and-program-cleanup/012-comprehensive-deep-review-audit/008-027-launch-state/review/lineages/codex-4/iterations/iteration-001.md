# Iteration 001 - Correctness

## Focus

Launch-state and completion-state consistency for the 027 phase parent and child scaffolding.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md`

## Findings

### P1-001: Child graph metadata marks draft phases complete while evidence remains placeholder-shaped

Severity: P1  
Category: metadata-status-drift  
Finding class: completion-claim-drift  
Evidence:

- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133`] Parent phase map labels `003-incremental-index-foundation` as `Draft`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`] Child graph metadata says `"status": "complete"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:59`] The summary still contains the template placeholder opening hook.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:112`] Verification still contains the placeholder `[Validation, lint, tests, manual check]` row.

The launch state is internally inconsistent: metadata marks the child complete, while the authoritative parent map calls it draft and the implementation evidence is still template text. The same `complete` status appears in graph metadata for 004-006, while their parent phase-map rows are also `Draft`.

Concrete fix: regenerate or manually reconcile child graph metadata so 003-006 are not completion-visible until implementation summaries contain real evidence and validation rows.

## Claim Adjudication

```json
{
  "findingId": "P1-001",
  "claim": "Child graph metadata marks draft 027 phases complete while implementation evidence remains placeholder-shaped.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:59",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:112"
  ],
  "counterevidenceSought": "Checked parent phase map, representative 003 implementation summary, and graph metadata status lines for sibling 004-006.",
  "alternativeExplanation": "The graph status could represent older historical completion, but the current parent launch map explicitly labels the phases Draft and the summaries still instruct future evidence filling.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if 003-006 have separate validated implementation evidence and graph metadata intentionally reports shipped runtime state rather than current phase status.",
  "transitions": []
}
```

## Ruled Out

No P0 correctness failure was confirmed because the reviewed surface is planning metadata; the defect affects release/readiness routing, not runtime behavior.

Review verdict: CONDITIONAL
