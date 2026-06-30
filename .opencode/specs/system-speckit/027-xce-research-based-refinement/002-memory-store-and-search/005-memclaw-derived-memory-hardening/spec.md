---
title: "Feature Specification: Memclaw-Derived Memory Hardening (Phase Parent)"
description: "Phase parent for the caura-memclaw-derived Spec Kit Memory hardening program: provenance, idempotency, feedback reframe, tombstones/edges, stale audit, and MCP tool-ownership — UX-first and automation-first."
trigger_phrases:
  - "007 memclaw memory hardening"
  - "memory provenance source_kind"
  - "idempotency receipts memory"
  - "feedback reducer reframe 005"
  - "tombstone edge promotion"
  - "stale exclusion audit tool ownership"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold 007 phase-parent plus 5 children (plan only, no code)"
    next_safe_action: "Plan or implement child 001-provenance-and-audit"
    blockers: []
    key_files:
      - "001-provenance-and-audit/spec.md"
      - "002-idempotency-and-near-duplicate/spec.md"
      - "003-feedback-log-and-005-reframe/spec.md"
      - "004-tombstones-and-edge-promotion/spec.md"
      - "005-stale-audit-and-tool-ownership/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-010-scaffold-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Structure is a phase-parent with 5 phase-children (operator choice)."
      - "Number is 007 — final position in the contiguous 000-007 renumber."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Memclaw-Derived Memory Hardening (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh` independently before implementation begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Kit Memory system would benefit from a coherent set of write-safety and quality hardenings derived from a deep study of the caura-memclaw fleet-memory system (research in `../research/008-caura-memclaw-fleet-memory-teachings/`). The improvements are real but small and cross-cutting (provenance, idempotency, lifecycle correctness, a cautious feedback posture, and surface governance), and they land across the same memory-server code; without a parent control doc they would scatter as disconnected edits.

### Purpose
Coordinate the derived hardenings as independently executable child phases so each can be planned, implemented, and validated on its own, while the parent keeps the phase map, sequencing, and the two cross-cutting design priorities — **UX-first** (zero added friction; signals ride the existing MCP response envelope) and **automation-first** (every behavior fires from an existing hook/sweep/startup/doctor/pre-commit surface; no manual steps) — visible. The integration study (`../research/008-.../integration/`) found most substrate already exists, so this is incremental hardening, not new construction.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five derived hardening phases listed in the Phase Documentation Map, each as an independently executable child.
- The two cross-cutting priorities (UX-first, automation-first) and the architectural rule that write-path invariants split into pre-mutation guard / transactional writer / post-mutation hook.
- Coordination of the amendments that target existing children 002-005 (documented in the relevant child phase here, applied to those children when each is next planned).

### Out of Scope
- Implementation (this packet is scaffold + plan only; no code is changed).
- Any fleet / multi-tenant / cross-agent feature (ruled out as negative knowledge by the 008 research).
- Active learning-feedback reducers (deferred; see child 003).
- Detailed per-phase plans at the parent level.

### Files to Change
Summary of aggregate file scope for audit only. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.../mcp_server/lib/search/vector-index-schema.ts` | Modify | 001/002/004 | source_kind, receipt, tombstone, index columns |
| `.../mcp_server/handlers/save/**`, `memory-crud-update.ts`, `mutation-hooks.ts` | Modify | 001/002 | write-ingress guard, idempotency, audit |
| `.../mcp_server/lib/feedback/**` | Modify | 003 | reserve feedback types; keep shadow-only |
| `.../mcp_server/handlers/memory-crud-delete.ts`, `lib/storage/causal-edges.ts` | Modify | 004 | tombstone idempotence, edge skip-manual |
| `.../mcp_server/lib/search/hybrid-search.ts`, `tool-schemas.ts`, doctor/pre-commit | Modify | 005 | stale audit, tool-ownership lint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-provenance-and-audit/ | Explicit `source_kind`; auto-cannot-overwrite-manual/constitutional; automated-mutation audit (reuse `mutation_ledger`) | Complete |
| 2 | 002-idempotency-and-near-duplicate/ | Retry-safe idempotency receipts; advisory `near_duplicate_of`; `last_dedup_checked_at` marker | Complete |
| 3 | 003-feedback-log-and-005-reframe/ | Scope 008 to event-capture + diagnostics; reserve feedback types; defer active reducers; symmetric-damping + constitutional immunity | Complete |
| 4 | 004-tombstones-and-edge-promotion/ | First-timestamp-idempotent tombstones; active/purgeable index split; natural-key edge promotion that skips manual edges; entity≠causal | Complete |
| 5 | 005-stale-audit-and-tool-ownership/ | Read-only stale/status hard-exclusion audit; derived MCP tool-ownership lint via doctor + pre-commit | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-provenance-and-audit | 002-idempotency-and-near-duplicate | `source_kind` + manual-overwrite protection land; automated-mutation audit is append-only | 001 validation + write-path tests |
| 002-idempotency-and-near-duplicate | 003-feedback-log-and-005-reframe | Idempotency receipt replays identical retries; near-duplicate is advisory only | 002 validation + retry tests |
| 003-feedback-log-and-005-reframe | 004-tombstones-and-edge-promotion | Feedback types reserved; active reducers confirmed deferred/gated | 003 validation + ledger shadow-only evidence |
| 004-tombstones-and-edge-promotion | 005-stale-audit-and-tool-ownership | Tombstones first-timestamp-idempotent; auto edge promotion preserves manual edges | 004 validation + delete/edge tests |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the derived amendments to existing children 002-005 be folded into those child specs now, or only when each child is next planned (current default: when next planned)?
- Should any child be upgraded from Level 1 to Level 2 (add a formal checklist) before implementation?
- Numbering resolved: this packet is 007 in the contiguous 000-007 sequence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research + proposal**: `../research/008-caura-memclaw-fleet-memory-teachings/{research.md, sub-packet-proposals.md}`
- **Integration study**: `../research/008-caura-memclaw-fleet-memory-teachings/integration/{research.md, integration-plan.md}`
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
