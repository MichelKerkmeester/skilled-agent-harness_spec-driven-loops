---
title: "Implementation Summary: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Partial implementation summary: retention spare-only eligibility and live incoming-edge allowlist are implemented. Benchmark-gated recall shaping and trust quarantine remain pending."
trigger_phrases:
  - "implementation"
  - "summary"
  - "memory retention forgetting"
  - "c7-a dominance cap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/011-retention-forgetting"
    last_updated_at: "2026-07-06T19:16:30.581Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented retention spare-only eligibility and live incoming-edge allowlist"
    next_safe_action: "Run strict validation, then continue semantic edge layer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-011-retention-forgetting"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-retention-forgetting |
| **Status** | in_progress |
| **Completed** | Partial implementation 2026-06-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This pass ships the retention/forget correctness slice of the sub-phase: `M-spare-only-eligibility` and `forget-allowlist`. The result-shaping candidates that need recall benchmarks (`C7-A`, `M-never-truncate-always-surface`) remain pending, and `M-trust-gated-quarantine` remains pending because it changes reconsolidation merge policy and read-time contradiction exclusion outside this schema-focused pass.

The phase status is `in_progress`: 2 of the 8 candidates shipped (both default-OFF, behind `SPECKIT_RETENTION_FORGETTING_V1`), 3 remain pending (two are benchmark-gated recall shaping, one is shared-infra reconsolidation) and 3 are recorded deferrals on the erasure surface (own-packet GDPR cascade plus two threat-model-gated, single-trusted-host N/A candidates).

### Retention / forget correctness

`M-spare-only-eligibility` now runs behind `SPECKIT_RETENTION_FORGETTING_V1`, default-OFF. The reducer extends positive-feedback spare behavior to normal and temporary rows when enabled, protects non-finite importance/trust axes before comparison, applies trust and age spare axes and refuses a configuration where both floors are set to the ceiling.

`forget-allowlist` now reads live incoming `causal_edges.relation` values from the explicit six-label allowlist (`derived_from`, `supports`, `depends_on`, `relates_to`, `has_failure`, `mentions`). Audit/provenance/scope-style ambient relations do not spare a row. The schema adds `memory_index.retention_trust_score` with deterministic backfill from `quality_score`, plus `idx_causal_edges_retention_incoming` for the live incoming-edge query.

### Recall diversity

`C7-A` adds the session/spec-folder dominance cap the pipeline has never had: a single chatty session or one dominant spec-folder can currently occupy the entire top-k because result assembly is two bare `slice(0, limit)` steps. The cap admits at most N (default 3) rows per folder before the final slice and spills the overflow back only if the limit cannot otherwise be filled. `M-never-truncate-always-surface` caps the constitutional always-surface prefix so it can no longer fill the slice and starve regular results.

### Reconsolidation safety

`M-trust-gated-quarantine` adds a trust gate before the reconsolidation bridge routes a merge: a contradiction is quarantined only when either side clears the 0.7 trust threshold, the low-trust side is excluded from recall by CONTRADICTS edge-presence (nothing is destroyed), and a reconcile signal names the victim, trust and survivor. It ships behind a default-OFF flag.

### Erasure surface (recorded deferrals)

`M-erasure-cascade-refuse-whole`, `M-namespace-authorize-before-erase` and `M-writer-signing` are recorded as PENDING deferrals with their gates and seams so nothing is silently dropped. The cascade is its own GDPR packet. Namespace-authorize and writer-signing are threat-model-gated and mostly N/A for a single-trusted-host stdio MCP.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/feedback/feedback-retention-reducer.ts` | Modified | Default-OFF spare-only retention axes |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Default-OFF live incoming-edge allowlist protection |
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | Add retention trust column, backfill, incoming-edge index, rollback |
| `mcp_server/lib/search/search-flags.ts` | Modified | Add `SPECKIT_RETENTION_FORGETTING_V1` |
| `mcp_server/tests/*retention*.vitest.ts` + schema/flag tests | Modified | Deterministic reducer, sweep, migration, compatibility, flag-ceiling coverage |
| `028-.../001-speckit-memory/011-retention-forgetting/spec.md` | Modified | Mark implemented candidates DONE, leave benchmark/shared-infra candidates PENDING |
| `028-.../001-speckit-memory/011-retention-forgetting/tasks.md` | Modified | Mark implemented tasks DONE, leave remaining tasks PENDING with reasons |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the existing 007/008/009-style schema pattern: additive UP helpers, deterministic backfill, idempotent rerun, explicit DOWN helper and compatibility fixture updates. Runtime behavior is gated by a new default-OFF `SPECKIT_*` flag and the flag is registered in the flag-ceiling known-list.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sequence the two P0 candidates (spare-only, C7-A) first | They are independent, reversible, S-effort per the research, and the schema/benchmark-gated items (forget-allowlist, never-truncate) should not block them |
| Keep the three erasure candidates as deferrals, not tasks | The research repeatedly scopes cascade to its own GDPR packet and marks namespace-authorize/writer-signing N/A for a single-trusted-host stdio MCP, so recording them honors the "nothing silently dropped" rule without scope creep |
| Mark two candidates DONE and leave the rest PENDING | Spare-only and live-edge allowlist now have code and deterministic tests. C7-A/never-truncate need benchmark evidence, trust quarantine needs a separate reconsolidation/read-exclusion pass. |
| Treat C7-A and never-truncate as result-set changes needing a baseline | The regression-baseline rule applies, no candidate has a measured before/after number, so thresholds ship behind config with conservative defaults |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | PASS (Errors: 0, Warnings: 0) |
| Per-candidate STATUS vs 030 §14 | PASS, all 8 confirmed absent from Wave-0, two implemented in this pass, remaining candidates keep explicit gates |
| Research traceability | PASS, every candidate cites a seam file:line + a banked finding (deltas/iterations) |
| Targeted vitest slice | PASS, `feedback-retention-reducer`, `memory-retention-sweep`, schema migration/compatibility and `flag-ceiling` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Partial phase.** C7-A, never-truncate and trust-gated quarantine remain PENDING.
2. **No measured recall benefit numbers.** C7-A's default N=3 and the never-truncate cap value are unvalidated until a recall baseline is captured.
3. **Trust quarantine is not schema-only.** It changes reconsolidation merge policy and read-time contradiction exclusion, so it was not implemented in this pass.
4. **Erasure surface is out of scope here.** Cascade is a future GDPR packet. Namespace-authorize and writer-signing are threat-model-gated and likely permanently N/A for this single-trusted-host tool.
<!-- /ANCHOR:limitations -->
