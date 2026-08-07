---
title: "JS Capability Features (Roadmap Phase 1)"
description: "Level 2 task breakdown (T001-T010) for Roadmap Phase 1 of the sk-design styles-database evolution: setup, implementation, and verification tasks, all PLANNED."
trigger_phrases:
  - "js capability features tasks"
  - "styles db phase 1 task breakdown planned"
  - "layout fingerprint screenshot dedupe watcher tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/003-js-capabilities"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec-folder docs (spec/plan/tasks/checklist/implementation-summary) for"
    next_safe_action: "Plan and build 001-foundation (Phase 0) first; 002-js-capabilities remains PLANNED until Phase"
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

# Tasks: JS Capability Features (Roadmap Phase 1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [Roadmap Phase: PN | REQ: REQ-NNN | STATUS: PLANNED]` — no file-path segment; this is a planning packet with no code files to reference yet

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm Phase 0 entry gate present — manifest, stage telemetry, pinned TS differential oracle, fixtures, and relevance judgments all shipped [Roadmap Phase: P1 | REQ: REQ-007 | STATUS: PLANNED]
- [ ] T002 Define shadow/flag scaffolding shared by all five Phase 1 lanes [Roadmap Phase: P1 | REQ: REQ-007 | STATUS: PLANNED]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Feature Track
- [ ] T003 [P] DOM-derived responsive layout fingerprints across 5 viewports [Roadmap Phase: P1 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T004 [P] Screenshot palette/statistics + pHash near-duplicate dedupe via sharp/libvips [Roadmap Phase: P1 | REQ: REQ-002 | STATUS: PLANNED]
- [ ] T005 [P] Shadow multimodal (text+image/CLIP) retrieval lane over onnxruntime-node [Roadmap Phase: P1 | REQ: REQ-003 | STATUS: PLANNED]
- [ ] T006 [P] Batched embedding queue replacing per-call draining [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED]
- [ ] T007 [P] Chokidar auto-reindex watcher + periodic reconciliation, reconciliation authoritative [Roadmap Phase: P1 | REQ: REQ-005 | STATUS: PLANNED]

### Optional Track
- [ ] T008 [B] Optional parsed-projection cache — build only if Phase 0 cold-build telemetry proves value [Roadmap Phase: P1 | REQ: REQ-006 | STATUS: PLANNED]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Measure parity where each lane overlaps an existing output, against Phase 0 telemetry [Roadmap Phase: P1 | REQ: REQ-007 | STATUS: PLANNED]
- [ ] T010 Confirm zero default-path regression and zero Rust anywhere in this phase [Roadmap Phase: P1 | REQ: REQ-007 | STATUS: PLANNED]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 0 entry gate confirmed before T003-T008 begin
- [ ] All five feature-track tasks (T003-T007) shipped behind shadow/flag with parity where overlapping
- [ ] T008 either shipped (positive telemetry) or explicitly deferred with reason recorded
- [ ] T009/T010 verification tasks pass with zero regression and zero Rust
- [ ] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
