---
title: "Checklist: Measured Native Experiments (Roadmap Phase 2)"
description: "Verification checklist for Roadmap Phase 2 — SLO-crossing entry gate, sk-code/018 shape conformance, oracle-win plus byte-parity promotion gate, and residency-honesty on every claim."
trigger_phrases:
  - "measured native experiments checklist"
  - "residency honesty forbid unsafe code"
  - "byte parity oracle win verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/004-measured-native"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs (spec/plan/tasks/checklist/implementation-summary) for phase"
    next_safe_action: "Await parent orchestrator to finalize description.json/graph-metadata.json and run validate.sh"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Measured Native Experiments (Roadmap Phase 2)

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

- [ ] CHK-001 [P0] SLO-crossing entry gate enforced — no native/Rust experiment begins unless a named stage crosses a measured SLO against the Phase 0 oracle/telemetry
- [ ] CHK-002 [P0] "No Rust" is documented as a valid, non-foregone terminal outcome when no stage crosses an SLO
- [ ] CHK-003 [P0] Scope lock held — only this packet's 5 spec-folder docs (spec/plan/tasks/checklist/implementation-summary) are written; parent 015 docs, sibling children, description.json, and graph-metadata.json are untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every native candidate conforms to the sk-code/018 shell/adapter/core shape (TS owns transport/selection/flags/DB writes/publication/fallback; Rust is a thin napi-rs adapter over exactly one pure kernel)
- [ ] CHK-005 [P1] Bounded Rust parse core (Candidate C) owns exactly one kernel — no scope creep beyond the single measured hotspot
- [ ] CHK-006 [P1] sqlite-vec (Candidate A) is evaluated as EXACT vector search only, never an approximate/ANN substitute

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] End-to-end oracle win required before promotion — the candidate must beat the pinned TS oracle
- [ ] CHK-008 [P0] Byte-for-byte differential parity vs. the pinned Phase 0 TS oracle required before promotion
- [ ] CHK-009 [P0] No silent swap of the exact/default path — a candidate replaces the TS path only after both the oracle-win and parity gates pass

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P2] Fix-completeness inventory N/A — this phase ships no code changes (0 LOC, planning-only)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P0] `#![forbid(unsafe_code)]` enforced in any Rust core introduced by this phase
- [ ] CHK-012 [P1] Rust `ort` sidecar (Candidate B) justified by crash/RSS/deployment isolation, not speed — both Node and Rust wrap the same native ONNX kernels

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P0] Residency honesty — every performance claim decomposes native (SQLite/FTS5) vs. JS-resident compute; no blended "Rust is faster" claim survives review
- [ ] CHK-014 [P0] Docs authored at Level 2 (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) for this phase child
- [ ] CHK-015 [P0] Metadata/validation deferred to parent — description.json, graph-metadata.json, and `validate.sh --strict` are finalized by the parent orchestrator, not this child packet

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Temp files in scratch/ only (if any created during evaluation)
- [ ] CHK-017 [P1] scratch/ cleaned before completion

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (parent orchestrator runs `validate.sh --strict` and finalizes metadata)
**Verified By**: Pending

<!-- /ANCHOR:summary -->
