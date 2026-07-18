DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 Prompt Pack

STATE SUMMARY: Iteration 2 of 10; dimension security; active findings P0=0 P1=1 P2=0; coverage 1/4; ratio history 1.00; core traceability pending; graphless fallback active.

- Focus: provenance, rights, untrusted corpus injection, source leakage, caching, and authority ordering in phases 004-010.
- Re-read F001 only if security evidence changes its severity; otherwise preserve it as active.
- Write only iteration-002 narrative, iter-002 delta, state-log append, and strategy update under `sol-c`.
- Target files are read-only. No sub-agent dispatch or implementation.
- ALLOWED WRITE PATHS: only `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-c/**`.
- BANNED OPERATIONS: deletion, rename, truncation, or writes outside the lineage directory.
