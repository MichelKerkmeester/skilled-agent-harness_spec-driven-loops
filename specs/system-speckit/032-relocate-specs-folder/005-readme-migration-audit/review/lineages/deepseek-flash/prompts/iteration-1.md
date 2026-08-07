DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY (auto-generated):
Iteration: 1 of 10 | Mode: review
Target: specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit (spec-folder)
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Traceability: core=pending overlay=notApplicable
resource-map.md not present; skipping coverage gate
Stop policy: max-iterations (convergence is telemetry; broaden angles each iteration)

Review Iteration: 1 of 10
Mode: review
Dimension: correctness
Review Target: specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit
Review Scope Files: 23 non-specs README literal-hit files + root README + representative code for doc/code truth-checking

ALLOWED WRITE PATHS: iterations/iteration-001.md, deep-review-state.jsonl, deltas/iter-001.jsonl, deep-review-strategy.md
BANNED OPERATIONS: any rm/mv/sed -i/write outside the allowed list; reviewed target READMEs are READ-ONLY.
