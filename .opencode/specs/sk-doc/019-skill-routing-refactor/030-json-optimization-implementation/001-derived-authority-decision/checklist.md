---
title: "Checklist: Derived Schema Authority Decision"
description: "QA checklist for the derived-block canonical-schema-authority decision phase."
trigger_phrases:
  - "derived schema authority checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Derived Schema Authority Decision

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until this phase's analysis and ADR are executed and operator-reviewed.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Field-by-field reconciliation table covers every field present in either schema or on any live on-disk root [evidence: `plan.md` §3 reconciliation table]
- [ ] CHK-002 [P1] All lifecycle-subsystem files re-read in full before the ADR is drafted [evidence: `skill-derived-v2.ts`, `lib/derived/sync.ts`, `lib/lifecycle/schema-migration.ts`, `handlers/skill-graph/validate.ts` cited with file:line in `decision-record.md`]
- [ ] CHK-003 [P1] Zero production callers of `syncDerivedMetadata`/`backfillDerivedV2` confirmed by repo-wide grep, not assumed [evidence: grep output listing only `tests/`/`stress-test/` call sites]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] No code, schema, or generated JSON modified by this phase (decision-only; build deferred to phases 003/007/009) [evidence: `git status` shows only `001-derived-authority-decision/` additions]
- [ ] CHK-005 [P1] `decision-record.md` ADRs each carry an Alternatives Considered table with >=2 scored options and a Five Checks Evaluation table [evidence: ADR-001/ADR-002 sections in `decision-record.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-006 [P0] Recommended merged schema cross-checked against all 11 live `derived` blocks for zero data loss [evidence: field-coverage diff recorded in `decision-record.md` ADR-001 Implementation section]
- [ ] CHK-007 [P1] Every schema/field claim is falsifiable — cites `file:line` an implementer can re-run to confirm [evidence: `decision-record.md` evidence citations]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-008 [P1] Disposition recorded for every TS-schema-only field (`lifecycle_status`, `redirect_from`, `redirect_to`, `demotion`, `trust_lane`, `provenance_fingerprint`, `sanitizer_version`) — adopted, deferred, or dropped, each with rationale [evidence: `decision-record.md` ADR-002 field disposition table]
- [ ] CHK-009 [P1] Disposition recorded for `syncDerivedMetadata` and `backfillDerivedV2` (repurpose as regenerator entry point vs rewrite vs deprecate) [evidence: `decision-record.md` ADR-002 Decision section]
- [ ] CHK-010 [P2] Duplicate `intent_signals` (top-level `graph-metadata.json` field vs nested inside `derived` on 11/11 roots) flagged for a follow-up phase, not silently resolved here [evidence: `spec.md` §7 Open Questions]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-011 [P1] No credentials or proprietary data referenced in ADR evidence citations
- [ ] CHK-012 [P2] Sanitizer/anti-stuffing boundary behavior (`lib/derived/sanitizer.ts`) reviewed for whether authored-preserved fields need the same instruction-shape guard once adopted [evidence: `decision-record.md` ADR-002 Consequences]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-013 [P0] `decision-record.md` present with at least one ADR (anchor `adr-001`) [evidence: file present, anchor pair intact]
- [ ] CHK-014 [P1] `spec.md` Risks & Dependencies names phases 003/007/009 as blocked pending this decision [evidence: `spec.md` §6]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-015 [P1] All docs scoped under this phase folder only; no edits outside `001-derived-authority-decision/` [evidence: `git status`]
- [ ] CHK-016 [P2] No `description.json` / `graph-metadata.json` authored by this phase (orchestrator-generated, not hand-written here)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 0/3 |
| Field disposition | 3 | 0/3 |
| ADR structure | 2 | 0/2 |
| Documentation | 2 | 0/2 |

**Verification Date**: pending (Status: Planned)
<!-- /ANCHOR:summary -->
