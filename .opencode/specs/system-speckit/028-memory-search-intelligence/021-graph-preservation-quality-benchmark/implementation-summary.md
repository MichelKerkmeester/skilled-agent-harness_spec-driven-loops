---
title: "Implementation Summary: Graph Preservation Quality Benchmark"
description: "Status PLANNED. The graph-preservation quality benchmark is scaffolded with spec, plan, tasks, checklist, and decision-record. No code, fixture, or driver is built yet."
trigger_phrases:
  - "graph preservation quality benchmark"
  - "content rich short query graph preservation benchmark"
  - "retrieval class routing benchmark"
  - "F15 counter memory health wiring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/021-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-09T20:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec, plan, tasks, checklist, and decision-record; status PLANNED"
    next_safe_action: "Resolve plan.md open decisions, then start Phase 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-graph-preservation-quality-benchmark |
| **Status** | PLANNED, not yet implemented |
| **Completed** | Not completed |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks, checklist, and decision
record are authored and the work is PLANNED. This packet is explicitly on hold — it exists to build
the missing evaluation harness, not to graduate either flag.

### Planned: Graph Preservation Quality Benchmark

The planned work has two independent halves. The first is a 50+-query labeled fixture targeting the
exact activation predicates of `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` (content-rich
short queries) and `SPECKIT_RETRIEVAL_CLASS_ROUTING` (SingleHop-classified queries), plus a control
slice, each query's slice membership verified against the real live classifiers rather than
hand-labeled. That fixture will feed an extension of the existing `run-retrieval-flag-eval.mjs`
per-flag before/after harness, run against a reindexed snapshot of the real search index, with
findings recorded in a new `benchmark-results.md`. The second, independent half wires the
already-shipped F15 in-process counter (`getContentRichShortQueryGraphPreservationCount()`) into
`memory_health`'s persistent `routing` reporting block. None of this exists in code yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Records the problem, scope, requirements, and verified seams |
| plan.md | Created | Records the implementation approach and phase plan |
| tasks.md | Created | Records the task breakdown |
| checklist.md | Created | Records the QA checklist, all items unchecked |
| decision-record.md | Created | Records the three implementation-approach ADRs made during planning |

No fixture, driver script, or `memory_health` wiring has been written. The files named in spec.md
scope (the labeled fixture, the benchmark driver, `benchmark-results.md`, and the
`memory-crud-health.ts` diff) are planned, not created.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. This is a planning scaffold. No fixture was authored, no benchmark was run, and no
`memory_health` wiring was applied. Delivery starts once the two open implementation-time decisions
in plan.md (fixture location, reindex mechanism) are resolved and Phase 1 of plan.md begins.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `run-retrieval-flag-eval.mjs`'s existing per-flag before/after machinery rather than building a parallel harness | It already solves the reindexed-copy-and-restore and per-class-metric problem this packet needs; duplicating it would double future maintenance for no benefit — see decision-record.md ADR-001 |
| Author a scoped labeled fixture targeting each flag's exact activation predicate, verified against the live classifiers, rather than assuming the existing 18 simple-tier ground-truth queries happen to cover it | The existing corpus carries no content-rich-short or SingleHop label; an unverified fixture risks measuring the wrong population and repeating the prior 7-query spot-check's decision-neutral outcome — see decision-record.md ADR-002 |
| Treat the F15 counter wiring as an independent sub-task inside this same packet rather than a separate phase or packet | It shares no code path with the benchmark half, is small and well-precedented (matches the existing `routingTelemetry`/`graphChannelMetrics` shape), and the packet's own scope names it explicitly — see decision-record.md ADR-003 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| spec, plan, tasks, checklist, decision-record authored | DONE, scaffold in place; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` run against the scaffold itself (doc-set validation only, not a code test) |
| Labeled fixture built and predicate-verified | NOT STARTED -- no `vitest` fixture-shape test exists yet |
| Benchmark driver wired and run against reindexed snapshot | NOT STARTED -- no driver run, no `benchmark-results.md` evidence yet |
| Findings recorded in benchmark-results.md | NOT STARTED |
| F15 counter wired into memory_health | NOT STARTED -- no `handler-memory-health-edge.vitest.ts` coverage for it yet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code exists.** This phase is a planning scaffold only. The fixture, the benchmark driver, and
   the `memory_health` wiring are planned, not built.
2. **Two open implementation-time decisions remain.** The fixture's file location (in-place
   `ground-truth.json` extension vs. a scoped sibling file) and the reindex mechanism (documented
   manual pre-flight vs. a scripted step) are still open in plan.md.
3. **This packet does not decide flag graduation.** Even once its benchmark exists and shows a
   result, flipping `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` or
   `SPECKIT_RETRIEVAL_CLASS_ROUTING` to default-ON is explicitly out of scope — that is a decision for
   a follow-up packet made after this one's findings exist.
<!-- /ANCHOR:limitations -->
