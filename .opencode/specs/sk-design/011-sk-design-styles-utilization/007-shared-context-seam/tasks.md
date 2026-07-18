---
title: "Tasks: shared corpus-context seam"
description: "Run queue for building CORPUS_CONTEXT_PLAN v1, the common proof/handoff field set, and the five shared fixtures as a validator-backed schema package kept out of the sk-design hub. All items pending — scaffold only."
trigger_phrases:
  - "shared context seam tasks"
  - "corpus context plan tasks"
  - "sk-design shared fixtures tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/007-shared-context-seam"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the shared-context-seam Level-2 planning scaffold"
    next_safe_action: "Build CORPUS_CONTEXT_PLAN v1 envelope and shared proof fields"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-context-seam-011-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: shared corpus-context seam

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Define `CORPUS_CONTEXT_PLAN v1` with generic capability/proof planning and 0 hydrated styles (shared schema package).
- [ ] T002 Encode the fixed authority order and its six prohibitions in the schema (shared schema package).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Define the seven common proof/handoff fields once: generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, proof-state (shared schema package).
- [ ] T004 Represent proof-state so `anchor:null` and other negatives validate as successful evidence (shared schema package).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 [P] Author the five shared fixtures: positive, no-fit, unavailable, generation-mismatch, unknown-rights (shared fixtures).
- [ ] T006 Build the validator that rejects mode-specific fields and keeps the hub routing-only (shared validator).
- [ ] T007 [B] Wire the hub intake/registry route to emit the envelope — blocked on phase 004 retrieval output (hub route).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `CORPUS_CONTEXT_PLAN v1` validates with 0 hydrated styles
- [ ] Seven common proof/handoff fields defined once and reused
- [ ] Five shared fixtures validate; negatives pass as successful evidence
- [ ] Fixed authority order enforced; hub stays routing-only
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: ../spec.md
<!-- /ANCHOR:cross-refs -->
