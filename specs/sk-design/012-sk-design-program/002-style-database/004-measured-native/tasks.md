---
title: "Tasks: Measured Native Experiments (Roadmap Phase 2)"
description: "Task breakdown for the Roadmap Phase 2 native-candidate evaluations — entry-gate confirmation, three candidate evaluations, and the promote-or-reject verification pass."
trigger_phrases:
  - "measured native experiments tasks"
  - "entry gate candidate evaluation tasks"
  - "promote or reject no rust tasks"
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
# Tasks: Measured Native Experiments (Roadmap Phase 2)

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

**Task Format**: `T### Description [Roadmap Phase: PN \| REQ: REQ-NNN \| STATUS: PLANNED]` — no file-path segment; this is a planning-only packet with no runtime file targets

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm a named-stage SLO crossing exists against the Phase 0 oracle/telemetry — else STOP and record "no Rust" [Roadmap Phase: P2 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T002 Stand up the sk-code/018 shell/adapter/core harness plus a byte-parity replay against the Phase 0 oracle [Roadmap Phase: P2 | REQ: REQ-005 | STATUS: PLANNED]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Evaluate maintained sqlite-vec native exact vector search (Candidate A) [Roadmap Phase: P2 | REQ: REQ-002 | STATUS: PLANNED]
- [ ] T004 [P] Prototype the supervised Rust `ort` inference isolation sidecar (Candidate B) [Roadmap Phase: P2 | REQ: REQ-003 | STATUS: PLANNED]
- [ ] T005 [P] Evaluate a bounded Rust parse core, one kernel only (Candidate C) [Roadmap Phase: P2 | REQ: REQ-004 | STATUS: PLANNED]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Enforce end-to-end oracle win, byte-for-byte parity, and residency honesty on each evaluated candidate [Roadmap Phase: P2 | REQ: REQ-005, REQ-006 | STATUS: PLANNED]
- [ ] T007 Promote or reject each candidate, recording "no Rust" where applicable; confirm TS-shell invariants and `#![forbid(unsafe_code)]` [Roadmap Phase: P2 | REQ: REQ-005 | STATUS: PLANNED]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (deferred — conditional on a Phase 0 SLO crossing)
- [ ] No `[B]` blocked tasks remaining
- [ ] Byte-for-byte parity passing for any promoted candidate
- [ ] End-to-end oracle win passing for any promoted candidate
- [ ] "No Rust" recorded for every candidate that is not promoted, including the whole-phase case
- [ ] Checklist.md fully verified (metadata/validation finalized by the parent orchestrator)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
