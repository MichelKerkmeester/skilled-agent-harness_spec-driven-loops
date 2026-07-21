---
title: "Checklist: Growth Architecture (10x-100x Scale)"
description: "Verification checklist for Roadmap Phase 3 of the sk-design styles-database evolution. All items are unchecked; this is a PLANNED packet and verification is deferred to the phase that executes the work."
trigger_phrases:
  - "growth architecture styles database 10x 100x scale"
  - "eligible-id sql parameter limit hnsw ann"
  - "approximate search contract exact fallback rust"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/004-growth"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author 004-growth Level 2 spec-folder docs"
    next_safe_action: "Await measured 10x-100x corpus-growth pressure before starting Phase A (SQL-parameter"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Growth Architecture (10x-100x Scale)

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

- [ ] CHK-001 [P0] Growth entry gate: measured 10x-100x corpus growth pressure cited as the trigger for every Phase 3 item
- [ ] CHK-002 [P0] Requirements documented in spec.md
- [ ] CHK-003 [P1] Predecessor phase (003-measured-native) exit evidence and the growth-gate dependency identified

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] SQL-parameter correctness fix sequenced FIRST, before any ANN work
- [ ] CHK-005 [P1] The two distinct "25%" figures (SQL eligibility ceiling vs. p95-latency pilot trigger) are explicitly disambiguated
- [ ] CHK-006 [P1] Recall is filter-aware for any maintained ANN

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Approximation contract: any ANN ships separately-versioned with exact re-score + exact fallback
- [ ] CHK-008 [P0] No silent swap of the exact path
- [ ] CHK-009 [P1] Custom Rust ANN scoped as last-resort only, for a proven capability gap

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P0] N/A — planning packet, not a bug fix; no findings, producer/consumer inventories, or adversarial fix tests apply here

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P0] Shared cross-skill Rust core requires spec-memory as a real second consumer; system-code-graph explicitly excluded
- [ ] CHK-012 [P1] Any future Rust boundary is scoped to follow sk-code/018 safety conventions (`#![forbid(unsafe_code)]`)

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P0] Docs authored at Level 2 (spec/plan/tasks/checklist/implementation-summary)
- [ ] CHK-014 [P1] Nothing in this phase triggers at the current ~1,290-bundle scale, documented explicitly

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P0] Scope lock respected: only 004-growth spec-folder docs written, no other files touched
- [ ] CHK-016 [P0] Metadata/validation (description.json, graph-metadata.json, validate.sh --strict) deferred to the parent session

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending — parent session runs `validate.sh --strict` after this packet's docs land

<!-- /ANCHOR:summary -->
