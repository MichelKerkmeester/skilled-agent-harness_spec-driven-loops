DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 2 Prompt Pack

STATE SUMMARY: Iteration 2 of 4; focus=security; active findings P0=0 P1=2 P2=0; coverage=1/4; ratio=1.0; stopPolicy=max-iterations.

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Inspect the documentation-only packet and changed target corpus for secrets exposure, unsafe executable instructions, path disclosure, trust-boundary regressions, and scope mutation.
- Distinguish explicitly labeled unsafe examples from recommendations.
- Load `.opencode/skills/sk-code/code-review/references/review_core.md` before severity calls.
- Target files are read-only. Do not implement fixes.
- Do not dispatch sub-agents.
- Allowed writes are limited to this lineage's iteration 002 narrative, state-log append, delta file, and strategy update.
