---
title: "Checklist: Roadmap Phase 0 — Evidence & Contract"
description: "Verification checklist for Phase 0 (Roadmap Evidence & Contract): 15 items covering manifest atomicity, telemetry residency-honesty, oracle byte-parity, and scope lock, all pending."
trigger_phrases:
  - "phase 0 foundation verification checklist"
  - "generation manifest telemetry oracle checklist"
  - "styles database phase 0 checklist evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/001-foundation"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 planning docs for phase 001-foundation"
    next_safe_action: "Await parent finalization (description.json, graph-metadata.json) then begin Phase A:"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Roadmap Phase 0 — Evidence & Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-006 present with acceptance criteria
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Phase A-D sequencing with entry/exit gates documented
- [ ] CHK-003 [P0] Phase 0 hard-blocker status stated in spec.md metadata and plan.md exit gate — Phases 1-3 cannot begin until REQ-001..005 are versioned

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Generation manifest design specifies atomic publish + rollback (no torn/partial generation observable)
- [ ] CHK-005 [P1] Stage telemetry design is residency-honest (native FTS5/SQLite vs JS-resident compute attributed separately)

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] Pinned TS differential oracle design specifies a byte-for-byte parity reference (DTO shape, hashes, ordering, tie-breaks)
- [ ] CHK-007 [P1] Replay fixture design covers 1x/10x/100x deterministic scales
- [ ] CHK-008 [P1] Labeled relevance judgment set is scoped and versioned

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P2] Fix-completeness inventory N/A — this phase ships no code changes (0 LOC, planning-only)

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P0] No Rust ships in Phase 0 (REQ-006 scope boundary honored)
- [ ] CHK-011 [P1] Any future Rust work is scoped to follow sk-code/018 (`#![forbid(unsafe_code)]`)

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P0] All 5 Level 2 docs present (spec/plan/tasks/checklist/implementation-summary)
- [ ] CHK-013 [P1] Every REQ-NNN is represented across plan.md, tasks.md, and checklist.md
- [ ] CHK-014 [P0] Metadata/validation (description.json, graph-metadata.json, validate.sh --strict) deferred to the parent session

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P0] Scope lock honored — no writes outside `001-foundation/` (parent docs, sibling children, description.json, graph-metadata.json untouched)

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending — deferred to the parent session

<!-- /ANCHOR:summary -->

---
