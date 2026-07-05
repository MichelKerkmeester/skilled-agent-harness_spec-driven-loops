---
title: "Tasks: Code-Graph to Coverage-Graph Init Bridge"
description: "Completed task ledger for coverage-graph seeding from code graph and frontier slices."
trigger_phrases:
  - "code graph coverage bridge"
  - "coverage graph seed"
  - "empty coverage graph convergence"
  - "seed source coverage init"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/008-code-graph-coverage-bridge"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/upsert.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code-Graph to Coverage-Graph Init Bridge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the completed spec and capture coverage seeding requirements (`spec.md`).
- [x] T002 Identify context/review workflows, upsert CLI, and DB surfaces.
- [x] T003 [P] Confirm full review vocab expansion is out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add deep seeding before first context convergence check (`deep_context_auto.yaml`).
- [x] T005 Add `--seed-source` and `--seed-confidence` flags to seed upsert path (`upsert.cjs`).
- [x] T006 Persist `seed_source` and `seed_confidence` on seeded nodes (`coverage-graph-db.ts`).
- [x] T007 Add shallow review seeding before first convergence check (`deep_review_auto.yaml`).
- [x] T008 Log non-fatal warnings when seeding yields zero nodes or code graph is unavailable.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify seed nodes exist before first convergence check when code graph data is available.
- [x] T010 Verify seeded nodes carry seed metadata and non-seeded nodes do not.
- [x] T011 Verify unavailable code graph logs a warning and the loop continues.
- [x] T012 Update plan and task docs to reflect the completed bridge work (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
