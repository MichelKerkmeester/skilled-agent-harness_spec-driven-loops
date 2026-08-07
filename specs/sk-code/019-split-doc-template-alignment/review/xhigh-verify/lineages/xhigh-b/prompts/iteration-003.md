DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 3 Prompt Pack

STATE SUMMARY: Iteration 3 of 4; focus=traceability; active findings P0=0 P1=2 P2=0; coverage=2/4; ratios=1.0->0.0; stopPolicy=max-iterations.

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Execute both hard protocols: `spec_code` and `checklist_evidence`.
- Replay the 163-file corpus audit, 328-file fenced-code-aware link audit, package checks, and strict packet validation.
- Reconcile packet wording against the two documented hub-wide unresolved artifacts and prior Purpose remediation.
- Load `.opencode/skills/sk-code/code-review/references/review_core.md` before severity calls.
- Target files are read-only. Do not implement fixes or alter checked completion marks.
- Do not dispatch sub-agents.
- Allowed writes are limited to this lineage's iteration 003 narrative, state-log append, delta file, and strategy update.
