---
title: "Tasks: Phase 010 Adjacent-Span Coalescing"
description: "Planned task breakdown for burden measurement, representation selection, local resolution, and strict fidelity verification."
trigger_phrases:
  - "adjacent-span-coalescing"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/010-adjacent-span-coalescing"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned representation-layer task breakdown."
    next_safe_action: "Execute T001 by recording the baseline corpus metrics."
    blockers:
      - "Alias category disclosure requires a privacy-policy decision."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a short wire alias schema disclose protected-value categories, and is that acceptable under the privacy policy?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 010 Adjacent-Span Coalescing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record token count, inflation, adjacency, and rejection baseline on the fixed corpus (`test/`)
- [ ] T002 Inventory canonical-map producers, provider-wire consumers, and restoration consumers (`src/fidelity/`, `src/providers/`)
- [ ] T003 Record the alias-disclosure privacy decision (`decision-record.md`)
- [ ] T004 Freeze canonical bytes, digests, ordinals, member order, category, and strict-rejection invariants (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the smallest approved versioned wire representation (`src/fidelity/`)
- [ ] T006 Preserve code, table, and structural-block boundaries (`src/fidelity/`)
- [ ] T007 Implement collision-safe local resolution to canonical markers (`src/fidelity/`)
- [ ] T008 Thread the representation through the provider request/response path only (`src/providers/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Measure baseline/final marker count and inflation (`test/`)
- [ ] T010 Prove canonical-map and restored-byte parity (`test/fidelity/`)
- [ ] T011 Run collision, unknown, duplicate, missing, changed, reorder, and fallback negatives (`test/fidelity/`)
- [ ] T012 Run syntax-boundary and privacy-disclosure fixtures (`test/`)
- [ ] T013 Run `npm run check` and strict packet validation (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All eight requirements and checklist blockers have observed evidence.
- [ ] Marker count and inflation improve on the fixed corpus.
- [ ] Canonical map, bytes, categories, and strict restoration remain unchanged.
- [ ] The privacy decision, package gate, and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
