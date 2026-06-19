---
title: "Implementation Summary: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Planning-state summary: the retention/forgetting + recall-diversity result-shaping sub-phase is authored (spec/plan/tasks/checklist) with all 8 candidates triaged PENDING against the 030 Wave-0 shipped record. No code shipped yet."
trigger_phrases:
  - "implementation"
  - "summary"
  - "memory retention forgetting"
  - "c7-a dominance cap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/011-011-retention-forgetting"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the retention/forgetting impl sub-phase docs (planning state)"
    next_safe_action: "Implement T101 spare-only forget eligibility (EXTENDABLE_TIERS fix)"
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
    completion_pct: 0
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
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/011-011-retention-forgetting |
| **Completed** | Planning authored 2026-06-19 (implementation PENDING) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase is the planning surface for the Spec-Kit Memory MCP's retention, recall-diversity, and erasure-surface result-shaping candidates. It does not ship code yet. What exists now is a faithful, research-cited plan: eight candidates pulled from the 028/001 deep-research record, each with a confirmed seam and an explicit PENDING status checked against the 030 Wave-0 shipped record. None of the eight shipped in Wave-0, so every one is open work.

### Retention / forget correctness

`M-spare-only-eligibility` makes forget eligibility a strict AND over independent axes where any single axis can only spare a memory, never doom it. Today the feedback-retention reducer spares only by tier and pin, so a non-`important` row with strong positive feedback gets annotated and then deleted anyway. The plan extends the tier gate, adds finite-guards (a `NaN`/`-inf` value spares rather than dooms), and folds in trust/unreferenced/age axes. `forget-allowlist` then makes the `unreferenced` axis read live incoming edges from an explicit 6-label allowlist instead of a loss-tolerant cache, so a still-referenced memory cannot be forgotten while ambient bookkeeping edges are deliberately excluded.

### Recall diversity

`C7-A` adds the session/spec-folder dominance cap the pipeline has never had: a single chatty session or one dominant spec-folder can currently occupy the entire top-k because result assembly is two bare `slice(0, limit)` steps. The cap admits at most N (default 3) rows per folder before the final slice and spills the overflow back only if the limit cannot otherwise be filled. `M-never-truncate-always-surface` caps the constitutional always-surface prefix so it can no longer fill the slice and starve regular results.

### Reconsolidation safety

`M-trust-gated-quarantine` adds a trust gate before the reconsolidation bridge routes a merge: a contradiction is quarantined only when either side clears the 0.7 trust threshold, the low-trust side is excluded from recall by CONTRADICTS edge-presence (nothing is destroyed), and a reconcile signal names the victim, trust, and survivor. It ships behind a default-OFF flag.

### Erasure surface (recorded deferrals)

`M-erasure-cascade-refuse-whole`, `M-namespace-authorize-before-erase`, and `M-writer-signing` are recorded as PENDING deferrals with their gates and seams so nothing is silently dropped. The cascade is its own GDPR packet; namespace-authorize and writer-signing are threat-model-gated and mostly N/A for a single-trusted-host stdio MCP.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `028-.../001-speckit-memory/011-011-retention-forgetting/spec.md` | Created | Problem, scope, 8-candidate STATUS table, acceptance criteria |
| `028-.../001-speckit-memory/011-011-retention-forgetting/plan.md` | Created | Sequencing, affected-surfaces inventory, rollback |
| `028-.../001-speckit-memory/011-011-retention-forgetting/tasks.md` | Created | Task breakdown (T001-T142); deferrals recorded `[x]`, implement tasks `[ ]` |
| `028-.../001-speckit-memory/011-011-retention-forgetting/checklist.md` | Created | Level-2 verification gates (planning state) |
| `028-.../001-speckit-memory/011-011-retention-forgetting/implementation-summary.md` | Created | This planning-state summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plan was assembled by reading the authoritative 028/001 research directly: the primary `research/research.md` for the internal baseline, the parent `research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda), the `synthesis/01-go-candidates.md` and `06-memory-systems-findings.md` GO tables, and the per-iteration `deltas/iter-*.jsonl` + `iterations/iteration-*.md` for the candidates absent from the rolled-up lists. Every candidate's PENDING status was cross-checked against `030/spec.md` §14 and `git log 1ecc531431..HEAD` to confirm none shipped in Wave-0. Validation is `validate.sh --strict` (PASS).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sequence the two P0 candidates (spare-only, C7-A) first | They are independent, reversible, S-effort per the research; the schema/benchmark-gated items (forget-allowlist, never-truncate) should not block them |
| Keep the three erasure candidates as deferrals, not tasks | The research repeatedly scopes cascade to its own GDPR packet and marks namespace-authorize/writer-signing N/A for a single-trusted-host stdio MCP; recording them honors the "nothing silently dropped" rule without scope creep |
| Mark all 8 candidates PENDING | The 030 Wave-0 shipped record (§14) and commit log contain none of these eight; claiming any DONE would be fabrication |
| Treat C7-A and never-truncate as result-set changes needing a baseline | The regression-baseline rule applies; no candidate has a measured before/after number, so thresholds ship behind config with conservative defaults |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | PASS (Errors: 0, Warnings: 0) |
| Per-candidate STATUS vs 030 §14 | PASS — all 8 confirmed absent from Wave-0; marked PENDING with gate |
| Research traceability | PASS — every candidate cites a seam file:line + a banked finding (deltas/iterations) |
| Implementation tests | N/A — planning state; no code shipped (candidate tests gated in checklist) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning only.** No code is implemented. All 8 candidates are PENDING; the implement tasks (T101-T105) are open.
2. **forget-allowlist symbol is unlocated.** The 028/001 research marked the unreferenced-allowlist symbol NEEDS-BENCHMARK (could not locate it); T002 must resolve label-column vs live-edge-join before T103 proceeds.
3. **No measured benefit numbers.** Every effort/leverage tag is structural inference (roadmap §6). C7-A's default N=3 and the never-truncate cap value are unvalidated until a recall baseline is captured.
4. **Erasure surface is out of scope here.** Cascade is a future GDPR packet; namespace-authorize and writer-signing are threat-model-gated and likely permanently N/A for this single-trusted-host tool.
<!-- /ANCHOR:limitations -->
