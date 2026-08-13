DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 5 | Mode: review
Target: specs/system-speckit/034-spec-template-context-optimizations (spec-folder)
Dimensions: 0/4 complete | Next: correctness
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Last 2 ratios: N/A -> N/A | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: D1 Correctness — requirement logic, acceptance criteria, and gate integrity
Resource Map Coverage: resource-map.md not present; skipping coverage gate.

Focus Dimension: correctness
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
ALLOWED WRITE PATHS: this lineage directory only
