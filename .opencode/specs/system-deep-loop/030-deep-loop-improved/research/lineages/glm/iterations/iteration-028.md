# Iteration 028 — ROOT-CAUSE SYNTHESIS: Is Systemic Doc-Drift ONE Cause or Many?

**Focus:** Consolidate iterations 002,003,005,008,022,023,027 — do all drift symptoms share one generator root cause?
**Angle:** Cross-cutting root-cause analysis.

## Findings

The systemic drift symptoms cluster into **THREE distinct root causes**, not one:

**Root Cause A — Missing post-completion sync steps (the largest cluster):**
- Phase-map Draft rows (iter 002): no `step_phase_map_status_sync` in `speckit:complete`.
- completion_pct:0 in spec frontmatter (iter 003): no `step_completion_pct_sync`.
- Registry disposition gap (iter 025): no `step_review_registry_disposition`.
- These are all MISSING WORKFLOW STEPS — scaffold-authored values never re-synced at completion. ONE fix (a `speckit:complete` post-hook that reconciles phase-map + completion_pct + registry) addresses all three.

**Root Cause B — Derivation-layer generators that don't re-run / under-slice:**
- graph-metadata key_files omission (iter 005,023): generate-context.js / graph-metadata backfill doesn't aggregate child key_files and lags behind modifications.
- description.json truncation (iter 027): generate-context.js slices mid-word.
- last_active_child_id: null (iter 005): graph-metadata backfill doesn't set the pointer.
- These are GENERATOR BUGS in the derive layer. ONE fix (harden generate-context.js: word-boundary clamping + child-key_files aggregation + last_active_child_id setting) addresses all three.

**Root Cause C — Scaffold-never-finalized (human/process gap):**
- 008 parent tasks.md/impl-summary verbatim templates (iter 008).
- 001 plan.md template (iter 022).
- These are HUMAN OMISSIONS — the author never replaced template defaults. No generator can fix this; it needs a validate.sh template-default-content detector (009/010, Tier 3) to BLOCK Complete-status on template content.

**Conclusion:** drift needs THREE independent fixes (A: completion-sync steps, B: generator hardening, C: template-detection lint), not one. Round 1's "6 validate.sh checks" maps onto these: A→completion_pct + phase-map checks, B→implicit in key_files, C→template-default check. The remediation phase should bundle all three.

## Evidence
[SOURCE: iter 002,003,005,008,022,023,025,027 — cross-referenced]
[SOURCE: 009/spec.md:89 — Tier 3 (validate.sh checks) deferred]

## newInfoRatio: 0.95 (three-root-cause taxonomy; maps round-1's 6 checks onto structural causes)
