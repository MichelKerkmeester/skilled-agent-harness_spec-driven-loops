DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY (auto-generated):
Iteration: 10 of 10 | Mode: review
Target: specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit (spec-folder)
Dimension: broadened - adversarial P0/P1 replay
Prior Findings: P0=0 P1=5 P2=15
Stop policy: max-iterations

ALLOWED WRITE PATHS: iterations/iteration-010.md, deep-review-state.jsonl, deltas/iter-010.jsonl, deep-review-strategy.md
BANNED OPERATIONS: any rm/mv/sed -i/write outside the allowed list; reviewed target files are READ-ONLY.
