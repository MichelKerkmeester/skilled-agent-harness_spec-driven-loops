DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 1 Prompt Pack

STATE SUMMARY: Iteration 1 of 4; focus=correctness; prior findings P0=0 P1=0 P2=0; coverage=0/4; stopPolicy=max-iterations.

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Review the 163-file sk-code reference/asset corpus against R1-R4 and the create-skill reference/asset templates.
- Replay the prior Purpose de-duplication remediation with a semantic containment check.
- Load `.opencode/skills/sk-code/code-review/references/review_core.md` before severity calls.
- Target files are read-only. Do not implement fixes.
- Do not dispatch sub-agents.
- Allowed writes are limited to this lineage's iteration 001 narrative, state-log append, delta file, and strategy update.
