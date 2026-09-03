---
trigger_phrases: []
---
DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY (auto-generated, review mode):
Iteration: 2 of 3 | Mode: review
Target: specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement (spec-folder)
Dimensions: 1/4 complete | Next: security
Findings: P0:0 P1:3 P2:0 active
Traceability: core=partial/fail overlay=notApplicable
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last 2 ratios: 1.0 -> N/A | Stuck count: 0
Provisional verdict: CONDITIONAL | hasAdvisories=false
Next focus: security (fingerprint skip, symlink confinement, leftover write/read paths)

Review Iteration: 2 of 3
Mode: review
Dimension: security
Review Target: specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement
stopPolicy: max-iterations
convergence: telemetry only; do not synthesize early
