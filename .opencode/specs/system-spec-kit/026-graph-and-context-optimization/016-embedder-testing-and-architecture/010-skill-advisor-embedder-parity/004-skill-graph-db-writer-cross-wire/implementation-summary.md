---
title: "Summary: 010/004 writer cross-wire"
description: "Pending — scaffolded 2026-05-18 to unblock 010/002 swap execution"
trigger_phrases:
  - "010/004 summary"
  - "writer cross-wire implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/004-skill-graph-db-writer-cross-wire"
    last_updated_at: "2026-05-18T00:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet — spec/plan/tasks/impl-summary skeleton"
    next_safe_action: "Execute T001 (read refreshSkillEmbeddings)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010004"
      session_id: "010-004-writer-cross-wire-impl"
      parent_session_id: "010-004-writer-cross-wire-spec"
    completion_pct: 0
    open_questions:
      - "See spec.md §7 Q1 + Q2"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 010/004 Writer Cross-Wire — PENDING

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | PENDING (scaffolded 2026-05-18; implementation not yet started) |
| Artifact | TBD: refactored `lib/skill-graph/skill-graph-db.ts:refreshSkillEmbeddings` + round-trip test + post-impl review |
| Owner | Main agent or focused dispatch (cli-codex / native @code via @orchestrate) |
| Blockers | None — all upstream dependencies (010/001) shipped |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

**Shipped (scaffolding only):**
- spec.md, plan.md, tasks.md, implementation-summary.md
- Cross-references to E review P1-1 finding + 010/002 swap-runbook

**Pending (implementation):**
- Refactor `refreshSkillEmbeddings()` to dispatch on `hasActiveEmbedderPointer()`
- New branch: embed via `getAdapter()` from new layer + write to `vec_<active.dim>`
- Round-trip integration test
- Post-impl 5-iter deep-review
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Scaffolding context (2026-05-18T00:05):**
- Created during autonomous overnight session as the follow-on to 010/002's architecture-gap discovery
- Discovery surfaced INDEPENDENTLY by E deep-review iter 3 (P1-1) and iter 8 (P2-11) → high signal
- Sized as Level 1 (~50 LOC change in single file) — small enough for one focused dispatch
- Recommended pattern: cli-codex gpt-5.5 high fast OR native @code via @orchestrate
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **D1**: Dual-path approach (keep legacy path when pointer unset, new path when pointer set)
  - Rationale: backward compat for fresh installs without explicit setActiveEmbedder call; cleanest dispatch
  - Alternative considered: wrap OLD factory in LlamaCppBaselineAdapter for unified call surface — rejected (more complex, more risk surface)

- **D2**: Single-write (NOT dual-write) when pointer set
  - Rationale: reader prefers vec_<dim> when pointer set; legacy column becomes stale-but-harmless; cleaner state
  - Alternative considered: dual-write for transition safety — rejected (more storage, no real rollback benefit since pointer flip is reversible)

- **D3**: Post-impl 5-iter deep-review (single-commit tier)
  - Rationale: matches `post-implementation-deep-review.md` tier table for single-commit changes; ~15 min wall time
  - Alternative: 10-iter (sub-phase tier) — over-investment for single-file refactor
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

PENDING. Will be filled in after implementation:
- [ ] Round-trip test passes
- [ ] Existing vitest suite passes (no new regressions vs task #49 baseline)
- [ ] Strict-validate 0 errors
- [ ] Post-impl deep-review verdict ≥ PASS-advisories
- [ ] 010/002 marked unblocked
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

PENDING.

Anticipated limitations to document post-implementation:
- 010/004 ships the writer wiring but does NOT execute the jina-v3 swap itself (that's 010/002 follow-up after this packet ships)
- 010/004 does NOT remove the legacy `skill_nodes.embedding` BLOB column (deferred to a future "legacy embedding column deprecation" packet — separate scope)
- 010/004 does NOT change the OLD `createEmbeddingsProvider` factory itself (out of bounds — other consumers depend on it)
<!-- /ANCHOR:limitations -->
