DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 4 Prompt Pack

STATE SUMMARY: Iteration 4 of 4; focus=maintainability; active findings P0=0 P1=4 P2=0; coverage=3/4; ratios=0.0->0.5; stopPolicy=max-iterations.

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Audit routing metadata quality, cross-document consistency, finding scope, and deterministic replay maintainability.
- Re-run the corpus and link audits as the terminal stabilization pass.
- Do not synthesize before this iteration completes; maxIterations is the terminal reason.
- Load `.opencode/skills/sk-code/code-review/references/review_core.md` before severity calls.
- Target files are read-only. Do not implement fixes.
- Do not dispatch sub-agents.
- Allowed writes are limited to this lineage's iteration 004 narrative, state-log append, delta file, and strategy update.
