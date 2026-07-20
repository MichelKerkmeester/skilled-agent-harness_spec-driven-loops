---
title: "Checklist: sk-design styles database evolution roadmap"
description: "Level 2 verification checklist (CHK-001..021, all unchecked) covering the roadmap's soundness and the invariants future implementation must honor."
trigger_phrases:
  - "styles database evolution checklist"
  - "styles db roadmap verification checklist"
  - "sk-design styles db checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution"
    last_updated_at: "2026-07-20T06:36:16Z"
    last_updated_by: "spec-author"
    recent_action: "Author the Level 2 verification checklist (all unchecked; plan, not implementation)"
    next_safe_action: "Author implementation-summary.md; parent finalizes metadata + validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: sk-design styles database evolution roadmap

<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

- [ ] CHK-001 [P0] The Rust decision is NOT re-litigated; this packet encodes the 013 verdict (no rewrite now) and links the research.
- [ ] CHK-002 [P0] Validation + metadata are deferred to the parent session (validate.sh --strict, description.json, graph-metadata.json); this packet writes only the 5 spec docs.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-003 [P0] Phase 0 (Evidence & Contract) is defined as a HARD BLOCKER gating Phases 1-3 (REQ-001).
- [ ] CHK-004 [P0] The "Rust only if measured" gate is explicit and names "no Rust" as a valid outcome (REQ-002).
- [ ] CHK-005 [P1] The residency decomposition is recorded (native FTS5/SQLite vs JS-resident cosine/sort/RRF) so no perf claim double-counts native work.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Any future Rust follows sk-code/018 (TS shell + thin napi-rs adapter + `#![forbid(unsafe_code)]` core owning ONE kernel) (REQ-005).
- [ ] CHK-007 [P1] TS remains the shell (transport, legacy|shadow|persistent selection, flags, DB writes, publication, fallback).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Byte-for-byte parity vs the pinned TS oracle is required for every native/overlapping path (REQ-003).
- [ ] CHK-009 [P1] 1x/10x/100x replay fixtures + labeled relevance judgments are specified as Phase 0 deliverables (REQ-001).
- [ ] CHK-010 [P1] Approximation-contract tests (recall + exact fallback) are required for any ANN (REQ-006).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Phase 3 fixes the eligible-ID SQL-parameter shape (32,766-variable limit at ~25% eligibility) BEFORE any ANN (REQ-006).
- [ ] CHK-012 [P1] The two distinct "25%" figures are disambiguated (eligibility-vs-param-limit vs the p95-latency pilot trigger) so neither is conflated.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P0] Any Rust boundary keeps `#![forbid(unsafe_code)]` in core, owned boundary DTOs, and JS-controlled input never reaching unwrap/panic (REQ-005).
- [ ] CHK-014 [P1] Approximate ANN ships as a separately-versioned capability, never a silent swap of the exact path (REQ-003/006).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P0] spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md all present, Level 2, template-conformant.
- [ ] CHK-016 [P1] implementation-summary.md STATUS is PLANNED and links the 013 research grounding.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P0] All authored files live under `.opencode/specs/sk-design/015-styles-database-evolution/`; nothing outside is modified.
- [ ] CHK-018 [P1] No description.json / graph-metadata.json authored in this packet (parent finalizes metadata).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-019 [P0] All of REQ-001..006 are represented across the plan phases, tasks, and checklist.
- [ ] CHK-020 [P1] Every task (T001-T019) maps to a roadmap phase + at least one REQ and is PLANNED.
- [ ] CHK-021 [P1] The parity/rollback invariant (REQ-003) and the Rust-only-if-measured gate (REQ-002) are traceable from spec → plan → tasks → checklist.

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: N/A — planning packet; no items verified yet (this checklist gates future implementation phases, not this packet's own docs-only output)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
This is a PLANNING packet: every item above is intentionally [ ] unchecked.
-->
